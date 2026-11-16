<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ScrollAreaViewportProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ScrollArea.module.css';
	import { useScrollAreaContext } from './scroll-area.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ScrollAreaViewportProps = $props();

	const api = useScrollAreaContext();
	const attrs = $derived(api.viewportAttrs());

	$effect(() => {
		api.registerViewport(ref);
		if (ref) api.measure();
		return () => api.registerViewport(null);
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
	data-part="viewport"
	data-slot="scroll-area-viewport"
	class={cn(styles.viewport, className)}
>
	{@render children?.()}
</Element>
