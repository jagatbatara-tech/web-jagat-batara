#!/usr/bin/env node
/**
 * Announces newly-published articles as GitHub Discussions posts in the
 * "Announcements" category. This is the GitHub-only replacement for a
 * third-party newsletter service: visitors "Watch" this repo's Discussions
 * (Watch → Custom → Discussions) to get a GitHub notification/email
 * whenever a new article is announced here — no external account needed.
 *
 * Requires:
 *   - Discussions enabled on the repository (Settings → General → Features).
 *   - An "Announcements" discussion category (created automatically by
 *     GitHub when Discussions is enabled; rename/create one if missing).
 *   - GITHUB_TOKEN with `discussions: write` permission (set in the
 *     workflow that calls this script).
 *
 * Only markdown files *added* by the current push are announced (not
 * edits to existing articles), determined via `git diff --diff-filter=A`
 * between the push's before/after commits. Falls back to the single latest
 * commit's added files when the before commit isn't available (e.g. first
 * push to a new branch).
 *
 * No external dependencies — uses Node's built-in fs/path/child_process and
 * global fetch (Node 18+) to call the GitHub GraphQL API directly.
 *
 * Usage: GITHUB_TOKEN=... GITHUB_REPOSITORY=owner/repo node scripts/notify-discussions.js
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { parseFrontMatter } = require('./lib/front-matter');
const { SITE_URL, COLLECTIONS } = require('./lib/site-config');

const ROOT = path.join(__dirname, '..');
const CATEGORY_NAME = (process.env.DISCUSSION_CATEGORY_NAME || 'Announcements').toLowerCase();
const GRAPHQL_URL = 'https://api.github.com/graphql';
const ZERO_SHA = '0000000000000000000000000000000000000000';

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function isKnownArticlePath(filePath) {
  return COLLECTIONS.some(function (c) {
    return filePath === c.folder || filePath.startsWith(c.folder + '/');
  }) && filePath.endsWith('.md');
}

function getAddedArticleFiles() {
  const before = process.env.BEFORE_SHA;
  const after = process.env.AFTER_SHA || 'HEAD';
  let diffOutput = '';

  if (before && before !== ZERO_SHA) {
    try {
      diffOutput = git(['diff', '--name-status', '--diff-filter=A', before, after]);
    } catch (e) {
      console.warn('git diff against before SHA failed, falling back to latest commit:', e.message);
    }
  }

  if (!diffOutput) {
    try {
      diffOutput = git(['diff-tree', '--no-commit-id', '--name-status', '-r', '--diff-filter=A', after]);
    } catch (e) {
      console.warn('git diff-tree fallback failed:', e.message);
      return [];
    }
  }

  return diffOutput
    .split('\n')
    .map(function (line) { return line.trim(); })
    .filter(Boolean)
    .map(function (line) { return line.split(/\s+/); })
    .filter(function (parts) { return parts[0] === 'A' && parts[1]; })
    .map(function (parts) { return parts[1]; })
    .filter(isKnownArticlePath);
}

function collectionForFile(filePath) {
  return COLLECTIONS.find(function (c) {
    return filePath === c.folder || filePath.startsWith(c.folder + '/');
  });
}

async function graphql(token, query, variables) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
      'User-Agent': 'web-jagat-batara-notify-discussions'
    },
    body: JSON.stringify({ query: query, variables: variables })
  });
  const json = await res.json();
  if (json.errors && json.errors.length) {
    throw new Error('GraphQL error: ' + JSON.stringify(json.errors));
  }
  return json.data;
}

async function getRepoAndCategory(token, owner, repo) {
  const data = await graphql(token,
    'query($owner:String!,$repo:String!){ repository(owner:$owner, name:$repo) { id discussionCategories(first:25){ nodes { id name } } } }',
    { owner: owner, repo: repo }
  );
  if (!data || !data.repository) {
    throw new Error('Repository not found or token lacks access: ' + owner + '/' + repo);
  }
  const category = data.repository.discussionCategories.nodes.find(function (c) {
    return c.name.toLowerCase() === CATEGORY_NAME;
  });
  return { repositoryId: data.repository.id, categoryId: category ? category.id : null };
}

async function createDiscussion(token, repositoryId, categoryId, title, body) {
  const data = await graphql(token,
    'mutation($repositoryId:ID!,$categoryId:ID!,$title:String!,$body:String!){ createDiscussion(input:{repositoryId:$repositoryId, categoryId:$categoryId, title:$title, body:$body}) { discussion { url } } }',
    { repositoryId: repositoryId, categoryId: categoryId, title: title, body: body }
  );
  return data.createDiscussion.discussion.url;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const repoSlug = process.env.GITHUB_REPOSITORY;
  if (!token || !repoSlug) {
    console.log('GITHUB_TOKEN / GITHUB_REPOSITORY not set, skipping discussion announcements.');
    return;
  }
  const [owner, repo] = repoSlug.split('/');

  const addedFiles = getAddedArticleFiles();
  if (!addedFiles.length) {
    console.log('No newly added article files in this push, nothing to announce.');
    return;
  }

  const { repositoryId, categoryId } = await getRepoAndCategory(token, owner, repo);
  if (!categoryId) {
    console.warn(
      'No "' + CATEGORY_NAME + '" discussion category found on ' + repoSlug + '. ' +
      'Enable Discussions and create this category (see SETUP.md) — skipping announcements for now.'
    );
    return;
  }

  for (const filePath of addedFiles) {
    const collection = collectionForFile(filePath);
    const fileName = path.basename(filePath);
    const raw = fs.readFileSync(path.join(ROOT, filePath), 'utf8');
    const { fm } = parseFrontMatter(raw);
    const title = fm.title || fileName;
    const link = SITE_URL + '/' + collection.page + '?post=' + encodeURIComponent(fileName);
    const body = (fm.summary ? fm.summary + '\n\n' : '') + 'Baca artikel lengkap: ' + link;

    try {
      const url = await createDiscussion(token, repositoryId, categoryId, title, body);
      console.log('Announced "' + title + '" -> ' + url);
    } catch (e) {
      console.error('Failed to announce "' + title + '":', e.message);
    }
  }
}

main().catch(function (e) {
  console.error(e);
  process.exitCode = 1;
});
