# SIP Verifikator Tools — PRD Roadmap

> **VisI**: Membantu verifikator SIP membuat laporan penyerahan bantuan secara cepat, seragam, dan mudah dibagikan — tanpa menambah beban administrasi.
>
> **Misi**: Dari alat generate laporan sederhana menuju sistem pendataan bantuan yang terstruktur, bertahap, tanpa over-engineering.

---

## Fase Pengembangan

```
V1 ─────────────────────────────────────────────    (Minggu 1-2)
      └── V1.1 ────────────────────────────────    (Minggu 3-4)
              └── V2 ───────────────────────────    (Minggu 5-8)
                    └── V3 ╥── V4 ────────────    (Minggu 9-12)
                           ║
                           └── V5 ───────────────    (Minggu 13-16)
                                 └── V6 ────────    (Minggu 17-20)
```

---

### V1 — Generator Laporan (MVP inti)

| Item | Detail |
|------|--------|
| **Tujuan** | Validasi kebutuhan — apakah verifikator benar-benar terbantu? |
| **Ketergantungan** | Tidak ada (100% frontend statis) |
| **Bisa paralel?** | Ya, dengan V1.1 (definisi API + spreadsheet) |

#### Yang dibangun

1. **Form input** — field sesuai standar SIP:
   - Jenis Bantuan
   - Jumlah Bantuan
   - Nama Penerima
   - Alamat
   - Tanggal Penyerahan
   - Nama Verifikator
   - Keterangan / Jabatan Verifikator
2. **Generate laporan** — teks laporan sesuai template SIP
3. **Copy to Clipboard** — satu klik salin ke Telegram/WhatsApp

#### Tech stack

- HTML + HTMX + TailwindCSS
- GitHub Pages (hosting statis, biaya \$0)

#### Acceptance Criteria

- [ ] Form muncul dengan semua field required
- [ ] Validasi field wajib berfungsi (tidak boleh kosong)
- [ ] Tombol "Generate Laporan" menghasilkan teks sesuai template
- [ ] Tombol "Salin" berhasil copy ke clipboard
- [ ] Tampilan mobile-friendly (diuji dari HP)
- [ ] Waktu generate < 2 detik
- [ ] Dapat diakses via GitHub Pages URL

#### Success metrics

- Waktu pembuatan laporan: **< 1 menit** (sebelumnya 3-5 menit)
- 90% laporan menggunakan aplikasi di 3 bulan pertama

> ⚠️ **Catatan PM**: V1 adalah **satu-satunya fase yang wajib** untuk MVP. Jangan menambah fitur sebelum verifikator memberi feedback.

---

### V1.1 — Penyimpanan ke Google Sheets

| Item | Detail |
|------|--------|
| **Tujuan** | Mulai bangun data historis untuk monitoring |
| **Ketergantungan** | V1 (form + generate sudah jadi) |
| **Bisa paralel?** | Ya — backend Apps Script bisa dibangun paralel dengan V1 |

#### Yang dibangun

1. **Google Apps Script** — REST endpoint untuk menerima data
2. **Google Sheet** — tabel penyimpanan dengan kolom:
   - Timestamp | Jenis Bantuan | Jumlah | Nama Penerima | Alamat | Tanggal Serah | Verifikator | Jabatan
3. **HTMX POST** — dari frontend ke Apps Script
4. **Konfirmasi simpan** — notifikasi sukses/gagal di frontend

#### Acceptance Criteria

- [ ] Submit form → data masuk ke Google Sheet dalam < 3 detik
- [ ] Validasi server-side (field wajib)
- [ ] Response sukses/gagal ditampilkan ke user
- [ ] Anti duplikat submit (disable tombol setelah klik)

#### Risk Mitigation

| Risiko | Mitigasi |
|--------|----------|
| Kuota Apps Script harian | Monitoring; prepare migrasi ke backend ringan (Cloudflare Worker dll) |
| Data palsu dari pihak luar | Diterima di MVP; autentikasi menyusul di V3 |

---

### V2 — Standardisasi & Validasi Laporan

| Item | Detail |
|------|--------|
| **Tujuan** | 100% laporan menggunakan format standar SIP |
| **Ketergantungan** | V1.1 (data sudah masuk ke sheet) |
| **Bisa paralel?** | Tidak — harus menunggu feedback dari V1 |

#### Yang dibangun

1. **Template laporan** — format baku sesuai dokumen SIP
2. **Preview laporan** — lihat hasil sebelum copy
3. **Auto-format** — nominal otomatis terformat (Rp 1.000.000)
4. **Tanggal otomatis** — default ke hari ini

#### Acceptance Criteria

- [ ] Template laporan sudah disahkan koordinator SIP
- [ ] Preview menunjukkan format final sebelum copy
- [ ] Nominal otomatis format Rupiah
- [ ] Tanggal default = hari ini, bisa diubah

---

### V3 — Autentikasi Pengguna

| Item | Detail |
|------|--------|
| **Tujuan** | Menjamin validitas pelapor |
| **Ketergantungan** | V1.1 (backend sudah ada) |
| **Bisa paralel?** | Ya — bisa dikerjakan paralel dengan V4 |

#### Yang dibangun

1. **Login Google OAuth** — via Apps Script atau layanan pihak ketiga
2. **Whitelist email** — hanya verifikator terdaftar yang bisa submit
3. **Session sederhana** — tidak perlu JWT rumit, cukup token pendek

#### Acceptance Criteria

- [ ] Login dengan Google Workspace akun
- [ ] Email tidak terdaftar → ditolak
- [ ] Session expire dalam 24 jam
- [ ] Data laporan tercatat siapa pengirimnya (email)

---

### V4 — Notifikasi Otomatis (Telegram)

| Item | Detail |
|------|--------|
| **Tujuan** | Menghilangkan proses copy-paste manual |
| **Ketergantungan** | V1.1 (data sudah terkirim) |
| **Bisa paralel?** | Ya — bisa paralel dengan V3 |

#### Yang dibangun

1. **Telegram Bot** — bot sederhana pakai API Telegram
2. **Webhook dari Apps Script** — setiap submit → kirim ke grup
3. **Format pesan** — sama dengan template laporan
4. **Konfigurasi grup ID** — via sheet atau env

#### Acceptance Criteria

- [ ] Submit form → laporan otomatis terkirim ke grup Telegram
- [ ] Format pesan rapi (markdown/html)
- [ ] Bot bisa di-invite ke grup mana pun
- [ ] Error handling jika bot gagal kirim

---

### V5 — Dokumentasi Foto

| Item | Detail |
|------|--------|
| **Tujuan** | Dokumentasi bantuan lebih lengkap dengan bukti foto |
| **Ketergantungan** | V1.1 (backend), V3 (autentikasi — opsional) |
| **Bisa paralel?** | Tidak — butuh storage backend |

#### Yang dibangun

1. **Upload foto** — via form (1-3 foto per laporan)
2. **Penyimpanan Google Drive** — folder per tanggal/verifikator
3. **Tautan di Sheet** — link foto tersimpan di baris data
4. **Compress client-side** — sebelum upload

#### Acceptance Criteria

- [ ] Upload 1-3 foto per laporan
- [ ] File tersimpan di Google Drive dengan struktur folder
- [ ] Link foto tercatat di Google Sheet
- [ ] Ukuran file < 1 MB (compress di client)

---

### V6 — Dashboard Monitoring

| Item | Detail |
|------|--------|
| **Tujuan** | Mendukung pengambilan keputusan berbasis data |
| **Ketergantungan** | V2 (data standar), V1.1 (data historis) |
| **Bisa paralel?** | Sebagian — desain layout dashboard bisa mulai dari V2 |

#### Yang dibangun

1. **Statistik bantuan** — total, per jenis, per periode
2. **Statistik verifikator** — jumlah laporan per verifikator
3. **Statistik wilayah** — sebaran bantuan per alamat
4. **Filter & export** — filter tanggal, export ke CSV
5. **Visualisasi** — chart sederhana (Chart.js atau Google Charts)

#### Acceptance Criteria

- [ ] Dashboard bisa diakses tanpa loading > 3 detik
- [ ] Filter tanggal berfungsi
- [ ] Data bisa di-export CSV
- [ ] Chart menampilkan tren bantuan per bulan

---

## Dependency Graph Lengkap

```
V1 (frontend statis)
 │
 ├──► V1.1 (Google Sheets) ──► V3 (Auth) ──► V5 (Foto)
 │                               │
 │                               └──► V4 (Telegram)
 │
 └──► V2 (Standardisasi) ──► V6 (Dashboard)
```

### Dependensi Kunci

| Fase | Dependency | Sifat |
|------|-----------|-------|
| V1 | — | **Root** — tidak ada dependensi |
| V1.1 | V1 | **Hard** — butuh form yang sudah jalan |
| V2 | V1 | **Soft** — bisa mulai setelah feedback V1 |
| V3 | V1.1 | **Hard** — butuh backend yang jalan |
| V4 | V1.1 | **Hard** — butuh data masuk ke sistem |
| V5 | V1.1, V3 | **Hard** — butuh backend + auth |
| V6 | V2, V1.1 | **Hard** — butuh data standar + historis |

---

## Strategi Paralel

### Wave 1 (Minggu 1-2) — Inisiasi
```
V1  ─────── Frontend (HTML + TailwindCSS)
V1.1 ─────── Backend (Apps Script + Sheet)    ← paralel dengan V1
```

### Wave 2 (Minggu 3-4) — Umpan Balik
```
V1.1 ─────── Integrasi frontend-backend
UAT ─────── Uji coba dengan 2-3 verifikator
```

### Wave 3 (Minggu 5-8) — Penguatan
```
V2  ─────── Standardisasi template
V3  ─────── Autentikasi (paralel dengan V2)
```

### Wave 4 (Minggu 9-12) — Otomasi
```
V4  ─────── Telegram Bot
V5  ─────── Upload foto (paralel dengan V4)
```

### Wave 5 (Minggu 13-20) — Insight
```
V6  ─────── Dashboard
```

---

## Go/No-Go Decision Gate

Setiap fase memiliki **gate** sebelum lanjut ke fase berikutnya:

| Gate | Keputusan | Kriteria |
|------|-----------|----------|
| **G1** (setelah V1) | Lanjut V1.1? | Minimal 3 verifikator pakai dan kasih feedback positif |
| **G2** (setelah V1.1) | Lanjut V2 atau V3? | Data terkumpul > 50 laporan; ada permintaan fitur standarisasi/auth |
| **G3** (setelah V2+V3) | Lanjut V4? | Verifikator minta otomatisasi kirim; koordinator butuh notifikasi realtime |
| **G4** (setelah V4) | Lanjut V5+V6? | Volume sudah > 200 laporan/bulan; ada kebutuhan dokumentasi visual |

> ⚠️ **Prinsip**: Jangan kerjakan V2+ sebelum feedback V1 terkumpul. Fitur terbanyak belum tentu yang paling membantu.

---

## Risiko Per Fase

| Fase | Risiko | Dampak | Mitigasi |
|------|--------|--------|----------|
| V1 | Verifikator tidak mau pakai | Tinggi | Libatkan dari hari 1; buat sesimpel mungkin |
| V1.1 | Kuota Apps Script habis | Sedang | Monitor; siapkan Cloudflare Worker sebagai cadangan |
| V2 | Template berubah terus | Rendah | Gunakan file konfigurasi, bukan hardcode |
| V3 | Google OAuth ribut di HP | Sedang | Uji di berbagai browser mobile |
| V4 | Telegram API rate limit | Rendah | Antrian kirim pesan |
| V5 | Ukuran foto membengkak | Sedang | Compress client-side wajib |
| V6 | Data tidak cukup untuk insight | Rendah | Dashboard sederhana dulu |

---

## Kriteria Produk Siap Rilis (Definition of Done)

- [ ] Seluruh acceptance criteria terpenuhi
- [ ] Diuji di minimal 2 browser (Chrome + Firefox mobile)
- [ ] Tidak ada data hilang atau corrupt
- [ ] Waktu loading < 3 detik
- [ ] Dokumentasi pengguna tersedia
- [ ] Link akses dibagikan ke verifikator
