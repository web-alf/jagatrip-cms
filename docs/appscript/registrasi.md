# Apps Script — Registrasi (`scripts/apps-script/registrasi.gs`)

Backend endpoint untuk form `src/pages/register.astro`. Menerima submit form,
upload dokumen ke Google Drive, simpan data + link dokumen ke Google Sheet.

- **Spreadsheet**: https://docs.google.com/spreadsheets/d/14wv5a3ujPu6DYqwIEPm5YFUjxRgiH8K5tI8uZblr7RI
- **Sheet**: `Registrasi`
- **Source**: `scripts/apps-script/registrasi.gs` (copy-paste manual ke Apps Script editor — bukan bagian build pipeline Astro)

## Alur

1. Client (`src/legacy/lib/register-handler.ts`) kirim POST JSON — field teks + field file (base64 polos, tanpa prefix `data:...;base64,`).
2. Tiap field file di-decode, disimpan ke subfolder Drive sesuai jenis dokumen (`Paspor/`, `KTP/`, dst, di bawah `FOLDER_ID` — dibuat otomatis jika belum ada), lalu di-share "anyone with link".
3. Baris ditulis ke sheet `Registrasi` sesuai `JGT_REG_HEADER_MAP` (header sheet TIDAK berubah urutan/nama; kolom yang belum ada di sheet — dokumen visa & rencana tiket — otomatis ditambahkan di ujung kanan).

## Setup

1. Di Spreadsheet di atas → **Extensions > Apps Script**.
2. Tempel isi `registrasi.gs`, isi `JGT_REG_FOLDER_ID` (ID folder Drive tujuan upload dokumen).
3. Jalankan `testConnection()` dulu (pilih fungsi di dropdown toolbar → Run) untuk cek akses sheet & folder.
4. Jalankan `testDoPost()` untuk simulasi submit form (menulis 1 baris dummy, `source="TEST"`, gampang dihapus).
5. **Deploy > New deployment > Web app**. Execute as: *Me*. Who has access: *Anyone*.
6. Salin URL deployment ke `APPS_SCRIPT_URL` di `src/legacy/lib/register-handler.ts`.

## Troubleshooting

- **`SyntaxError: Identifier 'X' has already been declared`** — semua file `.gs` dalam satu project Apps Script berbagi satu global scope. Cek SEMUA file di project (panel kiri editor), hapus file duplikat, atau pastikan full select-all-delete sebelum paste ulang kode.
- **Field gak bisa diisi/diklik di form** — bukan bug `registrasi.gs`, itu `form-guard.ts` client-side (lihat bagian Anti-spam di bawah).

## Anti-spam form (client-side, bukan di script ini)

`src/legacy/lib/form-guard.ts` mengunci form di browser yang sudah pernah submit sukses
(disimpan di `localStorage`: `jagatrip_form_submitted`, `jagatrip_submitted_phones`).
Ini proteksi UX ringan, bukan proteksi server — gampang dilewati (clear cache/incognito).
Untuk testing berulang, hapus key tsb di localStorage atau pakai Incognito.

> ponytail: folder Drive dipisah per jenis dokumen, kolom baru auto-append di ujung kanan
> tanpa reorder. Upgrade ke cek duplikat nomor WA di server / sub-folder per bulan kalau
> dibutuhkan proteksi lebih kuat dari localStorage guard.
