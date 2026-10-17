import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');

test('PRD-007: navbar del home enlaza a /gallery (paridad con HeaderShared)', () => {
  const header = read('src/components/HeaderHome.astro');
  assert.match(header, /id="nav-gallery"/, 'falta id nav-gallery en HeaderHome');
  assert.match(header, /href="\/gallery"/, 'HeaderHome sin link a /gallery');
});

test('PRD-007: index monta GalleryPromo entre Demos y Precios', () => {
  const index = read('src/pages/index.astro');
  assert.match(
    index,
    /import GalleryPromo from "@\/components\/GalleryPromo\.astro"/,
    'falta import de GalleryPromo'
  );
  const iVideo = index.indexOf('<VideoDemo />');
  const iPromo = index.indexOf('<GalleryPromo />');
  const iPrice = index.indexOf('<PricingSection />');
  assert.ok(iVideo !== -1 && iPromo !== -1 && iPrice !== -1, 'faltan secciones del home');
  assert.ok(iVideo < iPromo && iPromo < iPrice, 'GalleryPromo debe ir entre VideoDemo y PricingSection');
});

test('PRD-007: GalleryPromo — estilo, CTA, a11y y reduced-motion', () => {
  const astro = read('src/components/GalleryPromo.astro');
  assert.match(astro, /id="galeria"/, 'falta id de sección');
  assert.match(astro, /Galería \/ Arte/, 'falta eyebrow editorial');
  assert.match(astro, /id="gallery-title"/, 'falta id del título (SplitType)');
  assert.match(astro, /gallery-tile/, 'falta clase gallery-tile');
  assert.match(astro, /gallery-cta/, 'falta CTA gallery-cta');
  assert.match(astro, /href="\/gallery"/, 'CTA sin link a /gallery');
  assert.match(astro, /loading="lazy"/, 'preview sin lazy loading');
  assert.match(astro, /prefers-reduced-motion/, 'falta guard reduced-motion');
  assert.match(astro, /gsap\.matchMedia\(\)/, 'falta guard GSAP matchMedia');
});

test('PRD-007: preview usa ids reales de gallery.ts (fuente única)', () => {
  const astro = read('src/components/GalleryPromo.astro');
  const data = read('src/data/gallery.ts');

  const ids = new Set([...data.matchAll(/^\s+id: "([^"]+)"/gm)].map((m) => m[1]));
  const block = astro.match(/previewIds\s*=\s*\[([^\]]+)\]/);
  assert.ok(block, 'falta previewIds en GalleryPromo');

  const previewIds = [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  assert.equal(previewIds.length, 3, 'la preview debe ser de 3 obras');
  for (const id of previewIds) {
    assert.ok(ids.has(id), `preview id inexistente en gallery.ts: ${id}`);
  }
});

test('PRD-007: /gallery agregado al prefetch de Speculation Rules', () => {
  const layout = read('src/layouts/Layout.astro');
  assert.match(layout, /"\/gallery"/, 'falta /gallery en speculation rules');
});
