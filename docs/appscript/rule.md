# Rule Apps Script — JAGATRIP

Aturan wajib untuk semua backend Google Apps Script (`.gs`) yang dipakai
landing page/menu JAGATRIP (register, batch2, batch3, jagatalk, dll).

## 1. Satu akun pemilik: `web@alfatihah.com`

Semua Apps Script project **dibuat dan di-deploy dari akun `web@alfatihah.com`**
(akun yayasan), **bukan** email pribadi developer/admin.

Alasan:
- Ownership terpusat — tidak hilang akses kalau developer/staff resign atau ganti HP.
- Satu sumber kredensial untuk audit (siapa yang bisa edit script, lihat Sheet, lihat Drive).
- Konsisten dengan prinsip keamanan data yayasan: data donatur/peserta tidak boleh tercecer di akun pribadi.

Kalau development/testing butuh akun lain (mis. akun dev pribadi), **hasil akhir
wajib dipindah ownership** ke `web@alfatihah.com` sebelum dipakai production
(Apps Script editor → Share → ganti owner, atau copy project baru dari akun
yayasan lalu paste ulang kodenya).

## 2. Satu script (.gs) per menu/LP — jangan digabung

Tiap landing page/menu yang butuh backend (form submission, upload dokumen,
dll) punya **project Apps Script sendiri**, terpisah dari menu lain. Jangan
gabung semua logic ke satu project besar.

Kenapa dipisah:
- Apps Script satu project = satu **global scope** bersama. Kalau digabung,
  nama fungsi/konstanta gampang bentrok (`SyntaxError: Identifier 'X' has
  already been declared` — pernah kejadian di `registrasi.gs`).
- Gampang maintenance per LP — kalau batch2 perlu ubah logic, tidak perlu
  takut merusak logic register atau jagatalk.
- Kalau satu LP tutup/dihapus, tinggal hapus project-nya, tidak perlu bedah
  file besar.

### Konvensi penamaan

- Nama project Apps Script: `JAGATRIP - <nama-lp>` (mis. `JAGATRIP - Register`, `JAGATRIP - Batch2`).
- Prefix semua fungsi/konstanta global di dalam script dengan kode LP singkat,
  huruf besar, format `JGT_<LP>_` — contoh existing: `JGT_REG_` untuk
  `registrasi.gs` (LP = register). Wajib walau cuma 1 script per project,
  supaya kalau suatu saat 2 script perlu digabung sementara (debug bareng),
  tidak langsung bentrok nama.
- Entry point wajib tanpa prefix sesuai syarat Apps Script Web App:
  `doPost(e)`, `doGet(e)` — tapi badan fungsinya langsung delegasi ke fungsi
  berprefix (lihat pola di `registrasi.gs`: `doPost(e)` → `jgtRegDoPost(e)`).

## 3. Lokasi penyimpanan kode

| Lapisan | Lokasi | Keterangan |
|---|---|---|
| Source of truth (review, histori perubahan) | `scripts/apps-script/<nama-lp>.gs` di repo ini | di-commit ke git, **bukan** di-deploy otomatis |
| Eksekusi nyata | Apps Script editor, project terpisah per LP, di akun `web@alfatihah.com` | copy-paste manual dari file repo di atas |
| Output data | Google Sheet + Drive folder per LP, dimiliki `web@alfatihah.com` | lihat §4 |

Alur update: edit `.gs` di repo (review seperti kode lain) → copy isi file →
paste ke Apps Script editor project terkait → **Deploy → Manage deployments →
Edit → New version** (supaya URL Web App tidak berubah, tidak perlu update
`register-handler.ts` atau handler LP lain).

## 4. Struktur Google Drive per menu/LP

Semua folder data LP ada di bawah satu folder induk **`Jagatrip/`** di Drive
akun `web@alfatihah.com`, dipisah per LP:

```
Jagatrip/
  register/        ← LP register.astro — dikelola registrasi.gs (lihat ../files/registrasi.md)
    Paspor/
    KTP/
    ...
  batch2/           ← contoh LP lain (jika butuh backend sendiri nanti)
  jagatalk/         ← contoh LP lain
```

Google Sheet pencatatan juga 1 spreadsheet per LP (jangan satu spreadsheet
berisi banyak tab tak berkaitan) — memudahkan sharing akses terbatas per tim
kalau suatu saat perlu (mis. tim jagatalk tidak perlu akses sheet register).

## 5. Menambah LP baru yang butuh Apps Script

1. Buat folder data di Drive (opsional jika perlu penyimpanan file): `Jagatrip/<nama-lp>/` (dari akun `web@alfatihah.com`).
2. Buat Spreadsheet baru/Tag manager apakah ada sheet yanng sudah dibuat (nama: `<Nama LP>` atau sejenis).
3. Buat project Apps Script baru dari akun `web@alfatihah.com`, di script Jagatrip `<Nama LP>`.
4. Tulis kode `.gs` ikut pola `registrasi.gs` (prefix fungsi `JGT_<LP>_`,
   `doPost`/`doGet` sebagai entry point delegasi).
5. Commit source `.gs` ke `scripts/apps-script/<nama-lp>.gs` di repo ini.
6. Deploy as Web App, copy URL ke handler LP terkait (pola seperti
   `register-handler.ts`).
7. Tambah dokumentasi (opsional jika perlu rules tambahan): `docs/appscript/<nama-lp>.md` (setup/alur)
   dan `docs/files/<nama-lp>.md` (struktur folder Drive) — ikuti pola
   file existing untuk LP register.

## 6. Keamanan & akses

- Jangan tambahkan editor/kolaborator Apps Script project pakai email pribadi

- Service account / credential apa pun untuk integrasi LP (kalau ada, mis.
  WA gateway) disimpan di Script Properties Apps Script, **bukan** hardcode
  di kode `.gs` yang di-commit ke repo publik.
- Sheet/Drive folder hasil LP berisi data pribadi (nama, no HP, dokumen
  identitas) — jangan share folder/sheet dengan akses "anyone with link" di
  level folder (beda dengan file dokumen individual yang memang didesain
  share-by-link, lihat `registrasi.md`).

> ponytail: baru 1 LP (register) yang punya Apps Script backend saat ini.
> Rule ini disiapkan supaya penambahan LP berikutnya konsisten sejak awal,
> bukan dirapikan belakangan.
