/**
 * Moro AI Model Registry (Architectural Definition)
 * Phase 1.1: Standardized generic provider catalog.
 * ZERO real external providers are connected in this phase.
 * All models exist as architectural placeholders with status "Not connected"
 * to allow real adapters to be plugged in later without modifying the core.
 */

import { ProviderModel } from '../../types/models';

export const INITIAL_MODEL_REGISTRY: ProviderModel[] = [
  // ---------------------------------------------------------------------------
  // VIDEO PROVIDERS (Architectural Placeholders)
  // ---------------------------------------------------------------------------
  {
    id: 'model_video_provider_a',
    provider: 'Video Provider A',
    model: 'vid-cinematic-pro',
    displayName: 'Video Provider A · Cinematic Pro',
    type: 'video',
    capabilities: ['text-to-video', 'image-to-video', 'camera-control', '4k-upscale'],
    enabled: true,
    connected: false,
    priority: 1,
    fallbackPriority: 2,
    cost: { unit: 'second', priceUsd: 0.05, description: 'Est. $0.05 per rendered second' },
    speed: 'balanced',
    speedMsAvg: 12000,
    quality: 'cinematic',
    limits: {
      rateLimitPerMinute: 20,
      maxConcurrentJobs: 3,
      maxBatchSize: 1,
      timeoutMs: 180000,
    },
    description: 'Architectural slot for cinematic text-to-video and motion control engines.',
  },
  {
    id: 'model_video_provider_b',
    provider: 'Video Provider B',
    model: 'vid-fast-action',
    displayName: 'Video Provider B · Fast Action (Fallback)',
    type: 'video',
    capabilities: ['text-to-video', 'rapid-prototyping', 'fluid-motion'],
    enabled: true,
    connected: false,
    priority: 2,
    fallbackPriority: 1,
    cost: { unit: 'second', priceUsd: 0.03, description: 'Est. $0.03 per rendered second' },
    speed: 'fast',
    speedMsAvg: 7500,
    quality: 'standard',
    limits: {
      rateLimitPerMinute: 30,
      maxConcurrentJobs: 4,
      maxBatchSize: 1,
      timeoutMs: 120000,
    },
    description: 'Secondary video rendering slot for automatic failover and rapid rough cuts.',
  },

  // ---------------------------------------------------------------------------
  // IMAGE PROVIDERS (Architectural Placeholders)
  // ---------------------------------------------------------------------------
  {
    id: 'model_image_provider_a',
    provider: 'Image Provider A',
    model: 'img-studio-master',
    displayName: 'Image Provider A · Studio Master',
    type: 'image',
    capabilities: ['character-consistency', 'photorealism', 'three-option-multi-shot', 'seed-locking'],
    enabled: true,
    connected: false,
    priority: 1,
    fallbackPriority: 2,
    cost: { unit: 'image', priceUsd: 0.04, description: 'Est. $0.04 per frame' },
    speed: 'fast',
    speedMsAvg: 3500,
    quality: 'master',
    limits: {
      rateLimitPerMinute: 60,
      maxConcurrentJobs: 6,
      maxBatchSize: 3,
      timeoutMs: 30000,
    },
    description: 'Primary visual generation adapter slot supporting Moro 3-option candidate delivery.',
  },
  {
    id: 'model_image_provider_b',
    provider: 'Image Provider B',
    model: 'img-stylized-art',
    displayName: 'Image Provider B · Stylized Art (Fallback)',
    type: 'image',
    capabilities: ['stylized-lighting', 'atmospheric-composition', 'rapid-concept'],
    enabled: true,
    connected: false,
    priority: 2,
    fallbackPriority: 1,
    cost: { unit: 'image', priceUsd: 0.02, description: 'Est. $0.02 per frame' },
    speed: 'ultra-fast',
    speedMsAvg: 1800,
    quality: 'standard',
    limits: {
      rateLimitPerMinute: 80,
      maxConcurrentJobs: 8,
      maxBatchSize: 3,
      timeoutMs: 25000,
    },
    description: 'Fallback visual adapter slot for uninterrupted generation continuity.',
  },

  // ---------------------------------------------------------------------------
  // VOICE & AUDIO PROVIDERS (Architectural Placeholders)
  // ---------------------------------------------------------------------------
  {
    id: 'model_voice_provider_a',
    provider: 'Voice Provider A',
    model: 'voice-neural-multilingual',
    displayName: 'Voice Provider A · Multilingual Neural',
    type: 'voice',
    capabilities: ['voice-timbre-locking', 'emotional-inflection', 'arabic-diacritics', 'pacing-control'],
    enabled: true,
    connected: false,
    priority: 1,
    fallbackPriority: 2,
    cost: { unit: 'token', priceUsd: 0.00012, description: 'Est. $0.12 per 1,000 characters' },
    speed: 'fast',
    speedMsAvg: 1600,
    quality: 'master',
    limits: {
      rateLimitPerMinute: 120,
      maxConcurrentJobs: 10,
      maxBatchSize: 1,
      timeoutMs: 25000,
    },
    description: 'High-fidelity dramatic character dialogue slot with Arabic and English vocal nuance.',
  },
  {
    id: 'model_voice_provider_b',
    provider: 'Voice Provider B',
    model: 'voice-narration-hd',
    displayName: 'Voice Provider B · Narration HD (Fallback)',
    type: 'voice',
    capabilities: ['documentary-narration', 'low-latency', 'broadcast-purity'],
    enabled: true,
    connected: false,
    priority: 2,
    fallbackPriority: 1,
    cost: { unit: 'token', priceUsd: 0.00008, description: 'Est. $0.08 per 1,000 characters' },
    speed: 'ultra-fast',
    speedMsAvg: 950,
    quality: 'cinematic',
    limits: {
      rateLimitPerMinute: 150,
      maxConcurrentJobs: 8,
      maxBatchSize: 1,
      timeoutMs: 20000,
    },
    description: 'Secondary voice synthesis adapter slot for rapid narration and voiceover failover.',
  },

  // ---------------------------------------------------------------------------
  // DUBBING PROVIDER (Architectural Placeholder)
  // ---------------------------------------------------------------------------
  {
    id: 'model_dubbing_provider_a',
    provider: 'Dubbing Provider A',
    model: 'dub-voice-sync-v1',
    displayName: 'Dubbing Provider A · Lip-Sync Studio',
    type: 'dubbing',
    capabilities: ['voice-translation-sync', 'lip-timing', 'pitch-preservation', 'arabic-english-dub'],
    enabled: true,
    connected: false,
    priority: 1,
    fallbackPriority: 1,
    cost: { unit: 'minute', priceUsd: 0.25, description: 'Est. $0.25 per audio minute' },
    speed: 'balanced',
    speedMsAvg: 14000,
    quality: 'cinematic',
    limits: {
      rateLimitPerMinute: 20,
      maxConcurrentJobs: 2,
      maxBatchSize: 1,
      timeoutMs: 180000,
    },
    description: 'Automated dubbing pipeline slot for cross-linguistic audio and lip synchronization.',
  },

  // ---------------------------------------------------------------------------
  // TEXT & SCRIPTING PROVIDERS (Architectural Placeholders)
  // ---------------------------------------------------------------------------
  {
    id: 'model_text_provider_a',
    provider: 'Text Provider A',
    model: 'text-screenplay-director',
    displayName: 'Text Provider A · Screenplay Director',
    type: 'text',
    capabilities: ['three-act-dramaturgy', 'scene-breakdown', 'dialogue-polishing', 'character-arcs'],
    enabled: true,
    connected: false,
    priority: 1,
    fallbackPriority: 2,
    cost: { unit: 'token', priceUsd: 0.000003, description: 'Est. $3.00 / 1M tokens' },
    speed: 'fast',
    speedMsAvg: 1200,
    quality: 'master',
    limits: {
      rateLimitPerMinute: 100,
      maxConcurrentJobs: 12,
      maxBatchSize: 1,
      timeoutMs: 40000,
    },
    description: 'Primary text engine slot for screenwriting, scene breakdowns, and directorial notes.',
  },
  {
    id: 'model_text_provider_b',
    provider: 'Text Provider B',
    model: 'text-creative-assistant',
    displayName: 'Text Provider B · Creative Assistant (Fallback)',
    type: 'text',
    capabilities: ['rapid-ideation', 'logline-generation', 'formatting-validation'],
    enabled: true,
    connected: false,
    priority: 2,
    fallbackPriority: 1,
    cost: { unit: 'token', priceUsd: 0.000001, description: 'Est. $1.00 / 1M tokens' },
    speed: 'ultra-fast',
    speedMsAvg: 700,
    quality: 'standard',
    limits: {
      rateLimitPerMinute: 180,
      maxConcurrentJobs: 15,
      maxBatchSize: 1,
      timeoutMs: 30000,
    },
    description: 'Secondary text engine slot for instant fallback and high-throughput ideation.',
  },

  // ---------------------------------------------------------------------------
  // AI LANGUAGE PROOFREADER PROVIDER (Architectural Placeholder)
  // ---------------------------------------------------------------------------
  {
    id: 'model_proofreading_provider_a',
    provider: 'Proofreading Provider A',
    model: 'proofread-bilingual-pro',
    displayName: 'Proofreading Provider A · Bilingual Grammar & Style',
    type: 'proofreading',
    capabilities: [
      'arabic-grammar-correction',
      'arabic-spelling-correction',
      'english-grammar-spelling',
      'punctuation-precision',
      'sentence-clarity',
      'meaning-preservation',
    ],
    enabled: true,
    connected: false,
    priority: 1,
    fallbackPriority: 1,
    cost: { unit: 'token', priceUsd: 0.000002, description: 'Est. $2.00 / 1M tokens' },
    speed: 'ultra-fast',
    speedMsAvg: 650,
    quality: 'master',
    limits: {
      rateLimitPerMinute: 150,
      maxConcurrentJobs: 10,
      maxBatchSize: 1,
      timeoutMs: 20000,
    },
    description: 'Dedicated AI proofreading slot for Arabic and English syntactic and stylistic perfection.',
  },

  // ---------------------------------------------------------------------------
  // TRANSLATION PROVIDER (Architectural Placeholder)
  // ---------------------------------------------------------------------------
  {
    id: 'model_translation_provider_a',
    provider: 'Translation Provider A',
    model: 'trans-neural-contextual',
    displayName: 'Translation Provider A · Contextual Dialogue',
    type: 'translation',
    capabilities: ['arabic-english-idiomatic', 'subtitle-pacing', 'tone-preservation'],
    enabled: true,
    connected: false,
    priority: 1,
    fallbackPriority: 1,
    cost: { unit: 'token', priceUsd: 0.000001, description: 'Est. $1.00 / 1M tokens' },
    speed: 'ultra-fast',
    speedMsAvg: 500,
    quality: 'master',
    limits: {
      rateLimitPerMinute: 200,
      maxConcurrentJobs: 15,
      maxBatchSize: 5,
      timeoutMs: 20000,
    },
    description: 'Specialized dialogue translation slot preserving cultural subtext and subtitle constraints.',
  },

  // ---------------------------------------------------------------------------
  // MUSIC & SOUNDTRACK PROVIDER (Architectural Placeholder)
  // ---------------------------------------------------------------------------
  {
    id: 'model_music_provider_a',
    provider: 'Music Provider A',
    model: 'music-orchestral-suite',
    displayName: 'Music Provider A · Orchestral & Ambience',
    type: 'music',
    capabilities: ['cinematic-score', 'stem-separation', 'tempo-matching', 'mood-progression'],
    enabled: true,
    connected: false,
    priority: 1,
    fallbackPriority: 1,
    cost: { unit: 'second', priceUsd: 0.008, description: 'Est. $0.48 per score minute' },
    speed: 'balanced',
    speedMsAvg: 8000,
    quality: 'cinematic',
    limits: {
      rateLimitPerMinute: 30,
      maxConcurrentJobs: 3,
      maxBatchSize: 1,
      timeoutMs: 120000,
    },
    description: 'Cinematic soundtrack and ambient score generation slot with isolated stems.',
  },

  // ---------------------------------------------------------------------------
  // SPEECH-TO-TEXT PROVIDER (Architectural Placeholder)
  // ---------------------------------------------------------------------------
  {
    id: 'model_stt_provider_a',
    provider: 'Speech-to-Text Provider A',
    model: 'stt-diarization-master',
    displayName: 'Speech-to-Text Provider A · Subtitle Diarization',
    type: 'speech-to-text',
    capabilities: ['word-level-timestamps', 'speaker-identification', 'arabic-diacritic-recognition'],
    enabled: true,
    connected: false,
    priority: 1,
    fallbackPriority: 1,
    cost: { unit: 'minute', priceUsd: 0.006, description: 'Est. $0.006 per audio minute' },
    speed: 'ultra-fast',
    speedMsAvg: 1100,
    quality: 'master',
    limits: {
      rateLimitPerMinute: 120,
      maxConcurrentJobs: 8,
      maxBatchSize: 1,
      timeoutMs: 30000,
    },
    description: 'Frame-accurate audio transcription and timestamp generation slot for subtitle tracks.',
  },
];
