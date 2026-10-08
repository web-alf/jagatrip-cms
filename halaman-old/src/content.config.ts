import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

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

const testimonials = defineCollection({
  loader: file('./src/content/testimonials.json'),
  schema: z.object({
    id:             z.string(),
    name:           z.string(),
    role:           z.string(),
    quote:          z.string(),
    avatar:         z.string().optional(),
    avatarGradient: z.string().optional(),
    tripSlug:       z.string().optional(),
    rating:         z.number().default(5),
  }),
});

const faqs = defineCollection({
  loader: file('./src/content/faqs.json'),
  schema: z.object({
    id:       z.string(),
    category: z.enum(['umum', 'pendaftaran', 'paket', 'pembayaran', 'persiapan', 'kebijakan']),
    question: z.string(),
    answer:   z.string(),
    order:    z.number(),
  }),
});

const stats = defineCollection({
  loader: file('./src/content/stats.json'),
  schema: z.object({
    id:    z.string(),
    num:   z.string(),
    label: z.string(),
    target: z.number().optional(),
    suffix: z.string().optional(),
  }),
});

const partners = defineCollection({
  loader: file('./src/content/partners.json'),
  schema: z.object({
    id:   z.string(),
    name: z.string(),
  }),
});

export const collections = { trips, testimonials, faqs, stats, partners };
