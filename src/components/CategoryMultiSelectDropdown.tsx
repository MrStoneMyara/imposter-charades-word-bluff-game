import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import { CATEGORY_KEYS, LanguageData } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';

interface CategoryMultiSelectDropdownProps {
  selectedCategories: string[];
  onChange: (cats: string[]) => void;
  lang: LanguageData;
  isDark: boolean;
  soundEnabled: boolean;
}

export const CategoryMultiSelectDropdown: React.FC<CategoryMultiSelectDropdownProps> = ({
  selectedCategories,
  onChange,
  lang,
  isDark,
  soundEnabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allSelected = selectedCategories.length === CATEGORY_KEYS.length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleAll = () => {
    if (allSelected) {
      // Keep at least one selected
      onChange([CATEGORY_KEYS[0]]);
    } else {
      onChange([...CATEGORY_KEYS]);
    }
    if (soundEnabled) playSound('tap');
  };

  const handleToggleCategory = (catKey: string) => {
    if (selectedCategories.includes(catKey)) {
      if (selectedCategories.length <= 1) return; // Keep at least one
      onChange(selectedCategories.filter((c) => c !== catKey));
    } else {
      onChange([...selectedCategories, catKey]);
    }
    if (soundEnabled) playSound('tap');
  };

  // Button title summary
  const getButtonSummary = () => {
    if (allSelected) {
      return `${lang.strings.allCategories} (${CATEGORY_KEYS.length})`;
    }
    if (selectedCategories.length === 1) {
      const singleKey = selectedCategories[0];
      return `${lang.categoryIcons[singleKey]} ${lang.categories[singleKey] || singleKey}`;
    }
    return `${selectedCategories.length} ${lang.strings.selectedCount}`;
  };

  return (
    <div
      className={`relative w-full ${lang.dir === 'rtl' ? 'text-right' : 'text-left'}`}
      ref={containerRef}
      dir={lang.dir}
    >
      {/* Header Label */}
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold uppercase tracking-wider block text-slate-700 dark:text-slate-300">
          {lang.strings.chooseCategory}
        </label>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          {selectedCategories.length} {lang.strings.selectedCount}
        </span>
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all cursor-pointer shadow-xs bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="text-base">🎲</span>
          <span className="font-bold text-sm truncate">{getButtonSummary()}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl border shadow-xl p-2 z-40 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
          {/* Top Row: All Categories (Automatically selected by default) */}
          <div className="pb-1 mb-1 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleToggleAll}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                allSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🎲</span>
                <span>{lang.strings.allCategories}</span>
              </div>

              {/* Styled Checkbox */}
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                  allSelected
                    ? 'bg-slate-900 dark:bg-emerald-500 border-slate-900 dark:border-emerald-500 text-white'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                {allSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          </div>

          {/* Individual Categories with Checkboxes */}
          <div className="space-y-0.5">
            {CATEGORY_KEYS.map((catKey) => {
              const isChecked = selectedCategories.includes(catKey);
              const emoji = lang.categoryIcons[catKey] || '🏷️';
              const label = lang.categories[catKey] || catKey;

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => handleToggleCategory(catKey)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                    isChecked
                      ? 'bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{emoji}</span>
                    <span>{label}</span>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-slate-900 dark:bg-emerald-500 border-slate-900 dark:border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
