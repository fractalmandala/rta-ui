<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DrawerTitleProps
		extends HTMLProps<'h2'>,
			PolymorphicProps<'h2'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Drawer.module.css';
	import { useDrawerContext } from './drawer.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: DrawerTitleProps =
		$props();

	const api = useDrawerContext();
	const attrs = $derived(api.titleAttrs());

	$effect(() => {
		api.markRendered('title', true);
		return () => api.markRendered('title', false);
	});
</script>

<Element
	as="h2"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="drawer"
	data-part="title"
	data-slot="drawer-title"
	class={cn(styles.title, className)}
>
	{@render children?.()}
</Element>
