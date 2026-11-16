<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { MenuPortalOptions } from './menu.portal.svelte';
	import type { UseMenuProps } from './menu.state.svelte';

	export interface MenuRootProps extends UseMenuProps, MenuPortalOptions {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		createMenu,
		setMenuContext,
		setMenuTriggerItemContext,
		useOptionalMenuContext
	} from './menu.state.svelte';
	import { setMenuPortal } from './menu.portal.svelte';

	let {
		'anchorPoint': anchorPoint = undefined,
		'aria-label': ariaLabel = undefined,
		children,
		closeOnEscape = undefined,
		closeOnSelect = undefined,
		composite = undefined,
		defaultHighlightedValue = undefined,
		defaultOpen = undefined,
		defaultTriggerValue = undefined,
		dir = undefined,
		finalFocusEl = undefined,
		highlightedValue = $bindable(undefined),
		id = null,
		initialFocusEl = undefined,
		lazyMount = true,
		loopFocus = undefined,
		navigate = undefined,
		onEscapeKeyDown = undefined,
		onFocusOutside = undefined,
		onHighlightChange = undefined,
		onInteractOutside = undefined,
		onOpenChange = undefined,
		onPointerDownOutside = undefined,
		onRequestDismiss = undefined,
		onSelect = undefined,
		onTriggerValueChange = undefined,
		open = $bindable(undefined),
		portalled = true,
		portalRef = undefined,
		positioning = undefined,
		triggerValue = $bindable(undefined),
		typeahead = undefined,
		unmountOnExit = true
	}: MenuRootProps = $props();

	const uid = $props.id();
	const parent = useOptionalMenuContext();

	const api = createMenu(
		() => ({
			'anchorPoint': anchorPoint,
			'aria-label': ariaLabel,
			closeOnEscape,
			closeOnSelect,
			composite,
			defaultHighlightedValue,
			defaultOpen,
			defaultTriggerValue,
			dir,
			finalFocusEl,
			highlightedValue,
			id,
			initialFocusEl,
			lazyMount,
			loopFocus,
			navigate,
			onEscapeKeyDown,
			onFocusOutside,
			onHighlightChange: (details) => {
				onHighlightChange?.(details);
				if (highlightedValue !== undefined) highlightedValue = details.highlightedValue;
			},
			onInteractOutside,
			onOpenChange: (details) => {
				onOpenChange?.(details);
				if (open !== undefined) open = details.open;
			},
			onPointerDownOutside,
			onRequestDismiss,
			onSelect,
			onTriggerValueChange: (details) => {
				onTriggerValueChange?.(details);
				if (triggerValue !== undefined) triggerValue = details.value;
			},
			open,
			positioning,
			triggerValue,
			typeahead,
			unmountOnExit
		}),
		uid
	);

	setMenuContext(api);
	setMenuPortal({ portalled: () => portalled, portalRef: () => portalRef ?? undefined });

	if (parent) {
		api.setParent(parent);
		parent.setChild(api);
		setMenuTriggerItemContext(() => parent.getTriggerItemAttrs(api));
		onDestroy(() => parent.removeChild(api.rootId));
	}
</script>

{@render children?.()}
