# MANIFEST — Ekspor Halaman Lama (`halaman-old/`)

Snapshot read-only dari 13 landing page lama + seluruh dependency rekursifnya, diambil dari `jagatrip` (Astro) pada repo utama. Semua file di-copy dengan `cp -p` (byte-identik, timestamp dipertahankan). **Tidak ada file yang diedit, diformat ulang, atau dihapus dari source asli.**

## 1. Halaman target (13)

| Halaman | Path asal | Path ekspor |
|---|---|---|
| Batch 2 (Malaysia-Thailand) | `src/pages/batch2.astro` | `src/pages/batch2.astro` |
| Batch 3 | `src/pages/batch3.astro` | `src/pages/batch3.astro` |
| Batch 3 Myth | `src/pages/batch3myth.astro` | `src/pages/batch3myth.astro` |
| China | `src/pages/china.astro` | `src/pages/china.astro` |
| China 2 | `src/pages/china2.astro` | `src/pages/china2.astro` |
| China S&K | `src/pages/chinask.astro` | `src/pages/chinask.astro` |
| Harga | `src/pages/harga.astro` | `src/pages/harga.astro` |
| Jagatalk Premium | `src/pages/jagatalk.astro` | `src/pages/jagatalk.astro` |
| Jagatalk 02 | `src/pages/jagatalk02.astro` | `src/pages/jagatalk02.astro` |
| Jagatalk 8 | `src/pages/jagatalk8.astro` | `src/pages/jagatalk8.astro` |
| Nonformal | `src/pages/nonformal.astro` | `src/pages/nonformal.astro` |
| Promo | `src/pages/promo.astro` | `src/pages/promo.astro` |
| Webinar | `src/pages/webinar.astro` | `src/pages/webinar.astro` |

## 2. Layout & komponen (dependency rekursif)

- `src/layouts/BaseLayout.astro` — dipakai semua 13 halaman.
- `src/components/seo/BaseSEO.astro`, `JsonLd.astro`, `Tracking.astro` — diimpor oleh `BaseLayout`.
- `src/components/layout/Nav.astro` — diimpor oleh `batch3.astro`, `harga.astro`.
- `src/components/layout/Footer.astro` — diimpor oleh semua kecuali `batch2.astro`, `harga.astro` (harga pakai Footer juga — cek ulang: ya, harga pakai Footer+Nav).
- `src/components/layout/FloatingWA.astro` — diimpor `harga.astro`.
- `src/components/brand/FlagIcon.astro` — diimpor `Footer.astro` (render bendera trip di kolom "Program 2026").

## 3. Data & schema

- `src/data/site.ts` (`SITE`, `WA_URL`, `waLink`)
- `src/data/china.ts` (`chinaProgram`, `chinaEventSchema`) — dipakai `china.astro`, `china2.astro`.
- `src/data/schemas/breadcrumb.ts` — dipakai `harga.astro`.
- `src/data/schemas/organization.ts`, `website.ts` — diimpor `BaseLayout.astro`.
- `src/content.config.ts` — definisi collection `trips` (dipakai `Footer.astro` via `getCollection('trips')`).
- `src/content/trips/*.md` (7 file) — isi collection `trips`, dirender di footer semua halaman.

## 4. Lib (TypeScript utilities)

- `src/lib/utm.ts` — `getUtm`, `captureUtm`.
- `src/lib/form-guard.ts` — `initFormGuard`, `lockForm`, `isFormSubmitted`, `isPhoneSubmitted`, `normalizePhoneForGuard`.
- `src/lib/phone-formatter.ts` — `parseIndonesianPhone`, `formatPhoneInputRealtime`.
- `src/lib/mobile-menu.ts`, `nav-active.ts`, `sticky-header.ts` — dipakai `Nav.astro`.
- `src/lib/zaraz-events.ts`, `reveal.ts` — dipakai `BaseLayout.astro` (script global).

## 5. CSS

- `src/styles/global.css` (import `tailwindcss` + `./tokens.css`) — diimpor `BaseLayout.astro`.
- `src/styles/tokens.css` — custom `@theme` tokens (warna brand, font).

## 6. Config root

- `package.json` — dependencies: `astro ^6.2.1` (terpasang **6.4.8**), `tailwindcss ^4.2.4` (terpasang **4.3.3**), `@tailwindcss/vite ^4.2.4`, `@astrojs/cloudflare ^13.3.0`, `@astrojs/sitemap ^3.7.2`, `sharp ^0.35.3`, `typescript ^6.0.3`; devDependencies: `wrangler ^4.87.0`.
- `astro.config.mjs` — output `static`, adapter `@astrojs/cloudflare`, Tailwind via Vite plugin, font provider Google (`Outfit`), sitemap integration.
- `tsconfig.json` — extends `astro/tsconfigs/strict`. **Tidak ada path alias kustom** (tidak ada `paths`/`baseUrl` di `compilerOptions`) — semua import di 13 halaman pakai relative path (`../lib/...`, `../data/...`, dst), bukan alias.
- `wrangler.jsonc` — konfigurasi deploy Cloudflare Workers (disertakan untuk referensi, tidak esensial untuk re-render statis halaman).
- Tidak ada `tailwind.config.js`/`postcss.config.js` terpisah — Tailwind v4 dikonfigurasi inline via `@theme` di `tokens.css` + plugin Vite.
- `.env` / `.env.example` — **tidak ditemukan** di root repo (lihat bagian 8).

## 7. Aset (`public/`)

| Aset | Dipakai di |
|---|---|
| `Dedi Gunawan.jpeg` | batch2.astro, jagatalk02.astro |
| `dedi-photo.jpg` | jagatalk8.astro |
| `favicon.svg` | — (tidak dirujuk langsung oleh 13 halaman; `BaseLayout` pakai `/images/logo-icon.webp` sbg favicon, `favicon.svg` disalin untuk amannya) |
| `hero-nonformal.webp` | nonformal.astro |
| `jagatalk02-1.webp`, `jagatalk02-2.webp` | jagatalk02.astro |
| `jagatalk-general.webp` | webinar.astro |
| `jagatalk-webinar-6.webp` | webinar.astro |
| `jagatrip-hero.webp`, `jagatrip-hero-sm.webp` | BaseLayout.astro (preload LCP image, semua halaman) |
| `images/batch2/flyer-hero.avif` | batch2.astro |
| `images/batch2/logo-logogram.png` | batch2.astro |
| `images/batch2/logo-logotype.png` | batch2.astro |
| `images/batch3myth/flyer-jt3-myth.webp` | batch3myth.astro |
| `images/china/dedi-gunawan.webp` | data/china.ts (`chinaProgram`) → china.astro, china2.astro |
| `images/china/flyer-jt-china-2026.webp` | china.astro, china2.astro |
| `images/flags/my.svg`, `sg.svg`, `th.svg` | batch3.astro (bendera negara inline) |
| `images/flags/cn.svg`, `jp.svg` | Footer.astro via FlagIcon (trip china.md, jepang.md) |
| `images/jagatalk/flyer-jt-premium.webp` | jagatalk.astro |
| `images/jagatalk/flyer-jw8-v3.avif` | jagatalk8.astro |
| `images/jagatalk/logo-jagatalk.png` | jagatalk8.astro |
| `images/logo-horizontal.webp` | Nav.astro, Footer.astro, china.astro, china2.astro |
| `images/logo-horizontal.png` | data/schemas/organization.ts (`organizationSchema().logo`) |
| `images/logo-icon.webp` | BaseLayout.astro (favicon) |
| `images/og-default.png` | components/seo/BaseSEO.astro (default `ogImage`) |

Catatan: `images/flags/my.svg/sg.svg/th.svg` dipakai langsung di `batch3.astro`, dan sekaligus bisa dipakai FlagIcon jika trip punya flag tunggal MY/SG/TH (saat ini trip `malaysia-thailand.md`/`triple-country-asean.md` pakai flag ganda, dirender sebagai beberapa `<FlagIcon>` segmen sekaligus oleh parser emoji di `FlagIcon.astro` — semua kode negara yang muncul di `src/content/trips/*.md` sudah tercakup: cn, jp, my, th, sg; flag non-negara `🌿`/`🏝️`/`🌺` dirender sebagai emoji teks, tidak butuh aset).

## 8. TIDAK ditemukan

- `.env` / `.env.example` — tidak ada file ini di root repo asli sama sekali (bukan terhapus oleh aturan ekspor, memang tidak tersedia).
- `tailwind.config.js` / `postcss.config.js` — tidak ada (Tailwind v4 tidak butuh file config terpisah di setup ini).
- Tidak ada import atau aset lain yang gagal ditemukan di source. Semua import relative dari 13 halaman dan seluruh dependency rekursifnya berhasil ditelusuri dan disalin.

## 9. Verifikasi

Setiap file `.astro`/`.ts` di `halaman-old/src/` sudah dicek: semua `import '../...'` relative mengarah ke file yang juga ada di `halaman-old/` pada path relatif yang sama (struktur folder sumber dipertahankan identik, sehingga relative import tetap valid). Tidak ada import rusak.

## 10. Jumlah file

**76 file** disalin (13 halaman + 1 layout + 3 komponen seo + 3 komponen layout + 1 komponen brand + 2 data + 3 data/schemas + 1 content.config.ts + 7 content/trips + 8 lib + 2 styles + 4 config root + 28 aset public).
