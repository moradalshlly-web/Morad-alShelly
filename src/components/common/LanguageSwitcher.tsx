/**
 * Language Switcher Component
 * Quick bilingual toggle between Arabic (العربية - RTL) and English (LTR).
 */

import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'header' | 'compact' | 'settings';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'header' }) => {
  const { language, setLanguage, isRtl } = useLanguage();

  if (variant === 'settings') {
    return (
      <div className="flex items-center gap-2 p-1 bg-[#090b0e] border border-slate-800 rounded-lg">
        <button
          type="button"
          onClick={() => setLanguage('ar')}
          className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            language === 'ar'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          العربية (RTL)
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          English (LTR)
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800/80 rounded-md">
      <Globe className="w-3.5 h-3.5 text-slate-400 mx-1 shrink-0" />
      <button
        type="button"
        onClick={() => setLanguage('ar')}
        className={`px-2 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
          language === 'ar'
            ? 'bg-amber-400 text-slate-950 shadow-xs'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="التبديل إلى الواجهة العربية"
      >
        عربي
      </button>
      <span className="text-slate-700 text-xs select-none">|</span>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
          language === 'en'
            ? 'bg-amber-400 text-slate-950 shadow-xs'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Switch to English interface"
      >
        EN
      </button>
    </div>
  );
};
