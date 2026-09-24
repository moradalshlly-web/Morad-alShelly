/**
 * IDatabaseAdapter
 * Clean abstraction layer allowing seamless swapping between
 * local development state and PostgreSQL / Supabase in production.
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

export interface IDatabaseAdapter {
  // Users
  getUser(id: string): Promise<User | null>;
  getCurrentUser(): Promise<User>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<boolean>;

  // Assets
  getAssets(projectId?: string): Promise<Asset[]>;
  getAssetById(id: string): Promise<Asset | null>;
  createAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset>;
  deleteAsset(id: string): Promise<boolean>;

  // Characters
  getCharacters(projectId?: string): Promise<Character[]>;
  getCharacterById(id: string): Promise<Character | null>;
  createCharacter(character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): Promise<Character>;
  updateCharacter(id: string, updates: Partial<Character>): Promise<Character>;
  deleteCharacter(id: string): Promise<boolean>;

  // Scenes
  getScenes(projectId: string): Promise<Scene[]>;
  getSceneById(id: string): Promise<Scene | null>;
  createScene(scene: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scene>;
  updateScene(id: string, updates: Partial<Scene>): Promise<Scene>;
  deleteScene(id: string): Promise<boolean>;
  reorderScenes(projectId: string, sceneIds: string[]): Promise<Scene[]>;

  // Generations
  getGenerations(projectId?: string): Promise<Generation[]>;
  recordGeneration(generation: Omit<Generation, 'id' | 'createdAt'>): Promise<Generation>;

  // Jobs
  getJobs(projectId?: string): Promise<GenerationJob[]>;
  createJob(job: Omit<GenerationJob, 'id' | 'createdAt'>): Promise<GenerationJob>;
  updateJob(id: string, updates: Partial<GenerationJob>): Promise<GenerationJob>;

  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(updates: Partial<Settings>): Promise<Settings>;

  // Provider Models (custom registry overrides)
  getProviderModels(): Promise<ProviderModel[]>;
  updateProviderModel(id: string, updates: Partial<ProviderModel>): Promise<ProviderModel>;
}
