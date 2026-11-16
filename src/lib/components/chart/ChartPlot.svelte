<script module lang="ts">
	import type { HTMLProps, RefAttribute } from '../../internal/types';
	import type { Snippet } from 'svelte';
	import type { ChartDefinition, ChartPoint, ChartTooltipContent } from './render';

	export interface ChartTooltipBodyRenderContext {
		points: readonly ChartPoint[];
		content: ChartTooltipContent;
	}

	export interface ChartPlotProps
		extends Omit<HTMLProps<'div'>, 'children' | 'width' | 'height'>,
			RefAttribute<HTMLDivElement> {
		definition: ChartDefinition;
		width?: number;
		height?: number;
		aspectRatio?: number;
		initialWidth?: number;
		idPrefix?: string;
		motion?: boolean;
		ariaLabel?: string;
		ariaDescription?: string;
		renderTooltipBody?: Snippet<[ChartTooltipBodyRenderContext]>;
	}
</script>

<script lang="ts">
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Chart.module.css';
	import { buildTooltipContent, nearestPoint, renderChart, tooltipPoints } from './render.js';

	let {
		class: className,
		definition,
		width,
		height,
		aspectRatio,
		initialWidth = 640,
		idPrefix,
		motion = true,
		ariaLabel,
		ariaDescription,
		renderTooltipBody,
		ref = $bindable(null),
		style,
		...props
	}: ChartPlotProps = $props();

	const generatedId = $props.id();
	const generatedPrefix = `ts-chart-${generatedId.replaceAll(/[^a-zA-Z0-9_-]/g, '')}`;

	let host = $state<HTMLDivElement | null>(null);
	let measuredWidth = $state(0);

	$effect(() => {
		if (width !== undefined) return;
		const node = host;
		if (!node) return;
		const measure = () => {
			measuredWidth = node.clientWidth;
		};
		measure();
		if (typeof ResizeObserver === 'undefined') return;
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		return () => observer.disconnect();
	});

	const resolvedWidth = $derived(width ?? (measuredWidth || initialWidth));
	const resolvedHeight = $derived(
		height ?? (aspectRatio ? Math.round(resolvedWidth / aspectRatio) : 320)
	);

	const scene = $derived(
		renderChart(definition, {
			width: resolvedWidth,
			height: resolvedHeight,
			id: idPrefix ?? generatedPrefix,
			ariaLabel,
			ariaDescription
		})
	);

	let tooltip = $state.raw<{ point: ChartPoint; x: number; y: number } | null>(null);
	const tooltipContent = $derived(
		tooltip ? buildTooltipContent(scene.points, tooltip.point) : { rows: [] }
	);
	const tooltipTargets = $derived(
		tooltip ? tooltipPoints(scene.points, tooltip.point) : []
	);

	const tooltipStyle = $derived.by(() => {
		if (!tooltip) return undefined;
		const flip = tooltip.x > resolvedWidth / 2;
		return `position:absolute;left:${tooltip.x}px;top:${tooltip.y}px;transform:translate(${flip ? 'calc(-100% - 12px)' : '12px'}, -50%);pointer-events:none;z-index:1`;
	});

	const hostStyle = $derived(
		mergeStyleDeclarations(
			[
				'position:relative',
				`width:${width === undefined ? '100%' : `${width}px`}`,
				height !== undefined
					? `height:${height}px`
					: aspectRatio === undefined
						? 'height:320px'
						: `aspect-ratio:${aspectRatio}`,
				'min-width:0'
			].join(';'),
			style
		)
	);

	function onPointerMove(event: PointerEvent) {
		const node = event.currentTarget as HTMLElement | null;
		if (!node) return;
		const rect = node.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const point = nearestPoint(scene.points, x, y);
		tooltip = point ? { point, x, y } : null;
	}

	function onPointerLeave() {
		tooltip = null;
	}
</script>

{#snippet tooltipSwatch(color: string)}
	<span
		aria-hidden="true"
		data-slot="chart-tooltip-swatch"
		class={styles.tooltipSwatch}
		style:background-color={color}
	></span>
{/snippet}

{#snippet defaultTooltipBody(content: ChartTooltipContent)}
	<div data-slot="chart-tooltip-body" class={styles.defaultTooltipContent}>
		{#if content.title}
			<div data-slot="chart-tooltip-title" class={styles.tooltipTitle}>{content.title}</div>
		{/if}
		{#if content.rows.length}
			<div data-slot="chart-tooltip-rows" class={styles.tooltipRows}>
				{#each content.rows as row, index (`${row.label}-${index}`)}
					<div
						data-active={row.active ? '' : undefined}
						data-has-swatch={row.color ? '' : undefined}
						data-slot="chart-tooltip-row"
						class={styles.tooltipRow}
					>
						{#if row.color}{@render tooltipSwatch(row.color)}{/if}
						<span data-slot="chart-tooltip-label" class={styles.tooltipLabel}>{row.label}</span>
						<span data-slot="chart-tooltip-value" class={styles.tooltipValue}>{row.value}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

<div
	{...props}
	bind:this={ref}
	class={cn('ts-chart-host', styles.plot, className)}
	style={hostStyle}
	data-motion={motion ? 'true' : 'false'}
>
	<div
		class="ts-chart-surface"
		bind:this={host}
		role="presentation"
		style="width:100%;height:100%"
		onpointermove={onPointerMove}
		onpointerleave={onPointerLeave}
	>
		{@html scene.svg}
	</div>
	{#if tooltip}
		<div data-slot="chart-tooltip-surface" class={styles.tooltipSurface} style={tooltipStyle}>
			{#if renderTooltipBody}
				{@render renderTooltipBody({ points: tooltipTargets, content: tooltipContent })}
			{:else}
				{@render defaultTooltipBody(tooltipContent)}
			{/if}
		</div>
	{/if}
</div>
