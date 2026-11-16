<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DrawerTriggerProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		/** Identifies this trigger when one drawer has several. */
		value?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useDrawerContext } from './drawer.state.svelte';

	let { asChild, children, ref = $bindable(null), value, ...props }: DrawerTriggerProps = $props();

	const api = useDrawerContext();
	const attrs = $derived(api.triggerAttrs({ value }));

	$effect(() => {
		api.registerTrigger(ref, value);
		return () => api.registerTrigger(null, value);
	});
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="drawer"
	data-part="trigger"
	data-slot="drawer-trigger"
>
	{@render children?.()}
</Element>
