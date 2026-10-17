import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');

test('data: gallery.ts existe y exporta el contrato', () => {
  const src = read('src/data/gallery.ts');
  assert.match(src, /export const gallery/, 'falta export const gallery');
  assert.match(src, /export interface GalleryItem/, 'falta interface GalleryItem');
  assert.match(src, /export type GalleryItemKind = "image" \| "video" \| "youtube"/, 'kind contract inválido');
});

test('data: ids únicos, alt/src obligatorios, video con poster, featured ≤ 1', () => {
  const src = read('src/data/gallery.ts');
  const body = src.slice(src.indexOf('export const gallery'));

  const ids = [...body.matchAll(/^\s+id: "([^"]+)"/gm)].map((m) => m[1]);
  const alts = [...body.matchAll(/^\s+alt: "([^"]*)"/gm)].map((m) => m[1]);
  const srcs = [...body.matchAll(/^\s+src: "([^"]+)"/gm)].map((m) => m[1]);

  assert.ok(ids.length > 0, 'la colección está vacía');
  assert.equal(new Set(ids).size, ids.length, 'ids duplicados');
  assert.equal(alts.length, ids.length, 'toda obra necesita alt');
  for (const alt of alts) assert.ok(alt.trim().length > 0, 'alt vacío');
  assert.equal(srcs.length, ids.length, 'toda obra necesita src');

  const featured = [...body.matchAll(/featured: true/g)].length;
  assert.ok(featured <= 1, 'featured debe ser máximo 1');

  const objects = body.match(/\{[\s\S]*?\}/g) ?? [];
  for (const obj of objects) {
    if (/kind: "video"/.test(obj)) {
      assert.ok(/poster: "/.test(obj), 'video sin poster (CLS)');
    }
    // PRD-005: youtube con src parseable (URL watch/youtu.be/shorts/embed o ID)
    if (/kind: "youtube"/.test(obj)) {
      const m = obj.match(/^\s+src: "([^"]+)"/m);
      assert.ok(m, 'youtube sin src');
      assert.match(
        m[1],
        /(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)[A-Za-z0-9_-]{11}$|^[A-Za-z0-9_-]{11}$/,
        'src de youtube no es URL/ID parseable'
      );
    }
    // PRD-005: href solo http(s)
    const href = obj.match(/^\s+href: "([^"]+)"/m);
    if (href) assert.match(href[1], /^https?:\/\//, 'href debe ser http(s)');
  }

  // Regresión PRD-005: nada de URLs fabricadas (utfs.io del seed roto)
  assert.doesNotMatch(src, /utfs\.io/, 'URLs utfs.io fabricadas detectadas');
});

test('componente GalleryTech: a11y, runtime y reduced-motion presentes', () => {
  const astro = read('src/components/gallery/GalleryTech.astro');
  assert.match(astro, /<style is:global>/, 'style debe ser is:global (nodos inyectados por JS)');
  assert.match(astro, /data-items=\{JSON\.stringify/, 'falta payload data-items');
  assert.match(astro, /role="dialog"/, 'falta role=dialog en lightbox');
  assert.match(astro, /aria-modal="true"/, 'falta aria-modal en lightbox');
  assert.match(astro, /aria-live="polite"/, 'falta aria-live');
  assert.match(astro, /prefers-reduced-motion/, 'falta guard reduced-motion');
  assert.match(astro, /fetchpriority="high"/, 'cover debe ser fetchpriority=high');
  assert.match(astro, /gsap\.matchMedia\(\)/, 'falta guard GSAP matchMedia');
  assert.match(astro, /navigator\.share/, 'falta Web Share API');
  assert.match(astro, /addEventListener\("input", applyFilter\)/, 'falta filtro conectado');
});

test('GalleryTech: receta full-width + responsive (PRD-004)', () => {
  const astro = read('src/components/gallery/GalleryTech.astro');

  // D1 — full-bleed ≥lg por descuento de gutters
  assert.match(astro, /lg:-mx-8/, 'falta recorte de gutters lg:-mx-8');
  assert.match(astro, /xl:-mx-10/, 'falta recorte xl:-mx-10');
  assert.match(astro, /2xl:-mx-12/, 'falta recorte 2xl:-mx-12');
  assert.match(astro, /lg:border-x-0/, 'la ventana debe perder bordes laterales en full-bleed');
  assert.doesNotMatch(astro, /mx-auto max-w-7xl/, 'el contenedor antiguo max-w-7xl sigue presente');
  assert.match(astro, /gt-copy max-w-3xl/, 'falta bloque de texto contenido gt-copy');

  // D2 — sidebar fluida + lista file-manager
  assert.match(astro, /lg:grid-cols-\[clamp\(16rem,22vw,24rem\)_1fr\]/, 'grid del sidebar no es fluido');
  assert.match(astro, /lg:max-h-none/, 'la lista debe liberar su tope en lg');
  assert.match(astro, /lg:flex-1/, 'la lista debe estirarse a la altura del stage');

  // D3 — stage fluido con svh + fallback (sin inline style)
  assert.match(astro, /@supports \(min-height: 50svh\)/, 'falta feature-detect svh');
  assert.match(astro, /clamp\(320px, 50svh, 640px\)/, 'falta clamp del stage');
  assert.doesNotMatch(astro, /minHeight: "320px"/, 'el stage no debe usar inline minHeight');

  // D5 — orden mobile: la obra primero
  assert.match(astro, /order-2[^"]*lg:order-1/, 'aside debe ir segundo en mobile');
  assert.match(astro, /order-1[^"]*lg:order-2/, 'stage debe ir primero en mobile');

  // D4 — lightbox escalado + cap dvh
  assert.match(astro, /lg:max-w-6xl 2xl:max-w-7xl/, 'lightbox sin escalado lg/2xl');
  assert.match(astro, /min\(75dvh, calc\(100dvh - 14rem\)\)/, 'media del lightbox sin cap dvh');

  // D6 — touch targets
  assert.match(astro, /@media \(pointer: coarse\)/, 'faltan touch targets ≥44px');
});

test('GalleryTech: youtube facade + enlaces externos + medios relativos (PRD-005)', () => {
  const astro = read('src/components/gallery/GalleryTech.astro');

  // Medios same-origin (regresión del bug raíz: prod sin deploy)
  assert.doesNotMatch(astro, /normUrl/, 'normUrl() debe haber sido eliminada');
  assert.doesNotMatch(astro, /const norm = /, 'norm() de runtime debe haber sido eliminada');
  assert.match(astro, /href=\{coverUrl\}/, 'el preload debe usar la ruta relativa');

  // Facade YouTube
  assert.match(astro, /youtube-nocookie\.com\/embed\//, 'falta embed youtube-nocookie');
  assert.match(astro, /class="gt-yt gt-media" data-yt=/, 'falta facade .gt-yt con data-yt');
  assert.match(astro, /i\.ytimg\.com\/vi\/\$\{id\}\/hqdefault\.jpg/, 'falta thumbnail automático de YouTube');
  assert.match(astro, /gt-yt-play/, 'falta overlay de reproducción');

  // Enlaces externos
  assert.match(astro, /gt-link-btn/, 'falta botón de enlace externo');
  assert.match(astro, /hrefLabel \?\? "ABRIR"/, 'falta etiqueta por defecto ABRIR');
  assert.match(astro, /rel="noopener noreferrer"/, 'falta rel=noopener en enlaces');

  // Fix overflow v0.5.1: el <picture> es la caja dimensionada (no el img interior)
  assert.match(astro, /<picture class="gt-media" style="\$\{box\}\$\{ar\}"/, 'picture debe ser la caja dimensionada (fix overflow)');
  assert.match(
    astro,
    /<img src="\$\{esc\(item\.src\)\}"[\s\S]{0,60}style="width:100%;height:100%;object-fit:contain;"/,
    'img interior del picture debe usar contain'
  );
});

test('página /gallery: existe, monta GalleryTech y structuredData', () => {
  const page = read('src/pages/gallery/index.astro');
  assert.match(page, /import GalleryTech from "@\/components\/gallery\/GalleryTech\.astro"/);
  assert.match(page, /<GalleryTech items=\{gallery\} \/>/);
  assert.match(page, /"@type": "CollectionPage"/);
  assert.match(page, /canonicalUrl/);
});

test('descubrimiento: sitemap, llms.txt y navegación apuntan a /gallery', () => {
  const sitemap = read('src/pages/sitemap.xml.ts');
  assert.match(sitemap, /"\/gallery"/, 'falta /gallery en sitemap');
  assert.match(sitemap, /"\/redeem"/, 'sitemap perdió /redeem');

  const llms = read('public/llms.txt');
  assert.match(llms, /lllitmts\.vercel\.app\/gallery/, 'llms.txt no menciona /gallery');

  const header = read('src/components/HeaderShared.astro');
  assert.match(header, /href="\/gallery"/, 'header sin link a /gallery');

  const footer = read('src/components/Footer.astro');
  assert.match(footer, /href="\/gallery"/, 'footer sin link a /gallery');
});
