import * as d from "../data/defaults";
import type { Article } from "./types";

// Satu-satunya pintu data untuk pages. Pages tidak boleh import src/data langsung.
// ponytail: static defaults; swap body tiap fungsi ke supabase.from('<table>').select()
// + `output: 'server'` & adapter saat admin Supabase jadi. Signature async sudah siap.

export const getSite = async () => d.site;
export const getPrograms = async () => d.programs;
export const getEvents = async () => d.events.filter((e) => e.visible);
export const getHome = async () => ({
  gallery: d.gallery,
  testimonials: d.testimonials.filter((t) => t.visible),
  audience: d.audience,
  faqs: d.faqs,
});

export const publishedArticles = (list: Article[]) =>
  list.filter((a) => a.status === "Published").sort((a, b) => b.date.localeCompare(a.date));

export const getArticles = async () => publishedArticles(d.articles);
export const getArticle = async (slug: string) => (await getArticles()).find((a) => a.slug === slug);
