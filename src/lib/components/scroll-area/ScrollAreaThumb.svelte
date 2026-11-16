<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ScrollAreaScrollbarOptions } from './scroll-area.state.svelte';

	export interface ScrollAreaThumbProps
		extends HTMLProps<'div'>,
			ScrollAreaScrollbarOptions,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ScrollArea.module.css';
	import { useScrollAreaContext } from './scroll-area.state.svelte';

	let {
		asChild,
		class: className,
		orientation = 'vertical',
		ref = $bindable(null),
		...props
	}: ScrollAreaThumbProps = $props();

	const api = useScrollAreaContext();
	const attrs = $derived(api.thumbAttrs({ orientation }));

	$effect(() => {
		api.registerThumb(ref, orientation);
		if (ref) api.measure();
		return () => api.registerThumb(null, orientation);
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
	data-part="thumb"
	data-slot="scroll-area-thumb"
	class={cn(styles.thumb, className)}
/>
