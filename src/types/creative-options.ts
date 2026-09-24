/**
 * Creative Options & Multi-Format Creative Architecture
 * Core types for Moro AI's 3-Option Creative System,
 * Multi-Format Input ingestion, Content Understanding, and Creative Decisions.
 */

export type CreativeCategory =
  | 'voice'
  | 'tone'
  | 'scene'
  | 'image'
  | 'video'
  | 'music'
  | 'character'
  | 'style'
  | 'camera'
  | 'lighting'
  | string;

export interface CreativeOption<T = Record<string, unknown>> {
  id: string;
  title: string;
  description: string;
  preview?: string;
  metadata: T;
  recommended: boolean;
  recommendationReason?: string;
  recommendationReasonAr?: string;
  status: 'ready' | 'generating' | 'rejected';
  selected: boolean;
}

export interface VoiceOptionMetadata { voiceName: string; genderStyle: string; ageStyle: string; energy: 'Intimate' | 'Calm' | 'Medium' | 'High' | 'Dramatic'; deliveryStyle: string; sampleWaveform?: number[]; previewAudioSnippet?: string; accent?: string; }
export interface ToneOptionMetadata { toneName: string; intensity: 'Subtle' | 'Balanced' | 'High' | 'Dramatic'; emotionalPacing: string; characteristics: string[]; colorPaletteDescription?: string; accentColorHex?: string; }
export interface SceneOptionMetadata { sceneTitle: string; shortDescription: string; environment: string; characters: string[]; cameraDirection: string; lighting: string; mood: string; suggestedDurationSeconds: number; previewImageUrl?: string; }
export interface ImageOptionMetadata { style: string; composition: string; lighting: string; camera: string; aspectRatio: string; previewImageUrl: string; seedPrompt: string; }

export interface CreativeDecision<T = Record<string, unknown>> {
  category: CreativeCategory;
  categoryLabelEn: string;
  categoryLabelAr: string;
  options: CreativeOption<T>[];
  selectedOptionId: string;
  recommendedOptionId?: string;
  userModified?: boolean;
  generationStatus: 'idle' | 'generating' | 'ready' | 'error' | 'rejected';
  moroDialogue?: { text: string; textAr: string; reason?: string; reasonAr?: string };
}

export interface ProjectCreativeDecisions {
  voice: CreativeDecision<VoiceOptionMetadata>;
  tone: CreativeDecision<ToneOptionMetadata>;
  scene: CreativeDecision<SceneOptionMetadata>;
  image: CreativeDecision<ImageOptionMetadata>;
  [customCategory: string]: CreativeDecision<any>;
}

export type SupportedFileExtension = 'pdf' | 'txt' | 'docx' | 'png' | 'jpg' | 'jpeg' | 'webp' | string;
export interface UploadedInputFile { id: string; name: string; size: number; mimeType: string; extension: SupportedFileExtension; previewUrl?: string; extractedTextSummary?: string; uploadTimestamp: string; }
export interface MultiFormatInputPayload { rawText: string; uploadedFiles: UploadedInputFile[]; userPerspectiveDescription?: string; selectedStyle: 'cinematic' | 'anime' | 'cartoon' | 'realistic' | 'hyper-real' | 'custom'; targetDurationSeconds: number; aspectRatio: '16:9' | '9:16' | '1:1' | '2.39:1'; }
export type ContentUnderstandingStage = 'idle' | 'analyzing' | 'understanding' | 'preparing' | 'ready';
export interface ContentUnderstandingAnalysis { stage: ContentUnderstandingStage; progressPercent: number; extractedTheme: string; extractedContext: string; detectedEntities: string[]; suggestedTone: string; suggestedFormat: string; directorNotesSummary: string; }
