/**
 * Moro Core
 *
 * The central creative layer of Moro AI. It does NOT reimplement any existing
 * system — it composes them into one coherent flow and exposes the contracts
 * that every current and future module shares:
 *
 *   USER INPUT → MORO CORE → PROJECT UNDERSTANDING → CREATIVE PLANNING →
 *   AI ROUTER → 3 CANDIDATES PER OUTPUT → USER SELECTION → CREATIVE PACKAGE
 *
 * Reused systems (never duplicated):
 *   - MoroCreativeOptionService   → 3-option generation & replacement engine
 *   - aiRouter (AIRouter)         → provider-independent routing & fallback
 *   - PipelineOrchestrator        → staged content-understanding computation
 *   - db (IDatabaseAdapter)       → persistence abstraction
 */

import {
  CreativeCategory,
  CreativeDecision,
  ContentUnderstandingAnalysis,
  ProjectCreativeDecisions,
  UploadedInputFile,
} from '../../types/creative-options';
import {
  CreativeModuleDescriptor,
  CreativePackage,
  CreativePackageSelection,
  MoroProjectContext,
  ProjectSource,
  ProjectSourceKind,
} from '../../types/core';
import { RouteRequest } from '../../types/ai-router';
import {
  CreativeContextPayload,
  MoroCreativeOptionService,
} from '../creative/CreativeOptionProviders';
import { aiRouter } from '../ai-router';

const nowIso = () => new Date().toISOString();
const uid = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

export class MoroCore {
  // ===========================================================================
  // Project Sources — turn raw user input into first-class, traceable sources.
  // ===========================================================================

  static createTextSource(text: string, label?: string): ProjectSource {
    return {
      id: uid('src'),
      kind: 'text',
      label: label || 'Direct text input',
      rawText: text,
      extractedSummary: text.trim().slice(0, 240),
      createdAt: nowIso(),
    };
  }

  static createSourceFromUpload(file: UploadedInputFile): ProjectSource {
    const ext = (file.extension || '').toLowerCase();
    const kind: ProjectSourceKind = file.mimeType?.startsWith('image/')
      ? 'image'
      : ext === 'pdf' || ext === 'txt' || ext === 'docx'
        ? (ext as ProjectSourceKind)
        : 'reference';

    return {
      id: file.id || uid('src'),
      kind,
      label: file.name,
      mimeType: file.mimeType,
      sizeBytes: file.size,
      previewUrl: file.previewUrl,
      extractedSummary: file.extractedTextSummary,
      originExtension: file.extension,
      createdAt: file.uploadTimestamp || nowIso(),
    };
  }

  /** Builds the full source set from the multi-format input (text + files). */
  static sourcesFromInput(
    rawText: string,
    uploadedFiles: UploadedInputFile[] = []
  ): ProjectSource[] {
    const sources: ProjectSource[] = [];
    if (rawText && rawText.trim()) {
      sources.push(this.createTextSource(rawText));
    }
    uploadedFiles.forEach((f) => sources.push(this.createSourceFromUpload(f)));
    return sources;
  }

  // ===========================================================================
  // Project Understanding — the ONE shared context every module reads from.
  // ===========================================================================

  static buildProjectContext(params: {
    projectId?: string;
    title: string;
    sources: ProjectSource[];
    style: string;
    targetDurationSeconds: number;
    aspectRatio: string;
    understanding?: Partial<ContentUnderstandingAnalysis>;
  }): MoroProjectContext {
    const understanding: ContentUnderstandingAnalysis = {
      stage: params.understanding?.stage || 'ready',
      progressPercent: params.understanding?.progressPercent ?? 100,
      extractedTheme: params.understanding?.extractedTheme || '',
      extractedContext: params.understanding?.extractedContext || '',
      detectedEntities: params.understanding?.detectedEntities || [],
      suggestedTone: params.understanding?.suggestedTone || '',
      suggestedFormat: params.understanding?.suggestedFormat || '',
      directorNotesSummary: params.understanding?.directorNotesSummary || '',
    };

    return {
      projectId: params.projectId,
      title: params.title,
      sources: params.sources,
      understanding,
      theme: understanding.extractedTheme,
      context: understanding.extractedContext,
      entities: understanding.detectedEntities,
      tone: understanding.suggestedTone,
      style: params.style,
      format: understanding.suggestedFormat,
      directorNotes: understanding.directorNotesSummary,
      targetDurationSeconds: params.targetDurationSeconds,
      aspectRatio: params.aspectRatio,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
  }

  /**
   * Derives the payload the creative option providers expect from the shared
   * project context — so every module plans from the same understanding.
   */
  static toCreativeContext(ctx: MoroProjectContext): CreativeContextPayload {
    const textSources = ctx.sources
      .map((s) => s.rawText)
      .filter((t): t is string => Boolean(t && t.trim()));

    return {
      projectId: ctx.projectId,
      projectTitle: ctx.title,
      rawText: textSources.join('\n\n'),
      userPerspectiveDescription: ctx.directorNotes,
      style: ctx.style,
      targetDurationSeconds: ctx.targetDurationSeconds,
      uploadedFilesSummary: ctx.sources.map((s) => `${s.label} (${s.kind})`),
    };
  }

  // ===========================================================================
  // Creative Planning — the 3-option system (delegates to the shared engine).
  // Each operation is independent per category.
  // ===========================================================================

  /** Generates the full initial decision set across all core categories. */
  static generateCreativeDecisions(
    context: CreativeContextPayload
  ): Promise<ProjectCreativeDecisions> {
    return MoroCreativeOptionService.generateInitialDecisions(context);
  }

  /** Generate three fresh candidates for a SINGLE category only. */
  static generateThree(
    category: CreativeCategory,
    context: CreativeContextPayload
  ): Promise<CreativeDecision> {
    return MoroCreativeOptionService.generateCategory(category, context);
  }

  /** Select one option in a category without affecting other categories. */
  static selectOption<T>(
    decision: CreativeDecision<T>,
    optionId: string
  ): CreativeDecision<T> {
    return MoroCreativeOptionService.selectOption(decision, optionId);
  }

  /** Regenerate ONLY one option, preserving the other two and every other category. */
  static regenerateOne<T>(
    category: CreativeCategory,
    optionId: string,
    decision: CreativeDecision<T>,
    context: CreativeContextPayload
  ): Promise<CreativeDecision<T>> {
    return MoroCreativeOptionService.replaceCategorySingle(category, optionId, decision, context);
  }

  /** Alias of regenerateOne — replace a single option in place. */
  static replaceOption<T>(
    category: CreativeCategory,
    optionId: string,
    decision: CreativeDecision<T>,
    context: CreativeContextPayload
  ): Promise<CreativeDecision<T>> {
    return this.regenerateOne(category, optionId, decision, context);
  }

  /** Regenerate all three options of ONE category, leaving other categories intact. */
  static regenerateCategory<T>(
    category: CreativeCategory,
    decision: CreativeDecision<T>,
    context: CreativeContextPayload
  ): Promise<CreativeDecision<T>> {
    return MoroCreativeOptionService.replaceCategoryAll(category, decision, context);
  }

  /** Reject an entire category so the UI can offer to replace just that output. */
  static rejectCategory<T>(decision: CreativeDecision<T>): CreativeDecision<T> {
    return {
      ...decision,
      generationStatus: 'rejected',
      userModified: true,
    };
  }

  // ===========================================================================
  // AI Router — provider independence. Moro Core never binds to one provider.
  // ===========================================================================

  static resolveRoute(request: RouteRequest) {
    return aiRouter.resolveRoute(request);
  }

  static executeWithFallback<T>(
    request: RouteRequest,
    action: Parameters<typeof aiRouter.executeWithFallback<T>>[1]
  ) {
    return aiRouter.executeWithFallback<T>(request, action);
  }

  // ===========================================================================
  // Creative Package — the final bundle of independent user selections.
  // ===========================================================================

  static assembleCreativePackage(
    projectTitle: string,
    decisions: ProjectCreativeDecisions,
    projectId?: string
  ): CreativePackage {
    const selections: CreativePackageSelection[] = Object.values(decisions)
      .filter((d): d is CreativeDecision => Boolean(d))
      .map((decision) => {
        const selected = decision.options.find((o) => o.id === decision.selectedOptionId);
        const rejected = decision.generationStatus === 'rejected';
        return {
          category: decision.category,
          categoryLabelEn: decision.categoryLabelEn,
          categoryLabelAr: decision.categoryLabelAr,
          selectedOptionId: decision.selectedOptionId,
          optionTitle: selected?.title || '',
          state: rejected ? 'rejected' : 'ready',
        };
      });

    return {
      projectId,
      projectTitle,
      selections,
      createdAt: nowIso(),
    };
  }

  // ===========================================================================
  // Module Registry — current + planned tools that plug into Moro Core.
  // ===========================================================================

  static readonly modules: CreativeModuleDescriptor[] = [
    { id: 'story', labelEn: 'Story Generation', labelAr: 'توليد القصة', status: 'planned', producesOptions: true, providerType: 'text' },
    { id: 'scene', labelEn: 'Scene Concept', labelAr: 'مفهوم المشهد', category: 'scene', status: 'active', producesOptions: true },
    { id: 'tone', labelEn: 'Narrative Tone', labelAr: 'نبرة السرد', category: 'tone', status: 'active', producesOptions: true },
    { id: 'image', labelEn: 'Image Generation', labelAr: 'توليد الصور', category: 'image', providerType: 'image', status: 'active', producesOptions: true },
    { id: 'voice', labelEn: 'Voice Generation', labelAr: 'توليد الصوت', category: 'voice', providerType: 'voice', status: 'active', producesOptions: true },
    { id: 'video', labelEn: 'Video Generation', labelAr: 'توليد الفيديو', providerType: 'video', status: 'planned', producesOptions: true },
    { id: 'music', labelEn: 'Music Generation', labelAr: 'توليد الموسيقى', providerType: 'music', status: 'planned', producesOptions: true },
    { id: 'cover', labelEn: 'Cover Design', labelAr: 'تصميم الغلاف', providerType: 'image', status: 'planned', producesOptions: true },
    { id: 'characters', labelEn: 'Characters', labelAr: 'الشخصيات', status: 'active', producesOptions: false },
    { id: 'subtitles', labelEn: 'Subtitles', labelAr: 'الترجمة النصية', providerType: 'speech-to-text', status: 'planned', producesOptions: false },
    { id: 'dubbing', labelEn: 'Dubbing', labelAr: 'الدبلجة', providerType: 'dubbing', status: 'planned', producesOptions: false },
    { id: 'editing', labelEn: 'Video Editing', labelAr: 'المونتاج', status: 'planned', producesOptions: false },
    { id: 'analysis', labelEn: 'Long-form Analysis', labelAr: 'تحليل المحتوى الطويل', providerType: 'text', status: 'planned', producesOptions: false },
    { id: 'repurposing', labelEn: 'Social Repurposing', labelAr: 'إعادة الإنتاج للمنصات', status: 'planned', producesOptions: false },
    { id: 'publishing', labelEn: 'Publishing', labelAr: 'النشر', status: 'planned', producesOptions: false },
  ];

  static getActiveModules(): CreativeModuleDescriptor[] {
    return this.modules.filter((m) => m.status === 'active');
  }
}

export const moroCore = MoroCore;
