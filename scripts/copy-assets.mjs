import { cp, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// svelte-package emits components and CSS Modules under dist/, but the token stylesheets and
// presets are plain CSS that no component imports, so they are copied verbatim.

const copy = async (from, to) => {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const source = join(from, entry.name);
    const target = join(to, entry.name);
    if (entry.isDirectory()) await copy(source, target);
    else await cp(source, target);
  }
};

await copy('src/lib/styles', 'dist/styles');
await copy('src/lib/presets', 'dist/presets');
