<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DrawerDescriptionProps
		extends HTMLProps<'p'>,
			PolymorphicProps<'p'>,
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
	}: DrawerDescriptionProps = $props();

	const api = useDrawerContext();
	const attrs = $derived(api.descriptionAttrs());

	$effect(() => {
		api.markRendered('description', true);
		return () => api.markRendered('description', false);
	});
</script>

<Element
	as="p"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="drawer"
	data-part="description"
	data-slot="drawer-description"
	class={cn(styles.description, className)}
>
	{@render children?.()}
</Element>
