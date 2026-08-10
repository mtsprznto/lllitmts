import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  // Astro 7 cambió el default de compressHTML de `true` a `'jsx'` (colapsa
  // espacios entre elementos inline, como React). Pinar `true` preserva el
  // output de v6 y evita que palabras en prosa/enlaces se peguen.
  compressHTML: true,
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/.codebase-memory/**']
      }
    }
  }
});