#!/usr/bin/env node
/**
 * Generates feed.xml (RSS 2.0) from every article in the Indonesian
 * knowledge-sharing collections. This feed is a general-purpose syndication
 * feed for the site (usable by any RSS reader); new-article notifications
 * to subscribers are handled separately by
 * .github/workflows/notify-discussions.yml, which posts to GitHub
 * Discussions instead of relying on a third-party email service.
 *
 * No external dependencies — uses only Node's built-in fs/path modules so
 * it can run in CI without an npm install step.
 *
 * Usage: node scripts/generate-feed.js
 */
const fs = require('fs');
const path = require('path');
const { parseFrontMatter } = require('./lib/front-matter');
const { SITE_URL, COLLECTIONS } = require('./lib/site-config');

const ROOT = path.join(__dirname, '..');

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
