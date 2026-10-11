import React from 'react';
import { Lightbulb, Plus, Minus, Users } from 'lucide-react';
import { LanguageData } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';

export type ClueDifficulty = 'easy' | 'medium' | 'hard';

interface GameOptionsCardProps {
  playerCount: number;
  imposterCount: number;
  onChangeImposterCount: (count: number) => void;
  enableClues: boolean;
  onToggleEnableClues: (val: boolean) => void;
  clueDifficulty: ClueDifficulty;
  onChangeDifficulty: (diff: ClueDifficulty) => void;
  giveHardClueIfFirst: boolean;
  onToggleHardClueIfFirst: (val: boolean) => void;
  lang: LanguageData;
  isDark: boolean;
  soundEnabled: boolean;
}

export const GameOptionsCard: React.FC<GameOptionsCardProps> = ({
  playerCount,
  imposterCount,
  onChangeImposterCount,
  enableClues,
  onToggleEnableClues,
  clueDifficulty,
  onChangeDifficulty,
  giveHardClueIfFirst,
  onToggleHardClueIfFirst,
  lang,
  isDark,
  soundEnabled,
}) => {
  // Logic: imposters must NEVER become a majority out of all current players
  // Max imposters = Math.max(1, Math.floor((playerCount - 1) / 2))
  const maxImposters = Math.max(1, Math.floor((playerCount - 1) / 2));
  const canDecrease = imposterCount > 1;
  const canIncrease = imposterCount < maxImposters;

  const handleDecrease = () => {
    if (!canDecrease) return;
    onChangeImposterCount(Math.max(1, imposterCount - 1));
    if (soundEnabled) playSound('tap');
  };

  const handleIncrease = () => {
    if (!canIncrease) return;
    onChangeImposterCount(Math.min(maxImposters, imposterCount + 1));
    if (soundEnabled) playSound('tap');
  };

  // Helper text
  const ruleText = lang.strings.imposterMajorityRule
    .replace('{players}', String(playerCount))
    .replace('{max}', String(maxImposters));

  const isRtl = lang.dir === 'rtl';

  return (
    <div className="space-y-3 w-full" dir={lang.dir}>
      {/* 1. Number of Imposters Card */}
      <div className="p-4 rounded-3xl border shadow-xs transition-colors bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800">
        {/* Header Row: Title, majority rule subtitle, and icon in proper reading direction */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className={`${isRtl ? 'text-right' : 'text-left'} min-w-0`}>
              <span className="font-bold text-xs block text-slate-900 dark:text-slate-100">
                {lang.strings.howManyImposters}
              </span>
              <span className="text-[11px] text-slate-500 block leading-tight">
                {ruleText}
              </span>
            </div>
          </div>
        </div>

        {/* Stepper container: h-10 inside h-[52px] container matching clues card layout */}
        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 h-[52px] flex items-center justify-center">
          <div className="h-10 flex items-center justify-center gap-6" dir="ltr">
            {/* Minus Button */}
            <button
              type="button"
              disabled={!canDecrease}
              onClick={handleDecrease}
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer ${
                canDecrease
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white active:scale-95 border border-slate-300 dark:border-slate-700 shadow-xs'
                  : 'opacity-25 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border border-transparent'
              }`}
              title="Decrease imposters"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Number in the Center */}
            <div className="w-10 text-center select-none">
              <span className="text-2xl font-black text-rose-500 font-mono tracking-tight block">
                {imposterCount}
              </span>
            </div>

            {/* Plus Button */}
            <button
              type="button"
              disabled={!canIncrease}
              onClick={handleIncrease}
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer ${
                canIncrease
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white active:scale-95 border border-slate-300 dark:border-slate-700 shadow-xs'
                  : 'opacity-25 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border border-transparent'
              }`}
              title="Increase imposters"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Clues Settings Card - Obvious fill toggle color & harmonious light mode fill */}
      <div className="p-4 rounded-3xl border shadow-xs transition-colors bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800">
        {/* Main Enable Clues Toggle: Title on start side, Toggle on end side */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className={`${isRtl ? 'text-right' : 'text-left'} min-w-0`}>
              <span className="font-bold text-xs block text-slate-900 dark:text-slate-100">
                {lang.strings.enableClues}
              </span>
              <span className="text-[11px] text-slate-500 block leading-tight">
                {lang.strings.enableCluesDesc}
              </span>
            </div>
          </div>

          {/* Toggle Switch with obvious fill color and smooth knob transition in LTR and RTL */}
          <button
            type="button"
            role="switch"
            aria-checked={enableClues}
            dir={isRtl ? 'rtl' : 'ltr'}
            onClick={() => {
              onToggleEnableClues(!enableClues);
              if (soundEnabled) playSound('tap');
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out border-2 focus:outline-none ${
              enableClues
                ? 'bg-emerald-500 border-emerald-500'
                : 'bg-slate-300 border-slate-300 dark:bg-slate-700 dark:border-slate-600'
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isRtl
                  ? enableClues ? '-translate-x-5' : 'translate-x-0'
                  : enableClues ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sub-Options Container: Harmonious light/dark mode fill and balanced contrast */}
        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 h-[52px] flex flex-col justify-center">
          {enableClues ? (
            /* IF CLUES ARE ENABLED: Soft gray track, white raised card active pill, legible inactive options */
            <div className="h-10 grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200/60 dark:border-slate-700 items-center">
              <button
                type="button"
                onClick={() => {
                  onChangeDifficulty('easy');
                  if (soundEnabled) playSound('tap');
                }}
                className={`h-full px-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  clueDifficulty === 'easy'
                    ? 'bg-white text-slate-900 font-semibold shadow-sm border border-slate-200/50 dark:bg-slate-900 dark:text-white dark:border-slate-700'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0 ${
                    clueDifficulty === 'easy' ? 'opacity-100' : 'opacity-40'
                  }`}
                />
                <span>{lang.strings.easy}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onChangeDifficulty('medium');
                  if (soundEnabled) playSound('tap');
                }}
                className={`h-full px-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  clueDifficulty === 'medium'
                    ? 'bg-white text-slate-900 font-semibold shadow-sm border border-slate-200/50 dark:bg-slate-900 dark:text-white dark:border-slate-700'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 shrink-0 ${
                    clueDifficulty === 'medium' ? 'opacity-100' : 'opacity-40'
                  }`}
                />
                <span>{lang.strings.medium}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onChangeDifficulty('hard');
                  if (soundEnabled) playSound('tap');
                }}
                className={`h-full px-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  clueDifficulty === 'hard'
                    ? 'bg-white text-slate-900 font-semibold shadow-sm border border-slate-200/50 dark:bg-slate-900 dark:text-white dark:border-slate-700'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 shrink-0 ${
                    clueDifficulty === 'hard' ? 'opacity-100' : 'opacity-40'
                  }`}
                />
                <span>{lang.strings.hard}</span>
              </button>
            </div>
          ) : (
            /* IF CLUES ARE DISABLED: Light mode bg-slate-50 border border-slate-200/80 */
            <label className="h-10 flex items-center gap-2.5 px-3 bg-slate-50 border border-slate-200/80 dark:bg-slate-800/90 dark:border-slate-700 rounded-2xl cursor-pointer select-none">
              <input
                type="checkbox"
                checked={giveHardClueIfFirst}
                onChange={(e) => {
                  onToggleHardClueIfFirst(e.target.checked);
                  if (soundEnabled) playSound('tap');
                }}
                className="rounded border-slate-300 dark:border-slate-600 text-emerald-500 focus:ring-emerald-400 w-4 h-4 cursor-pointer shrink-0"
              />
              <div className={`${isRtl ? 'text-right' : 'text-left'} min-w-0 flex-1`}>
                <span className="text-xs font-medium text-slate-900 dark:text-slate-100 block truncate leading-tight">
                  {lang.strings.giveHardClueIfFirst}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 block truncate leading-tight mt-0.5">
                  {lang.strings.giveHardClueIfFirstDesc}
                </span>
              </div>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
