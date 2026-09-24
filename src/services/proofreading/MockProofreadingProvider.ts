/**
 * Mock Proofreading Provider (Phase 1 Local Implementation)
 * Provider-independent adapter for AI text proofreading.
 * Performs intelligent syntactic, spelling, punctuation, and clarity analysis
 * for both Arabic and English texts while preserving dramatic narrative meaning.
 * NO external APIs are called in Phase 1.
 */

import {
  ProofreadingProvider,
  ProofreadingOptions,
  ProofreadingResult,
  ProofreadingImprovement,
  ProviderHealthCheckResult,
} from '../../types/providers';

export class MockProofreadingProvider implements ProofreadingProvider {
  readonly id = 'provider_proofreading_mock';
  readonly name = 'Proofreading Provider A (Architectural Mock)';
  readonly providerSlug = 'proofreading-provider-a';
  readonly supportedTypes = ['proofreading' as const];
  readonly version = '1.1.0';

  isConfigured(): boolean {
    return true;
  }

  async checkHealth(): Promise<ProviderHealthCheckResult> {
    return {
      status: 'online',
      latencyMs: 120,
      timestamp: new Date().toISOString(),
    };
  }

  async proofread(text: string, options: ProofreadingOptions = {}): Promise<ProofreadingResult> {
    const startTime = performance.now();

    // Detect language if not specified
    const isArabic = options.language === 'ar' || (options.language !== 'en' && /[\u0600-\u06FF]/.test(text));
    const lang = isArabic ? 'ar' : 'en';

    const improvements: ProofreadingImprovement[] = [];
    let corrected = text;

    if (isArabic) {
      // 1. Common Arabic Spelling & Hamza Corrections (همزة الوصل والقطع)
      const hamzaPairs: Array<{ pattern: RegExp; replace: string; original: string; expEn: string; expAr: string }> = [
        {
          pattern: /\bان\b/g,
          replace: 'أن',
          original: 'ان',
          expEn: 'Added missing Hamza on Alif (همزة القطع)',
          expAr: 'إضافة همزة القطع الصحيحة (أن)',
        },
        {
          pattern: /\bالي\b/g,
          replace: 'إلى',
          original: 'الي',
          expEn: 'Corrected preposition spelling (إلى instead of الي)',
          expAr: 'تصحيح حرف الجر إلى بدلاً من الي بالألف المقصورة',
        },
        {
          pattern: /\bهذا الاعمال\b/g,
          replace: 'هذه الأعمال',
          original: 'هذا الاعمال',
          expEn: 'Grammatical agreement: non-human plural requires feminine demonstrative (هذه الأعمال)',
          expAr: 'مطابقة اسم الإشارة لجمع غير العاقل (هذه الأعمال)',
        },
        {
          pattern: /\bخطئ\b/g,
          replace: 'خطأ',
          original: 'خطئ',
          expEn: 'Corrected ending hamza on Alif (خطأ)',
          expAr: 'تصحيح كتابة الهمزة المتطرفة على الألف (خطأ)',
        },
      ];

      hamzaPairs.forEach((pair, idx) => {
        if (pair.pattern.test(corrected)) {
          improvements.push({
            id: `imp_ar_${idx}_${Date.now()}`,
            type: 'spelling',
            originalSnippet: pair.original,
            replacementSnippet: pair.replace,
            explanation: pair.expEn,
            explanationAr: pair.expAr,
            status: 'pending',
          });
          corrected = corrected.replace(pair.pattern, pair.replace);
        }
      });

      // 2. Arabic Punctuation Spacing (فاصلة بدون مسافة قبلها)
      if (/ ،/.test(corrected)) {
        improvements.push({
          id: `imp_punc_ar_${Date.now()}`,
          type: 'punctuation',
          originalSnippet: ' ،',
          replacementSnippet: '، ',
          explanation: 'Removed whitespace before Arabic comma according to typographic standards',
          explanationAr: 'إزالة المسافة الزائدة قبل الفاصلة العربية ومراعاة قواعد الترقيم',
          status: 'pending',
        });
        corrected = corrected.replace(/\s+،/g, '، ');
      }

      // 3. Narrative Clarity / Wording Improvement
      if (corrected.includes('بشكل جيد جدا') || corrected.includes('بشكل جيد جداً')) {
        improvements.push({
          id: `imp_wording_ar_${Date.now()}`,
          type: 'wording',
          originalSnippet: 'بشكل جيد جداً',
          replacementSnippet: 'بإتقان فائق',
          explanation: 'Replaced repetitive adverbial phrase with dramatic narrative eloquence',
          explanationAr: 'استبدال التركيب الضعيف بصياغة سينمائية أكثر جزالة وبلاغة',
          status: 'pending',
        });
        corrected = corrected.replace(/بشكل جيد جداً?/g, 'بإتقان فائق');
      }

      // Fallback sample if text is already pristine
      if (improvements.length === 0 && text.trim().length > 10) {
        improvements.push({
          id: `imp_clarity_ar_${Date.now()}`,
          type: 'clarity',
          originalSnippet: text.slice(0, Math.min(30, text.length)),
          replacementSnippet: text.slice(0, Math.min(30, text.length)),
          explanation: 'Syntactic rhythm and narrative flow are verified with high grammatical accuracy.',
          explanationAr: 'تم التحقق من سلامة البناء اللغوي، والتركيب النحوي متناسق ومناسب للإلقاء الدرامي.',
          status: 'accepted',
        });
      }
    } else {
      // English Proofreading Heuristics
      const enChecks: Array<{ pattern: RegExp; replace: string; original: string; expEn: string; expAr: string }> = [
        {
          pattern: /\btheir is\b/gi,
          replace: 'there is',
          original: 'their is',
          expEn: 'Corrected homophone error (there is)',
          expAr: 'تصحيح خطأ إملائي شائع في الضمائر المتجانسة',
        },
        {
          pattern: /\bteh\b/gi,
          replace: 'the',
          original: 'teh',
          expEn: 'Fixed typographical transposition (the)',
          expAr: 'تصحيح خطأ طباعي في أداة التعريف',
        },
        {
          pattern: /\s+,/g,
          replace: ', ',
          original: ' ,',
          expEn: 'Removed whitespace before comma',
          expAr: 'إزالة المسافة الزائدة قبل الفاصلة الإنجليزية',
        },
        {
          pattern: /\bvery good\b/gi,
          replace: 'exceptional',
          original: 'very good',
          expEn: 'Elevated adjective for cinematic descriptive tone',
          expAr: 'ترقية المفردة إلى وصف سينمائي أكثر دقة وبلاغة',
        },
      ];

      enChecks.forEach((chk, idx) => {
        if (chk.pattern.test(corrected)) {
          improvements.push({
            id: `imp_en_${idx}_${Date.now()}`,
            type: 'grammar',
            originalSnippet: chk.original,
            replacementSnippet: chk.replace,
            explanation: chk.expEn,
            explanationAr: chk.expAr,
            status: 'pending',
          });
          corrected = corrected.replace(chk.pattern, chk.replace);
        }
      });

      if (improvements.length === 0 && text.trim().length > 10) {
        improvements.push({
          id: `imp_clarity_en_${Date.now()}`,
          type: 'clarity',
          originalSnippet: text.slice(0, Math.min(30, text.length)),
          replacementSnippet: text.slice(0, Math.min(30, text.length)),
          explanation: 'Text structure adheres to screenplay dramatic rhythm with natural phrasing.',
          explanationAr: 'النص متماسك نحويًا ويحافظ على المعنى الأصلي وتدفق الحوار السينمائي.',
          status: 'accepted',
        });
      }
    }

    const executionTimeMs = Math.round(performance.now() - startTime + 250);

    return {
      originalText: text,
      correctedText: corrected,
      improvements,
      detectedLanguage: lang,
      readabilityScore: 94,
      provider: 'Proofreading Provider A',
      modelUsed: 'proofread-bilingual-pro',
      executionTimeMs,
    };
  }
}
