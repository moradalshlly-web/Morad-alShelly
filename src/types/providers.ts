/**
 * Moro AI Orchestration Architecture - Provider Interfaces
 * Core abstraction layer allowing plug-and-play AI providers
 * without tying the application to any single provider.
 */

export type ProviderType =
  | 'text'
  | 'image'
  | 'video'
  | 'voice'
  | 'dubbing'
  | 'translation'
  | 'music'
  | 'speech-to-text'
  | 'proofreading';

export type ProviderStatus = 'online' | 'degraded' | 'offline' | 'unconfigured';

export interface ProviderCapability {
  id: string;
  name: string;
  description: string;
  supportedModalities: string[];
  maxTokens?: number;
  maxResolution?: string;
  maxDurationSeconds?: number;
  supportedLanguages?: string[];
}

export interface ProviderLimits {
  rateLimitPerMinute: number;
  maxConcurrentJobs: number;
  maxBatchSize: number;
  tokenContextWindow?: number;
  timeoutMs: number;
}

export interface ProviderCostMetric {
  inputPer1kUnits: number; // e.g. USD per 1k units
  outputPer1kUnits: number;
  currency: 'USD' | 'EUR' | 'CREDITS';
}

export interface ProviderHealthCheckResult {
  status: ProviderStatus;
  latencyMs: number;
  timestamp: string;
  errorMessage?: string;
}

/**
 * Base AI Provider interface that all specialized media adapters must implement.
 */
export interface AIProvider {
  readonly id: string;
  readonly name: string;
  readonly providerSlug: string; // e.g., 'image-provider-a', 'proofreading-provider-a'
  readonly supportedTypes: ProviderType[];
  readonly version: string;

  isConfigured(): boolean;
  checkHealth(): Promise<ProviderHealthCheckResult>;
}

// -----------------------------------------------------------------------------
// Specialized Provider Interfaces
// -----------------------------------------------------------------------------

export interface TextGenerationOptions {
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  stopSequences?: string[];
}

export interface TextGenerationResult {
  text: string;
  tokensUsed: { prompt: number; completion: number; total: number };
  modelUsed: string;
  provider: string;
  executionTimeMs: number;
}

export interface TextProvider extends AIProvider {
  generateText(prompt: string, options?: TextGenerationOptions): Promise<TextGenerationResult>;
}

export interface ImageGenerationOptions {
  model: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
  negativePrompt?: string;
  stylePreset?: string;
  seed?: number;
  characterReferenceUrls?: string[];
  styleReferenceUrls?: string[];
  count?: number; // Moro AI 3-option system requests 3 candidates
}

export interface ImageCandidate {
  id: string;
  url: string;
  seed: number;
  aspectRatio: string;
  metadata?: Record<string, unknown>;
}

export interface ImageGenerationResult {
  candidates: ImageCandidate[];
  provider: string;
  modelUsed: string;
  executionTimeMs: number;
}

export interface ImageProvider extends AIProvider {
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult>;
}

export interface VideoGenerationOptions {
  model: string;
  durationSeconds: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
  fps?: number;
  motionScore?: number;
  firstFrameImageUrl?: string;
  lastFrameImageUrl?: string;
  seed?: number;
}

export interface VideoGenerationResult {
  jobId: string;
  videoUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider: string;
  modelUsed: string;
  durationSeconds: number;
}

export interface VideoProvider extends AIProvider {
  generateVideo(prompt: string, options?: VideoGenerationOptions): Promise<VideoGenerationResult>;
  pollVideoJob?(jobId: string): Promise<VideoGenerationResult>;
}

export interface VoiceGenerationOptions {
  model: string;
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
  speed?: number;
  pitch?: number;
  emotion?: 'neutral' | 'dramatic' | 'whisper' | 'energetic' | 'somber';
}

export interface VoiceGenerationResult {
  audioUrl: string;
  durationSeconds: number;
  sampleRateHz: number;
  provider: string;
  modelUsed: string;
}

export interface VoiceProvider extends AIProvider {
  generateVoice(text: string, options?: VoiceGenerationOptions): Promise<VoiceGenerationResult>;
}

export interface DubbingOptions {
  model: string;
  targetLanguage: string;
  sourceLanguage?: string;
  preservePitch?: boolean;
  syncLipMovement?: boolean;
}

export interface DubbingResult {
  jobId: string;
  outputMediaUrl?: string;
  targetLanguage: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider: string;
}

export interface DubbingProvider extends AIProvider {
  dubMedia(mediaUrl: string, options: DubbingOptions): Promise<DubbingResult>;
}

export interface TranslationOptions {
  model: string;
  sourceLanguage?: string;
  targetLanguage: string;
  context?: 'script' | 'subtitles' | 'ui' | 'narration';
  preserveTone?: boolean;
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  provider: string;
  modelUsed: string;
}

export interface TranslationProvider extends AIProvider {
  translate(text: string, options: TranslationOptions): Promise<TranslationResult>;
}

export interface MusicGenerationOptions {
  model: string;
  genre?: string;
  mood?: string;
  tempoBpm?: number;
  durationSeconds: number;
  instrumentalOnly?: boolean;
}

export interface MusicGenerationResult {
  audioUrl: string;
  durationSeconds: number;
  genre: string;
  provider: string;
  modelUsed: string;
}

export interface MusicProvider extends AIProvider {
  generateMusic(prompt: string, options?: MusicGenerationOptions): Promise<MusicGenerationResult>;
}

export interface SpeechToTextOptions {
  model: string;
  language?: string;
  detectSpeakers?: boolean;
  timestamps?: 'word' | 'segment';
}

export interface SubtitleWordSegment {
  word: string;
  start: number;
  end: number;
}

export interface SubtitleSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
  words?: SubtitleWordSegment[];
}

export interface SpeechToTextResult {
  fullText: string;
  segments: SubtitleSegment[];
  detectedLanguage?: string;
  provider: string;
  modelUsed: string;
}

export interface SpeechToTextProvider extends AIProvider {
  transcribe(audioUrl: string, options?: SpeechToTextOptions): Promise<SpeechToTextResult>;
}

// -----------------------------------------------------------------------------
// AI Language Proofreader Interface
// -----------------------------------------------------------------------------

export interface ProofreadingImprovement {
  id: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'clarity' | 'wording' | 'style';
  originalSnippet: string;
  replacementSnippet: string;
  explanation: string;
  explanationAr?: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ProofreadingOptions {
  language?: 'ar' | 'en' | 'auto';
  preserveMeaning?: boolean;
  context?: 'script' | 'dialogue' | 'story' | 'general';
  formality?: 'formal' | 'creative' | 'casual';
}

export interface ProofreadingResult {
  originalText: string;
  correctedText: string;
  improvements: ProofreadingImprovement[];
  detectedLanguage: 'ar' | 'en' | string;
  readabilityScore: number;
  provider: string;
  modelUsed: string;
  executionTimeMs: number;
}

export interface ProofreadingProvider extends AIProvider {
  proofread(text: string, options?: ProofreadingOptions): Promise<ProofreadingResult>;
}
