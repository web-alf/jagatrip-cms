# API — endpoint yang dipakai & disediakan repo ini

Referensi untuk developer: semua HTTP endpoint yang **dipanggil** kode
(Supabase REST/Auth/Storage, Google Apps Script) dan yang **disediakan**
Worker (`/sitemap.xml`). Beda dengan `architecture.md` (kenapa desainnya
begini) dan `database.md` (skema tabel) — file ini cuma kontrak request/
response. Key/auth lihat `security.md`.

Catatan: **tidak ada backend API buatan sendiri** di repo ini. Semua baca/tulis
data langsung ke Supabase via REST (tanpa SDK) dan form LP ke Apps Script.

## 1. Peta pemanggil

| Pemanggil | Endpoint | Auth | Lokasi kode |
|---|---|---|---|
| Halaman publik (SSR Worker) | `GET /rest/v1/content` | anon | `src/lib/repo.ts` |
| Admin (browser) | `/auth/v1/*`, `/rest/v1/content`, `/storage/v1/object/media/*` | anon + JWT user | `src/dc/admin.html` (`sbAuth`, `sbData`) |
| `bun run seed` | `GET/POST /rest/v1/content` | service role | `scripts/seed.ts` |
| `bun run keepalive` / cron GitHub | `GET /rest/v1/<KEEPALIVE_TABLE>` | anon | `scripts/keepalive.ts` |
| Form LP (browser) | `POST <APPS_SCRIPT_URL>` | tidak ada (`no-cors`) | `src/pages/*.astro`, `src/legacy/lib/*-handler.ts` |
| Crawler | `GET /sitemap.xml` | publik | `src/pages/sitemap.xml.ts` |

Base URL Supabase = `PUBLIC_SUPABASE_URL` (format `https://<ref>.supabase.co`).

## 2. Supabase REST — `public.content`

Satu baris per section admin; `key` = nama section (`site`, `programs`,
`events`, `articles`, …), `data` = jsonb dengan shape persis `DEFAULTS` di
`admin.html` / `src/data/defaults.ts`.

### 2.1 Baca semua section

```http
GET {URL}/rest/v1/content?select=key,data
apikey: <anon>
Authorization: Bearer <anon | access_token>
```

Response `200`:

```json
[{ "key": "site", "data": { "siteName": "JAGATRIP", "...": "..." } }, { "key": "programs", "data": [ ] }]
```

- `repo.ts`: hanya `apikey` (tanpa `Authorization`), hasil di-`merge()` ke
  defaults, cache 30 detik per isolate. Non-2xx / network error → log
  `[repo] Supabase gagal, pakai defaults` dan kembalikan `defaults.ts`.
- Admin (`sbData.load`): header `sbAuth.headers()`; non-2xx → error
  "Gagal memuat konten (<status>). Sudah jalankan migration SQL?".

### 2.2 Upsert section

```http
POST {URL}/rest/v1/content?on_conflict=key
apikey: <anon>
Authorization: Bearer <access_token>
Content-Type: application/json
Prefer: resolution=merge-duplicates,return=minimal

[{ "key": "site", "data": { }, "updated_by": "admin@jagatrip.com" }, ...]
```

Response `201` tanpa body (`return=minimal`).

- Admin (`sbData.save`) selalu kirim **semua** key dari `DEFAULTS` dalam satu
  request (bukan hanya section yang berubah). `401` → "Sesi habis. Login
  ulang."; status lain → "Gagal menyimpan ke server (<status>)".
- Seed (`scripts/seed.ts`) pakai service role; tanpa `--force` hanya kirim
  key yang belum ada (cek dulu `GET …?select=key`).
- RLS: `select` untuk anon, `insert/update` hanya `authenticated` — lihat
  `database.md`.

### 2.3 Keepalive

```http
GET {URL}/rest/v1/{KEEPALIVE_TABLE}?select=id&limit=1
```

Default tabel `keepalive`. Tujuan cuma bikin project free-tier tidak
di-pause; respons tidak dipakai.

## 3. Supabase Auth (GoTrue) — admin

Dipakai `sbAuth` di `admin.html`. Header baku:
`apikey: <anon>`, `Authorization: Bearer <access_token ?? anon>`,
`Content-Type: application/json`.

| Method `sbAuth` | Request | Respons / perlakuan |
|---|---|---|
| `signIn(email, pw)` | `POST /auth/v1/token?grant_type=password` body `{email,password}` | `200` → objek sesi (`access_token`, `refresh_token`, `user`), disimpan utuh di `localStorage["jagatrip-cms-auth"]`. `400` → "Email atau password salah." |
| `refresh(refresh_token)` | `POST /auth/v1/token?grant_type=refresh_token` body `{refresh_token}` | `200` → sesi baru; selain itu `null` (user diminta login ulang). Hanya dipanggil saat mount jika `user()` gagal. |
| `user(access_token)` | `GET /auth/v1/user` | `200` → user; `user_metadata.role === "super_admin"` → label Super Admin. Selain `200` → `null`. |
| `signOut(access_token)` | `POST /auth/v1/logout` | best-effort, error diabaikan. |
| Buat user (manual, bukan dari UI) | `POST /auth/v1/admin/users` dengan service role | lihat README §9. |

Signup publik (`/auth/v1/signup`) **wajib dimatikan** di Dashboard —
`security.md` §auth.

## 4. Supabase Storage — bucket `media`

Upload gambar admin (`sbData.upload`). Blob selalu `image/webp` (dikonversi
di browser sebelum upload).

```http
POST {URL}/storage/v1/object/media/{name}
apikey: <anon>
Authorization: Bearer <access_token>
Content-Type: image/webp
Cache-Control: 31536000
x-upsert: true

<binary webp>
```

- `name`: kalau URL lama sudah berawalan
  `{URL}/storage/v1/object/public/media/` → pakai nama file yang sama
  (timpa in-place, tidak ada file yatim). Kalau tidak → `crypto.randomUUID()`
  + `.webp`.
- Return ke UI: `{URL}/storage/v1/object/public/media/{name}?v=<base36 timestamp>`
  — query `?v=` memaksa browser/CDN ambil versi baru meski `Cache-Control`
  panjang.
- Non-2xx → "Upload gambar gagal (<status>). Bucket 'media' sudah dibuat?".
- Baca gambar publik: `GET {URL}/storage/v1/object/public/media/{name}` tanpa
  header (bucket public). Aturan operasional: `../files/supabase-rule.md`.

## 5. Google Apps Script — form landing page

Semua form LP kirim `POST` JSON ke URL deployment web app Apps Script dengan
`mode: "no-cors"` → **respons tidak bisa dibaca browser**; sukses dianggap
kalau `fetch` tidak throw, lalu user diarahkan ke WhatsApp. Aturan script:
`../appscript/rule.md`.

### 5.1 Request

```http
POST https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
Content-Type: application/json   (kadang text/plain karena no-cors; script parse manual)

{
  "_sheet": "Partnership",
  "nama": "…", "wa": "62…",
  "timestamp": "2026-10-26T03:00:00.000Z",
  "source": "https://jagatrip.com/partnership",
  "utm_source": "", "utm_medium": "", "utm_campaign": "", "utm_term": "", "utm_content": "",
  "gclid": "", "fbclid": ""
}
```

- `_sheet` = nama tab tujuan di Spreadsheet; field lain bebas per LP (kolom
  dicocokkan ke header sheet oleh script).
- UTM/click-id diambil dari query string halaman (`getUtm()` /
  `URLSearchParams`), kosong kalau tidak ada.

### 5.2 Daftar `_sheet` per halaman

| Halaman | `_sheet` | Deployment |
|---|---|---|
| `/register` (`src/legacy/lib/register-handler.ts`) | `Registrasi` | `…AKfycbw42POu…` — script `scripts/apps-script/registrasi.gs` |
| `/partnership` | `Partnership` | `…AKfycbzBsDea…` |
| `/jagatalk9` | `Jagatalk9` | `…AKfycbzKufC…` |
| `/batch2` | `Batch3MYTH` | shared `…AKfycbwrwCUY…` |
| `/batch3` | `Batch3` | shared |
| `/batch3myth` | `Batch2` | shared |
| `/china` | `China` | shared |
| `/china2` | `China2` | shared |
| `/chinask` | `China_SK` | shared |
| `/jagatalk` | `LP_Jagatalk_Premium` | shared |
| `/jagatalk02` | `LP_Jagatalk02` | shared |
| `/jagatalk8` | `LP_Jagatalk8` | shared |
| `/webinar` | `LP_Jagatalk` | shared |
| `/nonformal` | `LP1_Nonformal` | shared |
| `/promo` | `LP2_Promo` | shared |

URL lengkap ada hardcoded di tiap file (`const APPS_SCRIPT_URL`). Perhatikan
`batch2.astro` kirim `_sheet: 'Batch3MYTH'` dan `batch3myth.astro` kirim
`_sheet: 'Batch2'` (tertukar sejak LP lama) — jangan "betulkan" tanpa cek
sheet mana yang sedang dipakai CS.

### 5.3 Payload khusus `/register` (`registrasi.gs`)

Selain field teks, field file dikirim sebagai **base64 polos** (tanpa prefix
`data:`), maks 5 MB per file, plus metadata:

```json
{
  "_sheet": "Registrasi",
  "nama_lengkap": "…", "wa": "…", "email": "…",
  "file_paspor": "<base64>", "file_paspor_name": "paspor.jpg", "file_paspor_type": "image/jpeg",
  "file_ktp": "…", "file_pas_foto_visa": "…", "file_ktp_kk": "…",
  "file_itinerary_visa": "…", "file_saldo_rekening": "…", "file_bukti_transfer": "…"
}
```

Script simpan file ke subfolder Drive per jenis (`Paspor/`, `KTP/`, …),
ganti nilai field jadi URL Drive, lalu tulis baris sesuai
`JGT_REG_HEADER_MAP`. Kolom `No` dan `Status` (`"Baru"`) diisi script.
Detail: `../appscript/registrasi.md`, `../files/registrasi.md`.

### 5.4 Respons script (tidak terbaca browser, berguna saat test via curl)

| Method | Body |
|---|---|
| `GET /exec` | `{"ok":true,"message":"JAGATRIP registrasi endpoint aktif","time":"…"}` — health check |
| `POST /exec` sukses | `{"ok":true}` |
| `POST /exec` gagal | `{"ok":false,"error":"<pesan>"}` (HTTP tetap 200) |

Test manual:

```bash
curl -L -X POST "https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec" \
  -H "Content-Type: application/json" \
  -d '{"_sheet":"Registrasi","nama_lengkap":"TEST","wa":"628000","source":"curl"}'
```

`-L` wajib — Apps Script selalu redirect 302 ke `script.googleusercontent.com`.

## 6. Endpoint yang disediakan Worker

| Route | File | Isi |
|---|---|---|
| `GET /sitemap.xml` | `src/pages/sitemap.xml.ts` | XML `urlset`: daftar statis `STATIC_PATHS` + `/news/<slug>` dari `getArticles()`. `Content-Type: application/xml`. Tidak di-cache khusus (ikut cache 30 dtk `repo.ts`). |
| `GET /robots.txt` | `public/robots.txt` | statis |
| `GET /news/<slug>` | `src/pages/news/[slug].astro` | SSR; slug tidak ada / status bukan `Published` → `404`. |

Semua halaman lain = HTML SSR biasa, bukan API.

## 7. Error & fallback ringkas

| Sumber | Gagal | Perilaku |
|---|---|---|
| `repo.ts` → Supabase | network / non-2xx / env kosong | tampilkan `defaults.ts`, log warn, cache dikosongkan supaya request berikut coba lagi |
| Admin load/save | `401` | pesan "Sesi habis", user login ulang (refresh token hanya dicoba saat mount) |
| Admin upload | non-2xx | pesan error, gambar lama tetap |
| Form LP → Apps Script | apa pun | tidak terdeteksi (no-cors); user tetap diarahkan ke WA — CS cross-check sheet |

ponytail: URL Apps Script hardcoded per halaman dan satu deployment dipakai
banyak LP (tabel §5.2) — tidak ada env/registry tunggal. Upgrade: pindahkan ke
`src/data/defaults.ts` (section `site`) atau tabel `content` kalau URL mulai
sering berubah; tambahkan endpoint relay di Worker kalau butuh baca respons
Apps Script (hilangkan `no-cors`).
