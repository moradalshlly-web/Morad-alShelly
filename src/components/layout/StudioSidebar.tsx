/**
 * Studio Sidebar Navigation
 * Multilingual, clean icon + text hierarchy, dark slate palette, RTL/LTR compliant.
 */

import React from 'react';
import { NavigationTab, useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Home,
  Film,
  Sparkles,
  FolderArchive,
  Users,
  Cpu,
  Settings as SettingsIcon,
  Clapperboard,
  FileCheck2,
} from 'lucide-react';

export const StudioSidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeProject } = useStudio();
  const { t, isRtl } = useLanguage();

  const navItems: Array<{ id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'projects', label: t.nav.projects, icon: Film },
    { id: 'create', label: t.nav.create, icon: Sparkles },
    { id: 'proofreader', label: t.nav.proofreader, icon: FileCheck2 },
    { id: 'characters', label: t.nav.characters, icon: Users },
    { id: 'assets', label: t.nav.assets, icon: FolderArchive },
    { id: 'models', label: t.nav.models, icon: Cpu },
    { id: 'settings', label: t.nav.settings, icon: SettingsIcon },
  ];

  return (
    <aside className={`w-64 bg-[#090b0e] ${isRtl ? 'border-l' : 'border-r'} border-slate-800/80 flex flex-col justify-between shrink-0 select-none`}>
      {/* Primary Navigation List */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] uppercase font-semibold tracking-wider text-slate-500">
          {t.common.appName}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id || (item.id === 'projects' && activeTab === 'workspace');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isRtl ? 'text-right' : 'text-left'
              } cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 text-amber-300 shadow-sm border border-slate-700/60 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Active Project Card in Sidebar if one is open */}
        {activeProject && (
          <div className="pt-4 mt-4 border-t border-slate-800/60">
            <div className="px-3 py-1.5 text-[10px] uppercase font-semibold tracking-wider text-slate-500 flex items-center justify-between">
              <span>{t.nav.workspace}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <button
              onClick={() => setActiveTab('workspace')}
              className={`w-full mt-1 p-2.5 rounded-md ${isRtl ? 'text-right' : 'text-left'} transition-all border cursor-pointer ${
                activeTab === 'workspace'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clapperboard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div className="truncate text-xs font-semibold">{activeProject.title}</div>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
                <span>{activeProject.style}</span>
                <span>·</span>
                <span className="font-mono tabular-nums">{activeProject.targetDurationSeconds}s</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Footer Status Area */}
      <div className="p-3 border-t border-slate-800/80 bg-[#07090c]">
        <div className="p-2.5 rounded-md bg-slate-900/70 border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>{isRtl ? 'موجّه مورو الذاتي' : 'Moro AI Router'}</span>
            <span className="text-emerald-400 font-medium">{isRtl ? 'جاهز' : 'Ready'}</span>
          </div>
          <div className="text-[10px] text-slate-500 leading-relaxed">
            {isRtl
              ? 'بنية التوجيه المستقلة جاهزة للربط المستقبلي مع المزودين.'
              : 'Decoupled provider router with automated failover ready.'}
          </div>
        </div>
      </div>
    </aside>
  );
};
