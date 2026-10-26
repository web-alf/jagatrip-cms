# Cara Update Konten per Menu — Admin `/admin`

Panduan detail tiap menu di sidebar `/admin`. Untuk arsitektur/login/konsep
umum lihat `cms-flow.md`. Semua field di bawah ada di
`src/dc/admin.html`; default/fallback-nya ada di `src/data/defaults.ts`.

Jenis field yang dipakai:
- **text** — isian satu baris.
- **area** — textarea multi-baris.
- **select** — pilihan tetap (dropdown).
- **image** — upload gambar (auto resize ≤1600px + convert WebP) atau isi URL manual.
- **bool** — toggle on/off.

Simpan selalu lewat tombol **Simpan Perubahan** di header — berlaku sama untuk semua menu di bawah.

---

## Dashboard (Ringkasan)

Hanya tampilan statistik (jumlah program aktif, event tampil, artikel published, testimoni, FAQ) + checklist SEO homepage. **Tidak ada yang bisa diedit** di sini — kalau ada angka yang salah, perbaiki datanya di menu terkait (Program/Event/Articles/dst), bukan di sini.

---

## Hero (Halaman Publik)

Section paling atas homepage.

| Field | Tipe | Catatan |
|---|---|---|
| Eyebrow | text | label kecil di atas headline, maks 80 karakter |
| Headline (H1) | text | maks 70 karakter — **hanya satu H1 per halaman**, jangan diduplikasi di tempat lain |
| Kata yang di-highlight oranye | text | kata/frasa dari headline yang mau diwarnai beda |
| Paragraf pendukung | area | body di bawah headline |
| CTA utama — label / tautan | text | tombol pertama |
| CTA sekunder — label / tautan | text | tombol kedua |
| Visual hero | image | rasio 4:3 disarankan |
| Alt text visual | text | wajib diisi, untuk aksesibilitas + SEO gambar |

---

## About · Vision · Mission (Halaman Publik)

| Field | Tipe | Catatan |
|---|---|---|
| Eyebrow | text | |
| Headline (H2) | text | |
| Paragraf pembuka | area | 3 baris |
| Paragraf penjelas | area | 4 baris |
| Visi | area | |
| Misi | area | **satu poin per baris** |
| Tautan Read More | text | link tombol "selengkapnya" |

---

## Program (Halaman Publik) — List

Daftar kartu program di homepage. Bisa tambah/hapus/urutkan item.

| Field | Tipe | Catatan |
|---|---|---|
| Nama program | text | |
| Deskripsi singkat | area | maks 140 karakter |
| Status | select | `Aktif` / `Coming Soon` |
| Tautan pendaftaran | text | **isi hanya kalau Status = Aktif** |

> ⚠️ Field `icon`, `long` (deskripsi panjang), `who` (target peserta), dan `points` (poin-poin kegiatan) **tidak ada di form ini** — diambil otomatis dari `src/data/defaults.ts` dengan mencocokkan **judul program**. Kalau judul program diganti di admin, detail-detail ini akan hilang/fallback kosong di halaman `/program`. Kalau mau ganti judul, sebaiknya minta developer update juga `defaults.ts` di baris yang sama.

---

## Target Audience (Halaman Publik) — List

| Field | Tipe | Catatan |
|---|---|---|
| Kelompok | text | mis. "Kepala Sekolah" |
| Deskripsi singkat | text | maks 90 karakter |

> Icon per kelompok juga dicocokkan by judul dari `defaults.ts` (sama seperti Program) — bukan field di form.

---

## Coming Up Event (Halaman Publik) — List

| Field | Tipe | Catatan |
|---|---|---|
| Judul event | text | |
| Tanggal / waktu | text | bebas format, tampil apa adanya |
| Rute / format | text | mis. "KUALA LUMPUR → HAT YAI" atau "ONLINE · ZOOM" |
| Deskripsi | area | 3 baris |
| Keterangan harga | text | mis. "Land tour Rp 7.500.000 · kuota terbatas" |
| Tautan pendaftaran | text | |
| Flyer event | image | poster portrait resmi; kosong = pakai flyer bawaan |
| Status | select | `Tampil` / `Sembunyi` — pakai **Sembunyi** untuk event yang sudah lewat/dibatalkan, jangan dihapus kalau masih mau dipakai lagi nanti |

---

## Testimoni (Halaman Publik) — List

| Field | Tipe | Catatan |
|---|---|---|
| Nama | text | |
| Institusi | text | |
| URL video YouTube | text | **isi ID video saja** (lihat contoh existing: `QvjDgA4mRIs`, bukan full URL) atau cek format yang sudah ada sebelum menambah baru |
| Status | select | `Tampil` / `Sembunyi` |

---

## Galeri Dokumentasi (Halaman Publik) — List

| Field | Tipe | Catatan |
|---|---|---|
| Label | text | mis. "KNOWLEDGE EXCHANGE" — tampil sebagai caption kecil |
| Alt text foto | text | wajib |
| Foto dokumentasi | image | rasio 3:2 disarankan |

---

## Founder (Halaman Publik)

| Field | Tipe | Catatan |
|---|---|---|
| Foto founder | image | portrait rasio 4:5 disarankan |
| Alt text foto | text | |
| Nama | text | |
| Jabatan | text | |

> Field `points` (poin-poin pencapaian founder) tidak ada di form — ambil dari `defaults.ts` langsung, minta developer kalau perlu diubah.

---

## Partnership Form (Halaman Publik)

Hanya 1 field: **Foto latar** (image) — landscape, minimal 1600px lebar. Form partnership-nya sendiri (`WaForm.astro`) tidak dikonfigurasi dari sini.

---

## Hero Halaman Program (Halaman Publik)

Hero khusus untuk halaman `/program` (beda dari Hero homepage).

| Field | Tipe | Catatan |
|---|---|---|
| Gambar hero program | image | gambar tidak dipotong, pakai rasio asli |
| Alt text gambar | text | wajib |

---

## FAQ (Halaman Publik) — List

| Field | Tipe | Catatan |
|---|---|---|
| Pertanyaan | text | |
| Jawaban | area | 4 baris |

Dipakai juga untuk FAQPage schema (SEO) — pastikan jawaban jelas dan tidak terlalu panjang.

---

## Footer & Kontak (Halaman Publik)

| Field | Tipe | Catatan |
|---|---|---|
| Deskripsi footer | area | |
| Tagline | text | |
| Instagram / TikTok / YouTube | text | full URL |
| Email | text | |
| WhatsApp admin | text | dipakai tombol WA umum di situs |
| WhatsApp partnership | text | dipakai khusus form/flow partnership |
| Alamat | text | |

---

## News / Artikel (Konten)

Lihat detail lengkap (termasuk skor SEO) di `cms-flow.md` §"Langkah khusus: Artikel". Ringkas field:

**Konten artikel:**

| Field | Tipe | Catatan |
|---|---|---|
| Judul artikel (H1) | text | maks 70 karakter |
| Slug URL | text | huruf kecil, pemisah `-`, tanpa tanggal |
| Kategori | select | `Program` / `Insight` / `Dokumentasi` / `Pengumuman` |
| Penulis | text | |
| Tanggal publikasi | text | format `YYYY-MM-DD` |
| Status | select | `Draft` / `Published` — **Draft tidak tampil di `/news`** |
| Ringkasan | area | maks 200 karakter, tampil di card list |
| Gambar utama | image | |
| Isi artikel | area | heading H2→H3 berurutan + tautan internal ke halaman program |

**SEO artikel** (panel kanan saat edit artikel): metaTitle, metaDescription, focusKeyword, canonical, imageAlt, ogImage, schemaType (`Article`/`NewsArticle`/`BlogPosting`), index, follow.

---

## SEO & Teknikal (Pengaturan)

Meta global, bukan per-halaman/artikel.

| Field | Tipe | Catatan |
|---|---|---|
| Nama situs | text | |
| Base URL | text | |
| Template title | text | pakai `%page%` sebagai placeholder judul halaman |
| Title homepage | text | maks 60 karakter |
| Meta description homepage | area | maks 160 karakter |
| Canonical homepage | text | |
| OG image default | image | 1200×630px, untuk preview share medsos |
| Locale | select | `id-ID` / `en-US` |
| Izinkan indexing | bool | off = `noindex` seluruh situs — **hati-hati, jangan matikan tanpa alasan jelas** |
| Sitemap.xml otomatis | bool | |
| BreadcrumbList schema | bool | |
| Google Search Console verification | text | kode verifikasi GSC |
| GA4 Measurement ID | text | format `G-XXXXXXX` |
| robots.txt | area | isi mentah file `robots.txt` |

---

## Pengguna (Pengaturan)

**Hanya daftar tampilan (read-only)** — menambah/menghapus user admin **tidak dilakukan dari sini**. Lihat `../../README.md` §9 "Manajemen user" (dibuat via Supabase Admin API/Dashboard, lalu sinkron manual ke array `USERS` di `admin.html` oleh developer).

---

## Checklist sebelum Simpan

- [ ] Alt text gambar terisi (aksesibilitas + SEO).
- [ ] Field dengan batas karakter (maks 60/70/140/160/200) tidak kepotong aneh di preview.
- [ ] Status (`Aktif`/`Tampil`/`Published`) sudah benar — bukan masih `Draft`/`Sembunyi` kalau memang mau tampil.
- [ ] Tautan (`href`) valid, bukan placeholder kosong, untuk item berstatus Aktif/Tampil.
- [ ] Setelah klik Simpan, tunggu ±30 detik lalu cek halaman publik (hard refresh) untuk konfirmasi perubahan tampil.

> ponytail: field dokumentasi ini disalin manual dari struktur `admin.html` —
> kalau developer menambah field baru di `admin.html`, dokumen ini perlu
> diupdate manual juga (belum ada generator otomatis dari schema ke docs).
