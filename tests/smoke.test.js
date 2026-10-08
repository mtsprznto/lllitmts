import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('package.json expone el script test', () => {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  assert.equal(typeof pkg.scripts?.test, 'string', 'falta scripts.test en package.json');
});

test('rutas y archivos principales existen', () => {
  const files = [
    'src/pages/index.astro',
    'src/pages/formulario.astro',
    'src/pages/prices.astro',
    'src/pages/api/contact.ts',
    'src/pages/sitemap.xml.ts',
    'src/data/albums.ts',
    'src/layouts/Layout.astro',
    'public/robots.txt',
  ];
  for (const f of files) {
    assert.ok(existsSync(join(root, f)), `falta el archivo: ${f}`);
  }
});

test('AGENTS.md contiene las reglas duras', () => {
  const agents = readFileSync(join(root, 'AGENTS.md'), 'utf8');
  assert.match(agents, /pnpm i/);
  assert.match(agents, /node --test tests/);
  assert.match(agents, /PRD_NNN_/);
});
