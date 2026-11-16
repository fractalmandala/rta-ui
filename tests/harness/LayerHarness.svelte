<script lang="ts">
	import {
		useDismissableLayer,
		useEscapeLayer,
		useFocusScope,
		useScrollLock
	} from '../../src/lib/internal/layers.svelte';

	let {
		open = false,
		trapFocus = false,
		lockScroll = false,
		onEscape,
		onPointerDownOutside,
		onFocusOutside,
		onInteractOutside
	}: {
		open?: boolean;
		trapFocus?: boolean;
		lockScroll?: boolean;
		onEscape?: (event: KeyboardEvent) => void;
		onPointerDownOutside?: (event: Event) => void;
		onFocusOutside?: (event: Event) => void;
		onInteractOutside?: (event: Event) => void;
	} = $props();

	let node = $state<HTMLElement | null>(null);

	useEscapeLayer({
		enabled: () => open,
		onEscape: (event) => onEscape?.(event)
	});

	useDismissableLayer({
		enabled: () => open,
		getNode: () => node,
		onPointerDownOutside: (event) => onPointerDownOutside?.(event),
		onFocusOutside: (event) => onFocusOutside?.(event),
		onInteractOutside: (event) => onInteractOutside?.(event)
	});

	useFocusScope({
		enabled: () => open && trapFocus,
		getNode: () => node
	});

	useScrollLock(() => open && lockScroll);
</script>

<div bind:this={node} data-testid="layer" tabindex="-1">
	<button type="button" data-testid="layer-button">first</button>
	<button type="button">second</button>
</div>
