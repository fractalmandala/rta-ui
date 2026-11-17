---
title: Accordion
component: accordion
description: Stack sections that open and close to show related content.
---

# Accordion

Stack sections that open and close to show related content.

Port of `moduix/packages/svelte/src/components/accordion` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Accordion } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Accordion` | `Accordion.svelte` | `—` |
| `AccordionItem` | `AccordionItem.svelte` | `—` |
| `AccordionItemBody` | `AccordionItemBody.svelte` | `—` |
| `AccordionItemContent` | `AccordionItemContent.svelte` | `region` |
| `AccordionItemIndicator` | `AccordionItemIndicator.svelte` | `none (aria-hidden)` |
| `AccordionItemTrigger` | `AccordionItemTrigger.svelte` | `—` |
| `AccordionRootProvider` | `AccordionRootProvider.svelte` | `—` |

ARIA roles rendered by this family: `region`.

## Props

### `Accordion` — `AccordionRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseAccordionProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string[]` | — | Controlled expanded item values. bindable from `UseAccordionProps` |
| `defaultValue` | `string[]` | — | from `UseAccordionProps` |
| `onValueChange` | `(details: AccordionValueChangeDetails) => void` | — | from `UseAccordionProps` |
| `onFocusChange` | `(details: AccordionFocusChangeDetails) => void` | — | from `UseAccordionProps` |
| `multiple` | `boolean` | — | Allow several items to be open at once. from `UseAccordionProps` |
| `collapsible` | `boolean` | — | Allow an open item to be collapsed again. from `UseAccordionProps` |
| `disabled` | `boolean` | — | from `UseAccordionProps` |
| `orientation` | `'horizontal' \| 'vertical'` | — | from `UseAccordionProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseAccordionProps` |
| `id` | `string \| null` | — | from `UseAccordionProps` |
| `ids` | `{
		root?: string;
		item?: (value: string) => string;
		itemTrigger?: (value: string) => string;
		itemContent?: (value: string) => string;
	}` | — | from `UseAccordionProps` |

### `AccordionItem` — `AccordionItemProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `disabled` | `boolean` | — |  |

### `AccordionRootProvider` — `AccordionRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `AccordionApi` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Accordion` | `accordion` | `root` | `accordion-root` |
| `AccordionItem` | `accordion` | `item` | `accordion-item` |
| `AccordionItemBody` | `accordion` | `item-body` | `accordion-item-body` |
| `AccordionItemContent` | `accordion` | `item-content` | `accordion-item-content` |
| `AccordionItemIndicator` | `accordion` | `item-indicator` | `accordion-item-indicator` |
| `AccordionItemTrigger` | `accordion` | `item-trigger` | `accordion-item-trigger` |
| `AccordionRootProvider` | `accordion` | `root` | `accordion-root-provider` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-accordion-icon-size` | `var(--moduix-spacing-3)` |
| `--moduix-accordion-item-body-gap` | `var(--moduix-spacing-3)` |
| `--moduix-accordion-item-body-padding` | `var(--moduix-spacing-3)` |
| `--moduix-accordion-item-border-color` | `var(--moduix-border)` |
| `--moduix-accordion-item-content-color` | `var(--moduix-muted-foreground)` |
| `--moduix-accordion-item-content-font-size` | `var(--moduix-text-md)` |
| `--moduix-accordion-trigger-bg-hover` | `var(--moduix-muted)` |
| `--moduix-accordion-trigger-font-size` | `var(--moduix-text-md)` |
| `--moduix-accordion-trigger-gap` | `var(--moduix-spacing-4)` |
| `--moduix-accordion-trigger-padding-x` | `var(--moduix-spacing-3)` |
| `--moduix-accordion-trigger-padding-y` | `var(--moduix-spacing-2)` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `accordion:${id}`
- `accordion:${id}:item:${id}`
- `accordion:${id}:item:${id}:content`
- `accordion:${id}:item:${id}:trigger`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		AccordionItemContent,
		AccordionItemIndicator,
		AccordionItemTrigger
	} from 'rta-ui';

	const items = [
		{ value: 'a', title: 'Install', body: 'pnpm add rta-ui' },
		{ value: 'b', title: 'Import', body: "import { Button } from 'rta-ui'" },
		{ value: 'c', title: 'Style', body: 'Bring your own CSS or use the shipped modules.' }
	];
</script>

<Accordion defaultValue={['a']}>
	{#each items as item (item.value)}
		<AccordionItem value={item.value}>
			<AccordionItemTrigger>
				{item.title}
				<AccordionItemIndicator />
			</AccordionItemTrigger>
			<AccordionItemContent>{item.body}</AccordionItemContent>
		</AccordionItem>
	{/each}
</Accordion>
```

## Behaviour covered by tests

- renders the ark contract
- opening a second item closes the first unless multiple
- keeps both open when multiple
- stays open when collapsible is false
- collapses the open item by default
- ignores clicks on disabled items
- moves focus with arrow keys
- marks the focused item

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
