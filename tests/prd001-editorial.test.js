import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFileSync(join(root, f), 'utf8');

// ── Data (PRD-001 §3.1) ──

test('albums.ts: tipos y campos nuevos (focusTracks, press, streamLinks)', () => {
  const src = read('src/data/albums.ts');
  assert.match(src, /focusTracks\??:\s*FocusTrack\[\]/);
  assert.match(src, /press\??:\s*PressItem\[\]/);
  assert.match(src, /streamLinks\??:\s*StreamLink\[\]/);
  assert.match(src, /kind:\s*"review" \| "feature" \| "share"/);
});

test('albums.ts: focusTracks del EPK (Umbral 03, Latencia resiDual 05)', () => {
  const src = read('src/data/albums.ts');
  assert.match(src, /num:\s*"03",\s*\n\s*name:\s*"Umbral"/);
  assert.match(src, /num:\s*"05",\s*\n\s*name:\s*"Latencia resiDual"/);
});

test('albums.ts: press tiene los 7 outlets del EPK', () => {
  const src = read('src/data/albums.ts');
  for (const outlet of [
    'Parkett Channel',
    'Doozy Magazine',
    'Hominiscanidae',
    'Sykonee',
    '909Originals',
    'Choonreview',
    'MixCult',
  ]) {
    assert.ok(src.includes(outlet), `falta outlet: ${outlet}`);
  }
  // 3 pullquotes (con quote) y 4 filas compactas (sin quote)
  assert.equal((src.match(/quote:/g) || []).length, 3, 'deben ser 3 pullquotes');
});

test('albums.ts: streamLinks con Bandcamp primary y URLs https', () => {
  const src = read('src/data/albums.ts');
  assert.match(src, /label:\s*"Bandcamp"[\s\S]{0,200}?primary:\s*true/);
  // ningún link puede ser http:// (PRD §5)
  const insecure = src.match(/["']http:\/\/[^"']*["']/g) || [];
  assert.deepEqual(insecure, [], `links inseguros: ${insecure.join(', ')}`);
});

test('albums.ts: URLs canónicas del EPK (bandcamp, spotify, playlist youtube)', () => {
  const src = read('src/data/albums.ts');
  assert.ok(
    src.includes('https://lllit3.bandcamp.com/album/inesperado-contratiempo'),
    'falta bandcampUrl del EPK'
  );
  assert.ok(src.includes('https://open.spotify.com/album/1RhKnCw5drwsGGzAMm0AZC'));
  assert.match(src, /youtubeUrl:\s*\n?\s*"https:\/\/www\.youtube\.com\/watch\?v=[^"]*list=/);
  assert.ok(src.includes('https://dlcm.app/ec-underground/lllit-linesperado-contratiempo'));
});

test('albums.ts: correcciones de data (genres, créditos EPK)', () => {
  const src = read('src/data/albums.ts');
  assert.match(src, /"Downtempo"/);
  assert.match(src, /"Dub techno"/);
  assert.ok(src.includes('Camola Bravo'), 'falta crédito Collage (EPK)');
  assert.ok(src.includes('Groovidub'), 'falta crédito Voz adicional (EPK)');
});

// ── Componentes (PRD-001 §2 A/B/C) ──

test('componentes: existen y tienen el data-contract GSAP', () => {
  const components = {
    'src/components/album/FocusTracksSection.astro': [
      'data-focus-section',
      'data-focus-header',
      'data-focus-item',
    ],
    'src/components/album/PressSection.astro': [
      'data-press-section',
      'data-press-header',
      'data-press-item',
    ],
    'src/components/album/LinkhubSection.astro': [
      'data-linkhub',
      'data-linkhub-header',
      'data-linkhub-item',
      '/redeem',
    ],
  };
  for (const [file, markers] of Object.entries(components)) {
    assert.ok(existsSync(join(root, file)), `falta el archivo: ${file}`);
    const src = read(file);
    for (const m of markers) {
      assert.ok(src.includes(m), `${file}: falta el marcador ${m}`);
    }
  }
});

test('LinkhubSection: Bandcamp como CTA primary y /redeem al final', () => {
  const src = read('src/components/album/LinkhubSection.astro');
  assert.match(src, /border-2 border-\[#fde047\]/, 'CTA primary debe ser amber sólido');
  assert.match(src, /l\.primary/, 'debe renderizar primary primero');
  // /redeem es el último bloque del linkhub
  const redeemIdx = src.indexOf('/redeem');
  assert.ok(redeemIdx > 0, 'falta /redeem');
  assert.ok(
    redeemIdx > src.indexOf('soundcloudUrl'),
    '/redeem debe venir después de las redes'
  );
});

// ── Integración en [slug].astro (PRD-001 §4) ──

test('[slug].astro: renderiza las 3 secciones y no duplica CTAs/Redes', () => {
  const src = read('src/pages/album/[slug].astro');
  assert.ok(src.includes('FocusTracksSection'), 'falta FocusTracksSection');
  assert.ok(src.includes('PressSection'), 'falta PressSection');
  assert.ok(src.includes('LinkhubSection'), 'falta LinkhubSection');
  // bloques viejos absorbidos por el linkhub (§6 #3)
  assert.ok(!src.includes('Pre-order en Bandcamp'), 'el CTA viejo debe eliminarse');
  assert.ok(!src.includes('<!-- Redes -->'), 'el bloque Redes debe eliminarse');
});

test('[slug].astro: countdown vencido server-rendered + markReleased', () => {
  const src = read('src/pages/album/[slug].astro');
  assert.match(src, /const releaseTs = Date\.parse/);
  assert.match(src, /const isReleased =/);
  assert.match(src, /data-countdown-target=\{releaseTs\}/);
  assert.match(src, /data-bandcamp=\{album\.bandcampUrl\}/);
  assert.match(src, /data-countdown-label/);
  assert.match(src, /isReleased \? "Out now" : "Out in"/);
  assert.match(src, /const markReleased = \(\) =>/);
  // rama reduce también cubre el vencimiento
  assert.match(src, /prefers-reduced-motion: reduce[\s\S]{0,400}markReleased\(\)/);
});

test('[slug].astro: 6 tweens GSAP con guards para los bloques nuevos', () => {
  const src = read('src/pages/album/[slug].astro');
  const tweens = [
    '[data-focus-header]',
    '[data-focus-item]',
    '[data-press-header]',
    '[data-press-item]',
    '[data-linkhub-header]',
    '[data-linkhub-item]',
  ];
  for (const sel of tweens) {
    const re = new RegExp(`gsap\\.from\\(\\s*"${sel.replace(/[[\]]/g, '\\$&')}"`);
    assert.match(src, re, `falta gsap.from para ${sel}`);
  }
  // guards: solo se anima si la sección existe
  for (const section of ['[data-focus-section]', '[data-press-section]', '[data-linkhub]']) {
    const guard = `page.querySelector("${section}")`;
    assert.ok(src.includes(guard), `falta guard para ${section}`);
  }
  // el data-contract de las filas de redes movidas NO se anima (spec GSAP)
  const socialRow = src.match(/<div data-anim class="mt-7 flex flex-wrap gap-x-6/);
  assert.equal(socialRow, null, 'la fila de redes vieja no debe seguir en la página');
});

// ── Build (condicional: solo si dist/ está actualizado) ──

test('dist: si el build ya incluye el data-contract, el estado es "Out now"', () => {
  const distFile = join(root, 'dist/album/inesperado-contratiempo/index.html');
  if (!existsSync(distFile)) return; // sin build local → OK
  const html = readFileSync(distFile, 'utf8');
  if (!html.includes('data-countdown-target')) return; // build viejo → OK
  assert.match(html, /Out now/);
  assert.match(html, /stream \/ buy/);
  assert.match(html, /data-focus-section/);
  assert.match(html, /data-press-section/);
  assert.match(html, /data-linkhub/);
});
