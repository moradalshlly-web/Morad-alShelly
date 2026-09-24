/**
 * New Project Modal
 * Creates a project record with style, aspect ratio, duration, and genre.
 */

import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { X, Film, Sparkles } from 'lucide-react';

interface NewProjectModalProps {
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose }) => {
  const { createProject, openProjectWorkspace, user } = useStudio();
  const { t, isRtl } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Science Fiction');
  const [style, setStyle] = useState<'cinematic' | 'anime' | 'cartoon' | 'realistic' | 'hyper-real' | 'custom'>('cinematic');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3' | '2.39:1'>('16:9');
  const [targetDurationSeconds, setTargetDurationSeconds] = useState(120);
  const [tagsInput, setTagsInput] = useState('Cinematic, 4K Master');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const newProj = await createProject({
        userId: user?.id || 'usr_moro_director',
        title: title.trim(),
        description: description.trim() || 'A new creative film project generated inside Moro AI.',
        genre,
        style,
        aspectRatio,
        targetDurationSeconds,
        status: 'draft',
        tags,
        totalScenes: 0,
      });

      onClose();
      openProjectWorkspace(newProj.id);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`relative w-full max-w-lg rounded-xl bg-[#0e121a] border border-slate-800 shadow-2xl p-6 space-y-5 text-slate-200 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-display">
              {isRtl ? 'إنشاء مشروع إبداعي جديد' : 'Initialize New Creative Project'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">
              {isRtl ? 'عنوان المشروع' : 'Project Title'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isRtl ? 'مثال: صدى النجوم - الفصل الأول' : 'e.g. Chronicles of Kepler-186f'}
              className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">
              {isRtl ? 'الفكرة العامة / الملخص الإبداعي' : 'Logline / Creative Brief'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isRtl ? 'ملخص الفكرة، الطابع الدرامي، أو السياق السردي...' : 'A brief overview of the theme, plot, or narrative context...'}
              className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Style & Genre */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">
                {isRtl ? 'الأسلوب البصري' : 'Visual Style'}
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as any)}
                className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
              >
                <option value="cinematic">{isRtl ? 'سينمائي واقعي (Cinematic Realism)' : 'Cinematic Realism'}</option>
                <option value="anime">{isRtl ? 'أنمي / رسم فني (Anime Stylized)' : 'Anime / Stylized'}</option>
                <option value="realistic">{isRtl ? 'وثائقي / طبيعي (Documentary Natural)' : 'Documentary / Natural'}</option>
                <option value="cartoon">{isRtl ? 'كرتون / ثنائي الأبعاد (Cartoon 2D)' : 'Cartoon / 2D Animated'}</option>
                <option value="hyper-real">{isRtl ? 'خيال علمي فائق الدقة (Hyper-Real)' : 'Hyper-Real Speculative'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">
                {isRtl ? 'التصنيف الفني' : 'Genre'}
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Aspect Ratio & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">
                {isRtl ? 'أبعاد الشاشة' : 'Frame Aspect Ratio'}
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
              >
                <option value="16:9">16:9 Standard Widescreen</option>
                <option value="2.39:1">2.39:1 Anamorphic Cinema</option>
                <option value="9:16">9:16 Vertical (TikTok/Reels)</option>
                <option value="1:1">1:1 Square</option>
                <option value="4:3">4:3 Classic Television</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">
                {isRtl ? 'المدة المستهدفة (ثوانٍ)' : 'Target Duration (Seconds)'}
              </label>
              <input
                type="number"
                min={10}
                max={3600}
                value={targetDurationSeconds}
                onChange={(e) => setTargetDurationSeconds(Number(e.target.value))}
                className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-100 font-mono tabular-nums focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">
              {isRtl ? 'الوسوم الوصفية (مفصولة بفاصلة)' : 'Metadata Tags (comma separated)'}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'بدء المشروع' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
