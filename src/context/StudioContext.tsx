/**
 * Studio Context
 * Global state provider for Moro AI studio navigation, project selection,
 * router tuning, and active database syncing.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Project, Settings, User } from '../types/database';
import { ProviderModel } from '../types/models';
import { db } from '../services/database';
import { aiRouter } from '../services/ai-router';

export type NavigationTab =
  | 'home'
  | 'projects'
  | 'create'
  | 'proofreader'
  | 'workspace'
  | 'assets'
  | 'characters'
  | 'models'
  | 'settings';

interface StudioContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeProjectId: string | null;
  activeProject: Project | null;
  openProjectWorkspace: (projectId: string) => void;
  closeProjectWorkspace: () => void;
  projects: Project[];
  refreshProjects: () => Promise<void>;
  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  user: User | null;
  settings: Settings | null;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  models: ProviderModel[];
  refreshModels: () => void;
  updateModel: (id: string, updates: Partial<ProviderModel>) => void;
  notification: { message: string; type: 'info' | 'success' | 'warning' | 'error' } | null;
  showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  clearNotification: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [models, setModels] = useState<ProviderModel[]>(aiRouter.getModels());
  const [notification, setNotification] = useState<{
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  } | null>(null);

  const refreshProjects = async () => {
    const list = await db.getProjects();
    setProjects(list);
    if (activeProjectId) {
      const current = list.find((p) => p.id === activeProjectId) || null;
      setActiveProject(current);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const [u, s, p] = await Promise.all([
        db.getCurrentUser(),
        db.getSettings(),
        db.getProjects(),
      ]);
      setUser(u);
      setSettings(s);
      setProjects(p);
      setModels(aiRouter.getModels());
    };
    loadInitialData();
  }, []);

  const openProjectWorkspace = async (projectId: string) => {
    setActiveProjectId(projectId);
    const p = await db.getProjectById(projectId);
    setActiveProject(p);
    setActiveTab('workspace');
  };

  const closeProjectWorkspace = () => {
    setActiveProjectId(null);
    setActiveProject(null);
    setActiveTab('projects');
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await db.createProject(projectData);
    await refreshProjects();
    showNotification(`Project "${created.title}" initialized`, 'success');
    return created;
  };

  const deleteProject = async (projectId: string) => {
    await db.deleteProject(projectId);
    if (activeProjectId === projectId) {
      setActiveProjectId(null);
      setActiveProject(null);
      setActiveTab('projects');
    }
    await refreshProjects();
    showNotification('Project deleted from studio registry', 'info');
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const updated = await db.updateSettings(updates);
    setSettings(updated);
    showNotification('Studio preferences updated', 'success');
  };

  const refreshModels = () => {
    setModels(aiRouter.getModels());
  };

  const updateModel = (id: string, updates: Partial<ProviderModel>) => {
    const current = aiRouter.getModels();
    const index = current.findIndex((m) => m.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...updates };
      aiRouter.updateModels(current);
      setModels([...current]);
      showNotification(`Model "${current[index].displayName}" routing policy updated`, 'info');
    }
  };

  const showNotification = (
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const clearNotification = () => setNotification(null);

  return (
    <StudioContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeProjectId,
        activeProject,
        openProjectWorkspace,
        closeProjectWorkspace,
        projects,
        refreshProjects,
        createProject,
        deleteProject,
        user,
        settings,
        updateSettings,
        models,
        refreshModels,
        updateModel,
        notification,
        showNotification,
        clearNotification,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
