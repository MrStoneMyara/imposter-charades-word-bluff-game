import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, ShieldAlert, ArrowRight, MessageSquare, Volume2, Sparkles, UserCheck } from 'lucide-react';
import { LanguageData } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';

interface ActiveGameCardProps {
  isImposter: boolean;
  category: string;
  word: string;
  firstSpeakerName: string;
  players: any[];
  lang: LanguageData;
  onProceedToVote: () => void;
  soundEnabled: boolean;
  roundNumber: number;
  isHost?: boolean;
}

export const ActiveGameCard: React.FC<ActiveGameCardProps> = ({
  isImposter,
  category,
  word,
  firstSpeakerName,
  players,
  lang,
  onProceedToVote,
  soundEnabled,
  roundNumber,
  isHost = true,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handlePointerDown = () => {
    setIsRevealed(true);
    if (soundEnabled) playSound('reveal');
  };

  const handlePointerUp = () => {
    setIsRevealed(false);
    if (soundEnabled) playSound('hide');
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Top Banner: First to Speak & Round Number */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
            🗣️
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {lang.strings.firstSpeaker}
            </span>
            <span className="text-sm font-bold text-white">
              {firstSpeakerName}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-medium text-slate-400 block">
            {lang.strings.round} #{roundNumber}
          </span>
          <span className="text-xs font-semibold text-rose-400">
            {players.length} Players
          </span>
        </div>
      </div>

      {/* Secret Card Peek Box */}
      <div className="relative group">
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            if (isRevealed) {
              setIsRevealed(false);
              if (soundEnabled) playSound('hide');
            }
          }}
          className={`w-full min-h-[280px] p-6 rounded-3xl border-2 transition-all duration-200 select-none flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl ${
            isRevealed
              ? isImposter
                ? 'bg-gradient-to-b from-rose-950/80 via-slate-900 to-slate-950 border-rose-500 shadow-rose-900/30'
                : 'bg-gradient-to-b from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500 shadow-emerald-900/30'
              : 'bg-slate-900/95 border-slate-700/80 hover:border-slate-600 active:scale-[0.99]'
          }`}
        >
          {isRevealed ? (
            <div className="space-y-4 animate-in zoom-in-95 duration-150">
              {isImposter ? (
                <>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-black tracking-widest uppercase">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{lang.strings.imposter}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-medium">
                      {lang.strings.category}: <span className="text-white font-bold">{category}</span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-rose-400 tracking-tight">
                      {lang.strings.unknownWord}
                    </div>
                  </div>

                  <p className="max-w-xs text-xs text-slate-300 leading-relaxed font-medium bg-slate-950/60 p-3 rounded-xl border border-rose-900/40">
                    {lang.strings.imposterInstructions}
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black tracking-widest uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang.strings.innocent}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-medium">
                      {lang.strings.category}: <span className="text-white font-bold">{category}</span>
                    </div>
                    <div className="text-4xl sm:text-5xl font-black text-emerald-300 tracking-tight drop-shadow-md">
                      {word}
                    </div>
                  </div>

                  <p className="max-w-xs text-xs text-slate-300 leading-relaxed font-medium bg-slate-950/60 p-3 rounded-xl border border-emerald-900/40">
                    {lang.strings.innocentInstructions}
                  </p>
                </>
              )}
              <span className="text-[11px] text-slate-500 block pt-1">
                {lang.strings.tapToHide}
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-rose-400 shadow-inner">
                <Eye className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  {lang.strings.yourRole}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {lang.strings.holdToReveal}
                </p>
              </div>
              <div className="inline-block px-3 py-1 bg-slate-800 text-[11px] font-semibold text-slate-300 rounded-lg">
                🔒 Privacy Protected
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Turn Order Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <MessageSquare className="w-4 h-4 text-rose-400" />
          <span>Speaking Circle</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {lang.strings.turnNotice}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {players.map((p, idx) => {
            const isFirst = p.name === firstSpeakerName;
            return (
              <span
                key={p.id}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                  isFirst
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                }`}
              >
                {idx + 1}. {p.name} {isFirst && '⭐'}
              </span>
            );
          })}
        </div>
      </div>

      {/* Proceed to Voting Button */}
      <div>
        {isHost ? (
          <button
            type="button"
            onClick={onProceedToVote}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white shadow-xl shadow-rose-900/30 transition-all cursor-pointer"
          >
            <span>{lang.strings.readyToVote}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-center text-xs text-slate-400 font-medium">
            {lang.strings.waitingForHost}
          </div>
        )}
      </div>
    </div>
  );
};
