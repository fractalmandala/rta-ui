<script module lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	export interface TocRailProps extends SVGAttributes<SVGSVGElement> {
		depth: number;
		nextDepth?: number;
		previousDepth?: number;
		ref?: SVGSVGElement | null;
	}
</script>

<script lang="ts">
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Toc.module.css';

	const railStep = 12;
	const railBridge = 6;

	const getRailX = (depth: number) => Math.min(Math.max(depth - 2, 0), 2) * railStep + 0.5;

	let {
		class: className,
		depth,
		nextDepth,
		previousDepth,
		ref = $bindable(null),
		style,
		...props
	}: TocRailProps = $props();

	const x = $derived(getRailX(depth));
	const previousX = $derived(getRailX(previousDepth ?? depth));
	const nextX = $derived(getRailX(nextDepth ?? depth));
	const hasTurn = $derived(previousX !== x);
	const railStyle = $derived(
		[
			`width:${Math.max(previousX, x, nextX) + 1.5}px`,
			`height:calc(100% + ${nextX === x ? railBridge : 0}px + var(--moduix-spacing-0-5))`
		].join('; ')
	);
</script>

<svg
	bind:this={ref}
	aria-hidden="true"
	{...props}
	class={cn(styles.rail, className)}
	style={mergeStyleDeclarations(railStyle, style)}
	data-slot="toc-rail"
>
	{#if hasTurn}
		<path
			d="M {previousX} 0 C {previousX} 8 {x} 4 {x} {railBridge * 2}"
			fill="none"
			vector-effect="non-scaling-stroke"
			stroke="currentColor"
		/>
	{/if}
	<line
		x1={x}
		y1={hasTurn ? railBridge * 2 : railBridge}
		x2={x}
		y2="100%"
		vector-effect="non-scaling-stroke"
		stroke="currentColor"
	/>
</svg>
