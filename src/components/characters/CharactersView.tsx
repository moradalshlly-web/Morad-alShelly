/**
 * Characters View
 * Dedicated management for persistent characters with seed locking,
 * facial geometry references, voice assignments, and wardrobe continuity.
 * Uses generic architectural provider slots with bilingual RTL/LTR support.
 */

import React, { useEffect, useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Character, CharacterVoiceProfile } from '../../types/database';
import { db } from '../../services/database';
import { Users, Plus, Mic, ShieldCheck, Trash2, Edit3, X } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export const CharactersView: React.FC = () => {
  const { activeProjectId, showNotification } = useStudio();
  const { t, isRtl } = useLanguage();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState<'protagonist' | 'antagonist' | 'supporting' | 'narrator' | 'cameo'>('protagonist');
  const [description, setDescription] = useState('');
  const [voiceProvider, setVoiceProvider] = useState('voice_provider_a');
  const [voiceId, setVoiceId] = useState('voice_timbre_01');
  const [distinguishingMarks, setDistinguishingMarks] = useState('');

  const loadCharacters = async () => {
    const list = await db.getCharacters(activeProjectId || undefined);
    setCharacters(list);
  };

  useEffect(() => {
    loadCharacters();
  }, [activeProjectId]);

  const handleOpenAdd = () => {
    setName('');
    setRole('protagonist');
    setDescription(isRtl ? 'مهندس استكشاف في منتصف الثلاثينيات، عيون كهرمانية حادة، بزة مضغوطة من التيتانيوم.' : 'Mid-30s bio-engineer, focused amber eyes, pressurized titanium EVA collar.');
    setVoiceProvider('voice_provider_a');
    setVoiceId('voice_timbre_01');
    setDistinguishingMarks(isRtl ? 'ندبة على عظم الوجنة، وسوار بيومتري تكتيكي' : 'Obsidian scar on cheekbone, tactical biometric wrist display');
    setEditingCharacter(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Character) => {
    setName(c.name);
    setRole(c.role);
    setDescription(c.description);
    setVoiceProvider(c.voiceProfile?.providerId || 'voice_provider_a');
    setVoiceId(c.voiceProfile?.voiceId || 'voice_timbre_01');
    setDistinguishingMarks(c.visualTraits.distinguishingMarks || '');
    setEditingCharacter(c);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const voiceProfile: CharacterVoiceProfile = {
      providerId: voiceProvider,
      modelId: 'voice-multilingual-adapter',
      voiceId,
      pitch: 1.0,
      speed: 1.0,
      stability: 0.85,
    };

    if (editingCharacter) {
      await db.updateCharacter(editingCharacter.id, {
        name,
        role,
        description,
        visualTraits: {
          ...editingCharacter.visualTraits,
          distinguishingMarks,
        },
        voiceProfile,
      });
      showNotification(isRtl ? `تم تحديث بيانات الشخصية "${name}"` : `Character "${name}" updated`, 'success');
    } else {
      await db.createCharacter({
        projectId: activeProjectId || 'proj_kepler_01',
        userId: 'usr_moro_director',
        name,
        role,
        description,
        personality: isRtl ? 'شخصية حازمة ودقيقة' : 'Determined, meticulous, haunted by past expeditions',
        style: 'Cinematic realism',
        consistencySeed: Math.floor(Math.random() * 9000000) + 1000000,
        visualTraits: {
          age: '34',
          distinguishingMarks,
        },
        referenceImages: [
          {
            id: `ref_${Date.now()}`,
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
            label: 'Front close-up (Master keyframe)',
            isPrimary: true,
          },
        ],
        voiceProfile,
      });
      showNotification(isRtl ? `تم تثبيت بذور الشخصية "${name}"` : `Character "${name}" locked for continuity`, 'success');
    }

    setIsModalOpen(false);
    await loadCharacters();
  };

  const handleDelete = async (id: string, charName: string) => {
    if (confirm(isRtl ? `حذف الشخصية "${charName}"؟` : `Remove character "${charName}" from continuity roster?`)) {
      await db.deleteCharacter(id);
      await loadCharacters();
      showNotification(isRtl ? 'تم حذف الشخصية' : 'Character removed', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">{t.characters.title}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.characters.subtitle}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.characters.btnNewCharacter}</span>
        </button>
      </div>

      {/* Character Cards */}
      {characters.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t.characters.noCharactersTitle}
          description={t.characters.noCharactersDesc}
          actionLabel={t.characters.btnNewCharacter}
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {characters.map((char) => (
            <div
              key={char.id}
              className={`rounded-lg border border-slate-800 bg-[#0d1017] p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm ${isRtl ? 'text-right' : 'text-left'}`}
            >
              <div className="space-y-3">
                {/* Character portrait + basic info */}
                <div className="flex items-start gap-3.5">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                    {char.referenceImages && char.referenceImages[0] ? (
                      <img
                        src={char.referenceImages[0].url}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Users className="w-6 h-6" />
                      </div>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-center text-amber-300 py-0.5">
                      SEED #{char.consistencySeed || '4892'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white truncate">{char.name}</h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(char)}
                          className="p-1 text-slate-500 hover:text-slate-300 rounded cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(char.id, char.name)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-amber-400/90 font-medium capitalize">{char.role}</div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t.characters.seedLocked}</span>
                    </div>
                  </div>
                </div>

                {/* Visual description */}
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {char.description}
                </p>

                {/* Distinctive traits */}
                {char.visualTraits.distinguishingMarks && (
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-semibold text-slate-500">
                      {isRtl ? 'سمات الاستمرارية البصرية' : 'Continuity Traits'}
                    </span>
                    <div className="text-[11px] text-slate-300 leading-tight">
                      {char.visualTraits.distinguishingMarks}
                    </div>
                  </div>
                )}

                {/* Voice assignment (Generic Architecture) */}
                {char.voiceProfile && (
                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="w-3.5 h-3.5 text-amber-400" />
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">
                          {t.characters.assignedVoice}
                        </div>
                        <div className="text-[11px] text-slate-200 font-medium font-mono">
                          {char.voiceProfile.voiceId}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                      {char.voiceProfile.providerId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-lg rounded-xl bg-[#0e121a] border border-slate-800 p-6 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-display">
                {editingCharacter
                  ? (isRtl ? 'تعديل بيانات الشخصية' : 'Edit Character')
                  : (isRtl ? 'تسجيل وتثبيت بذور شخصية جديدة' : 'Register Consistent Character')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  {isRtl ? 'اسم الشخصية' : 'Character Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isRtl ? 'مثال: القائد ماركوس' : 'e.g. Commander Marcus Vance'}
                  className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  {isRtl ? 'الدور الدرامي' : 'Dramatic Role'}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="protagonist">{isRtl ? 'بطل رئيسي (Protagonist)' : 'Protagonist'}</option>
                  <option value="antagonist">{isRtl ? 'خصم رئيسي (Antagonist)' : 'Antagonist'}</option>
                  <option value="supporting">{isRtl ? 'شخصية مساندة (Supporting)' : 'Supporting Character'}</option>
                  <option value="narrator">{isRtl ? 'راوٍ صوتي (Narrator)' : 'Narrator'}</option>
                  <option value="cameo">{isRtl ? 'ظهور خاص (Cameo)' : 'Cameo'}</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  {isRtl ? 'الوصف البصري وبذرة الملامح' : 'Visual Prompt Seed / Description'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isRtl ? 'العمر، تكوين الوجه، لون البشرة والعيون، وتفاصيل الزي...' : 'Age, facial structure, skin tone, eye color, uniform or clothing details...'}
                  className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">
                    {isRtl ? 'مزود الصوت المعماري' : 'Voice Provider Slot'}
                  </label>
                  <select
                    value={voiceProvider}
                    onChange={(e) => setVoiceProvider(e.target.value)}
                    className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="voice_provider_a">Voice Provider A (Slot)</option>
                    <option value="voice_provider_b">Voice Provider B (Slot)</option>
                    <option value="dubbing_provider_a">Dubbing Provider A (Slot)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">
                    {isRtl ? 'معرف الصوت / النبرة' : 'Voice Timbre ID'}
                  </label>
                  <input
                    type="text"
                    value={voiceId}
                    onChange={(e) => setVoiceId(e.target.value)}
                    className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  {isRtl ? 'علامات مميزة وزي دائم' : 'Distinctive Marks / Wardrobe'}
                </label>
                <input
                  type="text"
                  value={distinguishingMarks}
                  onChange={(e) => setDistinguishingMarks(e.target.value)}
                  placeholder={isRtl ? 'ندبة وجه، عدسة بصرية، سوار خاص' : 'Facial scar, cybernetic eyepiece, stained cuffs'}
                  className="w-full bg-[#090b0e] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded cursor-pointer"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
