# Analisis Prioritas & Dependency Graph

> **Tujuan**: Memetakan dependensi antar fase pengembangan, mengidentifikasi peluang paralelisasi, dan menentukan critical path untuk mempercepat time-to-market.

---

## 1. Dependency Graph Visual

```
                        ┌──────────────────────────────────────────────┐
                        │                                              │
                        ▼                                              │
┌─────┐    ┌─────────┐    ┌──────┐    ┌──────┐
│ V1  │───►│ V1.1    │───►│ V3   │───►│ V5   │
│ Gen │    │ Sheets  │    │ Auth │    │ Foto │
└─────┘    └─────────┘    └──────┘    └──────┘
  │            │              │
  │            │              └──────────┐
  │            │                         ▼
  │            │              ┌──────────────────────┐
  │            └──────────────┤ V4 (Telegram Bot)    │
  │                           └──────────────────────┘
  │
  ▼
┌──────┐    ┌──────┐
│ V2   │───►│ V6   │
│ Std  │    │ Dash │
└──────┘    └──────┘
```

### Simbol

- `───►` = **Hard dependency** — fase tujuan TIDAK BISA dikerjakan sebelum fase asal selesai
- `- - ►` = **Soft dependency** — fase tujuan SEBAIKNYA menunggu, tapi bisa mulai persiapan

---

## 2. Tabel Dependensi Lengkap

| Dari | Ke | Sifat | Alasan |
|------|----|-------|--------|
| — | **V1** | **Root** | Titik awal. Tidak ada dependensi. |
| V1 | V1.1 | **Hard** | Form harus jadi dulu sebelum integrasi backend. TAPI backend Apps Script bisa dibangun paralel. |
| V1 | V2 | **Soft** | Standardisasi template idealnya setelah ada feedback dari pemakaian V1. Tapi desain template bisa mulai lebih awal. |
| V1.1 | V3 | **Hard** | Auth butuh backend yang sudah jalan (endpoint dan database). |
| V1.1 | V4 | **Hard** | Telegram Bot butuh data dari submission; bot bisa nunggu data masuk. |
| V1.1 | V5 | **Hard** | Upload foto butuh backend storage dan kolom tautan di sheet. |
| V3 | V5 | **Hard** | Foto sebaiknya terikat ke identitas pengirim (auth). |
| V2 | V6 | **Hard** | Dashboard butuh data yang sudah terstandarisasi. |

---

## 3. Peluang Paralel

### ✅ Bisa Dikerjakan Paralel

| Wave | Fase | Alasan | Estimasi Hemat Waktu |
|------|------|--------|---------------------|
| 1 | **V1 + Backend V1.1** | Frontend statis (HTML+Tailwind) dan Google Apps Script tidak punya shared code. Cukup sepakat API contract (format JSON yang dikirim). | **2 minggu** |
| 2 | **V2 + V1.1 Integrasi** | Sambil nunggu feedback V1, tim backend bisa integrasi frontend ke Apps Script. | **1 minggu** |
| 3 | **V3 + V4** | Auth (Google OAuth) dan Telegram Bot tidak saling membutuhkan. Keduanya hanya perlu endpoint Apps Script yang sama. | **4 minggu** |
| 4 | **V5 + Persiapan V6** | Sambil nunggu V6, desain layout dashboard dan chart bisa mulai dari V5. | **2 minggu** |

### ❌ Tidak Bisa Paralel

| Fase | Penghambat | Kenapa |
|------|-----------|--------|
| V3 sebelum V1.1 | Tidak ada backend target | Auth buat apa kalau belum ada data yang diamankan? |
| V4 sebelum V1.1 | Tidak ada data | Bot telegram ngirim apa kalau belum ada submission? |
| V6 sebelum V2 | Data belum standar | Dashboard dengan data tidak seragam = insight menyesatkan |
| V5 sebelum V3 | Upload tanpa auth | Resiko penyalahgunaan storage tinggi |

---

## 4. Critical Path

**Critical path** = rangkaian fase terpanjang yang menentukan kapan proyek "selesai" (V6 terkirim).

```
V1 (2 mg) → V1.1 (2 mg) → V3 (3 mg) → V5 (3 mg) = 10 minggu
                          → V4 (2 mg)             = 9 minggu
V1 (2 mg) → V2 (3 mg) → V6 (4 mg)                = 9 minggu
```

**Critical Path Utama**: `V1 → V1.1 → V3 → V5` = **10 minggu**

> ⚡ **Opportunity**: V5 tidak harus menunggu V3 selesai 100%. Begitu auth dasar beres (login + whitelist check), V5 bisa mulai. Potensi hemat 1-2 minggu.

---

## 5. Resource Loading

Siapa ngapain di setiap fase — dengan asumsi **1 frontend + 1 backend engineer** (atau 1 fullstack):

| Fase | Frontend | Backend | Total Effort |
|------|----------|---------|-------------|
| V1 | 100% | — | 1 org x 2 mg |
| V1.1 | 20% (integrasi) | 80% (Apps Script + Sheet) | 1 org x 2 mg |
| V2 | 80% (template, preview) | 20% (validasi) | 1 org x 3 mg |
| V3 | 20% (tombol login) | 80% (OAuth + whitelist) | 1 org x 3 mg |
| V4 | — | 100% (Bot + webhook) | 1 org x 2 mg |
| V5 | 40% (upload UI) | 60% (Drive API + compress) | 1 org x 3 mg |
| V6 | 60% (chart, filter) | 40% (data aggregation) | 1 org x 4 mg |

### Paralel Resource Loading

Di Wave 3 (V3 + V4 paralel):

```
Minggu 9: [Frontend] --- V3 login button ---
          [Backend]  --- V3 OAuth logic ---
Minggu 10:[Frontend] --- (idle / bantu V4) ---
          [Backend]  --- V4 Telegram Bot ---
Minggu 11:[Frontend] --- V4 format pesan ---
          [Backend]  --- V4 webhook ---
```

Dengan 1 fullstack: kerjakan V3 dulu (3 minggu), lanjut V4 (2 minggu) = **5 minggu total**, bukan 3 minggu paralel.

---

## 6. Strategi Rekomendasi

### Opsi A: Paling Cepat ke Feedback (✅ Rekomendasi)

```
Minggu 1-2:  V1 + Backend V1.1 (paralel penuh)
Minggu 3-4:  Integrasi V1.1 + UAT dengan verifikator
Minggu 5-8:  V2 (standarisasi) + perbaikan feedback
Setelah itu: Evaluasi — apakah lanjut V3 atau stop?
```

**Total ke feedback: 2 minggu.**

### Opsi B: Paling Seimbang

```
Minggu 1-2:  V1
Minggu 3-4:  V1.1 + V2 (paralel terbatas)
Minggu 5-8:  V2 lanjutan + UAT
Minggu 9-12: V3 + V4 paralel
```

### Opsi C: Feature Complete (Paling Cepat Selesai Semua)

```
Minggu 1-2:  V1 + Backend V1.1
Minggu 3-4:  V1.1 integrasi + V2 mulai
Minggu 5-6:  V2 selesai
Minggu 7-10: V3 + V4 + V5 mulai (paralel)
Minggu 11-14: V5 selesai + V6
```

**Risiko**: Fitur terbanyak belum tentu paling membantu. Bisa wasting effort kalau ternyata V1 saja sudah cukup.

---

## 7. Rekomendasi Akhir

### ✅ PILIH OPSI A — Cepat ke Feedback

**Alasan:**

1. **Validasi adalah segalanya.** Semakin cepat verifikator pegang V1, semakin cepat tahu apakah arahnya benar.
2. **V1 + Backend V1.1 paralel** = hanya 2 minggu ke working prototype.
3. **Biayaswitch rendah.** Kalau V1 gagal (verifikator tidak mau pakai), hanya 2 minggu effort terbuang — bukan 3 bulan.
4. **Data dari V1.1** sudah bisa memberikan insight untuk prioritas berikutnya — apakah standarisasi (V2), auth (V3), atau notifikasi (V4) yang lebih mendesak.

**Prinsip**: Build → Measure → Learn. Bukan Build → Build → Build → (ternyata salah).

### Blocking Callout

**Satu hal yang KRUSIAL sebelum coding dimulai: Sepakati API contract antara V1 dan V1.1.**

```json
{
  "timestamp": "2026-06-10T10:00:00Z",
  "jenis_bantuan": "Sembako",
  "jumlah": 500000,
  "nama_penerima": "Siti Rahmawati",
  "alamat": "RT 03 RW 05, Desa Sukamaju",
  "tanggal_penyerahan": "2026-06-10",
  "nama_verifikator": "Ahmad Fauzi",
  "jabatan": "Verifikator Lapangan"
}
```

Dengan contract ini disepakati, V1 (frontend) dan V1.1 (Apps Script) bisa dikerjakan paralel tanpa blocking.

---

## 8. Timeline Gantt (Teks)

```
Minggu     1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
V1        [====]
V1.1 bknd     [====]
V1.1 int          [==]
UAT                 [==]
V2                     [=====]
V3                           [=====]
V4                           [====]
V5                                    [=====]
V6                                          [========]
         ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
         ↑                          ↑
      Feedback pertama          Data cukup untuk
      dari verifikator          dashboard (V6)
```

### Milestones

| Minggu | Milestone |
|--------|-----------|
| **2** | V1 live di GitHub Pages |
| **4** | Data pertama masuk ke Google Sheet |
| **5** | Feedback dari ≥3 verifikator terkumpul |
| **8** | Template laporan standar final |
| **12** | Autentikasi + notifikasi Telegram berjalan |
| **16** | Upload foto berfungsi |
| **20** | Dashboard monitoring live |
