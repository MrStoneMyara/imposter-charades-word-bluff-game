import React, { useState } from 'react';
import { Eye, ArrowRight, RotateCcw, Target, Trophy, HelpCircle, Zap, ArrowLeft } from 'lucide-react';
import { LanguageData, WordItem } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';
import { ClueDifficulty } from './GameOptionsCard.tsx';

interface PassAndPlayGameProps {
  players: string[];
  selectedCategories: string[];
  imposterCount: number;
  enableClues: boolean;
  clueDifficulty: ClueDifficulty;
  giveHardClueIfFirst: boolean;
  lang: LanguageData;
  isDark: boolean;
  soundEnabled: boolean;
  onExit: () => void;
}

export const PassAndPlayGame: React.FC<PassAndPlayGameProps> = ({
  players: rawPlayers,
  selectedCategories,
  imposterCount,
  enableClues,
  clueDifficulty,
  giveHardClueIfFirst,
  lang,
  isDark,
  soundEnabled,
  onExit,
}) => {
  // Normalize player names (if user left inputs empty, use Player 1, Player 2...)
  const players = rawPlayers.map((p, i) => (p.trim() ? p.trim() : `Player ${i + 1}`));

  // Game states: 'PASS_REVEAL' | 'DEBATE' | 'VOTING' | 'IMPOSTER_GUESS' | 'RESULTS'
  const [gameState, setGameState] = useState<'PASS_REVEAL' | 'DEBATE' | 'VOTING' | 'IMPOSTER_GUESS' | 'RESULTS'>('PASS_REVEAL');
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const s: Record<string, number> = {};
    players.forEach((p) => {
      s[p] = 0;
    });
    return s;
  });
  const [roundNumber, setRoundNumber] = useState(1);

  // Active round data generator
  const generateRoundData = () => {
    const validCats = selectedCategories.filter((c) => lang.words[c] && lang.words[c].length > 0);
    const chosenCatKey = validCats.length > 0
      ? validCats[Math.floor(Math.random() * validCats.length)]
      : Object.keys(lang.words)[0];

    const wordList = lang.words[chosenCatKey] || lang.words.objects;
    const pickedItem: WordItem = wordList[Math.floor(Math.random() * wordList.length)];
    const word = typeof pickedItem === 'string' ? pickedItem : pickedItem.word;

    // Determine the clue text based on settings
    let clueText = '';
    const clues = pickedItem.clues;
    if (clues) {
      clueText = clues[clueDifficulty] || clues.medium || clues.easy || '';
    } else if (pickedItem.hint) {
      clueText = pickedItem.hint;
    }

    // Hard clue fallback for "give hard clue if first"
    const hardClueText = clues?.hard || clues?.medium || pickedItem.hint || clueText;

    const catName = lang.categories[chosenCatKey] || chosenCatKey;

    // Imposters (cannot be majority)
    const maxAllowed = Math.max(1, Math.floor((players.length - 1) / 2));
    const targetImposterCount = Math.min(imposterCount, maxAllowed);
    const shuffledIndices = [...Array(players.length).keys()].sort(() => Math.random() - 0.5);
    const imposterIndices = shuffledIndices.slice(0, targetImposterCount);

    const speakerIdx = Math.floor(Math.random() * players.length);

    return {
      catName,
      word,
      clueText,
      hardClueText,
      imposterIndices,
      speakerIdx,
      isImposterFirst: imposterIndices.includes(speakerIdx),
    };
  };

  const [roundData, setRoundData] = useState(generateRoundData);
  const [currentRevealPlayerIdx, setCurrentRevealPlayerIdx] = useState(0);
  const [cardPeeking, setCardPeeking] = useState(false);

  // Voting & outcome
  const [selectedSuspect, setSelectedSuspect] = useState('');
  const [imposterGuess, setImposterGuess] = useState('');
  const [guessCorrect, setGuessCorrect] = useState(false);
  const [winner, setWinner] = useState<'INNOCENTS' | 'IMPOSTERS'>('INNOCENTS');

  const dir = lang.dir;

  const handlePassToNext = () => {
    setCardPeeking(false);
    if (currentRevealPlayerIdx + 1 < players.length) {
      setCurrentRevealPlayerIdx(currentRevealPlayerIdx + 1);
      if (soundEnabled) playSound('tap');
    } else {
      setGameState('DEBATE');
      if (soundEnabled) playSound('reveal');
    }
  };

  const [accusedImposterIdx, setAccusedImposterIdx] = useState<number | null>(null);

  const handleCastVote = () => {
    if (!selectedSuspect) return;
    const caughtIdx = roundData.imposterIndices.find((idx) => players[idx] === selectedSuspect);
    const isImposterCaught = caughtIdx !== undefined;

    if (isImposterCaught) {
      setAccusedImposterIdx(caughtIdx);
      setGameState('IMPOSTER_GUESS');
      if (soundEnabled) playSound('vote');
    } else {
      setWinner('IMPOSTERS');
      setScores((prev) => {
        const next = { ...prev };
        roundData.imposterIndices.forEach((impIdx) => {
          const impName = players[impIdx];
          next[impName] = (next[impName] || 0) + 1;
        });
        return next;
      });
      setGameState('RESULTS');
      if (soundEnabled) playSound('defeat');
    }
  };

  const handleImposterGuessSubmit = () => {
    const cleanGuess = imposterGuess.trim().toLowerCase();
    const actual = roundData.word.trim().toLowerCase();
    const isCorrect = cleanGuess === actual || (cleanGuess.length >= 3 && actual.includes(cleanGuess));

    setGuessCorrect(isCorrect);
    if (isCorrect) {
      setWinner('IMPOSTERS');
      setScores((prev) => {
        const next = { ...prev };
        roundData.imposterIndices.forEach((impIdx) => {
          const impName = players[impIdx];
          next[impName] = (next[impName] || 0) + 2;
        });
        return next;
      });
      if (soundEnabled) playSound('defeat');
    } else {
      setWinner('INNOCENTS');
      setScores((prev) => {
        const next = { ...prev };
        players.forEach((p, idx) => {
          if (!roundData.imposterIndices.includes(idx)) next[p] = (next[p] || 0) + 1;
        });
        return next;
      });
      if (soundEnabled) playSound('victory');
    }
    setGameState('RESULTS');
  };

  const handleSkipGuess = () => {
    setGuessCorrect(false);
    setWinner('INNOCENTS');
    setScores((prev) => {
      const next = { ...prev };
      players.forEach((p, idx) => {
        if (!roundData.imposterIndices.includes(idx)) next[p] = (next[p] || 0) + 1;
      });
      return next;
    });
    setGameState('RESULTS');
    if (soundEnabled) playSound('victory');
  };

  const handleNextRound = () => {
    setRoundNumber((r) => r + 1);
    setRoundData(generateRoundData());
    setCurrentRevealPlayerIdx(0);
    setCardPeeking(false);
    setSelectedSuspect('');
    setImposterGuess('');
    setAccusedImposterIdx(null);
    setGameState('PASS_REVEAL');
    if (soundEnabled) playSound('tap');
  };

  // Determine what the player sees:
  const isPlayerImposter = roundData.imposterIndices.includes(currentRevealPlayerIdx);
  const shouldShowClue = isPlayerImposter && (enableClues || (giveHardClueIfFirst && roundData.isImposterFirst));
  const activeClue = enableClues ? roundData.clueText : roundData.hardClueText;
  const imposterTitle = (() => {
    const match = lang.strings.unknownWord?.match(/\((.*)\)/);
    if (match && match[1]) return match[1];
    return lang.strings.theImposter || lang.strings.imposter || 'You are the Imposter';
  })();

  // 1. PASS & REVEAL PHASE
  if (gameState === 'PASS_REVEAL') {
    const currentPlayer = players[currentRevealPlayerIdx];

    return (
      <div className="w-full max-w-md mx-auto space-y-5 animate-in fade-in duration-200" dir={dir}>
        {/* Pass Phone Banner */}
        <div
          className={`p-6 rounded-3xl border text-center space-y-2 shadow-xs ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}
        >
          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block">
            {lang.strings.passPhoneTo}
          </span>
          <h2 className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currentPlayer}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {lang.strings.discreetlyPassNotice}
          </p>
        </div>

        {/* Peek Card (Streamlined & clutter-free) */}
        <button
          type="button"
          onPointerDown={() => {
            setCardPeeking(true);
            if (soundEnabled) playSound('reveal');
          }}
          onPointerUp={() => {
            setCardPeeking(false);
            if (soundEnabled) playSound('hide');
          }}
          className={`w-full min-h-[260px] p-6 rounded-3xl border-2 transition-all select-none flex flex-col items-center justify-center text-center cursor-pointer shadow-md ${
            cardPeeking
              ? isPlayerImposter
                ? isDark
                  ? 'bg-rose-950/60 border-rose-500 text-rose-100'
                  : 'bg-rose-50 border-rose-400 text-rose-950'
                : isDark
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100'
                : 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : isDark
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          {cardPeeking ? (
            <div className="space-y-4 flex flex-col items-center justify-center">
              {isPlayerImposter ? (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300/80 dark:border-rose-700/80 text-xs font-black tracking-wider uppercase">
                    <span>🕵️</span>
                    <span>{lang.strings.imposter}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-3xl font-black text-rose-600 dark:text-rose-400 block tracking-tight">
                      {imposterTitle}
                    </span>
                    {shouldShowClue && activeClue && (
                      <span className="text-sm font-semibold text-rose-700/90 dark:text-rose-300/90 block">
                        {lang.strings.clue}: {activeClue}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/80 text-xs font-black tracking-wider uppercase">
                    <span>🛡️</span>
                    <span>{lang.strings.innocent}</span>
                  </div>

                  <div>
                    <span className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 block tracking-tight">
                      {roundData.word}
                    </span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-700 dark:text-slate-300">
                <Eye className="w-7 h-7" />
              </div>
              <span className={`font-bold text-base block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang.strings.holdToReveal}
              </span>
            </div>
          )}
        </button>

        {/* Pass to Next Button */}
        <div>
          <button
            type="button"
            onClick={handlePassToNext}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-100 text-slate-900 hover:bg-white active:scale-[0.98]'
                : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]'
            }`}
          >
            <span>
              {currentRevealPlayerIdx + 1 < players.length
                ? `${lang.strings.nextPlayer} (${players[currentRevealPlayerIdx + 1]})`
                : lang.strings.startDebate}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. DEBATE & CLUES PHASE
  if (gameState === 'DEBATE') {
    return (
      <div className="w-full max-w-md mx-auto space-y-5 animate-in fade-in duration-200" dir={dir}>
        <div
          className={`p-6 rounded-3xl border text-center space-y-3 shadow-xs ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="inline-block px-3 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-full">
            🗣️ {lang.strings.firstSpeaker}: {players[roundData.speakerIdx]}
          </div>
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang.strings.clueDiscussionRound}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            {lang.strings.turnNotice}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            {players.map((p, idx) => (
              <span
                key={p}
                className={`text-xs px-3 py-1.5 rounded-xl border font-semibold ${
                  idx === roundData.speakerIdx
                    ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                    : isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {idx + 1}. {p} {idx === roundData.speakerIdx && '⭐'}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setGameState('RESULTS');
            if (soundEnabled) playSound('reveal');
          }}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
            isDark
              ? 'bg-rose-500 hover:bg-rose-600 text-white active:scale-[0.98]'
              : 'bg-rose-600 hover:bg-rose-700 text-white active:scale-[0.98]'
          }`}
        >
          <Eye className="w-5 h-5" />
          <span>{lang.strings.revealImposter}</span>
        </button>
      </div>
    );
  }

  // 3. VOTING PHASE
  if (gameState === 'VOTING') {
    return (
      <div className="w-full max-w-md mx-auto space-y-5 animate-in fade-in duration-200" dir={dir}>
        <div
          className={`p-6 rounded-3xl border text-center space-y-2 shadow-xs ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}
        >
          <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang.strings.votingTitle}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {lang.strings.votingSubtitle}
          </p>
        </div>

        <div className="space-y-2">
          {players.map((p) => {
            const isSelected = selectedSuspect === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setSelectedSuspect(p);
                  if (soundEnabled) playSound('tap');
                }}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-slate-100 text-slate-900 border-white shadow-md'
                      : 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : isDark
                    ? 'bg-slate-900 text-slate-100 border-slate-800 hover:bg-slate-800'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
                }`}
              >
                <span className="font-bold text-sm">{p}</span>
                {isSelected && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
                    }`}
                  >
                    {lang.strings.suspect}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!selectedSuspect}
          onClick={handleCastVote}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
            selectedSuspect
              ? isDark
                ? 'bg-slate-100 text-slate-900 hover:bg-white active:scale-[0.98]'
                : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Target className="w-5 h-5" />
          <span>
            {dir === 'rtl' ? `האשם את ${selectedSuspect || 'השחקן'}` : `Accuse ${selectedSuspect || 'Player'}`}
          </span>
        </button>
      </div>
    );
  }

  // 4. IMPOSTER GUESS PHASE
  if (gameState === 'IMPOSTER_GUESS') {
    return (
      <div className="w-full max-w-md mx-auto space-y-5 animate-in fade-in duration-200" dir={dir}>
        <div
          className={`p-6 rounded-3xl border text-center space-y-4 shadow-xs ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}
        >
          <HelpCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang.strings.imposterGuessTitle}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {accusedImposterIdx !== null ? players[accusedImposterIdx] : 'Imposter'}{' '}
            {dir === 'rtl'
              ? 'נתפס! יש לו הזדמנות אחת לנחש את המילה ולנצח.'
              : 'was caught! They have ONE guess to name the secret word and steal victory.'}
          </p>

          <input
            key="pass-imposter-guess"
            type="text"
            value={imposterGuess}
            onChange={(e) => setImposterGuess(e.target.value)}
            placeholder={dir === 'rtl' ? 'כתוב את ניחוש המילה...' : 'Type word guess...'}
            className={`w-full border rounded-2xl px-4 py-3 text-center text-lg font-bold focus:outline-none ${
              isDark
                ? 'bg-slate-950 border-slate-700 text-white focus:border-amber-400'
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-800'
            }`}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onPointerDown={handleImposterGuessSubmit}
              disabled={!imposterGuess.trim()}
              className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-sm transition-all cursor-pointer"
            >
              {lang.strings.submitGuess}
            </button>
            <button
              type="button"
              onClick={handleSkipGuess}
              className={`py-3 px-4 font-semibold rounded-2xl text-xs cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {dir === 'rtl' ? 'וותר' : 'Give Up'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. RESULTS / REVEAL
  const imposterNames = roundData.imposterIndices.map((i) => players[i]).join(', ');

  return (
    <div className="w-full max-w-md mx-auto space-y-5 animate-in fade-in duration-200" dir={dir}>
      <div
        className={`rounded-3xl p-6 text-center space-y-4 border shadow-sm ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200/90'
        }`}
      >
        <div className="text-5xl">🕵️</div>
        
        {/* Imposter Reveal Section */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block">
            {roundData.imposterIndices.length > 1
              ? lang.strings.theImposters
              : lang.strings.theImposter}
          </span>
          <h2 className="text-3xl font-black text-rose-500">
            {imposterNames}
          </h2>
        </div>

        {/* Word Reveal */}
        <div
          className={`border rounded-2xl p-4 space-y-1 ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang.strings.secretWord}
          </span>
          <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {roundData.word}
          </span>
        </div>

        {/* Quick Score Options for in-person verdict */}
        <div className="pt-1">
          <span className="text-[11px] text-slate-500 block mb-2 font-medium">
            {lang.strings.whoWonRound}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setScores((prev) => {
                  const next = { ...prev };
                  players.forEach((p, idx) => {
                    if (!roundData.imposterIndices.includes(idx)) next[p] = (next[p] || 0) + 1;
                  });
                  return next;
                });
                if (soundEnabled) playSound('victory');
              }}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/40 active:scale-95'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 active:scale-95'
              }`}
            >
              🎉 {lang.strings.innocentsWonBtn}
            </button>
            <button
              type="button"
              onClick={() => {
                setScores((prev) => {
                  const next = { ...prev };
                  roundData.imposterIndices.forEach((impIdx) => {
                    const impName = players[impIdx];
                    next[impName] = (next[impName] || 0) + 2;
                  });
                  return next;
                });
                if (soundEnabled) playSound('defeat');
              }}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? 'bg-rose-950/30 border-rose-800/60 text-rose-400 hover:bg-rose-900/40 active:scale-95'
                  : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 active:scale-95'
              }`}
            >
              😈 {lang.strings.imposterWonBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div
        className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{lang.strings.scoreboard}</span>
        </div>
        <div className="space-y-1.5">
          {players
            .slice()
            .sort((a, b) => (scores[b] || 0) - (scores[a] || 0))
            .map((p, idx) => (
              <div
                key={p}
                className={`flex justify-between p-2.5 rounded-xl border text-sm ${
                  isDark
                    ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-100 text-slate-800'
                }`}
              >
                <span className="font-semibold">
                  #{idx + 1} {p}
                </span>
                <span className="font-bold font-mono text-amber-500">
                  {scores[p] || 0} pts
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={handleNextRound}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-100 text-slate-900 hover:bg-white active:scale-[0.98]'
              : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]'
          }`}
        >
          <RotateCcw className="w-5 h-5" />
          <span>{lang.strings.nextRound}</span>
        </button>

        <button
          type="button"
          onClick={onExit}
          className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          {lang.strings.backToSettings}
        </button>
      </div>
    </div>
  );
};
