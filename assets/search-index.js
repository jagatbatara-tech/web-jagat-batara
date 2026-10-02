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
  const CACHE_KEY = 'jb-search-index-v1';
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

  // base -> { page, folderId, folderEn, labelId, labelEn }
  const COLLECTIONS = [
    { base: 'studi-kasus', page: 'studi-kasus.html', labelId: 'Studi Kasus', labelEn: 'Case Study' },
    { base: 'supply-chain', page: 'supply-chain.html', labelId: 'Supply Chain Insights', labelEn: 'Supply Chain Insights' },
    { base: 'data-storytelling', page: 'data-storytelling.html', labelId: 'Data Storytelling', labelEn: 'Data Storytelling' },
    { base: 'ai', page: 'ai.html', labelId: 'n8n & Automation', labelEn: 'n8n & Automation' },
    { base: 'day-in-my-life', page: 'day-in-my-life.html', labelId: 'Day in My Life', labelEn: 'Day in My Life' }
  ];

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

    const mdFiles = files.filter(function (f) { return f.name && f.name.endsWith('.md'); });
    const entries = [];
    await Promise.all(mdFiles.map(async function (file) {
      try {
        const raw = await (await fetch(file.download_url)).text();
        const parsed = parsePost(raw);
        const fm = parsed.fm || {};
        entries.push({
          title: fm.title || file.name,
          summary: fm.summary || '',
          tags: (fm.tags || []).join(' '),
          kicker: fm.kicker || '',
          body: stripMarkdown(parsed.body).slice(0, 4000),
          date: fm.date || '',
          collectionLabel: lang === 'en' ? collection.labelEn : collection.labelId,
          url: collection.page + '?post=' + encodeURIComponent(file.name) + (lang === 'en' ? '&lang=en' : '')
        });
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

  global.JBSearch = { buildIndex: buildIndex, search: search, COLLECTIONS: COLLECTIONS };
})(window);
