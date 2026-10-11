import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Wifi,
  Check,
  Moon,
  Sun,
  Info,
  Play,
  Copy,
  Share2,
} from 'lucide-react';
import { LanguageDropdown } from './components/LanguageDropdown.tsx';
import { CategoryMultiSelectDropdown } from './components/CategoryMultiSelectDropdown.tsx';
import { PlayerRoster } from './components/PlayerRoster.tsx';
import { GameOptionsCard, ClueDifficulty } from './components/GameOptionsCard.tsx';
import { RulesModal } from './components/RulesModal.tsx';
import { PassAndPlayGame } from './components/PassAndPlayGame.tsx';
import { SeoFooter } from './components/SeoFooter.tsx';
import { SeoArticleView } from './components/SeoArticleView.tsx';
import { LocalizedHowToPlayView } from './components/LocalizedHowToPlayView.tsx';
import { LANGUAGES, DEFAULT_LANGUAGE, CATEGORY_KEYS, LanguageData } from './data/languages.ts';
import { SEO_ARTICLES } from './data/seoArticles.ts';
import { playSound } from './utils/audio.ts';

type PlayMode = 'PASS_PHONE' | 'PLAY_ONLINE';

function readRoomCodeFromLocation(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('code') || params.get('join') || '';
    return raw.trim().toUpperCase();
  } catch {
    return '';
  }
}

export default function App() {
  // Theme state: dark / light
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('imposter_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Language state: Priority: URL path '/[lang]' -> URL query '?lang=' -> localStorage -> DEFAULT_LANGUAGE ('en')
  const [currentLangCode, setCurrentLangCode] = useState<string>(() => {
    try {
      const pathMatch = window.location.pathname.match(/^\/([a-z]{2})(?:\/|$)/i);
      if (pathMatch && LANGUAGES[pathMatch[1].toLowerCase()]) {
        const pathLang = pathMatch[1].toLowerCase();
        localStorage.setItem('imposter_lang', pathLang);
        return pathLang;
      }
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang && LANGUAGES[urlLang]) {
        localStorage.setItem('imposter_lang', urlLang);
        return urlLang;
      }
      const saved = localStorage.getItem('imposter_lang');
      if (saved && LANGUAGES[saved]) return saved;
    } catch {
      // ignore
    }
    return DEFAULT_LANGUAGE; // Default to English
  });

  const lang: LanguageData = LANGUAGES[currentLangCode] || LANGUAGES[DEFAULT_LANGUAGE];
  const dir = lang.dir;

  // Sync HTML lang and dir attributes for accessibility and i18n SEO
  useEffect(() => {
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.dir;
  }, [lang.code, lang.dir]);

  // Internal routing state for programmatic SEO pages and guide hubs
  const [currentPath, setCurrentPath] = useState<string>(() => {
    try {
      return window.location.pathname || '/';
    } catch {
      return '/';
    }
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sound enabled
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Rules modal
  const [rulesOpen, setRulesOpen] = useState(false);

  // Mode Selection: 'PASS_PHONE' vs 'PLAY_ONLINE' (Screenshot 2)
  const [playMode, setPlayMode] = useState<PlayMode>(() => (readRoomCodeFromLocation() ? 'PLAY_ONLINE' : 'PASS_PHONE'));

  // Active game view for Pass & Play: 'SETUP' | 'PLAYING'
  const [passPlayState, setPassPlayState] = useState<'SETUP' | 'PLAYING'>('SETUP');

  // Players list for Pass & Play: Prefill the 3 player names with classic popular names per culture
  const [players, setPlayers] = useState<string[]>(() => {
    return lang.defaultPlayerNames ? [...lang.defaultPlayerNames] : ['Emma', 'Liam', 'Noah'];
  });

  // Selected Categories: Multi-select dropdown, All categories automatically selected by default!
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...CATEGORY_KEYS]);

  // Game Options: Number of Imposters & Clues
  const [imposterCount, setImposterCount] = useState(1);
  const [enableClues, setEnableClues] = useState(true);
  const [clueDifficulty, setClueDifficulty] = useState<ClueDifficulty>('medium');
  const [giveHardClueIfFirst, setGiveHardClueIfFirst] = useState(true);

  // Enforce non-majority rule: imposters must be less than half of players
  const maxAllowedImposters = Math.max(1, Math.floor((players.length - 1) / 2));
  useEffect(() => {
    if (imposterCount > maxAllowedImposters) {
      setImposterCount(maxAllowedImposters);
    }
  }, [players.length, maxAllowedImposters, imposterCount]);

  // Online Multiplayer State
  const [onlineScreen, setOnlineScreen] = useState<'CHOICE' | 'LOBBY' | 'GAME' | 'VOTING' | 'REVEAL'>('CHOICE');
  const [hostName, setHostName] = useState(() => {
    try {
      return localStorage.getItem('imposter_player_name') || '';
    } catch {
      return '';
    }
  });
  const [joinCode, setJoinCode] = useState(readRoomCodeFromLocation);
  const [joinName, setJoinName] = useState(() => {
    try {
      return localStorage.getItem('imposter_player_name') || '';
    } catch {
      return '';
    }
  });
  const [lobbyCode, setLobbyCode] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<{ id: string; name: string; isHost: boolean } | null>(null);
  const [lobbyState, setLobbyState] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [sharedLink, setSharedLink] = useState(false);
  const [isOnlineRevealed, setIsOnlineRevealed] = useState(false);
  const [selectedSuspectId, setSelectedSuspectId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const joinNameInputRef = useRef<HTMLInputElement>(null);

  // Apply dark class and dir attribute to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLangCode;
    try {
      localStorage.setItem('imposter_theme', isDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDark, dir, currentLangCode]);

  // Language switch: updates URL parameter ?lang=... and saves to cache/localStorage
  const handleLanguageChange = (code: string) => {
    const prevLang = LANGUAGES[currentLangCode] || LANGUAGES[DEFAULT_LANGUAGE];
    const newLang = LANGUAGES[code] || LANGUAGES[DEFAULT_LANGUAGE];
    setCurrentLangCode(code);

    // If player names are still default or empty, prefill with new culture's classic popular names!
    const isDefaultOrEmpty = players.every((p, i) => !p || (prevLang.defaultPlayerNames && p === prevLang.defaultPlayerNames[i]));
    if (isDefaultOrEmpty && newLang.defaultPlayerNames) {
      setPlayers([...newLang.defaultPlayerNames]);
    }

    try {
      localStorage.setItem('imposter_lang', code);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', code);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
    if (soundEnabled) playSound('tap');
  };

  const handleToggleTheme = () => {
    setIsDark(!isDark);
    if (soundEnabled) playSound('tap');
  };

  // Online Polling
  const pollTimerRef = useRef<any>(null);
  useEffect(() => {
    if (playMode !== 'PLAY_ONLINE' || !lobbyCode || !currentPlayer) {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      return;
    }

    const fetchLobby = async () => {
      try {
        const res = await fetch(`/api/lobby/${lobbyCode}?playerId=${currentPlayer.id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setErrorMessage('Room closed or expired.');
            setOnlineScreen('CHOICE');
            setLobbyState(null);
            setLobbyCode('');
          }
          return;
        }
        const data = await res.json();
        setLobbyState(data);

        if (data.state === 'LOBBY') setOnlineScreen('LOBBY');
        else if (data.state === 'PLAYING') setOnlineScreen('GAME');
        else if (data.state === 'VOTING') setOnlineScreen('VOTING');
        else if (data.state === 'IMPOSTER_GUESS' || data.state === 'REVEAL') setOnlineScreen('REVEAL');
      } catch {
        // network glitch
      }
    };

    fetchLobby();
    pollTimerRef.current = setInterval(fetchLobby, 1200);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [playMode, lobbyCode, currentPlayer]);

  // Online Multiplayer handlers
  const handleCreateOnlineLobby = async () => {
    setErrorMessage(null);
    try {
      const trimmedHost = hostName.trim() || 'Host';
      try {
        if (hostName.trim()) localStorage.setItem('imposter_player_name', hostName.trim());
      } catch {
        // ignore
      }
      const res = await fetch('/api/lobby/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostName: trimmedHost,
          language: currentLangCode,
          category: selectedCategories.length === CATEGORY_KEYS.length ? 'all' : selectedCategories[0],
          imposterCount: 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLobbyCode(data.lobby.code);
        setCurrentPlayer(data.player);
        setLobbyState(data.lobby);
        setOnlineScreen('LOBBY');
        if (soundEnabled) playSound('tap');
      } else {
        setErrorMessage(data.error || 'Failed to create lobby');
      }
    } catch {
      setErrorMessage('Network connection error');
    }
  };

  const handleJoinOnlineLobby = async (codeOverride?: string, nameOverride?: string) => {
    const targetCode = (codeOverride !== undefined ? codeOverride : joinCode).trim().toUpperCase();
    const rawName = nameOverride !== undefined ? nameOverride : joinName;
    const targetName = rawName.trim();
    if (!targetCode) return;
    setErrorMessage(null);
    try {
      const res = await fetch('/api/lobby/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: targetCode,
          playerName: targetName || 'Player',
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (targetName) {
          try {
            localStorage.setItem('imposter_player_name', targetName);
          } catch {
            // ignore
          }
        }
        setLobbyCode(data.lobby.code);
        setCurrentPlayer(data.player);
        setLobbyState(data.lobby);
        setOnlineScreen('LOBBY');
        if (soundEnabled) playSound('tap');
      } else {
        setErrorMessage(data.error || 'Room not found');
      }
    } catch {
      setErrorMessage('Network connection error');
    }
  };

  // Auto-join invite flow for shared room URLs (?code=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get('code') || params.get('join');
      if (!codeParam) return;

      const cleanCode = codeParam.trim().toUpperCase();
      setJoinCode(cleanCode);
      setPlayMode('PLAY_ONLINE');

      let savedName = '';
      try {
        savedName = localStorage.getItem('imposter_player_name') || '';
      } catch {
        // ignore
      }

      // URL Cleanup: clean up the query param using replaceState so a page refresh doesn't trigger duplicate joins
      params.delete('code');
      params.delete('join');
      const remainingSearch = params.toString();
      const cleanUrl = window.location.pathname + (remainingSearch ? `?${remainingSearch}` : '');
      window.history.replaceState({}, '', cleanUrl);

      if (savedName) {
        setJoinName(savedName);
        handleJoinOnlineLobby(cleanCode, savedName);
      } else {
        // Player name required and missing: focus the input
        setTimeout(() => {
          joinNameInputRef.current?.focus();
        }, 150);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCopyCode = async () => {
    if (!lobbyState?.code) return;
    try {
      await navigator.clipboard.writeText(lobbyState.code);
      setCopiedCode(true);
      if (soundEnabled) playSound('tap');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShareInvite = async () => {
    if (!lobbyState?.code) return;
    const path = window.location.pathname;
    const invitePath = path === '/en' || path === '/en/' ? '/' : path;
    const inviteUrl = `${window.location.origin}${invitePath}?code=${lobbyState.code}`;
    const shareData = {
      title: 'Join my Imposter game!',
      text: `Join my lobby using code ${lobbyState.code}`,
      url: inviteUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare({ url: inviteUrl })) {
      try {
        await navigator.share(shareData);
        if (soundEnabled) playSound('tap');
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback for Desktop / non-share browsers: Copies the full URL to the clipboard
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setSharedLink(true);
      if (soundEnabled) playSound('tap');
      setTimeout(() => setSharedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleStartOnlineGame = async () => {
    if (!lobbyCode || !currentPlayer) return;
    try {
      const res = await fetch(`/api/lobby/${lobbyCode}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: currentPlayer.id,
          clueDifficulty,
          enableClues,
          giveHardClueIfFirst,
        }),
      });
      const data = await res.json();
      if (data.error) setErrorMessage(data.error);
      else {
        setLobbyState(data);
        setIsOnlineRevealed(false);
        if (soundEnabled) playSound('reveal');
      }
    } catch {
      // ignore
    }
  };

  // If visiting an SEO Landing Page / Game Guide
  const localizedMatch = currentPath.match(/^\/([a-z]{2})\/how-to-play\/?$/i);
  if (localizedMatch && LANGUAGES[localizedMatch[1].toLowerCase()]) {
    const guideLang = localizedMatch[1].toLowerCase();
    return (
      <LocalizedHowToPlayView
        langCode={guideLang}
        isDark={isDark}
        onNavigate={handleNavigate}
        onSelectLanguage={handleLanguageChange}
      />
    );
  }

  if (currentPath === '/how-to-play' || currentPath === '/how-to-play/') {
    return (
      <LocalizedHowToPlayView
        langCode={currentLangCode}
        isDark={isDark}
        onNavigate={handleNavigate}
        onSelectLanguage={handleLanguageChange}
      />
    );
  }

  const normalizedSlug = currentPath.replace(/^\/(?:blog\/)?/, '').replace(/\/$/, '');
  if (normalizedSlug && SEO_ARTICLES[normalizedSlug]) {
    return (
      <SeoArticleView
        slug={normalizedSlug}
        isDark={isDark}
        onNavigate={handleNavigate}
      />
    );
  }

  // If in Pass & Play active game view
  if (playMode === 'PASS_PHONE' && passPlayState === 'PLAYING') {
    return (
      <div
        className={`min-h-screen flex flex-col p-4 sm:p-6 transition-colors ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#fcfcfd] text-slate-900'
        }`}
        dir={dir}
      >
        <PassAndPlayGame
          players={players}
          selectedCategories={selectedCategories}
          imposterCount={imposterCount}
          enableClues={enableClues}
          clueDifficulty={clueDifficulty}
          giveHardClueIfFirst={giveHardClueIfFirst}
          lang={lang}
          isDark={isDark}
          soundEnabled={soundEnabled}
          onExit={() => setPassPlayState('SETUP')}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors bg-[#fcfcfd] dark:bg-slate-950 text-slate-900 dark:text-slate-100"
      dir={dir}
    >
      {/* Rules Modal */}
      <RulesModal
        isOpen={rulesOpen}
        onClose={() => setRulesOpen(false)}
        lang={lang}
      />

      {/* Main Single Page Layout */}
      <main className="w-full max-w-xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center flex-1">
        {/* Top Controls Bar: Language Dropdown (Screenshot 1 & 2) + Dark Mode Toggle */}
        <div className="w-full flex items-center justify-between gap-3 mb-6">
          {/* Language Selector Dropdown matching screenshot */}
          <LanguageDropdown
            currentLangCode={currentLangCode}
            onSelectLang={handleLanguageChange}
            soundEnabled={soundEnabled}
            isDark={isDark}
          />

          {/* Top Right Controls: Dark Mode Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleTheme}
              className="p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              title={isDark ? lang.strings.lightMode : lang.strings.darkMode}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title & Subtitle with Info Icon */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center justify-center gap-2 tracking-tight">
            <span>{lang.strings.appTitle}</span>
          </h1>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>{lang.strings.appTagline}</span>
            <button
              type="button"
              onClick={() => setRulesOpen(true)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 cursor-pointer"
              title="Rules"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Cards (Pass the phone vs Play online - Screenshot 2) */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6">
          {/* Card 1: Pass the phone */}
          <button
            type="button"
            onClick={() => {
              setPlayMode('PASS_PHONE');
              if (soundEnabled) playSound('tap');
            }}
            className={`relative p-4 rounded-3xl border-2 ${dir === 'rtl' ? 'text-right' : 'text-left'} flex flex-col justify-between transition-all cursor-pointer shadow-xs ${
              playMode === 'PASS_PHONE'
                ? 'bg-white dark:bg-slate-900 border-slate-900 dark:border-white ring-1 ring-slate-900/10 dark:ring-white/10'
                : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800 text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <Smartphone className={`w-5 h-5 ${playMode === 'PASS_PHONE' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`} />
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  playMode === 'PASS_PHONE'
                    ? 'bg-blue-600 text-white'
                    : 'border-2 border-slate-300 dark:border-slate-700'
                }`}
              >
                {playMode === 'PASS_PHONE' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
            <div>
              <span className={`font-extrabold text-sm block ${playMode === 'PASS_PHONE' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                {lang.strings.passThePhone}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                {lang.strings.passThePhoneDesc}
              </span>
            </div>
          </button>

          {/* Card 2: Play online */}
          <button
            type="button"
            onClick={() => {
              setPlayMode('PLAY_ONLINE');
              if (soundEnabled) playSound('tap');
            }}
            className={`relative p-4 rounded-3xl border-2 ${dir === 'rtl' ? 'text-right' : 'text-left'} flex flex-col justify-between transition-all cursor-pointer shadow-xs ${
              playMode === 'PLAY_ONLINE'
                ? 'bg-white dark:bg-slate-900 border-slate-900 dark:border-white ring-1 ring-slate-900/10 dark:ring-white/10'
                : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800 text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <Wifi className={`w-5 h-5 ${playMode === 'PLAY_ONLINE' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`} />
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  playMode === 'PLAY_ONLINE'
                    ? 'bg-blue-600 text-white'
                    : 'border-2 border-slate-300 dark:border-slate-700'
                }`}
              >
                {playMode === 'PLAY_ONLINE' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
            <div>
              <span className={`font-extrabold text-sm block ${playMode === 'PLAY_ONLINE' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                {lang.strings.playOnline}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                {lang.strings.playOnlineDesc}
              </span>
            </div>
          </button>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="w-full mb-4 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-200 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-800 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Mode Specific Views */}
        {playMode === 'PASS_PHONE' ? (
          /* PASS THE PHONE MODE (Exact Match to Screenshot 1 with Requested Features) */
          <div className="w-full space-y-6 animate-in fade-in duration-150">
            {/* 1. Player Roster with Drag & Drop Seating Circle Order + Empty Inputs (No prefilling!) */}
            <PlayerRoster
              players={players}
              onChange={setPlayers}
              lang={lang}
              isDark={isDark}
              soundEnabled={soundEnabled}
            />

            {/* 2. Category Multi-Select Dropdown with Pinned Top Row "All Categories" */}
            <CategoryMultiSelectDropdown
              selectedCategories={selectedCategories}
              onChange={setSelectedCategories}
              lang={lang}
              isDark={isDark}
              soundEnabled={soundEnabled}
            />

            {/* 3. Game Options: Number of Imposters + Clues (Easy / Medium / Hard) or Hard Clue if First */}
            <GameOptionsCard
              playerCount={players.length}
              imposterCount={imposterCount}
              onChangeImposterCount={setImposterCount}
              enableClues={enableClues}
              onToggleEnableClues={setEnableClues}
              clueDifficulty={clueDifficulty}
              onChangeDifficulty={setClueDifficulty}
              giveHardClueIfFirst={giveHardClueIfFirst}
              onToggleHardClueIfFirst={setGiveHardClueIfFirst}
              lang={lang}
              isDark={isDark}
              soundEnabled={soundEnabled}
            />

            {/* 4. Start Game Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setPassPlayState('PLAYING');
                  if (soundEnabled) playSound('tap');
                }}
                className="w-full py-4 px-6 rounded-2xl font-extrabold text-base shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer bg-slate-950 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 active:scale-[0.98]"
              >
                <span>{lang.strings.startGame}</span>
              </button>
            </div>
          </div>
        ) : (
          /* PLAY ONLINE MULTIPLAYER MODE */
          <div className="w-full space-y-6 animate-in fade-in duration-150">
            {onlineScreen === 'CHOICE' && (
              <div className="space-y-4">
                {/* Create Online Room */}
                <div
                  className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lang.strings.startLobby}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang.strings.startLobbyDesc}
                    </p>
                  </div>

                  <input
                    key="online-host-input"
                    type="text"
                    value={hostName}
                    onChange={(e) => {
                      setHostName(e.target.value);
                      try {
                        if (e.target.value.trim()) localStorage.setItem('imposter_player_name', e.target.value.trim());
                      } catch {
                        // ignore
                      }
                    }}
                    placeholder={lang.strings.enterName}
                    className={`w-full border rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-700 text-white focus:border-slate-500 placeholder-slate-600'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-800 placeholder-slate-400'
                    }`}
                  />

                  {/* Category dropdown for online host */}
                  <CategoryMultiSelectDropdown
                    selectedCategories={selectedCategories}
                    onChange={setSelectedCategories}
                    lang={lang}
                    isDark={isDark}
                    soundEnabled={soundEnabled}
                  />

                  <button
                    type="button"
                    onClick={handleCreateOnlineLobby}
                    className={`w-full py-3.5 px-5 rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer ${
                      isDark
                        ? 'bg-slate-100 hover:bg-white text-slate-950 active:scale-[0.98]'
                        : 'bg-slate-950 hover:bg-slate-800 text-white active:scale-[0.98]'
                    }`}
                  >
                    {lang.strings.startLobby}
                  </button>
                </div>

                {/* Join with Code */}
                <div
                  className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lang.strings.joinLobby}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang.strings.joinLobbyDesc}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      key="online-join-code"
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder={lang.strings.enterCode}
                      maxLength={4}
                      className={`border rounded-2xl px-3 py-3 text-center font-mono font-bold text-base uppercase tracking-widest focus:outline-none ${
                        isDark
                          ? 'bg-slate-950 border-slate-700 text-white focus:border-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-800'
                      }`}
                    />
                    <input
                      ref={joinNameInputRef}
                      key="online-join-name"
                      type="text"
                      value={joinName}
                      onChange={(e) => {
                        setJoinName(e.target.value);
                        try {
                          if (e.target.value.trim()) localStorage.setItem('imposter_player_name', e.target.value.trim());
                        } catch {
                          // ignore
                        }
                      }}
                      placeholder={lang.strings.enterName}
                      className={`border rounded-2xl px-3 py-3 text-sm font-semibold focus:outline-none ${
                        isDark
                          ? 'bg-slate-950 border-slate-700 text-white focus:border-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-800'
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!joinCode.trim()}
                    onClick={() => handleJoinOnlineLobby()}
                    className={`w-full py-3.5 px-5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
                      joinCode.trim()
                        ? isDark
                          ? 'bg-slate-100 hover:bg-white text-slate-950 shadow-md'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {lang.strings.joinBtn}
                  </button>
                </div>
              </div>
            )}

            {/* Online Lobby Waiting Room */}
            {onlineScreen === 'LOBBY' && lobbyState && currentPlayer && (
              <div
                className={`p-6 rounded-3xl border shadow-sm space-y-5 text-center ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block">
                  {lang.strings.lobbyCode}
                </span>

                <div
                  className={`text-4xl sm:text-5xl font-mono font-black tracking-widest border rounded-2xl py-3 px-6 inline-block ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {lobbyState.code}
                </div>

                {/* Two-Button Action Group: Copy Code & Share Invite */}
                <div className="flex items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 ${
                      copiedCode
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 ring-2 ring-emerald-500/20'
                        : isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/90 hover:text-slate-900'
                    }`}
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                        <span>{lang.strings.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lang.strings.copyCode}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleShareInvite}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 ${
                      sharedLink
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 ring-2 ring-emerald-500/20'
                        : isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/90 hover:text-slate-900'
                    }`}
                  >
                    {sharedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                        <span>{lang.strings.linkCopied}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lang.strings.shareLink}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Players joined */}
                <div className={`space-y-2 ${dir === 'rtl' ? 'text-right' : 'text-left'} pt-2`}>
                  <span className="text-xs font-bold block text-slate-700 dark:text-slate-300">
                    {lang.strings.players} ({lobbyState.players.length})
                  </span>
                  <div className="space-y-1.5">
                    {lobbyState.players.map((p: any) => (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between p-3 border rounded-2xl text-sm font-semibold ${
                          isDark
                            ? 'bg-slate-950 border-slate-800 text-slate-200'
                            : 'bg-slate-50 border-slate-100 text-slate-900'
                        }`}
                      >
                        <span>
                          {p.name} {p.id === currentPlayer.id && ` ${lang.strings.youSuffix}`}
                        </span>
                        {p.isHost && (
                          <span className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full font-bold">
                            {lang.strings.hostBadge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {currentPlayer.isHost ? (
                  <button
                    type="button"
                    disabled={lobbyState.players.length < 3}
                    onClick={handleStartOnlineGame}
                    className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base transition-all cursor-pointer ${
                      lobbyState.players.length >= 3
                        ? isDark
                          ? 'bg-slate-100 hover:bg-white text-slate-950 shadow-lg'
                          : 'bg-slate-950 hover:bg-slate-800 text-white shadow-lg'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {lang.strings.startGame} ({lobbyState.players.length}/3+)
                  </button>
                ) : (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl text-xs text-slate-500 font-medium">
                    {lang.strings.waitingForHost}
                  </div>
                )}
              </div>
            )}

            {/* Online Active Game */}
            {onlineScreen === 'GAME' && lobbyState && currentPlayer && (
              <div className="space-y-4 text-center">
                <div
                  className={`p-4 rounded-3xl border shadow-xs ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                    🗣️ {lang.strings.firstSpeaker}:{' '}
                    {lobbyState.players.find((p: any) => p.id === lobbyState.firstSpeakerId)?.name || lang.strings.firstSpeakerPrefix}
                  </span>
                </div>

                {/* Secret Card (Category removed!) */}
                <button
                  type="button"
                  onPointerDown={() => setIsOnlineRevealed(true)}
                  onPointerUp={() => setIsOnlineRevealed(false)}
                  className={`w-full min-h-[260px] p-6 rounded-3xl border-2 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm ${
                    isOnlineRevealed
                      ? lobbyState.isYouImposter
                        ? isDark
                          ? 'bg-rose-950/60 border-rose-500 text-rose-100'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                        : isDark
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {isOnlineRevealed ? (
                    <div className="space-y-3">
                      {lobbyState.isYouImposter ? (
                        <>
                          <span className="text-xs font-black bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-3 py-1 rounded-full uppercase">
                            {lang.strings.imposter}
                          </span>
                          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block">
                            {lang.strings.unknownWord}
                          </span>
                          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
                            {lang.strings.imposterInstructions}
                          </p>
                          {lobbyState.clue && (
                            <p className="text-sm font-semibold text-rose-700 dark:text-rose-200 max-w-xs leading-relaxed">
                              {lang.strings.clue}: {lobbyState.clue}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-black bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full uppercase">
                            {lang.strings.innocent}
                          </span>
                          <span className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 block">
                            {lobbyState.secretWord}
                          </span>
                          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
                            {lang.strings.innocentInstructions}
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {lang.strings.holdToReveal}
                      </span>
                      <span className="text-xs text-slate-400">{lang.strings.releaseToHide}</span>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await fetch(`/api/lobby/${lobbyCode}/vote-phase`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ playerId: currentPlayer.id }),
                    });
                  }}
                  className={`w-full py-4 font-extrabold rounded-2xl shadow-md cursor-pointer ${
                    isDark ? 'bg-slate-100 text-slate-950 hover:bg-white' : 'bg-slate-950 text-white hover:bg-slate-800'
                  }`}
                >
                  {lang.strings.readyToVote}
                </button>
              </div>
            )}

            {/* Online Voting */}
            {onlineScreen === 'VOTING' && lobbyState && currentPlayer && (
              <div
                className={`p-6 border rounded-3xl space-y-4 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h3 className={`font-extrabold text-base text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {lang.strings.votingTitle}
                </h3>
                <div className="space-y-2">
                  {lobbyState.players.map((p: any) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedSuspectId(p.id)}
                      className={`w-full p-3.5 rounded-2xl border ${dir === 'rtl' ? 'text-right' : 'text-left'} font-bold text-sm transition-all cursor-pointer ${
                        selectedSuspectId === p.id
                          ? isDark
                            ? 'bg-slate-100 text-slate-900 border-white'
                            : 'bg-slate-900 text-white border-slate-900'
                          : isDark
                          ? 'bg-slate-950 text-slate-100 border-slate-800 hover:bg-slate-800'
                          : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.name} {p.id === currentPlayer.id && ` ${lang.strings.youSuffix}`}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!selectedSuspectId}
                  onClick={async () => {
                    await fetch(`/api/lobby/${lobbyCode}/vote`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ playerId: currentPlayer.id, suspectId: selectedSuspectId }),
                    });
                  }}
                  className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all cursor-pointer ${
                    selectedSuspectId
                      ? isDark
                        ? 'bg-slate-100 text-slate-950'
                        : 'bg-slate-950 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {lang.strings.voteBtn}
                </button>
              </div>
            )}

            {/* Online Reveal */}
            {onlineScreen === 'REVEAL' && lobbyState && currentPlayer && (
              <div
                className={`p-6 border rounded-3xl space-y-4 text-center ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h3 className={`font-black text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {lobbyState.winner === 'INNOCENTS' ? lang.strings.innocentsWin : lang.strings.impostersWin}
                </h3>
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                  <span className="text-xs text-slate-400 block">{lang.strings.secretWord}</span>
                  <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {lobbyState.secretWord}
                  </span>
                </div>
                {currentPlayer.isHost && (
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch(`/api/lobby/${lobbyCode}/next-round`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ playerId: currentPlayer.id }),
                      });
                    }}
                    className={`w-full py-4 font-extrabold rounded-2xl cursor-pointer ${
                      isDark ? 'bg-slate-100 text-slate-950' : 'bg-slate-950 text-white'
                    }`}
                  >
                    {lang.strings.nextRound}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Structured SEO Footer & Content Hub (Subtle, non-intrusive to gameplay) */}
      {(playMode === 'PASS_PHONE' || onlineScreen === 'CHOICE' || onlineScreen === 'LOBBY') && (
        <SeoFooter
          isDark={isDark}
          onNavigate={handleNavigate}
          onSelectLanguage={handleLanguageChange}
        />
      )}
    </div>
  );
}
