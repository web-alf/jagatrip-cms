# Troubleshooting

Masalah teknis lintas sistem (build, deploy, Worker, Supabase, admin).
Masalah operasional admin/CS ada di `../admin/cms-flow.md` dan
`../admin/registrasi-flow.md`; masalah Apps Script di
`../appscript/registrasi.md`.

Pola: **gejala → sebab → fix → cegah**.

## 1. Build & deploy (Cloudflare)

| Gejala | Sebab | Fix | Cegah |
|---|---|---|---|
| `Unknown lockfile version` / `lockfile had changes, but lockfile is frozen` | Bun CI < 1.3, lockfile v2 | set build var `BUN_VERSION=1.4.2` | `packageManager` sudah dipin; jangan downgrade Bun |
| Build sukses, Worker 500 semua halaman | dependency pakai Node API tak didukung `workerd` | `wrangler tail` → lihat stack; ganti lib atau aktifkan `nodejs_compat` di `wrangler.jsonc` | jangan tambah dependency Node-only |
| `wrangler deploy` manual gagal auth | belum `wrangler login` | `npx wrangler login` | deploy lewat Workers Builds saja |
| Build hijau tapi `/admin` tampil "Konfigurasi Supabase kosong…" | `PUBLIC_*` tidak ada saat build | isi Build vars → **Retry build** | cek var sebelum push pertama |

## 2. Runtime Worker / halaman publik

| Gejala | Sebab | Fix | Cegah |
|---|---|---|---|
| Situs tampil konten default / lama terus | `repo.ts` fallback: fetch Supabase gagal tiap request | Worker Logs cari `[repo] Supabase gagal`; cek anon key, RLS `content read`, Supabase tidak paused | keepalive cron aktif; jangan ubah policy `content read` |
| Perubahan admin tidak muncul > 30 detik di satu lokasi, muncul di lokasi lain | cache per isolate Worker belum expired di edge itu | tunggu / hard refresh; wajar | — (ponytail cache per isolate) |
| `/news/<slug>` 404 padahal artikel ada | `status` bukan `Published`, atau slug di admin beda dengan URL | cek field status & slug di admin | validasi slug `^[a-z0-9]+(-[a-z0-9]+)*$` di editor |
| Program kehilangan `points`/`icon` setelah edit | judul diganti → `byTitle` di `merge.ts` tidak cocok dengan `defaults.ts` | kembalikan judul persis, atau tambah field ke admin | jangan ganti judul program dari admin tanpa update `defaults.ts` |
| Supabase paused (free tier) | tidak ada aktivitas 7 hari & keepalive gagal | Dashboard → Restore project | cek `keepalive.yml` jalan; secrets GitHub terisi |

## 3. Panel `/admin`

| Gejala | Sebab | Fix | Cegah |
|---|---|---|---|
| "Email atau password salah." padahal benar | user belum `email_confirm`, atau password typo | Dashboard → Users → confirm / reset password | buat user dengan `email_confirm: true` |
| Login lolos, nama/role salah | `user_metadata` kosong | isi `name`, `role` di metadata | ikuti template README §9 |
| "Sesi habis. Login ulang." | access token > 1 jam, refresh hanya saat reload | logout → login | ponytail: timer refresh belum ada |
| "Gagal memuat konten (404)" | tabel `content` belum ada | jalankan `supabase/migrations/20260929_content.sql` | migration sebelum deploy pertama |
| "Upload gambar gagal (404)" | bucket `media` belum ada | jalankan migration | — |
| Upload gagal 413 / ditolak | file > 5 MB atau MIME bukan webp/jpeg/png | kompres dulu; admin sudah auto-resize, cek file sumber | — |
| Gambar 404 di situs setelah pindah/rename di Dashboard Storage | URL di `content` masih nama lama | upload ulang lewat admin | jangan rename/pindah file di Dashboard (`../files/supabase-rule.md` §3) |
| Simpan sukses tapi data lama balik setelah reload | dua admin edit bersamaan, yang terakhir simpan menimpa | koordinasi; satu editor per waktu | ponytail: belum ada lock/versi |

## 4. Lokal

| Gejala | Sebab | Fix |
|---|---|---|
| `bunx astro check` hang | prompt install `@astrojs/check` | jangan jalankan non-interaktif |
| `bun run keepalive` → 404 `PGRST205` | tabel `keepalive` tidak ada | SQL di `database.md` §3 |
| `bun run keepalive` / `seed` → env kosong | `.env` belum ada | `cp .env.example .env` lalu isi |
| `bun run seed` → 401/403 | `SUPABASE_SERVICE_ROLE_KEY` salah/kosong | ambil dari Dashboard → Settings → API |
| `bun install` ubah lockfile | Bun lokal < 1.3 | upgrade Bun ≥ 1.3 |

## 5. Apps Script (form LP)

| Gejala | Sebab | Fix |
|---|---|---|
| Submit form tidak masuk Sheet | deploy pakai versi lama / URL Web App berubah | Deploy → Manage deployments → **Edit → New version**, jangan "New deployment" |
| 403 saat submit | Web App tidak di-set "Anyone" | Deploy → Who has access: Anyone |
| File tidak terupload ke Drive | folder ID salah / akun deploy tidak punya akses | cek Script Properties, deploy dari `web@alfatihah.com` |

Detail per LP: `../appscript/registrasi.md`.

## 6. Cara dapat log

| Sumber | Cara |
|---|---|
| Worker runtime | `npx wrangler tail` (setelah `wrangler login`) atau Dashboard → Worker → Logs |
| Build Cloudflare | Dashboard → Worker → Deployments → klik build |
| Supabase API | Dashboard → Logs → API |
| Browser admin | DevTools Console/Network (request ke `/rest/v1/`, `/auth/v1/`, `/storage/v1/`) |
| Apps Script | editor → Executions |

ponytail: tabel ini dirawat manual dari insiden nyata. Tambah baris tiap
kali ada masalah baru yang butuh > 10 menit untuk ditemukan sebabnya.
