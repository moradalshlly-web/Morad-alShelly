/**
 * Home Dashboard View
 * Premium landing & studio executive dashboard explaining Moro AI:
 * Official identity: "Moro AI — Premium AI Creative Studio"
 * Multi-provider creative AI platform for stories, images, videos, voices, dubbing, animation, and social-media content.
 */

import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Sparkles,
  Film,
  Cpu,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Layers,
  Zap,
  Clock,
  FileCheck2,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const HomeDashboard: React.FC = () => {
  const { setActiveTab, projects, openProjectWorkspace } = useStudio();
  const { t, isRtl } = useLanguage();

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 sm:space-y-12">
      {/* 1. Studio Hero Section */}
      <section className="relative overflow-hidden rounded-xl border border-slate-800/80 bg-gradient-to-b from-[#111622] to-[#0a0c10] p-5 sm:p-8 md:p-12">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>{t.home.heroBadge}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight font-display">
            {t.home.heroTitle}
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {t.home.heroSubtitle}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('create')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center gap-2 text-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{t.home.btnSuggestForMe}</span>
            </button>

            <button
              onClick={() => setActiveTab('proofreader')}
              className="px-5 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-semibold rounded-lg transition-all flex items-center gap-2 text-xs cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>{t.home.btnProofreader}</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className="px-5 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold rounded-lg transition-all flex items-center gap-2 text-xs cursor-pointer"
            >
              <Film className="w-4 h-4 text-slate-400" />
              <span>{t.nav.projects}</span>
              <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveTab('models')}
              className="px-4 py-2.5 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-slate-500" />
              <span>{t.nav.models}</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20`} />
      </section>

      {/* 2. Core Architectural Pillars */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-display">
            {isRtl ? 'الركائز المعمارية لمنصة مورو' : 'Core Architectural Pillars'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl
              ? 'كيف تنسق منصة مورو الذكاء الاصطناعي المتعدد عبر واجهة موحدة دون الارتباط بمزود واحد.'
              : 'How Moro AI coordinates multi-provider intelligence without single-vendor lock-in.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1: Sovereign Orchestration */}
          <div className="p-6 rounded-lg bg-[#0e121a] border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                {t.home.creativePillars.orchestrationTitle}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.home.creativePillars.orchestrationDesc}
              </p>
            </div>
            <div className="pt-2 text-[11px] text-amber-400/90 font-medium">
              {isRtl ? 'بنية محايدة متكاملة · بدون انقطاع' : 'Generic Provider Adapters A/B'}
            </div>
          </div>

          {/* Pillar 2: Three-Option System */}
          <div className="p-6 rounded-lg bg-[#0e121a] border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                {t.home.creativePillars.threeOptionTitle}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.home.creativePillars.threeOptionDesc}
              </p>
            </div>
            <div className="pt-2 text-[11px] text-sky-400/90 font-medium">
              {isRtl ? 'استبدال جزئي فوري دون إعادة التوليد' : 'Non-destructive option switching'}
            </div>
          </div>

          {/* Pillar 3: Character Consistency */}
          <div className="p-6 rounded-lg bg-[#0e121a] border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                {t.home.creativePillars.continuityTitle}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.home.creativePillars.continuityDesc}
              </p>
            </div>
            <div className="pt-2 text-[11px] text-emerald-400/90 font-medium">
              {isRtl ? 'تثبيت بذور الملامح ونبرة الصوت' : 'Unified seed locking & voice matching'}
            </div>
          </div>

          {/* Pillar 4: Bilingual AI Proofreader */}
          <div className="p-6 rounded-lg bg-[#0e121a] border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                {t.home.creativePillars.bilingualProofreadTitle}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.home.creativePillars.bilingualProofreadDesc}
              </p>
            </div>
            <div className="pt-2 text-[11px] text-violet-400/90 font-medium">
              {isRtl ? 'تصحيح الهمزات والإعراب وعلامات الترقيم' : 'Arabic & English semantic precision'}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 12-Stage Creative Pipeline Roadmap */}
      <section className="p-6 rounded-lg bg-[#0d1017] border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-display">
              {isRtl ? 'خط الإنتاج الإبداعي المكوّن من 12 مرحلة متسلسلة' : '12-Stage Sequential Creative Pipeline'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRtl
                ? 'من المدخلات الأولية وفهم السياق، إلى السيناريو والمشاهد والأصوات، والتصدير السينمائي بدقة 4K.'
                : 'From creative brief to 4K cinematic delivery with multilingual subtitles.'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('create')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer self-start sm:self-auto flex items-center gap-1"
          >
            <span>{isRtl ? 'بدء خط إنتاج جديد' : 'Start New Pipeline'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
          {[
            { num: '01', name: isRtl ? 'المدخلات (Input)' : 'Input Brief' },
            { num: '02', name: isRtl ? 'فهم المحتوى' : 'Understanding' },
            { num: '03', name: isRtl ? 'تحديد السياق' : 'Context Setting' },
            { num: '04', name: isRtl ? 'كشف النبرة' : 'Tone Arc' },
            { num: '05', name: isRtl ? 'نوع المحتوى' : 'Content Type' },
            { num: '06', name: isRtl ? 'السيناريو' : 'Scriptwriting' },
            { num: '07', name: isRtl ? 'المشاهد واللقطات' : 'Scenes & Cuts' },
            { num: '08', name: isRtl ? 'الشخصيات' : 'Characters' },
            { num: '09', name: isRtl ? 'الأصوات' : 'Voice Casting' },
            { num: '10', name: isRtl ? 'الرؤية البصرية' : 'Visual Direction' },
            { num: '11', name: isRtl ? 'التوليد المتوازي' : 'Generation' },
            { num: '12', name: isRtl ? 'المراجعة والتصدير' : 'Review & Export' },
          ].map((st) => (
            <div
              key={st.num}
              className="p-2.5 rounded bg-slate-900/60 border border-slate-800/70 space-y-1"
            >
              <div className="text-[10px] font-mono font-medium text-slate-500 tabular-nums">
                {st.num}
              </div>
              <div className="font-semibold text-slate-200 truncate">{st.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Active Projects Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display">{t.home.recentProjects}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRtl ? 'متابعة التحرير في مساحات العمل متعددة المسارات.' : 'Continue editing in the cinematic workspace.'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
          >
            {t.home.viewAllProjects} ({projects.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              onClick={() => openProjectWorkspace(project.id)}
              className="group relative rounded-lg border border-slate-800 bg-[#0d1017] hover:border-slate-700 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                {project.coverImageUrl ? (
                  <img
                    src={project.coverImageUrl}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                    <Film className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                  <div className="flex items-center gap-2 text-xs">
                    <StatusBadge status={project.status} />
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-300 capitalize">{project.style}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 truncate">{project.title}</h3>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">
                      {project.targetDurationSeconds} {isRtl ? 'ثانية' : 'sec'}
                    </span>
                  </div>

                  <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium">
                    <span>{t.projects.openWorkspace}</span>
                    <ArrowIcon className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
