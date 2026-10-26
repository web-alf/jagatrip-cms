# Development

Panduan kerja harian developer: setup, perintah, konvensi kode, alur ubah
fitur. Arsitektur ada di `architecture.md`; deploy di `deployment.md`.

## 1. Setup

Prasyarat: **Bun ≥ 1.3** (lockfile v2; repo dipin `bun@1.4.2` di
`package.json`).

```bash
bun install --frozen-lockfile
cp .env.example .env     # isi dari Supabase Dashboard → Settings → API
bun run dev              # http://localhost:4321
```

Env yang dibutuhkan lokal: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`.
`SUPABASE_SERVICE_ROLE_KEY` hanya untuk `bun run seed` / buat user — jangan
pernah masuk Cloudflare atau prefix `PUBLIC_`.

## 2. Perintah

| Perintah | Fungsi |
|---|---|
| `bun run dev` | dev server (workerd via Vite plugin Cloudflare) |
| `bun run build` | build ke `dist/client` (assets + admin prerender) + `dist/server` (Worker) |
| `bun run preview` | jalankan hasil build via Wrangler |
| `bun test` | `src/lib/*.test.ts` |
| `bun run seed [--force]` | isi `public.content` dari `defaults.ts` |
| `bun run keepalive` | ping Supabase sekali |
| `bun run deploy` | `wrangler deploy` (biasanya lewat Cloudflare Git build, bukan manual) |

**Jangan** `bunx astro check` non-interaktif — hang menunggu prompt install
`@astrojs/check`.

## 3. Peta folder yang sering disentuh

| Path | Isi | Catatan |
|---|---|---|
| `src/pages/*.astro` | halaman publik SSR | data **hanya** dari `src/lib/repo.ts` |
| `src/pages/admin/index.astro` | wrapper `/admin`, prerender | jangan taruh logic di sini |
| `src/dc/admin.html` | SPA admin (template + script) | runtime `public/support.js` |
| `src/lib/repo.ts` | pintu data + cache + fallback | |
| `src/lib/merge.ts` | map `content` jsonb → tipe situs | sinkron dengan `defaults.ts` + migration |
| `src/data/defaults.ts` | default/fallback semua section | |
| `src/components/site/`, `src/layouts/Base.astro`, `src/styles/global.css` | stack CMS | fitur baru pakai ini |
| `src/styles/lp/`, `src/legacy/` | LP lama terisolasi | jangan dipakai untuk fitur baru |
| `scripts/apps-script/*.gs` | source Apps Script per LP | lihat `../files/repo-gs-rule.md` |
| `supabase/migrations/*.sql` | skema DB, dijalankan manual di SQL Editor | lihat `database.md` |

## 4. Konvensi kode

- TypeScript strict, fungsi plain + `export`, bukan class.
- Komentar singkat berbahasa Indonesia, istilah teknis tetap Inggris.
- Penyederhanaan sengaja ditandai `// ponytail: <batas> — upgrade: <cara>`.
- Logic non-trivial di `src/lib/` wajib punya `*.test.ts` sebelahnya (pola
  `format.test.ts`, `merge.test.ts`), jalankan `bun test`.
- Tidak tambah dependency untuk hal yang bisa stdlib/fitur Astro/Cloudflare.
  Cek `package.json` dulu.
- Tidak bikin abstraksi untuk satu use-case.

## 5. Alur ubah fitur umum

### Tambah/ubah field konten

1. `src/data/defaults.ts` — tambah field + nilai default.
2. `src/lib/merge.ts` — map field ke tipe situs (update `Content` type).
3. `src/dc/admin.html` — tambah ke `fields` section terkait (lihat
   `../admin/update-content-guide.md` untuk daftar section).
4. `src/lib/types.ts` bila tipe publik berubah.
5. `bun test` → `bun run seed --force` di lokal bila ingin reset data.
6. Dokumentasi: update `../admin/update-content-guide.md`.

Tiga file (`defaults.ts`, `merge.ts`, `admin.html`) harus selalu sinkron —
field hilang di salah satu akan silently hilang di publik atau admin.

### Tambah halaman publik

1. Buat `src/pages/<nama>.astro`, pakai `src/layouts/Base.astro`.
2. Ambil data lewat `repo.ts`. Butuh getter baru → tambah di `repo.ts`.
3. Tambah ke `src/pages/sitemap.xml.ts` bila harus di-index.

### Tambah LP dengan form Apps Script

Ikuti `../appscript/rule.md` §5 + `../files/repo-gs-rule.md` §5 (dokumen
pendamping wajib).

## 6. Sebelum push

- [ ] `bun test` lulus.
- [ ] `bun run build` lulus.
- [ ] Tidak ada `fetch` Supabase langsung dari page.
- [ ] Tidak ada secret di diff (`.env`, key Apps Script).
- [ ] Dokumentasi di `docs/` ikut diupdate bila ada perubahan alur/field.

ponytail: tidak ada lint/format tool (ESLint/Prettier) dan tidak ada
pre-commit hook. Tambah bila kontributor > 2 orang atau gaya kode mulai
tidak konsisten.
