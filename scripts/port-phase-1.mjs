// One-shot port of the Ark-free component tier from moduix into rta-ui.
// Rewrites the dependency imports (Ark factory, Ark types, clsx, moduix internal aliases)
// and copies everything else byte for byte, CSS Modules included.
import { cpSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const FROM = '/Users/amrit/fractaldesign/packages/moduix-main/packages/svelte/src/components';
const TO = new URL('../src/lib/components/', import.meta.url).pathname;

const components = [
  'alert',
  'aspect-ratio',
  'badge',
  'bleed',
  'breadcrumbs',
  'button',
  'card',
  'close-button',
  'container',
  'empty',
  'heading',
  'input-group',
  'kbd',
  'list',
  'separator',
  'simple-grid',
  'skeleton',
  'spinner',
  'stack',
  'table',
  'tag',
  'text',
  'typeset',
];

const rewrite = (source) =>
  source
    .replace(
      /import \{ Ark \} from '@ark-ui\/svelte\/factory';/g,
      "import Element from '../../internal/Element.svelte';",
    )
    .replace(/\bArk\b(?=[\s/>])/g, 'Element')
    .replace(/<\/Ark>/g, '</Element>')
    .replace(/from '@ark-ui\/svelte';/g, "from '../../internal/types';")
    .replace(/import \{ clsx \} from 'clsx';/g, "import { cn } from '../../internal/cn.js';")
    .replace(/\bclsx\(/g, 'cn(')
    .replace(/'@\/lib\/moduix\/a11yLabels'/g, "'../../internal/a11yLabels.js'")
    .replace(/'@\/lib\/moduix\/icons\/ui'/g, "'../../internal/icons/index.js'");

const leftovers = new Set();
const touched = [];

for (const name of components) {
  cpSync(join(FROM, name), join(TO, name), { recursive: true });
  for (const file of readdirSync(join(TO, name))) {
    if (!file.endsWith('.svelte') && !file.endsWith('.ts')) continue;
    const path = join(TO, name, file);
    const source = readFileSync(path, 'utf8');
    const next = rewrite(source);
    if (next !== source) {
      writeFileSync(path, next);
      touched.push(`${name}/${file}`);
    }
    for (const match of next.matchAll(/'([^']*(?:ark-ui|clsx|@\/lib|unpic)[^']*)'/g)) {
      leftovers.add(`${name}/${file}: ${match[1]}`);
    }
  }
}

console.log(`rewrote ${touched.length} files`);
if (leftovers.size) console.log(`leftovers:\n${[...leftovers].join('\n')}`);
