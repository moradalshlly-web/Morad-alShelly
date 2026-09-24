/**
 * AI Language Proofreader View
 * Dedicated linguistic architecture interface for Arabic and English:
 * - Grammar correction (همزة الوصل والقطع، المطابقة النحوية)
 * - Spelling & punctuation standards (علامات الترقيم وتنسيق المسافات)
 * - Narrative clarity & dramatic eloquence
 * - Individual and bulk Accept/Reject candidate management
 */

import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStudio } from '../../context/StudioContext';
import { proofreadingService } from '../../services/proofreading/ProofreadingService';
import { ProofreadingImprovement, ProofreadingResult } from '../../types/providers';
import {
  Sparkles,
  Check,
  X,
  Copy,
  CheckCheck,
  FileCheck,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Info,
} from 'lucide-react';

export const AIProofreaderView: React.FC = () => {
  const { t, isRtl, language } = useLanguage();
  const { showNotification } = useStudio();

  const sampleArabicText = `EXT. محطة كبلر - ليل
الدكتورة إيلينا تقف امام البوابة وتنظر الي الافق البعيد ، حيث ان هذا الاعمال لم تنتهي بعد بشكل جيد جدا .`;

  const sampleEnglishText = `Central... confirming visual contact. Their is a deep resonance beneath teh ice, and the results are very good , central.`;

  const [inputText, setInputText] = useState<string>(isRtl ? sampleArabicText : sampleEnglishText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ProofreadingResult | null>(null);
  const [improvements, setImprovements] = useState<ProofreadingImprovement[]>([]);
  const [activeCorrectedText, setActiveCorrectedText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleRunProofreading = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await proofreadingService.proofreadText(inputText, {
        preserveMeaning: true,
        language: 'auto',
      });

      setResult(res);
      setImprovements(res.improvements);
      setActiveCorrectedText(res.correctedText);
      showNotification(
        isRtl
          ? `تم التدقيق اللغوي بنجاح (${res.improvements.length} ملاحظات)`
          : `Proofreading completed (${res.improvements.length} improvements detected)`,
        'success'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptImprovement = (id: string) => {
    setImprovements((prev) =>
      prev.map((imp) => (imp.id === id ? { ...imp, status: 'accepted' } : imp))
    );
    showNotification(isRtl ? 'تم قبول التعديل' : 'Improvement accepted', 'info');
  };

  const handleRejectImprovement = (id: string, originalSnippet: string, replacementSnippet: string) => {
    setImprovements((prev) =>
      prev.map((imp) => (imp.id === id ? { ...imp, status: 'rejected' } : imp))
    );
    // Revert the snippet in the corrected text
    setActiveCorrectedText((prev) => prev.replace(replacementSnippet, originalSnippet));
    showNotification(isRtl ? 'تم رفض التعديل' : 'Improvement rejected', 'info');
  };

  const handleAcceptAll = () => {
    setImprovements((prev) => prev.map((imp) => ({ ...imp, status: 'accepted' })));
    if (result) {
      setActiveCorrectedText(result.correctedText);
    }
    showNotification(isRtl ? 'تم اعتماد كافة التحسينات' : 'All improvements accepted', 'success');
  };

  const handleRejectAll = () => {
    setImprovements((prev) => prev.map((imp) => ({ ...imp, status: 'rejected' })));
    setActiveCorrectedText(inputText);
    showNotification(isRtl ? 'تم رفض كافة التعديلات' : 'All improvements rejected', 'info');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCorrectedText || inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showNotification(isRtl ? 'تم نسخ النص المنقح إلى الحافظة' : 'Copied to clipboard', 'info');
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20 mb-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Phase 1.1 Foundation · Zero External Media Calls</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-display">
              {t.proofreader.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {t.proofreader.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                setInputText(isRtl ? sampleArabicText : sampleEnglishText);
                setResult(null);
                setImprovements([]);
              }}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isRtl ? 'تحميل نص نموذجي' : 'Load Sample Script'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Input Form Section */}
      <div className="rounded-lg border border-slate-800 bg-[#0d1017] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{t.proofreader.inputLabel}</span>
          </label>
          <span className="text-[11px] text-slate-500 font-mono tabular-nums">
            {inputText.length} {isRtl ? 'حرف' : 'characters'}
          </span>
        </div>

        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.proofreader.inputPlaceholder}
          className="w-full bg-[#080a0d] border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed resize-y selection:bg-amber-500/20"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? 'الحفاظ التام على المعنى والنية الدرامية للمؤلف' : 'Strict meaning preservation enabled'}</span>
          </div>

          <button
            onClick={handleRunProofreading}
            disabled={isAnalyzing || !inputText.trim()}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{isAnalyzing ? t.proofreader.analyzing : t.proofreader.btnAnalyze}</span>
          </button>
        </div>
      </div>

      {/* Results & Inspection Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.proofreader.resultsTitle}</span>
              </h2>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                {isRtl ? 'المزود الموجه:' : 'Provider:'} {result.provider} · {result.executionTimeMs}ms
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAcceptAll}
                className="px-3 py-1.5 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{t.proofreader.btnAcceptAll}</span>
              </button>

              <button
                onClick={handleRejectAll}
                className="px-3 py-1.5 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.proofreader.btnRejectAll}</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? t.proofreader.copied : t.proofreader.btnCopyCorrected}</span>
              </button>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Input */}
            <div className="rounded-lg border border-slate-800 bg-[#0d1017] p-4 space-y-2">
              <div className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">
                {t.proofreader.originalText}
              </div>
              <div className="p-3 bg-[#080a0d] rounded border border-slate-800/80 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                {result.originalText}
              </div>
            </div>

            {/* Corrected & Polished Version */}
            <div className="rounded-lg border border-amber-500/30 bg-[#0d1017] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase font-semibold text-amber-400 tracking-wider">
                  {t.proofreader.correctedText}
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {t.proofreader.readabilityRating}: {result.readabilityScore}%
                </span>
              </div>
              <div className="p-3 bg-[#080a0d] rounded border border-amber-500/20 text-xs text-amber-200 leading-relaxed whitespace-pre-wrap font-mono">
                {activeCorrectedText}
              </div>
            </div>
          </div>

          {/* Granular Improvement Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t.proofreader.improvementsFound} ({improvements.length})
            </h3>

            {improvements.length === 0 ? (
              <div className="p-6 rounded-lg border border-slate-800 bg-[#0d1017] text-center space-y-2">
                <CheckCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-slate-200">
                  {t.proofreader.noImprovementsNeeded}
                </div>
                <div className="text-[11px] text-slate-500">
                  {t.proofreader.noImprovementsDesc}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {improvements.map((imp) => (
                  <div
                    key={imp.id}
                    className={`p-3.5 rounded-lg border transition-all text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      imp.status === 'accepted'
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : imp.status === 'rejected'
                        ? 'border-rose-500/20 bg-rose-500/5 opacity-60'
                        : 'border-slate-800 bg-[#0d1017]'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-amber-300">
                          {t.proofreader.types[imp.type]}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          {imp.status === 'accepted'
                            ? t.proofreader.status.accepted
                            : imp.status === 'rejected'
                            ? t.proofreader.status.rejected
                            : t.proofreader.status.pending}
                        </span>
                      </div>

                      {/* Diff snippet */}
                      <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                        <span className="line-through text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                          {imp.originalSnippet}
                        </span>
                        <ArrowIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {imp.replacementSnippet}
                        </span>
                      </div>

                      {/* Linguistic explanation */}
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {isRtl && imp.explanationAr ? imp.explanationAr : imp.explanation}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                      <button
                        onClick={() => handleAcceptImprovement(imp.id)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          imp.status === 'accepted'
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                        }`}
                        title={isRtl ? 'قبول هذا التعديل' : 'Accept this improvement'}
                      >
                        <Check className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleRejectImprovement(imp.id, imp.originalSnippet, imp.replacementSnippet)
                        }
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          imp.status === 'rejected'
                            ? 'bg-rose-500 text-white font-bold'
                            : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                        }`}
                        title={isRtl ? 'رفض هذا التعديل' : 'Reject this improvement'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
