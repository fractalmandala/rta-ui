<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DrawerGrabberIndicatorProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Drawer.module.css';
	import { useDrawerContext } from './drawer.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: DrawerGrabberIndicatorProps = $props();

	const api = useDrawerContext();
	const attrs = $derived(api.grabberIndicatorAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="drawer"
	data-part="grabber-indicator"
	data-slot="drawer-grabber-indicator"
	class={cn(styles.grabberIndicator, className)}
>
	{@render children?.()}
</Element>
