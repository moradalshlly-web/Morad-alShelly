/**
 * Moro Core — Central Creative Platform Contracts
 *
 * Moro Core is the single central layer every current and future tool shares:
 *
 *   USER INPUT → MORO CORE → PROJECT UNDERSTANDING → CREATIVE PLANNING →
 *   AI ROUTER → 3 CANDIDATES PER OUTPUT → USER SELECTION → CREATIVE PACKAGE
 *
 * These are contracts only. They compose the existing systems
 * (AI Router, Provider abstraction, CreativeOption/CreativeDecision, Pipeline,
 * persistence) instead of replacing any of them.
 */

import { ProviderType } from './providers';
import {
  CreativeCategory,
  ContentUnderstandingAnalysis,
  ContentUnderstandingStage,
} from './creative-options';

// -----------------------------------------------------------------------------
// 1. Project Sources — first-class, referenceable inputs attached to a project.
//    A source is NOT just an upload: Moro Core can always trace back to it.
// -----------------------------------------------------------------------------

export type ProjectSourceKind =
  | 'text' // text typed directly by the user
  | 'pdf'
  | 'txt'
  | 'docx'
  | 'image'
  | 'reference' // reference asset / concept art
  | 'link'
  | string;

export interface ProjectSource {
  id: string;
  projectId?: string;
  kind: ProjectSourceKind;
  label: string;
  mimeType?: string;
  sizeBytes?: number;
  previewUrl?: string;
  /** Direct text, or text extracted/parsed from a document. */
  rawText?: string;
  /** Short human/AI summary of what this source contributes. */
  extractedSummary?: string;
  originExtension?: string;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// 2. Moro Project Context — the ONE shared understanding of the project.
//    Every module (image, video, voice, music, cover, story, editor, ...)
//    reads from this same context instead of storing its own copy.
// -----------------------------------------------------------------------------

export type MoroContextStage = ContentUnderstandingStage;

export interface MoroProjectContext {
  projectId?: string;
  title: string;
  sources: ProjectSource[];
  understanding: ContentUnderstandingAnalysis;
  theme: string;
  context: string;
  entities: string[];
  tone: string;
  style: string;
  format: string;
  directorNotes?: string;
  targetDurationSeconds: number;
  aspectRatio: string;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// 3. Independent per-category generation lifecycle.
//    Selecting/regenerating one category never resets another.
// -----------------------------------------------------------------------------

export type CreativeGenerationState =
  | 'idle'
  | 'generating'
  | 'ready'
  | 'failed'
  | 'rejected';

/** A request to (re)generate options for a single creative category. */
export interface CreativeGenerationRequest {
  category: CreativeCategory;
  /** When present, only this option is replaced; otherwise all three. */
  targetOptionId?: string;
  providerType?: ProviderType;
}

// -----------------------------------------------------------------------------
// 4. Creative Package — the final bundle of independent user selections.
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// 5. Creative Module Registry — describes the tools that plug into Moro Core.
//    Future tools become Modules over the Core; contracts exist now, but
//    unimplemented modules are simply marked 'planned'.
// -----------------------------------------------------------------------------

export type CreativeModuleId =
  | 'story'
  | 'image'
  | 'video'
  | 'voice'
  | 'music'
  | 'tone'
  | 'scene'
  | 'cover'
  | 'characters'
  | 'subtitles'
  | 'dubbing'
  | 'editing'
  | 'analysis'
  | 'repurposing'
  | 'publishing';

export interface CreativeModuleDescriptor {
  id: CreativeModuleId;
  labelEn: string;
  labelAr: string;
  /** Underlying provider modality routed through the AI Router, if any. */
  providerType?: ProviderType;
  /** Creative category this module drives in the 3-option system, if any. */
  category?: CreativeCategory;
  status: 'active' | 'planned';
  /** Whether this module participates in the 3-candidates-per-output system. */
  producesOptions: boolean;
}
