/**
 * Suggest-For-Me Wizard
 * Interactive architectural questionnaire providing 3 comprehensive concept suggestions
 * based on Style, Content Type, Character References, and Duration with bilingual RTL/LTR support.
 */

import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  SuggestAnswers,
  SuggestionContentType,
  SuggestionDuration,
  SuggestionStyle,
  SuggestForMeBundle,
} from '../../types/suggest';
import { SuggestEngine } from '../../services/suggest/SuggestEngine';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Film,
  UserCheck,
} from 'lucide-react';

export const SuggestForMeWizard: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { createProject, openProjectWorkspace, user } = useStudio();
  const { t, isRtl } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [bundleResult, setBundleResult] = useState<SuggestForMeBundle | null>(null);

  const ArrowNext = isRtl ? ArrowLeft : ArrowRight;
  const ArrowBack = isRtl ? ArrowRight : ArrowLeft;

  // Form answers state
  const [answers, setAnswers] = useState<SuggestAnswers>({
    style: 'cinematic',
    contentType: 'story',
    characterReferenceUrls: [],
    duration: 'medium',
    freeformIdea: '',
  });

  const handleStyleChange = (style: SuggestionStyle) => {
    setAnswers((prev) => ({ ...prev, style }));
  };

  const handleContentTypeChange = (contentType: SuggestionContentType) => {
    setAnswers((prev) => ({ ...prev, contentType }));
  };

  const handleDurationChange = (duration: SuggestionDuration) => {
    setAnswers((prev) => ({ ...prev, duration }));
  };

  const handleMockUploadCharacter = () => {
    setAnswers((prev) => ({
      ...prev,
      characterReferenceUrls: [
        ...prev.characterReferenceUrls,
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      ],
    }));
  };

  const handleRunSuggestions = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 700));
    const result = SuggestEngine.generateThreeConcepts(answers);
    setBundleResult(result);
    setIsGenerating(false);
    setStep(5);
  };

  const handleAdoptSuggestion = async (optionIndex: number) => {
    if (!bundleResult) return;
    const chosen = bundleResult.suggestions[optionIndex];

    const newProject = await createProject({
      userId: user?.id || 'usr_moro_director',
      title: chosen.title,
      description: chosen.logline,
      genre: answers.contentType,
      style: answers.style === 'other' ? 'cinematic' : answers.style,
      aspectRatio: '16:9',
      targetDurationSeconds:
        answers.duration === 'short'
          ? 60
          : answers.duration === 'medium'
          ? 180
          : 360,
      status: 'storyboarding',
      tags: [answers.style, answers.contentType, 'AI Suggested', `Option ${optionIndex + 1}`],
      totalScenes: chosen.estimatedSceneCount,
    });

    if (onComplete) onComplete();
    openProjectWorkspace(newProject.id);
  };

  return (
    <div className={`rounded-xl border border-slate-800 bg-[#0c0f15] p-6 md:p-8 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Step Indicator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'محرّك "اقترح لي" الإبداعي الذكي' : 'Suggest-For-Me Creative Engine'}</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 font-display">
            {step === 5
              ? (isRtl ? 'مقترحات المفاهيم الإبداعية الثلاثة' : 'Three Creative Concept Proposals')
              : (isRtl ? `الخطوة ${step} من 4 · استبيان التفضيلات` : `Step ${step} of 4 · Questionnaire`)}
          </h2>
        </div>

        {step < 5 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-6 h-1 rounded-full transition-colors ${
                  step >= s ? 'bg-amber-400' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* QUESTION 1: STYLE */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {isRtl ? '1. ما هو الأسلوب الفني الذي تريده للمشروع؟' : '1. What style should this project embrace?'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRtl ? 'حدد الطابع البصري الحاكم للإضاءة، حركة الكاميرا، ودرجة الواقعية.' : 'Select the governing visual aesthetic for cinematography, textures, and lighting.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { id: 'cinematic', label: isRtl ? 'سينمائي' : 'Cinematic', desc: isRtl ? 'عدسات سينمائية، عمق بصري وإضاءة درامية' : 'ARRI Alexa, 35mm lens, atmospheric depth' },
              { id: 'anime', label: isRtl ? 'أنمي' : 'Anime', desc: isRtl ? 'ألوان حيوية وخطوط فنية يابانية' : 'Makoto Shinkai hues, hand-drawn ink lines' },
              { id: 'cartoon', label: isRtl ? 'كرتون' : 'Cartoon', desc: isRtl ? 'رسوم متحركة 2D خفيفة ومرحة' : 'Stylized 2D animation, vibrant shapes' },
              { id: 'realistic', label: isRtl ? 'واقعي وثائقي' : 'Realistic', desc: isRtl ? 'إضاءة طبيعية وتصوير واقعي محايد' : 'Natural documentary, neutral lighting' },
              { id: 'other', label: isRtl ? 'طراز مخصص' : 'Other / Custom', desc: isRtl ? 'طراز تجريبي، أو مزيج فني خاص' : 'Experimental avant-garde or mixed media' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleStyleChange(st.id as SuggestionStyle)}
                className={`p-4 rounded-lg border ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  answers.style === st.id
                    ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white">{st.label}</span>
                  {answers.style === st.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <span className="text-[11px] text-slate-400 leading-tight">{st.desc}</span>
              </button>
            ))}
          </div>

          {answers.style === 'other' && (
            <div className="pt-2">
              <input
                type="text"
                value={answers.customStyle || ''}
                onChange={(e) => setAnswers({ ...answers, customStyle: e.target.value })}
                placeholder={isRtl ? 'صف الطراز الخاص (مثال: نوار قوطي طيني)...' : 'Describe your custom style (e.g. Claymation Gothic Noir)...'}
                className="w-full bg-[#090b0e] border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isRtl ? 'التالي: نوع المحتوى' : 'Next: Content Type'}</span>
              <ArrowNext className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* QUESTION 2: CONTENT TYPE */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {isRtl ? '2. ما هو نوع المحتوى الذي تود إنتاجه؟' : '2. What type of content are you creating?'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRtl ? 'يحدد إيقاع السرد الدرامي، تقطيع المشاهد، وبنية الحوار.' : 'Determines dramaturgical pacing, narrative arc, and shot cadence.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 'story', label: isRtl ? 'قصة وسرد درامي' : 'Story & Narrative', desc: isRtl ? 'حبكة درامية متكاملة من 3 فصول' : 'Character-driven three-act plot' },
              { id: 'educational', label: isRtl ? 'تعليمي وإرشادي' : 'Educational', desc: isRtl ? 'شرح تسلسلي للمفاهيم والمعارف' : 'Structured conceptual breakdown' },
              { id: 'informational', label: isRtl ? 'معلوماتي وإخباري' : 'Informational', desc: isRtl ? 'فيديو توضيحي ملخص ودقيق' : 'Concise documentary or explainer' },
              { id: 'action', label: isRtl ? 'أكشن وإثارة' : 'Action & Kinetic', desc: isRtl ? 'إيقاع سريع وتأثيرات بصرية قوية' : 'High-speed pacing and visual impacts' },
              { id: 'comedy', label: isRtl ? 'كوميدي وساخر' : 'Comedy & Satire', desc: isRtl ? 'توقيت فكاهي وحوارات ممتعة' : 'Timing-focused character banter' },
              { id: 'other', label: isRtl ? 'صيغة أخرى' : 'Other Format', desc: isRtl ? 'فيديو موسيقي، إعلان، أو تجربة فنية' : 'Music video, teaser, or art piece' },
            ].map((ct) => (
              <button
                key={ct.id}
                type="button"
                onClick={() => handleContentTypeChange(ct.id as SuggestionContentType)}
                className={`p-4 rounded-lg border ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  answers.contentType === ct.id
                    ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white">{ct.label}</span>
                  {answers.contentType === ct.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <span className="text-[11px] text-slate-400 leading-tight">{ct.desc}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <ArrowBack className="w-3.5 h-3.5" />
              <span>{t.common.back}</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isRtl ? 'التالي: صورة مرجعية للشخصية' : 'Next: Character Reference'}</span>
              <ArrowNext className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* QUESTION 3: CHARACTER REFERENCE */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {isRtl ? '3. هل توجد صورة مرجعية للشخصية الرئيسية؟' : '3. Character reference?'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRtl ? 'أرفق صورة لتثبيت ملامح الوجه، أو دع منصة مورو تؤسس شخصيات متسقة بذورياً.' : 'Upload reference imagery to lock facial geometry, or proceed with AI character generation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Box */}
            <div className="p-5 rounded-lg border-2 border-dashed border-slate-800 bg-slate-950/50 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400">
                <Upload className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  {isRtl ? 'رفع صورة مرجعية للوجه' : 'Upload Reference Portrait'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">JPG, PNG (max 10MB)</div>
              </div>
              <button
                type="button"
                onClick={handleMockUploadCharacter}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer transition-colors"
              >
                {isRtl ? 'إرفاق صورة تجريبية' : 'Simulate Image Upload'}
              </button>
            </div>

            {/* Status */}
            <div className="p-5 rounded-lg border border-slate-800 bg-[#090b0e] space-y-3">
              <div className="text-xs font-semibold text-slate-300">
                {isRtl ? 'المراجع المرفقة للشخصيات' : 'Attached Character References'}
              </div>
              {answers.characterReferenceUrls.length === 0 ? (
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isRtl
                    ? 'لم يتم إرفاق صورة شخصية. ستقوم المنصة بتوليد شخصية متسقة بذورياً في كافة اللقطات تلقائياً.'
                    : 'No reference portrait attached. Moro AI will generate archetypal protagonists with consistent seed anchors automatically.'}
                </p>
              ) : (
                <div className="flex items-center gap-3">
                  {answers.characterReferenceUrls.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden border border-amber-500/50">
                      <img src={url} alt="Reference" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-center text-amber-300 py-0.5 font-mono">
                        Ref {i + 1}
                      </span>
                    </div>
                  ))}
                  <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <UserCheck className="w-4 h-4" />
                    <span>{isRtl ? 'تثبيت البذور مفعل' : 'Seed consistency enabled'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <ArrowBack className="w-3.5 h-3.5" />
              <span>{t.common.back}</span>
            </button>

            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isRtl ? 'التالي: المدة والفكرة' : 'Next: Duration & Ideation'}</span>
              <ArrowNext className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* QUESTION 4: DURATION */}
      {step === 4 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {isRtl ? '4. ما هي المدة الزمنية المستهدفة؟' : '4. Target Duration?'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRtl ? 'تحدد عدد المشاهد الموصى بها وتقسيم الخط الزمني.' : 'Determines timeline granularity and recommended scene count.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'short', label: isRtl ? 'قصير' : 'Short', time: isRtl ? '~60 ثانية (2–3 مشاهد)' : '~60 seconds (2–3 scenes)' },
              { id: 'medium', label: isRtl ? 'متوسط' : 'Medium', time: isRtl ? '~3 دقائق (4–6 مشاهد)' : '~3 minutes (4–6 scenes)' },
              { id: 'long', label: isRtl ? 'طويل' : 'Long', time: isRtl ? '~6 دقائق (8–12 مشهداً)' : '~6 minutes (8–12 scenes)' },
              { id: 'custom', label: isRtl ? 'مخصص' : 'Custom', time: isRtl ? 'تحديد دقيق بالثواني' : 'Specify exact seconds' },
            ].map((dur) => (
              <button
                key={dur.id}
                type="button"
                onClick={() => handleDurationChange(dur.id as SuggestionDuration)}
                className={`p-4 rounded-lg border ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  answers.duration === dur.id
                    ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white">{dur.label}</span>
                  {answers.duration === dur.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <span className="text-[11px] text-slate-400">{dur.time}</span>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="text-xs text-slate-400 block mb-1">
              {isRtl ? 'فكرة حرة أو إلهام أولي (اختياري - جملة واحدة):' : 'Optional Freeform Idea / Spark (One Sentence)'}
            </label>
            <input
              type="text"
              value={answers.freeformIdea || ''}
              onChange={(e) => setAnswers({ ...answers, freeformIdea: e.target.value })}
              placeholder={isRtl ? 'مثال: عالم آثار يكتشف ساعة عتيقة تحت قبّة بيولوجية مهجورة...' : 'e.g. A biologist finds a submerged clock in a dead bio-dome...'}
              className="w-full bg-[#090b0e] border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <ArrowBack className="w-3.5 h-3.5" />
              <span>{t.common.back}</span>
            </button>

            <button
              onClick={handleRunSuggestions}
              disabled={isGenerating}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isGenerating
                  ? (isRtl ? 'جارٍ توليد 3 مفاهيم إبداعية...' : 'Synthesizing 3 Concepts...')
                  : (isRtl ? 'توليد 3 مقترحات مخصصة' : 'Generate 3 Suggestions')}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: 3 RICH SUGGESTIONS DISPLAY */}
      {step === 5 && bundleResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-amber-200 flex items-center justify-between">
            <span>
              {isRtl
                ? `ابتكرت منصة مورو 3 مفاهيم متكاملة لطراز (${answers.style}) ونوع المحتوى (${answers.contentType}).`
                : `Moro AI generated 3 distinct concepts based on your ${answers.style} style and ${answers.contentType} request.`}
            </span>
            <button
              onClick={() => setStep(1)}
              className="text-xs underline text-amber-300 hover:text-amber-100 cursor-pointer ml-3 shrink-0"
            >
              {isRtl ? 'تعديل الإجابات' : 'Adjust Answers'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {bundleResult.suggestions.map((suggestion, idx) => (
              <div
                key={suggestion.id}
                className="rounded-lg border border-slate-800 bg-[#0e121a] p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {isRtl ? `الخيار ${idx + 1}` : `Option ${idx + 1}`}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                      {suggestion.estimatedSceneCount} {isRtl ? 'مشاهد' : 'Scenes'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white font-display">
                      {suggestion.title}
                    </h4>
                    <p className="text-xs text-amber-300/80 italic mt-0.5">
                      "{suggestion.tagline}"
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {suggestion.logline}
                  </p>

                  {/* Character Concept */}
                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
                    <div className="text-[10px] uppercase font-semibold text-slate-500">
                      {isRtl ? 'نمط بطل القصة' : 'Protagonist Archetype'}
                    </div>
                    <div className="font-semibold text-slate-200">
                      {suggestion.characterConcept.name} · {suggestion.characterConcept.archetype}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {suggestion.characterConcept.distinctiveTrait}
                    </div>
                  </div>

                  {/* Visual Direction */}
                  <div className="space-y-1 text-xs">
                    <div className="text-[10px] uppercase font-semibold text-slate-500">
                      {isRtl ? 'الرؤية البصرية والإضاءة' : 'Visual Direction & Lighting'}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      {suggestion.visualDirection.lightingMood}
                    </div>
                  </div>

                  {/* Sample Scenes Preview */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] uppercase font-semibold text-slate-500">
                      {isRtl ? 'نموذج من المشاهد المقترحة' : 'Scene Breakdown Sample'}
                    </div>
                    {suggestion.sampleScenes.slice(0, 2).map((sc) => (
                      <div key={sc.sceneIndex} className={`text-[11px] text-slate-400 ${isRtl ? 'pr-2 border-r' : 'pl-2 border-l'} border-slate-800`}>
                        <span className="text-slate-300 font-medium">Sc {sc.sceneIndex}:</span> {sc.description}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleAdoptSuggestion(idx)}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>
                      {isRtl ? `اعتماد الخيار ${idx + 1} وفتح الاستوديو` : `Adopt Option ${idx + 1} & Launch Studio`}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
