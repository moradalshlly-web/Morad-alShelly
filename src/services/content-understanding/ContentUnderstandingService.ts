/**
 * Content Understanding Service
 * Builds a structured ProjectUnderstanding from available project sources.
 *
 * Design principle: Do NOT invent missing story information.
 * Only extract what is evidenced in the text. Everything else is 'unknown',
 * 'ambiguous', or 'needs-clarification'.
 *
 * This is a heuristic extractor, not an AI model. When real AI understanding
 * is connected (via the AI Router / provider abstraction), it will enhance
 * or replace the heuristic extraction while keeping the same output type.
 */

import {
  ParsedFileResult,
  ProjectUnderstanding,
  SourceReference,
  UnderstoodEntity,
  UnderstoodRelationship,
  UnresolvedIssue,
  UnderstandingBuildParams,
  UnderstandingFieldStatus,
} from '../../types/content-understanding';

class ContentUnderstandingService {
  /**
   * Builds a ProjectUnderstanding from the available sources.
   * Does NOT invent information — only extracts what is evidenced.
   */
  static buildUnderstanding(params: UnderstandingBuildParams): ProjectUnderstanding {
    const { rawText, userPerspective, projectTitle, selectedStyle, parsedFiles, uploadedFileMetas } =
      params;

    // Combine all available text sources
    const textParts: string[] = [];
    if (rawText) textParts.push(rawText);
    if (userPerspective) textParts.push(userPerspective);
    for (const pf of parsedFiles || []) {
      if (pf.extractedText) textParts.push(pf.extractedText);
    }
    const combinedText = textParts.join('\n\n');

    // Source references (provenance)
    const sourceReferences: SourceReference[] = (uploadedFileMetas || []).map((meta) => {
      const parsed = (parsedFiles || []).find((pf) => pf.fileId === meta.id);
      return {
        fileId: meta.id,
        fileName: meta.name,
        format: meta.extension,
        contribution:
          parsed?.status === 'parsed'
            ? `Full text extracted (${parsed.wordCount ?? 0} words)`
            : parsed?.status === 'not-implemented'
              ? 'File accepted; parsing not yet connected'
              : parsed?.status === 'error'
                ? parsed.errorMessage || 'Parse error'
                : 'Image reference attached',
      };
    });
    if (rawText) {
      sourceReferences.unshift({
        fileId: 'raw-text',
        fileName: 'Direct text input',
        format: 'text',
        contribution: `${rawText.length} characters`,
      });
    }

    // ── Heuristic extraction ────────────────────────────────────

    const hasText = combinedText.trim().length > 0;

    // Title
    const title = projectTitle?.trim() || '';
    const titleStatus: UnderstandingFieldStatus = title ? 'known' : 'needs-clarification';

    // Premise: first 1-2 sentences if text exists
    const premise = hasText ? this.extractPremise(combinedText) : '';
    const premiseStatus: UnderstandingFieldStatus = premise ? 'known' : 'unknown';

    // Main story: the full text is the story (if provided)
    const mainStory = hasText ? combinedText.trim() : '';
    const mainStoryStatus: UnderstandingFieldStatus = mainStory ? 'known' : 'unknown';

    // Themes: heuristic keyword detection
    const themes = hasText ? this.extractThemes(combinedText) : [];
    const themesStatus: UnderstandingFieldStatus = themes.length > 0 ? 'known' : 'unknown';

    // Genre: only from explicit project metadata, not invented
    const genre = selectedStyle || '';
    const genreStatus: UnderstandingFieldStatus = genre ? 'known' : 'needs-clarification';

    // Tone: heuristic detection
    const tone = hasText ? this.extractTone(combinedText) : '';
    const toneStatus: UnderstandingFieldStatus = tone ? 'ambiguous' : 'unknown';

    // Narrative style: derived from selectedStyle if available
    const narrativeStyle = selectedStyle ? `${selectedStyle} visual style indicated` : '';
    const narrativeStyleStatus: UnderstandingFieldStatus = selectedStyle ? 'known' : 'unknown';

    // Setting, world, time period: extract if text mentions them
    const { setting, worldInformation, timePeriod } = hasText
      ? this.extractWorldInfo(combinedText)
      : { setting: '', worldInformation: '', timePeriod: '' };

    // Entities (characters, locations, objects)
    const entities = hasText ? this.extractEntities(combinedText) : [];

    // Relationships: cannot be reliably extracted heuristically
    const relationships: UnderstoodRelationship[] = [];
    const relationshipsIssue: UnresolvedIssue[] =
      entities.length >= 2
        ? [
            {
              id: 'rel-needs-clarification',
              field: 'relationships',
              description: `${entities.length} entities detected but relationships between them are not yet determined from the source text.`,
              status: 'needs-clarification',
              suggestion: 'Describe how the main characters relate to each other.',
            },
          ]
        : [];

    // Locations
    const locationEntities = entities.filter((e) => e.type === 'location');
    const locations = locationEntities.map((e) => e.name);
    const locationsStatus: UnderstandingFieldStatus =
      locations.length > 0 ? 'known' : 'unknown';

    // Important events: very hard to extract reliably — mark as unknown
    const importantEvents: string[] = [];
    const importantEventsStatus: UnderstandingFieldStatus = hasText ? 'ambiguous' : 'unknown';

    // Important objects
    const objectEntities = entities.filter((e) => e.type === 'object');
    const importantObjects = objectEntities.map((e) => e.name);

    // Visual implications: only from user perspective if provided
    const visualImplications = userPerspective?.trim()
      ? [userPerspective.trim()]
      : [];
    const visualImplicationsStatus: UnderstandingFieldStatus =
      visualImplications.length > 0 ? 'known' : 'unknown';

    // Constraints: none extracted unless explicitly stated
    const constraints: string[] = [];
    const constraintsStatus: UnderstandingFieldStatus = 'unknown';

    // Unresolved issues
    const unresolvedIssues: UnresolvedIssue[] = [...relationshipsIssue];
    if (!title) {
      unresolvedIssues.unshift({
        id: 'title-missing',
        field: 'title',
        description: 'No project title was provided.',
        status: 'needs-clarification',
        suggestion: 'Provide a title for this creative project.',
      });
    }
    if (!hasText) {
      unresolvedIssues.push({
        id: 'no-text-source',
        field: 'mainStory',
        description: 'No text source was provided. Content understanding is limited to file metadata.',
        status: 'needs-clarification',
        suggestion: 'Paste a synopsis, script, or narrative text for deeper understanding.',
      });
    }

    // Overall status
    const knownCount = [titleStatus, premiseStatus, mainStoryStatus, themesStatus, genreStatus].filter(
      (s) => s === 'known'
    ).length;
    const understandingStatus: UnderstandingFieldStatus =
      knownCount >= 3 ? 'known' : knownCount >= 1 ? 'ambiguous' : 'unknown';

    return {
      title,
      titleStatus,
      premise,
      premiseStatus,
      mainStory,
      mainStoryStatus,
      themes,
      themesStatus,
      genre,
      genreStatus,
      tone,
      toneStatus,
      narrativeStyle,
      narrativeStyleStatus,
      setting,
      settingStatus: setting ? 'known' : 'unknown',
      worldInformation,
      worldInformationStatus: worldInformation ? 'known' : 'unknown',
      timePeriod,
      timePeriodStatus: timePeriod ? 'known' : 'unknown',
      locations,
      locationsStatus,
      importantEvents,
      importantEventsStatus,
      entities,
      relationships,
      importantObjects,
      importantObjectsStatus: importantObjects.length > 0 ? 'known' : 'unknown',
      visualImplications,
      visualImplicationsStatus,
      constraints,
      constraintsStatus,
      sourceReferences,
      unresolvedIssues,
      understandingStatus,
      analyzedAt: new Date().toISOString(),
    };
  }

  // ── Heuristic extraction helpers (no AI, no invention) ────────

  private static extractPremise(text: string): string {
    const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 10);
    return sentences.slice(0, 2).join(' ').trim();
  }

  private static extractThemes(text: string): string[] {
    const themeKeywords: Record<string, string[]> = {
      Survival: ['survive', 'survival', 'perish', 'endurance', 'rescue'],
      Isolation: ['alone', 'isolated', 'lonely', 'solitude', 'abandoned', 'معزول', 'وحيد'],
      Exploration: ['explore', 'discovery', 'expedition', 'journey', 'quest', 'استكشاف', 'رحلة'],
      Identity: ['identity', 'memory', 'forget', 'remember', 'self', 'هوية', 'ذاكرة'],
      Conflict: ['war', 'battle', 'fight', 'conflict', 'enemy', 'صراع', 'حرب'],
      Love: ['love', 'romance', 'beloved', 'heart', 'حب', 'عشق'],
      Betrayal: ['betray', 'betrayal', 'deceive', 'treason', 'خيانة'],
      Discovery: ['discover', 'find', 'uncover', 'reveal', 'اكتشاف'],
      Sacrifice: ['sacrifice', 'give up', 'surrender', 'تضحية'],
      Hope: ['hope', 'future', 'dream', 'aspiration', 'أمل'],
    };

    const lowerText = text.toLowerCase();
    const found: string[] = [];
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some((kw) => lowerText.includes(kw.toLowerCase()))) {
        found.push(theme);
      }
    }
    return found;
  }

  private static extractTone(text: string): string {
    const toneIndicators: Record<string, string[]> = {
      'Contemplative / Cinematic': ['slow', 'quiet', 'silence', 'contemplat', 'meditat', 'هادئ', 'تأمل'],
      'Tense / Suspenseful': ['tension', 'tense', 'fear', 'dread', 'anxiety', 'توتر', 'خوف'],
      'Epic / Heroic': ['epic', 'hero', 'battle', 'glory', 'ملحمي', 'بطل'],
      'Melancholic': ['sad', 'grief', 'loss', 'mourn', 'melanchol', 'حزن', 'فقد'],
      'Urgent / Fast-paced': ['urgent', 'fast', 'race', 'rush', 'عاجل', 'سريع'],
    };

    const lowerText = text.toLowerCase();
    for (const [tone, keywords] of Object.entries(toneIndicators)) {
      if (keywords.some((kw) => lowerText.includes(kw.toLowerCase()))) {
        return tone;
      }
    }
    return '';
  }

  private static extractWorldInfo(text: string): {
    setting: string;
    worldInformation: string;
    timePeriod: string;
  } {
    // Setting: look for location-related keywords
    const settingPatterns = [
      /(?:set in|takes place in|located in|scene:|setting:)\s+(.{10,80})/i,
      /(?:في|في عالم|مكان:)\s+(.{10,80})/,
    ];
    let setting = '';
    for (const pattern of settingPatterns) {
      const match = text.match(pattern);
      if (match) {
        setting = match[1].trim();
        break;
      }
    }

    // Time period: look for year or era mentions
    const yearMatch = text.match(/\b(1[0-9]{3}|2[0-9]{3})\b/);
    const timePeriod = yearMatch ? yearMatch[0] : '';

    // World information: general — only if text is long enough
    const worldInformation = text.length > 200 ? 'World details present in source text.' : '';

    return { setting, worldInformation, timePeriod };
  }

  private static extractEntities(text: string): UnderstoodEntity[] {
    const entities: UnderstoodEntity[] = [];

    // Character detection: capitalized words near dialogue markers or character descriptions
    // This is a simple heuristic — real entity extraction requires NLP/AI.
    const dialoguePattern = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s*(?:said|says|whispered|shouted|asked|replied|narrated|قال|قالت|صرخ|همس)/g;
    const charMatches = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = dialoguePattern.exec(text)) !== null) {
      charMatches.add(match[1]);
    }

    // Also detect "Dr. X", "Commander X" patterns
    const titlePattern = /(?:Dr\.|Mr\.|Ms\.|Captain|Commander|General|Professor|Agent)\s+([A-Z][a-z]+)/g;
    while ((match = titlePattern.exec(text)) !== null) {
      charMatches.add(match[0]);
    }

    charMatches.forEach((name) => {
      entities.push({
        id: `entity_char_${entities.length}`,
        name,
        type: 'character',
        description: `Character mentioned in source text.`,
        status: 'ambiguous',
        sourceReferences: ['raw-text'],
      });
    });

    return entities;
  }
}

export { ContentUnderstandingService };
