export { default as Chart } from './Chart.svelte';
export { default as ChartDescription } from './ChartDescription.svelte';
export { default as ChartHeader } from './ChartHeader.svelte';
export { default as ChartLegend } from './ChartLegend.svelte';
export { default as ChartLegendItem } from './ChartLegendItem.svelte';
export { default as ChartPlot } from './ChartPlot.svelte';
export { default as ChartTitle } from './ChartTitle.svelte';

// Theme-aware chart palette for mark colors and legend indicators.
export { chartColors } from './render.js';

export {
	formatChartValue,
	keyOf,
	niceExtent,
	niceTicks,
	scaleBand,
	scaleLinear,
	scalePoint,
	scaleTime,
	timeTicks
} from './scales.js';
export { areaX, areaY, barX, barY, lineX, lineY, point } from './marks.js';

export type { ChartLegendItemProps } from './ChartLegendItem.svelte';
export type { ChartPlotProps, ChartTooltipBodyRenderContext } from './ChartPlot.svelte';
export type {
	BandScaleOptions,
	ChartScale,
	ChartScaleKind,
	ChartTick,
	ChartValue,
	PointScaleOptions
} from './scales.js';
export type {
	Accessor,
	AreaMarkOptions,
	BarMarkOptions,
	Channel,
	ChartMark,
	ChartMarkOptions,
	ChartMarkType,
	LineMarkOptions,
	PointMarkOptions
} from './marks.js';
export type {
	ChartAxisOptions,
	ChartAxisTicksOptions,
	ChartBounds,
	ChartDefinition,
	ChartMargin,
	ChartPoint,
	ChartScene,
	ChartTooltipContent,
	ChartTooltipRow
} from './render.js';
