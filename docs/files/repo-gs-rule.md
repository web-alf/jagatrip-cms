# Rule Penyimpanan File Apps Script (`.gs`)

Aturan lokasi & penamaan file source Apps Script di repo ini. Untuk rule
proses/ownership/akun lihat `../appscript/rule.md` — dokumen ini
fokus ke **penyimpanan filenya**.

## 1. Lokasi source di repo

Semua file `.gs` disimpan di satu folder:

```
scripts/apps-script/
  registrasi.gs     ← LP register.astro
  <nama-lp>.gs      ← LP lain, ditambah saat dibutuhkan
```

- **Satu file `.gs` = satu LP/menu.** Jangan gabung dua LP dalam satu file.
- File `.gs` di repo ini adalah **source of truth untuk review/histori**,
  bukan yang dieksekusi langsung — eksekusi tetap di Apps Script editor
  (project terpisah per LP, akun `web@alfatihah.com`, lihat
  `../appscript/rule.md` §3).
- Repo **tidak** auto-deploy file ini ke Apps Script (tidak ada clasp/CI).
  Update = copy-paste manual isi file ke editor Apps Script setelah
  perubahan di-review/merge.

## 2. Penamaan file

- Nama file = nama LP/menu, huruf kecil, pemisah `-`, akhiran `.gs`.
  Contoh: `registrasi.gs`, `batch2.gs`, `jagatalk.gs`.
- Nama file **harus selaras** dengan prefix fungsi di dalamnya (lihat
  `../appscript/rule.md` §2): file `registrasi.gs` → prefix
  `JGT_REG_`; file `batch2.gs` → prefix `JGT_BATCH2_`, dst.
- Jangan pakai nama generik (`script.gs`, `code.gs`, `main.gs`) — harus
  jelas LP mana yang dilayani, karena akan ada banyak file serupa seiring
  bertambah LP.

## 3. Isi minimal tiap file `.gs`

Tiap file harus punya, berurutan:

1. **Header komentar** 2–3 baris: nama LP, spreadsheet/folder Drive yang
   dipakai (ID atau nama), link ke dokumentasi terkait di `docs/`.
2. **Konstanta konfigurasi** di atas (ID spreadsheet, ID folder Drive,
   mapping field) — semua pakai prefix LP, semua **uppercase**.
3. **Fungsi-fungsi** berprefix LP (`jgt<Lp>...`), diakhiri underscore `_`
   untuk fungsi privat (konvensi Apps Script: fungsi privat per-file,
   tidak disarankan dipanggil dari project lain).
4. **Entry point** tanpa prefix di paling bawah: `doPost(e)`, `doGet(e)`,
   fungsi test manual (`testConnection()`, `testDoPost()`).

Pola rujukan: `registrasi.gs` (sudah ikuti urutan ini).

## 4. Commit & review

- Perubahan `.gs` **wajib lewat PR/commit biasa** seperti kode lain di repo
  ini — jangan edit langsung di Apps Script editor lalu lupa sync ke repo.
  Kalau terpaksa edit darurat langsung di editor (prod down), **copy balik**
  hasil akhirnya ke repo di commit terpisah secepatnya.
- Setelah merge, langkah deploy manual (copy ke editor → New version) wajib
  dicatat di PR description atau chat tim: versi berapa yang dipakai, kapan
  di-deploy — karena Apps Script tidak auto-track dari git.

## 5. Dokumentasi pendamping OPSIONAL(jika butuh rule tambahan) per file `.gs`

Tiap `scripts/apps-script/<nama-lp>.gs` baru wajib disertai:

| Dokumen | Isi |
|---|---|
| `docs/appscript/<nama-lp>.md` | setup, alur, troubleshooting (pola: `registrasi.md`) |
| `docs/files/<nama-lp>.md` | struktur folder Drive yang dipakai (pola: `registrasi.md`) |

Tanpa dua dokumen ini, LP dianggap **belum selesai di-setup** meski script
sudah jalan — supaya anggota tim lain bisa maintenance tanpa baca kode `.gs`
dari nol.

> ponytail: belum ada clasp/CI yang sinkronkan otomatis repo ↔ Apps Script
> editor, semua manual copy-paste. Upgrade ke `clasp push`/`clasp pull` via
> GitHub Action kalau jumlah LP dengan Apps Script sudah banyak dan manual
> sync mulai rawan human error (lupa deploy versi terbaru, dsb).
