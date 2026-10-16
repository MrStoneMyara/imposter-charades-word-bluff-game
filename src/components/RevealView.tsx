import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Sparkles, CheckCircle2, XCircle, ArrowRight, Eye, ShieldAlert, FastForward } from 'lucide-react';
import { LanguageData } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';
import { fireConfetti } from '../utils/confetti.ts';

interface RevealViewProps {
  lobby: any;
  currentPlayerId: string;
  lang: LanguageData;
  onNextRound: () => void;
  soundEnabled: boolean;
  isHost: boolean;
  isDark?: boolean;
  dir?: 'ltr' | 'rtl';
}

export const RevealView: React.FC<RevealViewProps> = ({
  lobby,
  currentPlayerId,
  lang,
  onNextRound,
  soundEnabled,
  isHost,
  isDark = true,
  dir = 'ltr',
}) => {
  // Whimsical 2-second suspense countdown before reveal
  const [isRevealed, setIsRevealed] = useState(false);
  const [countdownPercent, setCountdownPercent] = useState(0);

  const imposterPlayers = lobby.players.filter((p: any) =>
    (lobby.imposterIds || []).includes(p.id)
  );
  const imposterNames = imposterPlayers.map((p: any) => p.name).join(', ') || 'The Imposter';
  const accusedPlayer = lobby.players.find((p: any) => p.id === lobby.accusedPlayerId);
  const innocentsWon = lobby.winner === 'INNOCENTS';
  const imposterWon = lobby.winner === 'IMPOSTERS';

  // 2-Second Whimsical Suspense Sequence
  useEffect(() => {
    let tickCount = 0;
    const intervalTime = 50; // 50ms intervals
    const totalDuration = 2000; // 2 seconds
    const totalTicks = totalDuration / intervalTime;

    const timer = setInterval(() => {
      tickCount++;
      const percent = Math.min(100, Math.round((tickCount / totalTicks) * 100));
      setCountdownPercent(percent);

      // Play audio ticks periodically
      if (soundEnabled && (tickCount === 8 || tickCount === 18 || tickCount === 28)) {
        playSound('tick');
      }

      if (tickCount >= totalTicks) {
        clearInterval(timer);
        setIsRevealed(true);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [soundEnabled]);

  // When revealed, trigger sound & confetti if imposter wins!
  useEffect(() => {
    if (!isRevealed) return;

    if (soundEnabled) {
      playSound(innocentsWon ? 'victory' : 'victory');
    }

    // "add confetti when imposter wins"
    if (imposterWon) {
      fireConfetti({ count: 180, duration: 4000 });
      // Double burst cannon for extra whimsy
      setTimeout(() => {
        fireConfetti({ count: 100, duration: 3000 });
      }, 400);
    }
  }, [isRevealed, imposterWon, innocentsWon, soundEnabled]);

  const handleSkipSuspense = () => {
    setIsRevealed(true);
  };

  // SUSPENSE PHASE (Takes 2 seconds)
  if (!isRevealed) {
    return (
      <div
        className="w-full max-w-xl mx-auto space-y-5 animate-in fade-in duration-200"
        dir={dir}
      >
        <div
          className={`border-2 rounded-3xl p-7 sm:p-9 text-center space-y-5 shadow-2xl relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-rose-500/40 shadow-rose-950/30'
              : 'bg-gradient-to-b from-white via-rose-50/40 to-slate-50 border-rose-300 shadow-rose-100'
          }`}
        >
          {/* Animated mystery aura */}
          <div className="w-20 h-20 rounded-3xl bg-rose-500/15 border-2 border-rose-500/30 flex items-center justify-center mx-auto text-4xl shadow-xl shadow-rose-500/20 animate-bounce">
            🕵️‍♂️
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-rose-500/20 text-rose-500 border border-rose-500/30">
              {dir === 'rtl' ? 'כל הקולות ננעלו! 🗳️' : 'All Votes Are Locked In! 🗳️'}
            </span>
            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {dir === 'rtl' ? 'מחשב תוצאות...' : 'Tallying the Verdict...'}
            </h2>
            <p className={`text-xs max-w-xs mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {dir === 'rtl'
                ? 'מי הצליח לבלף ומי נתפס על חם? רגע האמת הגיע!'
                : 'Who bluffed their way through and who got caught? Unmasking now!'}
            </p>
          </div>

          {/* 2-second Progress Bar */}
          <div className="space-y-2 pt-2 max-w-xs mx-auto">
            <div
              className={`w-full h-3 rounded-full overflow-hidden ${
                isDark ? 'bg-slate-950 border border-slate-800' : 'bg-slate-200'
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-400 transition-all duration-75 rounded-full"
                style={{ width: `${countdownPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
              <span>{dir === 'rtl' ? 'חושף...' : 'Revealing...'}</span>
              <span>{Math.round((2000 - (countdownPercent / 100) * 2000) / 1000 * 10) / 10}s</span>
            </div>
          </div>

          {/* Quick Skip Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSkipSuspense}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>{dir === 'rtl' ? 'דלג לחשיפה' : 'Reveal Now'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REVEALED PHASE
  return (
    <div
      className="w-full max-w-xl mx-auto space-y-5 animate-in zoom-in-95 duration-300 pb-12"
      dir={dir}
    >
      {/* Victory Announcement Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-7 text-center space-y-4 border-2 shadow-2xl transition-all ${
          innocentsWon
            ? isDark
              ? 'bg-gradient-to-b from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-500/60 shadow-emerald-950/40'
              : 'bg-gradient-to-b from-emerald-50 via-white to-slate-50 border-emerald-400 shadow-emerald-100'
            : isDark
            ? 'bg-gradient-to-b from-rose-950/70 via-slate-900 to-slate-950 border-rose-500/60 shadow-rose-950/40'
            : 'bg-gradient-to-b from-rose-50 via-white to-slate-50 border-rose-400 shadow-rose-100'
        }`}
      >
        <div className="text-6xl animate-bounce">
          {innocentsWon ? '🎉' : '😈'}
        </div>

        <div className="space-y-1.5">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
              innocentsWon
                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
            }`}
          >
            {innocentsWon
              ? dir === 'rtl' ? 'ניצחון לאזרחים!' : 'Citizens Win!'
              : dir === 'rtl' ? 'ניצחון למתחזה!' : 'Imposters Win!'}
          </span>

          <h2
            className={`text-3xl sm:text-4xl font-black tracking-tight ${
              innocentsWon ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {innocentsWon ? lang.strings.innocentsWin : lang.strings.impostersWin}
          </h2>

          <p className={`text-xs sm:text-sm max-w-sm mx-auto font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {innocentsWon
              ? accusedPlayer
                ? dir === 'rtl'
                  ? `${accusedPlayer.name} נחשף כמתחזה ונתפס על חם!`
                  : `${accusedPlayer.name} was caught red-handed as the imposter!`
                : lang.strings.imposterCaught
              : accusedPlayer && !imposterPlayers.some((imp: any) => imp.id === accusedPlayer.id)
              ? dir === 'rtl'
                ? `האשמתם את ${accusedPlayer.name}, אבל המתחזה האמיתי הצליח לחמוק!`
                : `You accused ${accusedPlayer.name}, but the real imposter escaped undetected!`
              : dir === 'rtl'
              ? 'המתחזה הצליח להטעות את כולם ולנצח בסיבוב!'
              : 'The imposter bluffed successfully and stole the round!'}
          </p>
        </div>

        {/* Word Reveal Card */}
        <div
          className={`border rounded-2xl p-4 sm:p-5 space-y-1 shadow-inner ${
            isDark
              ? 'bg-slate-950/80 border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang.strings.secretWord} {lobby.secretCategory && `(${lobby.secretCategory})`}
          </span>
          <span className={`text-3xl sm:text-4xl font-black block tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lobby.secretWord}
          </span>
        </div>

        {/* Who was the Imposter */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium">
            {dir === 'rtl' ? 'המתחזה היה:' : 'The Imposter was:'}
          </span>
          {imposterPlayers.map((imp: any) => (
            <span
              key={imp.id}
              className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-xl font-bold flex items-center gap-1 shadow-xs"
            >
              <span>🎭</span>
              <span>{imp.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Votes Breakdown Card */}
      <div
        className={`border rounded-3xl p-5 shadow-xl space-y-3 ${
          isDark
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white border-slate-200 shadow-slate-100'
        }`}
      >
        <div className="flex items-center justify-between font-bold text-sm">
          <span className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Eye className="w-4 h-4 text-rose-500" />
            <span>{dir === 'rtl' ? 'פירוט ההצבעות' : 'Votes Breakdown'}</span>
          </span>
          <span className="text-xs text-slate-400 font-normal">
            {lobby.players.length} {dir === 'rtl' ? 'קולות' : 'votes'}
          </span>
        </div>

        <div className="space-y-2">
          {lobby.players.map((voter: any) => {
            const votedFor = lobby.players.find((p: any) => p.id === voter.votedForId);
            const isVoterImposter = (lobby.imposterIds || []).includes(voter.id);
            const isSuspectImposter = votedFor && (lobby.imposterIds || []).includes(votedFor.id);

            return (
              <div
                key={voter.id}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold ${
                  isDark
                    ? 'bg-slate-950/60 border-slate-800/80 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{voter.name}</span>
                  {isVoterImposter && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                      Imposter
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span>➔</span>
                  {votedFor ? (
                    <span
                      className={`font-bold px-2 py-0.5 rounded-lg ${
                        isSuspectImposter
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {votedFor.name}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">No vote</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Scoreboard */}
      <div
        className={`border rounded-3xl p-5 shadow-xl space-y-3 ${
          isDark
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white border-slate-200 shadow-slate-100'
        }`}
      >
        <div className={`flex items-center gap-2 font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{dir === 'rtl' ? 'טבלת מובילים' : 'Leaderboard'}</span>
        </div>

        <div className="space-y-2">
          {lobby.players
            .slice()
            .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
            .map((player: any, index: number) => {
              const isImp = (lobby.imposterIds || []).includes(player.id);
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm ${
                    isDark
                      ? 'bg-slate-950/50 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-xs font-mono font-bold text-slate-400">
                      #{index + 1}
                    </span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {player.name}
                    </span>
                    {isImp && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded font-bold">
                        Imposter
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-amber-500">
                    {player.score || 0} pts
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Next Round CTA */}
      <div className="pt-2">
        {isHost ? (
          <button
            type="button"
            onClick={onNextRound}
            className="w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white shadow-xl shadow-rose-900/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{lang.strings.nextRound}</span>
          </button>
        ) : (
          <div
            className={`p-4 rounded-2xl border text-center space-y-1 ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <span className="text-xs font-medium">
              {dir === 'rtl' ? 'ממתין למארח שיתחיל את הסיבוב הבא...' : 'Waiting for host to begin the next round...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
