# SIP Verifikator Tools

> **Alat bantu verifikator SIP membuat laporan penyerahan bantuan — cepat, seragam, dan siap bagikan ke Telegram/WhatsApp.**

---

## Latar Belakang

Verifikator SIP saat ini menyusun laporan penyerahan bantuan secara manual. Proses ini:

- Tidak konsisten formatnya
- Memakan waktu (3-5 menit per laporan)
- Rawan salah ketik nama, nominal, atau alamat
- Sulit direkap karena format tidak seragam
- Tidak ada data historis terstruktur

**SIP Verifikator Tools** hadir untuk menyelesaikan masalah itu — dimulai dari yang paling sederhana: **generate laporan dengan satu klik**.

---

## Tech Stack MVP

| Layer | Teknologi | Biaya |
|-------|-----------|-------|
| Frontend | HTML + HTMX + TailwindCSS | $0 |
| Hosting | GitHub Pages | $0 |
| Backend API | Google Apps Script | $0 |
| Database | Google Sheets | $0 |

**Total biaya operasional: Rp 0/bulan** pada fase MVP.

---

## Status Proyek

**Fase saat ini: V0 — Perencanaan**

Proyek masih dalam tahap perencanaan. Lihat [PRD-ROADMAP.md](PRD-ROADMAP.md) untuk detail roadmap.

| Fase | Status | Target |
|------|--------|--------|
| V1 — Generator Laporan | 🟡 Rencana | Minggu 1-2 |
| V1.1 — Penyimpanan Google Sheets | ⬜ Belum | Minggu 3-4 |
| V2 — Standardisasi Laporan | ⬜ Belum | Minggu 5-8 |
| V3 — Autentikasi | ⬜ Belum | Minggu 9-12 |
| V4 — Notifikasi Telegram | ⬜ Belum | Minggu 9-12 |
| V5 — Upload Foto | ⬜ Belum | Minggu 13-16 |
| V6 — Dashboard Monitoring | ⬜ Belum | Minggu 17-20 |

---

## Cara Memulai (V1)

### Prasyarat

- Browser modern (Chrome, Firefox, Edge, Safari)
- Koneksi internet

### Instalasi (Developer)

```bash
# Clone repo
git clone https://github.com/username/sip.git
cd sip

# V1 adalah frontend statis — cukup buka index.html
# Atau jalankan server lokal:
python3 -m http.server 8000
# Buka http://localhost:8000
```

### Deployment

```bash
# V1 di-host di GitHub Pages:
# 1. Push ke branch main
# 2. Settings → Pages → source: main branch /root
# 3. Selesai. URL: https://username.github.io/sip
```

---

## Fitur (V1)

- ✅ Form input data bantuan (jenis, jumlah, nama, alamat, tanggal, verifikator)
- ✅ Generate laporan sesuai format standar SIP
- ✅ Copy to clipboard — satu klik, langsung paste ke Telegram/WhatsApp
- ✅ Mobile friendly — nyaman dipakai dari HP
- ✅ Tanpa login — bisa langsung dipakai

---

## Struktur Proyek

```
sip/
├── index.html          # Halaman utama V1
├── style.css           # TailwindCSS (via CDN atau build)
├── script.js           # Logika form, generate, copy
├── README.md           # Dokumen ini
└── PRD-ROADMAP.md      # Roadmap pengembangan lengkap
```

*Struktur akan berkembang sesuai fase.*

---

## Prinsip Pengembangan

1. **Sesederhana mungkin** — verifikator bukan developer. UI harus intuitif.
2. **Semurah mungkin** — target $0/operasional di MVP.
3. **Cukup bermanfaat** — verifikator mau pakai setiap hari.
4. **Feedback dulu, baru fitur** — jangan tambah fitur sebelum verifikator ngasih feedback.
5. **No over-engineering** — setiap baris kode harus jawab kebutuhan nyata.

---

## Lisensi

Hak cipta © 2026 SIP Verifikator Tools.

Dikembangkan untuk kebutuhan internal verifikator SIP.
