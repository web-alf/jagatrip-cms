# AGENTS.md — Rule untuk AI coding agent di repo ini

File ini khusus untuk AI/agent (Copilot, Claude, dkk) yang mengedit repo ini.
Tujuan: cegah "vibe coding" — perubahan yang nyimpang dari arsitektur yang
sudah disepakati, nambah dependency/abstraksi nggak perlu, atau bikin pola
baru yang beda sendiri dari sisa kode. Baca `README.md` dulu, lalu
`docs/dev/architecture.md` (keputusan desain + alasannya) dan
`docs/dev/development.md` (konvensi kode, alur ubah field/halaman) sebelum
edit apa pun. Ubah DB → `docs/dev/database.md`; deploy →
`docs/dev/deployment.md`; apa pun yang menyentuh key/auth/RLS →
`docs/dev/security.md`.

## 1. Ringkasan arsitektur (jangan dilanggar)

- **Astro 7 SSR** (`output: 'server'`, adapter `@astrojs/cloudflare`), Bun
  sebagai package manager/test runner. Tidak ada build-per-update-konten —
  semua halaman publik baca Supabase **per request** lewat `src/lib/repo.ts`
  (cache in-memory 30 detik per isolate).
- **Satu pintu data**: halaman (`src/pages/**`) **wajib** ambil data lewat
  `src/lib/repo.ts` (`getSite`, `getPrograms`, dst). **Jangan** `fetch` ke
  Supabase langsung dari file page, dan jangan import `src/data/defaults.ts`
  langsung dari page (itu fallback internal repo.ts).
- **Admin** (`src/pages/admin/index.astro`) pakai `export const prerender = true`
  — render statis saat build, lalu di browser langsung baca/tulis Supabase
  (REST, Auth GoTrue). Logic ada di `src/dc/admin.html` (di-`?raw`-import).
  Jangan ubah ini jadi SSR biasa — akan ikut kena 30s cache dan logic admin
  (localStorage session, upload gambar, dsb) didesain client-side.
- **Tidak ada flow publish/deploy-hook.** `public.deploys` sudah di-drop
  (lihat `supabase/migrations/20260930_drop_deploys.sql`). Simpan konten =
  upsert langsung ke `public.content`, auto muncul di publik karena repo.ts
  baca ulang tiap request. **Jangan** bikin ulang tombol "Publish" / webhook
  rebuild — itu pola lama sebelum migrasi ke SSR.
- **Gagal Supabase → fallback `defaults.ts`, tidak pernah 500.** Pola ini
  (try/catch + fallback) wajib dipertahankan di semua kode yang baca Supabase.

## 2. Larangan keras

- Jangan tambah dependency npm/bun baru untuk hal yang bisa diselesaikan
  dengan stdlib/fitur Astro/Cloudflare yang sudah ada. Cek dulu apa sudah
  ada di `package.json`.
- Jangan bikin abstraksi baru (service layer, state management, ORM, dll)
  untuk satu use-case. Pola repo ini: fungsi plain di `src/lib/*.ts`.
- Jangan ubah `src/lib/merge.ts` / shape `Defaults` tanpa update
  `src/data/defaults.ts` dan migration SQL terkait — keduanya harus selalu
  sinkron (field hilang di salah satu akan silently break admin atau publik).
- Jangan jalankan `bunx astro check` non-interaktif — hang karena prompt
  instalasi `@astrojs/check`.
- Jangan commit `.env` (sudah gitignored) atau taruh secret Apps Script
  langsung di kode `.gs` — pakai Script Properties (lihat
  `docs/appscript/rule.md`).
- Jangan edit `scripts/apps-script/*.gs` lalu lupa sync manual ke Apps
  Script editor (tidak ada clasp/CI) — lihat `docs/files/repo-gs-rule.md`.
- Jangan tambah LP/menu baru dengan Apps Script tanpa dokumentasi pendamping
  (`docs/appscript/` + `docs/files/`) — wajib, bukan opsional.
- Jangan sentuh `src/styles/lp/*.css` / `src/legacy/**` untuk fitur baru —
  itu landing page lama yang sengaja diisolasi (beda token/class dari
  `global.css` + `components/site/`). Fitur baru pakai stack CMS biasa.

## 3. Konvensi per area

| Area | Aturan |
|---|---|
| `src/pages/**` (publik) | Data via `src/lib/repo.ts` saja. Tidak ada `getStaticPaths` (sudah SSR penuh). |
| `src/pages/admin/**` | Tetap `prerender = true`. Logic di `src/dc/admin.html`, bukan di `.astro`. |
| `src/lib/**` | Fungsi plain + export, bukan class. Tambah test di `*.test.ts` sebelah file (pola `format.test.ts`, `merge.test.ts`) kalau logic non-trivial. |
| `src/data/defaults.ts` | Satu-satunya sumber default/fallback. Field baru di sini wajib juga ditambah di migration + `merge.ts`. |
| `scripts/apps-script/*.gs` | Satu file per LP, prefix `JGT_<LP>_`, lihat `docs/appscript/rule.md` untuk full rule. |
| `docs/**` | Dokumentasi operasional panjang (SOP, rule). Ikuti standar struktur/penamaan di `docs/README.md` (folder = domain, file = satu topik, suffix `-rule`/`-flow`/`-guide`). README root tetap ringkas + index. |

## 4. Sebelum commit

- [ ] Data publik tetap lewat `repo.ts`, bukan fetch langsung.
- [ ] Tidak nambah dependency tanpa alasan kuat (cek stdlib/existing lib dulu).
- [ ] `bun test` lulus (`format.test.ts`, `merge.test.ts`, test baru jika ada).
- [ ] Kalau ubah shape data admin/konten: `defaults.ts`, migration SQL, dan
      `merge.ts` sinkron tiga-tiganya.
- [ ] Kalau nambah file `.gs` baru: dokumentasi pendamping di `docs/` sudah dibuat.
- [ ] Kalau nambah file dokumentasi baru: update peta folder di README §16.

ponytail: file ini tidak otomatis ditegakkan (no lint rule/CI check) — murni
instruksi untuk agent. Upgrade: tambah custom ESLint rule atau CI check kalau
pelanggaran pola di atas mulai sering kejadian.
