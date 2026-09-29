-- Jalankan sekali di Supabase → SQL Editor (atau: psql "$DATABASE_URL" -f file ini).
-- Idempotent: aman dijalankan ulang.

-- 1) Konten CMS: 1 baris per section (hero, about, programs, articles, ...). data = JSON persis seperti state admin.
create table if not exists public.content (
  key        text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.content enable row level security;

drop policy if exists "content read" on public.content;
create policy "content read"  on public.content for select using (true);              -- build situs (anon) + admin
drop policy if exists "content write" on public.content;
create policy "content write" on public.content for all to authenticated using (true) with check (true);

-- 2) Permintaan publish. INSERT di sini memicu Database Webhook → Cloudflare Deploy Hook (lihat README §Publish).
create table if not exists public.deploys (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  by_email   text
);
alter table public.deploys enable row level security;

drop policy if exists "deploys insert" on public.deploys;
create policy "deploys insert" on public.deploys for insert to authenticated with check (true);
drop policy if exists "deploys read" on public.deploys;
create policy "deploys read"   on public.deploys for select to authenticated using (true);

-- 3) Storage bucket gambar (public read, tulis hanya user login). Maks 5 MB/file.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media read"   on storage.objects;
create policy "media read"   on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media insert" on storage.objects;
create policy "media insert" on storage.objects for insert to authenticated with check (bucket_id = 'media');
drop policy if exists "media update" on storage.objects;
create policy "media update" on storage.objects for update to authenticated using (bucket_id = 'media');
drop policy if exists "media delete" on storage.objects;
create policy "media delete" on storage.objects for delete to authenticated using (bucket_id = 'media');
