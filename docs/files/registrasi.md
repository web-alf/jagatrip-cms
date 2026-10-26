# Struktur Folder Drive — Registrasi


# SEMUA FILE DISIMPAN DI DRIVE FOLDER "Jagatrip/register"

Dokumen upload dari form registrasi (`src/pages/register.astro`) disimpan oleh
`scripts/apps-script/registrasi.gs` ke Google Drive, dipisah per jenis dokumen
dalam subfolder di bawah folder induk `JGT_REG_FOLDER_ID`.

Subfolder dibuat **otomatis** oleh script saat dokumen jenis itu pertama kali
di-upload (lihat `jgtRegGetOrCreateSubfolder_` di `registrasi.gs`) — tidak perlu
dibuat manual.

## Struktur

```
<JGT_REG_FOLDER_ID>(Jagatrip)/
  Paspor/           ← field: file_paspor
  KTP/              ← field: file_ktp
  Pas Foto Visa/    ← field: file_pas_foto_visa
  KTP & KK/         ← field: file_ktp_kk
  Itinerary Visa/   ← field: file_itinerary_visa
  Bukti Saldo/      ← field: file_saldo_rekening
  Bukti Transfer/   ← field: file_bukti_transfer
```

Nama file di tiap subfolder: `"<Label> - <nama file asli dari user>"`
(mis. `Paspor - scan_paspor_ahmad.pdf`).

## Mengubah nama folder

Nama subfolder ikut label di `JGT_REG_FILE_FIELDS` (object di `registrasi.gs`).
Ganti value di situ untuk ganti nama folder — tidak perlu rename manual di Drive
untuk submit berikutnya (folder lama tetap ada, dipakai lagi kalau label balik sama).

## Sharing

Tiap file di-share otomatis sebagai `ANYONE_WITH_LINK` / `VIEW` saat upload,
agar link di kolom sheet (mis. `File Paspor`, `File KTP`) bisa dibuka langsung
tanpa perlu login/permintaan akses.

> ponytail: semua subfolder flat di satu folder induk, belum dipisah per
> bulan/batch pendaftaran. Upgrade ke sub-folder per batch kalau volume
> submission per jenis dokumen mulai terlalu banyak untuk ditelusuri manual.
