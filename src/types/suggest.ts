/**
 * Suggest-For-Me Mode & Three-Option Architecture
 */

export type SuggestionStyle = 'cinematic' | 'anime' | 'cartoon' | 'realistic' | 'other';
export type SuggestionContentType = 'story' | 'educational' | 'informational' | 'action' | 'comedy' | 'other';
export type SuggestionDuration = 'short' | 'medium' | 'long' | 'custom';

export interface SuggestAnswers {
  style: SuggestionStyle;
  customStyle?: string;
  contentType: SuggestionContentType;
  customContentType?: string;
  characterReferenceUrls: string[];
  duration: SuggestionDuration;
  customDurationSeconds?: number;
  freeformIdea?: string;
}

export interface CreativeConceptSuggestion {
  id: string;
  optionNumber: 1 | 2 | 3;
  title: string;
  tagline: string;
  logline: string;
  visualDirection: {
    colorPalette: string[];
    lightingMood: string;
    cameraStyle: string;
    atmosphere: string;
  };
  characterConcept: {
    name: string;
    archetype: string;
    distinctiveTrait: string;
    voiceType: string;
  };
  narrativeHook: string;
  estimatedSceneCount: number;
  sampleScenes: Array<{
    sceneIndex: number;
    description: string;
    audioMood: string;
  }>;
}

export interface SuggestForMeBundle {
  answers: SuggestAnswers;
  suggestions: [CreativeConceptSuggestion, CreativeConceptSuggestion, CreativeConceptSuggestion];
  generatedAt: string;
}
