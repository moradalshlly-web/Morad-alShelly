/**
 * Content Understanding Types
 * Structured representation of Moro AI's understanding of a creative project
 * before any generation occurs.
 *
 * Design principle: Do NOT invent missing story information.
 * When information is unclear or missing, represent it as:
 *   - 'unknown'           — no evidence in the sources
 *   - 'ambiguous'          — conflicting or vague evidence
 *   - 'needs-clarification' — enough signal to ask, not enough to assert
 */

export type UnderstandingFieldStatus =
  | 'known'
  | 'unknown'
  | 'ambiguous'
  | 'needs-clarification';

export type EntityType =
  | 'character'
  | 'location'
  | 'object'
  | 'event'
  | 'organization'
  | 'concept';

/** A single entity extracted from project sources. */
export interface UnderstoodEntity {
  id: string;
  name: string;
  type: EntityType;
  description: string;
  status: UnderstandingFieldStatus;
  /** Which source file(s) mention this entity (file IDs or names). */
  sourceReferences: string[];
}

/** A relationship between two understood entities. */
export interface UnderstoodRelationship {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  relationshipType: string;
  description: string;
  status: UnderstandingFieldStatus;
}

/** An unresolved or ambiguous point that the user should clarify. */
export interface UnresolvedIssue {
  id: string;
  field: string;
  description: string;
  status: UnderstandingFieldStatus;
  suggestion?: string;
}

/** Reference to a source file that contributed to the understanding. */
export interface SourceReference {
  fileId: string;
  fileName: string;
  format: string;
  /** What this source contributed (e.g. 'full text', 'image reference', 'not yet parsed'). */
  contribution: string;
}

/**
 * The comprehensive, structured understanding of a creative project.
 * This is the single shared context that all future creative engines consume:
 *
 *   Central Project Context
 *   ├── Visual Engine
 *   ├── Character Engine
 *   ├── Voice Engine
 *   ├── Video Engine
 *   ├── Music Engine
 *   ├── Dubbing Engine
 *   └── Publishing / Repurposing
 */
export interface ProjectUnderstanding {
  // ── Core Narrative ──────────────────────────────────────────
  title: string;
  titleStatus: UnderstandingFieldStatus;
  premise: string;
  premiseStatus: UnderstandingFieldStatus;
  mainStory: string;
  mainStoryStatus: UnderstandingFieldStatus;

  // ── Thematic & Tonal ───────────────────────────────────────
  themes: string[];
  themesStatus: UnderstandingFieldStatus;
  genre: string;
  genreStatus: UnderstandingFieldStatus;
  tone: string;
  toneStatus: UnderstandingFieldStatus;
  narrativeStyle: string;
  narrativeStyleStatus: UnderstandingFieldStatus;

  // ── World Building ─────────────────────────────────────────
  setting: string;
  settingStatus: UnderstandingFieldStatus;
  worldInformation: string;
  worldInformationStatus: UnderstandingFieldStatus;
  timePeriod: string;
  timePeriodStatus: UnderstandingFieldStatus;
  locations: string[];
  locationsStatus: UnderstandingFieldStatus;

  // ── Story Elements ────────────────────────────────────────
  importantEvents: string[];
  importantEventsStatus: UnderstandingFieldStatus;
  entities: UnderstoodEntity[];
  relationships: UnderstoodRelationship[];
  importantObjects: string[];
  importantObjectsStatus: UnderstandingFieldStatus;

  // ── Creative Direction ────────────────────────────────────
  visualImplications: string[];
  visualImplicationsStatus: UnderstandingFieldStatus;
  constraints: string[];
  constraintsStatus: UnderstandingFieldStatus;

  // ── Provenance & Meta ──────────────────────────────────────
  sourceReferences: SourceReference[];
  unresolvedIssues: UnresolvedIssue[];
  /** Overall confidence in the understanding. */
  understandingStatus: UnderstandingFieldStatus;
  analyzedAt: string;
}

/**
 * Parameters for building a project understanding from available sources.
 */
export interface UnderstandingBuildParams {
  rawText?: string;
  userPerspective?: string;
  projectTitle?: string;
  selectedStyle?: string;
  /** Parsed file results from the SourceFileParser system. */
  parsedFiles?: ParsedFileResult[];
  /** Metadata of uploaded files (for provenance tracking). */
  uploadedFileMetas?: Array<{ id: string; name: string; extension: string }>;
}

/**
 * Result of parsing a single source file.
 * Honest representation: 'parsed' means real text was extracted;
 * 'not-implemented' means the format is accepted but no parser exists yet.
 */
export interface ParsedFileResult {
  fileId: string;
  fileName: string;
  extension: string;
  mimeType: string;
  status: 'parsed' | 'not-implemented' | 'error';
  extractedText?: string;
  textPreview?: string;
  wordCount?: number;
  errorMessage?: string;
  parserName: string;
}
