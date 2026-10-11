import React from 'react';
import { ArrowUpRight, BookOpen, Sparkles, Users, HelpCircle, ShieldCheck, Globe } from 'lucide-react';
import { LANGUAGES } from '../data/languages.ts';

interface SeoFooterProps {
  isDark: boolean;
  onNavigate: (path: string) => void;
  onSelectLanguage?: (code: string) => void;
}

export const SeoFooter: React.FC<SeoFooterProps> = ({ isDark, onNavigate, onSelectLanguage }) => {
  const handleLinkClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const handleLanguageClick = (code: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectLanguage) {
      onSelectLanguage(code);
    }
    onNavigate(`/${code}`);
  };

  return (
    <footer
      className={`mt-12 pt-10 pb-14 border-t transition-colors ${
        isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200/90 text-slate-600'
      }`}
    >
      <div className="max-w-2xl mx-auto space-y-8 px-2 sm:px-4">
        {/* Quick "How to Play" Semantic Content Section */}
        <section
          aria-label="How to Play Quick Guide"
          className={`p-6 sm:p-7 rounded-3xl border transition-all ${
            isDark
              ? 'bg-slate-900/50 border-slate-800/80'
              : 'bg-white/80 border-slate-200/80 shadow-xs backdrop-blur-xs'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2
              className={`text-base sm:text-lg font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              How to Play Imposter Charades
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed mb-5">
            Imposter Charades is a modern social deduction word bluffing game for 3 to 20+ players.
            Everyone gets a secret word except the imposter. Players give clever single-word clues to prove their innocence without leaking the word.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className={`p-3.5 rounded-2xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800/70' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <h3 className={`text-xs font-bold mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                1. Secret Reveal
              </h3>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Peep your card on one passed phone or join an instant online lobby room.
              </p>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800/70' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <h3 className={`text-xs font-bold mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                <Users className="w-3.5 h-3.5 text-sky-500" />
                2. Clue Round
              </h3>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Take turns saying one subtle clue. Innocents stay mysterious; the imposter bluffs.
              </p>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800/70' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <h3 className={`text-xs font-bold mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                3. Debate & Vote
              </h3>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Discuss who seemed hesitant, vote out the suspect, or see if the imposter guesses right!
              </p>
            </div>
          </div>
        </section>

        {/* Content Hub - Two Distinct Link Columns */}
        <nav aria-label="Game Guides and Comparisons" className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-2">
          {/* Column 1: Top Party Games */}
          <div className="space-y-3">
            <h3
              className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              Top Party Games
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/games-like-spyfall"
                  onClick={handleLinkClick('/games-like-spyfall')}
                  className={`group flex items-center justify-between p-2 rounded-xl border transition-all ${
                    isDark
                      ? 'border-slate-800/60 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900 text-slate-300 hover:text-white'
                      : 'border-slate-200/60 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="font-semibold">Games Like Spyfall &amp; Chameleon</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="/best-party-games-for-groups"
                  onClick={handleLinkClick('/best-party-games-for-groups')}
                  className={`group flex items-center justify-between p-2 rounded-xl border transition-all ${
                    isDark
                      ? 'border-slate-800/60 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900 text-slate-300 hover:text-white'
                      : 'border-slate-200/60 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="font-semibold">Best Party Games for Groups (No Props)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="/icebreaker-games-online"
                  onClick={handleLinkClick('/icebreaker-games-online')}
                  className={`group flex items-center justify-between p-2 rounded-xl border transition-all ${
                    isDark
                      ? 'border-slate-800/60 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900 text-slate-300 hover:text-white'
                      : 'border-slate-200/60 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="font-semibold">Icebreaker Games Online (Instant Free)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="/best-icebreaker-games-for-work"
                  onClick={handleLinkClick('/best-icebreaker-games-for-work')}
                  className={`group flex items-center justify-between p-2 rounded-xl border transition-all ${
                    isDark
                      ? 'border-slate-800/60 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900 text-slate-300 hover:text-white'
                      : 'border-slate-200/60 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="font-semibold">Best Icebreakers for Work &amp; Zoom</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Game Guides & Rules */}
          <div className="space-y-3">
            <h3
              className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              Game Guides &amp; Rules
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/how-to-play-imposter"
                  onClick={handleLinkClick('/how-to-play-imposter')}
                  className={`group flex items-center justify-between p-2 rounded-xl border transition-all ${
                    isDark
                      ? 'border-slate-800/60 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900 text-slate-300 hover:text-white'
                      : 'border-slate-200/60 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="font-semibold">How to Play: Official Imposter Rules</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="/imposter-game-word-list"
                  onClick={handleLinkClick('/imposter-game-word-list')}
                  className={`group flex items-center justify-between p-2 rounded-xl border transition-all ${
                    isDark
                      ? 'border-slate-800/60 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900 text-slate-300 hover:text-white'
                      : 'border-slate-200/60 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="font-semibold">150+ Secret Words &amp; Clue List</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="/imposter-word-generator"
                  onClick={handleLinkClick('/imposter-word-generator')}
                  className={`group flex items-center justify-between p-2 rounded-xl border transition-all ${
                    isDark
                      ? 'border-slate-800/60 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900 text-slate-300 hover:text-white'
                      : 'border-slate-200/60 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="font-semibold">Free Imposter Word Generator</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Crawlable Language Directory (i18n SEO) */}
        <section
          aria-label="Supported Languages Directory"
          className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3
              className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              Supported Languages ({Object.keys(LANGUAGES).length})
            </h3>
            <span className="text-[11px] text-slate-400">Instant Localized Play</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            {Object.entries(LANGUAGES).map(([code, lData]) => (
              <a
                key={code}
                href={`/${code}`}
                onClick={handleLanguageClick(code)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  isDark
                    ? 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 text-slate-300 hover:text-white'
                    : 'border-slate-200/80 bg-white hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 shadow-2xs'
                }`}
                title={`Play Imposter in ${lData.name}`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span className="text-base leading-none">{lData.flag}</span>
                  <span className="font-semibold truncate">{lData.nativeName}</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 ml-1">
                  {lData.shortLabel}
                </span>
              </a>
            ))}
          </div>

          {/* Crawlable Localized Rules Links */}
          <div className="pt-2 text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Localized Rules:
            </span>
            {Object.entries(LANGUAGES).map(([code, lData]) => (
              <a
                key={code}
                href={`/${code}/how-to-play`}
                onClick={handleLinkClick(`/${code}/how-to-play`)}
                className="hover:underline hover:text-amber-600 dark:hover:text-amber-400"
              >
                {lData.nativeName} ({lData.strings.howToPlayTitle})
              </a>
            ))}
          </div>
        </section>

        {/* Brand & Copyright Micro-Footer */}
        <div className="pt-6 border-t border-dashed border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Imposter Charades. Fast, free party word bluffing game.</p>
          <div className="flex items-center gap-4">
            <span>29 Languages Supported</span>
            <span>•</span>
            <span>Zero App Install</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
