<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ScrollAreaCornerProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useScrollAreaContext } from './scroll-area.state.svelte';

	let {
		asChild,
		ref = $bindable(null),
		...props
	}: ScrollAreaCornerProps = $props();

	const api = useScrollAreaContext();
	const attrs = $derived(api.cornerAttrs());

	$effect(() => {
		api.registerCorner(ref);
		if (ref) api.measure();
		return () => api.registerCorner(null);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="scroll-area"
	data-part="corner"
	data-slot="scroll-area-corner"
/>
