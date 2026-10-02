/**
 * site-widgets.js
 * Injects two site-wide widgets into every page that includes this script:
 *  - a search button + modal (full-text search across all articles)
 *  - a newsletter subscription box (Buttondown-powered, see SETUP.md)
 *
 * Both widgets are injected via JS so a single <script> include adds them
 * to any page without having to hand-edit every page's markup.
 */
(function () {
  function currentLang() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('lang') === 'en') return 'en';
    if (document.documentElement.lang === 'en') return 'en';
    return 'id';
  }

  const lang = currentLang();
  const i18n = {
    id: {
      searchPlaceholder: 'Cari artikel, topik, atau kata kunci…',
      searchButton: 'Cari',
      searchEmpty: 'Ketik untuk mencari artikel…',
      searchNoResult: 'Tidak ada artikel yang cocok.',
      searchLoading: 'Memuat indeks artikel…',
      subscribeTitle: '📬 Dapatkan Artikel Terbaru',
      subscribeCopy: 'Subscribe untuk mendapat notifikasi email setiap ada artikel baru. Anda juga perlu subscribe agar bisa berkomentar di artikel.',
      subscribePlaceholder: 'Alamat email kamu',
      subscribeButton: 'Subscribe',
      subscribeNote: 'Tanpa spam. Berhenti kapan saja.'
    },
    en: {
      searchPlaceholder: 'Search articles, topics, or keywords…',
      searchButton: 'Search',
      searchEmpty: 'Start typing to search articles…',
      searchNoResult: 'No matching articles found.',
      searchLoading: 'Loading article index…',
      subscribeTitle: '📬 Get New Articles by Email',
      subscribeCopy: 'Subscribe to get an email whenever a new article is published. You also need to subscribe before you can comment on articles.',
      subscribePlaceholder: 'Your email address',
      subscribeButton: 'Subscribe',
      subscribeNote: 'No spam. Unsubscribe anytime.'
    }
  }[lang];

  // Buttondown username used for the subscribe form + RSS-to-email automation.
  // Update this once a real Buttondown (or compatible) account is created — see SETUP.md.
  const BUTTONDOWN_USERNAME = 'jagatbatara';

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .jb-search-trigger{display:inline-flex;align-items:center;gap:6px;background:transparent;border:1px solid rgba(0,75,35,.25);color:var(--text-gray,#475569);font:inherit;font-size:.86rem;font-weight:600;padding:7px 14px;border-radius:8px;cursor:pointer;transition:.2s;}
      .jb-search-trigger:hover{color:var(--primary,#004B23);border-color:var(--primary,#004B23);background:rgba(0,75,35,.05);}
      .jb-search-overlay{position:fixed;inset:0;background:rgba(15,23,42,.55);display:none;align-items:flex-start;justify-content:center;padding:10vh 16px;z-index:9999;}
      .jb-search-overlay.open{display:flex;}
      .jb-search-modal{background:#fff;width:100%;max-width:640px;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.25);overflow:hidden;}
      .jb-search-input-row{display:flex;align-items:center;border-bottom:1px solid #e2e8f0;padding:14px 18px;gap:10px;}
      .jb-search-input-row input{flex:1;border:none;outline:none;font-size:1rem;font-family:inherit;}
      .jb-search-close{background:none;border:none;font-size:1.3rem;cursor:pointer;color:#94a3b8;line-height:1;}
      .jb-search-results{max-height:55vh;overflow-y:auto;padding:8px;}
      .jb-search-result{display:block;padding:12px 14px;border-radius:8px;text-decoration:none;color:inherit;}
      .jb-search-result:hover{background:#f1f5f9;}
      .jb-search-result .jb-sr-kicker{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--primary,#004B23);}
      .jb-search-result .jb-sr-title{font-weight:700;margin:2px 0 4px;}
      .jb-search-result .jb-sr-excerpt{font-size:.85rem;color:#64748b;}
      .jb-search-hint{padding:30px 18px;text-align:center;color:#94a3b8;font-size:.9rem;}

      .jb-subscribe-box{max-width:900px;margin:40px auto;padding:28px 32px;border-radius:14px;background:linear-gradient(135deg,#004B23 0%,#003318 100%);color:#fff;}
      .jb-subscribe-box h3{margin:0 0 8px;font-size:1.2rem;}
      .jb-subscribe-box p{margin:0 0 16px;color:#D5E8DC;font-size:.92rem;}
      .jb-subscribe-form{display:flex;gap:10px;flex-wrap:wrap;}
      .jb-subscribe-form input[type=email]{flex:1;min-width:220px;padding:11px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:#fff;font:inherit;}
      .jb-subscribe-form input[type=email]::placeholder{color:#B9D6C3;}
      .jb-subscribe-form button{padding:11px 20px;border-radius:8px;border:none;background:#F2A65A;color:#1b1203;font-weight:700;cursor:pointer;}
      .jb-subscribe-form button:hover{opacity:.9;}
      .jb-subscribe-note{margin-top:10px;font-size:.78rem;color:#9FC6AC;}
      .jb-subscribe-msg{margin-top:10px;font-size:.85rem;font-weight:600;}
    `;
    document.head.appendChild(style);
  }

  function injectSearchUI() {
    const nav = document.querySelector('.nav-links');
    if (nav) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'jb-search-trigger';
      btn.innerHTML = '<i class="fas fa-search"></i> ' + i18n.searchButton;
      li.appendChild(btn);
      // Insert before the language switcher if present, otherwise append.
      const langSwitch = nav.querySelector('.lang-switch');
      if (langSwitch) nav.insertBefore(li, langSwitch); else nav.appendChild(li);
      btn.addEventListener('click', openSearch);
    }

    const overlay = document.createElement('div');
    overlay.className = 'jb-search-overlay';
    overlay.innerHTML =
      '<div class="jb-search-modal">' +
        '<div class="jb-search-input-row">' +
          '<i class="fas fa-search" style="color:#94a3b8"></i>' +
          '<input type="text" placeholder="' + i18n.searchPlaceholder + '" aria-label="' + i18n.searchButton + '">' +
          '<button type="button" class="jb-search-close" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="jb-search-results"><div class="jb-search-hint">' + i18n.searchEmpty + '</div></div>' +
      '</div>';
    document.body.appendChild(overlay);

    const input = overlay.querySelector('input');
    const resultsEl = overlay.querySelector('.jb-search-results');
    const closeBtn = overlay.querySelector('.jb-search-close');
    let index = null;
    let debounceTimer = null;

    function openSearch() {
      overlay.classList.add('open');
      input.focus();
      if (!index) {
        resultsEl.innerHTML = '<div class="jb-search-hint">' + i18n.searchLoading + '</div>';
        window.JBSearch.buildIndex(lang).then(function (entries) {
          index = entries;
          resultsEl.innerHTML = '<div class="jb-search-hint">' + i18n.searchEmpty + '</div>';
        });
      }
    }

    function closeSearch() { overlay.classList.remove('open'); }

    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
    closeBtn.addEventListener('click', closeSearch);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    });

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      const q = input.value;
      debounceTimer = setTimeout(function () {
        if (!index) return;
        if (!q.trim()) { resultsEl.innerHTML = '<div class="jb-search-hint">' + i18n.searchEmpty + '</div>'; return; }
        const matches = window.JBSearch.search(index, q);
        if (!matches.length) { resultsEl.innerHTML = '<div class="jb-search-hint">' + i18n.searchNoResult + '</div>'; return; }
        resultsEl.innerHTML = matches.map(function (m) {
          const excerpt = (m.summary || m.body || '').slice(0, 140);
          return '<a class="jb-search-result" href="' + m.url + '">' +
            '<div class="jb-sr-kicker">' + m.collectionLabel + '</div>' +
            '<div class="jb-sr-title">' + m.title + '</div>' +
            '<div class="jb-sr-excerpt">' + excerpt + (excerpt.length >= 140 ? '…' : '') + '</div>' +
          '</a>';
        }).join('');
      }, 180);
    });

    window.JB_openSearch = openSearch;
  }

  function injectSubscribeBox() {
    const target = document.querySelector('main') || document.body;
    const box = document.createElement('section');
    box.className = 'jb-subscribe-box';
    box.innerHTML =
      '<h3>' + i18n.subscribeTitle + '</h3>' +
      '<p>' + i18n.subscribeCopy + '</p>' +
      '<form class="jb-subscribe-form" action="https://buttondown.email/api/emails/embed-subscribe/' + BUTTONDOWN_USERNAME + '" method="post" target="popupwindow" ' +
        'onsubmit="window.open(\'https://buttondown.email/' + BUTTONDOWN_USERNAME + '\', \'popupwindow\')">' +
        '<input type="email" name="email" required placeholder="' + i18n.subscribePlaceholder + '">' +
        '<button type="submit">' + i18n.subscribeButton + '</button>' +
      '</form>' +
      '<div class="jb-subscribe-note">' + i18n.subscribeNote + '</div>';
    target.appendChild(box);
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    injectSearchUI();
    injectSubscribeBox();
  });
})();
