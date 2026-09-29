// Seed tabel `content` dari src/data/defaults.ts (bentuk = state admin). Idempotent (upsert).
// bun run seed            → hanya isi key yang belum ada
// bun run seed --force    → timpa semua
import * as d from "../src/data/defaults";

const URL = process.env.PUBLIC_SUPABASE_URL, KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) throw new Error("Set PUBLIC_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY di .env");
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

const vis = (v: boolean) => (v ? "Tampil" : "Sembunyi");
const rows: Record<string, unknown> = {
  hero: d.site.hero, about: d.site.about, footer: d.site.footer, partnership: d.site.partnership,
  founder: { photo: d.site.founder.photo, photoAlt: d.site.founder.photoAlt, name: d.site.founder.name, role: d.site.founder.role },
  programs: d.programs.map((p) => ({ title: p.title, desc: p.desc, status: p.active ? "Aktif" : "Coming Soon", href: p.href ?? "" })),
  audience: d.audience.map(({ title, desc }) => ({ title, desc })),
  events: d.events.map(({ visible, flyerAlt, ...e }) => ({ ...e, status: vis(visible) })),
  testimonials: d.testimonials.map(({ visible, ...t }) => ({ ...t, status: vis(visible) })),
  gallery: d.gallery, faqs: d.faqs, articles: d.articles,
};

const force = process.argv.includes("--force");
const have = new Set<string>(force ? [] : (await (await fetch(`${URL}/rest/v1/content?select=key`, { headers: H })).json()).map((r: { key: string }) => r.key));
const body = Object.entries(rows).filter(([k]) => !have.has(k)).map(([key, data]) => ({ key, data, updated_by: "seed" }));
if (!body.length) { console.log("Semua key sudah ada. Pakai --force untuk timpa."); process.exit(0); }

const r = await fetch(`${URL}/rest/v1/content?on_conflict=key`, { method: "POST", headers: { ...H, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(body) });
if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
console.log("Seed OK:", body.map((b) => b.key).join(", "));
