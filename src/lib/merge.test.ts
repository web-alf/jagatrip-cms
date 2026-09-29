import { expect, test } from "bun:test";
import * as d from "../data/defaults";
import { merge } from "./merge";

test("kosong → defaults utuh", () => {
  expect(merge(d, {})).toEqual(d);
});

test("status admin → boolean; field hilang diisi dari defaults", () => {
  const out = merge(d, {
    hero: { heading: "Baru", visual: "" },
    programs: [{ title: d.programs[0].title, desc: "x", status: "Coming Soon", href: "" }, { title: "Program Baru", desc: "y", status: "Aktif" }],
    events: [{ ...d.events[0], status: "Sembunyi" } as any],
    testimonials: [{ name: "A", org: "B", video: "https://youtu.be/QvjDgA4mRIs", status: "Tampil" }],
    audience: [{ title: d.audience[0].title, desc: "z" }],
    gallery: [{ label: "L", alt: "a", image: "" }],
  });
  expect(out.site.hero.heading).toBe("Baru");
  expect(out.site.hero.visual).toBe(d.site.hero.visual); // "" → default
  expect(out.programs[0]).toMatchObject({ id: d.programs[0].id, icon: d.programs[0].icon, desc: "x", active: false, href: undefined });
  expect(out.programs[1]).toMatchObject({ id: "program-baru", active: true, points: [] });
  expect(out.events[0].visible).toBe(false);
  expect(out.testimonials[0].visible).toBe(true);
  expect(out.audience[0].icon).toBe(d.audience[0].icon);
  expect(out.gallery[0].image).toBe(d.gallery[0].image);
});
