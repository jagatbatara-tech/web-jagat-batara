window.Bilingual = (() => {
  const DEFAULT_LANG = 'id';
  const currentLang = new URLSearchParams(window.location.search).get('lang') || DEFAULT_LANG;

  async function translateText(text) {
    if (!text || currentLang !== 'en') return text;
    const clean = String(text).trim();
    if (!clean) return text;

    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(clean) + '&langpair=id|en';

    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) return text;
      const data = await res.json();
      return data?.responseData?.translatedText || data?.matches?.[0]?.translation || text;
    } catch (error) {
      console.warn('Translation failed:', error);
      return text;
    }
  }

  async function translateChunked(text) {
    if (!text || currentLang !== 'en') return text;

    const chunks = [];
    const size = 1200;
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }

    const translated = [];
    for (const chunk of chunks) {
      translated.push(await translateText(chunk));
    }

    return translated.join('');
  }

  async function translateFrontMatter(fm) {
    if (!fm || currentLang !== 'en') return fm;
    const out = { ...fm };

    if (out.title) out.title = await translateText(out.title);
    if (out.kicker) out.kicker = await translateText(out.kicker);
    if (out.summary) out.summary = await translateText(out.summary);
    if (out.disclaimer) out.disclaimer = await translateText(out.disclaimer);

    if (Array.isArray(out.tags)) {
      out.tags = await Promise.all(out.tags.map(async (item) => await translateText(String(item))));
    }

    if (Array.isArray(out.tech_stack)) {
      out.tech_stack = await Promise.all(out.tech_stack.map(async (item) => await translateText(String(item))));
    }

    if (Array.isArray(out.hero_stats)) {
      out.hero_stats = await Promise.all(out.hero_stats.map(async (item) => {
        const copy = { ...item };
        if (copy.value) copy.value = await translateText(String(copy.value));
        if (copy.label) copy.label = await translateText(String(copy.label));
        return copy;
      }));
    }

    if (Array.isArray(out.impact_summary)) {
      out.impact_summary = await Promise.all(out.impact_summary.map(async (item) => {
        const copy = { ...item };
        if (copy.value) copy.value = await translateText(String(copy.value));
        if (copy.label) copy.label = await translateText(String(copy.label));
        return copy;
      }));
    }

    return out;
  }

  async function translateBody(body) {
    if (!body || currentLang !== 'en') return body;
    return await translateChunked(body);
  }

  return { currentLang, translateText, translateChunked, translateFrontMatter, translateBody };
})();
