import React, { useState } from 'react';
import { Globe, Volume2, VolumeX, HelpCircle, ChevronDown } from 'lucide-react';
import { LANGUAGES, LanguageData } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';

interface HeaderProps {
  currentLang: string;
  onSelectLang: (langCode: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onSelectLang,
  soundEnabled,
  onToggleSound,
  onOpenRules,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const activeLang: LanguageData = LANGUAGES[currentLang] || LANGUAGES.en;

  const handleLangPick = (code: string) => {
    onSelectLang(code);
    setDropdownOpen(false);
    if (soundEnabled) playSound('tap');
  };

  return (
    <header className="relative w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 py-3 z-30">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🕵️</span>
          <span className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
            {activeLang.strings.appTitle}
          </span>
        </div>

        {/* Actions Zone: Language & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Select Language"
            >
              <span className="text-sm">{activeLang.flag}</span>
              <span className="hidden sm:inline">{activeLang.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 max-h-72 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50">
                  {Object.values(LANGUAGES).map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleLangPick(item.code)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left rounded-lg transition-colors cursor-pointer ${
                        item.code === currentLang
                          ? 'bg-rose-500/20 text-rose-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-base">{item.flag}</span>
                      <span className="flex-1 truncate">{item.name}</span>
                      <span className="text-[10px] text-slate-500">{item.nativeName}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Rules Button */}
          <button
            type="button"
            onClick={onOpenRules}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="How to play"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Rules</span>
          </button>
        </div>
      </div>
    </header>
  );
};
