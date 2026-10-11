import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Play,
  Share2,
  Check,
  Shield,
  Users,
  Flame,
  Globe,
  HelpCircle,
  Eye,
  MessageSquare,
  Vote,
  Trophy,
} from 'lucide-react';
import { LANGUAGES, DEFAULT_LANGUAGE, LanguageData } from '../data/languages.ts';
import { generateSoftwareApplicationJsonLd } from '../data/seoArticles.ts';

interface LocalizedHowToPlayViewProps {
  langCode: string;
  isDark: boolean;
  onNavigate: (path: string) => void;
  onSelectLanguage?: (code: string) => void;
}

export const LocalizedHowToPlayView: React.FC<LocalizedHowToPlayViewProps> = ({
  langCode,
  isDark,
  onNavigate,
  onSelectLanguage,
}) => {
  const lang: LanguageData = LANGUAGES[langCode] || LANGUAGES[DEFAULT_LANGUAGE];
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync document head, lang, dir, canonical, and hreflang tags
  useEffect(() => {
    const prevTitle = document.title;
    const prevDir = document.documentElement.dir;
    const prevLang = document.documentElement.lang;

    // 1. Set HTML direction & language
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = lang.code;

    // 2. Set document title & description
    const pageTitle = `${lang.strings.howToPlayTitle} - ${lang.strings.appTitle}`;
    const pageDesc = `${lang.strings.appTagline}. 1. ${lang.strings.rule1} 2. ${lang.strings.rule2} 3. ${lang.strings.rule3}`;
    document.title = pageTitle;

    let descMeta = document.querySelector('meta[name="description"]');
    const prevDesc = descMeta?.getAttribute('content') || '';
    if (descMeta) {
      descMeta.setAttribute('content', pageDesc);
    } else {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      descMeta.setAttribute('content', pageDesc);
      document.head.appendChild(descMeta);
    }

    // 3. OpenGraph Tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateMeta('og:title', pageTitle);
    updateOrCreateMeta('og:description', pageDesc);
    updateOrCreateMeta('og:url', window.location.href);
    updateOrCreateMeta('og:type', 'article');
    updateOrCreateMeta('og:locale', lang.code);

    // 4. Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}/${lang.code}/how-to-play`);

    // 5. Dynamic Hreflang Tags
    const hreflangClass = 'i18n-seo-hreflang';
    document.querySelectorAll(`.${hreflangClass}`).forEach((el) => el.remove());

    Object.keys(LANGUAGES).forEach((code) => {
      const link = document.createElement('link');
      link.className = hreflangClass;
      link.rel = 'alternate';
      link.hreflang = code;
      link.href = `${window.location.origin}/${code}/how-to-play`;
      document.head.appendChild(link);
    });

    const xDefault = document.createElement('link');
    xDefault.className = hreflangClass;
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = `${window.location.origin}/how-to-play-imposter`;
    document.head.appendChild(xDefault);

    // 6. Schema.org JSON-LD
    const scriptId = 'i18n-howto-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = [
      generateSoftwareApplicationJsonLd(window.location.origin),
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: pageTitle,
        description: pageDesc,
        inLanguage: lang.code,
        step: [
          {
            '@type': 'HowToStep',
            name: lang.strings.passThePhone,
            text: lang.strings.rule1,
          },
          {
            '@type': 'HowToStep',
            name: lang.strings.firstSpeaker,
            text: lang.strings.rule2,
          },
          {
            '@type': 'HowToStep',
            name: lang.strings.votingTitle,
            text: lang.strings.rule3,
          },
        ],
      },
    ];
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      document.title = prevTitle;
      document.documentElement.dir = prevDir;
      document.documentElement.lang = prevLang;
      if (descMeta && prevDesc) {
        descMeta.setAttribute('content', prevDesc);
      }
      document.querySelectorAll(`.${hreflangClass}`).forEach((el) => el.remove());
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [lang]);

  const handleShare = async () => {
    const url = `${window.location.origin}/${lang.code}/how-to-play`;
    if (navigator.share && navigator.canShare?.({ url })) {
      try {
        await navigator.share({
          title: `${lang.strings.howToPlayTitle} - ${lang.strings.appTitle}`,
          text: lang.strings.appTagline,
          url,
        });
        return;
      } catch {
        // clipboard fallback
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleStartGameClick = () => {
    if (onSelectLanguage) {
      onSelectLanguage(lang.code);
    }
    onNavigate(`/${lang.code}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      dir={lang.dir}
      className={`min-h-screen transition-colors ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
    >
      {/* Sticky Header with Localized CTA */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
          isDark ? 'bg-slate-950/85 border-slate-800' : 'bg-white/85 border-slate-200 shadow-xs'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleStartGameClick}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-900'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className={`w-4 h-4 ${lang.dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{lang.nativeName}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'border-slate-800 text-slate-300 hover:bg-slate-900'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Share"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleStartGameClick}
              className="px-4 py-2 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{lang.strings.startGame}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <article className="space-y-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleStartGameClick}
              className="hover:underline cursor-pointer"
            >
              {lang.strings.appTitle}
            </button>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              {lang.strings.howToPlayTitle}
            </span>
            <span>/</span>
            <span className="truncate max-w-[200px]">{lang.nativeName}</span>
          </nav>

          {/* Article Header */}
          <header className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none">{lang.flag}</span>
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {lang.name} • {lang.nativeName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {lang.strings.howToPlayTitle} — {lang.strings.appTitle}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {lang.strings.appTagline}. {lang.strings.passThePhoneDesc}
            </p>
          </header>

          {/* Quick Play Callout Card */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              isDark
                ? 'bg-gradient-to-br from-slate-900 to-slate-900/60 border-slate-800'
                : 'bg-gradient-to-br from-amber-50/70 to-orange-50/40 border-amber-200/80 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {lang.strings.passAndPlay} &amp; {lang.strings.playOnline}
                  </span>
                </div>
                <h2 className="text-base font-extrabold">{lang.strings.startGame}</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {lang.strings.onlineRoomsDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={handleStartGameClick}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl font-black text-sm bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{lang.strings.startGame}</span>
              </button>
            </div>
          </div>

          {/* The 3 Core Rules */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              {lang.strings.howToPlayTitle}
            </h2>

            <div className="grid grid-cols-1 gap-3">
              <div
                className={`p-4 sm:p-5 rounded-2xl border ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base mb-1">{lang.strings.passThePhone}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lang.strings.rule1}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 sm:p-5 rounded-2xl border ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base mb-1">{lang.strings.firstSpeaker}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lang.strings.rule2}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 sm:p-5 rounded-2xl border ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base mb-1">{lang.strings.votingTitle}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lang.strings.rule3}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Roles Breakdown: Innocent vs Imposter */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              {lang.strings.yourRole}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Innocent Card */}
              <div
                className={`p-5 rounded-3xl border space-y-3 ${
                  isDark ? 'bg-emerald-950/30 border-emerald-800/60' : 'bg-emerald-50/60 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    🛡️ {lang.strings.innocent}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {lang.strings.secretWord}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {lang.strings.innocentInstructions}
                </p>
              </div>

              {/* Imposter Card */}
              <div
                className={`p-5 rounded-3xl border space-y-3 ${
                  isDark ? 'bg-rose-950/30 border-rose-800/60' : 'bg-rose-50/60 border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-600 dark:text-rose-400">
                    🕵️ {lang.strings.imposter}
                  </span>
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {lang.strings.unknownWord}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {lang.strings.imposterInstructions}
                </p>
              </div>
            </div>
          </section>

          {/* Gameplay Mechanics Walkthrough */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {lang.strings.passAndPlay} &amp; {lang.strings.onlineRooms}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="font-bold flex items-center gap-1.5 mb-1.5">
                  <Eye className="w-4 h-4 text-amber-500" />
                  {lang.strings.tapToReveal}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {lang.strings.holdToReveal}
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="font-bold flex items-center gap-1.5 mb-1.5">
                  <MessageSquare className="w-4 h-4 text-sky-500" />
                  {lang.strings.firstSpeaker}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {lang.strings.firstSpeakerWarning}
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="font-bold flex items-center gap-1.5 mb-1.5">
                  <Vote className="w-4 h-4 text-purple-500" />
                  {lang.strings.votingTitle}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {lang.strings.votingSubtitle}
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="font-bold flex items-center gap-1.5 mb-1.5">
                  <Trophy className="w-4 h-4 text-emerald-500" />
                  {lang.strings.innocentsWin} / {lang.strings.impostersWin}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {lang.strings.imposterGuessTitle}: {lang.strings.imposterGuessSubtitle}
                </p>
              </div>
            </div>
          </section>

          {/* Multi-Language Directory Grid in Article */}
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              {lang.strings.selectLanguage} ({Object.keys(LANGUAGES).length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
              {Object.entries(LANGUAGES).map(([code, lData]) => (
                <a
                  key={code}
                  href={`/${code}/how-to-play`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSelectLanguage) onSelectLanguage(code);
                    onNavigate(`/${code}/how-to-play`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                    code === lang.code
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                      : isDark
                      ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-300'
                      : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span>{lData.flag}</span>
                    <span className="truncate">{lData.nativeName}</span>
                  </span>
                  <span className="text-[10px] uppercase opacity-70">{lData.code}</span>
                </a>
              ))}
            </div>
          </section>

          {/* Bottom CTA Box */}
          <section className="pt-6 text-center">
            <div
              className={`p-8 rounded-3xl border transition-all ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-black mb-2">{lang.strings.appTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                {lang.strings.appTagline} • {lang.strings.passAndPlayDesc}
              </p>
              <button
                type="button"
                onClick={handleStartGameClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg cursor-pointer transition-all active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{lang.strings.startGame} ({lang.nativeName})</span>
              </button>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
};
