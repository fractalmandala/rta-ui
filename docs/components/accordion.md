---
title: Accordion
component: accordion
description: Stack sections that open and close to show related content.
---

# Accordion

Stack sections that open and close to show related content.

Port of `moduix/packages/svelte/src/components/accordion` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Parts

| export | file |
| --- | --- |
| `Accordion` | `Accordion.svelte` |
| `AccordionItem` | `AccordionItem.svelte` |
| `AccordionItemBody` | `AccordionItemBody.svelte` |
| `AccordionItemContent` | `AccordionItemContent.svelte` |
| `AccordionItemIndicator` | `AccordionItemIndicator.svelte` |
| `AccordionItemTrigger` | `AccordionItemTrigger.svelte` |
| `AccordionRootProvider` | `AccordionRootProvider.svelte` |

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

Custom properties read by this family’s CSS Module:

- `--moduix-accordion-icon-size`
- `--moduix-accordion-item-body-gap`
- `--moduix-accordion-item-body-padding`
- `--moduix-accordion-item-border-color`
- `--moduix-accordion-item-content-color`
- `--moduix-accordion-item-content-font-size`
- `--moduix-accordion-trigger-bg-hover`
- `--moduix-accordion-trigger-font-size`
- `--moduix-accordion-trigger-gap`
- `--moduix-accordion-trigger-padding-x`
- `--moduix-accordion-trigger-padding-y`

## Generated ids

- `accordion:${id}`
- `accordion:${id}:item:${id}`
- `accordion:${id}:item:${id}:content`
- `accordion:${id}:item:${id}:trigger`

Every id is overridable through the `ids` prop.

## Usage

The gallery demo, verbatim:

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
