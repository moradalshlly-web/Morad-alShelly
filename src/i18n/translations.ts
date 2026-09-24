/**
 * Moro AI Scalable Internationalization Dictionary
 * Supports Arabic (العربية - RTL) and English (LTR).
 * Crafted with natural, modern cinematic industry Arabic phrasing (فصحى معاصرة رصينة).
 */

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface TranslationSchema {
  common: {
    appName: string;
    tagline: string;
    save: string;
    saving: string;
    saved: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    close: string;
    done: string;
    back: string;
    next: string;
    finish: string;
    search: string;
    filter: string;
    all: string;
    status: string;
    actions: string;
    loading: string;
    refresh: string;
    confirmDelete: string;
    notConnected: string;
    architecturePlaceholder: string;
    language: string;
    arabic: string;
    english: string;
  };
  nav: {
    home: string;
    projects: string;
    create: string;
    suggestForMe: string;
    proofreader: string;
    characters: string;
    assets: string;
    models: string;
    settings: string;
    workspace: string;
  };
  header: {
    studioSubtitle: string;
    newProject: string;
    notifications: string;
    searchPlaceholder: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    btnCreateProject: string;
    btnSuggestForMe: string;
    btnProofreader: string;
    quickStats: {
      activeProjects: string;
      sceneRenders: string;
      lockedCharacters: string;
      routerEfficiency: string;
    };
    recentProjects: string;
    viewAllProjects: string;
    creativePillars: {
      orchestrationTitle: string;
      orchestrationDesc: string;
      threeOptionTitle: string;
      threeOptionDesc: string;
      continuityTitle: string;
      continuityDesc: string;
      bilingualProofreadTitle: string;
      bilingualProofreadDesc: string;
    };
  };
  projects: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAllStyles: string;
    newProjectBtn: string;
    noProjectsTitle: string;
    noProjectsDesc: string;
    openWorkspace: string;
    scenesCount: string;
    durationSeconds: string;
  };
  create: {
    title: string;
    subtitle: string;
    suggestTabTitle: string;
    suggestTabDesc: string;
    customTabTitle: string;
    customTabDesc: string;
    formProjectTitle: string;
    formProjectTitlePlaceholder: string;
    formGenre: string;
    formStyle: string;
    formAspectRatio: string;
    formTargetDuration: string;
    formLogline: string;
    formLoglinePlaceholder: string;
    btnLaunchWorkspace: string;
    suggestWizard: {
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Desc: string;
      step4Title: string;
      step4Desc: string;
      btnGenerateOptions: string;
      analyzingConcept: string;
      reviewTitle: string;
      reviewDesc: string;
      btnAdoptConcept: string;
    };
  };
  proofreader: {
    title: string;
    subtitle: string;
    inputLabel: string;
    inputPlaceholder: string;
    btnAnalyze: string;
    analyzing: string;
    resultsTitle: string;
    originalText: string;
    correctedText: string;
    improvementsFound: string;
    noImprovementsNeeded: string;
    noImprovementsDesc: string;
    btnAcceptAll: string;
    btnRejectAll: string;
    btnCopyCorrected: string;
    copied: string;
    types: {
      grammar: string;
      spelling: string;
      punctuation: string;
      clarity: string;
      wording: string;
      style: string;
    };
    status: {
      pending: string;
      accepted: string;
      rejected: string;
    };
    btnApplyToWorkspace: string;
    readabilityRating: string;
  };
  characters: {
    title: string;
    subtitle: string;
    btnNewCharacter: string;
    noCharactersTitle: string;
    noCharactersDesc: string;
    seedLocked: string;
    traitsLabel: string;
    assignedVoice: string;
    modalTitleNew: string;
    modalTitleEdit: string;
    formName: string;
    formRole: string;
    formDescription: string;
    formVoiceProvider: string;
    formVoiceId: string;
    formTraits: string;
    roles: {
      protagonist: string;
      antagonist: string;
      supporting: string;
      narrator: string;
      cameo: string;
    };
  };
  assets: {
    title: string;
    subtitle: string;
    btnUpload: string;
    noAssetsTitle: string;
    noAssetsDesc: string;
    filterAll: string;
    filterImages: string;
    filterVideos: string;
    filterVoices: string;
    filterAudio: string;
    filterScripts: string;
    inspectorTitle: string;
  };
  models: {
    title: string;
    subtitle: string;
    architectureNoticeTitle: string;
    architectureNoticeDesc: string;
    notConnectedBadge: string;
    reloadRegistry: string;
    filterAll: string;
    filterVideo: string;
    filterImage: string;
    filterVoice: string;
    filterText: string;
    filterMusic: string;
    filterTranslation: string;
    filterProofreading: string;
    colProviderModel: string;
    colType: string;
    colConnectionStatus: string;
    colCapabilities: string;
    colPriority: string;
    colFallback: string;
    colQualitySpeed: string;
    colUnitCost: string;
    colState: string;
    simulationTitle: string;
    simulationDesc: string;
    btnTestRouter: string;
  };
  settings: {
    title: string;
    subtitle: string;
    btnSave: string;
    routingSectionTitle: string;
    routingPolicyLabel: string;
    autoFallbackLabel: string;
    autoFallbackDesc: string;
    canvasSectionTitle: string;
    resolutionLabel: string;
    aspectRatioLabel: string;
    bitrateLabel: string;
    credentialsSectionTitle: string;
    credentialsNotice: string;
    serverSideProxyActive: string;
    budgetSectionTitle: string;
    maxCostLabel: string;
    maxCostDesc: string;
  };
  workspace: {
    returnToProjects: string;
    advanceStage: string;
    processingStage: string;
    pipelineBannerTitle: string;
    stageInference: string;
    tabs: {
      scenes: string;
      timeline: string;
      script: string;
      characters: string;
      assets: string;
      generations: string;
      exports: string;
    };
    script: {
      draftTitle: string;
      btnSaveScript: string;
      autoParseNotice: string;
    };
    scenes: {
      title: string;
      btnAddScene: string;
      optionActive: string;
      threeOptionDescription: string;
      replaceVisual: string;
      modalAddTitle: string;
      formSceneTitle: string;
      formVisualDirection: string;
    };
    timeline: {
      monitorSettings: string;
      playbackFps: string;
      subtitlesPreview: string;
      transitionLabel: string;
      play: string;
      pause: string;
      jumpStart: string;
      jumpEnd: string;
    };
    generations: {
      title: string;
      btnRefresh: string;
      routedProvider: string;
      promptSeed: string;
      candidatesGenerated: string;
    };
    exports: {
      title: string;
      renderProfile: string;
      multilingualSubtitles: string;
      subtitlesDesc: string;
      burnedIn: string;
      softSelectable: string;
      audioStems: string;
      audioStemsDesc: string;
      btnRenderMaster: string;
      rendering: string;
      completedDeliverables: string;
      btnDownload: string;
    };
  };
}

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  ar: {
    common: {
      appName: 'مورو للذكاء الاصطناعي',
      tagline: 'استوديو الإبداع السينمائي المتكامل بالذكاء الاصطناعي',
      save: 'حفظ التغييرات',
      saving: 'جارٍ الحفظ...',
      saved: 'تم الحفظ بنجاح',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      create: 'إنشاء',
      close: 'إغلاق',
      done: 'تم',
      back: 'رجوع',
      next: 'التالي',
      finish: 'إنهاء',
      search: 'بحث...',
      filter: 'تصفية',
      all: 'الكل',
      status: 'الحالة',
      actions: 'إجراءات',
      loading: 'جارٍ التحميل...',
      refresh: 'تحديث',
      confirmDelete: 'هل أنت متأكد من رغبتك في الحذف؟',
      notConnected: 'غير متصل (هيكل مستقبلي)',
      architecturePlaceholder: 'مكان مخصص للبنية المستقبلية',
      language: 'اللغة',
      arabic: 'العربية',
      english: 'English',
    },
    nav: {
      home: 'الرئيسية',
      projects: 'المشاريع',
      create: 'إنشاء',
      suggestForMe: 'اقترح لي',
      proofreader: 'المدقق اللغوي بالذكاء الاصطناعي',
      characters: 'الشخصيات',
      assets: 'الأصول',
      models: 'النماذج وموجّه الذكاء الاصطناعي',
      settings: 'الإعدادات',
      workspace: 'مساحة العمل',
    },
    header: {
      studioSubtitle: 'المنصة الموحدة لإدارة وتوجيه مزودي الذكاء الاصطناعي الإبداعي',
      newProject: 'مشروع جديد',
      notifications: 'الإشعارات',
      searchPlaceholder: 'ابحث في المشاريع، المشاهد، الشخصيات...',
    },
    home: {
      heroBadge: 'المرحلة 1.1 · البنية التحتية المتعددة اللغات والتدقيق اللغوي',
      heroTitle: 'Moro AI — Premium AI Creative Studio',
      heroSubtitle:
        'مورو للذكاء الاصطناعي هي منصة إبداعية متكاملة متعددة المزودين لإنتاج القصص، الصور، الفيديوهات، الأصوات، الدبلجة، الرسوم المتحركة ومحتوى التواصل الاجتماعي.',
      btnCreateProject: 'بدء مشروع جديد',
      btnSuggestForMe: 'اقترح لي فكرة سينمائية',
      btnProofreader: 'المدقق اللغوي الذكي',
      quickStats: {
        activeProjects: 'المشاريع الجارية',
        sceneRenders: 'المشاهد المنسقة',
        lockedCharacters: 'شخصيات محكمة الملامح',
        routerEfficiency: 'كفاءة التوجيه الذاتي',
      },
      recentProjects: 'أحدث مشاريع الاستوديو',
      viewAllProjects: 'عرض كافة المشاريع',
      creativePillars: {
        orchestrationTitle: 'طبقة توجيه سيادية موحدة',
        orchestrationDesc:
          'مورو للذكاء الاصطناعي هو المحرك الأساسي ولا يرتبط بأي مزود وسائط خارجي فردي. يتم توجيه كل مهمة للمزود الأنسب بنظام بدائل تلقائي.',
        threeOptionTitle: 'نظام الخيارات الثلاثة المتوازية',
        threeOptionDesc:
          'توليد ثلاثة خيارات متوازية لكل مشهد وصوت، مع إمكانية استبدال الخيار المرفوض محليًا دون إعادة تشغيل المشروع بالكامل.',
        continuityTitle: 'تثبيت الشخصيات والملامح',
        continuityDesc:
          'تأمين بذور الملامح ونبرات الصوت والأزياء لضمان استمرارية بصرية دقيقة عبر المشاهد المتتابعة.',
        bilingualProofreadTitle: 'تدقيق لغوي عربي وإنجليزي ذكي',
        bilingualProofreadDesc:
          'فحص قواعد اللغة العربية والإملاء وعلامات الترقيم وتدفق الحوار الدرامي مع الحفاظ الصارم على المعنى الأصلي للكاتب.',
      },
    },
    projects: {
      title: 'مشاريع الاستوديو',
      subtitle: 'إدارة وتتبع إنتاجات الفيديو، السلاسل القصصية، والحملات الإبداعية.',
      searchPlaceholder: 'البحث باسم المشروع أو الكلمات الدلالية...',
      filterAllStyles: 'جميع الأنماط الفنية',
      newProjectBtn: 'مشروع جديد',
      noProjectsTitle: 'لا توجد مشاريع حتى الآن',
      noProjectsDesc: 'ابدأ بصناعة أول عمل سينمائي متكامل أو استخدم وضع "اقترح لي".',
      openWorkspace: 'فتح مساحة العمل',
      scenesCount: 'مشاهد',
      durationSeconds: 'ثانية',
    },
    create: {
      title: 'إنشاء مشروع إبداعي',
      subtitle: 'حدد الرؤية الفنية أو اطلب من مورو توليد مقترحات سينمائية متكاملة.',
      suggestTabTitle: 'اقترح لي فكرة (Suggest for Me)',
      suggestTabDesc: 'أجب عن 4 أسئلة بسيطة وسيقوم المحرك بتقديم 3 تصورات سينمائية كاملة.',
      customTabTitle: 'إعداد مخصص ومباشر',
      customTabDesc: 'تحديد عنوان العمل، النوع، الأسلوب البصري والأبعاد يدويًا.',
      formProjectTitle: 'عنوان المشروع',
      formProjectTitlePlaceholder: 'مثال: ملحمة الرمال الكونية',
      formGenre: 'النوع الدرامي',
      formStyle: 'الأسلوب الإخراجي البصري',
      formAspectRatio: 'أبعاد الكادر السينمائي',
      formTargetDuration: 'المدة الزمنية التقديرية (ثوانٍ)',
      formLogline: 'الفكرة العامة / اللوغلاين',
      formLoglinePlaceholder: 'اكتب ملخص الفكرة الدرامية أو الصراع الأساسي في سطرين...',
      btnLaunchWorkspace: 'تهيئة مساحة العمل والبدء',
      suggestWizard: {
        step1Title: '1. ما هو النمط والأسلوب الإخراجي المفضل؟',
        step1Desc: 'اختر الطابع الجمالي واللوني للعمل.',
        step2Title: '2. ما هو تصنيف ومحتوى العمل؟',
        step2Desc: 'حدد الهدف والجمهور المستهدف للإنتاج.',
        step3Title: '3. مرجعية الشخصيات والملامح',
        step3Desc: 'هل ترغب في تحديد شخصية محددة الملامح أو المتابعة دون تخصيص؟',
        step4Title: '4. المدة الزمنية المستهدفة',
        step4Desc: 'اختر النطاق الزمني المناسب لإيقاع السرد.',
        btnGenerateOptions: 'توليد 3 مقترحات إبداعية متكاملة',
        analyzingConcept: 'جارٍ تحليل السياق وصياغة 3 مقترحات سينمائية...',
        reviewTitle: 'اختر أحد المقترحات الإبداعية الثلاثة',
        reviewDesc: 'تمت صياغة 3 خيارات مختلفة بالكامل في البناء والمزاج والشخصيات.',
        btnAdoptConcept: 'اعتماد هذا المقترح وفتح مساحة العمل',
      },
    },
    proofreader: {
      title: 'المدقق اللغوي بالذكاء الاصطناعي (AI Language Proofreader)',
      subtitle:
        'بنية معالجة لغوية مستقلة لفحص وتصحيح النصوص العربية والإنجليزية، التدقيق الإملائي والنحوي، وضبط علامات الترقيم وبلاغة الحوار مع الحفاظ التام على المعنى الأصلي.',
      inputLabel: 'النص الأصلي (سيناريو، حوار، أو فكرة قصصية)',
      inputPlaceholder: 'أدخل النص هنا للفحص والتدقيق اللغوي...',
      btnAnalyze: 'بدء التدقيق والتحليل اللغوي',
      analyzing: 'جارٍ تحليل الصياغة وقواعد اللغة...',
      resultsTitle: 'تقرير الفحص ومقترحات التحسين',
      originalText: 'النص الأصلي المدخل',
      correctedText: 'الصياغة المقترحة المنقحة',
      improvementsFound: 'تحسينات مقترحة مكتشفة',
      noImprovementsNeeded: 'النص سليم لغويًا ومتسق مع القواعد',
      noImprovementsDesc: 'تم التحقق من القواعد النحوية والإملائية وتدفق الحوار دون ملاحظات سلبية.',
      btnAcceptAll: 'قبول كافة التحسينات',
      btnRejectAll: 'رفض التعديلات',
      btnCopyCorrected: 'نسخ النص المنقح',
      copied: 'تم النسخ!',
      types: {
        grammar: 'قواعد ونحو',
        spelling: 'إملاء وهمزات',
        punctuation: 'علامات ترقيم',
        clarity: 'وضوح وتماسك',
        wording: 'فصاحة وبلاغة',
        style: 'أسلوب سردي',
      },
      status: {
        pending: 'قيد المراجعة',
        accepted: 'تم القبول',
        rejected: 'مرفوض',
      },
      btnApplyToWorkspace: 'تطبيق الصياغة المنقحة على سيناريو المشروع',
      readabilityRating: 'مؤشر السلامة اللغوية وسلاسة السرد',
    },
    characters: {
      title: 'سجل استمرارية الشخصيات',
      subtitle: 'تأمين بذور الملامح، أوصاف الأزياء، وملفات مطابقة نبرة الصوت عبر كافة المشاهد.',
      btnNewCharacter: 'تسجيل شخصية جديدة',
      noCharactersTitle: 'لم يتم تسجيل شخصيات بعد',
      noCharactersDesc: 'عرّف الشخصيات وبذورها الهندسية للحفاظ على استمرارية الملامح.',
      seedLocked: 'بذرة الملامح محكمة ومقفلة',
      traitsLabel: 'علامات الاستمرارية البصرية',
      assignedVoice: 'ملف الصوت المخصص',
      modalTitleNew: 'تسجيل شخصية درامية جديدة',
      modalTitleEdit: 'تعديل بيانات الشخصية',
      formName: 'اسم الشخصية',
      formRole: 'الدور في الحبكة',
      formDescription: 'الوصف البصري التفصيلي (الملامح، العمر، الزي)',
      formVoiceProvider: 'مزود الصوت المعين',
      formVoiceId: 'معرف نبرة الصوت',
      formTraits: 'سمات فارقة للاستمرارية (مفصولة بفواصل)',
      roles: {
        protagonist: 'البطل الرئيسي',
        antagonist: 'الخصم / المضاد',
        supporting: 'شخصية مساندة',
        narrator: 'الراوي الصوتي',
        cameo: 'ظهور خاص',
      },
    },
    assets: {
      title: 'مكتبة الأصول الإبداعية',
      subtitle: 'المستودع المركزي للصور المعالجة، المقاطع، التسجيلات الصوتية، والمستندات.',
      btnUpload: 'رفع أصل جديد',
      noAssetsTitle: 'المكتبة فارغة',
      noAssetsDesc: 'قم برفع ملفات وسائط أو توليد مشاهد من مساحات عمل المشاريع.',
      filterAll: 'جميع الوسائط',
      filterImages: 'الصور',
      filterVideos: 'الفيديوهات',
      filterVoices: 'الأصوات',
      filterAudio: 'الموسيقى والمؤثرات',
      filterScripts: 'النصوص والمستندات',
      inspectorTitle: 'تفاصيل الأصل والبيانات الوصفية',
    },
    models: {
      title: 'سجل النماذج وموجّه الذكاء الاصطناعي',
      subtitle: 'إدارة سياسات توجيه المهام، أوزان الأولويات، وسلاسل البدائل التلقائية.',
      architectureNoticeTitle: 'تنبيه هيكلي هام (Phase 1.1)',
      architectureNoticeDesc:
        'تعرض هذه الشاشة الهيكل المعماري البرمجي المستقبلي لمزودي الذكاء الاصطناعي في مورو. في هذه المرحلة، لا يوجد أي مزود وسائط خارجي متصل فعليًا (جميعها في حالة غير متصل)، ولن يتم إجراء أي استدعاءات لواجهات برمجة حقيقية.',
      notConnectedBadge: 'غير متصل (هيكل فقط)',
      reloadRegistry: 'إعادة تحميل السجل',
      filterAll: 'جميع التخصصات',
      filterVideo: 'الفيديو',
      filterImage: 'الصور',
      filterVoice: 'الصوت',
      filterText: 'النصوص',
      filterMusic: 'الموسيقى',
      filterTranslation: 'الترجمة',
      filterProofreading: 'التدقيق اللغوي',
      colProviderModel: 'المزود / النموذج البرمجي',
      colType: 'التخصص',
      colConnectionStatus: 'حالة الاتصال',
      colCapabilities: 'القدرات والميزات',
      colPriority: 'الأولوية',
      colFallback: 'البديل التلقائي',
      colQualitySpeed: 'الجودة / السرعة',
      colUnitCost: 'التكلفة التقديرية',
      colState: 'تفعيل/تعطيل',
      simulationTitle: 'محاكي قرارات موجّه مورو الذاتي (AI Router Simulation)',
      simulationDesc: 'اختبر كيف يختار الموجه المزود الأمثل ويفعّل البدائل التلقائية في حالات الأعطال.',
      btnTestRouter: 'تنفيذ محاكاة التوجيه',
    },
    settings: {
      title: 'إعدادات الاستوديو والتوجيه',
      subtitle: 'معايير التوجيه الشاملة، تفضيلات الإخراج، وحدود الميزانية التشغيلية.',
      btnSave: 'حفظ التفضيلات',
      routingSectionTitle: 'استراتيجية التوجيه الذكي (AI Router Policy)',
      routingPolicyLabel: 'سياسة التحسين المفضلة',
      autoFallbackLabel: 'تفعيل التبديل التلقائي إلى المزود البديل',
      autoFallbackDesc: 'التحول الفوري للمزود التالي في سلسلة الأولوية عند حدوث خطأ أو انقطاع استجابة.',
      canvasSectionTitle: 'الإعدادات الافتراضية للكادر والتسليم',
      resolutionLabel: 'دقة الفيديو الافتراضية للماستر',
      aspectRatioLabel: 'الأبعاد الافتراضية للشاشات',
      bitrateLabel: 'معدل تدفق الفيديو (ميغابت/ثانية)',
      credentialsSectionTitle: 'مفاتيح وواجهات المزودين (بنية الوكيل الآمن)',
      credentialsNotice:
        'تطبق المنصة بنية التوكيل الآمن من جانب الخادم (Server-Side Proxy Architecture). لا يتم تسريب أي مفاتيح لواجهة العميل إطلاقًا.',
      serverSideProxyActive: 'بنية التوكيل الآمن نشطة',
      budgetSectionTitle: 'ضوابط الميزانية والإنفاق',
      maxCostLabel: 'الحد الأقصى لتنبيه تكلفة المشروع (بالدولار)',
      maxCostDesc: 'إرسال تنبيه للمخرج عند اقتراب تكاليف التوليد من هذا السقف.',
    },
    workspace: {
      returnToProjects: 'العودة لقائمة المشاريع',
      advanceStage: 'المرحلة التالية في خط الإنتاج',
      processingStage: 'جارٍ معالجة المرحلة...',
      pipelineBannerTitle: 'حالة خط الإنتاج الإبداعي المكون من 12 مرحلة:',
      stageInference: 'مخرجات المرحلة الحالية:',
      tabs: {
        scenes: 'المشاهد (نظام الخيارات الثلاثة)',
        timeline: 'خط الزمن والمونتاج',
        script: 'السيناريو والحوار',
        characters: 'الشخصيات المتسقة',
        assets: 'أصول المشروع',
        generations: 'سجل التوليد والموجّه',
        exports: 'التسليم والتصدير النهائي',
      },
      script: {
        draftTitle: 'مسودة السيناريو الرئيسية',
        btnSaveScript: 'حفظ المسودة',
        autoParseNotice: 'يقوم المحرك تلقائيًا بتفكيك السيناريو إلى كتل حوار ومشاهد جاهزة للتوجيه.',
      },
      scenes: {
        title: 'توزيع وتتابع المشاهد',
        btnAddScene: 'إضافة مشهد جديد',
        optionActive: 'الخيار النشط للكادر',
        threeOptionDescription:
          'نظام الخيارات الثلاثة المتوازية: عاين 3 زوايا تصوير مختلفة واختر الأنسب، أو استبدل اللقطة المرفوضة دون مساس بباقي المشروع.',
        replaceVisual: 'إعادة صياغة اللقطة وتوليد 3 خيارات جديدة',
        modalAddTitle: 'إضافة مشهد جديد إلى التسلسل',
        formSceneTitle: 'عنوان المشهد',
        formVisualDirection: 'التوجيه البصري وحركة الكاميرا والإضاءة',
      },
      timeline: {
        monitorSettings: 'إعدادات شاشة العرض',
        playbackFps: 'معدل العرض: 24 إطاراً بالثانية · ماستر بدقة 4K',
        subtitlesPreview: 'معاينة شريط الترجمة المدمج',
        transitionLabel: 'انتقال المشهد',
        play: 'تشغيل',
        pause: 'إيقاف مؤقت',
        jumpStart: 'البداية',
        jumpEnd: 'النهاية',
      },
      generations: {
        title: 'سجل مهام التوليد وتدقيق الموجه',
        btnRefresh: 'تحديث السجل',
        routedProvider: 'المزود والنموذج الموجه إليه',
        promptSeed: 'بذرة التوجيه الإخراجي',
        candidatesGenerated: 'المرشحات المتوازية الناتجة (بنية الخيارات الثلاثة)',
      },
      exports: {
        title: 'محرك التسليم والتصدير متعدد اللغات',
        renderProfile: 'ملف الإخراج والماسترينغ',
        multilingualSubtitles: 'تضمين ملفات الترجمة متعددة اللغات',
        subtitlesDesc: 'تضمين مسارات الترجمة بالعربية والإنجليزية بتوقيت متزامن مع الإطارات.',
        burnedIn: 'مدمجة في الصورة (Burned-in)',
        softSelectable: 'قابلة للتشغيل/الإيقاف (Soft subs)',
        audioStems: 'تصدير مسارات الصوت المنفصلة (Stems)',
        audioStemsDesc: 'تجهيز ملفات صوت منفصلة للحوار الصوتي، الموسيقى التصويرية، والمؤثرات.',
        btnRenderMaster: 'بدء تصدير الماستر النهائي',
        rendering: 'جارٍ التصدير والمزج النهائي...',
        completedDeliverables: 'المخرجات الجاهزة للتحميل',
        btnDownload: 'تحميل الملف',
      },
    },
  },
  en: {
    common: {
      appName: 'Moro AI',
      tagline: 'Premium AI Creative Studio & Orchestration Platform',
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Saved successfully',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      close: 'Close',
      done: 'Done',
      back: 'Back',
      next: 'Next',
      finish: 'Finish',
      search: 'Search...',
      filter: 'Filter',
      all: 'All',
      status: 'Status',
      actions: 'Actions',
      loading: 'Loading...',
      refresh: 'Refresh',
      confirmDelete: 'Are you sure you want to delete this item?',
      notConnected: 'Not connected (Architecture Slot)',
      architecturePlaceholder: 'Architectural Placeholder',
      language: 'Language',
      arabic: 'العربية',
      english: 'English',
    },
    nav: {
      home: 'Home',
      projects: 'Projects',
      create: 'Create',
      suggestForMe: 'Suggest for Me',
      proofreader: 'AI Proofreader',
      characters: 'Characters',
      assets: 'Assets',
      models: 'Models & AI Router',
      settings: 'Settings',
      workspace: 'Workspace',
    },
    header: {
      studioSubtitle: 'Unified Multi-Provider Creative AI Orchestration Layer',
      newProject: 'New Project',
      notifications: 'Notifications',
      searchPlaceholder: 'Search projects, scenes, characters...',
    },
    home: {
      heroBadge: 'Phase 1.1 · Localization & AI Proofreader Architecture',
      heroTitle: 'Moro AI — Premium AI Creative Studio',
      heroSubtitle:
        'Moro AI is a multi-provider creative AI platform for creating stories, images, videos, voices, dubbing, animation and social-media content.',
      btnCreateProject: 'Start New Project',
      btnSuggestForMe: 'Suggest for Me',
      btnProofreader: 'AI Language Proofreader',
      quickStats: {
        activeProjects: 'Active Projects',
        sceneRenders: 'Sequenced Scenes',
        lockedCharacters: 'Seed-Locked Characters',
        routerEfficiency: 'Router Failover Rate',
      },
      recentProjects: 'Recent Studio Projects',
      viewAllProjects: 'View All Projects',
      creativePillars: {
        orchestrationTitle: 'Sovereign Orchestration Layer',
        orchestrationDesc:
          'Moro AI is the central orchestrator and is never tied to any single external provider. Each task routes automatically with cascading fallbacks.',
        threeOptionTitle: 'Three-Option Candidate Engine',
        threeOptionDesc:
          'Generates 3 parallel options for every scene and voice. Replace a rejected visual locally without restarting the whole project.',
        continuityTitle: 'Persistent Character Continuity',
        continuityDesc:
          'Lock facial geometry seeds, wardrobe notes, and voice profiles across multiple scenes and projects.',
        bilingualProofreadTitle: 'Bilingual AI Proofreader',
        bilingualProofreadDesc:
          'Inspects Arabic and English grammar, spelling, punctuation, and cinematic dialogue flow while strictly preserving dramatic intent.',
      },
    },
    projects: {
      title: 'Studio Projects',
      subtitle: 'Manage and track video productions, episodic series, and storytelling projects.',
      searchPlaceholder: 'Search projects by title or tags...',
      filterAllStyles: 'All Visual Styles',
      newProjectBtn: 'New Project',
      noProjectsTitle: 'No projects created yet',
      noProjectsDesc: 'Create your first project or launch the "Suggest for Me" wizard.',
      openWorkspace: 'Open Workspace',
      scenesCount: 'scenes',
      durationSeconds: 'sec',
    },
    create: {
      title: 'Create Creative Project',
      subtitle: 'Specify custom parameters or let Moro suggest cinematic concept options.',
      suggestTabTitle: 'Suggest for Me',
      suggestTabDesc: 'Answer 4 simple questions and receive 3 complete production concepts.',
      customTabTitle: 'Custom Configuration',
      customTabDesc: 'Manually specify project title, genre, visual style, and aspect ratio.',
      formProjectTitle: 'Project Title',
      formProjectTitlePlaceholder: 'e.g. Chronicles of the Obsidian Veil',
      formGenre: 'Dramatic Genre',
      formStyle: 'Visual Direction Style',
      formAspectRatio: 'Canvas Aspect Ratio',
      formTargetDuration: 'Estimated Runtime (seconds)',
      formLogline: 'Logline & Creative Premise',
      formLoglinePlaceholder: 'Enter a two-sentence summary of the dramatic conflict...',
      btnLaunchWorkspace: 'Initialize Workspace & Begin',
      suggestWizard: {
        step1Title: '1. What style?',
        step1Desc: 'Cinematic / Anime / Cartoon / Realistic / Other',
        step2Title: '2. What type of content?',
        step2Desc: 'Story / Educational / Informational / Action / Comedy / Other',
        step3Title: '3. Character reference?',
        step3Desc: 'Upload images or continue without one.',
        step4Title: '4. Duration?',
        step4Desc: 'Short / Medium / Long / Custom',
        btnGenerateOptions: 'Generate 3 Distinct Suggestions',
        analyzingConcept: 'Analyzing creative parameters and building 3 proposals...',
        reviewTitle: 'Select From 3 Suggested Concepts',
        reviewDesc: 'Three complete concepts ready for non-destructive production.',
        btnAdoptConcept: 'Adopt Concept & Open Workspace',
      },
    },
    proofreader: {
      title: 'AI Language Proofreader',
      subtitle:
        'Dedicated AI proofreading architecture supporting Arabic & English grammar, spelling, punctuation, and phrasing refinement while preserving original authorial intent.',
      inputLabel: 'Original Text (Screenplay, Dialogue, or Narrative Premise)',
      inputPlaceholder: 'Enter your Arabic or English text to proofread and refine...',
      btnAnalyze: 'Run AI Proofreading',
      analyzing: 'Analyzing syntax, spelling, and phrasing...',
      resultsTitle: 'Proofreading Report & Suggested Improvements',
      originalText: 'Original Input Text',
      correctedText: 'Polished Suggested Version',
      improvementsFound: 'Improvements Identified',
      noImprovementsNeeded: 'Text is grammatically sound',
      noImprovementsDesc: 'Verified syntax, spelling, and narrative cadence with zero errors.',
      btnAcceptAll: 'Accept All Changes',
      btnRejectAll: 'Reject Changes',
      btnCopyCorrected: 'Copy Polished Text',
      copied: 'Copied to clipboard!',
      types: {
        grammar: 'Grammar',
        spelling: 'Spelling & Hamza',
        punctuation: 'Punctuation',
        clarity: 'Clarity & Cohesion',
        wording: 'Wording & Flow',
        style: 'Dramatic Style',
      },
      status: {
        pending: 'Pending',
        accepted: 'Accepted',
        rejected: 'Rejected',
      },
      btnApplyToWorkspace: 'Apply Polished Text to Project Screenplay',
      readabilityRating: 'Linguistic Health & Pacing Index',
    },
    characters: {
      title: 'Character Consistency Roster',
      subtitle: 'Lock facial geometry seeds, wardrobe notes, and voice timbre profiles across multiple scenes.',
      btnNewCharacter: 'Lock New Character',
      noCharactersTitle: 'No characters registered',
      noCharactersDesc: 'Define consistent character seeds to preserve visual fidelity across all scenes.',
      seedLocked: 'Facial Seed Locked',
      traitsLabel: 'Continuity Traits',
      assignedVoice: 'Assigned Voice',
      modalTitleNew: 'Register Consistent Character',
      modalTitleEdit: 'Edit Character',
      formName: 'Character Name',
      formRole: 'Dramatic Role',
      formDescription: 'Visual Prompt Seed / Description',
      formVoiceProvider: 'Voice Provider',
      formVoiceId: 'Voice ID',
      formTraits: 'Continuity Traits (comma separated)',
      roles: {
        protagonist: 'Protagonist',
        antagonist: 'Antagonist',
        supporting: 'Supporting Character',
        narrator: 'Voice Narrator',
        cameo: 'Cameo',
      },
    },
    assets: {
      title: 'Asset Library',
      subtitle: 'Studio-wide storage for visual renders, character concept sheets, scripts, and audio master tracks.',
      btnUpload: 'Upload New Asset',
      noAssetsTitle: 'No assets found',
      noAssetsDesc: 'Upload media assets or generate scenes inside your project workspaces.',
      filterAll: 'All Media',
      filterImages: 'Images',
      filterVideos: 'Videos',
      filterVoices: 'Voices',
      filterAudio: 'Audio & Music',
      filterScripts: 'Scripts & Docs',
      inspectorTitle: 'Asset Metadata Inspector',
    },
    models: {
      title: 'AI Model & Provider Registry',
      subtitle: 'Configure multi-provider routing policies, model priorities, and fallback chains.',
      architectureNoticeTitle: 'Important Architecture Notice (Phase 1.1)',
      architectureNoticeDesc:
        'This registry represents the future multi-provider orchestration architecture of Moro AI. In Phase 1.1, ZERO external media providers are connected (all are marked "Not connected"). No real external API calls will be made.',
      notConnectedBadge: 'Not connected (Architecture Slot)',
      reloadRegistry: 'Reload Registry',
      filterAll: 'All Modalities',
      filterVideo: 'Video',
      filterImage: 'Image',
      filterVoice: 'Voice',
      filterText: 'Text',
      filterMusic: 'Music',
      filterTranslation: 'Translation',
      filterProofreading: 'Proofreading',
      colProviderModel: 'Provider / Model',
      colType: 'Type',
      colConnectionStatus: 'Connection Status',
      colCapabilities: 'Capabilities',
      colPriority: 'Priority',
      colFallback: 'Fallback',
      colQualitySpeed: 'Quality / Speed',
      colUnitCost: 'Unit Cost',
      colState: 'State',
      simulationTitle: 'Moro AI Router Decision Bench',
      simulationDesc: 'Simulate how the router evaluates quality, speed, cost, and automated fallback priority.',
      btnTestRouter: 'Simulate Router Decision',
    },
    settings: {
      title: 'Studio Configuration',
      subtitle: 'Global orchestration parameters, provider routing policies, and operating safeguards.',
      btnSave: 'Save Preferences',
      routingSectionTitle: 'AI Router Optimization Strategy',
      routingPolicyLabel: 'Default Routing Policy',
      autoFallbackLabel: 'Automatic Provider Fallback',
      autoFallbackDesc: 'Automatically cascade to secondary provider on API timeout or error.',
      canvasSectionTitle: 'Canvas & Delivery Defaults',
      resolutionLabel: 'Default Master Resolution',
      aspectRatioLabel: 'Default Frame Aspect Ratio',
      bitrateLabel: 'Export Video Bitrate (Mbps)',
      credentialsSectionTitle: 'Provider API Credentials (Secure Proxy Architecture)',
      credentialsNotice:
        'API keys are never exposed in client bundles. Calls route through encrypted backend proxies or environment injection.',
      serverSideProxyActive: 'Server-Side Proxy Architecture Active',
      budgetSectionTitle: 'Operating Budget Safeguards',
      maxCostLabel: 'Max Cost Alert Limit Per Project (USD)',
      maxCostDesc: 'Triggers studio director warning if project render cost exceeds threshold.',
    },
    workspace: {
      returnToProjects: 'Return to Projects Catalog',
      advanceStage: 'Next Pipeline Stage',
      processingStage: 'Processing Stage...',
      pipelineBannerTitle: '12-Stage Creative Pipeline State:',
      stageInference: 'Stage Inference:',
      tabs: {
        scenes: 'Scenes (3-Option)',
        timeline: 'Video Timeline',
        script: 'Screenplay',
        characters: 'Characters',
        assets: 'Project Assets',
        generations: 'AI Generations',
        exports: 'Master Exports',
      },
      script: {
        draftTitle: 'Screenplay Master Draft',
        btnSaveScript: 'Save Script',
        autoParseNotice: 'Screenplay automatically parses into scene cuts and dialogue nodes for AI routing.',
      },
      scenes: {
        title: 'Shot & Scene Sequencing',
        btnAddScene: 'Add Scene',
        optionActive: 'Active Option',
        threeOptionDescription:
          'Three-Option Candidate Engine: Review 3 parallel variations and swap rejected shots without restarting the project.',
        replaceVisual: 'Replace rejected visual with 3 new variations',
        modalAddTitle: 'Add Scene Node',
        formSceneTitle: 'Scene Title',
        formVisualDirection: 'Scene Visual Direction & Camera Movement',
      },
      timeline: {
        monitorSettings: 'Program Monitor Settings',
        playbackFps: 'Playback rate: 24.000 fps · 3840x2160 Master',
        subtitlesPreview: 'Subtitle Burn-In Preview',
        transitionLabel: 'Scene Cut Transition',
        play: 'Play',
        pause: 'Pause',
        jumpStart: 'Jump to Start',
        jumpEnd: 'Jump to End',
      },
      generations: {
        title: 'Pipeline Generation Logs',
        btnRefresh: 'Refresh History',
        routedProvider: 'Routed Provider & Model',
        promptSeed: 'Prompt / Directing Seed',
        candidatesGenerated: 'Generated Parallel Candidates (Three-Option Architecture)',
      },
      exports: {
        title: 'Master Export Engine & Multilingual Delivery',
        renderProfile: 'Master Render Profile',
        multilingualSubtitles: 'Multilingual Subtitles',
        subtitlesDesc: 'Embed English and Arabic subtitle streams with frame-accurate timing.',
        burnedIn: 'Burned-in',
        softSelectable: 'Soft / Selectable',
        audioStems: 'Separate Audio Stems',
        audioStemsDesc: 'Package isolated WAV stems for Dialogue (A1), Score (A2), and Foley (A3).',
        btnRenderMaster: 'Render Final Master',
        rendering: 'Rendering Master...',
        completedDeliverables: 'Completed Master Deliverables',
        btnDownload: 'Download',
      },
    },
  },
};
