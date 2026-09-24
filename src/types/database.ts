/**
 * Database Entity Schemas
 * Designed for clean mapping to PostgreSQL / Supabase tables,
 * with standard IDs, foreign keys, timestamps, and JSONB payloads.
 */

import { ProviderType } from './providers';
import { QualityRating, SpeedRating } from './models';
import { MultiFormatInputPayload, ProjectCreativeDecisions } from './creative-options';
import { ProjectSource, MoroProjectContext } from './core';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'creator' | 'director' | 'producer' | 'admin';
  tier: 'free' | 'pro' | 'studio' | 'enterprise';
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'draft' | 'scripting' | 'storyboarding' | 'generating' | 'review' | 'completed' | 'archived';

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  genre: string;
  style: 'cinematic' | 'anime' | 'cartoon' | 'realistic' | 'hyper-real' | 'custom';
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3' | '2.39:1';
  targetDurationSeconds: number;
  coverImageUrl?: string;
  tags: string[];
  totalScenes: number;
  originalInput?: MultiFormatInputPayload;
  userPerspectiveDescription?: string;
  creativeDecisions?: ProjectCreativeDecisions;
  // Moro Core: first-class sources + the shared project understanding context
  // that every current and future module reads from.
  sources?: ProjectSource[];
  moroContext?: MoroProjectContext;
  selectedVoice?: string;
  selectedTone?: string;
  selectedImages?: string[];
  createdAt: string;
  updatedAt: string;
}

export type AssetType = 'image' | 'video' | 'audio' | 'voice' | 'character' | 'script' | 'scene' | 'document';

export interface Asset {
  id: string;
  projectId: string;
  userId: string;
  name: string;
  type: AssetType;
  mimeType: string;
  fileSize: number;
  storageUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  durationSeconds?: number;
  width?: number;
  height?: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterReferenceImage {
  id: string;
  url: string;
  label: string; // e.g. 'Front close-up', 'Profile', 'Full body', 'Costume A'
  isPrimary: boolean;
}

export interface CharacterVoiceProfile {
  providerId: string;
  modelId: string;
  voiceId: string;
  sampleAudioUrl?: string;
  pitch: number;
  speed: number;
  stability: number;
}

export interface Character {
  id: string;
  projectId: string;
  userId: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'narrator' | 'cameo';
  description: string;
  visualTraits: {
    age?: string;
    hair?: string;
    eyes?: string;
    clothing?: string;
    distinguishingMarks?: string;
    ethnicityOrOrigin?: string;
  };
  personality: string;
  style: string;
  consistencySeed?: number;
  referenceImages: CharacterReferenceImage[];
  voiceProfile?: CharacterVoiceProfile;
  createdAt: string;
  updatedAt: string;
}

export interface SceneOption {
  optionId: 'option-1' | 'option-2' | 'option-3';
  label: string;
  visualPrompt: string;
  previewUrl?: string;
  voiceoverAudioUrl?: string;
  motionDescription?: string;
  cameraAngle?: string;
  lighting?: string;
  isCurrentSelection: boolean;
  status: 'draft' | 'ready' | 'generating' | 'rejected';
}

export interface Scene {
  id: string;
  projectId: string;
  sequenceIndex: number;
  title: string;
  scriptText: string;
  durationSeconds: number;
  characterIds: string[];
  environment: string;
  mood: string;
  cameraMovement: string;
  soundDesignNotes?: string;
  options: SceneOption[];
  activeOptionIndex: number; // 0 for option 1, 1 for option 2, 2 for option 3
  createdAt: string;
  updatedAt: string;
}

export interface Generation {
  id: string;
  projectId: string;
  sceneId?: string;
  userId: string;
  type: ProviderType;
  prompt: string;
  negativePrompt?: string;
  providerUsed: string;
  modelUsed: string;
  parameters: Record<string, unknown>;
  outputs: Array<{
    optionIndex: number;
    url: string;
    type: string;
    metadata?: Record<string, unknown>;
  }>;
  selectedOutputIndex?: number;
  costUsd: number;
  latencyMs: number;
  createdAt: string;
}

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface GenerationJob {
  id: string;
  projectId: string;
  userId: string;
  type: ProviderType;
  status: JobStatus;
  progressPercent: number;
  currentStage: string;
  error?: string;
  modelId: string;
  provider: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Settings {
  id: string;
  userId: string;
  defaultPreference: 'balanced' | 'highest-quality' | 'lowest-latency' | 'lowest-cost';
  defaultResolution: '1080p' | '4k' | '720p';
  defaultAspectRatio: '16:9' | '9:16' | '1:1';
  autoFallbackEnabled: boolean;
  maxCostPerProjectAlertUsd: number;
  configuredApiKeys: Record<string, boolean>; // providerSlug -> isConfigured on server (never exposing actual secrets to client)
  theme: 'dark' | 'cinematic-obsidian';
  exportBitrateMbps: number;
  createdAt: string;
  updatedAt: string;
}
