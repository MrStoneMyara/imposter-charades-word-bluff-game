import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Play,
  Share2,
  Check,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  ChevronDown,
  ArrowRight,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import {
  SEO_ARTICLES,
  generateSoftwareApplicationJsonLd,
  generateFaqJsonLd,
  generateArticleJsonLd,
} from '../data/seoArticles.ts';

interface SeoArticleViewProps {
  slug: string;
  isDark: boolean;
  onNavigate: (path: string) => void;
}

export const SeoArticleView: React.FC<SeoArticleViewProps> = ({ slug, isDark, onNavigate }) => {
  const article = SEO_ARTICLES[slug] || SEO_ARTICLES['how-to-play-imposter'];
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Dynamic Head tags and Schema.org injection
  useEffect(() => {
    // 1. Update document title
    const prevTitle = document.title;
    document.title = article.seoTitle;

    // 2. Update meta description
    let descMeta = document.querySelector('meta[name="description"]');
    const prevDesc = descMeta?.getAttribute('content') || '';
    if (descMeta) {
      descMeta.setAttribute('content', article.metaDescription);
    } else {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      descMeta.setAttribute('content', article.metaDescription);
      document.head.appendChild(descMeta);
    }

    // 3. Update OG Tags
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

    updateOrCreateMeta('og:title', article.seoTitle);
    updateOrCreateMeta('og:description', article.metaDescription);
    updateOrCreateMeta('og:url', window.location.href);
    updateOrCreateMeta('og:type', 'article');

    // 4. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}/${article.slug}`);

    // 5. Inject / Update Schema.org JSON-LD scripts
    const scriptId = 'seo-article-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = [
      generateSoftwareApplicationJsonLd(window.location.origin),
      generateArticleJsonLd(article, window.location.origin),
      generateFaqJsonLd(article.faqs),
    ];
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      document.title = prevTitle;
      if (descMeta && prevDesc) {
        descMeta.setAttribute('content', prevDesc);
      }
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [article]);

  const handleShare = async () => {
    const url = `${window.location.origin}/${article.slug}`;
    if (navigator.share && navigator.canShare?.({ url })) {
      try {
        await navigator.share({
          title: article.title,
          text: article.metaDescription,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
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

  const handleLinkClick = (targetSlug: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(`/${targetSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sticky Clean Header with prominent Play CTA */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
          isDark ? 'bg-slate-950/85 border-slate-800' : 'bg-white/85 border-slate-200 shadow-xs'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onNavigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-900'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Game</span>
            <span className="sm:hidden">Back</span>
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
              title="Share Article"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Game Now</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Article Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <article className="space-y-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                onNavigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:underline cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">{article.category}</span>
            <span>/</span>
            <span className="truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Article Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {article.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Updated {article.publishedDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {article.summary}
            </p>
          </header>

          {/* Quick Play Card Callout */}
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
                    Zero-Install Party Game
                  </span>
                </div>
                <h2 className="text-base font-extrabold">Ready to play with friends or coworkers?</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Pass one phone or join an instant 4-letter online lobby on any phone or laptop.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl font-black text-sm bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Imposter Free</span>
              </button>
            </div>
          </div>

          {/* Article Sections (H2, H3, paragraphs, lists, callouts) */}
          <div className="space-y-10 pt-4">
            {article.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                    {section.heading}
                  </h2>
                  {section.subheading && (
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {section.subheading}
                    </p>
                  )}
                </div>

                <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <ul className="space-y-2.5 my-3 pl-2">
                    {section.bulletPoints.map((bp, bpIdx) => (
                      <li key={bpIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.callout && (
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border ${
                      isDark ? 'bg-slate-900/70 border-slate-800 text-slate-200' : 'bg-slate-100/90 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider block text-amber-500 mb-1">
                      {section.callout.title}
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed">{section.callout.text}</p>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Frequently Asked Questions (FAQPage Schema markup target) */}
          {article.faqs.length > 0 && (
            <section aria-label="Frequently Asked Questions" className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-amber-500">
                  Got Questions?
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {article.faqs.map((faq, fIdx) => {
                  const isOpen = openFaqIndex === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className={`border rounded-2xl transition-all ${
                        isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white shadow-xs'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(fIdx)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-sm sm:text-base cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-amber-500' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Internal Linking: Related Guides & Articles */}
          {article.relatedSlugs.length > 0 && (
            <section aria-label="Related Guides and Articles" className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Related Guides &amp; Party Games
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {article.relatedSlugs.map((relSlug) => {
                  const relArticle = SEO_ARTICLES[relSlug];
                  if (!relArticle) return null;
                  return (
                    <a
                      key={relSlug}
                      href={`/${relSlug}`}
                      onClick={handleLinkClick(relSlug)}
                      className={`group p-4 rounded-2xl border transition-all ${
                        isDark
                          ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50 shadow-xs'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block mb-1">
                        {relArticle.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors line-clamp-2 mb-2">
                        {relArticle.title}
                      </h3>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{relArticle.readTime}</span>
                        <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                          Read <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* Bottom High-Converting CTA Box */}
          <section className="pt-8 text-center space-y-4">
            <div
              className={`p-8 rounded-3xl border transition-all ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-black mb-2">Start Playing Now — 100% Free</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                No downloads. No account creation. Works instantly across all mobile browsers in 29+ languages.
              </p>
              <button
                type="button"
                onClick={() => {
                  onNavigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg cursor-pointer transition-all active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Imposter Charades Now</span>
              </button>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
};
