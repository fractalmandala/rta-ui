<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ScrollAreaContentProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useScrollAreaContext } from './scroll-area.state.svelte';

	let {
		asChild,
		children,
		ref = $bindable(null),
		...props
	}: ScrollAreaContentProps = $props();

	const api = useScrollAreaContext();
	const attrs = $derived(api.contentAttrs());

	$effect(() => {
		api.registerContent(ref);
		return () => api.registerContent(null);
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
	data-part="content"
	data-slot="scroll-area-content"
>
	{@render children?.()}
</Element>
