/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { StudioProvider, useStudio } from './context/StudioContext';
import { MainLayout } from './components/layout/MainLayout';
import { HomeDashboard } from './components/home/HomeDashboard';
import { ProjectsView } from './components/projects/ProjectsView';
import { CreateStudioView } from './components/create/CreateStudioView';
import { AIProofreaderView } from './components/proofreader/AIProofreaderView';
import { ProjectWorkspaceView } from './components/workspace/ProjectWorkspaceView';
import { AssetLibraryView } from './components/assets/AssetLibraryView';
import { CharactersView } from './components/characters/CharactersView';
import { ModelRegistryView } from './components/models/ModelRegistryView';
import { StudioSettingsView } from './components/settings/StudioSettingsView';

const StudioContent: React.FC = () => {
  const { activeTab } = useStudio();

  return (
    <MainLayout>
      {activeTab === 'home' && <HomeDashboard />}
      {activeTab === 'projects' && <ProjectsView />}
      {activeTab === 'create' && <CreateStudioView />}
      {activeTab === 'proofreader' && <AIProofreaderView />}
      {activeTab === 'workspace' && <ProjectWorkspaceView />}
      {activeTab === 'assets' && <AssetLibraryView />}
      {activeTab === 'characters' && <CharactersView />}
      {activeTab === 'models' && <ModelRegistryView />}
      {activeTab === 'settings' && <StudioSettingsView />}
    </MainLayout>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <StudioProvider>
        <StudioContent />
      </StudioProvider>
    </LanguageProvider>
  );
}
