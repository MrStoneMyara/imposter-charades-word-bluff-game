import React, { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { LanguageData } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';

interface VotingViewProps {
  players: any[];
  currentPlayerId: string;
  lang: LanguageData;
  onCastVote: (suspectId: string) => void;
  hasVoted: boolean;
  soundEnabled: boolean;
}

export const VotingView: React.FC<VotingViewProps> = ({
  players,
  currentPlayerId,
  lang,
  onCastVote,
  hasVoted,
  soundEnabled,
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('');

  const handleSelect = (id: string) => {
    if (hasVoted) return;
    setSelectedSuspectId(id);
    if (soundEnabled) playSound('tap');
  };

  const handleVoteSubmit = () => {
    if (!selectedSuspectId) return;
    onCastVote(selectedSuspectId);
    if (soundEnabled) playSound('vote');
  };

  const votedCount = players.filter((p) => p.votedForId).length;

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Title Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
          <Target className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-white">
          {lang.strings.votingTitle}
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          {lang.strings.votingSubtitle}
        </p>

        <div className="pt-2 text-xs font-semibold text-rose-400 flex items-center justify-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          <span>{votedCount} / {players.length} players voted</span>
        </div>
      </div>

      {/* Players Selectable Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {players.map((player) => {
          const isYou = player.id === currentPlayerId;
          const isSelected = selectedSuspectId === player.id;

          return (
            <button
              key={player.id}
              type="button"
              disabled={hasVoted}
              onClick={() => handleSelect(player.id)}
              className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/30'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              } ${hasVoted ? 'opacity-80 cursor-default' : ''}`}
            >
              <div className="flex items-center gap-3 truncate">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm uppercase shrink-0 ${
                    isSelected ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {player.name.charAt(0)}
                </div>
                <div className="truncate">
                  <span className="font-bold text-sm text-white block truncate">
                    {player.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isYou ? '(You)' : 'Suspect'}
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="text-rose-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Submit Vote CTA */}
      <div className="pt-2">
        {hasVoted ? (
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-center space-y-1">
            <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Your vote has been submitted!
            </span>
            <p className="text-xs text-slate-400">
              Waiting for other players to finish voting...
            </p>
          </div>
        ) : (
          <button
            type="button"
            disabled={!selectedSuspectId}
            onClick={handleVoteSubmit}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
              selectedSuspectId
                ? 'bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white shadow-rose-900/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>{lang.strings.voteBtn} for Selected Suspect</span>
          </button>
        )}
      </div>
    </div>
  );
};
