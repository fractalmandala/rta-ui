<script lang="ts">
	import {
		Chart,
		ChartDescription,
		ChartHeader,
		ChartLegend,
		ChartLegendItem,
		ChartPlot,
		ChartTitle,
		chartColors,
		lineY,
		scaleLinear,
		scalePoint,
		type ChartDefinition
	} from '../../lib/index';

	const revenue = [
		{ month: 'Jan', planned: 44, actual: 42 },
		{ month: 'Feb', planned: 56, actual: 58 },
		{ month: 'Mar', planned: 69, actual: 76 },
		{ month: 'Apr', planned: 73, actual: 64 },
		{ month: 'May', planned: 80, actual: 81 }
	];

	const definition: ChartDefinition = {
		marks: [
			lineY(revenue, {
				id: 'planned',
				x: 'month',
				y: 'planned',
				label: 'Planned',
				strokeWidth: 2,
				points: true
			}),
			lineY(revenue, {
				id: 'actual',
				x: 'month',
				y: 'actual',
				label: 'Actual',
				strokeWidth: 2,
				points: true
			})
		],
		scales: {
			x: scalePoint({ padding: 0.2 }),
			y: scaleLinear()
		},
		axes: {
			x: { label: 'Month' },
			y: { label: 'Revenue ($k)', grid: true }
		},
		color: { domain: ['Planned', 'Actual'], range: chartColors }
	};
</script>

<Chart>
	<ChartHeader>
		<ChartTitle>Planned and actual revenue</ChartTitle>
		<ChartDescription>Chart tokens remain valid SVG paint values.</ChartDescription>
	</ChartHeader>
	<ChartPlot
		{definition}
		height={320}
		ariaLabel="Planned and actual monthly revenue"
	/>
	<ChartLegend aria-label="Revenue series">
		<ChartLegendItem color={chartColors[0]}>Planned</ChartLegendItem>
		<ChartLegendItem color={chartColors[1]}>Actual</ChartLegendItem>
	</ChartLegend>
</Chart>
