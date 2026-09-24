/**
 * Projects View
 * Catalog and management of all Moro AI creative projects.
 */

import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Plus, Search, Film, Trash2, ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { NewProjectModal } from './NewProjectModal';

export const ProjectsView: React.FC = () => {
  const { projects, openProjectWorkspace, deleteProject } = useStudio();
  const { t, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStyle = selectedStyle === 'all' || p.style === selectedStyle;

    return matchesSearch && matchesStyle;
  });

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">{t.projects.title}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.projects.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.projects.newProjectBtn}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-2.5 text-slate-500`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.projects.searchPlaceholder}
            className={`w-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 bg-[#0c0f15] border border-slate-800 rounded-md text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400`}
          />
        </div>

        {/* Style Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#0c0f15] border border-slate-800 rounded-lg overflow-x-auto text-xs">
          {[
            { id: 'all', label: t.projects.filterAllStyles },
            { id: 'cinematic', label: isRtl ? 'سينمائي' : 'Cinematic' },
            { id: 'anime', label: isRtl ? 'أنمي' : 'Anime' },
            { id: 'realistic', label: isRtl ? 'واقعي' : 'Realistic' },
            { id: 'cartoon', label: isRtl ? 'كرتوني' : 'Cartoon' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStyle(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedStyle === tab.id
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Film}
          title={t.projects.noProjectsTitle}
          description={t.projects.noProjectsDesc}
          actionLabel={t.projects.newProjectBtn}
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => openProjectWorkspace(project.id)}
              className="group rounded-lg border border-slate-800 bg-[#0d1017] hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between overflow-hidden shadow-sm"
            >
              {/* Cover Media */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                {project.coverImageUrl ? (
                  <img
                    src={project.coverImageUrl}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-700">
                    <Film className="w-8 h-8" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent p-4 flex flex-col justify-end">
                  <div className="flex items-center justify-between text-xs">
                    <StatusBadge status={project.status} />
                    <span className="text-[11px] font-mono text-slate-300 tabular-nums">
                      {project.aspectRatio}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 truncate">{project.title}</h3>
                </div>
              </div>

              {/* Metadata content */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Clean unboxed tags */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 overflow-hidden">
                  <span>{project.genre}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{project.style}</span>
                  {project.tags.slice(0, 2).map((tag) => (
                    <React.Fragment key={tag}>
                      <span aria-hidden="true">·</span>
                      <span>{tag}</span>
                    </React.Fragment>
                  ))}
                </div>

                {/* Card footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">
                      {project.targetDurationSeconds} {isRtl ? 'ثانية' : 'sec'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(t.common.confirmDelete)) {
                          deleteProject(project.id);
                        }
                      }}
                      title={t.common.delete}
                      className="p-1.5 text-slate-600 hover:text-rose-400 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openProjectWorkspace(project.id)}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      <span>{t.projects.openWorkspace}</span>
                      <ArrowIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && <NewProjectModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
