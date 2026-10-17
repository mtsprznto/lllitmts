# PROJECT.md — Detalle del proyecto lllitmts

Detalle operativo que vive fuera de `AGENTS.md` (ese es solo un índice).

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| **Astro** | ^5.9.2 | Framework core (SSR con Vercel) |
| **Tailwind CSS** | ^4.1.9 | Estilos utilitarios (vía Vite plugin) |
| **GSAP** | ^3.13.0 | Animaciones scroll + character-level |
| **SplitType** | ^0.3.4 | Split text para animaciones |
| **Resend** | ^6.0.1 | Envío de emails (formulario de contacto) |
| **UploadThing** | — | Hosting de videos demo |

## Rutas principales

| Ruta | Archivo | Descripción |
|---|---|---|
| `/` | `src/pages/index.astro` | Landing page |
| `/formulario` | `src/pages/formulario.astro` | Formulario de contacto |
| `/prices` | `src/pages/prices.astro` | Precios / servicios |
| `/album/[slug]` | `src/pages/album/[slug].astro` | Página dinámica de álbumes |
| `POST /api/contact` | `src/pages/api/contact.ts` | API endpoint (Resend) |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Sitemap dinámico SEO |

## SEO 2026 — Infraestructura

| Archivo | Propósito |
|---|---|
| `public/robots.txt` | Crawl instructions + sitemap link |
| `public/llms.txt` | AI discoverability (ChatGPT/Gemini/Perplexity) |
| `public/sitemap.xml` | Dynamic XML sitemap via `src/pages/sitemap.xml.ts` |
| `src/layouts/Layout.astro` | Canonical tags, OG, Twitter Cards, JSON-LD, BreadcrumbList, WebSite, MusicGroup schema |
| `src/data/albums.ts` | Album data source with SEO metadata per album |

### Prácticas SEO implementadas

- Canonical tags en todas las páginas
- Open Graph + Twitter Cards con imagen por página
- JSON-LD con MusicGroup, MusicAlbum, BreadcrumbList, WebSite, VideoObject, Service
- H1 único y descriptivo por página
- Font preload con `onload` para no bloquear render
- Sitemap XML dinámico incluye /album/[slug]
- llms.txt para citas en AI search
- Lazy loading + `decoding="async"` en imágenes
- Aspect-ratio en covers para evitar CLS

## Convenciones del código

- Todos los componentes son `.astro` (sin React/Vue/Svelte)
- Path alias: `@/` → `./src/`
- Animaciones vía `data-*` attributes + `public/js/scripts.js` o inline
- CSS global mínimo; todo via Tailwind utility classes
- Tipado estricto (`astro/tsconfigs/strict`)
- Fuentes custom GTA en `/public/fonts/`
- Videos hosting externo (UploadThing), assets estáticos en `/public/`

## Seguridad

- `.env` contiene API keys productivas — no commitees ni expongas este archivo
- Validación doble (cliente + servidor) en formulario de contacto

## Build (Windows)

- `node_modules` se instala con layout **hoisted** (`nodeLinker: hoisted` en `pnpm-workspace.yaml`).
  El adapter `@astrojs/vercel` replica el layout de pnpm dentro de `.vercel/output/functions/*_render.func`
  con `fs.symlink()`; en Windows ese API exige Developer Mode/admin y con el layout aislado
  (junctions de `.pnpm/`) el build falla con `EPERM`. Con hoisted el adapter copia, no enlaza.
- Tras cambiar `nodeLinker`, reinstalar una vez desde Windows: `Remove-Item -Recurse -Force node_modules; pnpm install`.
- Verificar: `node_modules/.modules.yaml` → `"nodeLinker": "hoisted"` → `pnpm build`.
- Detalle y evidencia: `docs/PRD_006_.md`.

## Tests

- Directorio: `tests/` (runner nativo de Node: `node --test`)
- Agente (WSL): `node --test tests/*.test.js` — nunca `pnpm test`
- Usuario (Windows): `pnpm test`
- Los tests nuevos se agregan como `tests/*.test.js`
