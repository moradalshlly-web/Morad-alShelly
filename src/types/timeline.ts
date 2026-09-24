/**
 * Visual Timeline & Video Track Architecture
 */

export type TrackType = 'video' | 'voiceover' | 'music' | 'sfx' | 'subtitles';

export interface TimelineClip {
  id: string;
  trackId: string;
  name: string;
  type: TrackType;
  startTime: number; // in seconds
  duration: number; // in seconds
  sourceUrl?: string;
  assetId?: string;
  sceneId?: string;
  thumbnailUrl?: string;
  volume?: number; // 0.0 to 1.0
  speed?: number;
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
  color?: string;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: TrackType;
  isMuted: boolean;
  isLocked: boolean;
  volume: number;
  order: number;
  clips: TimelineClip[];
}

export interface SubtitleCue {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
}

export interface MultilingualSubtitleTrack {
  id: string;
  languageCode: string; // e.g. 'en', 'es', 'ja', 'fr', 'ar', 'de'
  languageName: string;
  isDefault: boolean;
  cues: SubtitleCue[];
}

export interface TimelineState {
  totalDurationSeconds: number;
  currentTimeSeconds: number;
  isPlaying: boolean;
  zoomLevel: number; // pixels per second
  snapToGrid: boolean;
  tracks: TimelineTrack[];
  subtitleTracks: MultilingualSubtitleTrack[];
  activeSubtitleTrackId?: string;
}
