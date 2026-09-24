/**
 * Moro AI Router
 * Orchestrates intelligent multi-provider routing across models based on:
 * - Task modality (text, image, video, voice, dubbing, etc.)
 * - User optimization preference (highest-quality, lowest-latency, lowest-cost, balanced)
 * - Required capabilities
 * - Model priority and fallback priority
 * - Provider availability
 * - Automatic cascading fallback if a provider or model fails
 */

import {
  ExecutionFallbackEvent,
  OptimizationPreference,
  RouteRequest,
  RouteResolution,
  RouterExecutionResult,
  RoutingCandidateScore,
} from '../../types/ai-router';
import { ProviderModel, QualityRating, SpeedRating } from '../../types/models';
import { INITIAL_MODEL_REGISTRY } from './ModelRegistry';
import { providerRegistry } from '../providers';

export class AIRouter {
  private models: ProviderModel[] = [...INITIAL_MODEL_REGISTRY];
  private failedProviderCooloff: Map<string, number> = new Map(); // provider -> expiry timestamp

  constructor(customModels?: ProviderModel[]) {
    if (customModels && customModels.length > 0) {
      this.models = customModels;
    }
  }

  updateModels(models: ProviderModel[]) {
    this.models = models;
  }

  getModels(): ProviderModel[] {
    return [...this.models];
  }

  /**
   * Evaluates and ranks all candidate models for a given task.
   */
  resolveRoute(request: RouteRequest): RouteResolution {
    const preference: OptimizationPreference = request.preference || 'balanced';

    // 1. Filter eligible candidates
    let candidates = this.models.filter((m) => {
      if (!m.enabled) return false;
      if (m.type !== request.task) return false;

      // Exclude temporary cooled-off or explicitly excluded providers
      if (request.excludeProviders && request.excludeProviders.includes(m.provider)) return false;

      const cooloffTime = this.failedProviderCooloff.get(m.provider);
      if (cooloffTime && cooloffTime > Date.now()) return false;

      // Required capabilities check
      if (request.requiredCapabilities && request.requiredCapabilities.length > 0) {
        const hasAllCaps = request.requiredCapabilities.every((cap) =>
          m.capabilities.includes(cap)
        );
        if (!hasAllCaps) return false;
      }

      return true;
    });

    if (candidates.length === 0) {
      // Emergency fallback: include any enabled model matching the task
      candidates = this.models.filter((m) => m.type === request.task && m.enabled);
      if (candidates.length === 0) {
        throw new Error(`No available models registered for task: "${request.task}"`);
      }
    }

    // 2. Score candidates based on strategy weights
    const scoredCandidates: RoutingCandidateScore[] = candidates.map((model) => {
      const qScore = this.calcQualityScore(model.quality);
      const sScore = this.calcSpeedScore(model.speed);
      const cScore = this.calcCostScore(model.cost.priceUsd, model.type);
      const pScore = Math.max(0, 100 - model.priority * 10);
      const aScore = 100; // availability factor

      let totalScore = 0;
      let reason = '';

      switch (preference) {
        case 'highest-quality':
          totalScore = qScore * 0.55 + pScore * 0.2 + sScore * 0.15 + cScore * 0.1;
          reason = `Prioritized maximum cinematic fidelity (${model.quality})`;
          break;
        case 'lowest-latency':
          totalScore = sScore * 0.55 + pScore * 0.2 + qScore * 0.15 + cScore * 0.1;
          reason = `Prioritized lowest latency (${model.speed})`;
          break;
        case 'lowest-cost':
          totalScore = cScore * 0.55 + pScore * 0.2 + qScore * 0.15 + sScore * 0.1;
          reason = `Prioritized lowest infrastructure cost ($${model.cost.priceUsd})`;
          break;
        case 'balanced':
        default:
          totalScore = qScore * 0.35 + sScore * 0.25 + cScore * 0.2 + pScore * 0.2;
          reason = `Balanced optimal trade-off between quality, speed, and budget`;
          break;
      }

      // If user preferred a specific model, give it a substantial boost
      if (request.preferredModelId && model.id === request.preferredModelId) {
        totalScore += 50;
        reason = `Selected via user model preference`;
      }

      return {
        model,
        totalScore: Math.round(totalScore * 10) / 10,
        qualityScore: qScore,
        speedScore: sScore,
        costScore: cScore,
        priorityScore: pScore,
        availabilityScore: aScore,
        reason,
      };
    });

    // 3. Sort candidates descending by total score
    scoredCandidates.sort((a, b) => b.totalScore - a.totalScore);

    const selectedModel = scoredCandidates[0].model;

    // Build fallback chain ordered by fallbackPriority and secondarily by candidate score
    const fallbackChain = scoredCandidates
      .slice(1)
      .map((c) => c.model)
      .sort((a, b) => a.fallbackPriority - b.fallbackPriority);

    return {
      selectedModel,
      fallbackChain,
      candidateScores: scoredCandidates,
      routingTimestamp: new Date().toISOString(),
      strategyUsed: preference,
    };
  }

  /**
   * Executes a job through the routed provider with automated cascading fallback.
   * If the primary provider fails, immediately attempts the next provider in the fallback chain.
   */
  async executeWithFallback<T>(
    request: RouteRequest,
    action: (model: ProviderModel) => Promise<T>
  ): Promise<RouterExecutionResult<T>> {
    const resolution = this.resolveRoute(request);
    const attemptChain = [resolution.selectedModel, ...resolution.fallbackChain];
    const fallbackEvents: ExecutionFallbackEvent[] = [];
    const startTime = performance.now();

    for (let i = 0; i < attemptChain.length; i++) {
      const activeModel = attemptChain[i];
      try {
        const data = await action(activeModel);
        const totalLatencyMs = Math.round(performance.now() - startTime);

        return {
          success: true,
          data,
          selectedModel: activeModel,
          fallbackEvents,
          totalLatencyMs,
          costIncurredUsd: activeModel.cost.priceUsd,
        };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown provider error';
        const nextModel = attemptChain[i + 1];

        // Mark short cool-off for failing provider
        this.failedProviderCooloff.set(activeModel.provider, Date.now() + 60000);

        if (nextModel) {
          fallbackEvents.push({
            failedModelId: activeModel.id,
            failedProvider: activeModel.provider,
            error: errorMsg,
            attemptNumber: i + 1,
            timestamp: new Date().toISOString(),
            switchedToModelId: nextModel.id,
          });
        } else {
          // Last model in chain failed
          return {
            success: false,
            error: `All providers in fallback chain exhausted. Final error: ${errorMsg}`,
            selectedModel: activeModel,
            fallbackEvents,
            totalLatencyMs: Math.round(performance.now() - startTime),
            costIncurredUsd: 0,
          };
        }
      }
    }

    throw new Error('Router execution completed without resolution.');
  }

  private calcQualityScore(rating: QualityRating): number {
    switch (rating) {
      case 'master':
        return 100;
      case 'cinematic':
        return 85;
      case 'standard':
        return 65;
      case 'economy':
        return 45;
    }
  }

  private calcSpeedScore(speed: SpeedRating): number {
    switch (speed) {
      case 'ultra-fast':
        return 100;
      case 'fast':
        return 80;
      case 'balanced':
        return 60;
      case 'slow':
        return 40;
    }
  }

  private calcCostScore(priceUsd: number, task: string): number {
    // Relative scaling based on typical unit costs
    if (priceUsd === 0) return 100;
    if (priceUsd < 0.0001) return 95;
    if (priceUsd < 0.01) return 85;
    if (priceUsd < 0.03) return 70;
    if (priceUsd < 0.06) return 50;
    return 30;
  }
}

export const aiRouter = new AIRouter();
