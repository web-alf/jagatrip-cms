# Database (Supabase)

Skema, RLS, migration, dan seed untuk Supabase Postgres + Storage. Alur
pembacaan oleh situs ada di `architecture.md` §2; aturan gambar di bucket
`media` ada di `../files/supabase-rule.md`.

## 1. Objek yang ada

| Objek | Jenis | Fungsi |
|---|---|---|
| `public.content` | tabel | konten CMS, 1 baris per section |
| `public.keepalive` | tabel | target ping cron agar project free tier tidak paused |
| `storage.buckets.media` | bucket | gambar upload admin (public read) |
| `auth.users` | bawaan Supabase | akun admin; role di `user_metadata.role` |
| `public.deploys` | **sudah di-drop** | sisa flow publish lama, jangan dibuat ulang |

## 2. `public.content`

```sql
create table public.content (
  key        text primary key,          -- 'hero', 'programs', 'articles', ...
  data       jsonb not null,            -- persis state admin untuk section itu
  updated_at timestamptz not null default now(),
  updated_by text
);
```

Key yang dipakai (sinkron dengan `NAV_ORDER` di `src/dc/admin.html` dan
`rows` di `scripts/seed.ts`): `hero`, `about`, `founder`, `partnership`,
`footer`, `programHero`, `programs`, `audience`, `events`, `testimonials`,
`gallery`, `faqs`, `articles`, `site` (SEO global).

Shape `data` per key didefinisikan oleh type `Content` di `src/lib/merge.ts`.
**Tidak ada validasi skema di DB** — jsonb bebas. Validasi = merge.ts
(isi kosong → default).

RLS:

| Policy | Role | Akses |
|---|---|---|
| `content read` | semua (anon) | `select` — dibutuhkan Worker publik |
| `content write` | `authenticated` | `all` — semua admin yang login bisa tulis semua section |

ponytail: tidak ada pembeda hak per role (`admin` vs `super_admin`) dan
tidak ada riwayat versi. Upgrade: policy `auth.jwt() -> 'user_metadata' ->>
'role'` + tabel `content_history` via trigger bila butuh audit/rollback.

## 3. `public.keepalive`

```sql
create table public.keepalive (id int primary key default 1, pinged_at timestamptz default now());
insert into public.keepalive default values;
alter table public.keepalive enable row level security;
create policy "anon read" on public.keepalive for select to anon using (true);
```

Dibaca `scripts/keepalive.ts` lewat `.github/workflows/keepalive.yml` tiap 3
hari. Detail README §11.

## 4. Storage bucket `media`

| Setting | Nilai |
|---|---|
| public | `true` |
| `file_size_limit` | 5 MB |
| `allowed_mime_types` | `image/webp`, `image/jpeg`, `image/png` |
| RLS `storage.objects` | `select` semua; `insert`/`update`/`delete` hanya `authenticated`, `bucket_id = 'media'` |

Penamaan file, overwrite (`x-upsert`), dan alasan auto-update ke situs: lihat
`../files/supabase-rule.md`.

## 5. Migration

Lokasi `supabase/migrations/<YYYYMMDD>_<topik>.sql`. **Dijalankan manual** di
Dashboard → SQL Editor (atau `psql "$DATABASE_URL" -f`). Tidak ada Supabase
CLI / CI migration.

| File | Isi |
|---|---|
| `20260929_content.sql` | tabel `content`, bucket `media`, RLS. (Masih berisi blok `deploys` — abaikan; di-drop file berikutnya.) |
| `20260930_drop_deploys.sql` | hapus `public.deploys` |

Aturan:

- Idempotent (`create table if not exists`, `drop policy if exists` sebelum
  `create policy`). Aman dijalankan ulang.
- Satu file per perubahan logis, jangan edit file lama yang sudah dijalankan
  di prod — buat file baru.
- Ubah shape `content` → update bersamaan `src/data/defaults.ts`,
  `src/lib/merge.ts`, `src/dc/admin.html` (lihat `development.md` §5).

## 6. Seed

```bash
bun run seed            # isi key yang belum ada
bun run seed --force    # timpa semua dari defaults.ts
```

Butuh `SUPABASE_SERVICE_ROLE_KEY` di `.env` (bypass RLS). `--force` di prod
= **hapus semua editan admin** — konfirmasi dulu.

## 7. Backup & restore

- Tidak ada backup otomatis selain yang disediakan Supabase (free tier: tidak
  ada PITR).
- Backup manual: tombol **Export JSON** di `/admin` (dump semua section) —
  simpan di Drive tim secara berkala.
- Restore: import JSON tersebut di admin lalu Simpan, atau upsert manual
  via REST dengan service role.

ponytail: backup bergantung disiplin manual. Upgrade: GitHub Action
mingguan yang `GET /rest/v1/content` lalu commit ke repo privat / upload ke
Drive.
