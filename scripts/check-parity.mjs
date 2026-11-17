import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Mechanical porting check: every literal `data-scope` / `data-part` / `data-slot` hook that moduix
// emits for a family must still be emitted here. Hooks built from expressions
// (`data-part={part}`) are invisible to this check, so a family whose reference emits no literal
// hook is reported as unverifiable rather than green.
//
// Ark-backed families emit no literal scope/part hooks upstream: Ark appends them at runtime from
// its Zag anatomy. For those families the port must *supply* them, so added scope/part hooks are
// expected and only `data-slot` is compared literally.

const MODUIX =
  process.env.RTA_PARITY_REFERENCE ?? '../moduix-main/packages/svelte/src/components';
const LOCAL = 'src/lib/components';

// Both a literal attribute (`data-slot="card-root"`) and a destructured default
// (`'data-slot': dataSlot = 'card-root'`) count as an emitted hook.
const HOOKS = [
  ['scope', /data-scope(?:=["']|\W+\w+ = ["'])([a-z0-9-]+)/g],
  ['part', /data-part(?:=["']|\W+\w+ = ["'])([a-z0-9-]+)/g],
  ['slot', /data-slot(?:=["']|\W+\w+ = ["'])([a-z0-9-]+)/g],
];

// Intentional differences from moduix, each with its reason. Anything else fails the check.
const ACCEPTED = {
  breadcrumbs: {
    added: ['scope:breadcrumbs', 'part:root'],
    reason: 'moduix emitted no root scope/part; the root hook is part of this library contract',
  },
  'radio-group': {
    added: ['slot:radio-group-item-hidden-input'],
    reason:
      'the hidden radio input is an Ark internal upstream; here it is a public part so native radio semantics stay reachable',
  },
  'rating-group': {
    added: ['slot:rating-group-hidden-input'],
    reason:
      'the hidden input is an Ark internal upstream; here it is a public part so form submission stays reachable',
  },
  'angle-slider': {
    added: ['slot:angle-slider-hidden-input'],
    reason:
      'the hidden input is an Ark internal upstream; here it is a public part so form submission stays reachable',
  },
  'color-picker': {
    added: ['slot:color-picker-hidden-input'],
    reason:
      'the hidden input is an Ark internal upstream; here it is a public part so form submission stays reachable',
  },
  'date-input': {
    added: ['slot:date-input-hidden-input'],
    reason:
      'the hidden input is an Ark internal upstream; here it is a public part so form submission stays reachable',
  },
  'carousel': {
    added: ['slot:carousel-spinner'],
    reason:
      'upstream renders the carousel spinner inside the control; here it is a public part so a loading state can be placed explicitly',
  },
  'segment-group': {
    added: ['slot:segment-group-item-control', 'slot:segment-group-item-hidden-input'],
    reason:
      'the item control and hidden input are Ark internals upstream; here they are public parts so native radio semantics stay reachable',
  },
  'pin-input': {
    added: ['slot:pin-input-hidden-input'],
    reason:
      'the hidden input is an Ark internal upstream; here it is a public part so form submission stays reachable',
  },
  'signature-pad': {
    added: ['slot:signature-pad-hidden-input'],
    reason:
      'the hidden input is an Ark internal upstream; here it is a public part so the exported value can be submitted with a form',
  },
  slider: {
    added: ['slot:slider-hidden-input'],
    reason:
      'the hidden input is an Ark internal upstream; here it is a public part so form submission stays reachable',
  },
  lightbox: {
    added: [
      'slot:lightbox-caption',
      'slot:lightbox-counter',
      'slot:lightbox-download-trigger',
      'slot:lightbox-next-trigger',
      'slot:lightbox-prev-trigger',
      'slot:lightbox-thumbnail',
      'slot:lightbox-thumbnail-item',
      'slot:lightbox-thumbnails',
      'slot:lightbox-viewport',
      'slot:lightbox-zoom-trigger',
    ],
    reason:
      'upstream relies on the carousel for navigation chrome; here the gallery navigation, thumbnails and zoom are public parts of the lightbox itself',
  },
  sidebar: {
    added: ['slot:sidebar-input', 'slot:sidebar-rail', 'slot:sidebar-separator'],
    reason:
      'the cookie input, the edge rail and the separator are upstream internals; here they are public parts so a sidebar can be composed explicitly',
  },
  toast: {
    added: ['slot:toast-icon', 'slot:toast-progress', 'slot:toast-progress-bar', 'slot:toast-viewport'],
    reason:
      'upstream keeps the icon, progress and viewport inside the toaster; here they are public parts so a toast can be laid out explicitly',
  },
  tour: {
    added: ['slot:tour-progress-bar', 'slot:tour-progress-bar-fill'],
    reason:
      'upstream only ships a progress label; here a progress bar is a public part so a step indicator can be rendered',
  },
  timer: {
    added: ['slot:timer-item-label', 'slot:timer-item-value'],
    reason:
      'the item label and value are Ark internals upstream; here they are public parts so each segment can be rendered alone',
  },
  typeset: {
    added: ['slot:typeset-root'],
    removed: ['slot:typeset'],
    reason: 'every family root slot is `<family>-root`, so `typeset` was renamed',
  },
};

async function collect(dir) {
  const hooks = new Set();
  let arkBacked = false;
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return null;
  }

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const hook of (await collect(path)) ?? []) hooks.add(hook);
      continue;
    }
    if (!entry.name.endsWith('.svelte') && !entry.name.endsWith('.ts')) continue;

    const source = await readFile(path, 'utf8');
    if (source.includes('@ark-ui/svelte')) arkBacked = true;
    for (const [label, pattern] of HOOKS) {
      for (const match of source.matchAll(pattern)) hooks.add(`${label}:${match[1]}`);
    }
  }

  return { arkBacked, hooks };
}

if (!existsSync(MODUIX)) {
  console.error(`reference tree not found at ${MODUIX} — nothing compared`);
  console.error('set RTA_PARITY_REFERENCE to the moduix svelte components directory');
  process.exit(2);
}

const families = (await readdir(LOCAL, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

let failures = 0;
const counts = { identical: 0, unverifiable: 0, accepted: 0 };

for (const family of families) {
  const referenceDir = await collect(join(MODUIX, family));
  if (!referenceDir) {
    console.log(`· ${family}: no moduix counterpart`);
    continue;
  }
  const reference = referenceDir.arkBacked
    ? new Set([...referenceDir.hooks].filter((hook) => hook.startsWith('slot:')))
    : referenceDir.hooks;
  if (!reference.size) {
    counts.unverifiable += 1;
    console.log(`· ${family}: reference hooks are dynamic, nothing to compare`);
    continue;
  }

  const localDir = (await collect(join(LOCAL, family))) ?? { arkBacked: false, hooks: new Set() };
  const local = referenceDir.arkBacked
    ? new Set([...localDir.hooks].filter((hook) => hook.startsWith('slot:')))
    : localDir.hooks;
  const removed = [...reference].filter((hook) => !local.has(hook));
  const added = [...local].filter((hook) => !reference.has(hook));
  const accepted = ACCEPTED[family] ?? { added: [], removed: [] };

  const unexpectedRemoved = removed.filter((hook) => !accepted.removed?.includes(hook));
  const unexpectedAdded = added.filter((hook) => !accepted.added?.includes(hook));

  if (unexpectedRemoved.length || unexpectedAdded.length) {
    failures += 1;
    if (unexpectedRemoved.length) console.log(`✗ ${family}: removed ${unexpectedRemoved.join(', ')}`);
    if (unexpectedAdded.length) console.log(`+ ${family}: unexpected ${unexpectedAdded.join(', ')}`);
    continue;
  }

  if (removed.length || added.length) {
    counts.accepted += 1;
    console.log(`≈ ${family}: accepted deviation — ${accepted.reason}`);
    continue;
  }

  counts.identical += 1;
  const scope = referenceDir.arkBacked ? 'data-slot hooks identical (Ark supplies anatomy)' : `${reference.size} hooks identical`;
  console.log(`✓ ${family}: ${scope}`);
}

console.log(
  `\n${families.length} families · ${counts.identical} identical · ${counts.accepted} accepted deviations · ${counts.unverifiable} unverifiable · ${failures} failing`,
);
process.exitCode = failures ? 1 : 0;
