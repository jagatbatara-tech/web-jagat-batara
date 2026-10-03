/**
 * comments.js
 * Renders approved comments for the current article and provides a
 * submission form. Comments are submitted via Staticman: every submission
 * opens a pull request against this repo (under comments/<collection>/<slug>/)
 * that must be reviewed and merged by the site owner before it appears here
 * — this is the "approval" step. See staticman.yml and SETUP.md.
 *
 * Usage: <script src="assets/comments.js" data-collection="studi-kasus"></script>
 */
(function () {
  const scriptEl = document.currentScript;
  const collection = scriptEl.getAttribute('data-collection');
  if (!collection) return;

  const REPO = 'jagatbatara-tech/web-jagat-batara';
  const BRANCH = 'main';
  // Set this to your own Staticman instance (self-hosted or the public one)
  // once registered for this repo — see SETUP.md.
  const STATICMAN_ENDPOINT = 'https://api.staticman.net/v3/entry/github/jagatbatara-tech/web-jagat-batara/main/comments';

  const params = new URLSearchParams(window.location.search);
  const postFile = params.get('post');
  const lang = params.get('lang') === 'id' ? 'id' : 'en';
  if (!postFile) return; // only render on single-article view

  const slug = postFile.replace(/\.md$/, '').replace(/[^A-Za-z0-9_-]/g, '');
  const commentsPath = 'comments/' + collection + '/' + slug;

  const t = lang === 'en' ? {
    heading: 'Comments',
    loading: 'Loading comments…',
    empty: 'No comments yet. Be the first to comment!',
    name: 'Name', github: 'GitHub username (used to confirm your Discussions subscription)',
    message: 'Comment', submit: 'Submit for approval',
    subscribeRequired: 'I confirm I am subscribed to this repo\'s GitHub Discussions (Watch → Custom → Discussions) with this GitHub account (required — comments from non-subscribers will not be approved).',
    pending: 'Thanks! Your comment was submitted and is pending approval.',
    error: 'Something went wrong submitting your comment. Please try again later.'
  } : {
    heading: 'Komentar',
    loading: 'Memuat komentar…',
    empty: 'Belum ada komentar. Jadilah yang pertama berkomentar!',
    name: 'Nama', github: 'Username GitHub (dipakai untuk konfirmasi subscribe Discussions)',
    message: 'Komentar', submit: 'Kirim untuk disetujui',
    subscribeRequired: 'Saya konfirmasi sudah subscribe GitHub Discussions repo ini (Watch → Custom → Discussions) dengan akun ini (wajib — komentar dari yang belum subscribe tidak akan disetujui).',
    pending: 'Terima kasih! Komentar kamu sudah dikirim dan menunggu persetujuan.',
    error: 'Terjadi kesalahan saat mengirim komentar. Silakan coba lagi nanti.'
  };

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .jb-comments{max-width:900px;margin:30px auto 0;background:#fff;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,.05);padding:32px 40px;}
      .jb-comments h3{margin-top:0;color:var(--primary,#004B23);}
      .jb-comment-item{border-bottom:1px solid #e2e8f0;padding:16px 0;}
      .jb-comment-item:last-child{border-bottom:none;}
      .jb-comment-author{font-weight:700;font-size:.92rem;}
      .jb-comment-date{font-size:.75rem;color:#94a3b8;margin-left:8px;}
      .jb-comment-body{margin-top:6px;font-size:.92rem;color:#334155;white-space:pre-wrap;}
      .jb-comment-form{margin-top:20px;display:flex;flex-direction:column;gap:10px;}
      .jb-comment-form input,.jb-comment-form textarea{padding:10px 12px;border:1px solid #e2e8f0;border-radius:8px;font:inherit;}
      .jb-comment-form textarea{min-height:90px;resize:vertical;}
      .jb-comment-form label.jb-checkbox{display:flex;align-items:flex-start;gap:8px;font-size:.82rem;color:#475569;}
      .jb-comment-form button{align-self:flex-start;padding:10px 22px;border:none;border-radius:8px;background:var(--primary,#004B23);color:#fff;font-weight:700;cursor:pointer;}
      .jb-comment-form button:hover{opacity:.9;}
      .jb-comment-msg{font-size:.85rem;font-weight:600;}
    `;
    document.head.appendChild(style);
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  async function loadComments(listEl) {
    const url = 'https://api.github.com/repos/' + REPO + '/contents/' + commentsPath;
    try {
      const res = await fetch(url);
      if (res.status === 404) { listEl.innerHTML = '<p class="jb-comment-msg">' + t.empty + '</p>'; return; }
      const files = await res.json();
      if (!Array.isArray(files) || !files.length) { listEl.innerHTML = '<p class="jb-comment-msg">' + t.empty + '</p>'; return; }

      const items = await Promise.all(files
        .filter(function (f) { return /\.(yml|yaml|json)$/.test(f.name); })
        .map(async function (f) {
          const raw = await (await fetch(f.download_url)).text();
          let data = {};
          try {
            data = f.name.endsWith('.json') ? JSON.parse(raw) : (window.jsyaml ? window.jsyaml.load(raw) : {});
          } catch (e) { data = {}; }
          return data;
        }));

      items.sort(function (a, b) { return new Date(a.date || 0) - new Date(b.date || 0); });

      listEl.innerHTML = items.map(function (c) {
        return '<div class="jb-comment-item">' +
          '<span class="jb-comment-author">' + escapeHtml(c.name || 'Anonim') + '</span>' +
          '<span class="jb-comment-date">' + (c.date ? new Date(c.date).toLocaleDateString() : '') + '</span>' +
          '<div class="jb-comment-body">' + escapeHtml(c.message) + '</div>' +
        '</div>';
      }).join('') || '<p class="jb-comment-msg">' + t.empty + '</p>';
    } catch (e) {
      listEl.innerHTML = '<p class="jb-comment-msg">' + t.empty + '</p>';
    }
  }

  function buildSection() {
    injectStyles();
    const section = document.createElement('section');
    section.className = 'jb-comments';
    section.innerHTML =
      '<h3>' + t.heading + '</h3>' +
      '<div class="jb-comment-list"><p class="jb-comment-msg">' + t.loading + '</p></div>' +
      '<form class="jb-comment-form">' +
        '<input type="text" name="fields[name]" required placeholder="' + t.name + '">' +
        '<input type="text" name="fields[github]" required placeholder="' + t.github + '">' +
        '<textarea name="fields[message]" required placeholder="' + t.message + '"></textarea>' +
        '<label class="jb-checkbox"><input type="checkbox" required> ' + t.subscribeRequired + '</label>' +
        '<input type="hidden" name="options[slug]" value="' + escapeHtml(slug) + '">' +
        '<input type="hidden" name="options[collection]" value="' + escapeHtml(collection) + '">' +
        '<button type="submit">' + t.submit + '</button>' +
        '<div class="jb-comment-msg jb-comment-status"></div>' +
      '</form>';

    const host = document.getElementById('single-container') || document.getElementById('single-view') || document.body;
    host.parentNode.insertBefore(section, host.nextSibling);

    loadComments(section.querySelector('.jb-comment-list'));

    const form = section.querySelector('.jb-comment-form');
    const statusEl = section.querySelector('.jb-comment-status');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      const formData = new FormData(form);
      const body = {};
      formData.forEach(function (value, key) { body[key] = value; });

      try {
        const res = await fetch(STATICMAN_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(body).toString()
        });
        if (res.ok) {
          statusEl.textContent = t.pending;
          form.reset();
        } else {
          statusEl.textContent = t.error;
        }
      } catch (err) {
        statusEl.textContent = t.error;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSection);
  } else {
    buildSection();
  }
})();
