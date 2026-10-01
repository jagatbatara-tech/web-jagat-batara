(function () {
  const repo = 'jagatbatara-tech/web-jagat-batara';
  const branch = 'main';
  const categories = {
    'studi-kasus': { id: 'Studi Kasus', en: 'Case Studies' },
    'supply-chain': { id: 'Supply Chain Insights', en: 'Supply Chain Insights' },
    'data-storytelling': { id: 'Data Storytelling', en: 'Data Storytelling' },
    ai: { id: 'AI & Automation', en: 'AI & Automation' },
    'day-in-my-life': { id: 'Day in My Life', en: 'Day in My Life' }
  };
  const body = document.body;
  const category = body.dataset.category;
  const lang = body.dataset.language === 'en' ? 'en' : 'id';
  const isEnglish = lang === 'en';
  const categoryInfo = categories[category];
  const folder = category + (isEnglish ? '-en' : '');
  const pairedPage = category + (isEnglish ? '' : '-en') + '.html';
  const home = isEnglish ? 'index-en.html' : 'index.html';
  const labels = isEnglish
    ? { about: 'About', certifications: 'Certifications', experience: 'Experience', articles: 'Articles', archive: 'Article archive', loading: 'Loading articles…', noArticles: 'No articles have been published in this category yet.', failed: 'Unable to load articles. Please try again later.', loadingArticle: 'Loading article…', failedArticle: 'Unable to load this article. Check that the Markdown file exists.', back: '← Back to articles', readMore: 'Read article', disclaimer: 'Note:' }
    : { about: 'Tentang', certifications: 'Sertifikasi', experience: 'Pengalaman', articles: 'Artikel', archive: 'Arsip artikel', loading: 'Memuat artikel…', noArticles: 'Belum ada artikel yang dipublikasikan dalam kategori ini.', failed: 'Arsip gagal dimuat. Silakan coba lagi nanti.', loadingArticle: 'Memuat artikel…', failedArticle: 'Artikel gagal dimuat. Pastikan file Markdown tersedia.', back: '← Kembali ke artikel', readMore: 'Baca artikel', disclaimer: 'Catatan:' };

  if (!categoryInfo) return;

  document.documentElement.lang = lang;
  document.title = categoryInfo[lang] + ' | Jagat Batara';

  const header = document.querySelector('#site-header');
  const categoryLinks = Object.keys(categories).map(function (slug) {
    return '<a href="' + slug + (isEnglish ? '-en' : '') + '.html">' + categories[slug][lang] + '</a>';
  }).join('');
  header.innerHTML =
    '<div class="container nav-inner">' +
      '<a class="logo-section" href="' + home + '"><span class="logo">Jagat Batara</span><span class="logo-title">M.T., CSCP</span></a>' +
      '<nav aria-label="' + (isEnglish ? 'Main navigation' : 'Navigasi utama') + '"><ul class="nav-links">' +
        '<li><a href="' + home + '#about">' + labels.about + '</a></li>' +
        '<li><a href="' + home + '#certifications">' + labels.certifications + '</a></li>' +
        '<li><a href="' + home + '#experience">' + labels.experience + '</a></li>' +
        '<li class="dropdown"><a href="' + home + '#knowledge-sharing" aria-haspopup="true">' + labels.articles + ' <span class="chevron" aria-hidden="true">▾</span></a><div class="dropdown-menu">' + categoryLinks + '</div></li>' +
        '<li class="lang-switch" aria-label="' + (isEnglish ? 'Choose language' : 'Pilih bahasa') + '">' +
          '<a href="' + category + '.html" class="' + (!isEnglish ? 'active' : '') + '"' + (!isEnglish ? ' aria-current="page"' : '') + '>ID</a><span aria-hidden="true">|</span>' +
          '<a href="' + category + '-en.html" class="' + (isEnglish ? 'active' : '') + '"' + (isEnglish ? ' aria-current="page"' : '') + '>EN</a>' +
        '</li>' +
      '</ul></nav>' +
    '</div>';

  const archiveView = document.getElementById('archive-view');
  const singleView = document.getElementById('single-view');
  const archiveTitle = document.getElementById('archive-title');
  archiveTitle.textContent = categoryInfo[lang];
  document.getElementById('archive-description').textContent = labels.archive;
  document.getElementById('loading-archive').textContent = labels.loading;
  document.getElementById('loading-single').textContent = labels.loadingArticle;

  function addText(parent, tag, className, value) {
    if (value === undefined || value === null || value === '') return null;
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = String(value);
    parent.appendChild(node);
    return node;
  }

  function parsePost(raw) {
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (!match) return { fm: {}, body: raw };
    let fm = {};
    try {
      fm = window.jsyaml.load(match[1]) || {};
    } catch (error) {
      console.error('YAML parse error', error);
    }
    return { fm: fm, body: match[2] || '' };
  }

  function markdownFile(value, fallback) {
    if (typeof value !== 'string' || !value.trim()) return fallback;
    let path = value.trim();
    try {
      if (/^https?:\/\//i.test(path)) path = new URL(path).pathname;
      path = decodeURIComponent(path.split(/[?#]/)[0]);
    } catch (error) {
      return fallback;
    }
    const filename = path.split('/').filter(Boolean).pop();
    if (!filename || filename === '.' || filename === '..') return fallback;
    return filename.endsWith('.md') ? filename : filename + '.md';
  }

  function articleUrl(targetLang, metadata, filename) {
    const sameLanguage = targetLang === lang;
    const field = targetLang === 'en' ? metadata.en_link : metadata.id_link;
    const targetFile = sameLanguage ? filename : markdownFile(field, filename);
    const page = category + (targetLang === 'en' ? '-en' : '') + '.html';
    return page + '?post=' + encodeURIComponent(targetFile);
  }

  function addLanguageLinks(parent, metadata, filename, className) {
    const switcher = document.createElement('nav');
    switcher.className = className;
    switcher.setAttribute('aria-label', isEnglish ? 'Article language versions' : 'Versi bahasa artikel');
    [['id', 'ID'], ['en', 'EN']].forEach(function (option, index) {
      if (index) addText(switcher, 'span', '', '|');
      const language = option[0];
      if (language === lang) {
        addText(switcher, 'span', 'current', option[1]);
      } else {
        const link = document.createElement('a');
        link.href = articleUrl(language, metadata, filename);
        link.textContent = option[1];
        switcher.appendChild(link);
      }
    });
    parent.appendChild(switcher);
  }

  function appendStats(parent, stats, className) {
    if (!Array.isArray(stats) || !stats.length) return;
    const grid = document.createElement('div');
    grid.className = className;
    stats.forEach(function (stat) {
      const card = document.createElement('div');
      card.className = className === 'impact-grid' ? 'impact-card' : 'stat';
      addText(card, 'div', 'num', stat.value);
      addText(card, 'div', 'lbl', stat.label);
      grid.appendChild(card);
    });
    parent.appendChild(grid);
  }

  function appendFigure(parent, image, caption) {
    if (!image) return;
    const figure = document.createElement('figure');
    figure.className = 'figure';
    const img = document.createElement('img');
    img.src = image;
    img.alt = caption || '';
    figure.appendChild(img);
    if (caption) addText(figure, 'figcaption', '', caption);
    parent.appendChild(figure);
  }

  function renderArticle(metadata, bodyText, filename) {
    const container = document.getElementById('single-container');
    container.replaceChildren();
    const hasHero = metadata.kicker || metadata.summary || (Array.isArray(metadata.tags) && metadata.tags.length) || (Array.isArray(metadata.hero_stats) && metadata.hero_stats.length);
    if (hasHero) {
      const hero = document.createElement('section');
      hero.className = 'hero';
      addText(hero, 'p', 'eyebrow', metadata.kicker);
      addText(hero, 'h1', '', metadata.title || categoryInfo[lang]);
      addText(hero, 'p', 'lead', metadata.summary);
      if (Array.isArray(metadata.tags) && metadata.tags.length) {
        const tags = document.createElement('ul');
        tags.className = 'badges';
        metadata.tags.forEach(function (tag) { addText(tags, 'li', 'badge', tag); });
        hero.appendChild(tags);
      }
      appendStats(hero, metadata.hero_stats, 'stats');
      container.appendChild(hero);
    }

    const article = document.createElement('article');
    article.className = 'full-article';
    if (!hasHero) addText(article, 'h1', '', metadata.title || categoryInfo[lang]);
    addLanguageLinks(article, metadata, filename, 'article-language-switch');
    const renderedMarkdown = document.createElement('div');
    renderedMarkdown.innerHTML = window.marked.parse(bodyText || '');
    article.appendChild(renderedMarkdown);
    appendFigure(article, metadata.architecture_image, metadata.architecture_caption);
    appendFigure(article, metadata.dashboard_image, metadata.dashboard_caption);

    if (Array.isArray(metadata.tech_stack) && metadata.tech_stack.length) {
      addText(article, 'h3', '', isEnglish ? 'Tools & Techniques' : 'Tools & Teknik');
      const tech = document.createElement('ul');
      tech.className = 'tech-grid';
      metadata.tech_stack.forEach(function (item) { addText(tech, 'li', 'tech-pill', item); });
      article.appendChild(tech);
    }
    if (Array.isArray(metadata.impact_summary) && metadata.impact_summary.length) {
      addText(article, 'h3', '', isEnglish ? 'Impact Summary' : 'Ringkasan Dampak');
      appendStats(article, metadata.impact_summary, 'impact-grid');
    }
    if (metadata.disclaimer) {
      const disclaimer = document.createElement('aside');
      disclaimer.className = 'disclaimer';
      const strong = addText(disclaimer, 'strong', '', labels.disclaimer + ' ');
      strong.after(document.createTextNode(String(metadata.disclaimer)));
      article.appendChild(disclaimer);
    }
    container.appendChild(article);
    document.getElementById('loading-single').hidden = true;
  }

  async function loadArticle(filename) {
    if (!/^[^/\\]+\.md$/i.test(filename)) throw new Error('Invalid Markdown filename');
    const url = 'https://raw.githubusercontent.com/' + repo + '/' + branch + '/' + folder + '/' + encodeURIComponent(filename);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Article not found');
    const parsed = parsePost(await response.text());
    renderArticle(parsed.fm, parsed.body, filename);
  }

  async function loadArchive() {
    const url = 'https://api.github.com/repos/' + repo + '/contents/' + folder + '?ref=' + branch;
    const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (response.status === 404) {
      document.getElementById('loading-archive').textContent = labels.noArticles;
      return;
    }
    if (!response.ok) throw new Error('Archive request failed');
    const files = await response.json();
    const markdownFiles = files.filter(function (file) { return file.type === 'file' && /\.md$/i.test(file.name); }).reverse();
    const container = document.getElementById('archive-container');
    if (!markdownFiles.length) {
      document.getElementById('loading-archive').textContent = labels.noArticles;
      return;
    }
    document.getElementById('loading-archive').hidden = true;
    await Promise.all(markdownFiles.map(async function (file) {
      const fileResponse = await fetch(file.download_url);
      if (!fileResponse.ok) return;
      const parsed = parsePost(await fileResponse.text());
      const card = document.createElement('article');
      card.className = 'archive-card';
      addText(card, 'p', 'archive-kicker', parsed.fm.kicker);
      const title = document.createElement('a');
      title.className = 'archive-title';
      title.href = '?post=' + encodeURIComponent(file.name);
      title.textContent = parsed.fm.title || categoryInfo[lang];
      card.appendChild(title);
      const excerpt = parsed.fm.summary || parsed.body.replace(/[#*`_>\[\]]/g, '').trim();
      addText(card, 'p', 'archive-excerpt', excerpt.length > 240 ? excerpt.slice(0, 240) + '…' : excerpt);
      addLanguageLinks(card, parsed.fm, file.name, 'article-language');
      container.appendChild(card);
    }));
  }

  const params = new URLSearchParams(window.location.search);
  const postFile = params.get('post');
  if (postFile) {
    archiveView.hidden = true;
    singleView.hidden = false;
    const back = document.getElementById('back-link');
    back.href = category + (isEnglish ? '-en' : '') + '.html';
    back.textContent = labels.back;
    loadArticle(postFile).catch(function (error) {
      console.error(error);
      document.getElementById('loading-single').textContent = labels.failedArticle;
    });
  } else {
    archiveView.hidden = false;
    singleView.hidden = true;
    loadArchive().catch(function (error) {
      console.error(error);
      document.getElementById('loading-archive').textContent = labels.failed;
    });
  }
})();
