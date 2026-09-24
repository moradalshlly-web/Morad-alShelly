/**
 * Export Presets & High-Resolution Target Specifications
 */

export type AspectRatioPreset = '16:9' | '9:16' | '1:1' | '4:5' | '2.39:1';
export type ExportResolution = '720p' | '1080p' | '4k';
export type VideoCodec = 'h264' | 'h265' | 'prores-422' | 'vp9';
export type AudioCodec = 'aac' | 'mp3' | 'flac';

export interface SocialMediaPreset {
  id: string;
  name: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'x' | 'cinema' | 'custom';
  recommendedAspectRatio: AspectRatioPreset;
  recommendedResolution: ExportResolution;
  maxBitrateMbps: number;
  description: string;
  badge?: string;
}

export interface ExportJobConfiguration {
  projectId: string;
  title: string;
  aspectRatio: AspectRatioPreset;
  resolution: ExportResolution;
  videoCodec: VideoCodec;
  audioCodec: AudioCodec;
  fps: 24 | 30 | 60;
  bitrateMbps: number;
  includeSubtitlesBurnIn: boolean;
  subtitleTrackLanguage?: string;
  audioLoudnessNormalizationLufs: number; // e.g. -14 LUFS for streaming
  watermark: boolean;
}

export interface ExportJobResult {
  jobId: string;
  status: 'pending' | 'rendering' | 'encoding' | 'completed' | 'failed';
  downloadUrl?: string;
  fileSizeBytes?: number;
  renderTimeSeconds?: number;
  config: ExportJobConfiguration;
  createdAt: string;
}
