<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TooltipArrowTipProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Tooltip.module.css';
	import { useTooltipContext } from './tooltip.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: TooltipArrowTipProps = $props();

	const api = useTooltipContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	data-scope="tooltip"
	data-part="arrow-tip"
	data-slot="tooltip-arrow-tip"
	style={mergeStyleDeclarations(api.arrowTipStyle, style)}
	class={cn(styles.arrowTip, className)}
>
	{@render children?.()}
</Element>
