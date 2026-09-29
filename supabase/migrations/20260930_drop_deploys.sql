-- SSR migration: Publish/deploy-hook flow dihapus. Situs baca Supabase tiap request,
-- tidak perlu lagi tabel jejak "Publish".
drop table if exists public.deploys;
