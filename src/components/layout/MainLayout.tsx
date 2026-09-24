/**
 * Main Layout Component
 * Coordinates Top Bar, Sidebar, and Central Viewport Canvas with RTL/LTR adherence.
 */

import React, { useState } from 'react';
import { StudioHeader } from './StudioHeader';
import { StudioSidebar } from './StudioSidebar';
import { Menu } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { NewProjectModal } from '../projects/NewProjectModal';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notification, clearNotification } = useStudio();
  const { isRtl } = useLanguage();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#090b0e] text-[#e2e8f0] overflow-hidden">
      {/* Top Bar */}
      <StudioHeader
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (drawer on mobile, permanent on desktop) */}
        <StudioSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Viewport Canvas */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#090b0e]">
          {children}
        </main>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 ${
            isRtl ? 'left-5' : 'right-5'
          } z-50 flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-900/95 border border-slate-700 text-xs shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2`}
        >
          {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
          {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
          {notification.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
          {notification.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}

          <span className="text-slate-200">{notification.message}</span>

          <button
            onClick={clearNotification}
            className="p-1 text-slate-500 hover:text-slate-300 rounded cursor-pointer transition-colors mx-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <NewProjectModal onClose={() => setIsNewProjectModalOpen(false)} />
      )}
    </div>
  );
};
