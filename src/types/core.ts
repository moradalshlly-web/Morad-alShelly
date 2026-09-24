import { ProjectUnderstanding } from '../../types/content-understanding';
import { UploadedInputFile, CreativeCategory, CreativeDecision, ProjectCreativeDecisions } from '../../types/creative-options';
import { ProviderType } from '../../types/providers';

export type ProjectSourceKind = 'text' | 'pdf' | 'txt' | 'docx' | 'image' | 'reference' | 'link' | string;

export interface ProjectSource {
  id: string;
  projectId?: string;
  kind: ProjectSourceKind;
  label: string;
  mimeType?: string;
  sizeBytes?: number;
  previewUrl?: string;
  rawText?: string;
  extractedSummary?: string;
  originExtension?: string;
  createdAt: string;
}

/** The single context shared by all Moro creative modules. */
export interface MoroProjectContext {
  projectId?: string;
  title: string;
  sources: ProjectSource[];
  /** Authoritative structured result from ContentUnderstandingService. */
  understanding: ProjectUnderstanding;
  style: string;
  targetDurationSeconds: number;
  aspectRatio: string;
  createdAt: string;
  updatedAt: string;
}

export type CreativeGenerationState = 'idle' | 'generating' | 'ready' | 'failed' | 'rejected';

export interface CreativeGenerationRequest {
  category: CreativeCategory;
  targetOptionId?: string;
  providerType?: ProviderType;
}

export interface CreativePackageSelection {
  category: CreativeCategory;
  categoryLabelEn: string;
  categoryLabelAr: string;
  selectedOptionId: string;
  optionTitle: string;
  state: CreativeGenerationState;
}

export interface CreativePackage {
  projectId?: string;
  projectTitle: string;
  selections: CreativePackageSelection[];
  createdAt: string;
}

export type CreativeModuleId =
  | 'story' | 'characters' | 'scene' | 'image' | 'video' | 'voice' | 'music'
  | 'subtitles' | 'dubbing' | 'editing' | 'tone' | 'cover' | 'analysis'
  | 'repurposing' | 'publishing';

export interface CreativeModuleDescriptor {
  id: CreativeModuleId;
  labelEn: string;
  labelAr: string;
  providerType?: ProviderType;
  category?: CreativeCategory;
  status: 'active' | 'planned';
  producesOptions: boolean;
}

export type MoroInput = {
  rawText?: string;
  uploadedFiles?: UploadedInputFile[];
};

export type MoroDecisionSet = ProjectCreativeDecisions;
export type MoroDecision = CreativeDecision;
