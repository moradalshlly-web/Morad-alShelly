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
  preview?: string; // audio sample url, image url, or visual representation
  metadata: T;
  recommended: boolean; // Marked as "اقتراح Moro"
  recommendationReason?: string; // e.g. "قد يكون الأنسب لهذا المشروع" / "أقترحه لأنه يتناسب أكثر مع النبرة السينمائية"
  recommendationReasonAr?: string;
  status: 'ready' | 'generating' | 'rejected';
  selected: boolean;
}

// 1. Voice Option Metadata
export interface VoiceOptionMetadata {
  voiceName: string;
  genderStyle: string; // e.g. 'Deep Baritone', 'Warm Mezzo', 'Synthetic Neutral', 'Narrative Gravel'
  ageStyle: string; // e.g. 'Mature (35-45)', 'Youthful (20-30)', 'Ageless Synthetic'
  energy: 'Intimate' | 'Calm' | 'Medium' | 'High' | 'Dramatic';
  deliveryStyle: string; // e.g. 'Slow cinematic cadence', 'Urgent whispered narration', 'Authoritative documentary'
  sampleWaveform?: number[]; // Mock amplitude data for waveform visualization
  previewAudioSnippet?: string;
  accent?: string;
}

// 2. Tone Option Metadata
export interface ToneOptionMetadata {
  toneName: string;
  intensity: 'Subtle' | 'Balanced' | 'High' | 'Dramatic';
  emotionalPacing: string;
  characteristics: string[];
  colorPaletteDescription?: string;
  accentColorHex?: string;
}

// 3. Scene Concept Option Metadata
export interface SceneOptionMetadata {
  sceneTitle: string;
  shortDescription: string;
  environment: string;
  characters: string[];
  cameraDirection: string;
  lighting: string;
  mood: string;
  suggestedDurationSeconds: number;
  previewImageUrl?: string;
}

// 4. Image Visual Option Metadata
export interface ImageOptionMetadata {
  style: string; // e.g. 'Anamorphic 35mm Realism', 'Graphic Anime Keyframe', 'Neo-Noir Matte Painting'
  composition: string; // e.g. 'Golden ratio wide shot with central silhouette'
  lighting: string; // e.g. 'Volumetric cyan moonlight with amber rim'
  camera: string; // e.g. 'ARRI Alexa 65, 35mm anamorphic prime lens, T1.8'
  aspectRatio: string;
  previewImageUrl: string;
  seedPrompt: string;
}

// Generic Creative Decision Container
export interface CreativeDecision<T = Record<string, unknown>> {
  category: CreativeCategory;
  categoryLabelEn: string;
  categoryLabelAr: string;
  options: CreativeOption<T>[]; // Exactly 3 options: Option 1, Option 2, Option 3
  selectedOptionId: string;
  recommendedOptionId?: string;
  userModified?: boolean;
  generationStatus: 'idle' | 'generating' | 'ready' | 'error';
  moroDialogue?: {
    text: string;
    textAr: string;
    reason?: string;
    reasonAr?: string;
  };
}

export interface ProjectCreativeDecisions {
  voice: CreativeDecision<VoiceOptionMetadata>;
  tone: CreativeDecision<ToneOptionMetadata>;
  scene: CreativeDecision<SceneOptionMetadata>;
  image: CreativeDecision<ImageOptionMetadata>;
  [customCategory: string]: CreativeDecision<any>;
}

// Multi-Format Input & File Upload Architecture
export type SupportedFileExtension = 'pdf' | 'txt' | 'docx' | 'png' | 'jpg' | 'jpeg' | 'webp' | string;

export interface UploadedInputFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  extension: SupportedFileExtension;
  previewUrl?: string; // For images
  extractedTextSummary?: string; // Extracted / parsed text snippet
  uploadTimestamp: string;
}

export interface MultiFormatInputPayload {
  rawText: string;
  uploadedFiles: UploadedInputFile[];
  userPerspectiveDescription?: string; // Non-mandatory user perspective
  selectedStyle: 'cinematic' | 'anime' | 'cartoon' | 'realistic' | 'hyper-real' | 'custom';
  targetDurationSeconds: number;
  aspectRatio: '16:9' | '9:16' | '1:1' | '2.39:1';
}

// Content Understanding Stages
export type ContentUnderstandingStage =
  | 'idle'
  | 'analyzing' // Analyzing content
  | 'understanding' // Understanding context
  | 'preparing' // Preparing creative options
  | 'ready'; // Ready

export interface ContentUnderstandingAnalysis {
  stage: ContentUnderstandingStage;
  progressPercent: number;
  extractedTheme: string;
  extractedContext: string;
  detectedEntities: string[];
  suggestedTone: string;
  suggestedFormat: string;
  directorNotesSummary: string;
}
