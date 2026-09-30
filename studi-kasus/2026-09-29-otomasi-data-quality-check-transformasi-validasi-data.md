---
title: "Otomasi Data Quality Check: Transformasi Validasi Data Operasional"
kicker: "Case Study · Process Automation & Analytics"
date: 2026-09-29T00:00:00.000Z
summary: >
  Merancang dan membangun rule engine data quality serta dashboard eksekutif
  yang menggantikan proses audit manual mingguan dengan pipeline harian
  otomatis berbasis statistik — dibangun untuk operasi mining & logistics
  dan diskalakan ke portofolio dataset yang terus bertambah.
tags:
  - Low-code Automation
  - Rule Engine Design
  - Statistical Anomaly Detection
  - Power BI
  - Data Governance
hero_stats:
  - value: "~4 jam → 0"
    label: "Effort QA manual / minggu"
  - value: "80+"
    label: "Rule validasi otomatis"
  - value: "Harian"
    label: "Eksekusi tanpa pengawasan"
  - value: "2 → 5"
    label: "Dataset dalam roadmap"
architecture_image: "/images/architecture-diagram.png"
architecture_caption: "Pipeline end-to-end: trigger terjadwal → rule engine → narasi AI dengan fallback → audit log → dashboard"
dashboard_image: "/images/dashboard-mockup.png"
dashboard_caption: "Mockup ilustratif — nama dataset dan angka bersifat representatif, bukan data produksi"
tech_stack:
  - "Low-code Workflow Automation"
  - "TypeScript (Office Scripts)"
  - "Power BI & DAX"
  - "Power Query (M)"
  - "Statistical Process Control (3σ)"
  - "Rule-Based Validation Design"
  - "Data Modeling"
  - "Applied Generative AI (narrative layer)"
impact_summary:
  - value: "100%"
    label: "Effort audit manual dihilangkan"
  - value: "80+"
    label: "Business rule terkodifikasi"
  - value: "Hari"
    label: "Waktu replikasi ke domain baru"
  - value: "1"
    label: "Dashboard terpadu, portofolio berkembang"
disclaimer: >
  Nama perusahaan, nama dataset, dan seluruh angka bersifat ilustratif dan
  telah digeneralisasi untuk melindungi data operasional rahasia. Arsitektur
  dan logika rule yang dijelaskan mencerminkan sistem nyata yang dibangun
  dan dijalankan di produksi.
---

## Situation

Sebuah operasi mining & logistics skala menengah mengelola data harian
berthing kapal dan kargo sepenuhnya lewat pencatatan spreadsheet manual.
Pengecekan kualitas data dilakukan mingguan secara manual — proses yang
memakan waktu sekitar empat jam per siklus, rentan kelelahan reviewer,
terbatas pada pemeriksaan level format, dan tidak memiliki baseline
statistik atau jejak audit apa pun. Kesalahan baru terlihat setelah
laporan sudah sampai ke tangan manajemen.

## Task

Merancang dan membangun sistem data quality berbasis rule yang mampu:

- Memvalidasi data operasional setiap hari tanpa intervensi manual
- Mendeteksi anomali secara statistik dan dinamis, bukan berdasarkan
  ambang batas tetap
- Menyajikan tampilan tingkat portofolio lintas beberapa domain data
  seiring program berkembang melampaui satu dataset

## Action

- **Meny**un r**ebook validasi berting**t** (severity Critical / High /
  Info) yang mencakup kelengkapan data, urutan kronologis, rekonsiliasi
  lintas-kolom, dan integritas data referensi — 80+ rule secara total,
  dikembangkan rule demi rule bersama stakeholder domain sebelum satu
  baris kode pun ditulis.
- **Membangun lapisan de**ksi outlier statistik** menggunakan metode
  3-sigma, disegmentasi berdasarkan konteks operasional (misalnya
  terminal × jenis kargo × kelas kapal), bukan ambang batas tetap.
- **Menyempurnakan model statistik l**at iterasi tuning** — termasuk
  memperbaiki bias nyata di mana metrik downtime justru berskala
  mengikuti durasi operasi; dengan menyatakannya ulang sebagai rasio
  terhadap total waktu, false positive hilang tanpa kehilangan
  sensitivitas deteksi.
- **Menge**ternalisasi seluruh data referens**dan threshold** ke dalam
  workbook master data, menghilangkan business logic yang hardcode
  sehingga stakeholder non-teknis dapat menyesuaikan rule tanpa
  perubahan kode.
- **Mengorkestrasi**eluruh pipeline** dalam platform low-code
  automation: trigger harian terjadwal → eksekusi rule engine →
  ringkasan naratif berbantuan AI (dengan fallback deterministik untuk
  ketahanan saat kapasitas AI tidak tersedia) → alert email berbasis
  severity → audit log yang terus bertambah (append-only).
- **Memperluas arsitekt** ke domain data**edua**, merancang model data
  yang skalabel (riwayat run append-only + detail temuan yang selalu
  ter-refresh) sehingga pola pipeline yang sama dapat melayani
  portofolio dataset yang terus bertambah tanpa perlu didesain ulang.
- **Merancang dan membangun**ashboard Power BI dua lapis**: ringkasan
  eksekutif yang mengagregasi skor kesiapan data di seluruh domain yang
  dipantau, dan tampilan drill-down per domain yang menunjukkan rule
  yang paling sering gagal, record yang terdampak, serta tren kualitas
  data dari waktu ke waktu.

## Result

- Mengurangi effort QA manual dari ~4 jam/minggu menjadi nol pekerjaan
  manual yang berkelanjutan.
- Membangun katalog rule yang auditable dan repeatable, yang berhasil
  mengungkap masalah data sistemik yang sebelumnya tidak terlihat lewat
  pengecekan spot-check manual.
- Menghasilkan blueprint yang dapat digunakan ulang dan berhasil
  direplikasi ke domain operasional kedua dalam hitungan hari, bukan
  bulan.
- Memberikan manajemen tampilan langsung dan menyeluruh atas tren
  kualitas data lintas portofolio — kapabilitas yang sebelumnya tidak
  pernah ada.

## Prinsip Desain

**De**r**nistic core, AI hanya menar**ikan** — Seluruh angka dan
temuan dihitung oleh logika berbasis rule. AI hanya digunakan untuk
menghasilkan ringkasan yang mudah dibaca, menghilangkan risiko
halusinasi pada data yang mendasarinya.

**Zero h**dcoded threshold** — Daftar referensi dan ambang batas
bisnis disimpan di sumber master data eksternal, sehingga penyesuaian
operasional tidak memerlukan perubahan kode atau deployment ulang.

**Outlier y**g sol** secara statistik** — Metrik yang secara alami
berskala mengikuti faktor yang tidak terkontrol dibandingkan sebagai
rasio yang dinormalisasi, bukan angka mentah — menghindari bias
terhadap record yang lebih besar atau berdurasi lebih panjang.

## Catatan Dashboard

Dashboard dirancang mengikuti hierarki pertanyaan sederhana: *apakah
portofolio ini sehat?* (ringkasan eksekutif) diikuti *apa tepatnya yang
sal*h, dan di*mana?* (drill-down per dataset). Pola scorecard dataset
memungkinkan domain baru bergabung ke program hanya dengan menambah
satu baris — bukan mendesain ulang.
