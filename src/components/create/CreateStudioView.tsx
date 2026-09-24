/**
 * Creation Studio View
 * Clean multi-mode entry point:
 * - Suggest for me (interactive creative consultant)
 * - Create from text (direct narrative / script decomposition)
 * - Create from image (visual keyframe / moodboard seed)
 */

import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { SuggestForMeWizard } from './SuggestForMeWizard';
import { MultiFormatCreativeStudio } from './MultiFormatCreativeStudio';
import { Sparkles, FileText, Image as ImageIcon, Film, Upload, Check, Layers } from 'lucide-react';

export const CreateStudioView: React.FC = () => {
  const { createProject, openProjectWorkspace, user } = useStudio();
  const { t, isRtl } = useLanguage();
  const [activeMode, setActiveMode] = useState<'multiformat' | 'suggest' | 'text' | 'image'>('multiformat');

  // Text-to-Project form state
  const [textTitle, setTextTitle] = useState('');
  const [textPrompt, setTextPrompt] = useState('');
  const [textStyle, setTextStyle] = useState<'cinematic' | 'anime' | 'cartoon' | 'realistic'>('cinematic');
  const [textDuration, setTextDuration] = useState(120);

  // Image-to-Project form state
  const [imgTitle, setImgTitle] = useState('');
  const [imgPrompt, setImgPrompt] = useState('');
  const [imgUploadedUrl, setImgUploadedUrl] = useState<string | null>(null);

  const handleCreateFromText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textPrompt.trim()) return;

    const title = textTitle.trim() || (isRtl ? 'مشروع سيناريو جديد' : 'New Script Project');
    const project = await createProject({
      userId: user?.id || 'usr_moro_director',
      title,
      description: textPrompt.slice(0, 200),
      genre: 'Drama / Speculative',
      style: textStyle,
      aspectRatio: '16:9',
      targetDurationSeconds: textDuration,
      status: 'scripting',
      tags: [textStyle, 'Text-to-Project', 'Screenplay'],
      totalScenes: 3,
    });

    openProjectWorkspace(project.id);
  };

  const handleCreateFromImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = imgTitle.trim() || (isRtl ? 'مشروع ركيزة بصرية جديدة' : 'Keyframe Anchor Project');

    const project = await createProject({
      userId: user?.id || 'usr_moro_director',
      title,
      description: imgPrompt || 'Visual keyframe initiated creative production.',
      genre: 'Visual Narrative',
      style: 'cinematic',
      aspectRatio: '16:9',
      coverImageUrl: imgUploadedUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      targetDurationSeconds: 120,
      status: 'storyboarding',
      tags: ['Keyframe-Initiated', 'Visual Seed'],
      totalScenes: 2,
    });

    openProjectWorkspace(project.id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white font-display">{t.create.title}</h1>
        <p className="text-xs text-slate-400 mt-1">
          {t.create.subtitle}
        </p>
      </div>

      {/* Mode Selector (Segmented buttons) */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-[#0c0f15] border border-slate-800 rounded-lg w-fit text-xs">
        <button
          onClick={() => setActiveMode('multiformat')}
          className={`px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeMode === 'multiformat'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isRtl ? 'الاستوديو الذكي الشامل (Multi-Format)' : 'Multi-Format Creative Studio'}</span>
        </button>

        <button
          onClick={() => setActiveMode('suggest')}
          className={`px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeMode === 'suggest'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.create.suggestTabTitle}</span>
        </button>

        <button
          onClick={() => setActiveMode('text')}
          className={`px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeMode === 'text'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t.create.customTabTitle}</span>
        </button>

        <button
          onClick={() => setActiveMode('image')}
          className={`px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeMode === 'image'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{isRtl ? 'صورة / مفهوم مرئي' : 'Image / Concept'}</span>
        </button>
      </div>

      {/* Mode 0: Comprehensive Multi-Format Studio (Unified Multi-Format Ingestion, Content Understanding & 3-Option System) */}
      {activeMode === 'multiformat' && <MultiFormatCreativeStudio />}

      {/* Mode 1: Suggest For Me Wizard */}
      {activeMode === 'suggest' && <SuggestForMeWizard />}

      {/* Mode 2: Create from Text */}
      {activeMode === 'text' && (
        <div className={`rounded-xl border border-slate-800 bg-[#0c0f15] p-6 md:p-8 space-y-6 max-w-3xl ${isRtl ? 'text-right' : 'text-left'}`}>
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              {isRtl ? 'الإنشاء من سيناريو أو نص سردي' : 'Create from Screenplay or Prose'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isRtl
                ? 'أدخل النص السردي أو السيناريو الأولي، وسيقوم المحلل بتفكيكه تلقائياً إلى مشاهد وشخصيات وحوارات.'
                : 'Provide a logline, narrative synopsis, or structured script. The pipeline will extract sluglines, dialogue, and camera instructions.'}
            </p>
          </div>

          <form onSubmit={handleCreateFromText} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">{isRtl ? 'عنوان المشروع المؤقت' : 'Project Working Title'}</label>
              <input
                type="text"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder={isRtl ? 'مثال: ملحمة الرمال والحديد' : 'e.g. Memory of Salt and Iron'}
                className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">{isRtl ? 'نص السيناريو / الفكرة الدرامية' : 'Screenplay Text / Creative Brief'}</label>
              <textarea
                rows={6}
                required
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                placeholder={isRtl ? 'الصق السيناريو، حوارات الشخصيات، أو تسلسل الأحداث هنا...' : 'Paste your script, scene description, or rough narrative beats here...'}
                className="w-full bg-[#090b0e] border border-slate-800 rounded p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono text-xs leading-relaxed resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">{isRtl ? 'التوجه الجمالي' : 'Aesthetic Direction'}</label>
                <select
                  value={textStyle}
                  onChange={(e) => setTextStyle(e.target.value as any)}
                  className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="cinematic">{isRtl ? 'سينمائي واقعي' : 'Cinematic Realism'}</option>
                  <option value="anime">{isRtl ? 'أنمي ياباني' : 'Stylized Anime'}</option>
                  <option value="realistic">{isRtl ? 'وثائقي طبيعي' : 'Natural Documentary'}</option>
                  <option value="cartoon">{isRtl ? 'كرتون 2D' : 'Graphic 2D'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">{isRtl ? 'المدة المستهدفة (ثوانٍ)' : 'Target Duration (Seconds)'}</label>
                <input
                  type="number"
                  value={textDuration}
                  onChange={(e) => setTextDuration(Number(e.target.value))}
                  className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono tabular-nums focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Film className="w-3.5 h-3.5" />
                <span>{isRtl ? 'بدء خط الإنتاج وفتح الاستوديو' : 'Initialize Pipeline & Open Studio'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mode 3: Create from Image */}
      {activeMode === 'image' && (
        <div className={`rounded-xl border border-slate-800 bg-[#0c0f15] p-6 md:p-8 space-y-6 max-w-3xl ${isRtl ? 'text-right' : 'text-left'}`}>
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              {isRtl ? 'الإنشاء انطلاقاً من ركيزة بصرية (Keyframe)' : 'Create from Visual Keyframe Anchor'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isRtl
                ? 'ارفع صورة مرجعية أو لوحة مفاهيمية ليتم تثبيت نظام الألوان والملابس وتناغم الإضاءة بناءً عليها.'
                : 'Upload a concept painting, location photography, or character portrait. The pipeline will anchor color grading, wardrobe, and lighting palettes to this asset.'}
            </p>
          </div>

          <form onSubmit={handleCreateFromImage} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">{isRtl ? 'عنوان المشروع' : 'Project Title'}</label>
              <input
                type="text"
                value={imgTitle}
                onChange={(e) => setImgTitle(e.target.value)}
                placeholder={isRtl ? 'مثال: رحلة المحيط المظلم' : 'e.g. Obsidian Trench Voyage'}
                className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Simulated Image Upload */}
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">{isRtl ? 'الصورة المرجعية المركزية' : 'Anchor Visual Keyframe'}</label>
              <div className="p-6 rounded-lg border-2 border-dashed border-slate-800 bg-[#090b0e] flex flex-col items-center justify-center text-center space-y-3">
                {imgUploadedUrl ? (
                  <div className="space-y-2">
                    <img
                      src={imgUploadedUrl}
                      alt="Anchor Keyframe"
                      className="max-h-48 rounded border border-amber-500/50 mx-auto"
                    />
                    <div className="text-[11px] text-emerald-400 font-medium flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'تم تثبيت الركيزة البصرية بنجاح' : 'Visual Anchor Locked'}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-slate-500" />
                    <div className="text-xs text-slate-300">
                      {isRtl ? 'اسحب وأفلت لوحة المفاهيم أو اختر نموذجاً تجريبياً' : 'Drag & Drop master concept or select below'}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setImgUploadedUrl(
                          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
                        )
                      }
                      className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer transition-colors"
                    >
                      {isRtl ? 'إرفاق صورة نموذجية للتجربة' : 'Attach Sample Concept Keyframe'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">{isRtl ? 'ملاحظات المخرج والتوجيه البصري' : 'Director Notes & World Guidance'}</label>
              <textarea
                rows={3}
                value={imgPrompt}
                onChange={(e) => setImgPrompt(e.target.value)}
                placeholder={isRtl ? 'حدد حركة الكاميرا، دوافع الشخصيات، أو التغيرات الجوية بناءً على الصورة...' : 'Specify camera movement, character motivations, or environmental changes relative to the keyframe...'}
                className="w-full bg-[#090b0e] border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Film className="w-3.5 h-3.5" />
                <span>{isRtl ? 'بدء المشروع بناءً على الصورة المرجعية' : 'Initialize Project from Keyframe'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
