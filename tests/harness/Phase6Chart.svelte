<script module lang="ts">
	import {
		barY,
		chartColors,
		lineY,
		point,
		scaleBand,
		scaleLinear,
		type ChartDefinition
	} from '../../src/lib/components/chart/index.js';

	const revenue = [
		{ month: 'Jan', value: 40 },
		{ month: 'Feb', value: 80 },
		{ month: 'Mar', value: 60 }
	];

	const bars: ChartDefinition = {
		marks: [barY(revenue, { id: 'revenue', x: 'month', y: 'value', label: 'Revenue', inset: 2 })],
		scales: { x: scaleBand({ padding: 0.2 }), y: scaleLinear() },
		axes: { x: { label: 'Month' }, y: { label: 'Revenue', grid: true } },
		color: { domain: ['Revenue'], range: chartColors }
	};

	const geometry: ChartDefinition = {
		marks: [
			lineY(
				[
					{ index: 0, score: 0 },
					{ index: 1, score: 10 }
				],
				{ id: 'trend', x: 'index', y: 'score', stroke: '#111111' }
			),
			point(
				[
					{ index: 0, score: 10 },
					{ index: 1, score: 0 }
				],
				{ id: 'dots', x: 'index', y: 'score', fill: '#222222', r: 4 }
			)
		],
		scales: {
			x: scaleLinear().domain([0, 1]),
			y: scaleLinear().domain([0, 10])
		},
		axes: { x: false, y: false },
		margin: 0
	};

	const empty: ChartDefinition = {
		marks: [barY<{ month: string; value: number }>([], { x: 'month', y: 'value' })],
		scales: { x: scaleBand(), y: scaleLinear() },
		axes: { x: { label: 'Month' }, y: { label: 'Revenue', grid: true } }
	};

	const definitions = { bars, geometry, empty };
</script>

<script lang="ts">
	import {
		Chart,
		ChartDescription,
		ChartHeader,
		ChartLegend,
		ChartLegendItem,
		ChartPlot,
		ChartTitle,
		type ChartTooltipBodyRenderContext
	} from '../../src/lib/components/chart/index.js';

	let {
		variant = 'bars',
		width = 420,
		height = 300,
		motion = true,
		customTooltip = false
	}: {
		variant?: keyof typeof definitions;
		width?: number;
		height?: number;
		motion?: boolean;
		customTooltip?: boolean;
	} = $props();
</script>

{#snippet customBody(context: ChartTooltipBodyRenderContext)}
	<div data-testid="custom-tooltip">
		<span data-testid="custom-title">{context.content.title}</span>
		<span data-testid="custom-rows">{context.content.rows.length}</span>
		<span data-testid="custom-points">{context.points.length}</span>
	</div>
{/snippet}

<Chart>
	<ChartHeader>
		<ChartTitle>Monthly revenue</ChartTitle>
		<ChartDescription>Revenue in thousands of dollars.</ChartDescription>
	</ChartHeader>
	<ChartPlot
		definition={definitions[variant]}
		{width}
		{height}
		{motion}
		ariaLabel="Monthly revenue"
		renderTooltipBody={customTooltip ? customBody : undefined}
	/>
	<ChartLegend aria-label="Revenue series">
		<ChartLegendItem color={chartColors[0]}>Revenue</ChartLegendItem>
	</ChartLegend>
</Chart>
