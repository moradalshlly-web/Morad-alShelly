/**
 * Router Simulation Test Bench
 * Demonstrates the core AI Router algorithm, multi-factor scoring,
 * and automatic fallback cascade when a provider encounters a failure.
 */

import React, { useState } from 'react';
import { aiRouter } from '../../services/ai-router';
import { useLanguage } from '../../i18n/LanguageContext';
import { OptimizationPreference, RouteResolution } from '../../types/ai-router';
import { ProviderType } from '../../types/providers';
import { CheckCircle2, Play, ShieldAlert, Zap } from 'lucide-react';

export const RouterSimulationCard: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const [task, setTask] = useState<ProviderType>('video');
  const [preference, setPreference] = useState<OptimizationPreference>('highest-quality');
  const [resolution, setResolution] = useState<RouteResolution | null>(null);
  const [simulatedFailureResult, setSimulatedFailureResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunResolution = () => {
    try {
      const res = aiRouter.resolveRoute({
        task,
        preference,
      });
      setResolution(res);
      setSimulatedFailureResult(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Routing error');
    }
  };

  const handleSimulateOutageFallback = async () => {
    setIsSimulating(true);
    const result = await aiRouter.executeWithFallback(
      { task, preference },
      async (model) => {
        if (model.id === resolution?.selectedModel.id || !simulatedFailureResult) {
          throw new Error(`[Simulated 503 Provider Timeout] Upstream server unavailable for ${model.provider}`);
        }
        return { rendered: true, timestamp: new Date().toISOString() };
      }
    );
    setSimulatedFailureResult(result);
    setIsSimulating(false);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d1017] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-display">
              {t.models.simulationTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.models.simulationDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunResolution}
            className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{t.models.btnTestRouter}</span>
          </button>
        </div>
      </div>

      {/* Control Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">
            {isRtl ? 'المهمة والتخصص المستهدف' : 'Target Modality Task'}
          </label>
          <select
            value={task}
            onChange={(e) => {
              setTask(e.target.value as ProviderType);
              setResolution(null);
            }}
            className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="video">{isRtl ? 'توليد الفيديو (Video)' : 'Video Generation'}</option>
            <option value="image">{isRtl ? 'توليد الصور (Image)' : 'Image Generation'}</option>
            <option value="voice">{isRtl ? 'توليد الصوت والدوبلاج (Voice)' : 'Voice & Audio Synthesis'}</option>
            <option value="text">{isRtl ? 'كتابة وتفكيك السيناريو (Text)' : 'Scriptwriting & Screenplay'}</option>
            <option value="proofreading">{isRtl ? 'التدقيق اللغوي الذكي (Proofreading)' : 'AI Language Proofreading'}</option>
            <option value="music">{isRtl ? 'الموسيقى والمؤثرات (Music)' : 'Music & Film Score'}</option>
            <option value="translation">{isRtl ? 'ترجمة الحوار والترجمات (Translation)' : 'Translation & Subtitles'}</option>
            <option value="speech-to-text">{isRtl ? 'تحويل الصوت لنص وتوقيت (STT)' : 'Speech-to-Text Transcribe'}</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-slate-400 font-medium">
            {isRtl ? 'سياسة التحسين والأولوية' : 'Optimization Preference'}
          </label>
          <select
            value={preference}
            onChange={(e) => {
              setPreference(e.target.value as OptimizationPreference);
              setResolution(null);
            }}
            className="w-full bg-[#090b0e] border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="highest-quality">{isRtl ? 'أعلى جودة سينمائية (Highest Quality)' : 'Highest Quality (Cinematic Fidelity)'}</option>
            <option value="lowest-latency">{isRtl ? 'أقل زمن استجابة (Lowest Latency)' : 'Lowest Latency (Real-time Speed)'}</option>
            <option value="lowest-cost">{isRtl ? 'أقل تكلفة تشغيلية (Lowest Cost)' : 'Lowest Cost (Economy Budget)'}</option>
            <option value="balanced">{isRtl ? 'توازن متعدد المعايير (Balanced)' : 'Balanced Multi-Factor'}</option>
          </select>
        </div>

        <div className="space-y-1 flex flex-col justify-end">
          <button
            onClick={handleSimulateOutageFallback}
            disabled={!resolution || isSimulating}
            className="w-full py-2 px-3 text-xs bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded font-medium transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>
              {isSimulating
                ? (isRtl ? 'جارٍ المحاكاة...' : 'Triggering...')
                : (isRtl ? 'محاكاة عطل وتفعيل البديل التلقائي' : 'Simulate Provider Outage')}
            </span>
          </button>
        </div>
      </div>

      {/* Resolution Output */}
      {resolution && (
        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Winner */}
            <div className="p-4 rounded-lg bg-slate-900/80 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {isRtl ? 'المسار الأساسي المختار' : 'Primary Selected Route'}
                </span>
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                  Score: {resolution.candidateScores[0]?.totalScore}/100
                </span>
              </div>
              <div className="text-sm font-bold text-white">
                {resolution.selectedModel.displayName}
              </div>
              <div className="text-xs text-slate-400">
                {isRtl ? 'المزود:' : 'Provider:'} <span className="text-slate-200 font-mono uppercase">{resolution.selectedModel.provider}</span> · {isRtl ? 'النموذج:' : 'Model:'} <span className="font-mono text-amber-300">{resolution.selectedModel.model}</span>
              </div>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                {resolution.candidateScores[0]?.reason}
              </div>
            </div>

            {/* Fallback Hierarchy Chain */}
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300">
                {isRtl
                  ? `سلسلة البدائل التلقائية (${resolution.fallbackChain.length} مزود بديل)`
                  : `Cascading Fallback Order (${resolution.fallbackChain.length} standby providers)`}
              </div>
              <div className="space-y-1.5 text-xs">
                {resolution.fallbackChain.length === 0 ? (
                  <span className="text-slate-500 text-[11px]">
                    {isRtl ? 'لا يوجد مزود بديل مسجل لهذه المهمة حاليًا.' : 'No secondary fallback registered for this modality.'}
                  </span>
                ) : (
                  resolution.fallbackChain.map((fallback, idx) => (
                    <div
                      key={fallback.id}
                      className="p-2 rounded bg-slate-950/60 border border-slate-800/70 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                          #{idx + 1}
                        </span>
                        <span className="text-slate-200 text-xs font-medium">
                          {fallback.displayName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {fallback.provider}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Outage Simulation Output */}
          {simulatedFailureResult && (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs space-y-2 animate-in fade-in duration-150">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? 'تم تفعيل التبديل التلقائي إلى المزود البديل بنجاح' : 'Cascading Failover Triggered Successfully'}</span>
              </div>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                {isRtl ? (
                  <>
                    تعذر الاتصال بالمزود الرئيسي ({simulatedFailureResult.fallbackEvents[0]?.failedModelId}). قام موجّه مورو الذاتي برصد الانقطاع خلال <span className="font-mono text-amber-300 tabular-nums">{simulatedFailureResult.totalLatencyMs}ms</span> وتحويل الطلب فوراً للمزود البديل <span className="font-mono text-emerald-300">{simulatedFailureResult.selectedModel.displayName}</span> دون انقطاع خط الإنتاج الإبداعي.
                  </>
                ) : (
                  <>
                    The primary model ({simulatedFailureResult.fallbackEvents[0]?.failedModelId}) threw an upstream connection error.
                    The Moro AI Router intercepted the failure in <span className="font-mono text-amber-300 tabular-nums">{simulatedFailureResult.totalLatencyMs}ms</span> and seamlessly routed the request to fallback model <span className="font-mono text-emerald-300">{simulatedFailureResult.selectedModel.displayName}</span> without failing the project workflow.
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
