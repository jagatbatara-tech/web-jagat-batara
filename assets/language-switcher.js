(() => {
  const params = new URLSearchParams(window.location.search);
  const currentLang = params.get('lang') === 'en' ? 'en' : 'id';
  document.documentElement.lang = currentLang;

  function languageUrl(lang) {
    const url = new URL(window.location.href);
    if (lang === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    return url.pathname + url.search + url.hash;
  }

  document.querySelectorAll('.nav-back').forEach((link) => {
    if (currentLang === 'en') {
      const url = new URL(link.href, window.location.href);
      url.searchParams.set('lang', 'en');
      link.href = url.pathname + url.search + url.hash;
    }
  });

  const switcher = document.createElement('nav');
  switcher.className = 'site-language-switcher';
  switcher.setAttribute('aria-label', 'Language');
  ['id', 'en'].forEach((lang, index) => {
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
