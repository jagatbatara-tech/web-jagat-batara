# SETUP.md — Newsletter, Comments & Search

This document covers the one-time, manual setup needed outside of this
repository to make the **newsletter subscription**, **comment approval**,
and **search** features fully operational. The code for all three features
is already in this repo — only external account/service configuration is
required.

## 1. Search

Nothing to configure. Search is 100% client-side (see `assets/search-index.js`
and `assets/site-widgets.js`): it reads articles straight from the GitHub API
(the same way the article pages already do) and lets visitors filter by
title, summary, tags, and body text. A "Cari / Search" button appears in the
navbar on every page (or press `Ctrl/Cmd+K`).

## 2. Newsletter subscription + "new article" email notifications

The subscribe box (`assets/site-widgets.js`) posts to
[Buttondown](https://buttondown.email), a simple newsletter service with a
free tier and a built-in **RSS-to-email** automation.

Steps:
1. Create a Buttondown account and note your **username**.
2. Open `assets/site-widgets.js` and set `BUTTONDOWN_USERNAME` to that
   username.
3. In the Buttondown dashboard, enable **RSS-to-email** and point it at:
   `https://<your-site-domain>/feed.xml`
4. `feed.xml` is generated automatically by
   `.github/workflows/generate-feed.yml` every time a new article markdown
   file is pushed to `main` (e.g. whenever you publish through the CMS).
   Buttondown polls this feed and emails every subscriber when a new item
   appears — this is the "notify subscribers about new articles" feature.
5. (Optional) Swap Buttondown for any other ESP that supports an embeddable
   subscribe form + RSS-to-email (e.g. Mailchimp, Substack) by updating the
   form `action` URL in `assets/site-widgets.js` and the feed URL in that
   service's dashboard.

## 3. Comments (with required approval + subscriber check)

Comments are submitted via [Staticman](https://staticman.net), which turns
every comment into a **pull request** against this repo — nothing is
published until you merge it, which is the "approval dari saya" step.

Steps:
1. Register this repository with the public Staticman API (follow
   https://staticman.net/docs/, or self-host your own instance for full
   control) using `staticman.yml` in this repo as the entry config.
2. Install the Staticman GitHub App on `jagatbatara-tech/web-jagat-batara`
   so it has permission to open pull requests.
3. If you self-host Staticman instead of using the public API, update
   `STATICMAN_ENDPOINT` in `assets/comments.js` to point at your instance.
4. Update `allowedOrigins` in `staticman.yml` to match your site's real
   domain.
5. **Approval workflow**: when a comment PR appears,
   - Check the commenter's email against your Buttondown subscriber list.
   - Merge the PR only if the email is a confirmed subscriber — this
     enforces "harus subscribe dulu baru bisa komen". Close/skip the PR
     otherwise.
   - Once merged, the comment file lives under `comments/<collection>/<slug>/`
     and is automatically rendered on the article page (approved comments
     are read directly from the repo's `main` branch, so anything not yet
     merged is never shown publicly).

Comment emails are stored as an MD5 hash (`transforms: { email: md5 }` in
`staticman.yml`), not in plain text, to avoid publishing subscriber emails
in the public repository.
