import React, { useState } from 'react';
import { Target, CheckCircle2, Users, Lock, Clock, Check, Loader2 } from 'lucide-react';
import { LanguageData } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';
import { haptic } from '../utils/haptics.ts';

interface VotingViewProps {
  players: any[];
  currentPlayerId: string;
  lang: LanguageData;
  onCastVote: (suspectId: string) => Promise<void> | void;
  hasVoted?: boolean;
  selectedSuspectId?: string;
  soundEnabled: boolean;
  isDark?: boolean;
  dir?: 'ltr' | 'rtl';
}

export const VotingView: React.FC<VotingViewProps> = ({
  players,
  currentPlayerId,
  lang,
  onCastVote,
  hasVoted = false,
  selectedSuspectId: initialSuspectId = '',
  soundEnabled,
  isDark = true,
  dir = 'ltr',
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(initialSuspectId);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Derive voting status from players list
  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const playerHasAlreadyVoted = hasVoted || Boolean(currentPlayer?.votedForId);

  const votedPlayers = players.filter((p) => Boolean(p.votedForId));
  const pendingPlayers = players.filter((p) => !p.votedForId);
  const votedCount = votedPlayers.length;
  const totalCount = players.length;
  const progressPercent = totalCount > 0 ? Math.round((votedCount / totalCount) * 100) : 0;

  const selectedSuspect = players.find((p) => p.id === selectedSuspectId);

  const handleSelect = (id: string) => {
    if (playerHasAlreadyVoted || isSubmitting) return;
    setSelectedSuspectId(id);
    if (soundEnabled) playSound('tap');
  };

  const handleVoteSubmit = async () => {
    if (!selectedSuspectId || playerHasAlreadyVoted || isSubmitting) return;

    setIsSubmitting(true);
    if (soundEnabled) playSound('vote');
    haptic('success');

    try {
      await onCastVote(selectedSuspectId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full max-w-xl mx-auto space-y-4 sm:space-y-5 animate-in fade-in duration-200 pb-24 sm:pb-6"
      dir={dir}
    >
      {/* Title & Live Voting Tally Card */}
      <div
        className={`border rounded-3xl p-5 sm:p-6 shadow-xl text-center space-y-3.5 transition-colors ${
          isDark
            ? 'bg-slate-900/95 border-slate-800'
            : 'bg-white border-slate-200 shadow-slate-100'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-500 shadow-xs">
          <Target className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang.strings.votingTitle}
          </h2>
          <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {lang.strings.votingSubtitle}
          </p>
        </div>

        {/* Voting Progress Bar & Count */}
        <div className="pt-1 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold px-1">
            <span className="flex items-center gap-1.5 text-rose-500">
              <Users className="w-3.5 h-3.5" />
              <span>
                {votedCount} / {totalCount} {dir === 'rtl' ? 'הצביעו' : 'voted'}
              </span>
            </span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              {progressPercent}%
            </span>
          </div>

          <div
            className={`w-full h-2.5 rounded-full overflow-hidden ${
              isDark ? 'bg-slate-950' : 'bg-slate-100'
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Who hasn't locked their vote yet */}
        <div
          className={`p-3 rounded-2xl border text-xs text-left ${
            isDark
              ? 'bg-slate-950/70 border-slate-800/80 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
          dir={dir}
        >
          {pendingPlayers.length > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-500">
                <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                <span>
                  {dir === 'rtl' ? 'ממתינים לקולות של:' : 'Waiting on votes from:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {pendingPlayers.map((p) => {
                  const isYou = p.id === currentPlayerId;
                  return (
                    <span
                      key={p.id}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                        isYou
                          ? isDark
                            ? 'bg-amber-950/50 border-amber-700/60 text-amber-300 animate-pulse'
                            : 'bg-amber-100/70 border-amber-300 text-amber-900 animate-pulse'
                          : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-300'
                          : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      {p.name} {isYou && (dir === 'rtl' ? '(אתה)' : '(You)')}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 font-bold text-emerald-500 py-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{dir === 'rtl' ? 'כל הקולות ננעלו! חושף תוצאות...' : 'All votes locked in! Revealing...'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Selectable Suspects Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {playerHasAlreadyVoted
              ? dir === 'rtl' ? 'ההצבעה שלך נעולה' : 'Your vote is locked'
              : dir === 'rtl' ? 'בחר את החשוד שלך:' : 'Select your suspect:'}
          </span>
          {playerHasAlreadyVoted && (
            <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {dir === 'rtl' ? 'נעול' : 'Locked'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {players.map((player) => {
            const isYou = player.id === currentPlayerId;
            const isSelected = selectedSuspectId === player.id;
            const hasThisPlayerVoted = Boolean(player.votedForId);

            return (
              <button
                key={player.id}
                type="button"
                disabled={playerHasAlreadyVoted || isSubmitting}
                onClick={() => handleSelect(player.id)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                  dir === 'rtl' ? 'text-right' : 'text-left'
                } ${
                  isSelected
                    ? isDark
                      ? 'bg-rose-950/70 border-rose-500 ring-2 ring-rose-500/40 shadow-lg shadow-rose-950/40'
                      : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/30 shadow-md shadow-rose-100'
                    : isDark
                    ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                } ${
                  playerHasAlreadyVoted
                    ? 'opacity-85 cursor-default'
                    : 'cursor-pointer active:scale-[0.99]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm uppercase shrink-0 ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-sm'
                        : isDark
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {player.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <span className={`font-bold text-sm block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {player.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isYou ? (dir === 'rtl' ? '(אתה)' : '(You)') : (dir === 'rtl' ? 'חשוד' : 'Suspect')}
                    </span>
                  </div>
                </div>

                {/* Status Indicator Badges on right side */}
                <div className="shrink-0 flex items-center gap-1.5">
                  {isSelected && (
                    <span className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  )}
                  {hasThisPlayerVoted ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{dir === 'rtl' ? 'הצביע' : 'Voted'}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-pulse" />
                      <span>{dir === 'rtl' ? 'שוקל...' : 'Deciding'}</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating / Sticky Mobile Lock In Action Bar */}
      <div className="fixed sm:static bottom-0 inset-x-0 p-4 sm:p-0 bg-slate-950/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t sm:border-0 border-slate-800/80 z-30 transition-all">
        <div className="max-w-xl mx-auto">
          {playerHasAlreadyVoted ? (
            <div
              className={`p-3.5 sm:p-4 rounded-2xl border text-center space-y-1 shadow-lg ${
                isDark
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}
            >
              <div className="flex items-center justify-center gap-2 font-bold text-sm text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {dir === 'rtl' ? 'ההצבעה שלך נעולה ומאושרת!' : 'Your vote is locked in!'}
                </span>
              </div>
              <p className="text-xs opacity-80">
                {pendingPlayers.length > 0
                  ? dir === 'rtl'
                    ? `ממתינים לעוד ${pendingPlayers.length} שחקנים שינעלו את קולם...`
                    : `Waiting for ${pendingPlayers.length} other player(s) to lock in...`
                  : dir === 'rtl'
                  ? 'כל הקולות התקבלו! חושף תוצאות...'
                  : 'All votes in! Revealing results...'}
              </p>
            </div>
          ) : (
            <button
              type="button"
              disabled={!selectedSuspectId || isSubmitting}
              onClick={handleVoteSubmit}
              className={`w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 shadow-2xl transition-all cursor-pointer ${
                selectedSuspectId && !isSubmitting
                  ? 'bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white shadow-rose-900/40 ring-2 ring-rose-400/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60 border border-slate-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{dir === 'rtl' ? 'נועל הצבעה...' : 'Locking in vote...'}</span>
                </>
              ) : selectedSuspectId ? (
                <>
                  <Lock className="w-5 h-5" />
                  <span>
                    {dir === 'rtl'
                      ? `נעל הצבעה עבור ${selectedSuspect?.name || 'החשוד'}`
                      : `Lock In Vote for ${selectedSuspect?.name || 'Selected Suspect'}`}
                  </span>
                </>
              ) : (
                <>
                  <Target className="w-5 h-5 opacity-60" />
                  <span>
                    {dir === 'rtl' ? 'בחר חשוד כדי לנעול הצבעה' : 'Select a suspect to lock in vote'}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
