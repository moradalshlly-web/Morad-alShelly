import { CreativeCategory, CreativeDecision, ProjectCreativeDecisions, UploadedInputFile } from '../../types/creative-options';
import { ProjectUnderstanding, UnderstandingBuildParams } from '../../types/content-understanding';
import { RouteRequest } from '../../types/ai-router';
import {
  CreativeModuleDescriptor,
  CreativePackage,
  CreativePackageSelection,
  MoroProjectContext,
  ProjectSource,
  ProjectSourceKind,
} from '../../types/core';
import { CreativeContextPayload, MoroCreativeOptionService } from '../creative/CreativeOptionProviders';
import { aiRouter } from '../ai-router';
import { ContentUnderstandingAdapter } from './ContentUnderstandingAdapter';

const nowIso = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** Provider-independent orchestration boundary for Moro creative workflows. */
export class MoroCore {
  static createTextSource(text: string, label = 'Direct text input'): ProjectSource {
    return {
      id: uid('src'),
      kind: 'text',
      label,
      rawText: text,
      extractedSummary: text.trim().slice(0, 240),
      createdAt: nowIso(),
    };
  }

  static createSourceFromUpload(file: UploadedInputFile): ProjectSource {
    const ext = (file.extension || '').toLowerCase();
    const kind: ProjectSourceKind = file.mimeType?.startsWith('image/')
      ? 'image'
      : ['pdf', 'txt', 'docx'].includes(ext)
        ? ext
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

  static sourcesFromInput(rawText: string, uploadedFiles: UploadedInputFile[] = []): ProjectSource[] {
    return [
      rawText?.trim() ? this.createTextSource(rawText) : null,
      ...uploadedFiles.map((file) => this.createSourceFromUpload(file)),
    ].filter((source): source is ProjectSource => Boolean(source));
  }

  static buildProjectContext(params: {
    projectId?: string;
    title: string;
    sources: ProjectSource[];
    style: string;
    targetDurationSeconds: number;
    aspectRatio: string;
    understanding: ProjectUnderstanding;
  }): MoroProjectContext {
    return ContentUnderstandingAdapter.toMoroProjectContext(params.understanding, params);
  }

  /** Builds the single shared context from UI/Base44 input through the adapter. */
  static buildProjectContextFromInput(params: {
    projectId?: string;
    rawText: string;
    uploadedFiles?: UploadedInputFile[];
    understanding: UnderstandingBuildParams;
    title: string;
    style: string;
    targetDurationSeconds: number;
    aspectRatio: string;
  }): MoroProjectContext {
    const understanding = ContentUnderstandingAdapter.buildUnderstanding(params.understanding);
    return this.buildProjectContext({
      projectId: params.projectId,
      title: params.title,
      sources: this.sourcesFromInput(params.rawText, params.uploadedFiles),
      style: params.style,
      targetDurationSeconds: params.targetDurationSeconds,
      aspectRatio: params.aspectRatio,
      understanding,
    });
  }

  /** ContentUnderstandingService remains authoritative behind this adapter boundary. */
  static buildUnderstanding = ContentUnderstandingAdapter.buildUnderstanding;

  static toCreativeContext(ctx: MoroProjectContext): CreativeContextPayload {
    const { understanding } = ctx;
    return {
      projectId: ctx.projectId,
      projectTitle: ctx.title,
      rawText: understanding.mainStory,
      userPerspectiveDescription: understanding.visualImplications.join('\n'),
      style: ctx.style,
      genre: understanding.genre,
      targetDurationSeconds: ctx.targetDurationSeconds,
      uploadedFilesSummary: ctx.sources.map((source) => `${source.label} (${source.kind})`),
    };
  }

  static generateCreativeDecisions(context: CreativeContextPayload): Promise<ProjectCreativeDecisions> {
    return MoroCreativeOptionService.generateInitialDecisions(context);
  }

  static async generateThree(category: CreativeCategory, context: CreativeContextPayload): Promise<CreativeDecision> {
    const decisions = await MoroCreativeOptionService.generateInitialDecisions(context);
    const decision = decisions[category];
    if (!decision) throw new Error(`Unsupported category: ${category}`);
    return decision;
  }

  static selectOption<T>(decision: CreativeDecision<T>, optionId: string): CreativeDecision<T> {
    return MoroCreativeOptionService.selectOption(decision, optionId);
  }

  static regenerateOne<T>(category: CreativeCategory, optionId: string, decision: CreativeDecision<T>, context: CreativeContextPayload) {
    return MoroCreativeOptionService.replaceCategorySingle(category, optionId, decision, context);
  }

  static replaceOption<T>(category: CreativeCategory, optionId: string, decision: CreativeDecision<T>, context: CreativeContextPayload) {
    return this.regenerateOne(category, optionId, decision, context);
  }

  static regenerateCategory<T>(category: CreativeCategory, decision: CreativeDecision<T>, context: CreativeContextPayload) {
    return MoroCreativeOptionService.replaceCategoryAll(category, decision, context);
  }

  static rejectCategory<T>(decision: CreativeDecision<T>): CreativeDecision<T> {
    return { ...decision, generationStatus: 'rejected', userModified: true };
  }

  static resolveRoute(request: RouteRequest) {
    return aiRouter.resolveRoute(request);
  }

  static executeWithFallback<T>(request: RouteRequest, action: (model: unknown) => Promise<T>) {
    return aiRouter.executeWithFallback(request, action);
  }

  static assembleCreativePackage(projectTitle: string, decisions: ProjectCreativeDecisions, projectId?: string): CreativePackage {
    const selections: CreativePackageSelection[] = Object.values(decisions).filter(Boolean).map((decision) => {
      const selected = decision.options.find((option) => option.id === decision.selectedOptionId);
      return {
        category: decision.category,
        categoryLabelEn: decision.categoryLabelEn,
        categoryLabelAr: decision.categoryLabelAr,
        selectedOptionId: decision.selectedOptionId,
        optionTitle: selected?.title || '',
        state: decision.generationStatus === 'rejected' ? 'rejected' : 'ready',
      };
    });
    return { projectId, projectTitle, selections, createdAt: nowIso() };
  }

  static readonly modules: CreativeModuleDescriptor[] = [
    { id: 'story', labelEn: 'Story Generation', labelAr: 'توليد القصة', providerType: 'text', status: 'planned', producesOptions: true },
    { id: 'characters', labelEn: 'Characters', labelAr: 'الشخصيات', status: 'active', producesOptions: false },
    { id: 'scene', labelEn: 'Scene Concept', labelAr: 'مفهوم المشهد', category: 'scene', status: 'active', producesOptions: true },
    { id: 'image', labelEn: 'Image Generation', labelAr: 'توليد الصور', category: 'image', providerType: 'image', status: 'active', producesOptions: true },
    { id: 'video', labelEn: 'Video Generation', labelAr: 'توليد الفيديو', providerType: 'video', status: 'planned', producesOptions: true },
    { id: 'voice', labelEn: 'Voice Generation', labelAr: 'توليد الصوت', category: 'voice', providerType: 'voice', status: 'active', producesOptions: true },
    { id: 'music', labelEn: 'Music Generation', labelAr: 'توليد الموسيقى', providerType: 'music', status: 'planned', producesOptions: true },
    { id: 'subtitles', labelEn: 'Subtitles', labelAr: 'الترجمة النصية', providerType: 'speech-to-text', status: 'planned', producesOptions: false },
    { id: 'dubbing', labelEn: 'Dubbing', labelAr: 'الدبلجة', providerType: 'dubbing', status: 'planned', producesOptions: false },
    { id: 'editing', labelEn: 'Video Editing', labelAr: 'المونتاج', status: 'planned', producesOptions: false },
  ];

  static getActiveModules(): CreativeModuleDescriptor[] {
    return this.modules.filter((module) => module.status === 'active');
  }
}

export const moroCore = MoroCore;
