/**
 * LocalStorageAdapter
 * Production-ready client-side database implementation adhering to IDatabaseAdapter.
 * Emulates asynchronous PostgreSQL/Supabase queries with local persistence.
 */

import {
  User,
  Project,
  Asset,
  Character,
  Scene,
  Generation,
  GenerationJob,
  Settings,
} from '../../types/database';
import { ProviderModel } from '../../types/models';
import { IDatabaseAdapter } from './IDatabaseAdapter';

const STORAGE_KEYS = {
  USER: 'moro_user',
  PROJECTS: 'moro_projects',
  ASSETS: 'moro_assets',
  CHARACTERS: 'moro_characters',
  SCENES: 'moro_scenes',
  GENERATIONS: 'moro_generations',
  JOBS: 'moro_jobs',
  SETTINGS: 'moro_settings',
  MODELS: 'moro_models',
};

const DEFAULT_USER: User = {
  id: 'usr_moro_director',
  email: 'moradalshlly@gmail.com',
  displayName: 'Moro Studio Director',
  role: 'director',
  tier: 'studio',
  createdAt: '2026-01-10T12:00:00.000Z',
  updatedAt: '2026-09-24T00:00:00.000Z',
};

const DEFAULT_SETTINGS: Settings = {
  id: 'set_default',
  userId: 'usr_moro_director',
  defaultPreference: 'highest-quality',
  defaultResolution: '4k',
  defaultAspectRatio: '16:9',
  autoFallbackEnabled: true,
  maxCostPerProjectAlertUsd: 50.0,
  configuredApiKeys: {
    openai: true,
    runway: true,
    elevenlabs: true,
    suno: true,
    gemini: true,
    anthropic: true,
    luma: false,
    kling: false,
  },
  theme: 'cinematic-obsidian',
  exportBitrateMbps: 45,
  createdAt: '2026-01-10T12:00:00.000Z',
  updatedAt: '2026-09-24T00:00:00.000Z',
};

const SEED_PROJECTS: Project[] = [
  {
    id: 'proj_kepler_01',
    userId: 'usr_moro_director',
    title: 'Echoes of Kepler-186f',
    description: 'A cinematic sci-fi voyage investigating the silent transmission from humanity’s first interstellar bio-dome.',
    status: 'generating',
    genre: 'Science Fiction',
    style: 'cinematic',
    aspectRatio: '16:9',
    targetDurationSeconds: 180,
    coverImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    tags: ['Sci-Fi', 'Bio-Dome', '4K Master', 'Deep Space'],
    totalScenes: 4,
    createdAt: '2026-09-18T14:30:00.000Z',
    updatedAt: '2026-09-24T06:12:00.000Z',
  },
  {
    id: 'proj_tokyo_noir',
    userId: 'usr_moro_director',
    title: 'Neon Ronin: Shinjuku 2088',
    description: 'Cyberpunk stylized short about an exiled investigator uncovering synthetic memory cartels in rainy Neo-Tokyo.',
    status: 'storyboarding',
    genre: 'Cyberpunk / Action',
    style: 'anime',
    aspectRatio: '16:9',
    targetDurationSeconds: 120,
    coverImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cyberpunk', 'Anime', 'Stylized', 'Action'],
    totalScenes: 3,
    createdAt: '2026-09-20T09:15:00.000Z',
    updatedAt: '2026-09-23T18:40:00.000Z',
  },
  {
    id: 'proj_monolith',
    userId: 'usr_moro_director',
    title: 'The Silent Monolith',
    description: 'A realistic documentary exploration of an ancient submerged obsidian obelisk discovered off the Atacama trench.',
    status: 'scripting',
    genre: 'Documentary',
    style: 'realistic',
    aspectRatio: '2.39:1',
    targetDurationSeconds: 240,
    coverImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Documentary', 'Oceanic', 'Anamorphic'],
    totalScenes: 2,
    createdAt: '2026-09-22T11:00:00.000Z',
    updatedAt: '2026-09-23T22:15:00.000Z',
  },
];

const SEED_CHARACTERS: Character[] = [
  {
    id: 'char_elena_vance',
    projectId: 'proj_kepler_01',
    userId: 'usr_moro_director',
    name: 'Dr. Elena Vance',
    role: 'protagonist',
    description: 'Senior exobiologist on the Kepler expedition. Analytical, resolute, marked by quiet grief after the colony blackout.',
    visualTraits: {
      age: '38 years old',
      hair: 'Dark auburn, cropped short in utilitarian spacers cut',
      eyes: 'Intense hazel, weathered crow’s feet',
      clothing: 'Weathered EVA pressurized exploration flightsuit with orange titanium collar ring',
      distinguishingMarks: 'Small arc scar along right jawline',
      ethnicityOrOrigin: 'North-Mediterranean Terran descent',
    },
    personality: 'Pragmatic, observant, speaks in measured cadences with high precision under extreme pressure.',
    style: 'Cinematic hyper-realism, ARRI Alexa 65 aesthetic, natural atmospheric rim lighting',
    consistencySeed: 4892011,
    referenceImages: [
      {
        id: 'ref_1',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        label: 'Front Close-up (Lighting Match)',
        isPrimary: true,
      },
      {
        id: 'ref_2',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        label: 'Three-Quarter Profile with Headset',
        isPrimary: false,
      },
    ],
    voiceProfile: {
      providerId: 'elevenlabs',
      modelId: 'eleven-multilingual-v2',
      voiceId: 'rachel_cinematic_calm',
      pitch: 0.98,
      speed: 1.0,
      stability: 0.85,
    },
    createdAt: '2026-09-18T15:00:00.000Z',
    updatedAt: '2026-09-22T10:00:00.000Z',
  },
  {
    id: 'char_orion_unit',
    projectId: 'proj_kepler_01',
    userId: 'usr_moro_director',
    name: 'Synthetic Unit O-7 ("Orion")',
    role: 'supporting',
    description: 'Autonomous atmospheric surveyor droid with an organic carbon-chassis and amber ocular array.',
    visualTraits: {
      age: 'Manufactured cycle 2082',
      hair: 'None (brushed titanium composite headplate)',
      eyes: 'Triple concentric amber optical aperture',
      clothing: 'Ballistic thermal weave shoulder shroud with warning decals',
      distinguishingMarks: 'Faded serial number stencil O-7/KEPLER on thoracic plate',
    },
    personality: 'Calm, synthetic neutrality with subtle hints of emerging self-preservation instincts.',
    style: 'Photorealistic industrial sci-fi, tactile physical surfaces, dust particles in lens flare',
    consistencySeed: 8192733,
    referenceImages: [
      {
        id: 'ref_3',
        url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
        label: 'Optical Chassis Reference',
        isPrimary: true,
      },
    ],
    createdAt: '2026-09-19T11:20:00.000Z',
    updatedAt: '2026-09-21T14:10:00.000Z',
  },
];

const SEED_SCENES: Scene[] = [
  {
    id: 'scene_01_breach',
    projectId: 'proj_kepler_01',
    sequenceIndex: 1,
    title: 'The Bio-Dome Air-Lock Breach',
    scriptText: 'DR. ELENA VANCE clears frost from the outer observation viewport. The massive titanium locks groan under alien atmospheric pressure as frost vapor billows into the airlock chamber.',
    durationSeconds: 14,
    characterIds: ['char_elena_vance'],
    environment: 'Pressurized bio-dome airlock, condensation on reinforced glass, crimson emergency strobes',
    mood: 'High tension, cold claustrophobia, quiet anticipation',
    cameraMovement: 'Slow tracking dolly push-in from wide airlock frame to Dr. Vance’s eye reflection in the glass',
    soundDesignNotes: 'Heavy pneumatic hiss, metallic groan, low frequency 30Hz sub drone, Vance’s breathing in helmet mic',
    activeOptionIndex: 0,
    options: [
      {
        optionId: 'option-1',
        label: 'Option 1: Cold Cinematic Realism (Master Cut)',
        visualPrompt: 'Cinematic wide frame 16:9, Dr. Elena Vance in orange-trimmed pressurized suit wiping frost from curved airlock window, crimson warning light wash, condensation droplets, 35mm anamorphic lens flare, photorealistic.',
        previewUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        cameraAngle: 'Eye-level wide slowly creeping to medium close-up',
        lighting: 'Deep tungsten shadows with cold cyan rim light and pulsing emergency crimson',
        isCurrentSelection: true,
        status: 'ready',
      },
      {
        optionId: 'option-2',
        label: 'Option 2: Atmospheric Claustrophobia (Close Subject Focus)',
        visualPrompt: 'Tight macro close-up on Elena Vance helmet visor, extreme condensation, her dilated hazel eyes reflecting red warning strobe, deep shadows, cinematic grit.',
        previewUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
        cameraAngle: 'Dutch angle macro close-up',
        lighting: 'High contrast single-point warning strobe reflection',
        isCurrentSelection: false,
        status: 'ready',
      },
      {
        optionId: 'option-3',
        label: 'Option 3: Environmental Scale (Exterior Perspective)',
        visualPrompt: 'Exterior perspective through heavy alien precipitation, the massive circular bio-dome hatch iris slowly unsealing, tiny silhouetted astronaut figure inside glowing portal.',
        previewUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
        cameraAngle: 'Low-angle ultra-wide exterior',
        lighting: 'Alien bioluminescent mist with sharp searchlight beam cutting through fog',
        isCurrentSelection: false,
        status: 'ready',
      },
    ],
    createdAt: '2026-09-18T16:00:00.000Z',
    updatedAt: '2026-09-23T19:00:00.000Z',
  },
  {
    id: 'scene_02_flora',
    projectId: 'proj_kepler_01',
    sequenceIndex: 2,
    title: 'The Bioluminescent Canopy',
    scriptText: 'Elena steps into the central arboretum. What should have been dead hydroponics has mutated into a towering forest of violet phosphorescent ferns pulsing in sync with an unknown heartbeat.',
    durationSeconds: 18,
    characterIds: ['char_elena_vance', 'char_orion_unit'],
    environment: 'Abandoned subterranean greenhouse overgrown with pulsing violet and emerald flora',
    mood: 'Awe mixed with primal dread, hypnotic and ethereal',
    cameraMovement: 'Crane pedestal rise revealing the immense scale of the alien bio-canopy',
    soundDesignNotes: 'Organic crystalline chimes, subterranean pulse, soft organic crunch of spores under boot',
    activeOptionIndex: 0,
    options: [
      {
        optionId: 'option-1',
        label: 'Option 1: Bioluminescent Grandeur',
        visualPrompt: 'Vast overgrown bio-dome canopy, towering crystalline purple ferns with glowing veins, soft amber spore particulate floating in air, astronaut in orange suit stands dwarfed in foreground.',
        previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        cameraAngle: 'Wide crane sweep rising over shoulder',
        lighting: 'Self-illuminated violet and cyan bioluminescence with warm floating motes',
        isCurrentSelection: true,
        status: 'ready',
      },
      {
        optionId: 'option-2',
        label: 'Option 2: Tactile Organic Horror',
        visualPrompt: 'Medium shot of astronaut glove gently reaching toward a pulsing translucent alien blossom that shifts color upon approach, rich organic slime texture, macro depth of field.',
        previewUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        cameraAngle: 'Close tracking on gloved fingertips',
        lighting: 'Ethereal translucent backlight passing through alien petals',
        isCurrentSelection: false,
        status: 'ready',
      },
      {
        optionId: 'option-3',
        label: 'Option 3: Drone Survey Point-of-View',
        visualPrompt: 'Synthetic survey HUD overlay, LIDAR point cloud mesh mapping the mutated canopy, thermal signatures showing heat pulses circulating through the roots.',
        previewUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80',
        cameraAngle: 'Aerial robotic POV with telemetry overlay',
        lighting: 'Ultraviolet scanning laser grid illuminating organic contours',
        isCurrentSelection: false,
        status: 'ready',
      },
    ],
    createdAt: '2026-09-18T16:30:00.000Z',
    updatedAt: '2026-09-23T19:20:00.000Z',
  },
];

const SEED_ASSETS: Asset[] = [
  {
    id: 'asset_01',
    projectId: 'proj_kepler_01',
    userId: 'usr_moro_director',
    name: 'Kepler Bio-Dome Master Concept A',
    type: 'image',
    mimeType: 'image/png',
    fileSize: 4200000,
    storageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    tags: ['Concept', 'Exterior', 'Bio-Dome', '16:9'],
    width: 3840,
    height: 2160,
    metadata: { provider: 'midjourney-v6', seed: 491029 },
    createdAt: '2026-09-19T10:00:00.000Z',
    updatedAt: '2026-09-19T10:00:00.000Z',
  },
  {
    id: 'asset_02',
    projectId: 'proj_kepler_01',
    userId: 'usr_moro_director',
    name: 'Dr. Elena Vance Voice Sample (Calm Monologue)',
    type: 'voice',
    mimeType: 'audio/wav',
    fileSize: 1850000,
    storageUrl: '/sample-audio/vance_monologue.wav',
    durationSeconds: 24,
    tags: ['Voice', 'Protagonist', 'English', 'Monologue'],
    metadata: { provider: 'elevenlabs', voiceId: 'rachel_cinematic_calm', sampleRate: 48000 },
    createdAt: '2026-09-19T11:30:00.000Z',
    updatedAt: '2026-09-19T11:30:00.000Z',
  },
  {
    id: 'asset_03',
    projectId: 'proj_kepler_01',
    userId: 'usr_moro_director',
    name: 'Subterranean Ambient Theme (Kepler Deep)',
    type: 'audio',
    mimeType: 'audio/mp3',
    fileSize: 8400000,
    storageUrl: '/sample-audio/kepler_theme.mp3',
    durationSeconds: 180,
    tags: ['Music', 'Score', 'Dark Ambient', 'Synthesizer'],
    metadata: { provider: 'suno', bpm: 64, key: 'D-minor' },
    createdAt: '2026-09-20T08:00:00.000Z',
    updatedAt: '2026-09-20T08:00:00.000Z',
  },
  {
    id: 'asset_04',
    projectId: 'proj_kepler_01',
    userId: 'usr_moro_director',
    name: 'Kepler-186f Production Script v1.4',
    type: 'script',
    mimeType: 'application/pdf',
    fileSize: 245000,
    storageUrl: '/documents/kepler_script_v1_4.pdf',
    tags: ['Script', 'Screenplay', 'Approved'],
    metadata: { pageCount: 8, wordCount: 1840 },
    createdAt: '2026-09-20T14:00:00.000Z',
    updatedAt: '2026-09-21T09:00:00.000Z',
  },
];

export class LocalStorageAdapter implements IDatabaseAdapter {
  private user: User = { ...DEFAULT_USER };
  private settings: Settings = { ...DEFAULT_SETTINGS };
  private projects: Project[] = [...SEED_PROJECTS];
  private characters: Character[] = [...SEED_CHARACTERS];
  private scenes: Scene[] = [...SEED_SCENES];
  private assets: Asset[] = [...SEED_ASSETS];
  private generations: Generation[] = [];
  private jobs: GenerationJob[] = [];
  private models: ProviderModel[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) this.user = JSON.parse(storedUser);

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) this.settings = JSON.parse(storedSettings);

      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) this.projects = JSON.parse(storedProjects);

      const storedCharacters = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
      if (storedCharacters) this.characters = JSON.parse(storedCharacters);

      const storedScenes = localStorage.getItem(STORAGE_KEYS.SCENES);
      if (storedScenes) this.scenes = JSON.parse(storedScenes);

      const storedAssets = localStorage.getItem(STORAGE_KEYS.ASSETS);
      if (storedAssets) this.assets = JSON.parse(storedAssets);

      const storedGenerations = localStorage.getItem(STORAGE_KEYS.GENERATIONS);
      if (storedGenerations) this.generations = JSON.parse(storedGenerations);

      const storedJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (storedJobs) this.jobs = JSON.parse(storedJobs);
    } catch {
      // Fallback to seed data in memory if storage is restricted
    }
  }

  private saveToStorage(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // Memory state persists during session
    }
  }

  // Users
  async getUser(id: string): Promise<User | null> {
    return this.user.id === id ? this.user : null;
  }

  async getCurrentUser(): Promise<User> {
    return this.user;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return [...this.projects];
  }

  async getProjectById(id: string): Promise<Project | null> {
    const found = this.projects.find((p) => p.id === id);
    return found ? { ...found } : null;
  }

  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const newProject: Project = {
      ...projectData,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.unshift(newProject);
    this.saveToStorage(STORAGE_KEYS.PROJECTS, this.projects);
    return newProject;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Project ${id} not found`);
    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToStorage(STORAGE_KEYS.PROJECTS, this.projects);
    return this.projects[index];
  }

  async deleteProject(id: string): Promise<boolean> {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.scenes = this.scenes.filter((s) => s.projectId !== id);
    this.characters = this.characters.filter((c) => c.projectId !== id);
    this.assets = this.assets.filter((a) => a.projectId !== id);
    this.saveToStorage(STORAGE_KEYS.PROJECTS, this.projects);
    this.saveToStorage(STORAGE_KEYS.SCENES, this.scenes);
    this.saveToStorage(STORAGE_KEYS.CHARACTERS, this.characters);
    this.saveToStorage(STORAGE_KEYS.ASSETS, this.assets);
    return true;
  }

  // Assets
  async getAssets(projectId?: string): Promise<Asset[]> {
    if (!projectId) return [...this.assets];
    return this.assets.filter((a) => a.projectId === projectId);
  }

  async getAssetById(id: string): Promise<Asset | null> {
    const found = this.assets.find((a) => a.id === id);
    return found ? { ...found } : null;
  }

  async createAsset(assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> {
    const newAsset: Asset = {
      ...assetData,
      id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.assets.unshift(newAsset);
    this.saveToStorage(STORAGE_KEYS.ASSETS, this.assets);
    return newAsset;
  }

  async deleteAsset(id: string): Promise<boolean> {
    this.assets = this.assets.filter((a) => a.id !== id);
    this.saveToStorage(STORAGE_KEYS.ASSETS, this.assets);
    return true;
  }

  // Characters
  async getCharacters(projectId?: string): Promise<Character[]> {
    if (!projectId) return [...this.characters];
    return this.characters.filter((c) => c.projectId === projectId);
  }

  async getCharacterById(id: string): Promise<Character | null> {
    const found = this.characters.find((c) => c.id === id);
    return found ? { ...found } : null;
  }

  async createCharacter(characterData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): Promise<Character> {
    const newCharacter: Character = {
      ...characterData,
      id: `char_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.characters.push(newCharacter);
    this.saveToStorage(STORAGE_KEYS.CHARACTERS, this.characters);
    return newCharacter;
  }

  async updateCharacter(id: string, updates: Partial<Character>): Promise<Character> {
    const index = this.characters.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Character ${id} not found`);
    this.characters[index] = {
      ...this.characters[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToStorage(STORAGE_KEYS.CHARACTERS, this.characters);
    return this.characters[index];
  }

  async deleteCharacter(id: string): Promise<boolean> {
    this.characters = this.characters.filter((c) => c.id !== id);
    this.saveToStorage(STORAGE_KEYS.CHARACTERS, this.characters);
    return true;
  }

  // Scenes
  async getScenes(projectId: string): Promise<Scene[]> {
    return this.scenes
      .filter((s) => s.projectId === projectId)
      .sort((a, b) => a.sequenceIndex - b.sequenceIndex);
  }

  async getSceneById(id: string): Promise<Scene | null> {
    const found = this.scenes.find((s) => s.id === id);
    return found ? { ...found } : null;
  }

  async createScene(sceneData: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scene> {
    const newScene: Scene = {
      ...sceneData,
      id: `scene_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.scenes.push(newScene);
    this.saveToStorage(STORAGE_KEYS.SCENES, this.scenes);
    return newScene;
  }

  async updateScene(id: string, updates: Partial<Scene>): Promise<Scene> {
    const index = this.scenes.findIndex((s) => s.id === id);
    if (index === -1) throw new Error(`Scene ${id} not found`);
    this.scenes[index] = {
      ...this.scenes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToStorage(STORAGE_KEYS.SCENES, this.scenes);
    return this.scenes[index];
  }

  async deleteScene(id: string): Promise<boolean> {
    this.scenes = this.scenes.filter((s) => s.id !== id);
    this.saveToStorage(STORAGE_KEYS.SCENES, this.scenes);
    return true;
  }

  async reorderScenes(projectId: string, sceneIds: string[]): Promise<Scene[]> {
    this.scenes.forEach((scene) => {
      if (scene.projectId === projectId) {
        const newIndex = sceneIds.indexOf(scene.id);
        if (newIndex !== -1) {
          scene.sequenceIndex = newIndex + 1;
        }
      }
    });
    this.saveToStorage(STORAGE_KEYS.SCENES, this.scenes);
    return this.getScenes(projectId);
  }

  // Generations
  async getGenerations(projectId?: string): Promise<Generation[]> {
    if (!projectId) return [...this.generations];
    return this.generations.filter((g) => g.projectId === projectId);
  }

  async recordGeneration(genData: Omit<Generation, 'id' | 'createdAt'>): Promise<Generation> {
    const newGen: Generation = {
      ...genData,
      id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.generations.unshift(newGen);
    this.saveToStorage(STORAGE_KEYS.GENERATIONS, this.generations);
    return newGen;
  }

  // Jobs
  async getJobs(projectId?: string): Promise<GenerationJob[]> {
    if (!projectId) return [...this.jobs];
    return this.jobs.filter((j) => j.projectId === projectId);
  }

  async createJob(jobData: Omit<GenerationJob, 'id' | 'createdAt'>): Promise<GenerationJob> {
    const newJob: GenerationJob = {
      ...jobData,
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.jobs.unshift(newJob);
    this.saveToStorage(STORAGE_KEYS.JOBS, this.jobs);
    return newJob;
  }

  async updateJob(id: string, updates: Partial<GenerationJob>): Promise<GenerationJob> {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index === -1) throw new Error(`Job ${id} not found`);
    this.jobs[index] = {
      ...this.jobs[index],
      ...updates,
    };
    this.saveToStorage(STORAGE_KEYS.JOBS, this.jobs);
    return this.jobs[index];
  }

  // Settings
  async getSettings(): Promise<Settings> {
    return { ...this.settings };
  }

  async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    this.settings = {
      ...this.settings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
    return { ...this.settings };
  }

  // Provider Models
  async getProviderModels(): Promise<ProviderModel[]> {
    return [...this.models];
  }

  async updateProviderModel(id: string, updates: Partial<ProviderModel>): Promise<ProviderModel> {
    const index = this.models.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Model ${id} not found`);
    this.models[index] = {
      ...this.models[index],
      ...updates,
    };
    this.saveToStorage(STORAGE_KEYS.MODELS, this.models);
    return this.models[index];
  }
}
