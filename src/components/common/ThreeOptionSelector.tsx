/**
 * Three-Option Selector Component
 * Core architectural component implementing the Three-Option generation model.
 * Allows instant side-by-side comparison, selection, and localized replacement
 * of rejected shots/voice/scenes without resetting or restarting the project.
 */

import React, { useState } from 'react';
import { SceneOption } from '../../types/database';
import { useLanguage } from '../../i18n/LanguageContext';
import { Check, Edit3, Eye, Sparkles, RefreshCw } from 'lucide-react';

interface ThreeOptionSelectorProps {
  sceneTitle: string;
  options: SceneOption[];
  activeOptionIndex: number;
  onSelectOption: (optionIndex: number) => void;
  onReplaceOption: (optionIndex: number, newPrompt: string) => void;
  onReplaceSingle?: (optionIndex: number) => void;
  onReplaceAll?: () => void;
}

export const ThreeOptionSelector: React.FC<ThreeOptionSelectorProps> = ({
  sceneTitle,
  options,
  activeOptionIndex,
  onSelectOption,
  onReplaceOption,
  onReplaceSingle,
  onReplaceAll,
}) => {
  const { t, isRtl } = useLanguage();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [previewingIndex, setPreviewingIndex] = useState<number>(activeOptionIndex);
  const [isReplacingAll, setIsReplacingAll] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditPrompt(options[index]?.visualPrompt || '');
  };

  const handleSaveEdit = (index: number) => {
    onReplaceOption(index, editPrompt);
    setEditingIndex(null);
  };

  const handleSingleReplace = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setReplacingIndex(index);
    try {
      if (onReplaceSingle) {
        await onReplaceSingle(index);
      } else {
        // Fallback: cycle prompt variation
        const variations = [
          'Extreme cinematic depth of field with 35mm lens flares and anamorphic distortion.',
          'High contrast chiaroscuro composition, volumetric light shafts through mist.',
          'Dynamic tracking low-angle camera movement, realistic textures and organic dust particles.',
        ];
        const newText = `${options[index]?.visualPrompt.split(' (Refreshed')[0]} (Refreshed: ${variations[index % variations.length]})`;
        onReplaceOption(index, newText);
      }
    } finally {
      setTimeout(() => setReplacingIndex(null), 300);
    }
  };

  const handleAllReplace = async () => {
    setIsReplacingAll(true);
    try {
      if (onReplaceAll) {
        await onReplaceAll();
      } else {
        options.forEach((_, i) => {
          onReplaceOption(i, `Refreshed variation ${i + 1} for ${sceneTitle}`);
        });
      }
    } finally {
      setTimeout(() => setIsReplacingAll(false), 400);
    }
  };

  return (
    <div className={`bg-[#10141d] border border-slate-800 rounded-lg p-5 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="text-xs uppercase font-semibold tracking-wider text-slate-500">
            {isRtl ? 'نظام ترشيح الخيارات الثلاثة المتوازية' : 'Three-Option Candidate Engine'}
          </div>
          <h4 className="text-sm font-semibold text-white mt-0.5">
            {sceneTitle} · {isRtl ? 'الخيارات البصرية المرشحة' : 'Candidate Variations'}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAllReplace}
            disabled={isReplacingAll}
            className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 text-amber-400 ${isReplacingAll ? 'animate-spin' : ''}`} />
            <span>{isRtl ? 'تبديل المشاهد الثلاثة' : 'Replace All 3'}</span>
          </button>

          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="hidden sm:inline">{isRtl ? 'استبدال غير تدميري' : 'Non-destructive'}</span>
          </div>
        </div>
      </div>

      {/* 3 Option Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option, idx) => {
          const isSelected = idx === activeOptionIndex;

          return (
            <div
              key={option.optionId}
              onClick={() => setPreviewingIndex(idx)}
              className={`relative rounded-lg border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'border-amber-500/80 bg-slate-900/90 shadow-[0_0_15px_rgba(245,158,11,0.12)]'
                  : 'border-slate-800 bg-[#0c0e14] hover:border-slate-700'
              }`}
            >
              {/* Option Number Header */}
              <div className="p-3 border-b border-slate-800/70 flex items-center justify-between bg-slate-900/40">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {isRtl ? 'الخيار' : 'Option'} {idx + 1}
                  </span>
                  {idx === 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>{isRtl ? 'اقتراح Moro' : 'Moro Pick'}</span>
                    </span>
                  )}
                  {isSelected && (
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> {t.workspace.scenes.optionActive}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleSingleReplace(idx, e)}
                    title={isRtl ? 'تبديل هذا المشهد فقط' : 'Replace this scene only'}
                    className="p-1 text-slate-500 hover:text-amber-400 rounded cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${replacingIndex === idx ? 'animate-spin text-amber-400' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(idx);
                    }}
                    title={isRtl ? 'تعديل التوجيه' : 'Customize Prompt'}
                    className="p-1 text-slate-500 hover:text-slate-300 rounded cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Visual Preview / Thumbnail Slot */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden group">
                {option.previewUrl ? (
                  <img
                    src={option.previewUrl}
                    alt={`Option ${idx + 1} Visual`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-4 text-center">
                    <Eye className="w-6 h-6 mb-1 text-slate-700" />
                    <span className="text-xs">{isRtl ? 'الإطار جاهز للمعاينة' : 'Preview Frame Ready'}</span>
                  </div>
                )}

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 flex flex-col justify-end">
                  <div className="text-[11px] font-medium text-slate-200 line-clamp-2">
                    {option.label}
                  </div>
                </div>
              </div>

              {/* Detailed specs */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between text-xs">
                {editingIndex === idx ? (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      rows={3}
                      className="w-full text-xs bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400 resize-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200"
                      >
                        {t.common.cancel}
                      </button>
                      <button
                        onClick={() => handleSaveEdit(idx)}
                        className="px-2.5 py-1 text-[11px] bg-amber-400 text-slate-950 font-semibold rounded cursor-pointer"
                      >
                        {t.common.save}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-slate-400 text-[11px] line-clamp-3 leading-relaxed">
                      {option.visualPrompt}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-500">
                      {option.cameraAngle && (
                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 shrink-0">{isRtl ? 'الكاميرا:' : 'Camera:'}</span>
                          <span className="truncate">{option.cameraAngle}</span>
                        </div>
                      )}
                      {option.lighting && (
                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 shrink-0">{isRtl ? 'الإضاءة:' : 'Lighting:'}</span>
                          <span className="truncate">{option.lighting}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action button */}
                <div className="pt-3 border-t border-slate-800/70 mt-3 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOption(idx);
                    }}
                    className={`w-full py-1.5 px-3 rounded text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.workspace.scenes.optionActive}</span>
                      </>
                    ) : (
                      <span>{isRtl ? `اختيار الخيار ${idx + 1}` : `Select Option ${idx + 1}`}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
