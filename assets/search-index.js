/**
 * search-index.js
 * Builds and caches a searchable index of every article across every
 * knowledge-sharing collection (both Indonesian and English folders) by
 * reading the same GitHub contents/raw API already used by the article
 * pages. Results are cached in sessionStorage for a few minutes to avoid
 * hammering GitHub's unauthenticated rate limit.
 */
(function (global) {
  const REPO = 'jagatbatara-tech/web-jagat-batara';
  const BRANCH = 'main';
  const CACHE_KEY = 'jb-search-index-v3';
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

  // base -> { page, folderId, folderEn, labelId, labelEn }
  const COLLECTIONS = [
    { base: 'studi-kasus', page: 'studi-kasus.html', labelId: 'Studi Kasus', labelEn: 'Case Study' },
    { base: 'supply-chain', page: 'supply-chain.html', labelId: 'Supply Chain Insights', labelEn: 'Supply Chain Insights' },
    { base: 'data-storytelling', page: 'data-storytelling.html', labelId: 'Data Storytelling', labelEn: 'Data Storytelling' },
    { base: 'ai', page: 'ai.html', labelId: 'n8n & Automation', labelEn: 'n8n & Automation' },
    { base: 'day-in-my-life', page: 'day-in-my-life.html', labelId: 'Day in My Life', labelEn: 'Day in My Life' }
  ];

  // Standalone tool pages that have no .md file. One HTML file serves both
  // languages, so it is listed here for the search index and the archive pages.
  const EXTRA_ARTICLES = [
    {
      file: 'supply-chain-en/How much safety stock is enough.html',
      collections: ['supply-chain', 'studi-kasus'],
      icon: 'warehouse',
      date: '2026-10-14',
      en: {
        title: 'How much safety stock is enough?',
        kicker: 'Inventory education · Interactive simulation model',
        summary: 'Size safety stock with standard formulas, then stress-test it across hundreds of simulated years.',
        tags: ['Safety Stock', 'Inventory', 'Monte Carlo'],
        keywords: 'safety stock, reorder point, min-max, EOQ, service level, fill rate, Monte Carlo, inventory policy'
      },
      id: {
        title: 'Berapa safety stock yang cukup?',
        kicker: 'Edukasi persediaan · Model simulasi interaktif',
        summary: 'Hitung safety stock dengan rumus standar, lalu uji ketahanannya pada ratusan tahun simulasi.',
        tags: ['Safety Stock', 'Persediaan', 'Monte Carlo'],
        keywords: 'safety stock, reorder point, min-max, EOQ, service level, fill rate, Monte Carlo, inventory policy'
      }
    }
  ];

  function extraUrl(extra, lang) {
    return extra.file.split('/').map(encodeURIComponent).join('/') + '?lang=' + lang;
  }

  function parsePost(raw) {
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (!match) return { fm: {}, body: raw };
    let fm = {};
    try { fm = (global.jsyaml || window.jsyaml).load(match[1]) || {}; }
    catch (e) { /* ignore malformed front matter */ }
    return { fm: fm, body: match[2] || '' };
  }

  function stripMarkdown(text) {
    return (text || '').replace(/[#*`_>\[\]!]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  async function fetchCollection(collection, lang) {
    const folder = lang === 'en' ? collection.base + '-en' : collection.base;
    const listUrl = 'https://api.github.com/repos/' + REPO + '/contents/' + folder;
    let files;
    try {
      const res = await fetch(listUrl);
      if (!res.ok) return [];
      files = await res.json();
      if (!Array.isArray(files)) return [];
    } catch (e) { return []; }

    const articleFiles = files.filter(function (f) {
      return f.name && /\.(md|html)$/i.test(f.name) &&
        !EXTRA_ARTICLES.some(function (x) { return x.file === folder + '/' + f.name; });
    });
    const entries = [];
    await Promise.all(articleFiles.map(async function (file) {
      try {
        const raw = await (await fetch(file.download_url)).text();
        const isMarkdown = /\.md$/i.test(file.name);
        let entry;

        if (isMarkdown) {
          const parsed = parsePost(raw);
          const fm = parsed.fm || {};
          entry = {
            title: fm.title || file.name,
            summary: fm.summary || '',
            tags: (fm.tags || []).join(' '),
            kicker: fm.kicker || '',
            body: stripMarkdown(parsed.body).slice(0, 4000),
            date: fm.date || '',
            url: collection.page + '?post=' + encodeURIComponent(file.name) + (lang === 'id' ? '&lang=id' : '')
          };
        } else {
          const doc = new DOMParser().parseFromString(raw, 'text/html');
          const content = (doc.querySelector('main, article') || doc.body).cloneNode(true);
          content.querySelectorAll('script, style, noscript, nav, footer').forEach(function (node) {
            node.remove();
          });
          const heading = content.querySelector('h1');
          const description = doc.querySelector('meta[name="description"]');
          entry = {
            title: (heading && heading.textContent.trim()) || doc.title || file.name,
            summary: (description && description.content) || '',
            tags: '',
            kicker: '',
            body: content.textContent.replace(/\s+/g, ' ').trim().slice(0, 4000),
            date: '',
            url: folder + '/' + encodeURIComponent(file.name)
          };
        }

        entry.collectionLabel = lang === 'en' ? collection.labelEn : collection.labelId;
        entries.push(entry);
      } catch (e) { /* skip unreadable file */ }
    }));
    return entries;
  }

  async function buildIndex(lang) {
    const cacheKey = CACHE_KEY + ':' + lang;
    try {
      const cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
      if (cached && (Date.now() - cached.ts) < CACHE_TTL_MS) return cached.entries;
    } catch (e) { /* ignore cache errors */ }

    const results = await Promise.all(COLLECTIONS.map(function (c) { return fetchCollection(c, lang); }));
    const entries = [].concat.apply([], results);
    COLLECTIONS.forEach(function (c) {
      EXTRA_ARTICLES.forEach(function (x) {
        if (x.collections.indexOf(c.base) === -1) return;
        const text = x[lang];
        entries.push({
          title: text.title,
          summary: text.summary,
          tags: text.tags.join(' ') + ' ' + text.keywords,
          kicker: text.kicker,
          body: '',
          date: x.date,
          url: extraUrl(x, lang),
          collectionLabel: lang === 'en' ? c.labelEn : c.labelId
        });
      });
    });

    try { sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), entries: entries })); }
    catch (e) { /* storage full / disabled, ignore */ }

    return entries;
  }

  function search(entries, query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return entries
      .map(function (entry) {
        const haystacks = [
          [entry.title, 5],
          [entry.summary, 3],
          [entry.tags, 2],
          [entry.kicker, 2],
          [entry.body, 1]
        ];
        let score = 0;
        haystacks.forEach(function (pair) {
          const text = (pair[0] || '').toLowerCase();
          if (text.indexOf(q) !== -1) score += pair[1];
        });
        return { entry: entry, score: score };
      })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 25)
      .map(function (r) { return r.entry; });
  }

  global.JBSearch = { buildIndex: buildIndex, search: search, COLLECTIONS: COLLECTIONS, EXTRA_ARTICLES: EXTRA_ARTICLES, extraUrl: extraUrl };
})(window);
