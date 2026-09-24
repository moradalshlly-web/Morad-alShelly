/**
 * Generations Sub-Tab
 * Complete audit trail of generation executions:
 * Routed model, cost, latency, prompt tokens, candidate options generated, and fallback logs.
 */

import React from 'react';
import { useProjectWorkspace } from '../../../context/ProjectWorkspaceContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { StatusBadge } from '../../common/StatusBadge';
import { Cpu, Clock, DollarSign, Layers, RefreshCw } from 'lucide-react';

export const GenerationsSubTab: React.FC = () => {
  const { generations, refreshWorkspaceData } = useProjectWorkspace();
  const { t, isRtl } = useLanguage();

  return (
    <div className={`space-y-6 max-w-5xl ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs uppercase font-semibold text-slate-500">
            {isRtl ? 'سجلات معالجة خط الإنتاج' : 'Pipeline Generation Logs'}
          </div>
          <h3 className="text-sm font-bold text-white mt-0.5">
            {t.workspace.generations.title} ({generations.length} {isRtl ? 'مهام' : 'Jobs'})
          </h3>
        </div>

        <button
          onClick={refreshWorkspaceData}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 rounded transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t.workspace.generations.btnRefresh}</span>
        </button>
      </div>

      <div className="space-y-4">
        {generations.map((gen) => (
          <div
            key={gen.id}
            className="rounded-lg border border-slate-800 bg-[#0d1017] p-5 space-y-4"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <StatusBadge status="completed" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {gen.type} {isRtl ? 'مهمة' : 'Task'}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-slate-400">ID: {gen.id}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1 font-mono text-[11px] tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{gen.latencyMs}ms</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px] tabular-nums text-emerald-400">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>${gen.costUsd?.toFixed(4)}</span>
                </div>
              </div>
            </div>

            {/* Routed Model Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="text-[10px] uppercase font-semibold text-slate-500 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-amber-400" />
                  <span>{isRtl ? 'المزود الموجه والنموذج' : 'Routed Provider & Model'}</span>
                </div>
                <div className="font-semibold text-slate-200">
                  {gen.modelUsed}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {isRtl ? 'المزود المعماري:' : 'Provider Slot:'} <span className="uppercase text-slate-400">{gen.providerUsed}</span>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="text-[10px] uppercase font-semibold text-slate-500 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-sky-400" />
                  <span>{isRtl ? 'التوجيه السردي وبذرة الإخراج' : 'Prompt / Directing Seed'}</span>
                </div>
                <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {gen.prompt}
                </div>
              </div>
            </div>

            {/* Candidate Options Output */}
            {gen.outputs && gen.outputs.length > 0 && (
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-semibold text-slate-500">
                  {isRtl ? 'الخيارات المتوازية المولدة (معمارية الخيارات الثلاثة)' : 'Generated Parallel Candidates (Three-Option Architecture)'}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {gen.outputs.map((out, i) => (
                    <div
                      key={i}
                      className="relative aspect-video rounded overflow-hidden border border-slate-800 bg-slate-950"
                    >
                      <img src={out.url} alt={`Candidate ${i + 1}`} className="w-full h-full object-cover" />
                      <span className={`absolute bottom-1 ${isRtl ? 'right-1' : 'left-1'} bg-black/75 text-[9px] font-mono text-amber-400 px-1.5 py-0.5 rounded`}>
                        {isRtl ? 'الخيار' : 'Option'} {out.optionIndex + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
