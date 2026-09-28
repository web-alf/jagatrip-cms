// Domain types. Shape = future Supabase tables (1 type ≈ 1 table / 1 row in `settings`).

export interface Program {
  id: string;
  title: string;
  desc: string;
  long: string;
  who: string;
  listLabel: string;
  points: string[];
  icon: string; // inner SVG markup, 24x24 viewBox
  active: boolean; // false = Coming Soon
  href?: string;
  cta?: string;
}

export interface Event {
  title: string;
  date: string;
  meta: string;
  desc: string;
  price: string;
  href: string;
  flyer: string;
  flyerAlt: string;
  visible: boolean;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string; // YYYY-MM-DD
  status: "Published" | "Draft";
  excerpt: string;
  body: string;
  cover: string;
  imageAlt: string;
}

export interface Faq { q: string; a: string }
export interface Testimonial { video: string; name: string; org: string; visible: boolean }
export interface GalleryItem { label: string; alt: string; image: string }
export interface Audience { title: string; desc: string; icon: string }

export interface Site {
  hero: { eyebrow: string; heading: string; highlight: string; body: string; cta1: string; cta1Href: string; cta2: string; cta2Href: string; visual: string; visualAlt: string };
  about: { eyebrow: string; heading: string; lead: string; body: string; readMoreHref: string };
  founder: { photo: string; photoAlt: string; name: string; role: string; points: string[] };
  partnership: { bgImage: string };
  footer: { description: string; tagline: string; instagram: string; tiktok: string; email: string; waAdmin: string; waPartnership: string; address: string };
}
