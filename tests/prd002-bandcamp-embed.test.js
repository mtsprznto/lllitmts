import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFileSync(join(root, f), 'utf8');

test('PRD_002 existe como documento', () => {
  assert.ok(existsSync(join(root, 'docs/PRD_002_.md')), 'falta docs/PRD_002_.md');
});

test('albums.ts: bandcampAlbumId presente y data-driven', () => {
  const src = read('src/data/albums.ts');
  assert.match(src, /bandcampAlbumId\?:\s*string/);
  assert.match(src, /bandcampAlbumId:\s*"1060409196"/);
});

test('BandcampEmbed: existe, src literal del embed y a11y', () => {
  const file = 'src/components/album/BandcampEmbed.astro';
  assert.ok(existsSync(join(root, file)), `falta ${file}`);
  const src = read(file);
  // parámetros exactos del embed aportado por el usuario
  for (const p of [
    'album=${albumId}',
    'size=large',
    'bgcol=ffffff',
    'linkcol=0687f5',
    'tracklist=false',
    'artwork=small',
    'transparent=true',
  ]) {
    assert.ok(src.includes(p), `falta el parámetro del embed: ${p}`);
  }
  // a11y: title + fallback al álbum
  assert.match(src, /title=\{`?\$\{album\.title\}/, 'iframe sin title');
  assert.match(src, /<a href=\{album\.bandcampUrl\}>/);
  // data-driven: no hardcodear el id en la plantilla
  assert.ok(!src.includes('1060409196'), 'el albumId no debe estar hardcodeado en el componente');
});

test('[slug].astro: renderiza el embed después del Tracklist y antes de Créditos', () => {
  const src = read('src/pages/album/[slug].astro');
  assert.ok(src.includes('import BandcampEmbed'), 'falta import de BandcampEmbed');
  const embedIdx = src.indexOf('<BandcampEmbed album={album} />');
  assert.ok(embedIdx > 0, 'falta el render de BandcampEmbed');
  const tracklistIdx = src.indexOf('<!-- Tracklist -->');
  const creditsIdx = src.indexOf('<!-- Créditos -->');
  assert.ok(tracklistIdx > 0 && creditsIdx > tracklistIdx, 'orden esperado: Tracklist → embed → Créditos');
  assert.ok(
    embedIdx > tracklistIdx && embedIdx < creditsIdx,
    'el embed debe estar entre Tracklist y Créditos'
  );
});

test('dist: si el build ya incluye el embed, el iframe está en el HTML', () => {
  const distFile = join(root, 'dist/album/inesperado-contratiempo/index.html');
  if (!existsSync(distFile)) return;
  const html = readFileSync(distFile, 'utf8');
  if (!html.includes('data-bandcamp-embed')) return; // build viejo → OK
  assert.match(html, /bandcamp\.com\/EmbeddedPlayer\/album=1060409196/);
});
