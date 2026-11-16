# Third-party notices

rta-ui has no runtime dependencies beyond `svelte` (a peer dependency). Parts of its source are
derived from earlier work:

## moduix (`packages/svelte`)

Component structure, CSS Modules stylesheets, design tokens, and accessibility label strings are
ported from moduix, the author's own component system. MIT licensed.

## Ark UI (`@ark-ui/svelte`)

The public part naming (`data-scope`, `data-part`, `data-state`, …), the `asChild` snippet contract,
and the prop-merging rules in `src/lib/internal/mergeProps.ts` follow Ark UI's platform conventions so
that Ark-keyed stylesheets apply unchanged. Ark UI is MIT licensed; no Ark code is bundled — the
runtime is reimplemented with Svelte 5 runes and attachments.
