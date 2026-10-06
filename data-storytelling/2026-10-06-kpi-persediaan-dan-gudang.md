---
title: "KPI Persediaan dan Gudang: Mengukur Kinerja Tanpa Kehilangan Konteks"
date: 2026-10-06T00:00:00.000Z
thumbnail: ''
en_link: data-storytelling-en/2026-10-06-inventory-warehouse-kpis
tags:
  - DataAnalytics
  - SupplyChain
  - Logistics
  - InventoryManagement
  - WarehouseManagement
  - KPI
  - DataVisualization
  - OperationsManagement
  - CSCP
  - ContinuousImprovement
---

## Satu angka tidak cukup untuk menilai persediaan dan gudang

Gudang yang hampir penuh bisa terlihat efisien. Perputaran persediaan yang tinggi bisa tampak sehat. Namun, keduanya belum tentu berarti pelanggan menerima pesanan lengkap dan tepat waktu. KPI baru berguna ketika kita memahami keputusan yang dibantu oleh angka tersebut—dan dampak yang mungkin disembunyikannya.

Persediaan mengikat modal sekaligus melindungi layanan dari ketidakpastian permintaan dan pasokan. Gudang mengubah ruang, tenaga kerja, dan peralatan menjadi barang yang siap dikirim. Karena itu, kinerja keduanya perlu dibaca sebagai satu rangkaian, bukan kumpulan skor yang berdiri sendiri.

## Persediaan: modal, kecepatan, dan ketersediaan

**Perputaran persediaan** membandingkan harga pokok penjualan tahunan dengan rata-rata nilai persediaan:

> Perputaran = harga pokok penjualan tahunan ÷ rata-rata persediaan

Jika harga pokok penjualan tahunan sebesar $21 juta dan rata-rata persediaan $3 juta, perputarannya **7 kali setahun**. Angka ini membantu melihat berapa banyak modal yang tertahan, tetapi “lebih tinggi” tidak selalu lebih baik: pemangkasan stok yang terlalu jauh dapat memicu kehabisan barang dan pesanan tertunda.

Lengkapi perputaran dengan **days of supply (DOS)**, yaitu berapa hari stok saat ini dapat memenuhi pemakaian:

> DOS = stok tersedia ÷ pemakaian rata-rata per hari

Stok 2.000 unit dengan pemakaian 200 unit per hari memberi DOS **10 hari**. Hitung atau tinjau DOS per SKU dan kelas persediaan; satu angka gabungan dapat menutupi barang lambat bergerak maupun produk penting yang hampir habis.

Rata-rata persediaan juga perlu mencerminkan pola sepanjang tahun. Mengambil rata-rata hanya dari dua tanggal dapat melewatkan musim puncak dan membuat perputaran tampak lebih baik atau lebih buruk daripada kondisi sebenarnya.

## Akurasi catatan adalah fondasi

Rencana pengadaan dan keputusan pengisian ulang bergantung pada catatan yang sesuai dengan stok fisik. Salah satu cara sederhana mengukur **akurasi persediaan** adalah menghitung item yang catatannya berada dalam batas toleransi:

> Akurasi = item dalam batas toleransi ÷ item yang dihitung

Jika 962 dari 1.000 item cocok dengan batas yang disepakati, akurasinya **96,2%**. Tetapkan toleransi yang sesuai dengan nilai dan risiko item, lalu telusuri penyebab selisih. Penghitungan siklus berkala membantu menemukan masalah sebelum berkembang menjadi keputusan pembelian, picking, atau janji layanan yang keliru.

## Hubungkan stok dengan pengalaman pelanggan

**Fill rate** menunjukkan porsi permintaan yang dapat dipenuhi. Jika pelanggan meminta 100 unit dan hanya 92 yang tersedia, fill rate-nya **92%**. **On-time in full (OTIF)** menambahkan dimensi waktu: pesanan hanya dihitung berhasil jika tiba lengkap dan sesuai tanggal yang disepakati.

Persentase saja belum menjelaskan besarnya dampak. Tampilkan jumlah pesanan atau pelanggan yang terdampak, definisi “tepat waktu”, serta frekuensi dan durasi stockout. Tanpa definisi konsisten, tim dapat membandingkan angka yang sebenarnya mengukur hal berbeda.

## Gudang: jangan mengejar utilisasi secara terpisah

Utilisasi posisi palet dapat dihitung sebagai posisi yang terisi dibagi posisi penyimpanan yang benar-benar dapat digunakan. Contohnya, 4.500 dari 5.000 posisi berarti **90%** terisi. Namun, utilisasi posisi tidak sama dengan utilisasi volume: posisi yang terisi muatan pendek atau parsial dapat menghasilkan pemakaian ruang kubik yang rendah.

Bandingkan penggunaan kapasitas rata-rata dengan puncaknya untuk melihat ruang yang tersisa saat permintaan musiman meningkat. Ukur pula akurasi picking, produktivitas tenaga kerja, waktu dari barang diterima hingga siap diambil, throughput, dan biaya. Definisikan titik mulai dan selesai setiap ukuran dengan jelas agar hasil antarperiode dan antar-gudang bisa dibandingkan.

Utilisasi tenaga kerja atau peralatan yang tinggi bukan tujuan akhir. Jika peningkatan utilisasi menambah persediaan tanpa menaikkan throughput atau layanan, tim mungkin hanya memindahkan biaya dan kemacetan ke bagian lain.

## Susun dashboard untuk mengambil tindakan

Mulailah dari pertanyaan operasional, lalu pasangkan ukuran yang saling melengkapi:

- **Modal dan risiko stok:** perputaran, DOS per SKU/kelas, persediaan lambat bergerak, dan biaya penyimpanan.
- **Keandalan data:** akurasi catatan dan penyebab selisih.
- **Layanan:** fill rate, OTIF, stockout, serta jumlah pesanan yang terdampak.
- **Operasi gudang:** kapasitas rata-rata dan puncak, akurasi picking, produktivitas, throughput, dan biaya.

KPI sebaiknya memiliki definisi, sumber data, periode pengukuran, dan pemilik tindak lanjut yang disepakati. Mulailah dengan beberapa ukuran yang menjawab keputusan nyata, kemudian telusuri rincian saat sebuah sinyal menunjukkan masalah.

Kerangka metrik dalam artikel ini merujuk pada topik manajemen persediaan, gudang, dan layanan di CSCP Learning System (ASCM), Modul 2, 4, dan 6. Rumus operasional tertentu dapat berbeda antarorganisasi; dokumentasikan konvensi yang digunakan sebelum membandingkan hasil.

**Pertanyaan diskusi:** KPI apa yang paling membantu tim Anda menyeimbangkan ketersediaan stok, kapasitas gudang, dan layanan pelanggan?
