/**
 * Scenes Sub-Tab
 * Sequenced scene cards showcasing the Three-Option Candidate Engine.
 * Allows instant side-by-side comparison, selection, and localized replacement
 * of rejected visual candidates without restarting the project.
 */

import React, { useState } from 'react';
import { useProjectWorkspace } from '../../../context/ProjectWorkspaceContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ThreeOptionSelector } from '../../common/ThreeOptionSelector';
import { Plus, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

export const ScenesSubTab: React.FC = () => {
  const { scenes, createScene, deleteScene, selectSceneOption, replaceSceneVisual, project } =
    useProjectWorkspace();
  const { t, isRtl } = useLanguage();

  const [expandedSceneId, setExpandedSceneId] = useState<string | null>(
    scenes[0]?.id || null
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSceneTitle, setNewSceneTitle] = useState('');
  const [newScenePrompt, setNewScenePrompt] = useState('');

  const handleAddScene = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSceneTitle.trim()) return;

    const sceneNum = scenes.length + 1;
    const basePrompt = newScenePrompt.trim() || (isRtl ? 'لقطة سينمائية واسعة في الشفق، بوكيه عدسة أنامورفية 35 مم.' : 'Cinematic wide shot in deep twilight, anamorphic 35mm bokeh.');

    await createScene({
      projectId: project.id,
      sequenceIndex: sceneNum,
      title: newSceneTitle.trim(),
      scriptText: basePrompt,
      durationSeconds: 15,
      characterIds: [],
      environment: 'Kepler bio-dome pressurized perimeter',
      mood: 'Tense, contemplative wonder',
      cameraMovement: 'Slow tracking dolly push',
      options: [
        {
          optionId: 'option-1',
          label: isRtl ? 'الخيار 1: لقطة تأسيسية واسعة أنامورفية' : 'Option 1: Wide Anamorphic Master',
          visualPrompt: `${basePrompt} Wide master establishing composition, high dynamic range.`,
          cameraAngle: 'Wide 24mm Anamorphic Lens',
          lighting: 'Golden hour rim lighting with deep shadows',
          status: 'ready',
          isCurrentSelection: true,
          previewUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        },
        {
          optionId: 'option-2',
          label: isRtl ? 'الخيار 2: لقطة تتبع حركية بزاوية منخفضة' : 'Option 2: Low-Angle Kinetic Tracking',
          visualPrompt: `${basePrompt} Low-angle dolly tracking shot with lens flare.`,
          cameraAngle: 'Low Angle 35mm Tracking',
          lighting: 'Chiaroscuro high contrast ambient',
          status: 'ready',
          isCurrentSelection: false,
          previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        },
        {
          optionId: 'option-3',
          label: isRtl ? 'الخيار 3: لقطة حميمية من فوق الكتف' : 'Option 3: Intimate Over-the-Shoulder',
          visualPrompt: `${basePrompt} Over-the-shoulder medium close-up, shallow depth of field.`,
          cameraAngle: '50mm Prime Portrait Lens',
          lighting: 'Diffused amber visor interior glow',
          status: 'ready',
          isCurrentSelection: false,
          previewUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        },
      ],
      activeOptionIndex: 0,
    });

    setIsAddModalOpen(false);
    setNewSceneTitle('');
    setNewScenePrompt('');
  };

  return (
    <div className={`space-y-6 max-w-5xl ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs uppercase font-semibold text-slate-500">
            {isRtl ? 'تسلسل اللقطات والمشاهد' : 'Shot & Scene Sequencing'}
          </div>
          <h3 className="text-sm font-bold text-white mt-0.5">
            {t.workspace.scenes.title} ({scenes.length} {isRtl ? 'مشاهد' : 'Scenes'} · {t.workspace.scenes.threeOptionDescription})
          </h3>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.workspace.scenes.btnAddScene}</span>
        </button>
      </div>

      {/* Sequenced Scenes */}
      <div className="space-y-4">
        {scenes.map((scene) => {
          const isExpanded = expandedSceneId === scene.id;
          const activeOpt = scene.options[scene.activeOptionIndex] || scene.options[0];

          return (
            <div
              key={scene.id}
              className="rounded-lg border border-slate-800 bg-[#0d1017] overflow-hidden transition-all"
            >
              {/* Scene Summary Bar */}
              <div
                onClick={() => setExpandedSceneId(isExpanded ? null : scene.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/40 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-amber-400 shrink-0">
                    {scene.sequenceIndex}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{scene.title}</h4>
                      <StatusBadge status={activeOpt?.status || 'ready'} />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-xl">
                      {scene.scriptText}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{scene.durationSeconds}s</span>
                  </div>

                  <span className="text-amber-400 text-xs font-medium hidden sm:inline">
                    {isRtl ? 'الخيار' : 'Option'} {scene.activeOptionIndex + 1}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(t.common.confirmDelete)) {
                        deleteScene(scene.id);
                      }
                    }}
                    title={t.common.delete}
                    className="p-1 text-slate-600 hover:text-rose-400 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded 3-Option System Container */}
              {isExpanded && (
                <div className="p-4 border-t border-slate-800/80 bg-[#090b0e]">
                  <ThreeOptionSelector
                    sceneTitle={scene.title}
                    options={scene.options}
                    activeOptionIndex={scene.activeOptionIndex}
                    onSelectOption={(optIndex) => selectSceneOption(scene.id, optIndex)}
                    onReplaceOption={(optIndex, newPrompt) =>
                      replaceSceneVisual(scene.id, optIndex, newPrompt)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Scene Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-md rounded-xl bg-[#0e121a] border border-slate-800 p-6 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h3 className="text-sm font-bold text-white font-display">
              {isRtl ? 'إضافة مشهد جديد' : 'Add Scene Node'}
            </h3>
            <form onSubmit={handleAddScene} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  {isRtl ? 'عنوان المشهد' : 'Scene Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newSceneTitle}
                  onChange={(e) => setNewSceneTitle(e.target.value)}
                  placeholder={isRtl ? 'مثال: مشهد 3: الغرفة البلورية الباطنية' : 'e.g. Scene 3: Subterranean Crystalline Chamber'}
                  className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  {isRtl ? 'التوجيه البصري للمشهد' : 'Scene Visual Direction'}
                </label>
                <textarea
                  rows={3}
                  value={newScenePrompt}
                  onChange={(e) => setNewScenePrompt(e.target.value)}
                  placeholder={isRtl ? 'صف الحركة، زاوية الكاميرا، والإضاءة المطلوبة...' : 'Describe the action, camera movement, and lighting...'}
                  className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded cursor-pointer"
                >
                  {isRtl ? 'توليد 3 خيارات' : 'Generate 3 Options'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
