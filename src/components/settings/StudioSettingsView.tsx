/**
 * Studio Settings View
 * Configuration console:
 * - Language selection (Arabic RTL / English LTR)
 * - Routing strategy preferences
 * - Preferred default resolution & aspect ratio
 * - Provider adapter architecture status (zero-leak server-side proxy patterns)
 * - Operating budget safeguards
 */

import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { OptimizationPreference } from '../../types/ai-router';
import {
  ShieldCheck,
  Key,
  Sliders,
  Cpu,
  Save,
  Lock,
  Globe,
  Layers,
} from 'lucide-react';

export const StudioSettingsView: React.FC = () => {
  const { settings, updateSettings } = useStudio();
  const { t, isRtl } = useLanguage();

  const [defaultPreference, setDefaultPreference] = useState<OptimizationPreference>(
    settings?.defaultPreference || 'highest-quality'
  );
  const [defaultResolution, setDefaultResolution] = useState<'1080p' | '4k' | '720p'>(
    settings?.defaultResolution || '4k'
  );
  const [defaultAspectRatio, setDefaultAspectRatio] = useState<'16:9' | '9:16' | '1:1'>(
    settings?.defaultAspectRatio || '16:9'
  );
  const [autoFallbackEnabled, setAutoFallbackEnabled] = useState<boolean>(
    settings?.autoFallbackEnabled ?? true
  );
  const [maxCostAlertUsd, setMaxCostAlertUsd] = useState<number>(
    settings?.maxCostPerProjectAlertUsd || 150
  );
  const [exportBitrateMbps, setExportBitrateMbps] = useState<number>(
    settings?.exportBitrateMbps || 80
  );

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      defaultPreference,
      defaultResolution,
      defaultAspectRatio,
      autoFallbackEnabled,
      maxCostPerProjectAlertUsd: maxCostAlertUsd,
      exportBitrateMbps,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">{t.settings.title}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.settings.subtitle}
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{t.settings.btnSave}</span>
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8 text-xs">
        {/* Section 0: Language & Localization */}
        <div className="rounded-lg border border-slate-800 bg-[#0d1017] p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{t.common.language} / Language Selection</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            {isRtl
              ? 'تتيح منصة مورو التبديل السلس بين الواجهة العربية المتوافقة مع اتجاه اليمين إلى اليسار (RTL) والواجهة الإنجليزية (LTR) مع مزامنة النصوص وعلامات الترقيم.'
              : 'Seamlessly toggle between Arabic with full RTL typography alignment and English LTR.'}
          </p>

          <div className="max-w-md">
            <LanguageSwitcher variant="settings" />
          </div>
        </div>

        {/* Section 1: AI Router Strategy & Quality */}
        <div className="rounded-lg border border-slate-800 bg-[#0d1017] p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>{t.settings.routingSectionTitle}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">{t.settings.routingPolicyLabel}</label>
              <select
                value={defaultPreference}
                onChange={(e) => setDefaultPreference(e.target.value as OptimizationPreference)}
                className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="highest-quality">{isRtl ? 'أعلى جودة سينمائية (Highest Quality)' : 'Highest Quality (Prioritize Master Photorealism)'}</option>
                <option value="balanced">{isRtl ? 'توازن شامل (Balanced)' : 'Balanced (Optimal Speed, Cost & Quality)'}</option>
                <option value="lowest-latency">{isRtl ? 'أقل زمن استجابة (Lowest Latency)' : 'Lowest Latency (Real-time Turnaround)'}</option>
                <option value="lowest-cost">{isRtl ? 'أقل تكلفة تشغيلية (Lowest Cost)' : 'Lowest Cost (Budget Conservation)'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">{t.settings.autoFallbackLabel}</label>
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={autoFallbackEnabled}
                    onChange={(e) => setAutoFallbackEnabled(e.target.checked)}
                    className="accent-amber-400 w-4 h-4 rounded"
                  />
                  <span>{t.settings.autoFallbackDesc}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Default Formats */}
        <div className="rounded-lg border border-slate-800 bg-[#0d1017] p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>{t.settings.canvasSectionTitle}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">{t.settings.resolutionLabel}</label>
              <select
                value={defaultResolution}
                onChange={(e) => setDefaultResolution(e.target.value as any)}
                className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="4k">4K UHD Master (3840x2160)</option>
                <option value="1080p">1080p Full HD (1920x1080)</option>
                <option value="720p">720p Preview HD</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">{t.settings.aspectRatioLabel}</label>
              <select
                value={defaultAspectRatio}
                onChange={(e) => setDefaultAspectRatio(e.target.value as any)}
                className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="16:9">16:9 Cinema Widescreen</option>
                <option value="9:16">9:16 Vertical Mobile</option>
                <option value="1:1">1:1 Square</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">{t.settings.bitrateLabel}</label>
              <input
                type="number"
                min={10}
                max={250}
                value={exportBitrateMbps}
                onChange={(e) => setExportBitrateMbps(Number(e.target.value))}
                className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 font-mono tabular-nums focus:outline-none focus:border-amber-400"
              >
              </input>
            </div>
          </div>
        </div>

        {/* Section 3: Generic Architecture Adapter Slots (Phase 1.1) */}
        <div className="rounded-lg border border-slate-800 bg-[#0d1017] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Key className="w-4 h-4 text-amber-400" />
              <span>{t.settings.credentialsSectionTitle}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>{t.settings.serverSideProxyActive}</span>
            </div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            {t.settings.credentialsNotice}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'img_a', name: 'Image Provider A (Architecture Slot)', slot: 'ADAPTER_IMAGE_A' },
              { id: 'vid_a', name: 'Video Provider A (Architecture Slot)', slot: 'ADAPTER_VIDEO_A' },
              { id: 'voice_a', name: 'Voice Provider A (Architecture Slot)', slot: 'ADAPTER_VOICE_A' },
              { id: 'proof_a', name: 'Proofreading Provider A (Architecture Slot)', slot: 'ADAPTER_PROOFREADING_A' },
              { id: 'text_a', name: 'Text Provider A (Architecture Slot)', slot: 'ADAPTER_TEXT_A' },
              { id: 'music_a', name: 'Music Provider A (Architecture Slot)', slot: 'ADAPTER_MUSIC_A' },
            ].map((p) => (
              <div key={p.id} className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{p.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                    {t.common.notConnected}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Slot: {p.slot}</div>
                <div className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-500 font-mono text-[11px] select-none">
                  {isRtl ? 'المزود غير متصل (هيكل مستقبلي مجهز)' : 'Provider not connected (Architecture ready)'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Budget Safeguards */}
        <div className="rounded-lg border border-slate-800 bg-[#0d1017] p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.settings.budgetSectionTitle}</span>
          </div>

          <div className="max-w-md space-y-1">
            <label className="text-slate-400 font-medium">{t.settings.maxCostLabel}</label>
            <input
              type="number"
              min={10}
              max={10000}
              value={maxCostAlertUsd}
              onChange={(e) => setMaxCostAlertUsd(Number(e.target.value))}
              className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 font-mono tabular-nums focus:outline-none focus:border-amber-400"
            />
            <span className="text-[11px] text-slate-500 block pt-1">
              {t.settings.maxCostDesc}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
