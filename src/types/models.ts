/**
 * Model Registry Types
 * Represents registered AI models, their multi-dimensional metrics (cost, speed, quality),
 * priority hierarchies, operating limits, and connection state.
 */

import { ProviderLimits, ProviderType } from './providers';

export type SpeedRating = 'ultra-fast' | 'fast' | 'balanced' | 'slow';
export type QualityRating = 'economy' | 'standard' | 'cinematic' | 'master';

export interface ProviderModel {
  id: string;
  provider: string; // e.g. 'Image Provider A', 'Video Provider A'
  model: string;
  displayName: string;
  type: ProviderType;
  capabilities: string[];
  enabled: boolean;
  connected?: boolean; // In Phase 1: all placeholder providers are disconnected (false)
  priority: number; // 1 (highest) to 10 (lowest)
  fallbackPriority: number; // Order to switch to if primary fails (1 to 10)
  cost: {
    unit: 'token' | 'second' | 'image' | 'minute';
    priceUsd: number;
    description: string;
  };
  speed: SpeedRating;
  speedMsAvg: number;
  quality: QualityRating;
  limits: ProviderLimits;
  description: string;
  releaseDate?: string;
  isCustomAdapter?: boolean;
}

export interface ModelFilterCriteria {
  type?: ProviderType;
  provider?: string;
  enabledOnly?: boolean;
  minQuality?: QualityRating;
  maxSpeed?: SpeedRating;
  maxCostUsd?: number;
}
