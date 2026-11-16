<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TooltipArrowProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { arrowStyle } from '../../internal/positioning.svelte.js';
	import styles from './Tooltip.module.css';
	import { useTooltipContext } from './tooltip.state.svelte';
	import TooltipArrowTip from './TooltipArrowTip.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: TooltipArrowProps = $props();

	const api = useTooltipContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.arrowId}
	dir={api.dir}
	data-scope="tooltip"
	data-part="arrow"
	data-slot="tooltip-arrow"
	style={mergeStyleDeclarations(arrowStyle, style)}
	class={cn(styles.arrow, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<TooltipArrowTip />
	{/if}
</Element>
