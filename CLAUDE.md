# CLAUDE.md

Situs statis portofolio dan knowledge-sharing (GitHub Pages + Cloudflare Workers Builds, domain `jagatb.com`). Tidak ada build step, linter, atau test. Pengguna berbahasa Indonesia; balas dalam bahasa Indonesia.

## Struktur singkat

- Koleksi artikel: `studi-kasus`, `supply-chain`, `data-storytelling`, `ai`, `day-in-my-life`. Versi Inggris ada di folder `<koleksi>-en/`.
- Halaman daftar tiap koleksi ada di root (`<koleksi>.html`). Daftar dibaca dari file `.md` di folder koleksi lewat GitHub API; kartu artikel dibuat dari front matter.
- Artikel bisa berupa Markdown biasa, atau halaman HTML mandiri (mis. `data-storytelling-en/Chart Advisor.html`) yang ditautkan lewat `archive_url` di file `.md`.

## Alur "tambahkan artikel" (artikel HTML mandiri)

Kalau pengguna bilang "tambahkan artikel ..." dan file HTML-nya sudah ada di repo, lakukan semua langkah ini tanpa perlu diminta satu per satu. Kalau koleksi atau file tidak jelas, tanyakan dulu.

1. **Entri kategori.** Buat `<koleksi>-en/YYYY-MM-DD-<slug>.md` (tanggal = hari ini). Contoh acuan: `data-storytelling-en/2026-10-12-chart-advisor.md`. Isi front matter:
   - `title`, `archive_url` (path dari root, URL-encoded, mis. `data-storytelling-en/Chart%20Advisor.html`), `kicker`, `date` (ISO), `summary` (ambil dari `<meta name="description">` halaman), `tags` (hanya yang benar-benar relevan; jangan menambah tag seperti CSCP kalau tidak berkaitan).
   - Isi body: satu baris tautan ke HTML-nya.
2. **Pastikan daftar kategori membuka HTML langsung.** Hanya `studi-kasus.html` dan `data-storytelling.html` yang sudah membaca `archive_url`. Untuk `supply-chain.html`, `ai.html`, `day-in-my-life.html`, tambahkan dulu hal yang sama seperti di `data-storytelling.html`: `card.href = fm.archive_url || (...)` pada pembuatan kartu, dan redirect `window.location.replace(fm.archive_url)` pada cabang `?post=` sebelum render. Sebutkan perubahan ini ke pengguna.
3. **Tombol di halaman artikel.** Tambahkan blok `.page-actions` di dalam hero, tepat di bawah baris `.meta`, plus CSS-nya (salin dari `data-storytelling-en/Chart Advisor.html`):
   - "Back to <Nama Kategori>" (`id="archive-return"`, kelas `page-action`) → `../<koleksi>.html`
   - "Home" (`id="home-return"`, kelas `page-action secondary`) → `../index.html`
   - Jika halaman tidak punya `.meta`, taruh setelah paragraf `lead` di hero. Untuk versi bahasa Indonesia, arahkan ke `../index-id.html` dan `../<koleksi>.html?lang=id`.
   - **Jangan menghapus atau mengubah tombol bawaan halaman** (tombol lab, kalkulator, upload, dan sejenisnya). Itu fungsi halaman. Kalau pengguna minta menghapus tombol tertentu dan tidak jelas yang mana, tanyakan.
4. **Validasi sebelum commit.** Parse YAML front matter, pastikan target `archive_url` dan link tombol ada, dan jumlah `<button` tidak berubah.
5. **Git.** Kerja di branch yang ditetapkan sesi. Sebelum menambah commit ke branch yang sudah punya PR, cek dulu apakah PR-nya sudah di-merge. Kalau sudah, mulai ulang branch dari `origin/main` terbaru (`git checkout -B <branch> origin/main`) dan buat PR baru; jangan menumpuk commit di PR yang sudah merge. Commit, push, lalu tawarkan membuat PR (jangan buat PR tanpa diminta).
6. **Beri tahu pengguna sebelum merge:** file `.md` baru di folder koleksi memicu workflow saat masuk `main`: pengumuman GitHub Discussion (tidak bisa ditarik) dan regenerasi `feed.xml`.

## Setelah merge

- Uji di tab incognito atau muat ulang keras, bukan lewat tombol Back; Chrome memakai salinan lama saat navigasi mundur.
- Check Cloudflare "Workers Builds: web-jagat-batara" pernah gagal seketika pada beberapa PR tanpa teks error di GitHub. Penyebabnya hanya terlihat di dashboard Cloudflare. Kalau situs live tidak berubah setelah merge, minta pengguna memeriksa log build itu.

## Catatan lain

- Jangan menjalankan `scripts/generate-feed.js` secara lokal lalu meninggalkan hasilnya; `feed.xml` diregenerasi otomatis oleh workflow saat merge.
- Tag di beberapa artikel lama ditulis tanpa spasi (mis. `DataAnalytics`); itu bukan bug dari perubahan terbaru.
