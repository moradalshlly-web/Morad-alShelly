/**
 * Moro AI 12-Stage Creative Pipeline
 * Main architectural orchestration workflow:
 * Input → Content Understanding → Context Detection → Tone Detection →
 * Content Type → Script → Scenes → Characters → Voice → Visuals →
 * Generation → Review → Export
 */

export type PipelineStage =
  | 'input'
  | 'content-understanding'
  | 'context-detection'
  | 'tone-detection'
  | 'content-type'
  | 'script'
  | 'scenes'
  | 'characters'
  | 'voice'
  | 'visuals'
  | 'generation'
  | 'review'
  | 'export';

export type PipelineStageStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';

export interface PipelineStageInfo {
  stage: PipelineStage;
  title: string;
  description: string;
  status: PipelineStageStatus;
  progressPercent: number;
  outputSummary?: string;
  data?: Record<string, unknown>;
  error?: string;
}

export interface PipelineInputPayload {
  rawPrompt?: string;
  sourceText?: string;
  referenceImages?: string[];
  referenceAudioUrl?: string;
  targetDurationSeconds?: number;
  targetPlatform?: 'youtube' | 'tiktok' | 'instagram' | 'cinema' | 'commercial';
  userNotes?: string;
}

export interface ContentUnderstandingResult {
  coreTheme: string;
  narrativeSummary: string;
  detectedEntities: string[];
  semanticKeywords: string[];
  complexityScore: number;
}

export interface ContextDetectionResult {
  genre: string;
  temporalSetting: string; // e.g., 'Cyberpunk 2099', 'Medieval Fantasy', 'Modern Urban'
  spatialSetting: string;
  culturalContext?: string;
  targetAudience: string;
}

export interface ToneDetectionResult {
  primaryTone: 'cinematic' | 'melancholy' | 'epic' | 'playful' | 'suspenseful' | 'inspirational' | 'eerie';
  secondaryTone?: string;
  emotionalArc: Array<{ point: number; emotion: string; intensity: number }>;
  pacing: 'slow-burn' | 'dynamic' | 'frenetic' | 'rhythmic';
}

export interface ContentTypeResult {
  format: 'short-form-narrative' | 'commercial-spot' | 'mini-documentary' | 'music-video' | 'explainer' | 'trailer';
  suggestedDurationSeconds: number;
  suggestedSceneCount: number;
  visualStyle: string;
}

export interface PipelineState {
  projectId: string;
  currentStage: PipelineStage;
  stages: Record<PipelineStage, PipelineStageInfo>;
  isProcessing: boolean;
  startedAt?: string;
  updatedAt?: string;
}
