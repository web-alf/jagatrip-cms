# `src/legacy/`

Dependency khusus 13 landing page kampanye lama (batch2, batch3, batch3myth,
china, china2, chinask, harga, jagatalk, jagatalk02, jagatalk8, nonformal,
promo, webinar). Page file-nya sendiri **wajib** tetap di `src/pages/` (aturan
routing Astro) — tapi semua yang di-import (layout, komponen, data, lib, CSS)
diisolasi di sini supaya tidak campur dengan stack CMS/Supabase baru.

Jangan import apapun dari sini ke halaman baru (index/about/program/contact/
news/admin) — dan sebaliknya jangan import `lib/repo.ts`, `lib/merge.ts`,
`components/site/*`, `layouts/Base.astro` dari halaman lama.

`jagatalk9.astro` terlihat mirip gaya lama tapi self-contained (CSS inline,
tanpa BaseLayout) — tidak bergantung ke folder ini.

Yang TIDAK bisa dipindah ke sini (ketentuan Astro):
- `src/content.config.ts` + `src/content/trips/` — collection config harus di
  `src/` root. Dipakai `components/layout/Footer.astro`.

Upgrade path kalau salah satu landing page ini mau "naik kelas" ke stack baru:
ganti importnya ke `../layouts/Base.astro` + `../components/site/*`, lalu
pindahkan page itu sendiri keluar dari daftar di atas.
