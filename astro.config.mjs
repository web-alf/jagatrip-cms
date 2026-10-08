import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite'; // hanya untuk LP lama via src/styles/lp.css

// SSR: setiap request baca Supabase (cache 30 dtk di lib/repo.ts). Tidak ada build ulang saat konten berubah.
export default defineConfig({
  trailingSlash: 'ignore',
  output: 'server',
  adapter: cloudflare({ imageService: 'passthrough' }),
  session: false,
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false }, // toolbar overlay sendiri yang bikin forced-reflow report palsu saat profiling dev
});
