(() => {
  const params = new URLSearchParams(window.location.search);
  const currentLang = params.get('lang') === 'id' || document.documentElement.lang === 'id' ? 'id' : 'en';
  document.documentElement.lang = currentLang;

  const base = window.location.pathname.split('/').pop().replace(/\.html$/, '');
  const homepage = base === '' || base === 'index' || base === 'index-en' || base === 'index-id';

  function languageUrl(lang) {
    const mappedUrl = document.body.dataset['language' + lang[0].toUpperCase() + lang.slice(1)];
    if (mappedUrl) {
      const url = new URL(mappedUrl, window.location.href);
      return url.pathname + url.search + url.hash;
    }

    const url = new URL(window.location.href);
    if (homepage) {
      url.pathname = url.pathname.replace(/[^/]*$/, lang === 'id' ? 'index-id.html' : 'index.html');
      url.searchParams.delete('lang');
      url.searchParams.delete('post');
    } else if (lang === 'id') {
      url.searchParams.set('lang', 'id');
      url.searchParams.delete('post');
    } else {
      url.searchParams.delete('lang');
      url.searchParams.delete('post');
    }
    return url.pathname + url.search + url.hash;
  }

  const translations = {
    '← Back to Home': '← Kembali ke Beranda',
    '← Back to Archive List': '← Kembali ke Daftar Arsip',
    '← Back to Supply Chain': '← Kembali ke Supply Chain',
    'Home': 'Beranda',
    'Case Studies Archive': 'Arsip Studi Kasus',
    'Supply Chain Archive': 'Arsip Supply Chain',
    'Data Storytelling Archive': 'Arsip Data Storytelling',
    'Artificial Intelligence': 'Kecerdasan Buatan',
    'Day in My Life': 'Sehari dalam Hidupku',
    'Loading case studies...': 'Memuat daftar studi kasus...',
    'Loading articles...': 'Memuat daftar artikel...',
    'Loading article...': 'Memuat artikel...',
    'Failed to load article.': 'Gagal memuat artikel.',
    'Failed to load archive.': 'Gagal memuat arsip.',
    'Failed to load case studies.': 'Gagal memuat arsip studi kasus.',
    'Case Studies | Jagat Batara': 'Studi Kasus | Jagat Batara',
    'Supply Chain | Jagat Batara': 'Supply Chain | Jagat Batara',
    'Data Storytelling | Jagat Batara': 'Penceritaan Data | Jagat Batara',
    'Artificial Intelligence | Jagat Batara': 'Kecerdasan Buatan | Jagat Batara',
    'Day in My Life | Jagat Batara': 'Sehari dalam Hidupku | Jagat Batara'
  };

  if (currentLang === 'id') {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.nodeValue;
      const trimmed = text.trim();
      if (translations[trimmed]) {
        node.nodeValue = text.replace(trimmed, translations[trimmed]);
      }
    }
    if (translations[document.title]) document.title = translations[document.title];
  }

  document.querySelectorAll('.nav-back').forEach((link) => {
    const url = new URL(link.href, window.location.href);
    if (homepage) {
      url.pathname = url.pathname.replace(/[^/]*$/, currentLang === 'id' ? 'index-id.html' : 'index.html');
      url.searchParams.delete('lang');
    } else if (currentLang === 'id') {
      url.searchParams.set('lang', 'id');
    } else {
      url.searchParams.delete('lang');
    }
    link.href = url.pathname + url.search + url.hash;
  });

  const switcher = document.createElement('nav');
  switcher.className = 'site-language-switcher';
  switcher.setAttribute('aria-label', currentLang === 'en' ? 'Language' : 'Bahasa');
  ['en', 'id'].forEach((lang, index) => {
    if (index) {
      const separator = document.createElement('span');
      separator.setAttribute('aria-hidden', 'true');
      separator.textContent = '|';
      switcher.appendChild(separator);
    }

    const link = document.createElement('a');
    link.href = languageUrl(lang);
    link.textContent = lang.toUpperCase();
    if (currentLang === lang) link.setAttribute('aria-current', 'page');
    link.addEventListener('click', async (event) => {
      const post = params.get('post');
      if (lang === currentLang || homepage || !post || !/^[A-Za-z0-9_-]+\.md$/.test(post)) return;

      event.preventDefault();
      const sourceFolder = currentLang === 'en' ? base + '-en' : base;
      const targetFolder = lang === 'en' ? base + '-en' : base;
      const rawUrl = (folder, file) => 'https://raw.githubusercontent.com/jagatbatara-tech/web-jagat-batara/main/' + folder + '/' + encodeURIComponent(file);

      try {
        const source = await fetch(rawUrl(sourceFolder, post));
        if (source.ok) {
          const match = (await source.text()).match(/^---\s*\n([\s\S]*?)\n---/);
          let frontMatter = {};
          if (match && window.jsyaml) {
            try { frontMatter = window.jsyaml.load(match[1]) || {}; } catch {}
          }

          const linkKey = currentLang === 'id' ? 'en_link' : 'id_link';
          const linkedFile = String(frontMatter[linkKey] || '').trim().split('/').pop();
          const candidates = [linkedFile, post].filter((file, index, all) => file && all.indexOf(file) === index);

          for (const candidate of candidates) {
            const file = candidate.endsWith('.md') ? candidate : candidate + '.md';
            if (!/^[A-Za-z0-9_-]+\.md$/.test(file)) continue;
            const target = await fetch(rawUrl(targetFolder, file));
            if (!target.ok) continue;

            const url = new URL(window.location.href);
            url.searchParams.set('post', file);
            if (lang === 'id') url.searchParams.set('lang', 'id');
            else url.searchParams.delete('lang');
            window.location.assign(url.pathname + url.search + url.hash);
            return;
          }
        }
      } catch {}

      window.location.assign(link.href);
    });
    switcher.appendChild(link);
  });

  const style = document.createElement('style');
  style.textContent = `
    .site-language-switcher {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 1000;
      display: inline-flex;
      gap: 8px;
      align-items: center;
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, .08);
      font: 600 14px/1.2 Inter, sans-serif;
    }
    .site-language-switcher a { color: #475569; text-decoration: none; }
    .site-language-switcher a[aria-current="page"] { color: #004B23; font-weight: 700; }
    .site-language-switcher span { color: #94a3b8; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(switcher);
})();
