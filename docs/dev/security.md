# Security

Batas keamanan sistem, apa yang melindungi apa, dan aturan wajib. Bukan
pengganti audit. Data pendaftar (KTP, dokumen) di Google Drive diatur di
`../files/registrasi.md` dan `../appscript/rule.md` §6.

## 1. Model ancaman singkat

| Aset | Ancaman utama | Pelindung |
|---|---|---|
| Konten situs (`public.content`) | diubah orang tak berwenang | RLS `content write` hanya `authenticated` + signup dimatikan |
| Gambar bucket `media` | upload sembarangan / timpa file | RLS `storage.objects` hanya `authenticated`, MIME + 5 MB limit |
| Akun admin | brute force / akun liar | Supabase Auth, **Allow new users to sign up = OFF** |
| Service role key | bocor = bypass semua RLS | hanya `.env` lokal, tidak pernah di Cloudflare/repo |
| Data pendaftar (Sheet/Drive) | share link terbuka | folder tidak "anyone with link", akun `web@alfatihah.com` |
| Secret Apps Script | hardcode di `.gs` yang di-commit | Script Properties |

## 2. Key & secret

| Key | Boleh di mana | Tidak boleh |
|---|---|---|
| `PUBLIC_SUPABASE_ANON_KEY` | repo build var, HTML publik (by design, dilindungi RLS) | — |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env` lokal (gitignored) | Cloudflare, repo, prefix `PUBLIC_`, chat/screenshot |
| Token/ID di Apps Script | Script Properties | literal di `.gs` |
| Password admin awal | kirim lewat kanal privat, minta ganti | terminal history, grup chat |

`.env` sudah gitignored. Trivy secret scanner di `security.yml` akan
menandai `.env` lokal — itu benar.

## 3. Auth admin

- Tanpa SDK, REST GoTrue langsung (`sbAuth` di `src/dc/admin.html`).
- Sesi JSON utuh di `localStorage["jagatrip-cms-auth"]`; access token 1 jam;
  refresh hanya saat reload.
- Role `user_metadata.role` hanya label UI — **tidak ada enforcement**
  `admin` vs `super_admin` di RLS. Semua user login bisa tulis semua section.
- **Wajib** di Supabase Dashboard → Authentication → Providers → Email:
  matikan "Allow new users to sign up". Tanpa ini siapa pun bisa daftar lewat
  `/auth/v1/signup` lalu login `/admin`.
- Buat user hanya lewat Admin API / Dashboard (README §9), bukan UI CMS.

## 4. RLS ringkas

| Tabel/bucket | anon | authenticated |
|---|---|---|
| `public.content` | select | all |
| `public.keepalive` | select | — |
| `storage.objects` (`media`) | select | insert/update/delete |

Detail SQL di `database.md` §2–§4.

## 5. Scan otomatis

| Workflow | Kapan | Apa |
|---|---|---|
| `security.yml` (Trivy) | push/PR `main`, Senin 04:00 UTC, manual | vuln di `bun.lock`, secret, misconfig; HIGH/CRITICAL → gagal |
| `codeql.yml` | push/PR `main`, Senin 05:00 UTC, manual | analisis statis JS/TS |

Lokal: `trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --skip-dirs node_modules,dist,.astro .`
False positive → `.trivyignore` dengan ID CVE.

## 6. Aturan wajib tim

- Jangan share screenshot Dashboard Supabase / Sheet pendaftar ke grup
  terbuka; anonimkan saat forward.
- Password awal yang pernah tampil di terminal dianggap bocor — ganti.
- Offboarding: hapus user di Supabase Auth + cabut akses Drive/Apps Script
  di hari yang sama.
- Dependency baru = review `bun.lock` diff + tunggu Trivy hijau.

## 7. Insiden

1. Key bocor → rotate di Supabase Dashboard → Settings → API (anon &
   service role), update Cloudflare build var, rebuild, update `.env` tim.
2. Akun admin dicurigai → Dashboard → Users → ban/hapus, cek `updated_by`
   di `public.content` untuk perubahan mencurigakan.
3. Konten dirusak → restore dari Export JSON terakhir (`database.md` §7).
4. Catat kronologi + tindakan di chat internal; eskalasi ke lead operasional
   sebelum ada komunikasi publik.

ponytail: tidak ada 2FA admin, tidak ada rate-limit login custom (hanya
bawaan GoTrue), tidak ada audit log selain `updated_by`. Upgrade: aktifkan
MFA Supabase + tabel `content_history` via trigger.
