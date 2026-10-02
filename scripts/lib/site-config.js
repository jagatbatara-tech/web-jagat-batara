/**
 * Shared constants describing every knowledge-sharing collection and the
 * public site URL, used by both the RSS feed generator and the GitHub
 * Discussions announcer scripts.
 */
const SITE_URL = 'https://jagatbatara-tech.github.io/web-jagat-batara';

const COLLECTIONS = [
  { folder: 'studi-kasus', page: 'studi-kasus.html' },
  { folder: 'supply-chain', page: 'supply-chain.html' },
  { folder: 'data-storytelling', page: 'data-storytelling.html' },
  { folder: 'ai', page: 'ai.html' },
  { folder: 'day-in-my-life', page: 'day-in-my-life.html' }
];

module.exports = { SITE_URL, COLLECTIONS };
