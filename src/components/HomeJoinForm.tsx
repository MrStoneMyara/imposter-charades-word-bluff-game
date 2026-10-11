import React, { useState } from 'react';
import { Play, LogIn, Sparkles, Smartphone, Users } from 'lucide-react';
import { LanguageData } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';

interface HomeJoinFormProps {
  initialCode?: string;
  lang: LanguageData;
  onCreateLobby: (nickname: string) => void;
  onJoinLobby: (code: string, nickname: string) => void;
  onStartPassAndPlay: () => void;
  soundEnabled: boolean;
  isLoading: boolean;
}

export const HomeJoinForm: React.FC<HomeJoinFormProps> = ({
  initialCode = '',
  lang,
  onCreateLobby,
  onJoinLobby,
  onStartPassAndPlay,
  soundEnabled,
  isLoading,
}) => {
  // Local input states (never shared in parent)
  const [hostNickname, setHostNickname] = useState('');
  const [joinNickname, setJoinNickname] = useState('');
  const [joinCode, setJoinCode] = useState(initialCode);
  const [showJoinBox, setShowJoinBox] = useState(Boolean(initialCode));

  const handleCreate = () => {
    onCreateLobby(hostNickname.trim() || 'Host');
    if (soundEnabled) playSound('tap');
  };

  const handleJoin = () => {
    if (!joinCode.trim()) return;
    onJoinLobby(joinCode.trim().toUpperCase(), joinNickname.trim() || 'Player');
    if (soundEnabled) playSound('tap');
  };

  return (
    <div className="w-full space-y-6">
      {/* Massive Call To Action: Instant Lobby Creation */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 text-center sm:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs font-bold text-rose-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Multiplayer · No Account Needed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Start a Room in 1 Tap
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Create a lobby, get a 4-letter join code, and share with your friends across any phone or laptop.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                key="host-nickname-input"
                type="text"
                value={hostNickname}
                onChange={(e) => setHostNickname(e.target.value)}
                placeholder="Your Nickname (optional)"
                maxLength={16}
                className="w-full sm:w-56 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 shadow-inner"
              />
              <button
                type="button"
                disabled={isLoading}
                onPointerDown={handleCreate}
                className="flex-1 py-3.5 px-6 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-[0.98] text-white font-extrabold text-base rounded-xl shadow-xl shadow-rose-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{isLoading ? 'Creating...' : lang.strings.startLobby}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Join with Code Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <LogIn className="w-4 h-4 text-rose-400" />
              <span>{lang.strings.joinLobby}</span>
            </div>
            <p className="text-xs text-slate-400">
              Have a code from a friend? Enter it below.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <input
                key="join-code-input"
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="4-Letter Code"
                maxLength={4}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-center font-mono font-bold text-base text-white tracking-widest uppercase placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <input
                key="join-name-input"
                type="text"
                value={joinNickname}
                onChange={(e) => setJoinNickname(e.target.value)}
                placeholder="Your Name"
                maxLength={16}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="button"
              disabled={isLoading || !joinCode.trim()}
              onPointerDown={handleJoin}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                joinCode.trim()
                  ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  : 'bg-slate-950 text-slate-600 border border-slate-800/60 cursor-not-allowed'
              }`}
            >
              <span>{lang.strings.joinBtn}</span>
            </button>
          </div>
        </div>

        {/* Pass & Play (1 Phone) Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>{lang.strings.passAndPlay}</span>
            </div>
            <p className="text-xs text-slate-400">
              {lang.strings.passAndPlayDesc}
            </p>
          </div>

          <button
            type="button"
            onClick={onStartPassAndPlay}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Play on 1 Phone</span>
          </button>
        </div>
      </div>
    </div>
  );
};
