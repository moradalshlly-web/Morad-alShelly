import { ContentUnderstandingService } from '../content-understanding';
import { ProjectUnderstanding, UnderstandingBuildParams } from '../../types/content-understanding';
import { MoroProjectContext, ProjectSource } from '../../types/core';

/** Boundary adapter: Base44 understanding remains authoritative; Core consumes it. */
export class ContentUnderstandingAdapter {
  static buildUnderstanding(params: UnderstandingBuildParams): ProjectUnderstanding {
    return ContentUnderstandingService.buildUnderstanding(params);
  }

  static toMoroProjectContext(
    understanding: ProjectUnderstanding,
    options: {
      projectId?: string;
      sources?: ProjectSource[];
      style?: string;
      targetDurationSeconds?: number;
      aspectRatio?: string;
    } = {}
  ): MoroProjectContext {
    const now = new Date().toISOString();
    return {
      projectId: options.projectId,
      title: understanding.title,
      sources: options.sources || [],
      understanding,
      style: options.style || understanding.narrativeStyle,
      targetDurationSeconds: options.targetDurationSeconds || 0,
      aspectRatio: options.aspectRatio || '16:9',
      createdAt: now,
      updatedAt: now,
    };
  }
}

export const contentUnderstandingAdapter = ContentUnderstandingAdapter;
