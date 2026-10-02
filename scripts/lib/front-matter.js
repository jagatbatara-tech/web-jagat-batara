/**
 * Minimal, dependency-free YAML front-matter parser shared by the feed and
 * discussion-announcement scripts. Supports plain `key: value` pairs and
 * folded (`>`) / literal (`|`) block scalars, which is all the front matter
 * used in this repo's article markdown needs.
 */
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

module.exports = { parseFrontMatter };
