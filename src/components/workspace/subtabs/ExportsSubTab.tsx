/**
 * Exports Sub-Tab
 * Professional mastering and delivery console:
 * - 4K UHD ProRes Master, 1080p Web, 9:16 Social Vertical
 * - Multilingual subtitle embedding (Arabic & English SRT/VTT)
 * - Audio stems packaging (Dialogue, Music, SFX)
 * - Render simulation & export history
 */

import React, { useState } from 'react';
import { useProjectWorkspace } from '../../../context/ProjectWorkspaceContext';
import { useStudio } from '../../../context/StudioContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Download, Film, CheckCircle2 } from 'lucide-react';

export const ExportsSubTab: React.FC = () => {
  const { project } = useProjectWorkspace();
  const { showNotification } = useStudio();
  const { t, isRtl } = useLanguage();

  const [preset, setPreset] = useState<'4k-prores' | '1080p-web' | '9-16-vertical'>('4k-prores');
  const [includeSubtitles, setIncludeSubtitles] = useState(true);
  const [subtitleMode, setSubtitleMode] = useState<'burned' | 'soft'>('burned');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [completedExports, setCompletedExports] = useState<Array<{
    id: string;
    filename: string;
    preset: string;
    size: string;
    timestamp: string;
  }>>([
    {
      id: 'exp_01',
      filename: `${project.title.toLowerCase().replace(/\s+/g, '_')}_master_4k.mov`,
      preset: '4K UHD ProRes 422 HQ (24fps)',
      size: '1.42 GB',
      timestamp: isRtl ? 'الآن' : 'Just now',
    },
  ]);

  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(15);

    setTimeout(() => setExportProgress(50), 600);
    setTimeout(() => setExportProgress(85), 1200);
    setTimeout(() => {
      setExportProgress(100);
      setIsExporting(false);

      const newExport = {
        id: `exp_${Date.now()}`,
        filename: `${project.title.toLowerCase().replace(/\s+/g, '_')}_${preset}.mp4`,
        preset: preset === '4k-prores' ? '4K UHD ProRes 422' : preset === '9-16-vertical' ? '9:16 Vertical UHD' : '1080p Web',
        size: preset === '4k-prores' ? '1.85 GB' : '340 MB',
        timestamp: isRtl ? 'الآن' : 'Just now',
      };

      setCompletedExports((prev) => [newExport, ...prev]);
      showNotification(isRtl ? 'تم تصدير النسخة الرئيسية بنجاح' : 'Master video render exported successfully', 'success');
    }, 1800);
  };

  return (
    <div className={`space-y-6 max-w-4xl ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="border-b border-slate-800 pb-4">
        <div className="text-xs uppercase font-semibold text-slate-500">
          {isRtl ? 'التسليم وما بعد الإنتاج' : 'Delivery & Post-Production'}
        </div>
        <h3 className="text-sm font-bold text-white mt-0.5">
          {t.workspace.exports.title}
        </h3>
      </div>

      {/* Preset Configurator Card */}
      <div className="rounded-lg border border-slate-800 bg-[#0d1017] p-6 space-y-5">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {isRtl ? 'ملف ضبط التصدير الرئيسي' : 'Master Render Profile'}
        </h4>

        {/* Preset Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: '4k-prores',
              title: isRtl ? 'نسخة 4K UHD سينمائية' : '4K UHD Master',
              specs: '3840x2160 · 24fps · ProRes 422 HQ',
              desc: isRtl ? 'جودة أرشيفية وعرض سينمائي مع كامل المجال اللوني الديناميكي.' : 'Archival theatrical quality with full dynamic color gamut.',
            },
            {
              id: '1080p-web',
              title: isRtl ? 'نسخة 1080p للويب H.265' : '1080p Web H.265',
              specs: '1920x1080 · 24fps · High Bitrate',
              desc: isRtl ? 'محسنة للبث على منصات الفيديو والويب بأعلى نقاوة وحجم مضغوط.' : 'Optimized for web players, YouTube, and Vimeo streaming.',
            },
            {
              id: '9-16-vertical',
              title: isRtl ? 'نسخة 9:16 عمودية للتواصل' : '9:16 Social Vertical',
              specs: '1080x1920 · 30fps · Smart Framing',
              desc: isRtl ? 'قص ذكي وتتبع للشخصيات مخصص لتيك توك وريلز وإنستغرام.' : 'Cinematic crop with centered subject tracking for TikTok & Reels.',
            },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id as any)}
              className={`p-4 rounded-lg border ${isRtl ? 'text-right' : 'text-left'} cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                preset === p.id
                  ? 'border-amber-400 bg-amber-500/10 text-amber-200'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-white">{p.title}</div>
                <div className="text-[11px] font-mono text-amber-400/90 mt-0.5">{p.specs}</div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
            </button>
          ))}
        </div>

        {/* Subtitles & Audio Stems */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">
                {isRtl ? 'ترجمة نصية مدمجة (عربي / إنجليزي)' : 'Multilingual Subtitles'}
              </span>
              <input
                type="checkbox"
                checked={includeSubtitles}
                onChange={(e) => setIncludeSubtitles(e.target.checked)}
                className="accent-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {isRtl
                ? 'تضمين ملفات ترجمة متزامنة مع الإطارات باللغتين العربية والإنجليزية.'
                : 'Embed English and Arabic subtitle streams with frame-accurate timing.'}
            </p>
            {includeSubtitles && (
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px]">
                  <input
                    type="radio"
                    name="subMode"
                    checked={subtitleMode === 'burned'}
                    onChange={() => setSubtitleMode('burned')}
                    className="accent-amber-400"
                  />
                  <span>{isRtl ? 'محروقة على الفيديو' : 'Burned-in'}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px]">
                  <input
                    type="radio"
                    name="subMode"
                    checked={subtitleMode === 'soft'}
                    onChange={() => setSubtitleMode('soft')}
                    className="accent-amber-400"
                  />
                  <span>{isRtl ? 'مسار اختياري (Soft)' : 'Soft / Selectable'}</span>
                </label>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="font-semibold text-slate-200 block">
              {isRtl ? 'مسارات صوتية منفصلة (Stems)' : 'Separate Audio Stems'}
            </span>
            <p className="text-[11px] text-slate-400">
              {isRtl
                ? 'تصدير مسارات WAV منفصلة للحوار الصوتي (A1)، والموسيقى (A2)، والمؤثرات الصوتية (A3).'
                : 'Package isolated WAV stems for Dialogue (A1), Score (A2), and Foley (A3).'}
            </p>
            <div className="text-[10px] font-mono text-emerald-400">
              ✓ 24-bit / 48kHz LPCM Stems Included
            </div>
          </div>
        </div>

        {/* Export Action Button */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            {isRtl ? 'الحجم المتوقع:' : 'Estimated master file size:'} ~{preset === '4k-prores' ? '1.8 GB' : '350 MB'}
          </div>

          <button
            onClick={handleStartExport}
            disabled={isExporting}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <Film className="w-4 h-4" />
            <span>
              {isExporting
                ? (isRtl ? `جارٍ التصدير (${exportProgress}%)...` : `Rendering Master (${exportProgress}%)...`)
                : t.workspace.exports.btnRenderMaster}
            </span>
          </button>
        </div>

        {isExporting && (
          <div className="space-y-1">
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Completed Deliverables List */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {isRtl ? 'النسخ النهائية المكتملة' : 'Completed Master Deliverables'}
        </h4>

        <div className="space-y-2">
          {completedExports.map((exp) => (
            <div
              key={exp.id}
              className="p-3.5 rounded-lg border border-slate-800 bg-[#0d1017] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">{exp.filename}</div>
                  <div className="text-[11px] text-slate-400">
                    {exp.preset} · <span className="font-mono tabular-nums">{exp.size}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => showNotification(isRtl ? `بدء تنزيل ${exp.filename}` : `Initiating download for ${exp.filename}`, 'info')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.workspace.exports.btnDownload}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
