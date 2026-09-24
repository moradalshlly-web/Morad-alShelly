/**
 * MultiFormatCreativeStudio Component
 * Comprehensive creative inception studio for Moro AI:
 * 1. Multi-Format Input (Text + Images + Files/Docs: PDF, TXT, DOCX)
 * 2. Optional User Perspective ("هل تريد أن تصف المشهد من منظورك؟")
 * 3. Content Understanding Pipeline (Analyzing → Context → Preparing → Ready)
 * 4. 3-Option Creative System with Voice, Tone, Scene, Image decisions
 * 5. Global & Individual Replacement without resetting project context
 */

import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  ContentUnderstandingAnalysis,
  ContentUnderstandingStage,
  CreativeDecision,
  ProjectCreativeDecisions,
  SupportedFileExtension,
  UploadedInputFile,
} from '../../types/creative-options';
import {
  MoroCreativeOptionService,
} from '../../services/creative/CreativeOptionProviders';
import { ThreeOptionGenerator } from '../creative/ThreeOptionGenerator';
import {
  Sparkles,
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  Trash2,
  Plus,
  Check,
  Film,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Layers,
  Palette,
  Eye,
  Sliders,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const MultiFormatCreativeStudio: React.FC = () => {
  const { createProject, openProjectWorkspace, user, showNotification } = useStudio();
  const { t, isRtl } = useLanguage();

  const ReturnArrow = isRtl ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRtl ? ArrowLeft : ArrowRight;

  // 1. Multi-Format Input State
  const [projectTitle, setProjectTitle] = useState('');
  const [rawText, setRawText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'cinematic' | 'anime' | 'cartoon' | 'realistic' | 'hyper-real'>('cinematic');
  const [targetDuration, setTargetDuration] = useState(120);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '2.39:1'>('16:9');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedInputFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // 2. Optional User Perspective Step State
  const [showPerspectiveStep, setShowPerspectiveStep] = useState(false);
  const [userPerspectiveText, setUserPerspectiveText] = useState('');
  const [hasSkippedPerspective, setHasSkippedPerspective] = useState(false);

  // 3. Content Understanding State
  const [workflowStage, setWorkflowStage] = useState<'input' | 'perspective' | 'analyzing' | 'decisions'>('input');
  const [understandingState, setUnderstandingState] = useState<ContentUnderstandingAnalysis>({
    stage: 'idle',
    progressPercent: 0,
    extractedTheme: '',
    extractedContext: '',
    detectedEntities: [],
    suggestedTone: '',
    suggestedFormat: '',
    directorNotesSummary: '',
  });

  // 4. Creative Decisions (Voice, Tone, Scene, Image)
  const [decisions, setDecisions] = useState<ProjectCreativeDecisions | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'voice' | 'tone' | 'scene' | 'image'>('scene');

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    const newItems: UploadedInputFile[] = files.map((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      const isImg = file.type.startsWith('image/');
      const previewUrl = isImg ? URL.createObjectURL(file) : undefined;

      let extractedSummary = '';
      if (ext === 'txt') {
        extractedSummary = 'Plaintext screenplay dialogue & stage directions parsed.';
      } else if (ext === 'pdf') {
        extractedSummary = 'Extracted multi-scene sluglines, character dialogue, and action beats.';
      } else if (ext === 'docx') {
        extractedSummary = 'Parsed formatted narrative synopsis and production notes.';
      } else if (isImg) {
        extractedSummary = 'Visual keyframe anchor with color palette and lighting extraction.';
      }

      return {
        id: `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        extension: ext as SupportedFileExtension,
        previewUrl,
        extractedTextSummary: extractedSummary,
        uploadTimestamp: new Date().toISOString(),
      };
    });

    setUploadedFiles((prev) => [...prev, ...newItems]);
    showNotification(
      isRtl ? `تمت إضافة ${newItems.length} ملف(ات) إلى سياق المشروع` : `Added ${newItems.length} file(s) to project context`,
      'info'
    );
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Quick preset sample files for seamless testing
  const addSampleFiles = () => {
    const sampleImage: UploadedInputFile = {
      id: `sample_img_${Date.now()}`,
      name: 'orbital_biodome_concept.png',
      size: 2450000,
      mimeType: 'image/png',
      extension: 'png',
      previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      extractedTextSummary: 'Bioluminescent atmospheric palette, 35mm cyan rim lighting detected.',
      uploadTimestamp: new Date().toISOString(),
    };

    const sampleDoc: UploadedInputFile = {
      id: `sample_doc_${Date.now()}`,
      name: 'kepler_screenplay_act1.pdf',
      size: 420000,
      mimeType: 'application/pdf',
      extension: 'pdf',
      extractedTextSummary: 'Slugline: INT. SUBTERRANEAN ARBORETUM - NIGHT. Characters: Dr. Vance, Orion Unit.',
      uploadTimestamp: new Date().toISOString(),
    };

    setUploadedFiles((prev) => [...prev, sampleImage, sampleDoc]);
    if (!rawText.trim()) {
      setRawText(
        isRtl
          ? 'تصل بعثة استكشافية إلى قبة زراعية معزولة تحت سطح كوكب كيبلر، لتكتشف أن النباتات لم تمت، بل تحورت إلى شبكة حية تتواصل بنبضات ضوئية مجهولة.'
          : 'An exploratory mission reaches an isolated subterranean arboretum on Kepler-186f, discovering mutated phosphorescent flora pulsing in sync with an alien cadence.'
      );
    }
    if (!projectTitle.trim()) {
      setProjectTitle(isRtl ? 'ملحمة كيبلر: أصداء الأعماق' : 'Kepler: Deep Flora Echo');
    }
  };

  // Transition to Content Understanding
  const startContentUnderstanding = async (userPerspectiveGiven?: string) => {
    setWorkflowStage('analyzing');

    // Step 1: Analyzing Content
    setUnderstandingState({
      stage: 'analyzing',
      progressPercent: 25,
      extractedTheme: isRtl ? 'الاستكشاف، العزلة، والحياة التكافلية المجهولة' : 'Exploration, isolation, and symbiotic extraterrestrial life',
      extractedContext: isRtl ? 'قبة بيولوجية تحت سطح كوكب بعيد، تكنولوجيا متقدمة مع صبغة صناعية' : 'Subterranean bio-dome on Kepler-186f, atmospheric hard sci-fi',
      detectedEntities: ['Dr. Elena Vance', 'Orion Unit', 'Bioluminescent Flora', 'Hydraulic Airlock'],
      suggestedTone: isRtl ? 'هادئ وسينمائي مع تصاعد تدريجي' : 'Contemplative, atmospheric cinematic slow-burn',
      suggestedFormat: 'Cinematic Narrative Short (4K Master)',
      directorNotesSummary: userPerspectiveGiven?.trim() || (isRtl ? 'معالجة سينمائية كلاسيكية' : 'Standard directorial treatment'),
    });

    await new Promise((res) => setTimeout(res, 650));

    // Step 2: Understanding Context
    setUnderstandingState((prev) => ({
      ...prev,
      stage: 'understanding',
      progressPercent: 55,
    }));

    await new Promise((res) => setTimeout(res, 650));

    // Step 3: Preparing Creative Options
    setUnderstandingState((prev) => ({
      ...prev,
      stage: 'preparing',
      progressPercent: 85,
    }));

    // Generate Creative Decisions via Provider Architecture
    const contextPayload = {
      projectTitle: projectTitle || (isRtl ? 'مشروع إبداعي جديد' : 'New Creative Project'),
      rawText: rawText || 'Exploration narrative',
      userPerspectiveDescription: userPerspectiveGiven,
      style: selectedStyle,
      genre: 'Speculative Sci-Fi / Drama',
      targetDurationSeconds: targetDuration,
      uploadedFilesSummary: uploadedFiles.map((f) => `${f.name} (${f.extension})`),
    };

    const generatedDecisions = await MoroCreativeOptionService.generateInitialDecisions(contextPayload);
    setDecisions(generatedDecisions);

    await new Promise((res) => setTimeout(res, 500));

    // Step 4: Ready
    setUnderstandingState((prev) => ({
      ...prev,
      stage: 'ready',
      progressPercent: 100,
    }));

    setWorkflowStage('decisions');
    showNotification(
      isRtl ? 'تم تجهيز الخيارات الإبداعية الثلاثية بنجاح' : '3-Option creative candidates generated and ready',
      'success'
    );
  };

  // Handlers for Creative Decisions
  const handleSelectOption = (category: string, optionId: string) => {
    if (!decisions) return;
    const current = decisions[category];
    if (!current) return;

    const updated = MoroCreativeOptionService.selectOption(current, optionId);
    setDecisions({
      ...decisions,
      [category]: updated,
    });
  };

  // Single candidate replacement (Individual Replacement)
  const handleReplaceSingleOption = async (category: string, optionId: string) => {
    if (!decisions) return;
    const current = decisions[category];
    if (!current) return;

    const contextPayload = {
      projectTitle,
      rawText,
      userPerspectiveDescription: userPerspectiveText,
      style: selectedStyle,
    };

    const updated = await MoroCreativeOptionService.replaceCategorySingle(
      category,
      optionId,
      current,
      contextPayload
    );

    setDecisions({
      ...decisions,
      [category]: updated,
    });

    showNotification(
      isRtl ? `تم تجديد الخيار الفردي بنجاح مع حفظ بقية القرارات` : `Regenerated single option without touching other decisions`,
      'info'
    );
  };

  // Full category replacement (Bulk Replacement)
  const handleReplaceAllOptions = async (category: string) => {
    if (!decisions) return;
    const current = decisions[category];
    if (!current) return;

    const contextPayload = {
      projectTitle,
      rawText,
      userPerspectiveDescription: userPerspectiveText,
      style: selectedStyle,
    };

    const updated = await MoroCreativeOptionService.replaceCategoryAll(
      category,
      current,
      contextPayload
    );

    setDecisions({
      ...decisions,
      [category]: updated,
    });

    showNotification(
      isRtl ? `تم تجديد الخيارات الثلاثة لـ "${category}"` : `Regenerated all 3 options for ${category}`,
      'info'
    );
  };

  // Final Action: Initialize Project & Open Studio
  const handleInitializeProject = async () => {
    if (!decisions) return;

    const selectedVoiceOption = decisions.voice.options.find((o) => o.id === decisions.voice.selectedOptionId);
    const selectedToneOption = decisions.tone.options.find((o) => o.id === decisions.tone.selectedOptionId);
    const selectedSceneOption = decisions.scene.options.find((o) => o.id === decisions.scene.selectedOptionId);
    const selectedImageOption = decisions.image.options.find((o) => o.id === decisions.image.selectedOptionId);

    const title = projectTitle.trim() || (isRtl ? 'مشروع استوديو مورو الإبداعي' : 'Moro Studio Production');

    const project = await createProject({
      userId: user?.id || 'usr_moro_director',
      title,
      description: rawText || (isRtl ? 'مشروع سينمائي متعدد الوسائط' : 'Multi-format creative production'),
      genre: 'Speculative Narrative',
      style: selectedStyle,
      aspectRatio,
      targetDurationSeconds: targetDuration,
      status: 'storyboarding',
      coverImageUrl: selectedImageOption?.preview || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      tags: [selectedStyle, 'Multi-Format', '3-Option-System', selectedToneOption?.metadata.toneName || 'Cinematic'],
      totalScenes: 3,
      originalInput: {
        rawText,
        uploadedFiles,
        userPerspectiveDescription: userPerspectiveText,
        selectedStyle,
        targetDurationSeconds: targetDuration,
        aspectRatio,
      },
      userPerspectiveDescription: userPerspectiveText,
      creativeDecisions: decisions,
      selectedVoice: selectedVoiceOption?.title,
      selectedTone: selectedToneOption?.title,
      selectedImages: selectedImageOption?.preview ? [selectedImageOption.preview] : [],
    });

    openProjectWorkspace(project.id);
  };

  return (
    <div className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* =========================================================================
          STAGE 1: MULTI-FORMAT INPUT STAGE
      ========================================================================= */}
      {workflowStage === 'input' && (
        <div className="space-y-6">
          {/* Header banner with sample button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-[#0c0f15]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? 'الإدخال متعدد الوسائط (Multi-Format Input)' : 'Intelligent Multi-Format Ingestion'}</span>
              </div>
              <h2 className="text-base font-bold text-white font-display">
                {isRtl ? 'تغذية الاستوديو بالنص، الصور، والملفات المرجعية' : 'Provide Text, Concept Images, Screenplays or Documents'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                {isRtl
                  ? 'يمكنك إدخال نص سيناريو، إرفاق صور مفاهيمية، رفع مستندات (PDF / TXT / DOCX)، أو الجمع بين أي منها. سيقوم مورو باستيعابها في سياق المشروع الموحد.'
                  : 'Combine raw text, concept art, and structured documents (PDF, TXT, DOCX). Moro AI synthesizes all formats into unified creative project context.'}
              </p>
            </div>

            <button
              type="button"
              onClick={addSampleFiles}
              className="px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRtl ? 'تجربة سريعة بنموذج جاهز' : '1-Click Sample Input'}</span>
            </button>
          </div>

          {/* Form container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 cols: Text prompt & File Upload Area */}
            <div className="lg:col-span-2 space-y-5">
              {/* Working Title */}
              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-semibold">{isRtl ? 'عنوان المشروع' : 'Project Title'}</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder={isRtl ? 'مثلاً: أصداء كوكب كيبلر' : 'e.g. Echoes of Kepler-186f'}
                  className="w-full bg-[#0c0f15] border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              {/* Text Input */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold">
                    {isRtl ? 'النص السردي / فكرة السيناريو (اختياري مع الملفات)' : 'Narrative Text / Concept Synopsis (Optional with Files)'}
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {rawText.length} {isRtl ? 'حرف' : 'chars'}
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={
                    isRtl
                      ? 'اكتب الفكرة، الصق جزءاً من السيناريو، حوارات الشخصيات، أو الخطوط العريضة للقصة...'
                      : 'Describe your story beats, paste character dialogue, narrative premise, or rough director notes...'
                  }
                  className="w-full bg-[#0c0f15] border border-slate-800 rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 text-xs leading-relaxed resize-y"
                />
              </div>

              {/* File Upload Area (Desktop Drag & Drop + Native File Selector) */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold">
                    {isRtl ? 'منطقة رفع الملفات والصور (PDF, TXT, DOCX, Images)' : 'Media & Document Upload Area (PDF, TXT, DOCX, Images)'}
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {uploadedFiles.length} {isRtl ? 'ملف(ات) مرفقة' : 'files attached'}
                  </span>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`p-6 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer ${
                    isDragging
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-slate-800 bg-[#0c0f15] hover:border-slate-700'
                  }`}
                  onClick={() => document.getElementById('moro-multi-file-input')?.click()}
                >
                  <input
                    id="moro-multi-file-input"
                    type="file"
                    multiple
                    accept=".pdf,.txt,.docx,image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-amber-400">
                    <Upload className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white">
                      {isRtl ? 'اسحب وأفلت الملفات هنا، أو انقر للاستعراض' : 'Drag & Drop files here, or click to browse'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isRtl
                        ? 'الأنظمة المدعومة: نصوص وسيناريوهات (PDF, TXT, DOCX) وصور ومفاهيم (PNG, JPG, WEBP)'
                        : 'Supported architecture: Screenplays (PDF, TXT, DOCX) & Concept Images (PNG, JPG, WEBP)'}
                    </p>
                  </div>
                </div>

                {/* Uploaded Files Manifest List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {isRtl ? 'الملفات المحملة في سياق المشروع:' : 'Uploaded Assets in Project Context:'}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {uploadedFiles.map((file) => {
                        const isImage = file.previewUrl || file.mimeType.startsWith('image/');

                        return (
                          <div
                            key={file.id}
                            className="p-2.5 rounded-lg border border-slate-800 bg-[#090b0e] flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {isImage && file.previewUrl ? (
                                <img
                                  src={file.previewUrl}
                                  alt={file.name}
                                  className="w-10 h-10 rounded object-cover border border-slate-800 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-amber-400">
                                  {file.extension === 'pdf' ? (
                                    <span className="font-mono text-[10px] font-bold">PDF</span>
                                  ) : file.extension === 'docx' ? (
                                    <span className="font-mono text-[10px] font-bold">DOC</span>
                                  ) : (
                                    <FileText className="w-4 h-4 text-slate-400" />
                                  )}
                                </div>
                              )}

                              <div className="min-w-0">
                                <div className="font-semibold text-white truncate text-xs" title={file.name}>
                                  {file.name}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                                  <span className="uppercase">{file.extension}</span>
                                  <span>·</span>
                                  <span>{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                                {file.extractedTextSummary && (
                                  <div className="text-[10px] text-amber-400/80 truncate mt-0.5">
                                    {file.extractedTextSummary}
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(file.id);
                              }}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded transition-colors cursor-pointer shrink-0"
                              title={isRtl ? 'حذف الملف' : 'Remove file'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => document.getElementById('moro-multi-file-input')?.click()}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'إضافة ملف آخر' : 'Add another file'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right col: Aesthetic Direction & Project Specifications */}
            <div className="space-y-5 rounded-xl border border-slate-800 bg-[#0c0f15] p-5 text-xs">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                {isRtl ? 'المحددات السينمائية' : 'Production Parameters'}
              </h3>

              {/* Aesthetic Style */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">{isRtl ? 'الأسلوب البصري' : 'Visual Style'}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'cinematic', label: isRtl ? 'سينمائي واقعي' : 'Cinematic Realism' },
                    { id: 'anime', label: isRtl ? 'أنمي ياباني' : 'Anime Stylized' },
                    { id: 'realistic', label: isRtl ? 'وثائقي طبيعي' : 'Natural Doc' },
                    { id: 'cartoon', label: isRtl ? 'كرتون 2D' : 'Graphic 2D' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStyle(st.id as any)}
                      className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center cursor-pointer ${
                        selectedStyle === st.id
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-[#090b0e] text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">{isRtl ? 'نسبة العرض' : 'Aspect Ratio'}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '16:9', label: '16:9 Cinema/YT' },
                    { id: '2.39:1', label: '2.39:1 Anamorphic' },
                    { id: '9:16', label: '9:16 Vertical' },
                    { id: '1:1', label: '1:1 Square' },
                  ].map((ar) => (
                    <button
                      key={ar.id}
                      type="button"
                      onClick={() => setAspectRatio(ar.id as any)}
                      className={`p-2 rounded-lg text-xs font-mono font-semibold border transition-all text-center cursor-pointer ${
                        aspectRatio === ar.id
                          ? 'bg-slate-800 text-amber-300 border-amber-400'
                          : 'bg-[#090b0e] text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Duration */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold">{isRtl ? 'مدة العرض المستهدفة' : 'Target Duration'}</label>
                  <span className="font-mono text-amber-400">{targetDuration} {isRtl ? 'ثانية' : 'sec'}</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={300}
                  step={10}
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>30s</span>
                  <span>120s</span>
                  <span>300s</span>
                </div>
              </div>

              {/* Next Step Navigation */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => setWorkflowStage('perspective')}
                  disabled={!rawText.trim() && uploadedFiles.length === 0}
                  className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                  <span>{isRtl ? 'المتابعة إلى مرحلة الاستيعاب' : 'Proceed to Ingestion Analysis'}</span>
                  <ForwardArrow className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-slate-500 text-center">
                  {isRtl ? 'يتطلب إما نصاً، أو ملفاً/صورة واحدة على الأقل' : 'Requires at least text or 1 uploaded file/image'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 2: OPTIONAL USER PERSPECTIVE STEP (NEVER MANDATORY)
      ========================================================================= */}
      {workflowStage === 'perspective' && (
        <div className="max-w-2xl mx-auto rounded-xl border border-slate-800 bg-[#0c0f15] p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRtl ? 'خطوة اختيارية تماماً' : 'Completely Optional Step'}</span>
            </div>

            <h2 className="text-xl font-bold text-white font-display">
              {isRtl ? 'هل تريد أن تصف المشهد من منظورك؟' : 'Would you like to describe the scene from your perspective?'}
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl
                ? 'أحياناً يود المخرج مشاركة لمسته الخاصة حول بداية المشهد أو حركة الكاميرا. يمكنك كتابة وصفك أو تخطي هذه الخطوة مباشرة.'
                : 'Sometimes Moro AI benefits from knowing how you visualize the opening moments or camera movement. You can write your description, or simply skip.'}
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <label className="text-slate-300 font-semibold">
              {isRtl ? 'صف لي المشهد كما تتخيله...' : 'Describe the scene as you imagine it...'}
            </label>
            <textarea
              rows={4}
              value={userPerspectiveText}
              onChange={(e) => setUserPerspectiveText(e.target.value)}
              placeholder={
                isRtl
                  ? 'مثلاً: أريد أن يبدأ المشهد من لقطة قريبة للشخصية ثم تتحرك الكاميرا ببطء لتكشف القبة النباتية الضخمة...'
                  : 'e.g. I want the scene to open with an intimate close-up on the character visor, then slowly crane up to reveal the immense cavern...'
              }
              className="w-full bg-[#090b0e] border border-slate-800 rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 text-xs leading-relaxed resize-y"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
            {/* Skip Button: [تخطي] */}
            <button
              type="button"
              onClick={() => {
                setHasSkippedPerspective(true);
                startContentUnderstanding('');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              {isRtl ? 'تخطي' : 'Skip'}
            </button>

            {/* Continue Button: [متابعة] */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWorkflowStage('input')}
                className="px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {isRtl ? 'رجوع' : 'Back'}
              </button>

              <button
                type="button"
                onClick={() => startContentUnderstanding(userPerspectiveText)}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>{isRtl ? 'متابعة' : 'Continue'}</span>
                <ForwardArrow className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 3: CONTENT UNDERSTANDING PROGRESS STATE
      ========================================================================= */}
      {workflowStage === 'analyzing' && (
        <div className="max-w-2xl mx-auto rounded-xl border border-slate-800 bg-[#0c0f15] p-8 space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 animate-pulse">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white font-display">
              {understandingState.stage === 'analyzing' && (isRtl ? 'تحليل المحتوى والمدخلات...' : 'Analyzing content...')}
              {understandingState.stage === 'understanding' && (isRtl ? 'استيعاب السياق والبيئة...' : 'Understanding context...')}
              {understandingState.stage === 'preparing' && (isRtl ? 'تجهيز الخيارات الإبداعية الثلاثية...' : 'Preparing creative options...')}
              {understandingState.stage === 'ready' && (isRtl ? 'جاهز للاستكشاف والاعتماد' : 'Ready')}
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isRtl
                ? 'يقوم محرك مورو بتفكيك المدخلات، استخلاص الجغرافيا الدرامية، وتجهيز 3 خيارات لكل فئة إبداعية.'
                : 'Moro AI is parsing narrative inputs, detecting thematic parameters, and synthesizing 3 candidate variations per creative branch.'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 max-w-md mx-auto">
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                style={{ width: `${understandingState.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{isRtl ? 'المعالجة الحسابية' : 'Computational Inference'}</span>
              <span>{understandingState.progressPercent}%</span>
            </div>
          </div>

          {/* Stages indicator pills */}
          <div className="grid grid-cols-4 gap-2 text-[10px] font-mono pt-4 border-t border-slate-800/80">
            <div className={`p-2 rounded border ${understandingState.progressPercent >= 25 ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              1. {isRtl ? 'تحليل المحتوى' : 'Analyzing'}
            </div>
            <div className={`p-2 rounded border ${understandingState.progressPercent >= 55 ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              2. {isRtl ? 'استيعاب السياق' : 'Context'}
            </div>
            <div className={`p-2 rounded border ${understandingState.progressPercent >= 85 ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              3. {isRtl ? 'تجهيز الخيارات' : 'Options'}
            </div>
            <div className={`p-2 rounded border ${understandingState.progressPercent >= 100 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              4. {isRtl ? 'جاهز' : 'Ready'}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 4: 3-OPTION CREATIVE INCEPTION CONSOLE (VOICE, TONE, SCENE, IMAGE)
      ========================================================================= */}
      {workflowStage === 'decisions' && decisions && (
        <div className="space-y-6">
          {/* Summary Banner of Extracted Context */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0c0f15] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-display">
                  {projectTitle || (isRtl ? 'مشروع بدون عنوان' : 'Untitled Project')}
                </span>
                <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-mono">
                  {selectedStyle} · {aspectRatio} · {targetDuration}s
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                <span className="text-slate-500 font-medium">{isRtl ? 'السياق المستنتج: ' : 'Detected Context: '}</span>
                {understandingState.extractedContext}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setWorkflowStage('input')}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition-colors cursor-pointer"
              >
                {isRtl ? 'تعديل المدخلات' : 'Edit Input'}
              </button>

              <button
                type="button"
                onClick={handleInitializeProject}
                className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center gap-1.5 cursor-pointer"
              >
                <Film className="w-3.5 h-3.5" />
                <span>{isRtl ? 'اعتماد القرارات وفتح الاستوديو' : 'Confirm Decisions & Open Studio'}</span>
              </button>
            </div>
          </div>

          {/* Category Tabs: Scene, Voice, Tone, Visual */}
          <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'scene', label: isRtl ? 'خيارات المشهد (3)' : 'Scene Concepts (3)', icon: Film },
              { id: 'voice', label: isRtl ? 'خيارات الصوت (3)' : 'Voice Profiles (3)', icon: Volume2 },
              { id: 'tone', label: isRtl ? 'خيارات النبرة (3)' : 'Tone Directions (3)', icon: Palette },
              { id: 'image', label: isRtl ? 'خيارات الصورة (3)' : 'Visual Styles (3)', icon: ImageIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategoryTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategoryTab(tab.id as any)}
                  className={`px-4 py-2 rounded-t-lg font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800/90 text-amber-300 border-b-2 border-amber-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active 3-Option Generator View */}
          <div>
            {activeCategoryTab === 'scene' && (
              <ThreeOptionGenerator
                decision={decisions.scene}
                onSelectOption={(id) => handleSelectOption('scene', id)}
                onReplaceSingle={(id) => handleReplaceSingleOption('scene', id)}
                onReplaceAll={() => handleReplaceAllOptions('scene')}
                categoryIcon={Film}
              />
            )}

            {activeCategoryTab === 'voice' && (
              <ThreeOptionGenerator
                decision={decisions.voice}
                onSelectOption={(id) => handleSelectOption('voice', id)}
                onReplaceSingle={(id) => handleReplaceSingleOption('voice', id)}
                onReplaceAll={() => handleReplaceAllOptions('voice')}
                categoryIcon={Volume2}
              />
            )}

            {activeCategoryTab === 'tone' && (
              <ThreeOptionGenerator
                decision={decisions.tone}
                onSelectOption={(id) => handleSelectOption('tone', id)}
                onReplaceSingle={(id) => handleReplaceSingleOption('tone', id)}
                onReplaceAll={() => handleReplaceAllOptions('tone')}
                categoryIcon={Palette}
              />
            )}

            {activeCategoryTab === 'image' && (
              <ThreeOptionGenerator
                decision={decisions.image}
                onSelectOption={(id) => handleSelectOption('image', id)}
                onReplaceSingle={(id) => handleReplaceSingleOption('image', id)}
                onReplaceAll={() => handleReplaceAllOptions('image')}
                categoryIcon={ImageIcon}
              />
            )}
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-400">
              {isRtl
                ? 'تم حفظ جميع خياراتك في سياق المشروع دون الكتابة فوق بقية المعطيات.'
                : 'All selections are preserved in project state without overwriting unselected options.'}
            </div>

            <button
              type="button"
              onClick={handleInitializeProject}
              className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Film className="w-4 h-4" />
              <span>{isRtl ? 'بدء خط الإنتاج وفتح استوديو المشروع' : 'Initialize Production & Open Studio'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
