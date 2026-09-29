import type { Article, Audience, Event, Faq, GalleryItem, Program, Site, Testimonial } from "./types";

// Bentuk baris tabel `content` = state admin (src/dc/admin.html DEFAULTS). Longgar: semua opsional.
export type Content = Partial<{
  hero: Partial<Site["hero"]>; about: Partial<Site["about"]>; founder: Partial<Site["founder"]>;
  partnership: Partial<Site["partnership"]>; footer: Partial<Site["footer"]>; programHero: Partial<Site["programHero"]>;
  programs: { title: string; desc: string; status: string; href?: string }[];
  audience: { title: string; desc: string }[];
  events: { title: string; date: string; meta: string; desc: string; price: string; href: string; flyer: string; status: string }[];
  testimonials: { name: string; org: string; video: string; status: string }[];
  gallery: { label: string; alt: string; image: string }[];
  faqs: Faq[];
  articles: (Omit<Article, "status"> & { status: string })[];
}>;

export interface Defaults {
  site: Site; programs: Program[]; events: Event[]; gallery: GalleryItem[];
  testimonials: Testimonial[]; audience: Audience[]; faqs: Faq[]; articles: Article[];
}

// Isi kosong ("" / null / undefined) di admin → pakai default. Shallow.
const fill = <T extends object>(base: T, over?: Partial<T>): T => {
  const out = { ...base };
  for (const k in over) if (over[k] !== "" && over[k] != null) (out as any)[k] = over[k];
  return out;
};
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
// ponytail: detail (icon/long/points/flyerAlt) hanya ada di defaults, dicocokkan by title. Ganti judul = detail hilang.
// Upgrade: tambah field tsb ke form admin lalu hapus byTitle.
const byTitle = <T extends { title: string }>(list: T[], t: string) => list.find((x) => x.title === t);

export function merge(d: Defaults, c: Content): Defaults {
  return {
    site: {
      hero: fill(d.site.hero, c.hero), about: fill(d.site.about, c.about), founder: fill(d.site.founder, c.founder),
      partnership: fill(d.site.partnership, c.partnership), footer: fill(d.site.footer, c.footer),
      programHero: fill(d.site.programHero, c.programHero),
    },
    programs: c.programs?.map((p) => {
      const def = byTitle(d.programs, p.title);
      return { long: p.desc, who: "", listLabel: "", points: [], icon: "", ...def, id: def?.id ?? slug(p.title), title: p.title, desc: p.desc, active: p.status === "Aktif", href: p.href || undefined };
    }) ?? d.programs,
    events: c.events?.map((e) => ({ ...e, flyerAlt: byTitle(d.events, e.title)?.flyerAlt ?? e.title, visible: e.status === "Tampil" })) ?? d.events,
    testimonials: c.testimonials?.map((t) => ({ video: t.video, name: t.name, org: t.org, visible: t.status === "Tampil" })) ?? d.testimonials,
    audience: c.audience?.map((a) => ({ ...a, icon: byTitle(d.audience, a.title)?.icon ?? "" })) ?? d.audience,
    gallery: c.gallery?.map((g, i) => ({ ...g, image: g.image || d.gallery[i]?.image || "" })) ?? d.gallery,
    faqs: c.faqs ?? d.faqs,
    articles: (c.articles as Article[] | undefined) ?? d.articles,
  };
}
