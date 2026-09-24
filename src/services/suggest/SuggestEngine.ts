/**
 * Suggest-For-Me Creative Engine
 * Transforms user questionnaire responses into 3 distinct, highly developed creative propositions
 * (Option 1, Option 2, Option 3) covering storyline, visual direction, characters, and scene structure.
 */

import {
  CreativeConceptSuggestion,
  SuggestAnswers,
  SuggestForMeBundle,
} from '../../types/suggest';

export class SuggestEngine {
  static generateThreeConcepts(answers: SuggestAnswers): SuggestForMeBundle {
    const styleLabel =
      answers.style === 'other' ? answers.customStyle || 'Avant-Garde' : answers.style;
    const typeLabel =
      answers.contentType === 'other' ? answers.customContentType || 'Hybrid' : answers.contentType;

    const estimatedDuration =
      answers.duration === 'short'
        ? 60
        : answers.duration === 'medium'
        ? 180
        : answers.duration === 'long'
        ? 360
        : answers.customDurationSeconds || 120;

    const hasRefImages = answers.characterReferenceUrls.length > 0;

    // Option 1: Atmospheric & Character-Driven
    const option1: CreativeConceptSuggestion = {
      id: `suggest_opt1_${Date.now()}`,
      optionNumber: 1,
      title: `${this.capitalize(styleLabel)}: The Whispering Horizon`,
      tagline: 'When memory becomes the only currency left.',
      logline: `A solitary wanderer in a ${styleLabel.toLowerCase()} setting uncovers an anomaly that alters their perception of time, forcing a race against encroaching oblivion.`,
      visualDirection: {
        colorPalette: ['#0f172a', '#1e293b', '#f59e0b', '#38bdf8'],
        lightingMood: 'High-contrast golden hour transitioning into deep cobalt twilight',
        cameraStyle: '35mm anamorphic wide-angle with shallow depth of field and steady tracking shots',
        atmosphere: 'Meditative, tactile, dust motes in sunbeams, subtle atmospheric haze',
      },
      characterConcept: {
        name: hasRefImages ? 'Subject Reference Alpha' : 'Kaelen',
        archetype: 'The Reluctant Cartographer',
        distinctiveTrait: 'Carries a mechanical chronometer with cracked sapphire glass',
        voiceType: 'Deep, resonant, contemplative with quiet authority',
      },
      narrativeHook: 'The story opens not with dialogue, but with the sudden cessation of all ambient sound.',
      estimatedSceneCount: Math.max(3, Math.round(estimatedDuration / 40)),
      sampleScenes: [
        {
          sceneIndex: 1,
          description: 'The traveler reaches the crest of the obsidian ridge as solar flare shadows lengthen.',
          audioMood: 'Low cello drone accompanied by wind whistling through porous stone.',
        },
        {
          sceneIndex: 2,
          description: 'A subterranean chamber awakens with pulsing crystalline filament patterns.',
          audioMood: 'Delicate high-frequency glass resonance and distant sub-bass thrum.',
        },
        {
          sceneIndex: 3,
          description: 'The climactic revelation as two reflections look back from a single mirrored surface.',
          audioMood: 'Crescendo of strings with sudden sharp acoustic silence.',
        },
      ],
    };

    // Option 2: High-Paced Dynamic & Structural
    const option2: CreativeConceptSuggestion = {
      id: `suggest_opt2_${Date.now()}`,
      optionNumber: 2,
      title: `${this.capitalize(typeLabel)}: Kinetic Convergence`,
      tagline: 'Speed is not a choice; it is survival.',
      logline: `In an intense ${typeLabel.toLowerCase()} narrative, an unexpected betrayal accelerates a sequence of synchronized events across three distinct sectors.`,
      visualDirection: {
        colorPalette: ['#050505', '#e11d48', '#0ea5e9', '#fafafa'],
        lightingMood: 'Sharp neon rim lights, strobe reflections in rain-slick surfaces, deep blacks',
        cameraStyle: 'Dynamic whip-pans, handheld kinetic motion, rapid speed-ramping',
        atmosphere: 'High adrenaline, industrial, kinetic particle sparks, dense urban texture',
      },
      characterConcept: {
        name: hasRefImages ? 'Subject Reference Beta' : 'Vesper-9',
        archetype: 'The Exiled Courier',
        distinctiveTrait: 'A biometric pulse collar that changes color with emotional stress',
        voiceType: 'Fast-cadence, urgent, razor-sharp diction',
      },
      narrativeHook: 'A timer begins counting down backward on an analog television screen.',
      estimatedSceneCount: Math.max(4, Math.round(estimatedDuration / 30)),
      sampleScenes: [
        {
          sceneIndex: 1,
          description: 'A fast pursuit through tight service tunnels illuminated by flickering safety strobes.',
          audioMood: 'Aggressive analog synth pulses at 138 BPM with metallic percussive impacts.',
        },
        {
          sceneIndex: 2,
          description: 'The protagonist halts at a precipice overlooking a flooded industrial complex.',
          audioMood: 'Distorted electric guitar swell falling into ambient rain hiss.',
        },
        {
          sceneIndex: 3,
          description: 'A split-second decision made while freefalling between high-voltage conduits.',
          audioMood: 'Heartbeat audio filtering with abrupt mechanical impact drop.',
        },
      ],
    };

    // Option 3: Conceptual & Mythic / Poetic
    const option3: CreativeConceptSuggestion = {
      id: `suggest_opt3_${Date.now()}`,
      optionNumber: 3,
      title: 'Echo of the First Spark',
      tagline: 'Every ending was once a conversation.',
      logline: `A visual poem bridging ancient mythic iconography and modern ${styleLabel.toLowerCase()} aesthetics, examining the creation of an unexpected artifact.`,
      visualDirection: {
        colorPalette: ['#1c1917', '#d97706', '#78350f', '#fef3c7'],
        lightingMood: 'Chiaroscuro candlelight and ember glow illuminating textured stone and gold leaf',
        cameraStyle: 'Deliberate slow dolly pushes, macro focus pulls, painterly compositions',
        atmosphere: 'Reverent, mythic, incense haze, floating embers, timeless weight',
      },
      characterConcept: {
        name: hasRefImages ? 'Subject Reference Gamma' : 'The Archivist',
        archetype: 'The Timeless Guardian',
        distinctiveTrait: 'Hands stained with ancient indigo pigment that faintly fluoresces',
        voiceType: 'Soft, lyrical, rhythmic, carrying the weight of centuries',
      },
      narrativeHook: 'An ancient seal breaks, releasing a cloud of golden dust that forms fleeting silhouettes.',
      estimatedSceneCount: Math.max(3, Math.round(estimatedDuration / 45)),
      sampleScenes: [
        {
          sceneIndex: 1,
          description: 'Macro shot of golden molten metal filling an intricate celestial engraving.',
          audioMood: 'Bowed Tibetan singing bowls and warm acoustic air turbulence.',
        },
        {
          sceneIndex: 2,
          description: 'The archivist traces the glyphs as the surrounding stone arches begin to hum.',
          audioMood: 'Choral overtone chanting layered with subterranean tectonic groan.',
        },
        {
          sceneIndex: 3,
          description: 'The temple dome opens to reveal an alien constellation never before charted.',
          audioMood: 'Full symphonic brass swell fading into a gentle acoustic wind chime.',
        },
      ],
    };

    return {
      answers,
      suggestions: [option1, option2, option3],
      generatedAt: new Date().toISOString(),
    };
  }

  private static capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
