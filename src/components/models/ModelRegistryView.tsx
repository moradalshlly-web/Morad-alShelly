/**
 * Model Registry View
 * Enterprise model and provider orchestration console.
 * Phase 1.1: Clearly distinguishes Available Architecture from Connected Providers.
 * In this phase, ZERO external media providers are connected.
 * All entries exist as architectural placeholders with status: "Not connected".
 */

import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { ProviderType } from '../../types/providers';
import { RouterSimulationCard } from './RouterSimulationCard';
import { Cpu, Search, RefreshCw, AlertCircle, Layers, Unplug } from 'lucide-react';

export const ModelRegistryView: React.FC = () => {
  const { models, updateModel, refreshModels } = useStudio();
  const { t, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'all' || m.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleToggleEnabled = (id: string, currentEnabled: boolean) => {
    updateModel(id, { enabled: !currentEnabled });
  };

  const handlePriorityChange = (id: string, priority: number) => {
    updateModel(id, { priority: Math.max(1, Math.min(10, priority)) });
  };

  const handleFallbackPriorityChange = (id: string, fallbackPriority: number) => {
    updateModel(id, { fallbackPriority: Math.max(1, Math.min(10, fallbackPriority)) });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20 mb-2">
            <Layers className="w-3 h-3 text-amber-400" />
            <span>Architecture Specification · Phase 1.1</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            {t.models.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.models.subtitle}
          </p>
        </div>

        <button
          onClick={refreshModels}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t.models.reloadRegistry}</span>
        </button>
      </div>

      {/* Critical Architecture vs. Connected Notice */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-amber-300">
            {t.models.architectureNoticeTitle}
          </div>
          <p className="text-slate-300 leading-relaxed">
            {t.models.architectureNoticeDesc}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono">
            <span className="text-emerald-400">
              {isRtl ? '✓ الهيكل المعماري البرمجي: 100% مكتمل' : '✓ Architecture Layer: 100% Defined'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-400">
              {isRtl ? '○ المزودون المتصلون حاليًا: 0 (المرحلة 1.1)' : '○ Connected Providers: 0 (Phase 1.1)'}
            </span>
          </div>
        </div>
      </div>

      {/* Router Simulation Bench */}
      <RouterSimulationCard />

      {/* Registry Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-2.5 text-slate-500`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث عن المزود، النموذج، أو الميزات...' : 'Filter by provider, model, or capability...'}
              className={`w-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 bg-[#0c0f15] border border-slate-800 rounded-md text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400`}
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#0c0f15] border border-slate-800 rounded-lg overflow-x-auto text-xs">
            {[
              { id: 'all', label: t.models.filterAll },
              { id: 'video', label: t.models.filterVideo },
              { id: 'image', label: t.models.filterImage },
              { id: 'voice', label: t.models.filterVoice },
              { id: 'text', label: t.models.filterText },
              { id: 'proofreading', label: t.models.filterProofreading },
              { id: 'music', label: t.models.filterMusic },
              { id: 'translation', label: t.models.filterTranslation },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  typeFilter === tab.id
                    ? 'bg-slate-800 text-amber-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* High-density Data Grid */}
        <div className="rounded-lg border border-slate-800 bg-[#0d1017] overflow-x-auto">
          <table className={`w-full ${isRtl ? 'text-right' : 'text-left'} text-xs border-collapse`}>
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">{t.models.colProviderModel}</th>
                <th className="py-3 px-3">{t.models.colType}</th>
                <th className="py-3 px-3">{t.models.colConnectionStatus}</th>
                <th className="py-3 px-3">{t.models.colCapabilities}</th>
                <th className="py-3 px-3 text-center">{t.models.colPriority}</th>
                <th className="py-3 px-3 text-center">{t.models.colFallback}</th>
                <th className="py-3 px-3">{t.models.colQualitySpeed}</th>
                <th className={`py-3 px-3 ${isRtl ? 'text-left' : 'text-right'}`}>{t.models.colUnitCost}</th>
                <th className="py-3 px-4 text-center">{t.models.colState}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredModels.map((model) => (
                <tr
                  key={model.id}
                  className={`hover:bg-slate-900/40 transition-colors ${
                    !model.enabled ? 'opacity-50' : ''
                  }`}
                >
                  {/* Provider & Model */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-100">{model.displayName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      <span className="uppercase text-amber-400/90">{model.provider}</span> · {model.model}
                    </div>
                  </td>

                  {/* Modality Type */}
                  <td className="py-3 px-3">
                    <span className="text-slate-300 capitalize font-medium">{model.type}</span>
                  </td>

                  {/* Connection Status: Clearly Shows "Not connected" */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60">
                      <Unplug className="w-3 h-3 text-slate-500" />
                      <span>{t.models.notConnectedBadge}</span>
                    </span>
                  </td>

                  {/* Capabilities */}
                  <td className="py-3 px-3 max-w-xs">
                    <div className="text-[11px] text-slate-400 line-clamp-2">
                      {model.capabilities.join(' · ')}
                    </div>
                  </td>

                  {/* Priority (1 to 10) */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={model.priority}
                      onChange={(e) => handlePriorityChange(model.id, Number(e.target.value))}
                      className="w-12 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-center font-mono tabular-nums text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </td>

                  {/* Fallback Priority */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={model.fallbackPriority}
                      onChange={(e) => handleFallbackPriorityChange(model.id, Number(e.target.value))}
                      className="w-12 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-center font-mono tabular-nums text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </td>

                  {/* Quality & Speed */}
                  <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                    <div className="text-slate-200 capitalize font-medium">{model.quality}</div>
                    <div className="text-slate-500 font-mono tabular-nums">{model.speed} (~{model.speedMsAvg}ms)</div>
                  </td>

                  {/* Cost */}
                  <td className={`py-3 px-3 ${isRtl ? 'text-left' : 'text-right'} font-mono tabular-nums text-slate-300 whitespace-nowrap`}>
                    ${model.cost.priceUsd.toFixed(model.cost.priceUsd < 0.001 ? 6 : 3)}
                    <span className="text-[10px] text-slate-500 mx-1">/{model.cost.unit}</span>
                  </td>

                  {/* Enabled / Disabled Toggle */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleToggleEnabled(model.id, model.enabled)}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                        model.enabled
                          ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600'
                          : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {model.enabled ? (isRtl ? 'مفعّل بالهيكل' : 'Enabled') : (isRtl ? 'معطّل' : 'Disabled')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
