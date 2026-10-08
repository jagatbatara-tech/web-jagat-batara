(function () {
  const input = document.getElementById('article-search');
  const status = document.getElementById('article-search-status');
  const results = document.getElementById('article-search-results');
  if (!input || !status || !results || !window.JBSearch) return;

  let entries = [];

  function render() {
    const query = input.value.trim();
    const matches = query ? window.JBSearch.search(entries, query) : entries;
    results.replaceChildren();

    status.textContent = query
      ? matches.length + (matches.length === 1 ? ' article found.' : ' articles found.')
      : 'Showing all ' + entries.length + ' articles. Type to filter.';

    matches.forEach(function (entry) {
      const link = document.createElement('a');
      const collection = document.createElement('small');
      const title = document.createElement('span');
      const excerpt = document.createElement('p');

      link.className = 'home-search-result';
      link.href = entry.url;
      collection.textContent = entry.collectionLabel;
      title.textContent = entry.title;
      excerpt.textContent = (entry.summary || entry.body || '').slice(0, 150);
      link.append(collection, title, excerpt);
      results.appendChild(link);
    });

    if (query && !matches.length) status.textContent = 'No matching articles found.';
  }

  input.addEventListener('input', render);
  status.textContent = 'Loading articles…';
  window.JBSearch.buildIndex('en').then(function (articles) {
    entries = articles;
    render();
  }).catch(function () {
    status.textContent = 'Unable to load articles. Please try again later.';
  });
})();
