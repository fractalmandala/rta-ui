<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MarqueeContentProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		index?: number;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Marquee.module.css';
	import { useMarqueeContext } from './marquee.state.svelte';

	let {
		asChild,
		children,
		class: className,
		index = 0,
		ref = $bindable(null),
		...props
	}: MarqueeContentProps = $props();

	const api = useMarqueeContext();
	const attrs = $derived(api.contentAttrs(index));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="marquee"
	data-part="content"
	data-slot="marquee-content"
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
