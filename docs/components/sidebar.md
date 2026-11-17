---
title: Sidebar
component: sidebar
description: Build app navigation that resizes and collapses to icons.
---

# Sidebar

Build app navigation that resizes and collapses to icons.

Port of `moduix/packages/svelte/src/components/sidebar` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Parts

| export | file |
| --- | --- |
| `Sidebar` | `Sidebar.svelte` |
| `SidebarCollapsedContent` | `SidebarCollapsedContent.svelte` |
| `SidebarContent` | `SidebarContent.svelte` |
| `SidebarExpandedContent` | `SidebarExpandedContent.svelte` |
| `SidebarFooter` | `SidebarFooter.svelte` |
| `SidebarGroup` | `SidebarGroup.svelte` |
| `SidebarGroupAction` | `SidebarGroupAction.svelte` |
| `SidebarGroupHeader` | `SidebarGroupHeader.svelte` |
| `SidebarGroupLabel` | `SidebarGroupLabel.svelte` |
| `SidebarHeader` | `SidebarHeader.svelte` |
| `SidebarInput` | `SidebarInput.svelte` |
| `SidebarInset` | `SidebarInset.svelte` |
| `SidebarLabel` | `SidebarLabel.svelte` |
| `SidebarNavigationBadge` | `SidebarNavigationBadge.svelte` |
| `SidebarNavigationButton` | `SidebarNavigationButton.svelte` |
| `SidebarNavigationItem` | `SidebarNavigationItem.svelte` |
| `SidebarNavigationList` | `SidebarNavigationList.svelte` |
| `SidebarNavigationSubButton` | `SidebarNavigationSubButton.svelte` |
| `SidebarNavigationSubItem` | `SidebarNavigationSubItem.svelte` |
| `SidebarNavigationSubList` | `SidebarNavigationSubList.svelte` |
| `SidebarPanel` | `SidebarPanel.svelte` |
| `SidebarRail` | `SidebarRail.svelte` |
| `SidebarResizeTrigger` | `SidebarResizeTrigger.svelte` |
| `SidebarRootProvider` | `SidebarRootProvider.svelte` |
| `SidebarSeparator` | `SidebarSeparator.svelte` |
| `SidebarTooltip` | `SidebarTooltip.svelte` |
| `SidebarTrigger` | `SidebarTrigger.svelte` |

`SidebarRootProvider` renders no element of its own: it creates the state and provides it to the other parts.

## Props

### `Sidebar` — `SidebarRootProps`
adds to `Omit<SplitterRootProps, 'defaultSize' | 'id' | 'orientation' | 'panels' | 'size'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `defaultSize` | `Array<number \| string>` | — | Widths of the two panels, sidebar first on the left. |
| `size` | `Array<number \| string>` | — | bindable |
| `panelId` | `string` | `'sidebar'` | Id of the sidebar panel inside the splitter. |
| `side` | `SidebarSide` | `'left'` |  |
| `collapsible` | `SidebarCollapsible` | `'icon'` | `offcanvas` slides away, `icon` keeps an icon rail, `none` pins the sidebar open. |
| `open` | `boolean` | — | bindable |
| `defaultOpen` | `boolean` | — |  |
| `onOpenChange` | `(details: SidebarOpenChangeDetails) => void` | — |  |
| `keyboardShortcut` | `string \| false` | — | Shortcut that toggles the sidebar, `mod+b` by default. `false` disables it. |
| `persist` | `boolean` | `false` |  |
| `persistKey` | `string` | — |  |
| `mobile` | `boolean` | — | Force the mobile sheet layout instead of checking the viewport width. |
| `mobileBreakpoint` | `number` | — |  |
| `width` | `string` | — |  |
| `height` | `string` | — |  |
| `widthIcon` | `string` | — |  |
| `widthMobile` | `string` | — |  |
| `triggerOffsetY` | `string` | — |  |
| `id` | `string \| null` | — |  |

### `SidebarNavigationButton` — `SidebarNavigationButtonProps`
accepts the native props of `HTMLProps<'button'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `active` | `boolean` | `false` |  |
| `size` | `SidebarNavigationButtonSize` | `'md'` |  |

### `SidebarNavigationSubButton` — `SidebarNavigationSubButtonProps`
accepts the native props of `HTMLProps<'a'>`, `PolymorphicProps<'a'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `active` | `boolean` | `false` |  |

### `SidebarPanel` — `SidebarPanelProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `mobileTitle` | `string` | — | Heading of the mobile sheet, which has no other label. |

### `SidebarResizeTrigger` — `SidebarResizeTriggerProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string` | — |  |
| `disabled` | `boolean` | `false` |  |

### `SidebarRootProvider` — `SidebarRootProviderProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `SidebarApi` | — |  |
| `splitter` | `SplitterApi` | — | Splitter api behind the panels, when the consumer created its own. |
| `children` | `Snippet` | — |  |

### `SidebarTooltip` — `SidebarTooltipProps`
adds to `Omit<TooltipRootProps, 'children' | 'disabled' | 'positioning'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `Snippet<[PropsFn<'button'>]>` | — | Renders the trigger element; only shown while the sidebar is collapsed. |
| `content` | `string \| number \| Snippet` | — |  |
| `positioning` | `PositionOptions` | — |  |
| `openDelay` | `number` | `200` |  |
| `closeDelay` | `number` | `0` |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Sidebar` | `sidebar` | `root` | `sidebar-root` |
| `SidebarCollapsedContent` | `sidebar` | `collapsed-content` | `sidebar-collapsed-content` |
| `SidebarContent` | `sidebar` | `content` | `sidebar-content` |
| `SidebarExpandedContent` | `sidebar` | `expanded-content` | `sidebar-expanded-content` |
| `SidebarFooter` | `sidebar` | `footer` | `sidebar-footer` |
| `SidebarGroup` | `sidebar` | `group` | `sidebar-group` |
| `SidebarGroupAction` | `sidebar` | `group-action` | `sidebar-group-action` |
| `SidebarGroupHeader` | `sidebar` | `group-header` | `sidebar-group-header` |
| `SidebarGroupLabel` | `sidebar` | `group-label` | `sidebar-group-label` |
| `SidebarHeader` | `sidebar` | `header` | `sidebar-header` |
| `SidebarInput` | `—` | `—` | `sidebar-input` |
| `SidebarInset` | `sidebar` | `inset` | `sidebar-inset` |
| `SidebarLabel` | `sidebar` | `label` | `sidebar-label` |
| `SidebarNavigationBadge` | `sidebar` | `navigation-badge` | `sidebar-navigation-badge` |
| `SidebarNavigationButton` | `sidebar` | `navigation-button` | `sidebar-navigation-button` |
| `SidebarNavigationItem` | `sidebar` | `navigation-item` | `sidebar-navigation-item` |
| `SidebarNavigationList` | `sidebar` | `navigation-list` | `sidebar-navigation-list` |
| `SidebarNavigationSubButton` | `sidebar` | `navigation-sub-button` | `sidebar-navigation-sub-button` |
| `SidebarNavigationSubItem` | `sidebar` | `navigation-sub-item` | `sidebar-navigation-sub-item` |
| `SidebarNavigationSubList` | `sidebar` | `navigation-sub-list` | `sidebar-navigation-sub-list` |
| `SidebarPanel` | `sidebar` | `panel` | `sidebar-panel` |
| `SidebarRail` | `sidebar` | `rail` | `sidebar-rail` |
| `SidebarResizeTrigger` | `sidebar` | `resize-trigger` | `sidebar-resize-trigger` |
| `SidebarSeparator` | `—` | `—` | `sidebar-separator` |
| `SidebarTrigger` | `sidebar` | `trigger` | `sidebar-trigger` |

Custom properties read by this family’s CSS Module:

- `--moduix-sidebar`
- `--moduix-sidebar-accent`
- `--moduix-sidebar-accent-foreground`
- `--moduix-sidebar-border`
- `--moduix-sidebar-foreground`
- `--moduix-sidebar-ring`
- `--moduix-sidebar-trigger-offset-y`

## Generated ids

- `sidebar:${id}`

Every id is overridable through the `ids` prop.

## Usage

The gallery demo, verbatim:

```svelte
<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import {
		Sidebar,
		SidebarCollapsedContent,
		SidebarContent,
		SidebarExpandedContent,
		SidebarFooter,
		SidebarGroup,
		SidebarGroupAction,
		SidebarGroupHeader,
		SidebarGroupLabel,
		SidebarHeader,
		SidebarInset,
		SidebarLabel,
		SidebarNavigationBadge,
		SidebarNavigationButton,
		SidebarNavigationItem,
		SidebarNavigationList,
		SidebarPanel,
		SidebarRail,
		SidebarResizeTrigger,
		SidebarSeparator,
		SidebarTooltip,
		SidebarTrigger
	} from 'rta-ui';

	const items = [
		{ value: 'inbox', label: 'Inbox', icon: '▤' },
		{ value: 'reports', label: 'Reports', icon: '▦', badge: '4' },
		{ value: 'settings', label: 'Settings', icon: '⚙' }
	];

	let active = $state('inbox');
</script>

<div style="height: 24rem; border: 1px solid var(--moduix-sidebar-border); border-radius: var(--moduix-radius-lg); overflow: hidden">
	<Sidebar defaultOpen collapsible="icon" aria-label="Workspace navigation">
		<SidebarPanel mobileTitle="Navigation">
			<SidebarHeader>
				<SidebarLabel>Acme</SidebarLabel>
				<SidebarTrigger aria-label="Toggle navigation" />
			</SidebarHeader>
			<SidebarContent>
				<SidebarCollapsedContent>
					<SidebarNavigationList aria-label="Icons">
						{#each items as item (item.value)}
							<SidebarNavigationItem>
								<SidebarNavigationButton
									active={active === item.value}
									onclick={() => (active = item.value)}
								>
									<span data-sidebar-icon>{item.icon}</span>
								</SidebarNavigationButton>
							</SidebarNavigationItem>
						{/each}
					</SidebarNavigationList>
				</SidebarCollapsedContent>
				<SidebarExpandedContent>
					<SidebarGroup>
						<SidebarGroupHeader>
							<SidebarGroupLabel>Workspace</SidebarGroupLabel>
							<SidebarGroupAction aria-label="Add workspace">+</SidebarGroupAction>
						</SidebarGroupHeader>
						<SidebarNavigationList aria-label="Main">
							{#each items as item (item.value)}
								<SidebarNavigationItem>
									<SidebarTooltip content={item.label}>
										{#snippet children(triggerProps)}
											{@const merged = triggerProps() as HTMLButtonAttributes}
											<SidebarNavigationButton
												{...merged}
												active={active === item.value}
												onclick={() => (active = item.value)}
											>
												<span data-sidebar-icon>{item.icon}</span>
												<span>{item.label}</span>
												{#if item.badge}
													<SidebarNavigationBadge>{item.badge}</SidebarNavigationBadge>
												{/if}
											</SidebarNavigationButton>
										{/snippet}
									</SidebarTooltip>
								</SidebarNavigationItem>
							{/each}
						</SidebarNavigationList>
					</SidebarGroup>
					<SidebarSeparator />
				</SidebarExpandedContent>
			</SidebarContent>
			<SidebarFooter>
				<SidebarRail>Rail</SidebarRail>
			</SidebarFooter>
			<SidebarResizeTrigger />
		</SidebarPanel>
		<SidebarInset>
			<p style="padding: var(--moduix-spacing-4)">Selected page: {active}</p>
		</SidebarInset>
	</Sidebar>
</div>
```

## Behaviour covered by tests

- emits the ark-style root, trigger and panel contract
- :
- toggles between expanded and collapsed from the trigger
- toggles from the rail and the mod+b shortcut
- ignores the shortcut inside an editable field and when disabled
- persists the open state to the sidebar cookie
- keeps the sidebar pinned when collapsible is none
- marks the active navigation item with data-active and aria-current
- only shows item tooltips while collapsed
- renders the sidebar in a dialog sheet on mobile

## Notes

- **Parity:** accepted deviation — The cookie input, the edge rail and the separator are upstream internals; here they are public parts so a sidebar can be composed explicitly.
  Extra slots: `sidebar-input`, `sidebar-rail`, `sidebar-separator`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
