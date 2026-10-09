import type { APIRoute } from "astro";
import { SITE } from "../data/site";
import { getArticles } from "../lib/repo";

// SSR: @astrojs/sitemap tidak bisa dipakai (cuma scan output statis saat build,
// tidak tahu rute SSR/dinamis). Endpoint manual: daftar statis + slug artikel dari Supabase.
const STATIC_PATHS = [
  "", "about", "contact", "harga", "program", "promo", "nonformal", "webinar",
  "batch2", "batch3", "batch3myth", "china", "china2", "chinask",
  "jagatalk", "jagatalk02", "jagatalk8", "news",
];

export const GET: APIRoute = async () => {
  const articles = await getArticles();
  const urls = [
    ...STATIC_PATHS.map((p) => `${SITE.url}/${p}`),
    ...articles.map((a) => `${SITE.url}/news/${a.slug}`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join("\n")}\n</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
