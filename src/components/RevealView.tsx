import React, { useState } from 'react';
import { Trophy, ShieldAlert, ShieldCheck, Sparkles, RotateCcw, HelpCircle, ArrowRight, Check, X } from 'lucide-react';
import { LanguageData } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';

interface RevealViewProps {
  lobby: any;
  currentPlayerId: string;
  lang: LanguageData;
  onSubmitGuess: (word: string) => void;
  onSkipGuess: () => void;
  onNextRound: () => void;
  soundEnabled: boolean;
  isHost: boolean;
}

export const RevealView: React.FC<RevealViewProps> = ({
  lobby,
  currentPlayerId,
  lang,
  onSubmitGuess,
  onSkipGuess,
  onNextRound,
  soundEnabled,
  isHost,
}) => {
  const isGuessPhase = lobby.state === 'IMPOSTER_GUESS';
  const isYouImposter = lobby.isYouImposter;
  const accusedPlayer = lobby.players.find((p: any) => p.id === lobby.accusedPlayerId);
  const imposterPlayers = lobby.players.filter((p: any) => lobby.imposterIds.includes(p.id));

  // Local input state for the imposter's guess
  const [guessInput, setGuessInput] = useState('');

  const handleGuessSubmit = () => {
    if (!guessInput.trim()) return;
    onSubmitGuess(guessInput.trim());
    if (soundEnabled) playSound('tap');
  };

  const handleSkip = () => {
    onSkipGuess();
    if (soundEnabled) playSound('tap');
  };

  if (isGuessPhase) {
    return (
      <div className="w-full max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">
              {lang.strings.imposterGuessTitle}
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {lang.strings.imposterGuessSubtitle}
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300">
            Accused Suspect: <span className="font-bold text-rose-400">{accusedPlayer?.name || 'Imposter'}</span>
          </div>

          {isYouImposter ? (
            <div className="space-y-3 pt-2">
              <input
                key="imposter-guess-input"
                type="text"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                placeholder="Type the secret word..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 shadow-inner"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onPointerDown={handleGuessSubmit}
                  disabled={!guessInput.trim()}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm shadow-xl transition-all cursor-pointer ${
                    guessInput.trim()
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-[0.98]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {lang.strings.submitGuess}
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="py-3 px-4 rounded-xl font-semibold text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
                >
                  Give Up
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-950/50 rounded-xl text-xs text-slate-400 animate-pulse">
              Waiting for the imposter to make their guess...
            </div>
          )}
        </div>
      </div>
    );
  }

  // REVEAL PHASE
  const innocentsWon = lobby.winner === 'INNOCENTS';

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Victory Announcement Banner */}
      <div
        className={`rounded-2xl p-6 text-center space-y-3 border-2 shadow-2xl ${
          innocentsWon
            ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500/60 shadow-emerald-950/50'
            : 'bg-gradient-to-b from-rose-950/60 to-slate-900 border-rose-500/60 shadow-rose-950/50'
        }`}
      >
        <div className="text-5xl">
          {innocentsWon ? '🎉' : '😈'}
        </div>

        <div className="space-y-1">
          <h2
            className={`text-3xl font-black tracking-tight ${
              innocentsWon ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {innocentsWon ? lang.strings.innocentsWin : lang.strings.impostersWin}
          </h2>
          <p className="text-xs text-slate-300">
            {lobby.guessCorrect
              ? lang.strings.correctGuess
              : innocentsWon
              ? lang.strings.imposterCaught
              : lang.strings.imposterEscaped}
          </p>
        </div>

        {/* Word Reveal */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1 mt-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang.strings.secretWord} ({lobby.secretCategory})
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {lobby.secretWord}
          </span>
          {lobby.guessedWord && (
            <p className="text-xs text-slate-400 pt-1">
              Imposter Guessed: <span className="font-semibold text-amber-300">"{lobby.guessedWord}"</span>{' '}
              {lobby.guessCorrect ? '✅' : '❌'}
            </p>
          )}
        </div>

        {/* Who was the Imposter */}
        <div className="flex items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-slate-400">The Imposter was:</span>
          {imposterPlayers.map((imp: any) => (
            <span
              key={imp.id}
              className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg font-bold"
            >
              🎭 {imp.name}
            </span>
          ))}
        </div>
      </div>

      {/* Scoreboard */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Leaderboard</span>
        </div>

        <div className="space-y-2">
          {lobby.players
            .slice()
            .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
            .map((player: any, index: number) => {
              const isImp = lobby.imposterIds.includes(player.id);
              return (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-xs font-mono font-bold text-slate-500">
                      #{index + 1}
                    </span>
                    <span className="font-semibold text-sm text-white">
                      {player.name}
                    </span>
                    {isImp && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded">
                        Imposter
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-sm text-amber-400">
                    {player.score} pts
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Next Round CTA */}
      <div>
        {isHost ? (
          <button
            type="button"
            onClick={onNextRound}
            className="w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white shadow-xl shadow-rose-900/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{lang.strings.nextRound}</span>
          </button>
        ) : (
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-center space-y-1">
            <span className="text-xs text-slate-400">
              Waiting for host to begin the next round...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
