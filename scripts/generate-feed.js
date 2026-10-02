#!/usr/bin/env node
/**
 * Generates feed.xml (RSS 2.0) from every article in the Indonesian
 * knowledge-sharing collections. This feed is what a newsletter service
 * (e.g. Buttondown's "RSS-to-email" automation, see SETUP.md) polls in
 * order to automatically email subscribers whenever a new article is
 * published.
 *
 * No external dependencies — uses only Node's built-in fs/path modules so
 * it can run in CI without an npm install step.
 *
 * Usage: node scripts/generate-feed.js
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://jagatbatara-tech.github.io/web-jagat-batara';
const ROOT = path.join(__dirname, '..');

const COLLECTIONS = [
  { folder: 'studi-kasus', page: 'studi-kasus.html' },
  { folder: 'supply-chain', page: 'supply-chain.html' },
  { folder: 'data-storytelling', page: 'data-storytelling.html' },
  { folder: 'ai', page: 'ai.html' },
  { folder: 'day-in-my-life', page: 'day-in-my-life.html' }
];

function parseFrontMatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { fm: {}, body: raw };
  const fm = {};
  const lines = match[1].split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (m) {
      const key = m[1];
      let value = m[2].trim();
      if (value === '>' || value === '|' || value === '>-' || value === '|-') {
        // Folded/literal block scalar: collect subsequent indented lines.
        const blockLines = [];
        i += 1;
        while (i < lines.length && (lines[i] === '' || /^\s+/.test(lines[i])) && !/^[A-Za-z0-9_]+:/.test(lines[i])) {
          blockLines.push(lines[i].replace(/^\s+/, ''));
          i += 1;
        }
        fm[key] = blockLines.join(value.startsWith('|') ? '\n' : ' ').trim();
        continue;
      }
      value = value.replace(/^['"]|['"]$/g, '');
      if (value && value !== '') fm[key] = value;
    }
    i += 1;
  }
  return { fm: fm, body: match[2] || '' };
}

function escapeXml(str) {
  return String(str || '').replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c];
  });
}

function collectItems() {
  const items = [];
  COLLECTIONS.forEach(function (collection) {
    const dir = path.join(ROOT, collection.folder);
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).filter(function (f) { return f.endsWith('.md'); }).forEach(function (file) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { fm } = parseFrontMatter(raw);
      items.push({
        title: fm.title || file,
        summary: fm.summary || '',
        date: fm.date ? new Date(fm.date) : fs.statSync(path.join(dir, file)).mtime,
        link: SITE_URL + '/' + collection.page + '?post=' + encodeURIComponent(file)
      });
    });
  });
  items.sort(function (a, b) { return b.date - a.date; });
  return items;
}

function buildRss(items) {
  const now = new Date().toUTCString();
  const entries = items.map(function (item) {
    return '  <item>\n' +
      '    <title>' + escapeXml(item.title) + '</title>\n' +
      '    <link>' + escapeXml(item.link) + '</link>\n' +
      '    <guid isPermaLink="true">' + escapeXml(item.link) + '</guid>\n' +
      '    <pubDate>' + item.date.toUTCString() + '</pubDate>\n' +
      '    <description>' + escapeXml(item.summary) + '</description>\n' +
      '  </item>';
  }).join('\n');

  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0">\n' +
    '<channel>\n' +
    '  <title>Jagat Batara — Knowledge Sharing</title>\n' +
    '  <link>' + SITE_URL + '</link>\n' +
    '  <description>Artikel terbaru dari Jagat Batara: studi kasus, supply chain, data storytelling, automation, dan lainnya.</description>\n' +
    '  <lastBuildDate>' + now + '</lastBuildDate>\n' +
    entries + '\n' +
    '</channel>\n' +
    '</rss>\n';
}

function main() {
  const items = collectItems();
  const rss = buildRss(items);
  fs.writeFileSync(path.join(ROOT, 'feed.xml'), rss, 'utf8');
  console.log('Wrote feed.xml with ' + items.length + ' item(s).');
}

main();
