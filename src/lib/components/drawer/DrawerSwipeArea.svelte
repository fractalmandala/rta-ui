<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { DrawerSwipeDirection } from './drawer.session';

	export interface DrawerSwipeAreaProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		/** Turns the edge region off without unmounting it. */
		disabled?: boolean;
		/** Direction that opens the drawer. Defaults to the opposite of `swipeDirection`. */
		swipeDirection?: DrawerSwipeDirection;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Drawer.module.css';
	import { useDrawerContext } from './drawer.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled = false,
		ref = $bindable(null),
		swipeDirection,
		...props
	}: DrawerSwipeAreaProps = $props();

	const api = useDrawerContext();
	const attrs = $derived(api.swipeAreaAttrs({ disabled, swipeDirection }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="drawer"
	data-part="swipe-area"
	data-slot="drawer-swipe-area"
	class={cn(styles.swipeArea, className)}
>
	{@render children?.()}
</Element>
