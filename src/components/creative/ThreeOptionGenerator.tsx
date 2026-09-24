/**
 * Reusable ThreeOptionGenerator Component
 * Core orchestration UI for Moro AI's 3-Option Creative System:
 * - Renders Option 1, Option 2, Option 3 side-by-side on desktop, stacked/swipeable on mobile
 * - Displays "اقتراح Moro" ("Moro Recommendation") with context-aware reason
 * - Supports individual replacement ([تبديل هذا فقط]) and full category replacement ([تبديل الكل])
 * - Preserves all other project decisions without resetting state
 */

import React, { useState } from 'react';
import {
  CreativeCategory,
  CreativeDecision,
  CreativeOption,
  ImageOptionMetadata,
  SceneOptionMetadata,
  ToneOptionMetadata,
  VoiceOptionMetadata,
} from '../../types/creative-options';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Sparkles,
  RefreshCw,
  Check,
  Play,
  Pause,
  Volume2,
  Film,
  Camera,
  Sun,
  Eye,
  Sliders,
  Clock,
  Layers,
  Palette,
} from 'lucide-react';

interface ThreeOptionGeneratorProps<T = any> {
  decision: CreativeDecision<T>;
  onSelectOption: (optionId: string) => void;
  onReplaceSingle: (optionId: string) => Promise<void> | void;
  onReplaceAll: () => Promise<void> | void;
  categoryLabel?: string;
  categoryIcon?: React.ComponentType<{ className?: string }>;
}

export const ThreeOptionGenerator = <T = any>({
  decision,
  onSelectOption,
  onReplaceSingle,
  onReplaceAll,
  categoryLabel,
  categoryIcon: CategoryIcon = Layers,
}: ThreeOptionGeneratorProps<T>): React.ReactElement => {
  const { isRtl } = useLanguage();
  const [replacingOptionId, setReplacingOptionId] = useState<string | null>(null);
  const [isReplacingAll, setIsReplacingAll] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const handleSingleReplace = async (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setReplacingOptionId(optionId);
      await onReplaceSingle(optionId);
    } finally {
      setReplacingOptionId(null);
    }
  };

  const handleAllReplace = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsReplacingAll(true);
      await onReplaceAll();
    } finally {
      setIsReplacingAll(false);
    }
  };

  const toggleVoicePlayback = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
      // Auto-stop after 4 seconds of simulated preview
      setTimeout(() => {
        setPlayingVoiceId((prev) => (prev === id ? null : prev));
      }, 4000);
    }
  };

  // Helper labels by category
  const getSelectLabel = (category: CreativeCategory, isSelected: boolean) => {
    if (isSelected) {
      return isRtl ? 'تم الاعتماد' : 'Selected';
    }
    switch (category) {
      case 'voice':
        return isRtl ? 'اعتماد هذا الصوت' : 'Adopt This Voice';
      case 'tone':
        return isRtl ? 'اعتماد هذه النبرة' : 'Adopt This Tone';
      case 'scene':
        return isRtl ? 'اعتماد هذا المشهد' : 'Adopt This Scene';
      case 'image':
        return isRtl ? 'اعتماد هذه الرؤية' : 'Adopt This Visual';
      default:
        return isRtl ? 'اعتماد هذا الخيار' : 'Adopt Option';
    }
  };

  const getReplaceSingleLabel = (category: CreativeCategory) => {
    switch (category) {
      case 'voice':
        return isRtl ? 'تبديل هذا الصوت فقط' : 'Replace this voice only';
      case 'tone':
        return isRtl ? 'تبديل هذه النبرة فقط' : 'Replace this tone only';
      case 'scene':
        return isRtl ? 'تبديل هذا المشهد فقط' : 'Replace this scene only';
      case 'image':
        return isRtl ? 'تبديل هذه الصورة فقط' : 'Replace this visual only';
      default:
        return isRtl ? 'تبديل هذا فقط' : 'Replace this only';
    }
  };

  const getReplaceAllLabel = (category: CreativeCategory) => {
    switch (category) {
      case 'voice':
        return isRtl ? 'تبديل الأصوات الثلاثة' : 'Replace All 3 Voices';
      case 'tone':
        return isRtl ? 'تبديل جميع النبرات' : 'Replace All 3 Tones';
      case 'scene':
        return isRtl ? 'تبديل المشاهد الثلاثة' : 'Replace All 3 Scenes';
      case 'image':
        return isRtl ? 'تبديل الصور الثلاث' : 'Replace All 3 Visuals';
      default:
        return isRtl ? 'تبديل الكل' : 'Replace All 3';
    }
  };

  // Render specific preview card internals
  const renderOptionContent = (option: CreativeOption<T>, isSelected: boolean) => {
    const meta = option.metadata as any;

    if (decision.category === 'voice') {
      const voiceMeta = meta as VoiceOptionMetadata;
      const isPlaying = playingVoiceId === option.id;

      return (
        <div className="space-y-3 pt-2">
          {/* Voice details */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">{voiceMeta.voiceName}</span>
            <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {voiceMeta.genderStyle}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
            {option.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-[#090b0e] p-2.5 rounded border border-slate-800/80">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'العمر والطبقة' : 'Age & Style'}</span>
              <span className="text-slate-200">{voiceMeta.ageStyle}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'الطاقة الصوتية' : 'Energy'}</span>
              <span className="text-slate-200">{voiceMeta.energy}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-800/60">
              <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'أسلوب الأداء' : 'Delivery Cadence'}</span>
              <span className="text-slate-300 italic">{voiceMeta.deliveryStyle}</span>
            </div>
          </div>

          {/* Interactive Audio Waveform & Preview */}
          <div className="flex items-center gap-3 p-2 bg-[#090b0e] rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={(e) => toggleVoicePlayback(option.id, e)}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={isPlaying ? (isRtl ? 'إيقاف' : 'Pause') : (isRtl ? 'استماع للعينـة' : 'Preview Sample')}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>

            {/* Visualizer Waveform */}
            <div className="flex-1 flex items-center gap-0.5 h-6">
              {(voiceMeta.sampleWaveform || [30, 45, 60, 80, 100, 70, 50, 85, 95, 60, 40, 30]).map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-amber-400 animate-pulse' : isSelected ? 'bg-slate-500' : 'bg-slate-700'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(25, (h * (0.6 + Math.random() * 0.4)))}%` : `${h * 0.7}%`,
                  }}
                />
              ))}
            </div>

            <span className="text-[10px] font-mono text-slate-400 tabular-nums">
              {isPlaying ? '0:03' : '0:08'}
            </span>
          </div>
        </div>
      );
    }

    if (decision.category === 'tone') {
      const toneMeta = meta as ToneOptionMetadata;

      return (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: toneMeta.accentColorHex || '#f59e0b' }}
              />
              <span className="font-semibold text-white">{toneMeta.toneName}</span>
            </div>
            <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {toneMeta.intensity}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {option.description}
          </p>

          <div className="space-y-2 bg-[#090b0e] p-2.5 rounded border border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'الإيقاع النفسي والوتيرة' : 'Emotional Pacing'}</span>
              <span className="text-slate-300 text-[11px]">{toneMeta.emotionalPacing}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase mb-1">{isRtl ? 'الخصائص الدرامية' : 'Characteristics'}</span>
              <div className="flex flex-wrap gap-1">
                {toneMeta.characteristics.map((c, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded font-mono"
                  >
                    #{c}
                  </span>
                ))}
              </div>
            </div>

            {toneMeta.colorPaletteDescription && (
              <div className="pt-1 border-t border-slate-800/60">
                <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'الجو اللوني المقترح' : 'Color Atmosphere'}</span>
                <span className="text-slate-400 text-[11px] italic">{toneMeta.colorPaletteDescription}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (decision.category === 'scene') {
      const sceneMeta = meta as SceneOptionMetadata;

      return (
        <div className="space-y-3 pt-2">
          {sceneMeta.previewImageUrl && (
            <div className="relative h-32 w-full rounded-md overflow-hidden border border-slate-800 group">
              <img
                src={sceneMeta.previewImageUrl}
                alt={sceneMeta.sceneTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px]">
                <span className="bg-black/80 text-amber-300 font-mono px-1.5 py-0.5 rounded text-[10px]">
                  {sceneMeta.suggestedDurationSeconds}s {isRtl ? 'مدة العرض' : 'runtime'}
                </span>
                <span className="bg-black/80 text-slate-300 font-mono px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1">
                  <Film className="w-3 h-3 text-amber-400" />
                  <span>{sceneMeta.characters.length} {isRtl ? 'شخصية' : 'Cast'}</span>
                </span>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-white">{sceneMeta.sceneTitle}</h4>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              {option.description}
            </p>
          </div>

          <div className="space-y-1.5 bg-[#090b0e] p-2.5 rounded border border-slate-800/80 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'البيئة والمكان' : 'Environment'}</span>
              <span className="text-slate-300">{sceneMeta.environment}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'حركة وتوجيه الكاميرا' : 'Camera Direction'}</span>
              <span className="text-slate-300 font-mono text-[10px]">{sceneMeta.cameraDirection}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'الإضاءة والمزاج' : 'Lighting & Mood'}</span>
              <span className="text-slate-400">{sceneMeta.lighting}</span>
            </div>
          </div>
        </div>
      );
    }

    if (decision.category === 'image') {
      const imgMeta = meta as ImageOptionMetadata;

      return (
        <div className="space-y-3 pt-2">
          {imgMeta.previewImageUrl && (
            <div className="relative h-36 w-full rounded-md overflow-hidden border border-slate-800 group">
              <img
                src={imgMeta.previewImageUrl}
                alt={option.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 border border-slate-700">
                {imgMeta.aspectRatio}
              </div>
            </div>
          )}

          <div>
            <span className="text-xs font-bold text-white block">{option.title}</span>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              {option.description}
            </p>
          </div>

          <div className="space-y-1.5 bg-[#090b0e] p-2.5 rounded border border-slate-800/80 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'العدسة والكاميرا' : 'Camera & Optics'}</span>
              <span className="text-slate-300 font-mono text-[10px]">{imgMeta.camera}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'التكوين البصري' : 'Composition'}</span>
              <span className="text-slate-300 text-[11px]">{imgMeta.composition}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'معالجة الإضاءة' : 'Lighting Treatment'}</span>
              <span className="text-slate-400 text-[11px]">{imgMeta.lighting}</span>
            </div>
          </div>
        </div>
      );
    }

    // Generic fallback for any future category
    return (
      <div className="space-y-2 pt-2">
        <p className="text-xs text-slate-300 leading-relaxed">{option.description}</p>
        <pre className="text-[10px] bg-[#090b0e] p-2 rounded text-slate-400 font-mono overflow-x-auto">
          {JSON.stringify(option.metadata, null, 2)}
        </pre>
      </div>
    );
  };

  const displayCategoryLabel = isRtl
    ? decision.categoryLabelAr || categoryLabel || decision.category
    : decision.categoryLabelEn || categoryLabel || decision.category;

  return (
    <div className={`space-y-4 rounded-xl border border-slate-800 bg-[#0c0f15] p-4 sm:p-6 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Category Section Header & Moro Collaborative Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <CategoryIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                {displayCategoryLabel}
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                {decision.options.length} {isRtl ? 'خيارات' : 'Options'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isRtl
                ? 'نظام الخيارات الثلاثية — القرار النهائي لك دائماً'
                : '3-Option Creative System — You always have final creative control'}
            </p>
          </div>
        </div>

        {/* Global Replace Button: [تبديل الكل / Replace All 3] */}
        <button
          type="button"
          onClick={handleAllReplace}
          disabled={isReplacingAll}
          className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3 h-3 text-amber-400 ${isReplacingAll ? 'animate-spin' : ''}`} />
          <span>{isReplacingAll ? (isRtl ? 'جارٍ التوليد...' : 'Regenerating...') : getReplaceAllLabel(decision.category)}</span>
        </button>
      </div>

      {/* Moro Dialogue Box */}
      {decision.moroDialogue && (
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-2.5 text-xs">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-amber-200/90 font-medium">
              <span className="text-amber-400 font-bold">Moro: </span>
              {isRtl ? decision.moroDialogue.textAr : decision.moroDialogue.text}
            </div>
            {decision.moroDialogue.reason && (
              <div className="text-[11px] text-slate-400">
                <span className="text-slate-500">{isRtl ? 'السبب: ' : 'Reason: '}</span>
                {isRtl ? decision.moroDialogue.reasonAr : decision.moroDialogue.reason}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3 Options Grid: Desktop Side-by-Side (3 columns), Mobile Stacked */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {decision.options.map((option, idx) => {
          const isSelected = decision.selectedOptionId === option.id;
          const isReplacingThis = replacingOptionId === option.id;
          const optionNumber = idx + 1;

          return (
            <div
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`relative rounded-xl border transition-all duration-200 flex flex-col justify-between p-4 cursor-pointer select-none ${
                isSelected
                  ? 'border-amber-400 bg-[#12161f] shadow-[0_0_16px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/40'
                  : 'border-slate-800 bg-[#090b0e] hover:border-slate-700 hover:bg-[#0d1017]'
              } ${isReplacingThis ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="space-y-2">
                {/* Header Tag / Option Number & Moro Recommendation Badge */}
                <div className="flex items-center justify-between gap-1 flex-wrap pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                      {isRtl ? `الخيار ${optionNumber}` : `Option ${optionNumber}`}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        {isRtl ? 'المعتمد' : 'Active'}
                      </span>
                    )}
                  </div>

                  {/* "اقتراح Moro" Recommendation Badge */}
                  {option.recommended && (
                    <div
                      className="px-2 py-0.5 rounded text-[10px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 flex items-center gap-1"
                      title={isRtl ? option.recommendationReasonAr : option.recommendationReason}
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{isRtl ? 'اقتراح Moro' : 'Moro Recommendation'}</span>
                    </div>
                  )}
                </div>

                {/* Recommendation Reason Notice if marked */}
                {option.recommended && (option.recommendationReason || option.recommendationReasonAr) && (
                  <div className="text-[11px] text-amber-300/80 italic bg-amber-500/5 px-2 py-1 rounded border border-amber-500/15">
                    {isRtl ? option.recommendationReasonAr : option.recommendationReason}
                  </div>
                )}

                {/* Option Specific Rich Content */}
                {renderOptionContent(option, isSelected)}
              </div>

              {/* Action Buttons on Card Footer */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center gap-2">
                {/* 1. Primary Adopt/Select Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOption(option.id);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${isSelected ? 'stroke-[2.5]' : 'opacity-70'}`} />
                  <span>{getSelectLabel(decision.category, isSelected)}</span>
                </button>

                {/* 2. Individual Replace Button: [تبديل هذا فقط / Replace this only] */}
                <button
                  type="button"
                  onClick={(e) => handleSingleReplace(option.id, e)}
                  disabled={isReplacingThis}
                  title={getReplaceSingleLabel(decision.category)}
                  className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded border border-slate-800 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReplacingThis ? 'animate-spin text-amber-400' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
