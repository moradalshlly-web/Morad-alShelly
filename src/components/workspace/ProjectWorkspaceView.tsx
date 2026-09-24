/**
 * Project Workspace View
 * Multi-tab creative orchestration console for an active project:
 * - 12-Stage Creative Pipeline progress banner
 * - Sub-tabs: Script, Scenes (3-Option System), Characters, Timeline, Assets, Generations, Exports
 */

import React from 'react';
import {
  ProjectWorkspaceProvider,
  useProjectWorkspace,
  WorkspaceSubTab,
} from '../../context/ProjectWorkspaceContext';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  FileText,
  Users,
  Clapperboard,
  Clock,
  FolderArchive,
  Cpu,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Download,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { ScriptSubTab } from './subtabs/ScriptSubTab';
import { ScenesSubTab } from './subtabs/ScenesSubTab';
import { TimelineSubTab } from './subtabs/TimelineSubTab';
import { GenerationsSubTab } from './subtabs/GenerationsSubTab';
import { ExportsSubTab } from './subtabs/ExportsSubTab';
import { AssetLibraryView } from '../assets/AssetLibraryView';
import { CharactersView } from '../characters/CharactersView';

const WorkspaceContent: React.FC = () => {
  const { project, subTab, setSubTab, pipelineState, advancePipelineStage } = useProjectWorkspace();
  const { closeProjectWorkspace } = useStudio();
  const { t, isRtl } = useLanguage();

  const ReturnArrow = isRtl ? ArrowRight : ArrowLeft;

  const tabs: Array<{ id: WorkspaceSubTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'scenes', label: t.workspace.tabs.scenes, icon: Clapperboard },
    { id: 'timeline', label: t.workspace.tabs.timeline, icon: Clock },
    { id: 'script', label: t.workspace.tabs.script, icon: FileText },
    { id: 'characters', label: t.workspace.tabs.characters, icon: Users },
    { id: 'assets', label: t.workspace.tabs.assets, icon: FolderArchive },
    { id: 'generations', label: t.workspace.tabs.generations, icon: Cpu },
    { id: 'exports', label: t.workspace.tabs.exports, icon: Download },
  ];

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* 1. Project Title & Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={closeProjectWorkspace}
            className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 transition-colors cursor-pointer shrink-0"
            title={t.workspace.returnToProjects}
          >
            <ReturnArrow className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-display truncate max-w-xl">
                {project.title}
              </h1>
              <StatusBadge status={project.status} />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{project.genre}</span>
              <span>·</span>
              <span className="capitalize">{project.style}</span>
              <span>·</span>
              <span className="font-mono tabular-nums">{project.aspectRatio}</span>
              <span>·</span>
              <span className="font-mono tabular-nums">
                {project.targetDurationSeconds} {isRtl ? 'ثانية مدة العرض' : 's runtime'}
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline Stage Quick Step */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={advancePipelineStage}
            disabled={pipelineState.isProcessing}
            className="px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 rounded transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {pipelineState.isProcessing
                ? (isRtl ? 'جارٍ معالجة المرحلة...' : 'Processing Stage...')
                : `${t.workspace.advanceStage}: ${pipelineState.currentStage}`}
            </span>
          </button>
        </div>
      </div>

      {/* 2. 12-Stage Creative Pipeline Banner */}
      <div className="p-3.5 rounded-lg border border-slate-800 bg-[#0c0f15] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {t.workspace.pipelineBannerTitle}: <span className="text-amber-400 font-mono">{pipelineState.currentStage}</span>
          </span>
          <span className="text-slate-500 text-[11px]">
            {pipelineState.stages[pipelineState.currentStage]?.status === 'completed'
              ? (isRtl ? 'تم التحقق من المرحلة' : 'Stage Verified')
              : (isRtl ? 'المرحلة نشطة' : 'Stage Active')}
          </span>
        </div>

        {/* Progress pills indicator */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 text-[10px] font-mono text-slate-400">
          {[
            'input',
            'content-understanding',
            'context-detection',
            'tone-detection',
            'content-type',
            'script',
            'scenes',
            'characters',
            'voice',
            'visuals',
            'generation',
            'review',
            'export',
          ].map((st, i) => {
            const stageKey = st as import('../../types/pipeline').PipelineStage;
            const isDone = pipelineState.stages[stageKey]?.status === 'completed';
            const isCurrent = pipelineState.currentStage === st;

            return (
              <div
                key={st}
                className={`px-2 py-1 rounded whitespace-nowrap transition-colors flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : isDone
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-slate-900 text-slate-500'
                }`}
              >
                <span>{i + 1}</span>
                <span className="capitalize">{st.replace('-', ' ')}</span>
              </div>
            );
          })}
        </div>

        {pipelineState.stages[pipelineState.currentStage]?.outputSummary && (
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span className="text-slate-500 font-medium">
              {isRtl ? 'استنتاج المرحلة: ' : 'Stage Inference: '}
            </span>
            {pipelineState.stages[pipelineState.currentStage].outputSummary}
          </div>
        )}
      </div>

      {/* 3. Sub-Tab Switcher */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto text-xs pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-t-md font-semibold transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800/80 text-amber-300 border-b-2 border-amber-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Active Sub-Tab Canvas */}
      <div>
        {subTab === 'scenes' && <ScenesSubTab />}
        {subTab === 'timeline' && <TimelineSubTab />}
        {subTab === 'script' && <ScriptSubTab />}
        {subTab === 'characters' && <CharactersView />}
        {subTab === 'assets' && <AssetLibraryView />}
        {subTab === 'generations' && <GenerationsSubTab />}
        {subTab === 'exports' && <ExportsSubTab />}
      </div>
    </div>
  );
};

export const ProjectWorkspaceView: React.FC = () => {
  const { activeProject } = useStudio();
  const { isRtl } = useLanguage();

  if (!activeProject) {
    return (
      <div className="p-8 text-center text-slate-500">
        {isRtl ? 'لم يتم تحميل أي مشروع نشط.' : 'No active project loaded.'}
      </div>
    );
  }

  return (
    <ProjectWorkspaceProvider project={activeProject}>
      <WorkspaceContent />
    </ProjectWorkspaceProvider>
  );
};
