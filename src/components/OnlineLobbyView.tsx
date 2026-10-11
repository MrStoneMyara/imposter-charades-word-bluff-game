import React, { useState } from 'react';
import { Copy, Check, Users, Play, Crown, Settings2, LogOut, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { LanguageData, LANGUAGES } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';

interface OnlineLobbyViewProps {
  lobby: any;
  currentPlayerId: string;
  lang: LanguageData;
  onStartGame: () => void;
  onUpdateSettings: (settings: { language?: string; category?: string; imposterCount?: number }) => void;
  onLeaveLobby: () => void;
  soundEnabled: boolean;
}

export const OnlineLobbyView: React.FC<OnlineLobbyViewProps> = ({
  lobby,
  currentPlayerId,
  lang,
  onStartGame,
  onUpdateSettings,
  onLeaveLobby,
  soundEnabled,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isHost = lobby.hostId === currentPlayerId;
  const canStart = lobby.players.length >= 3;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(lobby.code);
      setCopiedCode(true);
      if (soundEnabled) playSound('tap');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}?join=${lobby.code}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      if (soundEnabled) playSound('tap');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  const currentWordLang = LANGUAGES[lobby.language] || LANGUAGES.en;

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Lobby Code & Share Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs font-semibold text-rose-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang.strings.lobbyCode}</span>
        </div>

        <div>
          <div className="text-4xl sm:text-5xl font-mono font-extrabold tracking-widest text-white select-all bg-slate-950/70 border border-slate-800 rounded-xl py-3 px-6 inline-block shadow-inner">
            {lobby.code}
          </div>
        </div>

        {/* Copy Buttons */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copiedCode ? lang.strings.copied : 'Copy Room Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-200 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/60 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-rose-400" />}
            <span>{copiedLink ? lang.strings.copied : lang.strings.shareLink}</span>
          </button>
        </div>
      </div>

      {/* Players List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Users className="w-4 h-4 text-rose-400" />
            <span>{lang.strings.players} ({lobby.players.length})</span>
          </div>
          <span className="text-xs text-slate-400">
            {lobby.players.length < 3 ? 'Min 3 players needed' : 'Ready to start!'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {lobby.players.map((player: any) => {
            const isYou = player.id === currentPlayerId;
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                  isYou
                    ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
                    {player.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-sm truncate block">
                      {player.name} {isYou && <span className="text-xs text-rose-400 font-normal">(You)</span>}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {lang.strings.score}: {player.score} pts
                    </span>
                  </div>
                </div>

                {player.isHost && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md shrink-0">
                    <Crown className="w-3 h-3" /> Host
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Host Settings */}
      {isHost && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Settings2 className="w-4 h-4 text-rose-400" />
            <span>Round Customization</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Word Language */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Word Language</label>
              <select
                value={lobby.language}
                onChange={(e) => onUpdateSettings({ language: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                {Object.values(LANGUAGES).map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.flag} {item.name} ({item.nativeName})
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">{lang.strings.category}</label>
              <select
                value={lobby.category}
                onChange={(e) => onUpdateSettings({ category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="all">🎲 {lang.strings.categoriesAll}</option>
                <option value="animals">🦁 {currentWordLang.categories.animals}</option>
                <option value="food">🍕 {currentWordLang.categories.food}</option>
                <option value="objects">🎒 {currentWordLang.categories.objects}</option>
                <option value="places">🏖️ {currentWordLang.categories.places}</option>
                <option value="professions">👨‍🚀 {currentWordLang.categories.professions}</option>
                <option value="nature">🌋 {currentWordLang.categories.nature}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Start Button or Waiting */}
      <div className="space-y-2">
        {isHost ? (
          <div>
            {!canStart && (
              <div className="flex items-center gap-2 p-3 mb-2 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{lang.strings.minPlayersWarning} (Currently {lobby.players.length}/3)</span>
              </div>
            )}
            <button
              type="button"
              disabled={!canStart}
              onClick={onStartGame}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                canStart
                  ? 'bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white shadow-rose-900/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{lang.strings.startGame} ({lobby.players.length} Players)</span>
            </button>
          </div>
        ) : (
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-center space-y-1">
            <p className="text-sm font-semibold text-rose-300 animate-pulse">
              {lang.strings.waitingForHost}
            </p>
            <p className="text-xs text-slate-500">
              The host will start the game when all friends join!
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onLeaveLobby}
          className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{lang.strings.leaveLobby}</span>
        </button>
      </div>
    </div>
  );
};
