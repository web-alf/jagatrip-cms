# `src/styles/lp/`

CSS khusus landing page kampanye berdiri-sendiri (self-contained HTML, bukan
`Base.astro`/`components/site/*`). Satu file per LP, nama = nama page.

- `partnership.css` → `src/pages/partnership.astro`

Kenapa terpisah dari `src/styles/global.css`: global.css dipakai stack
CMS baru (Base.astro + Header/Footer di `components/site/`) dengan token
warna/spacing sendiri. LP di sini punya brand/token sendiri per kampanye
(lihat `:root` tiap file) — mencampur ke global.css berisiko bentrok nama
kelas (`.btn`, `.card`, `.h2`, dll.) dan warna.

Tambah LP baru: buat `src/styles/lp/<nama>.css`, import langsung di
`<nama>.astro` (`import "../styles/lp/<nama>.css";`), jangan sentuh
`global.css` atau `src/legacy/`.
