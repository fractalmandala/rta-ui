<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface HoverCardArrowProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { arrowStyle } from '../../internal/positioning.svelte.js';
	import styles from './HoverCard.module.css';
	import { useHoverCardContext } from './hover-card.state.svelte';
	import HoverCardArrowTip from './HoverCardArrowTip.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: HoverCardArrowProps = $props();

	const api = useHoverCardContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.arrowId}
	dir={api.dir}
	data-scope="hover-card"
	data-part="arrow"
	data-slot="hover-card-arrow"
	style={mergeStyleDeclarations(arrowStyle, style)}
	class={cn(styles.arrow, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<HoverCardArrowTip />
	{/if}
</Element>
