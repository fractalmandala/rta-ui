---
title: Steps
component: steps
description: Walk users through a multi-step task with progress and validation.
---

# Steps

Walk users through a multi-step task with progress and validation.

Port of `moduix/packages/svelte/src/components/steps` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Steps } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Steps` | `Steps.svelte` | `—` |
| `StepsCompletedContent` | `StepsCompletedContent.svelte` | `—` |
| `StepsContent` | `StepsContent.svelte` | `—` |
| `StepsIndicator` | `StepsIndicator.svelte` | `—` |
| `StepsItem` | `StepsItem.svelte` | `—` |
| `StepsList` | `StepsList.svelte` | `—` |
| `StepsNextTrigger` | `StepsNextTrigger.svelte` | `—` |
| `StepsPrevTrigger` | `StepsPrevTrigger.svelte` | `—` |
| `StepsProgress` | `StepsProgress.svelte` | `—` |
| `StepsRootProvider` | `StepsRootProvider.svelte` | `—` |
| `StepsSeparator` | `StepsSeparator.svelte` | `—` |
| `StepsTrigger` | `StepsTrigger.svelte` | `—` |

ARIA roles rendered by this family: `progressbar`, `tab`, `tablist`, `tabpanel`.

## Props

### `Steps` — `StepsRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseStepsProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `count` | `number` | — | from `UseStepsProps` |
| `step` | `number` | — | bindable from `UseStepsProps` |
| `defaultStep` | `number` | — | from `UseStepsProps` |
| `linear` | `boolean` | — | from `UseStepsProps` |
| `orientation` | `'horizontal' \| 'vertical'` | — | from `UseStepsProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseStepsProps` |
| `id` | `string \| null` | — | from `UseStepsProps` |
| `isStepValid` | `(index: number) => boolean` | — | from `UseStepsProps` |
| `isStepSkippable` | `(index: number) => boolean` | — | from `UseStepsProps` |
| `onStepChange` | `(details: StepChangeDetails) => void` | — | from `UseStepsProps` |
| `onStepComplete` | `() => void` | — | from `UseStepsProps` |
| `onStepInvalid` | `(details: StepInvalidDetails) => void` | — | from `UseStepsProps` |

### `StepsContent` — `StepsContentProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | — |  |

### `StepsItem` — `StepsItemProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | — |  |

### `StepsRootProvider` — `StepsRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `StepsApi` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Steps` | `steps` | `root` | `steps-root` |
| `StepsCompletedContent` | `steps` | `content` | `steps-completed-content` |
| `StepsContent` | `steps` | `content` | `steps-content` |
| `StepsIndicator` | `steps` | `indicator` | `steps-indicator` |
| `StepsItem` | `steps` | `item` | `steps-item` |
| `StepsList` | `steps` | `list` | `steps-list` |
| `StepsNextTrigger` | `steps` | `next-trigger` | `steps-next-trigger` |
| `StepsPrevTrigger` | `steps` | `prev-trigger` | `steps-prev-trigger` |
| `StepsProgress` | `steps` | `progress` | `steps-progress` |
| `StepsRootProvider` | `steps` | `root` | `steps-root-provider` |
| `StepsSeparator` | `steps` | `separator` | `steps-separator` |
| `StepsTrigger` | `steps` | `trigger` | `steps-trigger` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-steps-gap` | `var(--moduix-spacing-4)` |
| `--moduix-steps-indicator-size` | `var(--moduix-spacing-8)` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `steps:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		Steps,
		StepsContent,
		StepsIndicator,
		StepsItem,
		StepsList,
		StepsNextTrigger,
		StepsPrevTrigger,
		StepsSeparator,
		StepsTrigger
	} from 'rta-ui';

	const items = ['Account', 'Profile', 'Billing'];
</script>

<Steps count={items.length}>
	<StepsList>
		{#each items as item, index (item)}
			<StepsItem {index}>
				<StepsTrigger>
					<StepsIndicator />
					<span>{item}</span>
				</StepsTrigger>
				<StepsSeparator />
			</StepsItem>
		{/each}
	</StepsList>
	{#each items as item, index (item)}
		<StepsContent {index}>{item} settings.</StepsContent>
	{/each}
	<StepsPrevTrigger>Back</StepsPrevTrigger>
	<StepsNextTrigger>Next</StepsNextTrigger>
</Steps>
```

## Behaviour covered by tests

- renders the Ark contract
- next and prev triggers move through steps
- non-linear triggers jump directly, linear triggers do not

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
