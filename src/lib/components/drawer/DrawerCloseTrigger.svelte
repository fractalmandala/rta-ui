<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DrawerCloseTriggerProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useDrawerContext } from './drawer.state.svelte';

	let {
		asChild,
		children,
		ref = $bindable(null),
		...props
	}: DrawerCloseTriggerProps = $props();

	const api = useDrawerContext();
	const attrs = $derived(api.closeTriggerAttrs());

	$effect(() => {
		api.registerCloseTrigger(ref);
		return () => api.registerCloseTrigger(null);
	});
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="drawer"
	data-part="close-trigger"
	data-slot="drawer-close-trigger"
>
	{@render children?.()}
</Element>
