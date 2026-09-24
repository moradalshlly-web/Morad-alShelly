/**
 * AI Router Types
 * Defines routing criteria, scoring policies, routing decision logs,
 * and fallback execution chains.
 */

import { ProviderModel, QualityRating, SpeedRating } from './models';
import { ProviderType } from './providers';

export type OptimizationPreference = 'balanced' | 'highest-quality' | 'lowest-latency' | 'lowest-cost';

export interface RouteRequest {
  task: ProviderType;
  requiredCapabilities?: string[];
  preference?: OptimizationPreference;
  minQuality?: QualityRating;
  maxSpeed?: SpeedRating;
  maxBudgetUsd?: number;
  excludeProviders?: string[];
  preferredModelId?: string;
  metadata?: Record<string, unknown>;
}

export interface RoutingCandidateScore {
  model: ProviderModel;
  totalScore: number;
  qualityScore: number;
  speedScore: number;
  costScore: number;
  priorityScore: number;
  availabilityScore: number;
  reason: string;
}

export interface RouteResolution {
  selectedModel: ProviderModel;
  fallbackChain: ProviderModel[];
  candidateScores: RoutingCandidateScore[];
  routingTimestamp: string;
  strategyUsed: OptimizationPreference;
}

export interface ExecutionFallbackEvent {
  failedModelId: string;
  failedProvider: string;
  error: string;
  attemptNumber: number;
  timestamp: string;
  switchedToModelId: string;
}

export interface RouterExecutionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  selectedModel: ProviderModel;
  fallbackEvents: ExecutionFallbackEvent[];
  totalLatencyMs: number;
  costIncurredUsd: number;
}
