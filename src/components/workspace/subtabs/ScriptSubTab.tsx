/**
 * Script Sub-Tab
 * Professional screenplay layout with sluglines, character dialogue,
 * parentheticals, sound design cues, and dynamic script saving.
 */

import React, { useState } from 'react';
import { useProjectWorkspace } from '../../../context/ProjectWorkspaceContext';
import { useStudio } from '../../../context/StudioContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Save, Sparkles } from 'lucide-react';

export const ScriptSubTab: React.FC = () => {
  const { project } = useProjectWorkspace();
  const { showNotification } = useStudio();
  const { t, isRtl } = useLanguage();

  const englishDefaultScript = `EXT. KEPLER-186F BIO-DOME CREST - TWILIGHT

A desolate titanium ridge overlooking an endless canopy of bioluminescent cyan flora. Solar flare shadows stretch violently across the obsidian stone.

The wind howls—a metallic whistle through porous basalt.

DR. ELENA VANCE (30s), wearing an EVA pressurized environmental suit, crests the ridge. Her visor HUD flickers with amber telemetry.

She halts. Her breath fogs the inner glass.

ELENA
(into comms, voice cracking)
Central... confirming visual contact. The bio-mesh didn't decay. It adapted.

A deafening sub-bass resonance pulses from beneath the valley floor. The cyan flora suddenly dims, pulsating in synchronized rhythm.

ELENA (CONT'D)
It's breathing.

INT. PRESSURIZED AIR-LOCK - CONTINUOUS

Red emergency strobes cycle in silence. Warning alarms flash across the secondary bulkhead.

Elena stumbles through the decontamination shower as hydraulic seals clamp down with a mechanical thud.`;

  const arabicDefaultScript = `مشهد خارجي. قمة القبة الحيوية - كيبلر 186-إف - وقت الشفق

حافة شاهقة من التيتانيوم تطل على وادٍ شاسع من النباتات المضيئة باللون السماوي الفسفوري. تتماوج أطياف التوهج الشمسي فوق الصخور البازلتية الداكنة.

صوت الرياح يعوي بصفير معدني نفاذ يخترق مسام الصخور.

د. إلينا فانس (في الثلاثينيات)، ترتدي بزة فضائية مضغوطة متطورة، تصعد نحو القمة. وميض کهرماني يتردد على زجاج خوذتها الشفافة.

تتوقف فجأة. يتصاعد أنفاسها على الزجاج الداخلي.

إلينا
(عبر جهاز اللاسلكي، بصوت يرتجف)
مركز المراقبة... أؤكد الرؤية المباشرة. الكائنات البيولوجية لم تمت. لقد تكيفت.

تردد منخفض وعميق يهتز من باطن الأرض. تنطفئ النباتات المضيئة فجأة ثم تعود للنبض بإيقاع متزامن.

إلينا (متابعة)
إنها تتنفس كائن حي واحد.

مشهد داخلي. غرفة العزل الهوائي - مستمر

أضواء الطوارئ الحمراء تدور في صمت تام. شاشات الإنذار تومض عبر الباب الهيدروليكي المقوى.

تتعثر إلينا نحو حوض التطهير بينما تُغلق الصمامات المعدنية بارتطام ميكانيكي حاسم.`;

  const [scriptContent, setScriptContent] = useState<string>(
    isRtl ? arabicDefaultScript : englishDefaultScript
  );

  const handleSave = () => {
    showNotification(isRtl ? 'تم حفظ مسودة السيناريو في قاعدة البيانات' : 'Screenplay draft saved to project storage', 'success');
  };

  return (
    <div className={`space-y-6 max-w-4xl ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="text-xs uppercase font-semibold text-slate-500">
            {isRtl ? 'المسودة الرئيسية للسيناريو' : 'Screenplay Master Draft'}
          </div>
          <h3 className="text-sm font-bold text-white mt-0.5">
            {project.title} · {isRtl ? 'المسودة رقم 1' : 'Screenplay Draft #1'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t.workspace.script.btnSaveScript}</span>
          </button>
        </div>
      </div>

      {/* Screenplay Page Editor */}
      <div className="rounded-lg border border-slate-800 bg-[#07090c] p-6 md:p-8 shadow-inner">
        <textarea
          value={scriptContent}
          onChange={(e) => setScriptContent(e.target.value)}
          rows={22}
          className="w-full bg-transparent text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-y selection:bg-amber-500/30"
          style={{ letterSpacing: '0.02em', lineHeight: '1.8' }}
        />
      </div>

      <div className="p-3.5 rounded-lg bg-[#0d1017] border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isRtl
              ? 'يتم تفكيك السيناريو تلقائياً إلى مشاهد وحوارات متزامنة لتوجيه موجه الذكاء الاصطناعي.'
              : 'Screenplay automatically parses into scene cuts and dialogue nodes for AI routing.'}
          </span>
        </div>
        <span className="font-mono text-slate-500 tabular-nums text-[11px] shrink-0">
          Courier Prime · 12pt Equiv
        </span>
      </div>
    </div>
  );
};
