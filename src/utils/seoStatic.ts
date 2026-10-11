import {
  SEO_ARTICLES,
  ALL_SEO_SLUGS,
  SeoArticle,
  generateSoftwareApplicationJsonLd,
  generateArticleJsonLd,
  generateFaqJsonLd,
} from '../data/seoArticles.ts';
import { LANGUAGES, DEFAULT_LANGUAGE, LanguageData } from '../data/languages.ts';

export function generateSitemapXml(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const currentDate = new Date().toISOString().split('T')[0];
  const langCodes = Object.keys(LANGUAGES);

  // 1. Root language cluster (homepage & localized roots)
  const rootAlternates = [
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanBase}/" />`,
    ...langCodes.map(
      (code) =>
        `    <xhtml:link rel="alternate" hreflang="${code}" href="${cleanBase}/${code === DEFAULT_LANGUAGE ? '' : code}" />`
    ),
  ].join('\n');

  const rootEntries = [
    `  <url>
    <loc>${cleanBase}/</loc>
${rootAlternates}
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
    ...langCodes
      .filter((c) => c !== DEFAULT_LANGUAGE)
      .map(
        (code) => `  <url>
    <loc>${cleanBase}/${code}</loc>
${rootAlternates}
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
      ),
  ];

  // 2. How-to-play multi-language cluster
  const howToPlayAlternates = [
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanBase}/how-to-play-imposter" />`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${cleanBase}/how-to-play-imposter" />`,
    ...langCodes
      .filter((code) => code !== 'en')
      .map(
        (code) =>
          `    <xhtml:link rel="alternate" hreflang="${code}" href="${cleanBase}/${code}/how-to-play" />`
      ),
  ].join('\n');

  const howToPlayEntries = [
    `  <url>
    <loc>${cleanBase}/how-to-play-imposter</loc>
${howToPlayAlternates}
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
    ...langCodes
      .filter((code) => code !== 'en')
      .map(
        (code) => `  <url>
    <loc>${cleanBase}/${code}/how-to-play</loc>
${howToPlayAlternates}
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
      ),
  ];

  // 3. Other articles
  const otherSlugs = ALL_SEO_SLUGS.filter((s) => s !== 'how-to-play-imposter');
  const otherEntries = otherSlugs.map((slug) => {
    const art = SEO_ARTICLES[slug];
    return `  <url>
    <loc>${cleanBase}/${slug}</loc>
    <lastmod>${art.publishedDate || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${rootEntries.join('\n')}
${howToPlayEntries.join('\n')}
${otherEntries.join('\n')}
</urlset>`;
}

export function generateRobotsTxt(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return `User-agent: *
Allow: /

Sitemap: ${cleanBase}/sitemap.xml
`;
}

export function renderArticlePrerenderHtml(article: SeoArticle, baseUrl: string): string {
  const sectionsHtml = article.sections
    .map(
      (s) => `
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">${escapeHtml(s.heading)}</h2>
        ${s.subheading ? `<h3 style="font-size: 1rem; color: #d97706; margin-bottom: 0.5rem;">${escapeHtml(s.subheading)}</h3>` : ''}
        ${s.paragraphs.map((p) => `<p style="margin-bottom: 0.75rem; line-height: 1.6;">${escapeHtml(p)}</p>`).join('')}
        ${
          s.bulletPoints && s.bulletPoints.length > 0
            ? `<ul style="list-style-type: disc; padding-left: 1.5rem; margin-bottom: 0.75rem;">
                ${s.bulletPoints.map((b) => `<li style="margin-bottom: 0.35rem;">${escapeHtml(b)}</li>`).join('')}
              </ul>`
            : ''
        }
        ${
          s.callout
            ? `<div style="background-color: #f1f5f9; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                <strong>${escapeHtml(s.callout.title)}</strong>
                <p style="margin-top: 0.25rem;">${escapeHtml(s.callout.text)}</p>
              </div>`
            : ''
        }
      </section>`
    )
    .join('');

  const faqsHtml =
    article.faqs.length > 0
      ? `
      <section style="margin-top: 2.5rem; border-top: 1px solid #e2e8f0; padding-top: 1.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        ${article.faqs
          .map(
            (faq) => `
          <div style="margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem;">${escapeHtml(faq.question)}</h3>
            <p style="line-height: 1.5; color: #475569;">${escapeHtml(faq.answer)}</p>
          </div>`
          )
          .join('')}
      </section>`
      : '';

  const relatedHtml =
    article.relatedSlugs.length > 0
      ? `
      <section style="margin-top: 2rem; border-top: 1px solid #e2e8f0; padding-top: 1.5rem;">
        <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.75rem;">Related Guides & Rules</h3>
        <ul style="list-style-type: none; padding: 0;">
          ${article.relatedSlugs
            .map((slug) => {
              const rel = SEO_ARTICLES[slug];
              if (!rel) return '';
              return `<li style="margin-bottom: 0.5rem;"><a href="/${slug}" style="color: #4f46e5; text-decoration: underline;">${escapeHtml(rel.title)}</a></li>`;
            })
            .join('')}
        </ul>
      </section>`
      : '';

  return `
    <div class="prerendered-article" style="max-width: 48rem; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, sans-serif;">
      <nav style="font-size: 0.875rem; margin-bottom: 1.5rem;">
        <a href="/" style="color: #4f46e5; text-decoration: underline;">Home</a> &gt;
        <span>${escapeHtml(article.category)}</span> &gt;
        <span>${escapeHtml(article.title)}</span>
      </nav>
      <header style="margin-bottom: 2rem;">
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: bold; color: #d97706;">${escapeHtml(article.category)}</span>
        <h1 style="font-size: 2.25rem; font-weight: 900; margin: 0.5rem 0 1rem 0; line-height: 1.2;">${escapeHtml(article.title)}</h1>
        <p style="font-size: 1.125rem; color: #475569; line-height: 1.6;">${escapeHtml(article.summary)}</p>
        <div style="margin-top: 1rem;">
          <a href="/" style="display: inline-block; background-color: #d97706; color: #000; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none;">▶ Play Game Now Free</a>
        </div>
      </header>
      ${sectionsHtml}
      ${faqsHtml}
      ${relatedHtml}
    </div>
  `;
}

export function renderLocalizedHowToPlayHtml(langCode: string, baseUrl: string): string {
  const lang: LanguageData = LANGUAGES[langCode] || LANGUAGES[DEFAULT_LANGUAGE];
  const s = lang.strings;

  return `
    <div dir="${lang.dir}" class="prerendered-localized-guide" style="max-width: 48rem; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, sans-serif;">
      <nav style="font-size: 0.875rem; margin-bottom: 1.5rem;">
        <a href="/${lang.code}" style="color: #4f46e5; text-decoration: underline;">${escapeHtml(s.appTitle)}</a> &gt;
        <span>${escapeHtml(s.howToPlayTitle)}</span> &gt;
        <span>${escapeHtml(lang.nativeName)}</span>
      </nav>
      <header style="margin-bottom: 2rem;">
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: bold; color: #d97706;">${lang.flag} ${escapeHtml(lang.name)} (${escapeHtml(lang.nativeName)})</span>
        <h1 style="font-size: 2.25rem; font-weight: 900; margin: 0.5rem 0 1rem 0; line-height: 1.2;">${escapeHtml(s.howToPlayTitle)} — ${escapeHtml(s.appTitle)}</h1>
        <p style="font-size: 1.125rem; color: #475569; line-height: 1.6;">${escapeHtml(s.appTagline)}. ${escapeHtml(s.passThePhoneDesc)}</p>
        <div style="margin-top: 1rem;">
          <a href="/${lang.code}" style="display: inline-block; background-color: #d97706; color: #000; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none;">▶ ${escapeHtml(s.startGame)}</a>
        </div>
      </header>

      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${escapeHtml(s.howToPlayTitle)}</h2>
        <div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem;">
          <h3 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 0.25rem;">1. ${escapeHtml(s.passThePhone)}</h3>
          <p style="line-height: 1.5; color: #334155;">${escapeHtml(s.rule1)}</p>
        </div>
        <div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem;">
          <h3 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 0.25rem;">2. ${escapeHtml(s.firstSpeaker)}</h3>
          <p style="line-height: 1.5; color: #334155;">${escapeHtml(s.rule2)}</p>
        </div>
        <div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem;">
          <h3 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 0.25rem;">3. ${escapeHtml(s.votingTitle)}</h3>
          <p style="line-height: 1.5; color: #334155;">${escapeHtml(s.rule3)}</p>
        </div>
      </section>

      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${escapeHtml(s.yourRole)}</h2>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div style="padding: 1rem; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.75rem;">
            <strong style="color: #166534;">🛡️ ${escapeHtml(s.innocent)} (${escapeHtml(s.secretWord)})</strong>
            <p style="margin-top: 0.5rem; line-height: 1.5; color: #14532d;">${escapeHtml(s.innocentInstructions)}</p>
          </div>
          <div style="padding: 1rem; background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 0.75rem;">
            <strong style="color: #9f1239;">🕵️ ${escapeHtml(s.imposter)} (${escapeHtml(s.unknownWord)})</strong>
            <p style="margin-top: 0.5rem; line-height: 1.5; color: #881337;">${escapeHtml(s.imposterInstructions)}</p>
          </div>
        </div>
      </section>

      <section style="margin-top: 2rem; border-top: 1px solid #e2e8f0; padding-top: 1.5rem;">
        <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.75rem;">${escapeHtml(s.selectLanguage)}</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${Object.entries(LANGUAGES)
            .map(
              ([code, lData]) =>
                `<a href="/${code}/how-to-play" style="padding: 0.35rem 0.65rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; text-decoration: none; color: #334155; font-size: 0.75rem;">${lData.flag} ${escapeHtml(lData.nativeName)}</a>`
            )
            .join('')}
        </div>
      </section>
    </div>
  `;
}

export function injectLocalizedSeoIntoHtml(
  html: string,
  langCode: string,
  isHowToPlay: boolean,
  baseUrl = 'https://impostergame.app'
): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const lang: LanguageData = LANGUAGES[langCode] || LANGUAGES[DEFAULT_LANGUAGE];
  const s = lang.strings;

  // 1. Update <html lang="..." dir="...">
  let modified = html.replace(
    /<html\s+lang="[^"]*"(?:\s+dir="[^"]*")?>/i,
    `<html lang="${lang.code}" dir="${lang.dir}">`
  );

  const title = isHowToPlay
    ? `${s.howToPlayTitle} - ${s.appTitle}`
    : `${s.appTitle} - ${s.appTagline}`;
  const desc = isHowToPlay
    ? `${s.appTagline}. 1. ${s.rule1} 2. ${s.rule2} 3. ${s.rule3}`
    : `${s.appTagline}. ${s.passThePhoneDesc}. ${s.onlineRoomsDesc}`;
  const canonicalUrl = isHowToPlay
    ? (lang.code === 'en' ? `${cleanBase}/how-to-play-imposter` : `${cleanBase}/${lang.code}/how-to-play`)
    : (lang.code === DEFAULT_LANGUAGE ? `${cleanBase}/` : `${cleanBase}/${lang.code}`);

  // 2. Replace title & meta tags
  modified = modified.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  modified = modified.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(desc)}" />`
  );
  modified = modified.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  modified = modified.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(desc)}" />`
  );

  // 3. Build hreflang tags for all 29 languages
  const hreflangTags = Object.keys(LANGUAGES)
    .map((code) => {
      const targetUrl = isHowToPlay
        ? (code === 'en' ? `${cleanBase}/how-to-play-imposter` : `${cleanBase}/${code}/how-to-play`)
        : `${cleanBase}/${code === DEFAULT_LANGUAGE ? '' : code}`;
      return `<link rel="alternate" hreflang="${code}" href="${targetUrl}" />`;
    })
    .join('\n    ');

  const xDefaultUrl = isHowToPlay
    ? `${cleanBase}/how-to-play-imposter`
    : `${cleanBase}/`;

  // 4. Schema.org JSON-LD
  const structuredData: any[] = [
    generateSoftwareApplicationJsonLd(cleanBase),
  ];

  if (isHowToPlay) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: title,
      description: desc,
      inLanguage: lang.code,
      step: [
        { '@type': 'HowToStep', name: s.passThePhone, text: s.rule1 },
        { '@type': 'HowToStep', name: s.firstSpeaker, text: s.rule2 },
        { '@type': 'HowToStep', name: s.votingTitle, text: s.rule3 },
      ],
    });
  }

  const extraHead = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:locale" content="${lang.code}" />
    <meta property="og:type" content="${isHowToPlay ? 'article' : 'website'}" />
    <link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />
    ${hreflangTags}
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
  `;

  modified = modified.replace('</head>', `${extraHead}\n</head>`);

  // 5. Inject prerendered body for crawlers if how-to-play
  if (isHowToPlay) {
    const prerenderBody = renderLocalizedHowToPlayHtml(lang.code, cleanBase);
    modified = modified.replace(
      '<div id="root"></div>',
      `<div id="root">${prerenderBody}</div>`
    );
  }

  return modified;
}

export function injectSeoIntoHtml(
  html: string,
  article?: SeoArticle,
  baseUrl = 'https://impostergame.app'
): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  if (!article) {
    // Inject root software application schema and hreflangs
    const hreflangTags = Object.keys(LANGUAGES)
      .map(
        (code) =>
          `<link rel="alternate" hreflang="${code}" href="${cleanBase}/${code === DEFAULT_LANGUAGE ? '' : code}" />`
      )
      .join('\n    ');

    const rootSchema = generateSoftwareApplicationJsonLd(cleanBase);
    const extraHead = `
    <link rel="canonical" href="${cleanBase}/" />
    <link rel="alternate" hreflang="x-default" href="${cleanBase}/" />
    ${hreflangTags}
    <script type="application/ld+json">${JSON.stringify(rootSchema)}</script>
    `;
    return html.replace('</head>', `  ${extraHead}\n</head>`);
  }

  const title = article.seoTitle;
  const desc = article.metaDescription;
  const canonicalUrl = `${cleanBase}/${article.slug}`;

  // Replace title
  let modified = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // Replace description
  modified = modified.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(desc)}" />`
  );

  // Replace og:title & og:description
  modified = modified.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  modified = modified.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(desc)}" />`
  );

  // Hreflang for how-to-play articles
  let extraHreflang = '';
  if (article.slug === 'how-to-play-imposter') {
    extraHreflang = Object.keys(LANGUAGES)
      .map(
        (code) =>
          `<link rel="alternate" hreflang="${code}" href="${code === 'en' ? `${cleanBase}/how-to-play-imposter` : `${cleanBase}/${code}/how-to-play`}" />`
      )
      .join('\n    ');
    extraHreflang += `\n    <link rel="alternate" hreflang="x-default" href="${cleanBase}/how-to-play-imposter" />`;
  }

  // Build extra tags
  const structuredData = [
    generateSoftwareApplicationJsonLd(cleanBase),
    generateArticleJsonLd(article, cleanBase),
    generateFaqJsonLd(article.faqs),
  ];

  const extraHead = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    ${extraHreflang}
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
  `;

  modified = modified.replace('</head>', `${extraHead}\n</head>`);

  // Inject prerendered semantic body inside root for crawlers
  const prerenderBody = renderArticlePrerenderHtml(article, cleanBase);
  modified = modified.replace(
    '<div id="root"></div>',
    `<div id="root">${prerenderBody}</div>`
  );

  return modified;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
