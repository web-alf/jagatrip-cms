# Apps Script — Batch2 (`scripts/apps-script/batch2.gs`)

Backend endpoint untuk form `src/pages/batch2.astro` (Kemitraan Kampus Malaysia,
11–14 Januari 2027). Menerima submit form, simpan 1 baris ke Google Sheet. Tanpa upload file.

- **Spreadsheet**: https://docs.google.com/spreadsheets/d/14wv5a3ujPu6DYqwIEPm5YFUjxRgiH8K5tI8uZblr7RI
- **Sheet**: `Desember`
- **Source**: `scripts/apps-script/batch2.gs` (copy-paste manual ke Apps Script editor)
- **Project Apps Script**: `JAGATRIP - Batch2` (terpisah dari Register, lihat `rule.md` §2)

## Alur

1. Client (inline `<script>` di `batch2.astro`) kirim POST JSON `{ nama, institusi, jabatan, kota, jenis, wa, minat, timestamp, source, utm_* }`.
2. Baris ditulis ke sheet `Desember` sesuai `JGT_B2_HEADER_MAP`. Header yang belum ada otomatis ditambah di ujung kanan; urutan existing tidak diubah.
3. Setelah fetch (fire-and-forget, `mode: 'no-cors'`), browser redirect ke WA Admin Dwita dengan greeting berisi nama pendaftar.

## Setup

1. Spreadsheet di atas → **Extensions > Apps Script** → project baru `JAGATRIP - Batch2` (dari akun `web@alfatihah.com`).
2. Tempel isi `batch2.gs`.
3. Run `testConnection()` → cek akses sheet `Desember`.
4. Run `testDoPost()` → tulis 1 baris dummy (`source="TEST"`), hapus manual.
5. **Deploy > New deployment > Web app**. Execute as: *Me*. Who has access: *Anyone*.
6. Salin URL deployment ke `APPS_SCRIPT_URL` di `src/pages/batch2.astro`.

Update kode: edit `.gs` di repo → paste ulang → **Deploy > Manage deployments > Edit > New version** (URL tetap).

> ponytail: tanpa dedup nomor WA. Tambah cek kolom `WhatsApp` sebelum append kalau pendaftar ganda mulai sering.
