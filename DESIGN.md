# DESIGN.md — LLLIT

> Documento vivo del sistema de diseño de **lllitmts**. Refleja el estado actual del codebase. Cualquier cambio visual debe mantener coherencia con estas directrices.

## 1. Visión General

**LLLIT** es un sitio web para proyecto musical + visuales en vivo con estética **Y2K Brutalista / Editorial Experimental**. 

- **Framework:** [Astro](https://astro.build/) `^7.3.7` (SSR con `@astrojs/vercel`)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) vía `@tailwindcss/vite`
- **Animaciones:** [GSAP](https://gsap.com/) `^3.13.0` + [SplitType](https://www.split-type.com/) `^0.3.4` + `ScrollTrigger`
- **Tipografías:** GTA (Regular/Bold/Semibold), GTANarrow + Google Fonts (Poppins/Roboto)
- **Email:** [Resend](https://resend.com/) `^6.0.1`
- **Assets externos:** UploadThing (videos demo)

## 2. Filosofía de Diseño

- **Dark-first**: Tema oscuro por defecto. Toggle claro/oscuro con persistencia en `localStorage`.
- **Brutalista con toque neón**: Bordes gruesos (`border-2`, `border-t-2`), tipografías condensadas/uppercase, corchetes `[ ... ]`, stickers angulados, estética editorial.
- **Editorial cinematográfico**: Jerarquía tipográfica agresiva (`tracking-tighter`, `leading-[0.9]`), mucho aire, enfoque en tipografía sobre decorado.
- **Content-first**: Componentes `.astro`, mínimo CSS global, utilidades Tailwind.
- **Performance-aware**: `content-visibility: auto`, `fetchpriority="high"`, `decoding="async"`, `font-display: swap`, preconnects estratégicos, speculation rules.
- **Motion-respectful**: Respeta `prefers-reduced-motion`. Sin animaciones forzadas para usuarios sensibles.

## 3. Design Tokens (CSS Custom Properties)

Definidos en `src/layouts/Layout.astro` dentro de `@theme` y `:root/.dark`.

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--surface` | `#ffffff` | `#111111` | Fondo de secciones/páginas |
| `--ink` | `#000000` | `#ffffff` | Color de texto principal |
| `--muted` | `rgba(0,0,0,0.6)` | `rgba(255,255,255,0.6)` | Texto secundario/descriptivo |
| `--line` | `#000000` | `#ffffff` | Bordes, divisores (`border-[var(--line)]`, `divide-[var(--line)]`) |
| `--color-neon` | `#ffff00` | `#ffff00` | Acento neón (hover, badges, puntos, CTA) |
| `--font-sans` | `"Poppins","Roboto","sans-serif"` | mismo | UI/texto |
| `--font-narrow` | `"GTANarrow",system-ui,sans-serif` | mismo | Tipografías condensadas |
| `--animate-bounce-pulse` | `bounce-pulse 2s ease-in-out infinite` | mismo | Indicador "keep scrolling" |

**Keyframes:** `bounce-pulse` (translateY + scale + opacity) usado por `KeepScrolling`.

**Dark mode:** vía clase `.dark` en `<html>`. Aplicado por script inline en `Layout.astro` (evita FOUC) + `ThemeToggle.astro` con `localStorage`.

## 4. Tipografías

### Fuentes locales (custom)
Ubicadas en `/public/fonts/` con `font-display: swap`.

| Familia | Archivo | Peso | Uso |
|---|---|---|---|
| `GTA` | `gta-regular.woff` | `400` | Display/body alternativo |
| `GTA` | `gta-semibold.woff` | `600` | Semi-bold |
| `GTA` | `gta-bold.woff` | `700` | Bold display |
| `GTANarrow` | `gta-narrow.woff` | `400` | Condensado editorial |

### Fuentes web
Preconectadas + `preload` con `onload` fallback (no bloqueante):

- `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&family=Roboto:wght@300;400;500&display=swap`

## 5. Paleta & Efectos

- **Neón:** `text-neon`, `hover:bg-neon hover:text-black`, `decoration-neon/40`
- **Brutalismo:** `border-2 border-[var(--line)]`, `shadow-[4px_4px_0_rgba(0,0,0,0.6)]`, `shadow-[6px_6px_0_rgba(0,0,0,0.6)]`, `-rotate-6`
- **Transparencias:** `bg-black/50 backdrop-blur-md`, `text-white/30`, `text-white/40`, `border-white/10`, `border-white/15`
- **Estados hover:** scale sutil (`hover:scale-110`), translate (`hover:translate-x-1`)

## 6. Layout Base

**`src/layouts/Layout.astro`** provee:

- HTML lang="es", viewport con `user-scalable=no`
- Favicon `/favicon.ico`
- Canonical dinámico
- SEO meta: title/description/keywords
- Open Graph + Twitter Cards
- JSON-LD dinámico (merge `structuredData` con defaults)
- Preconnects (fonts.gstatic, UploadThing, Bandcamp, Instagram)
- Font preload no-bloqueante
- Speculation Rules (prefetch/prerender rutas críticas)
- **Theme init inline** (evita FOUC) — aplica `.dark` según `localStorage` o default `dark`
- Slot principal
- `KeepScrolling` animado (condicional `hideKeepScrolling`)
- Global styles: Tailwind import, `@custom-variant dark`, `@theme`, tokens, `bounce-pulse`, resets, `content-visibility`, `@font-face`, `img/video` responsive

**JSON-LD por defecto incluye:** `BreadcrumbList` (opcional), `MusicGroup`, `Person`, `WebSite`.

## 7. Componentes

Todos son `.astro`. Animaciones orquestadas con GSAP + atributos `data-*`.

| Componente | Propósito |
|---|---|
| `HeaderHome.astro` | Nav home con botones scroll-to (About/Videos/Precios/Álbum). Animación GSAP `from("nav button", y:60, stagger:0.2)` |
| `HeaderShared.astro` | Nav compacto para páginas internas (/album, /formulario). Mismo lenguaje visual |
| `ThemeToggle.astro` | Toggle light/dark. Sincroniza con `localStorage` + eventos `storage`. UI brutalista con corchetes |
| `HomePrincipal.astro` | Hero sección #section1. Logo LET centrado + email copiable (clipboard API). Animaciones GSAP propias + ScrollToPlugin |
| `AsciiCanvas.astro` | Capa ASCII decorativa (usado en formularios/páginas con estética retro) |
| `AsciiLogo.astro` | Variante ASCII del logo |
| `SectionInfo.astro` | Sección informativa "About this" (#section2). Coreografía GSAP con `SplitType` |
| `VideoDemo.astro` / `VideoGrid.astro` | Showreel de videos. Items con `data-video-item`. Entrada escalonada con ScrollTrigger |
| `PricingSection.astro` | Cards de precios mapping visual (con/sin proyector). Animaciones con SplitType + stagger |
| `AlbumPromo.astro` | Promo álbum "Inesperado contratiempo". Links Bandcamp/streaming |
| `AudioPreview.astro` | Preview de tracks |
| `Footer.astro` | Footer con iconos (formulario/IG/mail) + links internos. Animación `gsap.from` sobre `[data-footer] a` con `stagger:0.06`. Respeta `prefers-reduced-motion` |
| `album/` | `BandcampEmbed.astro`, `FocusTracksSection.astro`, `LinkhubSection.astro`, `PressSection.astro` |
| `FormularioComponents/FormularioComponets.astro` | Formulario Y2K brutalista con ASCII decorativo, sticker flotante, validación + fetch `/api/contact`, GSAP SplitText + parallax ASCII + flotación sticker (desktop) |

## 8. Páginas & Rutas

| Ruta | Archivo | Notas |
|---|---|---|
| `/` | `src/pages/index.astro` | Landing. Usa `HeaderHome`, `HomePrincipal`, `SectionInfo`, `VideoDemo`, `PricingSection`, `AlbumPromo`, FAQ + `Footer`. JSON-LD: `VideoObject`, `Service`, `FAQPage` |
| `/formulario` | `src/pages/formulario.astro` | Contacto/booking. `HeaderShared` + `FormularioComponets` + `Footer`. `hideKeepScrolling=true`. JSON-LD: `ContactPage` |
| `/prices` | `src/pages/prices.astro` | Precios detallados. `PricingSection level={1}` + FAQ ampliado + `Footer`. JSON-LD: `FAQPage` |
| `/album` | `src/pages/album/index.astro` | Listado discografía |
| `/album/[slug]` | `src/pages/album/[slug].astro` | Dinámico desde `src/data/albums.ts`. Genera JSON-LD `MusicAlbum` + `BreadcrumbList` por álbum |
| `/redeem` | `src/pages/redeem.astro` | Sistema canje códigos promocionales (KV-backed) |
| `/api/contact` | `src/pages/api/contact.ts` | `POST`. Validación servidor (name>=2, email válido, message>=5). Envía vía Resend. Respuestas JSON `{success,...}` |
| `/api/redeem/request-code` | `src/pages/api/redeem/request-code.ts` | Solicitud código verificación |
| `/api/redeem/verify` | `src/pages/api/redeem/verify.ts` | Verificación + consumo código |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Sitemap dinámico (incluye `/album/[slug]`) |
| `/404` | `src/pages/404.astro` | Página 404 |

## 9. Datos

**`src/data/albums.ts`**
- `Album` interface: slug, title, artist, releaseDate, label, description/es, coverUrl, visualBgUrl, bandcampUrl, instagramUrl/youtube/soundcloud, tracks[], credits[], genres[], price, releaseType, campaignDate, focusTracks?, press?, streamLinks?
- `getAlbumBySlug(slug)` lookup

**`src/data/promo-codes.ts`** — lógica/estado códigos promocionales

## 10. Sistema Animaciones

Patrón: **data attributes + GSAP**. Código JS inline en componentes `.astro` (client-side).

### Convenciones
- `[data-anim]` — elementos con entrada genérica
- `[data-field]` — campos formulario
- `[data-video-item]` — items grid videos
- `[data-footer] a` — links footer
- `[data-sticker]` — sticker flotante
- `[data-ascii]` — capa ASCII con parallax
- IDs semánticos: `#section1,#section2,#section3,#faq,#formulario-index,#contact-form`

### GSAP Plugins
- `ScrollTrigger` (register global donde se usa)
- `ScrollToPlugin` (HomePrincipal)
- `SplitType` / `SplitText` (secciones con revelado por caracteres/líneas)

### Ejemplos clave
- **Hero handoff** (`index.astro`, `HomePrincipal.astro`, `public/js/scripts.js`): timeline con `scrub:true` sobre `#section1` — escala/fade hero, aparece `#logo_header`
- **Sección 3 videos**: `from("#section3-videos [data-video-item]", y:40, opacity:0, stagger:0.06, ScrollTrigger toggleActions:"play none none none")`
- **FAQ**: SplitType chars → revela con `yPercent:110`, items stagger 0.08, CTA 0.5
- **Formulario**: SplitText título, ASCII parallax `yPercent:15→-15` con scrub, timeline entrada (chars→anim→fields→sticker), sticker float `y:12, rotation:4, yoyo/repeat:-1` (desktop >=1024px)
- **Footer**: entrada escalonada desde abajo

### Accesibilidad Motion
Uso extensivo de `gsap.matchMedia()`:

```js
mm.add("(prefers-reduced-motion: reduce)", () => {})
mm.add("(prefers-reduced-motion: no-preference)", () => { /* motion */ })
```

CSS también añade `transition:none` bajo `@media (prefers-reduced-motion: reduce)` (Footer, FAQ).

**Principio:** Sin `prefers-reduced-motion: reduce` → sin ocultar elementos. Todo visible por defecto (progressive enhancement). Solo se añaden transform/opacity animados.

## 11. Tema Claro/Oscuro

- **Init**: script inline en `<head>` lee `localStorage.getItem("theme")`. Default `dark`. Aplica `root.classList.toggle("dark", theme==="dark")` + `colorScheme`.
- **Toggle**: `ThemeToggle.astro` lee estado actual, alterna, guarda en `localStorage`. Escucha `storage` para sincronizar entre pestañas.
- **Tokens**: todos los colores semánticos usan variables CSS (`var(--surface)`, `var(--ink)`, etc.) → cambio instantáneo.

## 12. Formulario de Contacto

**Frontend (`FormularioComponets.astro`)**
- Validación HTML5: `required`, `minlength`, `type="email"`
- Validación JS extra: trim + `email.includes("@")` + longitudes
- Envío vía `fetch("/api/contact", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...})})`
- Estados: `loading` / `success` / `error` con `aria-live="polite" role="status"`
- UI brutalista: inputs con focus ring amarillo, botón con shadow 3D
- Sin recarga de página

**Backend (`src/pages/api/contact.ts`)**
- Solo `POST`. Otros métodos → 405
- Validación servidor idéntica
- Usa `RESEND_API_KEY` + `RESEND_FROM` + `RESEND_TO`
- Envía email con `await resend.emails.send({...})`
- Respuesta `{success:true}` o `{success:false,error:"..."}` con códigos 400/500

## 13. SEO 2026

**`robots.txt`** + **`llms.txt`** + **sitemap.xml dinámico**

**JSON-LD estratégico:**
- `index.astro`: `VideoObject`, `Service`, `FAQPage`
- `formulario.astro`: `ContactPage`
- `prices.astro`: `FAQPage`
- `album/[slug].astro`: `MusicAlbum` + `BreadcrumbList`
- `Layout.astro` (defaults): `MusicGroup`, `Person`, `WebSite`, `BreadcrumbList` condicional

**Practicas:**
- Canonical único por página
- OG/Twitter con `ogImage` configurable
- H1 descriptivo
- `aspect-ratio` en covers (evita CLS)
- `lazy` implícito + `decoding="async"`
- `fetchpriority="high"` en hero image
- Preconnects + speculation rules
- `llms.txt` para discoverability IA

## 14. Assets

- **Imágenes:** `/public/images/album/`, assets varios `.webp/.png/.jpg`
- **SVG:** `/src/assets/svg_icon/` (FormIcono, IGIcono, MailIcono, etc.)
- **JS:** `/public/js/scripts.js` (timeline hero inicial + fades)
- **Fonts:** `/public/fonts/` (GTA family)
- **CSV promo:** `/public/codes-inesperado-contratiempo/*.csv`

## 15. Convenciones de Código

- **Componentes:** `.astro` únicamente (sin React/Vue/Svelte)
- **Path alias:** `@/` → `./src/` (configurado vía Astro/TS)
- **TypeScript:** estricto (`astro/tsconfigs/strict`)
- **Animaciones:** vía `data-*` attributes + `public/js/scripts.js` o inline en componente
- **CSS:** mínimo global; 99% Tailwind utilities
- **Imports:** usar alias `@/components/...`, `@/assets/...`, `@/layouts/...`, `@/data/...`, `@/lib/...`
- **Tests:** `tests/*.test.js` con runner nativo `node --test`
- **No instalar desde WSL:** ver `AGENTS.md` (prohibido `pnpm i` desde agente)
- **.env:** nunca commitear. Claves productivas

## 16. Tests

Directorio `tests/`. Runner: `node --test tests/*.test.js`

Actual: `tests/smoke.test.js` (smoke test básico).

**Regla:** Agente corre con `node --test tests/*.test.js`. Usuario con `pnpm test`.

## 17. Configuración Build

**`astro.config.mjs`**
- `output: 'server'` (SSR)
- `adapter: vercel({ webAnalytics: { enabled: true } })`
- `compressHTML: true` (preserva output v6)
- `vite.plugins: [tailwindcss()]`
- `vite.server.watch.ignored: ['**/.codebase-memory/**']`

**`package.json` scripts:**
- `dev`, `prebuild` (limpia `.vercel/output`), `build`, `preview`, `test`, `astro`

## 18. Checklist Diseño QA

- [ ] **Tema**: default dark, toggle funciona, persiste tras reload
- [ ] **Motion**: `prefers-reduced-motion: reduce` desactiva animaciones GSAP + transiciones CSS
- [ ] **Responsive**: mobile (<=640px), tablet, desktop (>=1024px) — sticker solo desktop
- [ ] **Tipografías**: carga sin FOUT (font-display swap) + preload
- [ ] **Accesibilidad**: `aria-label`, `aria-live`, `role="status"`, focus visible en inputs/botones, alt text en imágenes
- [ ] **Performance**: LCP hero con `fetchpriority="high"`, imágenes con `decoding="async"`, `content-visibility`
- [ ] **SEO**: canonical correcto por ruta, JSON-LD válido, sitemap incluye álbumes
- [ ] **Formulario**: validación cliente+servidor, estados claros, sin envío doble
- [ ] **Animaciones**: sin parpadeos (init inline theme), GSAP context limpio

## 19. Referencias Rápidas

| Archivo | Razón |
|---|---|
| `docs/PROJECT.md` | Detalle stack/rutas/SEO |
| `AGENTS.md` | Reglas agente + flujo MCP |
| `src/layouts/Layout.astro` | Tokens + base HTML + SEO |
| `public/js/scripts.js` | Timeline hero global |
| `src/components/FormularioComponents/FormularioComponets.astro` | Referencia estética Y2K brutalista |
| `src/data/albums.ts` | Fuente única datos álbumes |

**Última actualización:** `2026-10-17` (generado desde análisis codebase + MCP `lllitmts` ready)