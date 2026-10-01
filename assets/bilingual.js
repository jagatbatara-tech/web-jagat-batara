window.Bilingual = {
  currentLang: new URLSearchParams(window.location.search).get('lang') || 'id',
  translateText: async function (text) { return text; },
  translateChunked: async function (text) { return text; },
  translateFrontMatter: async function (frontMatter) { return frontMatter; },
  translateBody: async function (body) { return body; }
};
