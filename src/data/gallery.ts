/**
 * gallery.ts — Fuente única de verdad · Sección Galería (/gallery)
 *
 * Sistema "Technopunk Enterprise" (PRD-003 · full-width PRD-004 · PRD-005)
 * ─────────────────────────────────────────────────────────────
 * ARCHIVO MODULAR: editar este único archivo + redeploy = galería nueva.
 * No hay CMS. No hay API. Solo datos.
 *
 * ── CÓMO AGREGAR UNA OBRA ───────────────────────────────────────
 * 1) Sube el asset a `public/…` (ej. `public/gallery/<slug>.webp`) o usa
 *    una URL remota (https://…).
 *    - Imagen:  `.webp` preferido (+ `srcWebp` para <picture>).
 *    - Video:   `.mp4`/`.webm` (+ `poster` recomendado, anti-CLS).
 *    - YouTube: NO subas nada — pega la URL completa (watch / youtu.be /
 *      shorts) o el ID de 11 caracteres. Thumbnail automático.
 * 2) Agrega una entrada al array `gallery` (abajo):
 *    - `id`:   slug estable y único (sin espacios) — es el anchor/aria-id.
 *    - `kind`: "image" | "video" | "youtube"
 *    - `src`:  URL remota (https://…) O relativa a public/ (/gallery/x.webp).
 *    - `alt`:  SIEMPRE. Descriptivo, sin "imagen 1".
 *    - `aspect`: "16/9" | "1/1" | "3/4"… — reserva la caja (anti-CLS).
 *    - `poster`: video → primera frame · youtube → override del thumb.
 *    - `srcWebp`: opcional — variante webp para <picture>.
 *    - `href` + `hrefLabel`: enlace externo opcional → botón [ETIQUETA ↗]
 *      en la barra del stage (pestaña nueva). Ej: Bandcamp, Instagram.
 *    - `tags`: chips de metadatos (año, técnica, contexto).
 *    - `featured`: máximo 1 — cover de la galería (eager + preload).
 * 3) Commit → push → Vercel build → online.
 *
 * Reglas duras (test `tests/gallery.test.js` las protege):
 *   - `alt` nunca vacío · `id` único · `src` no vacío
 *   - video → `poster` · youtube → `src` parseable · href http(s)
 *   - URLs verificadas con curl antes de commitear (nada fabricado)
 * ────────────────────────────────────────────────────────────────
 */

export type GalleryItemKind = "image" | "video" | "youtube";

export interface GalleryItem {
  /** slug estable y único (anchor / aria-id / data-id) */
  id: string;
  kind: GalleryItemKind;
  /** URL remota (https://…) o relativa a public/ (/gallery/…). En youtube: URL o ID. */
  src: string;
  /** variante webp opcional para <picture> */
  srcWebp?: string;
  /** poster (video) / override del thumbnail (youtube) — anti-CLS */
  poster?: string;
  /** alt obligatorio y descriptivo */
  alt: string;
  /** título visible de la obra */
  title: string;
  /** línea de metadata (año · técnica · notas) */
  meta?: string;
  /** chips (año, contexto) */
  tags?: string[];
  /** "16/9" | "1/1" | "3/4" — reserva de caja (anti-CLS) */
  aspect?: string;
  /** máximo 1 por colección — cover de la galería */
  featured?: boolean;
  /** enlace externo opcional (https://…) — botón en la barra del stage */
  href?: string;
  /** etiqueta del botón de enlace (default: "ABRIR") */
  hrefLabel?: string;
}

/**
 * ────────────────────────────────────────────────────────────────
 * COLECCIÓN
 * Orden del array = orden de exhibición (sin sort — predictibilidad).
 * ────────────────────────────────────────────────────────────────
 */
export const gallery: GalleryItem[] = [
  // ── OBRAS (assets reales del sitio; reemplazar por material nuevo) ──

  {
    id: "ic-caratula",
    kind: "image",
    src: "/images/album/cover-small.png",
    srcWebp: "/images/album/cover-small.webp",
    alt: "Carátula de 'Inesperado contratiempo', álbum de LLLIT: superficies digitales sobre fondo oscuro",
    title: "Inesperado contratiempo",
    meta: "Carátula · 2026 · 1400×1400",
    tags: ["2026", "carátula"],
    aspect: "1/1",
    featured: true,
    href: "https://lllit3.bandcamp.com/album/inesperado-contratiempo",
    hrefLabel: "Bandcamp",
  },
  {
    id: "deriva-generativa",
    kind: "image",
    src: "/images/album/visual-bg.png",
    srcWebp: "/images/album/visual-bg.webp",
    alt: "Visual generativo de LLLIT para proyección en vivo, gama cromática del álbum",
    title: "Deriva generativa",
    meta: "Visual en vivo · 3000×3000",
    tags: ["vivo", "visual"],
    aspect: "1/1",
  },
  {
    id: "wordmark-lllit",
    kind: "image",
    src: "/mts.svg",
    alt: "Wordmark LLLIT en blanco sobre fondo oscuro",
    title: "Identidad — LLLIT",
    meta: "Vector · Wordmark",
    tags: ["identidad", "vector"],
    aspect: "16/9",
  },
  {
    id: "visuales-mark",
    kind: "image",
    src: "/visuales.svg",
    alt: "Letras del logotipo de visuales de LLLIT",
    title: "Identidad — visuales",
    meta: "Vector · Wordmark visuales",
    tags: ["identidad", "vector"],
    aspect: "16/9",
  },
  {
    id: "mapping-01",
    kind: "video",
    src: "https://6bq1d1k7on.ufs.sh/f/78XjxKUMCV2aC50w8NZ0SKExydXnOsaHh5Zopf4cBJtAg2P7",
    poster: "/images/album/visual-bg.webp",
    alt: "Proyección mapping 01 de LLLIT en escenario",
    title: "Mapping 01",
    meta: "Video · VJ en vivo · 16:9",
    tags: ["vivo", "mapping"],
    aspect: "16/9",
  },
  {
    id: "mapping-02",
    kind: "video",
    src: "https://6bq1d1k7on.ufs.sh/f/78XjxKUMCV2ag1LBNhrt3qTU4aZw7euztsYHd1IlBPGERhKF",
    poster: "/images/album/visual-bg.webp",
    alt: "Proyección mapping 02 de LLLIT en escenario",
    title: "Mapping 02",
    meta: "Video · VJ en vivo · 16:9",
    tags: ["vivo", "mapping"],
    aspect: "16/9",
  },
  {
    id: "live-vj",
    kind: "video",
    src: "https://6bq1d1k7on.ufs.sh/f/78XjxKUMCV2amAJhlfGAxW3d57FVvqbwz08cf4ohSyauM9G1",
    poster: "/images/album/cover-small.webp",
    alt: "Sesión VJ en vivo de LLLIT con visuales generativos",
    title: "Live VJ",
    meta: "Video · VJ en vivo · 16:9",
    tags: ["vivo", "vj"],
    aspect: "16/9",
  },
  {
    id: "yt-oficial",
    kind: "youtube",
    src: "https://www.youtube.com/watch?v=3r_SNm6Hp74",
    alt: "Video de LLLIT en YouTube — canal oficial",
    title: "YouTube — canal oficial",
    meta: "YouTube · LLLIT",
    tags: ["video", "youtube"],
    aspect: "16/9",
  },
];
