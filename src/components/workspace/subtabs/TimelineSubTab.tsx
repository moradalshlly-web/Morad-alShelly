/**
 * Timeline & Video Editor Sub-Tab
 * Non-linear creative timeline foundation:
 * - Multitrack canvas (V1 Video, A1 Voiceover, A2 Music Score, T1 Subtitles)
 * - Playhead scrubber, timecode clock, zoom controls
 * - Multilingual subtitle cue management (Arabic & English)
 * - Transition presets (Crossfade, Dissolve, Anamorphic Wipe)
 */

import React, { useState } from 'react';
import { useProjectWorkspace } from '../../../context/ProjectWorkspaceContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
  Volume2,
  Unlock,
  Scissors,
} from 'lucide-react';

export const TimelineSubTab: React.FC = () => {
  const { timelineState, updateTimelineTime, toggleTimelinePlayback } =
    useProjectWorkspace();
  const { t, isRtl } = useLanguage();

  const [activeSubtitleLang, setActiveSubtitleLang] = useState<'ar' | 'en'>(isRtl ? 'ar' : 'en');
  const [selectedTransition, setSelectedTransition] = useState('Cross Dissolve (0.5s)');

  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 24);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(
      frames
    ).padStart(2, '0')}`;
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTimelineTime(Number(e.target.value));
  };

  return (
    <div className={`space-y-5 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* 1. Playhead Transport & Monitor Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Canvas Monitor */}
        <div className="lg:col-span-2 rounded-lg border border-slate-800 bg-black aspect-video relative overflow-hidden flex flex-col justify-between">
          <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
              alt="Program Monitor"
              className="w-full h-full object-cover"
            />
            {/* Subtitle Burn-In Preview */}
            <div className="absolute bottom-6 inset-x-0 text-center px-6">
              <span className="bg-black/80 px-3 py-1.5 rounded text-white text-xs font-medium tracking-wide shadow-md border border-slate-700/50">
                {activeSubtitleLang === 'ar'
                  ? 'مركز القيادة... أؤكد الاتصال البصري. الشبكة الحيوية استجابت للتعديل.'
                  : 'Central... confirming visual contact. The bio-mesh adapted.'}
              </span>
            </div>
          </div>

          {/* Timecode overlay */}
          <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-black/80 px-2 py-1 rounded font-mono text-[11px] text-amber-400 tabular-nums border border-slate-800`}>
            {formatTimecode(timelineState.currentTimeSeconds)} · 24fps
          </div>
        </div>

        {/* Timeline Master Controls & Subtitle Track Selector */}
        <div className="rounded-lg border border-slate-800 bg-[#0d1017] p-4 flex flex-col justify-between space-y-4 text-xs">
          <div>
            <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              {isRtl ? 'إعدادات شاشة العرض (Program Monitor)' : 'Program Monitor Settings'}
            </h4>
            <div className="text-xs text-slate-300 mt-1 font-mono">
              24.000 fps · 3840x2160 Master
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-slate-400 font-medium block">
                {isRtl ? 'معاينة مسار الترجمة والترجمة الصوتية' : 'Active Subtitle Track Preview'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveSubtitleLang('ar')}
                  className={`p-2 rounded border ${isRtl ? 'text-right' : 'text-left'} cursor-pointer transition-colors ${
                    activeSubtitleLang === 'ar'
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-xs">العربية (الأصلية)</div>
                  <div className="text-[10px] text-slate-500">2 لقطات · متزامنة</div>
                </button>

                <button
                  onClick={() => setActiveSubtitleLang('en')}
                  className={`p-2 rounded border ${isRtl ? 'text-right' : 'text-left'} cursor-pointer transition-colors ${
                    activeSubtitleLang === 'en'
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-xs">English Master</div>
                  <div className="text-[10px] text-slate-500">Moro Neural Dubbed</div>
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-slate-400 font-medium block">
                {isRtl ? 'نوع الانتقال بين المشاهد' : 'Scene Cut Transition'}
              </label>
              <select
                value={selectedTransition}
                onChange={(e) => setSelectedTransition(e.target.value)}
                className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="Cross Dissolve (0.5s)">{isRtl ? 'تلاشٍ متقاطع - Cross Dissolve (0.5s)' : 'Cross Dissolve (0.5s)'}</option>
                <option value="Dip to Black (1.0s)">{isRtl ? 'انتقال للسواد - Dip to Black (1.0s)' : 'Dip to Black (1.0s)'}</option>
                <option value="Anamorphic Flare Glitch">{isRtl ? 'وميض أنامورفي - Flare Glitch' : 'Anamorphic Flare Glitch'}</option>
                <option value="Hard Cut (0.0s)">{isRtl ? 'قطع مباشر - Hard Cut (0.0s)' : 'Hard Cut (0.0s)'}</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-slate-500 text-[11px]">
            <span>{isRtl ? 'المحاذاة التلقائية: مفعلة' : 'Timeline Snap: Enabled'}</span>
            <span className="text-emerald-400">{isRtl ? 'إطارات متطابقة 100%' : 'Zero Framedrops'}</span>
          </div>
        </div>
      </div>

      {/* 2. Timeline Toolbar (Transport Buttons) */}
      <div className="rounded-lg border border-slate-800 bg-[#0c0f15] p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Scrubber transport */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateTimelineTime(0)}
            className="p-1.5 text-slate-400 hover:text-white rounded cursor-pointer"
            title={isRtl ? 'البداية' : 'Jump to Start'}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={toggleTimelinePlayback}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {timelineState.isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>{t.workspace.timeline.pause}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.workspace.timeline.play}</span>
              </>
            )}
          </button>

          <button
            onClick={() => updateTimelineTime(timelineState.totalDurationSeconds)}
            className="p-1.5 text-slate-400 hover:text-white rounded cursor-pointer"
            title={isRtl ? 'النهاية' : 'Jump to End'}
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          {/* Timecode display */}
          <div className="font-mono text-xs text-amber-400 tabular-nums bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            {formatTimecode(timelineState.currentTimeSeconds)} / {formatTimecode(timelineState.totalDurationSeconds)}
          </div>
        </div>

        {/* Right: Zoom and Editing Tools */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-white rounded cursor-pointer" title={isRtl ? 'قص المقطع' : 'Split Clip'}>
            <Scissors className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1"></div>
          <ZoomOut className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="range"
            min={1}
            max={20}
            defaultValue={10}
            className="w-20 accent-amber-400"
          />
          <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>

      {/* 3. Non-Linear Multitrack Canvas */}
      <div className="rounded-lg border border-slate-800 bg-[#090b0e] p-4 space-y-3 overflow-x-auto">
        {/* Scrubber slider bar */}
        <div className="relative pt-1 pb-3">
          <input
            type="range"
            min={0}
            max={timelineState.totalDurationSeconds}
            step={0.1}
            value={timelineState.currentTimeSeconds}
            onChange={handleScrubberChange}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-amber-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
            <span>00:00:00</span>
            <span>00:01:00</span>
            <span>00:02:00</span>
          </div>
        </div>

        {/* Tracks */}
        <div className="space-y-2">
          {timelineState.tracks.map((track) => (
            <div key={track.id} className="flex items-center gap-3">
              {/* Track Header Label */}
              <div className="w-44 shrink-0 p-2 rounded bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-300 truncate">{track.name}</span>
                <div className="flex items-center gap-1 text-slate-500">
                  <Volume2 className="w-3 h-3 cursor-pointer hover:text-slate-300" />
                  <Unlock className="w-3 h-3 cursor-pointer hover:text-slate-300" />
                </div>
              </div>

              {/* Track Lane */}
              <div className="flex-1 h-12 rounded bg-slate-950/80 border border-slate-800/80 relative overflow-hidden flex items-center p-1 gap-2">
                {track.clips.map((clip) => {
                  const widthPercent = (clip.duration / timelineState.totalDurationSeconds) * 100;

                  return (
                    <div
                      key={clip.id}
                      style={{ width: `${widthPercent}%` }}
                      className="h-full rounded border border-slate-700/60 bg-slate-900/90 hover:bg-slate-800/90 transition-all p-1.5 flex items-center gap-2 cursor-pointer relative overflow-hidden group select-none"
                    >
                      {clip.thumbnailUrl && (
                        <img
                          src={clip.thumbnailUrl}
                          alt={clip.name}
                          className="w-8 h-full object-cover rounded shrink-0"
                        />
                      )}
                      <div className="truncate text-[11px] font-medium text-slate-200">
                        {clip.name}
                      </div>
                      <span className={`absolute bottom-1 ${isRtl ? 'left-1' : 'right-1'} text-[9px] font-mono text-slate-500 tabular-nums`}>
                        {clip.duration}s
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
