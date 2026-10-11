import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { LANGUAGES, LanguageData } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';

interface LanguageDropdownProps {
  currentLangCode: string;
  onSelectLang: (code: string) => void;
  soundEnabled: boolean;
  isDark: boolean;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  currentLangCode,
  onSelectLang,
  soundEnabled,
  isDark,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLang: LanguageData = LANGUAGES[currentLangCode] || LANGUAGES.en;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    onSelectLang(code);
    setIsOpen(false);
    if (soundEnabled) playSound('tap');
  };

  const isRtl = activeLang.dir === 'rtl';

  return (
    <div className={`relative inline-block ${isRtl ? 'text-right' : 'text-left'}`} ref={containerRef}>
      {/* Trigger Button - Matching Screenshot 1 & 2 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <span className="text-base leading-none">{activeLang.flag}</span>
        <span className="font-semibold text-xs">{activeLang.menuLabel}</span>
        <ChevronRight className={`w-3.5 h-3.5 text-slate-400 stroke-[2.5] ${isRtl ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Popover Menu - Matching Screenshot 2 */}
      {isOpen && (
        <div
          className={`absolute ${isRtl ? 'right-0 sm:left-0 sm:right-auto' : 'left-0 sm:right-0 sm:left-auto'} mt-2 w-52 rounded-2xl border shadow-xl p-1.5 z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100`}
        >
          {Object.values(LANGUAGES).map((item) => {
            const isSelected = item.code === currentLangCode;

            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelect(item.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{item.flag}</span>
                  <span>{item.name}</span>
                </div>

                {/* Blue dot indicator for selected item (Matching Screenshot 2) */}
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
