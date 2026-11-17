# rta ui

Published as `rta-ui` — npm package names cannot contain spaces.

Dependency-free Svelte 5 components. No Ark UI, no TanStack, no class-name helper packages — at
runtime the only import is `svelte`.

- **Ark-compatible parts.** Every component emits `data-scope` / `data-part` / `data-state` /
  `data-size` hooks plus a `data-slot="<family>-root"` styling hook, so stylesheets keyed on Ark
  parts apply unchanged.
- **Flat public API.** The family name is the root component and every other public part is
  prefixed with it: `Card`, `CardHeader`, `CardBody`, `CardFooter`.
- **CSS Modules styling.** Each family owns a `*.module.css` compiled at build time; design tokens
  and presets are plain CSS you import once.

## Install

```sh
pnpm add rta-ui
```

## Use

```svelte
<script lang="ts">
  import 'rta-ui/style.css';
  import { Button, Card, CardBody, CardHeader, CardTitle } from 'rta-ui';
</script>

<Card>
  <CardHeader><CardTitle>Field notes</CardTitle></CardHeader>
  <CardBody><Button>Open</Button></CardBody>
</Card>
```

Import a single family for smaller bundles:

```svelte
<script lang="ts">
  import { Button } from 'rta-ui/button';
</script>
```

## `asChild`

Any component can hand its element to a child instead of rendering its own. The snippet receives a
`merge` function; spread its result last so the component's props, classes and event handlers land
on the composed element:

```svelte
{#snippet asChild(merge)}
  <a href="/docs" {...merge({ class: 'link' })}>Docs</a>
{/snippet}

<Button {asChild}>Docs</Button>
```

## Components (87)

**Pure:** alert, aspect-ratio, avatar, badge, bleed, breadcrumbs, button, card, close-button, container,
empty, heading, highlight, image, input, input-group, kbd, list, marquee, progress-circular,
progress-linear, separator, simple-grid, skeleton, spinner, stack, swap, table, tag, text,
textarea, typeset

**Behavioral:** accordion, angle-slider, checkbox, clipboard, collapsible, editable, field, fieldset, native-
select, number-input, pagination, password-input, pin-input, qr-code, radio-group, rating-
group, scroll-area, segment-group, signature-pad, slider, splitter, steps, switch, tabs, tags-
input, timer, toggle, toggle-group

**Overlays:** command-palette, dialog, drawer, floating-panel, hover-card, lightbox, menu, navigation-menu,
popover, sidebar, split-button, toast, tooltip, tour

**Collections:** combobox, json-tree-view, listbox, select, toc, tree-view

**Data and media:** carousel, color-picker, date-input, date-picker, file-upload, image-cropper

Plus the internal `Element` primitive behind all of them, and the shared `src/lib/internal`
foundation they build on: positioning (`position.ts`, `positioning.svelte.ts`), presence, portal,
overlay layers (escape, outside dismissal, focus scope, scroll lock, aria-hidden), collections and
typeahead, and civil-date arithmetic.

## Documentation

There is a docs site at `/docs`: a sidebar of every component, grouped like the gallery, with one
page per family. Each page opens with **live examples** — the gallery demo rendered in place, then a
variation grid for every enum prop the root exposes (`variant`, `size`, `orientation`, …) — followed
by the reference: anatomy and roles, every prop with type and default, styling hooks, CSS variables
with their defaults, generated ids, keyboard, the example source, and the behaviours the tests
assert.

The pages are generated from the source, so they cannot drift:

```sh
pnpm docs        # regenerate docs/components/* and docs/examples.json
pnpm docs:check  # fail if any committed page is stale
```

`tests/docs-coverage.test.ts` fails when a family has no page, when a page misses a part its barrel
exports, or when a page has lost its styling-hook or parity section; `pnpm docs:check` proves the
pages are byte-identical to what the current source generates.

## Structure

```
src/lib/components/<family>/   component, parts, CSS Module, index.ts
src/lib/internal/              Element, cn, mergeProps, icons, labels, types
src/lib/styles/                tokens and reset, copied to dist/styles
src/lib/presets/               theme presets, copied to dist/presets
src/routes/                    SvelteKit 3 gallery, prerendered to build/ (not published)
tests/                         contract, part, behavior and accessibility tests
```

`#lib` resolves to `src/lib/index.ts` through the package `imports` map, the SvelteKit 3 alias
replacement for `$lib`.

## SvelteKit 3

The gallery is a SvelteKit 3 app. Kit 3 keeps its config inside the `sveltekit()` Vite plugin —
there is no `svelte.config.js` (its presence is a build error) — and `$lib` is gone in favour of
the `#lib` imports map. The library itself is still built by `svelte-package`, which reads the same
`vite.config.ts`.

## Scripts

```sh
pnpm dev         # gallery at localhost:5173
pnpm build       # library: svelte-package + copied styles
pnpm build:docs  # prerendered static gallery in build/
pnpm preview     # serve build/
pnpm check       # svelte-check, warnings fail
pnpm test        # vitest + jsdom
pnpm parity      # data-scope/part/slot parity against the sibling moduix checkout
pnpm docs        # regenerate the per-component pages and the variation manifest
pnpm docs:check  # fail when a committed page no longer matches its source
                 # (set RTA_PARITY_REFERENCE to point elsewhere; exits 2 if it is missing)
```

## Verification in this repository

```sh
pnpm check && pnpm test && pnpm docs:check && pnpm parity && pnpm build && pnpm build:docs
```

## Known gaps

- **`chart` is not ported.** moduix's chart is a host for the TanStack mark DSL, and this package
  refuses that dependency, so the family is omitted rather than shipped as a lookalike.
- **`date-picker` / `date-input`** support the Gregorian calendar and the runtime time zone only.
- **`drawer`** does not implement nested drawers, so the `--nested-drawers` CSS blocks stay inert.
- **`carousel`** translates a clipped track instead of using native scroll snapping, so `snapType`
  is emitted for parity but has no scroll container to act on.
- The committed tests are jsdom. Overlay placement, flip, escape ordering, modal scroll locking and
  the native select mirror were additionally verified by hand against a real browser during
  development; there is no committed browser suite yet.
