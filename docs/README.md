# Standar struktur folder `docs/`

Pedoman penempatan & penamaan dokumentasi di repo ini. Dibaca oleh manusia
dan AI agent (lihat `AGENTS.md` §3). README root tetap ringkasan arsitektur +
index ke sini; detail operasional masuk `docs/`.

## 1. Struktur baku

```
docs/
├── README.md                 # file ini: standar + peta isi
├── admin/                    # pengoperasian panel /admin (CMS)
│   ├── *-flow.md             # alur kerja end-to-end (siapa, kapan, urutan)
│   └── *-guide.md            # panduan per fitur/menu (field-by-field)
├── appscript/                # backend Google Apps Script
│   ├── rule.md               # aturan umum semua script (akun, prefix, deploy)
│   └── <lp>.md               # setup & alur per LP (registrasi.md, batch2.md, …)
├── files/                    # penyimpanan file (Drive, Supabase Storage, repo)
│   ├── <storage>-rule.md     # aturan per media penyimpanan
│   └── <lp>.md               # struktur folder Drive per LP
├── dev/                      # untuk developer (kode, infra, DB) — bukan operasional
│   ├── architecture.md       # komponen, aliran data, keputusan desain
│   ├── development.md        # setup, perintah, konvensi, alur ubah fitur
│   ├── database.md           # skema Supabase, RLS, migration, seed, backup
│   ├── deployment.md         # Cloudflare, env, checklist rilis, rollback
│   ├── security.md           # model ancaman, key, auth, scan, insiden
│   └── troubleshooting.md    # gejala → sebab → fix → cegah, lintas sistem
└── <domain-baru>/            # tambah hanya jika ≥2 file dengan topik serumpun
```

Prinsip: **folder = domain**, **file = satu topik**, **suffix = jenis dokumen**.

## 2. Jenis dokumen (suffix)

| Suffix | Isi | Contoh |
|---|---|---|
| `-rule.md` | aturan wajib/larangan, berlaku umum untuk domain itu | `appscript/rule.md`, `files/supabase-rule.md` |
| `-flow.md` | alur kerja end-to-end, biasanya ada diagram Mermaid | `admin/cms-flow.md` |
| `-guide.md` | panduan step-by-step / referensi per field | `admin/update-content-guide.md` |
| `<lp>.md` (tanpa suffix) | dokumentasi spesifik satu LP/menu di domain itu | `appscript/registrasi.md`, `files/registrasi.md` |
| `<topik>.md` di `dev/` (tanpa suffix) | referensi developer; nama = topik baku, tetap (tidak bertambah per LP) | `dev/database.md`, `dev/deployment.md` |

## 3. Aturan penamaan

- Huruf kecil, pemisah `-`, akhiran `.md`. Tanpa spasi, tanpa underscore.
- Nama LP konsisten di semua domain: `scripts/apps-script/registrasi.gs` ↔
  `docs/appscript/registrasi.md` ↔ `docs/files/registrasi.md`.
- Jangan ulang nama folder di nama file (`appscript/appscript-rule.md` ✗,
  `appscript/rule.md` ✓).
- Satu file = satu topik. Kalau >300 baris atau bahas 2 hal tak berkaitan,
  pecah.

## 4. Template isi file

```md
# <Judul>

<1–2 kalimat: untuk siapa, beda apa dengan dokumen serumpun, link ke sana.>

## 1. ...
## 2. ...

ponytail: <batasan yang disengaja + kapan/bagaimana upgrade>
```

Wajib:
- Paragraf pembuka yang **membedakan** dari file lain di folder sama + link
  relatif (`../admin/cms-flow.md`).
- Heading bernomor supaya gampang dirujuk (`lihat files/supabase-rule.md §3`).
- Tabel untuk daftar aturan/field, Mermaid untuk alur.
- Bahasa Indonesia, istilah teknis tetap Inggris, kode/path/nama fungsi
  verbatim dalam backtick.

## 5. Kapan bikin folder baru

Hanya jika **≥2 file** dengan domain serumpun yang tidak cocok ke folder yang
ada. Satu file nyasar → taruh di folder terdekat dulu, pindah saat sudah ada
temannya. Contoh kandidat: `deploy/` (Cloudflare, env, rollback),
`seo/` (checklist meta, sitemap).

## 6. Wajib saat menambah/ubah dokumen

- [ ] Update peta isi di bawah (§7) dan README root §16.
- [ ] Cross-link dari/ke dokumen serumpun, cek tidak duplikat isi.
- [ ] Kalau rename file: grep seluruh repo untuk link lama
      (`grep -rn "nama-lama.md" README.md AGENTS.md docs/`).
- [ ] LP baru dengan Apps Script: `appscript/<lp>.md` + `files/<lp>.md` wajib
      ada sebelum dianggap selesai (lihat `files/repo-gs-rule.md` §5).

## 7. Peta isi

| File | Jenis | Isi |
|---|---|---|
| `admin/cms-flow.md` | flow | alur panel /admin keseluruhan (login, edit, simpan, tanpa deploy) |
| `admin/registrasi-flow.md` | flow | alur admin/CS memproses peserta registrasi (sheet, verifikasi, WA) |
| `admin/update-content-guide.md` | guide | referensi update konten per menu/field di /admin |
| `appscript/rule.md` | rule | akun `web@alfatihah.com`, 1 script per LP, prefix `JGT_<LP>_`, deploy |
| `appscript/registrasi.md` | lp | setup & alur `scripts/apps-script/registrasi.gs` |
| `files/supabase-rule.md` | rule | gambar admin di bucket `media` + kenapa auto-update ke situs |
| `files/repo-gs-rule.md` | rule | lokasi/penamaan/isi minimal source `.gs` di repo + dokumen pendamping |
| `files/registrasi.md` | lp | struktur folder Drive dokumen registrasi |
| `dev/architecture.md` | dev | komponen, aliran data, keputusan desain yang tidak boleh dilanggar |
| `dev/development.md` | dev | setup lokal, perintah, konvensi kode, alur tambah field/halaman |
| `dev/database.md` | dev | tabel `content`/`keepalive`, bucket `media`, RLS, migration, seed, backup |
| `dev/deployment.md` | dev | Cloudflare Workers Builds, env, checklist rilis, rollback, monitoring |
| `dev/security.md` | dev | model ancaman, penempatan key, auth admin, scan Trivy/CodeQL, insiden |
| `dev/troubleshooting.md` | dev | gejala → sebab → fix → cegah untuk build, Worker, admin, lokal, Apps Script |

Batas `dev/` vs folder lain: `dev/` untuk orang yang mengubah kode/infra;
`admin/`, `appscript/`, `files/` untuk orang yang mengoperasikan sistem tanpa
mengubah kode. README root = ringkasan; kalau isi README dan `dev/*` beda,
`dev/*` yang benar — perbaiki README.

ponytail: peta ini dirawat manual (tidak ada generator dari isi folder).
Upgrade: script kecil `bun scripts/docs-index.ts` yang baca heading pertama
tiap file kalau jumlah dokumen > ~20.
