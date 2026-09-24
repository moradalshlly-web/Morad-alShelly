/**
 * Creative Option Providers Architecture
 * Decoupled, provider-independent interfaces and mock implementations.
 * Moro AI serves as sovereign orchestrator.
 */

import {
  CreativeCategory,
  CreativeDecision,
  CreativeOption,
  ImageOptionMetadata,
  ProjectCreativeDecisions,
  SceneOptionMetadata,
  ToneOptionMetadata,
  VoiceOptionMetadata,
} from '../../types/creative-options';

export interface CreativeContextPayload {
  projectId?: string;
  projectTitle?: string;
  rawText?: string;
  userPerspectiveDescription?: string;
  style?: string;
  genre?: string;
  targetDurationSeconds?: number;
  uploadedFilesSummary?: string[];
}

export interface CreativeOptionProvider<T = Record<string, unknown>> {
  readonly category: CreativeCategory;
  readonly categoryLabelEn: string;
  readonly categoryLabelAr: string;
  generateAllOptions(context: CreativeContextPayload): Promise<CreativeOption<T>[]>;
  generateSingleOption(
    targetIndex: number,
    existingOptions: CreativeOption<T>[],
    context: CreativeContextPayload
  ): Promise<CreativeOption<T>>;
}

export interface VoiceOptionProvider extends CreativeOptionProvider<VoiceOptionMetadata> {}
export interface ToneOptionProvider extends CreativeOptionProvider<ToneOptionMetadata> {}
export interface SceneOptionProvider extends CreativeOptionProvider<SceneOptionMetadata> {}
export interface ImageOptionProvider extends CreativeOptionProvider<ImageOptionMetadata> {}

// --- Realistic Mock Data Pools for Dynamic & Individual Replacement ---

const VOICE_CATALOG: Array<Omit<CreativeOption<VoiceOptionMetadata>, 'id' | 'selected' | 'recommended' | 'recommendationReason' | 'recommendationReasonAr'>> = [
  {
    title: 'Voice 1 · Tariq Al-Bahr (طارق البحر)',
    description: 'Deep, resonant cinematic baritone with solemn gravity and deliberate pacing, tailored for historical epics and hard sci-fi.',
    status: 'ready',
    metadata: {
      voiceName: 'Tariq Al-Bahr',
      genderStyle: 'Deep Baritone',
      ageStyle: 'Mature (40-50)',
      energy: 'Dramatic',
      deliveryStyle: 'Measured cinematic cadence, rich chest resonance',
      sampleWaveform: [20, 35, 60, 85, 95, 70, 45, 80, 100, 65, 40, 25, 55, 90, 40, 20],
      accent: 'Modern Standard Arabic / Neutral Mid-Atlantic',
    },
  },
  {
    title: 'Voice 2 · Layla Noor (ليلى نور)',
    description: 'Warm, luminous mezzo voice with intimate, breathy nuance, ideal for character introspection and emotional climaxes.',
    status: 'ready',
    metadata: {
      voiceName: 'Layla Noor',
      genderStyle: 'Warm Intimate Mezzo',
      ageStyle: 'Contemporary (28-36)',
      energy: 'Intimate',
      deliveryStyle: 'Whispered clarity, subtle emotional vibrato',
      sampleWaveform: [15, 25, 40, 65, 50, 75, 85, 60, 70, 50, 40, 30, 45, 60, 35, 15],
      accent: 'Refined Pan-Arab Literary / International Clean',
    },
  },
  {
    title: 'Voice 3 · Kaelen Synth (كايـلن سينث)',
    description: 'Precise, calm synthetic cadence with subtle harmonic overtones, engineered for artificial intelligence and analytical narrators.',
    status: 'ready',
    metadata: {
      voiceName: 'Kaelen Synth',
      genderStyle: 'Synthetic Neutral',
      ageStyle: 'Ageless / Android Grade',
      energy: 'Calm',
      deliveryStyle: 'Steely neutral articulation, zero pitch wavering',
      sampleWaveform: [30, 40, 50, 60, 55, 65, 70, 60, 55, 65, 70, 60, 50, 45, 40, 30],
      accent: 'Crisp Neutral Broadcast',
    },
  },
  {
    title: 'Voice 4 · Zayd Al-Rowai (زيد الروائي)',
    description: 'Weathered storytelling voice with gravelly texture and commanding vocal presence, suited for high-stakes trailers.',
    status: 'ready',
    metadata: {
      voiceName: 'Zayd Al-Rowai',
      genderStyle: 'Gravelly Bass-Baritone',
      ageStyle: 'Veteran (50-65)',
      energy: 'High',
      deliveryStyle: 'Raspy dramatic projection, dynamic volume swells',
      sampleWaveform: [25, 45, 75, 90, 85, 95, 100, 80, 70, 90, 85, 60, 50, 75, 50, 25],
      accent: 'Classical Oratorical Arabic',
    },
  },
  {
    title: 'Voice 5 · Maya As-Sama (مايا السـماء)',
    description: 'Bright, energetic narrative delivery with articulate optimism, perfect for visionary and futuristic campaigns.',
    status: 'ready',
    metadata: {
      voiceName: 'Maya As-Sama',
      genderStyle: 'Bright Lyric Soprano',
      ageStyle: 'Youthful (22-30)',
      energy: 'Medium',
      deliveryStyle: 'Swift articulate phrasing, uplifting inflection',
      sampleWaveform: [10, 30, 55, 70, 80, 65, 75, 90, 85, 70, 60, 45, 50, 65, 40, 20],
      accent: 'Contemporary Media Standard',
    },
  },
];

const TONE_CATALOG: Array<Omit<CreativeOption<ToneOptionMetadata>, 'id' | 'selected' | 'recommended' | 'recommendationReason' | 'recommendationReasonAr'>> = [
  {
    title: 'Tone 1 — هادئ وسينمائي (Contemplative & Cinematic)',
    description: 'Slow-burn philosophical atmosphere emphasizing spatial silence, atmospheric depth, and visual contemplation.',
    status: 'ready',
    metadata: {
      toneName: 'هادئ وسينمائي (Contemplative & Cinematic)',
      intensity: 'Subtle',
      emotionalPacing: 'Slow-burn, reflective, lingering pauses between beats',
      characteristics: ['Poetic Cadence', 'Ambient Focus', 'Deep Resonance', 'Negative Space'],
      colorPaletteDescription: 'Cool slate, cyan atmospheric haze, muted amber accents',
      accentColorHex: '#38bdf8',
    },
  },
  {
    title: 'Tone 2 — حماسي ملحمي (High-Stakes Epic)',
    description: 'Surging adrenaline, urgent percussive tempo, heroic confrontation, and soaring dramatic stakes.',
    status: 'ready',
    metadata: {
      toneName: 'حماسي ملحمي (High-Stakes Epic)',
      intensity: 'Dramatic',
      emotionalPacing: 'Relentless escalation leading to thunderous crescendo',
      characteristics: ['Driving Percussion', 'Heroic Bravado', 'High Contrast', 'Urgent Beats'],
      colorPaletteDescription: 'Molten gold, deep carbon black, fiery tungsten rim light',
      accentColorHex: '#f59e0b',
    },
  },
  {
    title: 'Tone 3 — غامض وتشويقي (Enigmatic Suspense)',
    description: 'Tense psychological dissonance, claustrophobic sound design, and an undercurrent of unrevealed secrets.',
    status: 'ready',
    metadata: {
      toneName: 'غامض وتشويقي (Enigmatic Suspense)',
      intensity: 'Balanced',
      emotionalPacing: 'Steady pressure buildup with sudden rhythmic ruptures',
      characteristics: ['Low-Frequency Drone', 'Shadow Dominance', 'Uncertainty', 'Tension'],
      colorPaletteDescription: 'Deep emerald noir, sodium-vapor yellow, shadow bleed',
      accentColorHex: '#10b981',
    },
  },
  {
    title: 'Tone 4 — شاعري نوستالجي (Nostalgic Elegiac)',
    description: 'Melancholic longing and warm analog intimacy, invoking memories, soft grain, and faded vintage elegance.',
    status: 'ready',
    metadata: {
      toneName: 'شاعري نوستالجي (Nostalgic Elegiac)',
      intensity: 'Subtle',
      emotionalPacing: 'Gentle ebb and flow, dreamlike transitions',
      characteristics: ['Warm Analog Grain', 'Acoustic Solitude', 'Soft Focus', 'Bittersweet'],
      colorPaletteDescription: 'Sepia sepulchral gold, bleached terracotta, soft lavender highlights',
      accentColorHex: '#a855f7',
    },
  },
];

const SCENE_CATALOG: Array<Omit<CreativeOption<SceneOptionMetadata>, 'id' | 'selected' | 'recommended' | 'recommendationReason' | 'recommendationReasonAr'>> = [
  {
    title: 'Concept A · Air-Lock Threshold (لحظة فتح بوابة العزل)',
    description: 'The protagonist stands silhouetted at the threshold of the subterranean bio-dome as the hydraulic seal decompresses with a burst of frozen vapor.',
    preview: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    status: 'ready',
    metadata: {
      sceneTitle: 'Air-Lock Threshold (لحظة فتح بوابة العزل)',
      shortDescription: 'Industrial decompression opening into unknown alien expanse',
      environment: 'Subterranean orbital outpost airlock, titanium deck, frosted bulkhead',
      characters: ['Lead Explorer / Commander'],
      cameraDirection: 'Slow creeping push-in from low-angle wide to intimate shoulder profile',
      lighting: 'Cold tungsten emergency cyan flashing counterpoint against deep exterior void',
      mood: 'Awe laced with existential isolation',
      suggestedDurationSeconds: 14,
      previewImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    title: 'Concept B · Macro Visor Reflection (انعكاس الخوذة المقرب)',
    description: 'Extremely tight macro close-up on the pressurized visor, showing micro-scratches, condensation, and the reflection of a mysterious glowing artifact.',
    preview: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    status: 'ready',
    metadata: {
      sceneTitle: 'Macro Visor Reflection (انعكاس الخوذة المقرب)',
      shortDescription: 'Claustrophobic psychological focus on eye dilation and reflection',
      environment: 'Pressurized EVA helmet interior with HUD data reflections',
      characters: ['Lead Explorer'],
      cameraDirection: 'Dutch angle macro tracking shot, 100mm focal length',
      lighting: 'Pulsing amber warning strobe and violet bioluminescence from outside',
      mood: 'Visceral tension, rapid heart rate, sensory overload',
      suggestedDurationSeconds: 10,
      previewImageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    title: 'Concept C · The Vast Bioluminescent Abyss (الهاوية المضيئة)',
    description: 'An immense wide-angle establishing shot showcasing a towering mutated alien canopy with cascading crystalline waterfalls of liquid light.',
    preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    status: 'ready',
    metadata: {
      sceneTitle: 'The Vast Bioluminescent Abyss (الهاوية المضيئة)',
      shortDescription: 'Epic environmental scale where solitary explorer is dwarfed by nature',
      environment: 'Vast mutated alien arboretum, phosphorescent giant flora, floating spores',
      characters: ['Lead Explorer', 'Survey Droid'],
      cameraDirection: 'Sweeping crane pedestal rise tilting down from cavern ceiling',
      lighting: 'Self-luminous flora glowing in indigo and emerald with warm floating spores',
      mood: 'Sublime wonder and celestial grandeur',
      suggestedDurationSeconds: 18,
      previewImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    title: 'Concept D · Encounter at the Monolith (المواجهة عند الصرح)',
    description: 'The explorer reaches out a gloved hand toward a monolithic crystalline structure that begins humming with sympathetic acoustic vibration.',
    preview: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80',
    status: 'ready',
    metadata: {
      sceneTitle: 'Encounter at the Monolith (المواجهة عند الصرح)',
      shortDescription: 'Tactile physical contact with ancient extraterrestrial architecture',
      environment: 'Obsidian courtyard etched with geometric luminescent conduits',
      characters: ['Lead Explorer'],
      cameraDirection: 'Tracking profile shot following gloved fingertips slowly approaching surface',
      lighting: 'Sharp volumetric beam piercing atmospheric fog',
      mood: 'Monumental revelation and quiet dread',
      suggestedDurationSeconds: 16,
      previewImageUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80',
    },
  },
];

const IMAGE_CATALOG: Array<Omit<CreativeOption<ImageOptionMetadata>, 'id' | 'selected' | 'recommended' | 'recommendationReason' | 'recommendationReasonAr'>> = [
  {
    title: 'Visual 1 · Anamorphic 35mm Realism (واقعية عدسة 35 مم)',
    description: 'Cinema-grade anamorphic horizontal flare, subtle barrel distortion, authentic chemical grain, and tactile atmospheric haze.',
    preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    status: 'ready',
    metadata: {
      style: 'Anamorphic 35mm Cinematic Realism',
      composition: 'Rule of thirds, deep focal depth, silhouette on lower right third',
      lighting: 'Volumetric cyan moonlight with sharp amber titanium rim accent',
      camera: 'ARRI Alexa 65, Panavision C-Series 40mm Anamorphic, T2.0, 800 ISO',
      aspectRatio: '16:9',
      previewImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      seedPrompt: 'Master cinematography, deep space installation, volumetric lighting, photorealistic textural detail',
    },
  },
  {
    title: 'Visual 2 · High-Contrast Neo-Noir (نيو-نوار عالي التباين)',
    description: 'Deep obsidian shadows, razor-sharp edge lighting, wet reflective surfaces, and saturated neon contrast.',
    preview: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    status: 'ready',
    metadata: {
      style: 'Neo-Noir Cyberpunk Chiaroscuro',
      composition: 'Low-angle looking up, steep vertical lines, reflective puddles',
      lighting: 'Pulsing magenta and sodium-vapor yellow neon reflections cutting through drizzle',
      camera: 'Sony Venice 2, Cooke S7/i Full Frame Plus 50mm, T1.4',
      aspectRatio: '16:9',
      previewImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      seedPrompt: 'Neo-Tokyo night rain, glowing reflections, deep blacks, high dynamic range',
    },
  },
  {
    title: 'Visual 3 · Golden Hour Speculative Dawn (فجر الخيال الذهبي)',
    description: 'Warm atmospheric dusk with golden particulate dust, gentle lens diffusion, and soft cinematic backlighting.',
    preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    status: 'ready',
    metadata: {
      style: 'Speculative Naturalism / Golden Hour',
      composition: 'Ultra-wide panoramic horizon, solitary figure against monumental natural formations',
      lighting: 'Low-angled raking sunlight filtering through alien atmospheric dust',
      camera: 'RED V-Raptor XL 8K, Master Prime 27mm, T1.3',
      aspectRatio: '16:9',
      previewImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      seedPrompt: 'Epic desert monolith at sunrise, golden haze, 8k resolution, cinematic landscape',
    },
  },
  {
    title: 'Visual 4 · Crystalline Bio-Glow (توهج حيوي بلوري)',
    description: 'Deep oceanic bioluminescence, translucent surfaces, and internal refractive light dispersion.',
    preview: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    status: 'ready',
    metadata: {
      style: 'Bioluminescent Surrealism',
      composition: 'Centred macro focus with soft organic peripheral vignette',
      lighting: 'Internal phosphorescence passing through translucent organic tissue',
      camera: 'Canon Cinema EOS C500 Mark II, 65mm Macro Lens, T2.8',
      aspectRatio: '16:9',
      previewImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      seedPrompt: 'Macro alien flora glowing from within, deep violet and turquoise light, sharp focus',
    },
  },
];

// --- Implementation of Category Providers ---

export class MockVoiceOptionProvider implements VoiceOptionProvider {
  readonly category: CreativeCategory = 'voice';
  readonly categoryLabelEn = 'Voice Narration';
  readonly categoryLabelAr = 'الصوت والإلقاء';

  async generateAllOptions(context: CreativeContextPayload): Promise<CreativeOption<VoiceOptionMetadata>[]> {
    // Select 3 voices from catalog based on context
    const pool = [...VOICE_CATALOG];
    const isCinematic = context.style === 'cinematic' || (context.rawText || '').includes('space') || (context.rawText || '').includes('فضاء');

    return [
      {
        ...pool[0],
        id: `voice_opt_1_${Date.now()}`,
        recommended: isCinematic,
        recommendationReason: 'Suggested by Moro: Matches the solemn cinematic pacing and scale of your narrative brief.',
        recommendationReasonAr: 'اقتراح Moro: قد يكون الأنسب لهذا المشروع لأنه يتناغم مع النبرة السينمائية وهيبة المشهد.',
        selected: isCinematic,
      },
      {
        ...pool[1],
        id: `voice_opt_2_${Date.now()}`,
        recommended: !isCinematic,
        recommendationReason: 'Suggested by Moro: Enhances emotional intimacy and character vulnerability.',
        recommendationReasonAr: 'اقتراح Moro: يضفي بعداً عاطفياً دافئاً وملامساً للوجدان.',
        selected: !isCinematic,
      },
      {
        ...pool[2],
        id: `voice_opt_3_${Date.now()}`,
        recommended: false,
        recommendationReason: 'Neutral, analytical cadence suited for documentary or artificial narrator perspectives.',
        recommendationReasonAr: 'نبرة محايدة ودقيقة تلائم الإلقاء التوثيقي أو الذكاء الاصطناعي.',
        selected: false,
      },
    ];
  }

  async generateSingleOption(
    targetIndex: number,
    existingOptions: CreativeOption<VoiceOptionMetadata>[],
    context: CreativeContextPayload
  ): Promise<CreativeOption<VoiceOptionMetadata>> {
    const existingTitles = new Set(existingOptions.map((o) => o.title));
    const available = VOICE_CATALOG.filter((item) => !existingTitles.has(item.title));
    const candidate = available.length > 0 ? available[0] : VOICE_CATALOG[(targetIndex + 3) % VOICE_CATALOG.length];

    return {
      ...candidate,
      id: `voice_opt_${targetIndex + 1}_${Date.now()}`,
      recommended: false,
      recommendationReason: 'Alternative vocal variation regenerated on demand.',
      recommendationReasonAr: 'خيار صوتي بديل تم توليده بناءً على طلبك.',
      selected: existingOptions[targetIndex]?.selected || false,
    };
  }
}

export class MockToneOptionProvider implements ToneOptionProvider {
  readonly category: CreativeCategory = 'tone';
  readonly categoryLabelEn = 'Narrative Tone';
  readonly categoryLabelAr = 'نبرة السرد والدراما';

  async generateAllOptions(context: CreativeContextPayload): Promise<CreativeOption<ToneOptionMetadata>[]> {
    const pool = [...TONE_CATALOG];
    return [
      {
        ...pool[0],
        id: `tone_opt_1_${Date.now()}`,
        recommended: true,
        recommendationReason: 'Suggested by Moro: Contemplative tone creates atmospheric breathing room for the visual world.',
        recommendationReasonAr: 'اقتراح Moro: قد يكون الأنسب لهذا المشروع لمنح المشاهد مساحة تأملية سينمائية رحبة.',
        selected: true,
      },
      {
        ...pool[1],
        id: `tone_opt_2_${Date.now()}`,
        recommended: false,
        recommendationReason: 'High adrenaline pacing designed for intense conflict and fast-cutting scenes.',
        recommendationReasonAr: 'نبرة حماسية متصاعدة تلائم وتيرة الصراع والمشاهد السريعة.',
        selected: false,
      },
      {
        ...pool[2],
        id: `tone_opt_3_${Date.now()}`,
        recommended: false,
        recommendationReason: 'Focuses on psychological suspense, shadow play, and unanswered questions.',
        recommendationReasonAr: 'يركز على التشويق النفسي وتعميق الغموض السينمائي.',
        selected: false,
      },
    ];
  }

  async generateSingleOption(
    targetIndex: number,
    existingOptions: CreativeOption<ToneOptionMetadata>[],
    context: CreativeContextPayload
  ): Promise<CreativeOption<ToneOptionMetadata>> {
    const existingNames = new Set(existingOptions.map((o) => o.metadata.toneName));
    const available = TONE_CATALOG.filter((item) => !existingNames.has(item.metadata.toneName));
    const candidate = available.length > 0 ? available[0] : TONE_CATALOG[(targetIndex + 3) % TONE_CATALOG.length];

    return {
      ...candidate,
      id: `tone_opt_${targetIndex + 1}_${Date.now()}`,
      recommended: false,
      recommendationReason: 'Alternative narrative tone cadence.',
      recommendationReasonAr: 'نبرة سردية بديلة مجددة للحفاظ على مرونة التجربة.',
      selected: existingOptions[targetIndex]?.selected || false,
    };
  }
}

export class MockSceneOptionProvider implements SceneOptionProvider {
  readonly category: CreativeCategory = 'scene';
  readonly categoryLabelEn = 'Scene Concept';
  readonly categoryLabelAr = 'مفهوم المشهد وزاوية المعالجة';

  async generateAllOptions(context: CreativeContextPayload): Promise<CreativeOption<SceneOptionMetadata>[]> {
    const pool = [...SCENE_CATALOG];
    const hasUserPerspective = Boolean(context.userPerspectiveDescription?.trim());

    return [
      {
        ...pool[0],
        id: `scene_opt_1_${Date.now()}`,
        recommended: true,
        recommendationReason: hasUserPerspective
          ? 'Suggested by Moro: Aligned closely with your described visual direction and opening mood.'
          : 'Suggested by Moro: Classic establishing beat that grounds audience geography immediately.',
        recommendationReasonAr: hasUserPerspective
          ? 'اقتراح Moro: أقترحه لأنه يترجم بدقة المنظور الوصفي الذي شاركته معنا.'
          : 'اقتراح Moro: قد يكون الأنسب لهذا المشروع لأنه يبني الجغرافيا المكانية بوضوح سينمائي.',
        selected: true,
      },
      {
        ...pool[1],
        id: `scene_opt_2_${Date.now()}`,
        recommended: false,
        recommendationReason: 'Intimate psychological framing emphasizing personal stakes through visor reflection.',
        recommendationReasonAr: 'معالجة مقربة تعزز البعد النفسي والتوتر الداخلي للشخصية.',
        selected: false,
      },
      {
        ...pool[2],
        id: `scene_opt_3_${Date.now()}`,
        recommended: false,
        recommendationReason: 'Sublime environmental scale showcasing world complexity.',
        recommendationReasonAr: 'تكوين بيئي واسع يُظهر عظمة العالم المحيط وضآلة البطل أمامه.',
        selected: false,
      },
    ];
  }

  async generateSingleOption(
    targetIndex: number,
    existingOptions: CreativeOption<SceneOptionMetadata>[],
    context: CreativeContextPayload
  ): Promise<CreativeOption<SceneOptionMetadata>> {
    const existingTitles = new Set(existingOptions.map((o) => o.metadata.sceneTitle));
    const available = SCENE_CATALOG.filter((item) => !existingTitles.has(item.metadata.sceneTitle));
    const candidate = available.length > 0 ? available[0] : SCENE_CATALOG[(targetIndex + 3) % SCENE_CATALOG.length];

    return {
      ...candidate,
      id: `scene_opt_${targetIndex + 1}_${Date.now()}`,
      recommended: false,
      recommendationReason: 'Alternative scene concept generated on demand.',
      recommendationReasonAr: 'معالجة بديلة للمشهد مولدة بشكل مستقل دون التأثير على بقية القرارات.',
      selected: existingOptions[targetIndex]?.selected || false,
    };
  }
}

export class MockImageOptionProvider implements ImageOptionProvider {
  readonly category: CreativeCategory = 'image';
  readonly categoryLabelEn = 'Visual Style & Composition';
  readonly categoryLabelAr = 'الرؤية البصرية والتكوين';

  async generateAllOptions(context: CreativeContextPayload): Promise<CreativeOption<ImageOptionMetadata>[]> {
    const pool = [...IMAGE_CATALOG];
    return [
      {
        ...pool[0],
        id: `img_opt_1_${Date.now()}`,
        recommended: true,
        recommendationReason: 'Suggested by Moro: 35mm anamorphic flares evoke authentic feature-film craftsmanship.',
        recommendationReasonAr: 'اقتراح Moro: قد يكون الأنسب لهذا المشروع لتوظيفه التوهجات الأنامورفية السينمائية الرصينة.',
        selected: true,
      },
      {
        ...pool[1],
        id: `img_opt_2_${Date.now()}`,
        recommended: false,
        recommendationReason: 'High-contrast noir treatment with striking specular reflections.',
        recommendationReasonAr: 'توزيع إضاءة نيو-نوار بظلال عميقة وانعكاسات مشبعة.',
        selected: false,
      },
      {
        ...pool[2],
        id: `img_opt_3_${Date.now()}`,
        recommended: false,
        recommendationReason: 'Atmospheric golden dawn treatment ideal for uplifting resolution.',
        recommendationReasonAr: 'إضاءة طبيعية دافئة في ساعة الشروق تمنح أفقاً استشرافياً واسعاً.',
        selected: false,
      },
    ];
  }

  async generateSingleOption(
    targetIndex: number,
    existingOptions: CreativeOption<ImageOptionMetadata>[],
    context: CreativeContextPayload
  ): Promise<CreativeOption<ImageOptionMetadata>> {
    const existingTitles = new Set(existingOptions.map((o) => o.title));
    const available = IMAGE_CATALOG.filter((item) => !existingTitles.has(item.title));
    const candidate = available.length > 0 ? available[0] : IMAGE_CATALOG[(targetIndex + 3) % IMAGE_CATALOG.length];

    return {
      ...candidate,
      id: `img_opt_${targetIndex + 1}_${Date.now()}`,
      recommended: false,
      recommendationReason: 'Refreshed single visual composition.',
      recommendationReasonAr: 'تكوين بصري بديل تم تجديده منفرداً مع حفظ كامل سياق المشروع.',
      selected: existingOptions[targetIndex]?.selected || false,
    };
  }
}

// Master Creative Orchestration Service
export class MoroCreativeOptionService {
  private static voiceProvider: VoiceOptionProvider = new MockVoiceOptionProvider();
  private static toneProvider: ToneOptionProvider = new MockToneOptionProvider();
  private static sceneProvider: SceneOptionProvider = new MockSceneOptionProvider();
  private static imageProvider: ImageOptionProvider = new MockImageOptionProvider();

  /**
   * Resolves the registered option provider for a creative category.
   * Kept internal so Moro Core and future modules share one provider set.
   */
  static getProvider(category: CreativeCategory): CreativeOptionProvider<any> {
    switch (category) {
      case 'voice':
        return this.voiceProvider;
      case 'tone':
        return this.toneProvider;
      case 'scene':
        return this.sceneProvider;
      case 'image':
        return this.imageProvider;
      default:
        throw new Error(`No creative option provider registered for category: "${category}"`);
    }
  }

  /**
   * Generates a full 3-option decision for a SINGLE category, independently of
   * every other category. This is the building block for the per-output
   * "generate three" contract exposed through Moro Core.
   */
  static async generateCategory(
    category: CreativeCategory,
    context: CreativeContextPayload
  ): Promise<CreativeDecision> {
    const provider = this.getProvider(category);
    const options = await provider.generateAllOptions(context);
    const recommended = options.find((o) => o.recommended);

    return {
      category,
      categoryLabelEn: provider.categoryLabelEn,
      categoryLabelAr: provider.categoryLabelAr,
      options,
      selectedOptionId: recommended?.id || options[0].id,
      recommendedOptionId: recommended?.id,
      userModified: false,
      generationStatus: 'ready',
    };
  }

  /**
   * Generates initial decisions across all 4 categories (Voice, Tone, Scene, Image)
   */
  static async generateInitialDecisions(context: CreativeContextPayload): Promise<ProjectCreativeDecisions> {
    const [voices, tones, scenes, images] = await Promise.all([
      this.voiceProvider.generateAllOptions(context),
      this.toneProvider.generateAllOptions(context),
      this.sceneProvider.generateAllOptions(context),
      this.imageProvider.generateAllOptions(context),
    ]);

    return {
      voice: {
        category: 'voice',
        categoryLabelEn: 'Voice Narration',
        categoryLabelAr: 'الصوت والإلقاء',
        options: voices,
        selectedOptionId: voices.find((v) => v.recommended)?.id || voices[0].id,
        recommendedOptionId: voices.find((v) => v.recommended)?.id,
        generationStatus: 'ready',
        moroDialogue: {
          text: 'I parsed your dialogue requirements. Here are 3 distinct vocal profiles for your narrator.',
          textAr: 'فهمت أبعاد الشخصية. جهزت لك 3 خيارات صوتية متمايزة للإلقاء والحوار.',
          reason: 'Voice 1 matches your cinematic pacing with grave chest resonance.',
          reasonAr: 'أقترح الصوت الأول لأنه يتناسب أكثر مع هيبة النبرة السينمائية المختارة.',
        },
      },
      tone: {
        category: 'tone',
        categoryLabelEn: 'Narrative Tone',
        categoryLabelAr: 'نبرة السرد والدراما',
        options: tones,
        selectedOptionId: tones.find((t) => t.recommended)?.id || tones[0].id,
        recommendedOptionId: tones.find((t) => t.recommended)?.id,
        generationStatus: 'ready',
        moroDialogue: {
          text: 'I detected the thematic core of your project. Here are 3 narrative tone candidates.',
          textAr: 'استوعبت جوهر الفكرة الدرامية. جهزت لك 3 نبرات سردية للموازنة بين الإيقاع والعمق.',
          reason: 'Tone 1 provides patient atmospheric breathing space.',
          reasonAr: 'أقترح النبرة الهادئة لمنح المشاهد السينمائية عمقاً بصرياً رصيناً.',
        },
      },
      scene: {
        category: 'scene',
        categoryLabelEn: 'Scene Concept',
        categoryLabelAr: 'مفهوم المشهد وزاوية المعالجة',
        options: scenes,
        selectedOptionId: scenes.find((s) => s.recommended)?.id || scenes[0].id,
        recommendedOptionId: scenes.find((s) => s.recommended)?.id,
        generationStatus: 'ready',
        moroDialogue: {
          text: 'I laid out the visual beats. Here are 3 opening scene concepts.',
          textAr: 'فهمت فكرتك. جهزت لك 3 خيارات لمعالجة المشهد وتوزيع الكاميرا والإضاءة.',
          reason: 'Concept A establishes spatial depth and emotional stakes quickly.',
          reasonAr: 'أقترح المعالجة الأولى لأنها تؤسس الجغرافيا المكانية وهيبة الموقف بامتياز.',
        },
      },
      image: {
        category: 'image',
        categoryLabelEn: 'Visual Style & Composition',
        categoryLabelAr: 'الرؤية البصرية والتكوين',
        options: images,
        selectedOptionId: images.find((i) => i.recommended)?.id || images[0].id,
        recommendedOptionId: images.find((i) => i.recommended)?.id,
        generationStatus: 'ready',
        moroDialogue: {
          text: 'Here are 3 cinematic visual style directions for keyframe generation.',
          textAr: 'جهزت لك 3 خيارات للتكوين البصري والعدسات والإضاءة.',
          reason: 'Anamorphic 35mm delivers tactile widescreen realism.',
          reasonAr: 'أقترح الخيار الأنامورفي لتجسيد واقعية العدسات السينمائية المحترفة.',
        },
      },
    };
  }

  /**
   * Regenerates ALL 3 options for a single category without touching any other category!
   */
  static async replaceCategoryAll<T>(
    category: CreativeCategory,
    currentDecision: CreativeDecision<T>,
    context: CreativeContextPayload
  ): Promise<CreativeDecision<T>> {
    let freshOptions: CreativeOption<any>[];

    switch (category) {
      case 'voice':
        freshOptions = await this.voiceProvider.generateAllOptions(context);
        break;
      case 'tone':
        freshOptions = await this.toneProvider.generateAllOptions(context);
        break;
      case 'scene':
        freshOptions = await this.sceneProvider.generateAllOptions(context);
        break;
      case 'image':
        freshOptions = await this.imageProvider.generateAllOptions(context);
        break;
      default:
        throw new Error(`Unsupported category for replaceCategoryAll: ${category}`);
    }

    return {
      ...currentDecision,
      options: freshOptions as CreativeOption<T>[],
      selectedOptionId: freshOptions[0].id,
      recommendedOptionId: freshOptions.find((o) => o.recommended)?.id,
      userModified: true,
      generationStatus: 'ready',
    };
  }

  /**
   * Regenerates ONLY a single option (by target optionId or index) without resetting the other 2 options or other categories!
   */
  static async replaceCategorySingle<T>(
    category: CreativeCategory,
    targetOptionId: string,
    currentDecision: CreativeDecision<T>,
    context: CreativeContextPayload
  ): Promise<CreativeDecision<T>> {
    const targetIndex = currentDecision.options.findIndex((o) => o.id === targetOptionId);
    if (targetIndex === -1) {
      return currentDecision;
    }

    let refreshedOption: CreativeOption<any>;

    switch (category) {
      case 'voice':
        refreshedOption = await this.voiceProvider.generateSingleOption(
          targetIndex,
          currentDecision.options as unknown as CreativeOption<VoiceOptionMetadata>[],
          context
        );
        break;
      case 'tone':
        refreshedOption = await this.toneProvider.generateSingleOption(
          targetIndex,
          currentDecision.options as unknown as CreativeOption<ToneOptionMetadata>[],
          context
        );
        break;
      case 'scene':
        refreshedOption = await this.sceneProvider.generateSingleOption(
          targetIndex,
          currentDecision.options as unknown as CreativeOption<SceneOptionMetadata>[],
          context
        );
        break;
      case 'image':
        refreshedOption = await this.imageProvider.generateSingleOption(
          targetIndex,
          currentDecision.options as unknown as CreativeOption<ImageOptionMetadata>[],
          context
        );
        break;
      default:
        throw new Error(`Unsupported category for replaceCategorySingle: ${category}`);
    }

    // Replace ONLY the targeted index with stable update
    const updatedOptions = [...currentDecision.options];
    updatedOptions[targetIndex] = refreshedOption as CreativeOption<T>;

    // If the replaced option was selected, keep the new one selected or preserve choice
    const wasSelected = currentDecision.selectedOptionId === targetOptionId;

    return {
      ...currentDecision,
      options: updatedOptions,
      selectedOptionId: wasSelected ? refreshedOption.id : currentDecision.selectedOptionId,
      userModified: true,
      generationStatus: 'ready',
    };
  }

  /**
   * Selects a single option within a decision
   */
  static selectOption<T>(decision: CreativeDecision<T>, selectedOptionId: string): CreativeDecision<T> {
    const updatedOptions = decision.options.map((opt) => ({
      ...opt,
      selected: opt.id === selectedOptionId,
    }));

    return {
      ...decision,
      options: updatedOptions,
      selectedOptionId,
      userModified: true,
    };
  }
}
