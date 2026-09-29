import * as d from "../data/defaults";
import { merge, type Content, type Defaults } from "./merge";
import type { Article } from "./types";

// Satu-satunya pintu data untuk pages. Pages tidak boleh import src/data langsung.
// SSR: tiap request baca tabel `content` Supabase (1 baris per section), gabung ke defaults.
// Env kosong / fetch gagal → defaults (situs tidak pernah 500 karena Supabase).
// ponytail: cache in-memory per isolate 30 dtk. Upgrade: Cloudflare Cache API / KV bila traffic tinggi.

const URL = import.meta.env.PUBLIC_SUPABASE_URL;
const KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const TTL = 30_000;

let cache: { at: number; p: Promise<Defaults> } | undefined;
const load = () => {
  if (cache && Date.now() - cache.at < TTL) return cache.p;
  const p = (async () => {
    if (!URL || !KEY) return d;
    try {
      const r = await fetch(`${URL}/rest/v1/content?select=key,data`, { headers: { apikey: KEY } });
      if (!r.ok) throw new Error(String(r.status));
      const c: Content = Object.fromEntries((await r.json()).map((row: { key: string; data: unknown }) => [row.key, row.data]));
      return merge(d, c);
    } catch (e) {
      console.warn("[repo] Supabase gagal, pakai defaults:", e);
      cache = undefined;
      return d;
    }
  })();
  cache = { at: Date.now(), p };
  return p;
};

export const getSite = async () => (await load()).site;
export const getPrograms = async () => (await load()).programs;
export const getEvents = async () => (await load()).events.filter((e) => e.visible);
export const getHome = async () => {
  const c = await load();
  return { gallery: c.gallery, testimonials: c.testimonials.filter((t) => t.visible), audience: c.audience, faqs: c.faqs };
};

export const publishedArticles = (list: Article[]) =>
  list.filter((a) => a.status === "Published").sort((a, b) => b.date.localeCompare(a.date));

export const getArticles = async () => publishedArticles((await load()).articles);
export const getArticle = async (slug: string) => (await getArticles()).find((a) => a.slug === slug);
