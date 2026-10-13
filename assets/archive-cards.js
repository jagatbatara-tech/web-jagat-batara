/* Builds one archive card in the same style as the index "Selected Work"
   cards. Usage: ArchiveCards.build({ href, kicker, title, excerpt, tags, icon, openLabel }).
   All text is set with textContent, so front matter is never parsed as HTML. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var ICONS = {
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15 9-2 5-5 2 2-5 5-2Z"/>',
    warehouse: '<path d="m3 10 9-6 9 6v10H3V10Z"/><path d="M7 20v-7h10v7"/>',
    chart: '<path d="M4 19V5M4 19h16m-13-4 4-4 3 2 5-6"/>',
    tool: '<path d="M14 6a4 4 0 0 0-5 5L3 17l4 4 6-6a4 4 0 0 0 5-5l-3 3-3-3 2-4Z"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h4a4 4 0 0 0 4-4v-2M16 10V8"/>',
    book: '<path d="M4 5a4 4 0 0 1 4-1h4v16H8a4 4 0 0 0-4 1V5Zm16 0a4 4 0 0 0-4-1h-4v16h4a4 4 0 0 1 4 1V5Z"/>',
    ship: '<path d="M4 13h16l-2 6H6l-2-6ZM8 13V7h8v6M3 21c2 1 4 1 6 0 2 1 4 1 6 0 2 1 4 1 6 0"/>',
    mountain: '<path d="m3 20 7-12 4 7 2-3 5 8H3Z"/>'
  };
  var THEMES = ['copper', 'green', 'slate', 'blue'];

  function hash(text) {
    var h = 0;
    for (var i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
    return h;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function build(opts) {
    var title = opts.title || '';
    var theme = THEMES[hash(title) % THEMES.length];

    var card = document.createElement('a');
    card.href = opts.href;
    card.className = 'work-card';

    var visual = el('div', 'work-visual ' + theme);
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = ICONS[opts.icon] || ICONS.compass;
    visual.appendChild(svg);
    card.appendChild(visual);

    var head = el('div', 'work-top');
    head.appendChild(el('span', 'work-cat', opts.kicker || ''));
    card.appendChild(head);

    card.appendChild(el('h3', '', title));

    var excerpt = opts.excerpt || '';
    if (excerpt.length > 200) excerpt = excerpt.substring(0, 200) + '...';
    card.appendChild(el('p', '', excerpt));

    if (Array.isArray(opts.tags) && opts.tags.length) {
      var tags = el('div', 'work-tags');
      opts.tags.forEach(function (t) { tags.appendChild(el('span', '', String(t))); });
      card.appendChild(tags);
    } else {
      card.appendChild(el('div', 'work-tags'));
    }

    card.appendChild(el('span', 'work-open', opts.openLabel || 'Open →'));
    return card;
  }

  window.ArchiveCards = { build: build };
})();
