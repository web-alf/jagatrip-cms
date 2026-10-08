import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const trips = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trips' }),
  schema: z.object({
    slug:              z.string(),
    month:             z.string(),
    monthNum:          z.number(),
    year:              z.number().default(2026),
    destination:       z.string(),
    destinationShort:  z.string(),
    flag:              z.string(),
    category:          z.enum(['Lokal', 'Internasional']),
    duration:          z.string(),
    durationDays:      z.number(),
    dateStart:         z.coerce.date(),
    dateEnd:           z.coerce.date(),
    earlyBirdDeadline: z.coerce.date().optional(),
    focus:             z.string(),
    segmenPasar:       z.array(z.string()).default([]),
    gradient:          z.string(),
    pricing: z.object({
      earlyBird:    z.number().optional(),
      normal:       z.number().optional(),
      currency:     z.literal('IDR').default('IDR'),
      dpPercentage: z.number().default(50),
    }),
    hero: z.object({
      title:          z.string(),
      titleHighlight: z.string(),
      subtitle:       z.string(),
      lead:           z.string(),
    }),
    itinerary: z.array(z.object({
      day:        z.number(),
      date:       z.coerce.date(),
      dayName:    z.string(),
      theme:      z.string(),
      activities: z.array(z.string()),
    })),
    benefits: z.array(z.object({
      icon: z.string(),
      text: z.string(),
    })),
    inclusions: z.array(z.object({
      icon:  z.string(),
      label: z.string(),
      desc:  z.string(),
    })),
    importantNote: z.string().optional(),
    faqs: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
    seo: z.object({
      title:       z.string(),
      description: z.string(),
      keywords:    z.array(z.string()).optional(),
    }),
    status: z.enum(['open', 'limited', 'soldout', 'tba']).default('open'),
  }),
});

// ponytail: testimonials/faqs/stats/partners dibuang — JSON-nya tidak ikut ekspor dan tidak dipakai 13 LP lama.
export const collections = { trips };
