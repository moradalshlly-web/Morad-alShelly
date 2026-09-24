/**
 * Project Workspace Context
 * Manages the multi-tab state for an active creative project:
 * Script, Characters, Scenes, Assets, Audio, Timeline, Generations, Exports.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Asset, Character, Generation, Project, Scene } from '../types/database';
import { TimelineState } from '../types/timeline';
import { PipelineState } from '../types/pipeline';
import { db } from '../services/database';
import { PipelineOrchestrator } from '../services/pipeline/PipelineOrchestrator';
import { useStudio } from './StudioContext';

export type WorkspaceSubTab =
  | 'script'
  | 'characters'
  | 'scenes'
  | 'timeline'
  | 'assets'
  | 'generations'
  | 'exports';

interface ProjectWorkspaceContextType {
  project: Project;
  subTab: WorkspaceSubTab;
  setSubTab: (tab: WorkspaceSubTab) => void;
  scenes: Scene[];
  characters: Character[];
  assets: Asset[];
  generations: Generation[];
  pipelineState: PipelineState;
  timelineState: TimelineState;
  refreshWorkspaceData: () => Promise<void>;
  createScene: (sceneData: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Scene>;
  updateScene: (sceneId: string, updates: Partial<Scene>) => Promise<Scene>;
  deleteScene: (sceneId: string) => Promise<void>;
  selectSceneOption: (sceneId: string, optionIndex: number) => Promise<void>;
  replaceSceneVisual: (sceneId: string, optionIndex: number, newPrompt: string) => Promise<void>;
  createCharacter: (charData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Character>;
  updateCharacter: (charId: string, updates: Partial<Character>) => Promise<Character>;
  deleteCharacter: (charId: string) => Promise<void>;
  advancePipelineStage: () => Promise<void>;
  updateTimelineTime: (timeSeconds: number) => void;
  toggleTimelinePlayback: () => void;
}

const ProjectWorkspaceContext = createContext<ProjectWorkspaceContextType | undefined>(undefined);

export const ProjectWorkspaceProvider: React.FC<{
  project: Project;
  children: React.ReactNode;
}> = ({ project, children }) => {
  const { showNotification } = useStudio();
  const [subTab, setSubTab] = useState<WorkspaceSubTab>('scenes');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [pipelineState, setPipelineState] = useState<PipelineState>(
    PipelineOrchestrator.createInitialState(project.id)
  );

  const [timelineState, setTimelineState] = useState<TimelineState>({
    totalDurationSeconds: project.targetDurationSeconds || 120,
    currentTimeSeconds: 0,
    isPlaying: false,
    zoomLevel: 10,
    snapToGrid: true,
    tracks: [
      {
        id: 'track_video_1',
        name: 'V1 · Cinematic Visuals',
        type: 'video',
        isMuted: false,
        isLocked: false,
        volume: 1.0,
        order: 1,
        clips: [
          {
            id: 'clip_v1',
            trackId: 'track_video_1',
            name: 'Scene 1: Air-Lock Breach',
            type: 'video',
            startTime: 0,
            duration: 14,
            thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
            color: '#d97706',
          },
          {
            id: 'clip_v2',
            trackId: 'track_video_1',
            name: 'Scene 2: Bioluminescent Canopy',
            type: 'video',
            startTime: 14,
            duration: 18,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
            color: '#0ea5e9',
          },
        ],
      },
      {
        id: 'track_voice_1',
        name: 'A1 · Dialogue & Voiceover',
        type: 'voiceover',
        isMuted: false,
        isLocked: false,
        volume: 0.9,
        order: 2,
        clips: [
          {
            id: 'clip_vo1',
            trackId: 'track_voice_1',
            name: 'Dr. Vance: "Pressure seals holding..."',
            type: 'voiceover',
            startTime: 2,
            duration: 8,
            color: '#10b981',
          },
        ],
      },
      {
        id: 'track_music_1',
        name: 'A2 · Ambient Score & Bass',
        type: 'music',
        isMuted: false,
        isLocked: false,
        volume: 0.6,
        order: 3,
        clips: [
          {
            id: 'clip_mus1',
            trackId: 'track_music_1',
            name: 'Kepler Subterranean Theme (D-Minor)',
            type: 'music',
            startTime: 0,
            duration: 32,
            color: '#8b5cf6',
          },
        ],
      },
      {
        id: 'track_sub_1',
        name: 'T1 · Subtitle Cues',
        type: 'subtitles',
        isMuted: false,
        isLocked: false,
        volume: 1.0,
        order: 4,
        clips: [
          {
            id: 'clip_sub1',
            trackId: 'track_sub_1',
            name: 'EN: Pressure seals holding...',
            type: 'subtitles',
            startTime: 2,
            duration: 8,
            color: '#64748b',
          },
        ],
      },
    ],
    subtitleTracks: [
      {
        id: 'sub_en',
        languageCode: 'en',
        languageName: 'English (Master)',
        isDefault: true,
        cues: [
          { id: 'c1', startTime: 2.0, endTime: 6.5, text: 'Pressure seals holding... bio-mesh intact.' },
          { id: 'c2', startTime: 7.0, endTime: 10.0, text: 'Elena, confirm environmental oxygen.' },
        ],
      },
      {
        id: 'sub_es',
        languageCode: 'es',
        languageName: 'Spanish (LatAm)',
        isDefault: false,
        cues: [
          { id: 'c3', startTime: 2.0, endTime: 6.5, text: 'Sellos de presión estables... bio-malla intacta.' },
          { id: 'c4', startTime: 7.0, endTime: 10.0, text: 'Elena, confirma oxígeno ambiental.' },
        ],
      },
    ],
    activeSubtitleTrackId: 'sub_en',
  });

  const refreshWorkspaceData = async () => {
    const [sc, ch, as, gn] = await Promise.all([
      db.getScenes(project.id),
      db.getCharacters(project.id),
      db.getAssets(project.id),
      db.getGenerations(project.id),
    ]);
    setScenes(sc);
    setCharacters(ch);
    setAssets(as);
    setGenerations(gn);
  };

  useEffect(() => {
    refreshWorkspaceData();
  }, [project.id]);

  const createScene = async (sceneData: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await db.createScene(sceneData);
    await refreshWorkspaceData();
    showNotification(`Scene "${created.title}" added to project`, 'success');
    return created;
  };

  const updateScene = async (sceneId: string, updates: Partial<Scene>) => {
    const updated = await db.updateScene(sceneId, updates);
    await refreshWorkspaceData();
    return updated;
  };

  const deleteScene = async (sceneId: string) => {
    await db.deleteScene(sceneId);
    await refreshWorkspaceData();
    showNotification('Scene deleted from sequence', 'info');
  };

  // Three-option selection
  const selectSceneOption = async (sceneId: string, optionIndex: number) => {
    const targetScene = scenes.find((s) => s.id === sceneId);
    if (!targetScene) return;

    const updatedOptions = targetScene.options.map((opt, i) => ({
      ...opt,
      isCurrentSelection: i === optionIndex,
    }));

    await db.updateScene(sceneId, {
      options: updatedOptions,
      activeOptionIndex: optionIndex,
    });
    await refreshWorkspaceData();
    showNotification(`Switched to Option ${optionIndex + 1} without restarting project`, 'success');
  };

  // Replace single option prompt / candidate (Human in the loop replacement)
  const replaceSceneVisual = async (sceneId: string, optionIndex: number, newPrompt: string) => {
    const targetScene = scenes.find((s) => s.id === sceneId);
    if (!targetScene) return;

    const updatedOptions = [...targetScene.options];
    if (updatedOptions[optionIndex]) {
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        visualPrompt: newPrompt,
        status: 'ready',
      };
    }

    await db.updateScene(sceneId, { options: updatedOptions });
    await refreshWorkspaceData();
    showNotification(`Option ${optionIndex + 1} updated with customized prompt`, 'success');
  };

  const createCharacter = async (charData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await db.createCharacter(charData);
    await refreshWorkspaceData();
    showNotification(`Character "${created.name}" locked for consistency`, 'success');
    return created;
  };

  const updateCharacter = async (charId: string, updates: Partial<Character>) => {
    const updated = await db.updateCharacter(charId, updates);
    await refreshWorkspaceData();
    showNotification(`Character "${updated.name}" updated`, 'success');
    return updated;
  };

  const deleteCharacter = async (charId: string) => {
    await db.deleteCharacter(charId);
    await refreshWorkspaceData();
    showNotification('Character removed from project roster', 'info');
  };

  const advancePipelineStage = async () => {
    const updatedState = await PipelineOrchestrator.processStage(
      pipelineState,
      pipelineState.currentStage,
      { userNotes: project.description }
    );
    setPipelineState(updatedState);
    showNotification(`Pipeline stage "${updatedState.currentStage}" computed`, 'info');
  };

  const updateTimelineTime = (timeSeconds: number) => {
    setTimelineState((prev) => ({
      ...prev,
      currentTimeSeconds: Math.max(0, Math.min(prev.totalDurationSeconds, timeSeconds)),
    }));
  };

  const toggleTimelinePlayback = () => {
    setTimelineState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  return (
    <ProjectWorkspaceContext.Provider
      value={{
        project,
        subTab,
        setSubTab,
        scenes,
        characters,
        assets,
        generations,
        pipelineState,
        timelineState,
        refreshWorkspaceData,
        createScene,
        updateScene,
        deleteScene,
        selectSceneOption,
        replaceSceneVisual,
        createCharacter,
        updateCharacter,
        deleteCharacter,
        advancePipelineStage,
        updateTimelineTime,
        toggleTimelinePlayback,
      }}
    >
      {children}
    </ProjectWorkspaceContext.Provider>
  );
};

export const useProjectWorkspace = () => {
  const context = useContext(ProjectWorkspaceContext);
  if (!context) {
    throw new Error('useProjectWorkspace must be used within a ProjectWorkspaceProvider');
  }
  return context;
};
