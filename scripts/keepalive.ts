// Ping DB Supabase agar project free-tier tidak di-pause (pause setelah 7 hari idle).
// Jalankan: bun run keepalive  (Bun auto-load .env)
const url = process.env.PUBLIC_SUPABASE_URL;
const key = process.env.PUBLIC_SUPABASE_ANON_KEY;
const table = process.env.KEEPALIVE_TABLE || "keepalive";
if (!url || !key) throw new Error("PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY kosong");

const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
if (!res.ok) throw new Error(`keepalive gagal: ${res.status} ${await res.text()}`);
console.log(`ok ${new Date().toISOString()} ${table} → ${res.status}`);
