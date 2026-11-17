---
title: Tabs
component: tabs
description: Switch between related panels in one area of the page.
---

# Tabs

Switch between related panels in one area of the page.

Port of `moduix/packages/svelte/src/components/tabs` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Tabs } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Tabs` | `Tabs.svelte` | `—` |
| `TabsContent` | `TabsContent.svelte` | `tabpanel` |
| `TabsIndicator` | `TabsIndicator.svelte` | `—` |
| `TabsList` | `TabsList.svelte` | `tablist` |
| `TabsRootProvider` | `TabsRootProvider.svelte` | `—` |
| `TabsTrigger` | `TabsTrigger.svelte` | `tab` |

ARIA roles rendered by this family: `tab`, `tablist`, `tabpanel`.

## Props

### `Tabs` — `TabsRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseTabsProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | bindable from `UseTabsProps` |
| `defaultValue` | `string \| null` | — | from `UseTabsProps` |
| `onValueChange` | `(details: TabsValueChangeDetails) => void` | — | from `UseTabsProps` |
| `onFocusChange` | `(details: TabsFocusChangeDetails) => void` | — | from `UseTabsProps` |
| `orientation` | `'horizontal' \| 'vertical'` | — | from `UseTabsProps` |
| `activationMode` | `'automatic' \| 'manual'` | — | from `UseTabsProps` |
| `loopFocus` | `boolean` | — | from `UseTabsProps` |
| `composite` | `boolean` | — | from `UseTabsProps` |
| `deselectable` | `boolean` | — | from `UseTabsProps` |
| `translations` | `{ listLabel?: string }` | — | from `UseTabsProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseTabsProps` |
| `id` | `string \| null` | — | from `UseTabsProps` |
| `ids` | `{
		root?: string;
		list?: string;
		trigger?: (value: string) => string;
		content?: (value: string) => string;
		indicator?: string;
	}` | — | from `UseTabsProps` |
| `variant` | `TabsVariant` | `'default'` |  |
| `size` | `TabsSize` | `'md'` |  |
| `fitted` | `boolean` | — |  |

### `TabsContent` — `TabsContentProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |

### `TabsRootProvider` — `TabsRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `TabsApi` | — |  |
| `variant` | `TabsVariant` | `'default'` |  |
| `size` | `TabsSize` | `'md'` |  |
| `fitted` | `boolean` | — |  |

### `TabsTrigger` — `TabsTriggerProps`
accepts the native props of `HTMLProps<'button'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `disabled` | `boolean` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Tabs` | `tabs` | `root` | `tabs-root` |
| `TabsContent` | `tabs` | `content` | `tabs-content` |
| `TabsIndicator` | `tabs` | `indicator` | `tabs-indicator` |
| `TabsList` | `tabs` | `list` | `tabs-list` |
| `TabsRootProvider` | `tabs` | `root` | `tabs-root-provider` |
| `TabsTrigger` | `tabs` | `trigger` | `tabs-trigger` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-tabs-bg` | `var(--moduix-background)` |
| `--moduix-tabs-border-color` | `var(--moduix-border)` |
| `--moduix-tabs-indicator-bg` | `var(--moduix-background)` |
| `--moduix-tabs-list-bg` | `var(--moduix-muted)` |
| `--moduix-tabs-list-border-color` | `var(--moduix-border)` |
| `--moduix-tabs-tab-color` | `var(--moduix-muted-foreground)` |
| `--moduix-tabs-tab-color-active` | `var(--moduix-foreground)` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `tabs:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from 'rta-ui';
</script>

<Tabs defaultValue="overview" variant="line">
	<TabsList>
		<TabsTrigger value="overview">Overview</TabsTrigger>
		<TabsTrigger value="api">API</TabsTrigger>
		<TabsTrigger value="a11y" disabled>Accessibility</TabsTrigger>
		<TabsIndicator />
	</TabsList>
	<TabsContent value="overview">Composable parts, zero runtime dependencies.</TabsContent>
	<TabsContent value="api">Every part accepts native element props.</TabsContent>
	<TabsContent value="a11y">Roving tabindex and arrow keys.</TabsContent>
</Tabs>
```

## Behaviour covered by tests

- renders the ark contract
- clicking a trigger selects it and reports the value
- disabled triggers cannot be selected
- arrow keys move focus and auto-activate
- manual activation mode moves focus only
- vertical orientation ignores horizontal arrows
- Home and End jump to the first and last enabled trigger

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
