<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ChartLegendItemProps
		extends Omit<HTMLProps<'li'>, 'color'>, PolymorphicProps<'li'>, RefAttribute {
		color?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Chart.module.css';

	let {
		class: className,
		color,
		asChild,
		children,
		ref = $bindable(null),
		style,
		...props
	}: ChartLegendItemProps = $props();

	const legendItemStyle = $derived(
		mergeStyleDeclarations(
			color ? `--moduix-chart-legend-indicator-color: ${color}` : undefined,
			style
		)
	);
</script>

<Element
	as="li"
	{...props}
	bind:ref
	{asChild}
	class={cn(styles.legendItem, className)}
	style={legendItemStyle}
	data-scope="chart"
	data-part="legend-item"
	data-slot="chart-legend-item"
>
	{@render children?.()}
</Element>
