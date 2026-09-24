/**
 * Studio Header Component
 * Strict 3-zone contract with accessible language switcher:
 * [Wordmark & Context] — [Navigation links] — [Language switcher & Primary Actions]
 */

import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { Plus, Sparkles, Wand2, Menu } from 'lucide-react';

interface StudioHeaderProps {
  onOpenNewProjectModal: () => void;
  onMenuClick: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({ onOpenNewProjectModal, onMenuClick }) => {
  const { activeTab, setActiveTab, activeProject, user } = useStudio();
  const { t, isRtl } = useLanguage();

  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#0c0f14]/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Zone 0: Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer shrink-0"
        aria-label={isRtl ? 'فتح القائمة' : 'Open menu'}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={() => setActiveTab('home')}
          className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-tr from-amber-500 to-amber-300 inline-block shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
          <span className="font-display tracking-wider">{t.common.appName}</span>
        </button>

        {/* Quiet breadcrumb separator */}
        <span className="text-slate-600 hidden sm:inline">/</span>
        <span className="text-xs font-medium text-slate-400 tracking-wider hidden sm:inline">
          {activeTab === 'workspace' && activeProject
            ? `${t.nav.workspace} · ${activeProject.title}`
            : t.nav[activeTab as keyof typeof t.nav] || activeTab}
        </span>
      </div>

      {/* Zone 2: Fast Navigation Links (Single-line controls) */}
      <nav className="hidden xl:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('home')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          {t.nav.home}
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeTab === 'projects' || activeTab === 'workspace' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          {t.nav.projects}
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeTab === 'create' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          {t.nav.create}
        </button>
        <button
          onClick={() => setActiveTab('proofreader')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeTab === 'proofreader' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          {t.nav.proofreader}
        </button>
        <button
          onClick={() => setActiveTab('models')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeTab === 'models' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          {t.nav.models}
        </button>
      </nav>

      {/* Zone 3: Language Switcher & Primary Actions */}
      <div className="flex items-center gap-3">
        {/* Prominent Language Switcher */}
        <LanguageSwitcher variant="header" />

        <button
          onClick={() => setActiveTab('create')}
          className="hidden sm:flex px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md hover:bg-amber-500/20 transition-colors items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.nav.suggestForMe}</span>
        </button>

        <button
          onClick={onOpenNewProjectModal}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.header.newProject}</span>
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block"></div>

        {/* User indicator */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-300">
            {user?.displayName ? user.displayName.charAt(0) : 'M'}
          </div>
        </div>
      </div>
    </header>
  );
};
