import type { ChartMark, ChartMarkType } from './marks';
import {
	formatChartValue,
	keyOf,
	scaleBand,
	scaleCenter,
	scaleLinear,
	scalePoint,
	scaleTime,
	toNumber,
	type ChartScale,
	type ChartTick,
	type ChartValue
} from './scales';

export const chartColors = [
	'var(--moduix-chart-1)',
	'var(--moduix-chart-2)',
	'var(--moduix-chart-3)',
	'var(--moduix-chart-4)',
	'var(--moduix-chart-5)',
	'var(--moduix-chart-6)',
	'var(--moduix-chart-7)',
	'var(--moduix-chart-8)'
] as const;

export interface ChartMargin {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export interface ChartBounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface ChartAxisTicksOptions {
	count?: number;
	format?: (value: ChartValue) => string;
}

export interface ChartAxisOptions {
	label?: string;
	grid?: boolean;
	line?: boolean;
	hide?: boolean;
	ticks?: ChartAxisTicksOptions;
}

export interface ChartDefinition {
	marks: readonly ChartMark[];
	scales?: {
		x?: ChartScale | null;
		y?: ChartScale | null;
	};
	axes?: {
		x?: ChartAxisOptions | false;
		y?: ChartAxisOptions | false;
	};
	grid?: boolean;
	margin?: number | Partial<ChartMargin>;
	color?: {
		domain?: readonly ChartValue[];
		range?: readonly string[];
	};
}

export interface ChartTooltipRow {
	label: string;
	value: string;
	color?: string;
	active?: boolean;
}

export interface ChartTooltipContent {
	title?: string;
	rows: ChartTooltipRow[];
}

export interface ChartPoint {
	markId: string;
	markType: ChartMarkType;
	datum: unknown;
	label: string;
	color: string;
	category: ChartValue;
	value: ChartValue;
	xValue: ChartValue;
	yValue: ChartValue;
	x: number;
	y: number;
}

export interface ChartScene {
	svg: string;
	points: ChartPoint[];
	bounds: ChartBounds;
	width: number;
	height: number;
	margin: ChartMargin;
}

export interface ChartRenderOptions {
	width: number;
	height: number;
	id?: string;
	ariaLabel?: string;
	ariaDescription?: string;
}

interface MarkRow {
	valid: boolean;
	datum: unknown;
	xValue: ChartValue;
	yValue: ChartValue;
	base: number;
	top: number;
	series: string;
}

interface ResolvedMark {
	mark: ChartMark;
	id: string;
	rows: MarkRow[];
}

interface XY {
	x: number;
	y: number;
}

interface ColorResolver {
	colorFor(series: string): string;
}

const DEFAULT_HEIGHT = 320;

function px(value: number): number {
	return Math.round(value * 100) / 100;
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function isFinitePoint(value: number): boolean {
	return Number.isFinite(value);
}

function isValidValue(value: ChartValue): boolean {
	if (value instanceof Date) return Number.isFinite(value.getTime());
	if (typeof value === 'number') return Number.isFinite(value);
	return value.length > 0;
}

function intern(values: readonly ChartValue[]): ChartValue[] {
	const seen = new Set<string>();
	const out: ChartValue[] = [];
	for (const value of values) {
		const key = keyOf(value);
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(value);
	}
	return out;
}

function createColorResolver(definition: ChartDefinition): ColorResolver {
	const range = definition.color?.range?.length ? definition.color.range : chartColors;
	const domain = (definition.color?.domain ?? []).map((value) => String(value));
	const cache = new Map<string, string>();
	return {
		colorFor(series: string) {
			const cached = cache.get(series);
			if (cached) return cached;
			let index = domain.indexOf(series);
			if (index < 0) {
				domain.push(series);
				index = domain.length - 1;
			}
			const color = range[index % range.length] ?? chartColors[0];
			cache.set(series, color);
			return color;
		}
	};
}

function resolveMarks(marks: readonly ChartMark[]): ResolvedMark[] {
	const stacks = new Map<
		string,
		{ positive: Map<string, number>; negative: Map<string, number> }
	>();

	return marks.map((mark, index) => {
		const id = mark.id ?? `${mark.type}-${index}`;
		const series = mark.label ?? mark.id ?? `Series ${index + 1}`;
		const rows: MarkRow[] = [];

		for (let datumIndex = 0; datumIndex < mark.data.length; datumIndex++) {
			const datum = mark.data[datumIndex];
			const xValue = mark.x(datum, datumIndex);
			const yValue = mark.y(datum, datumIndex);
			const primary = mark.orientation === 'y' ? yValue : xValue;
			const numeric = toNumber(primary);
			const valid = isValidValue(xValue) && isValidValue(yValue) && Number.isFinite(numeric);
			let base = 0;
			let top = numeric;

			if (valid && mark.stack) {
				let accumulator = stacks.get(mark.stack);
				if (!accumulator) {
					accumulator = { positive: new Map(), negative: new Map() };
					stacks.set(mark.stack, accumulator);
				}
				const category = keyOf(mark.orientation === 'y' ? xValue : yValue);
				const bucket = numeric < 0 ? accumulator.negative : accumulator.positive;
				base = bucket.get(category) ?? 0;
				top = base + numeric;
				bucket.set(category, top);
			}

			rows.push({
				valid,
				datum,
				xValue,
				yValue,
				base,
				top,
				series: mark.color ? mark.color(datum, datumIndex) : series
			});
		}

		return { mark, id, rows };
	});
}

function wantsBand(axis: 'x' | 'y', marks: readonly ResolvedMark[]): boolean {
	const categoryOrientation = axis === 'x' ? 'y' : 'x';
	return marks.some(
		(entry) =>
			entry.mark.type === 'bar' &&
			entry.mark.orientation === categoryOrientation &&
			entry.rows.some(
				(row) => row.valid && typeof (axis === 'x' ? row.xValue : row.yValue) === 'string'
			)
	);
}

function defaultScale(
	axis: 'x' | 'y',
	marks: readonly ResolvedMark[],
	values: readonly ChartValue[]
): ChartScale {
	if (wantsBand(axis, marks)) return scaleBand({ padding: 0.1 });
	if (values.length && values.every((value) => value instanceof Date)) return scaleTime();
	if (values.some((value) => typeof value === 'string')) return scalePoint();
	return scaleLinear();
}

function createAxisScale(
	axis: 'x' | 'y',
	definition: ChartDefinition,
	marks: readonly ResolvedMark[],
	values: readonly ChartValue[],
	tickCount: number
): ChartScale {
	const provided = definition.scales?.[axis];
	const scale = provided ? provided.copy() : defaultScale(axis, marks, values);
	if (!scale.domain().length && values.length) {
		const categorical = scale.kind === 'band' || scale.kind === 'point';
		scale.domain(categorical ? intern(values) : values);
		if (scale.kind === 'linear' || scale.kind === 'time') scale.nice(tickCount);
	}
	return scale;
}

function rangeFor(axis: 'x' | 'y', scale: ChartScale, bounds: ChartBounds): [number, number] {
	if (axis === 'x') return [bounds.x, bounds.x + bounds.width];
	const ascending = scale.kind === 'band' || scale.kind === 'point';
	return ascending
		? [bounds.y, bounds.y + bounds.height]
		: [bounds.y + bounds.height, bounds.y];
}

function tickCountFor(axis: 'x' | 'y', definition: ChartDefinition, length: number): number {
	const options = definition.axes?.[axis];
	const explicit = options === false ? undefined : options?.ticks?.count;
	if (explicit !== undefined) return Math.max(1, explicit);
	return Math.max(2, Math.min(8, Math.round(length / 80)));
}

function formatTick(options: ChartAxisOptions, tick: ChartTick): string {
	return options.ticks?.format ? options.ticks.format(tick.value) : tick.label;
}

function estimateTextWidth(label: string): number {
	return label.length * 6.2 + 2;
}

function widestLabel(labels: readonly string[]): number {
	let widest = 0;
	for (const label of labels) widest = Math.max(widest, estimateTextWidth(label));
	return widest;
}

interface MarginInput {
	xLabel?: string;
	yLabel?: string;
	xTickLabels: readonly string[];
	yTickLabels: readonly string[];
}

function resolveMargin(
	margin: ChartDefinition['margin'],
	input: MarginInput
): ChartMargin {
	const explicit =
		typeof margin === 'number'
			? { top: margin, right: margin, bottom: margin, left: margin }
			: (margin ?? {});
	const bottom = 10 + 14 + (input.xLabel ? 16 : 0);
	const left = Math.max(24, 12 + widestLabel(input.yTickLabels) + (input.yLabel ? 16 : 0));
	return {
		top: explicit.top ?? 12,
		right: explicit.right ?? 16,
		bottom: explicit.bottom ?? bottom,
		left: explicit.left ?? left
	};
}

function seriesGroups(rows: readonly MarkRow[]): { series: string; rows: MarkRow[] }[] {
	const groups = new Map<string, MarkRow[]>();
	for (const row of rows) {
		const group = groups.get(row.series);
		if (group) group.push(row);
		else groups.set(row.series, [row]);
	}
	return [...groups].map(([series, group]) => ({ series, rows: group }));
}

function splitSegments(
	rows: readonly MarkRow[],
	project: (row: MarkRow) => XY
): XY[][] {
	const segments: XY[][] = [];
	let current: XY[] = [];
	for (const row of rows) {
		const projected = row.valid ? project(row) : undefined;
		if (!projected || !isFinitePoint(projected.x) || !isFinitePoint(projected.y)) {
			if (current.length) segments.push(current);
			current = [];
			continue;
		}
		current.push(projected);
	}
	if (current.length) segments.push(current);
	return segments;
}

function pathFrom(points: readonly XY[]): string {
	return points
		.map((point, index) => `${index === 0 ? 'M' : 'L'}${px(point.x)},${px(point.y)}`)
		.join(' ');
}

function areaPathFrom(
	rows: readonly MarkRow[],
	projectTop: (row: MarkRow) => XY,
	projectBase: (row: MarkRow) => XY
): string {
	const parts: string[] = [];
	let tops: XY[] = [];
	let bases: XY[] = [];

	const flush = () => {
		if (tops.length) {
			const ring = tops.concat([...bases].reverse());
			parts.push(`${pathFrom(ring)} Z`);
		}
		tops = [];
		bases = [];
	};

	for (const row of rows) {
		const top = row.valid ? projectTop(row) : undefined;
		const base = row.valid ? projectBase(row) : undefined;
		if (
			!top ||
			!base ||
			!isFinitePoint(top.x) ||
			!isFinitePoint(top.y) ||
			!isFinitePoint(base.x) ||
			!isFinitePoint(base.y)
		) {
			flush();
			continue;
		}
		tops.push(top);
		bases.push(base);
	}
	flush();
	return parts.join(' ');
}

function bandSpan(
	scale: ChartScale,
	value: ChartValue,
	inset: number
): { start: number; size: number } {
	const mapped = scale(value);
	let size = scale.bandwidth();
	if (!(size > 0)) size = scale.step() > 0 ? Math.min(28, scale.step() * 0.7) : 20;
	const ascending = scale.range()[1] >= scale.range()[0];
	const rawStart = scale.kind === 'band' ? (ascending ? mapped : mapped - size) : mapped - size / 2;
	const shrink = Math.min(Math.max(inset, 0), size / 2);
	return { start: rawStart + shrink, size: Math.max(0.5, size - shrink * 2) };
}

function svgText(
	x: number,
	y: number,
	content: string,
	anchor: 'start' | 'middle' | 'end',
	opacity: number,
	className: string,
	dy?: string
): string {
	return `<text class="${className}" x="${px(x)}" y="${px(y)}"${dy ? ` dy="${dy}"` : ''} text-anchor="${anchor}" font-size="11" fill="currentColor" fill-opacity="${opacity}">${escapeXml(content)}</text>`;
}

function svgLine(
	className: string,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	opacity: number,
	extra = ''
): string {
	return `<line class="${className}" x1="${px(x1)}" y1="${px(y1)}" x2="${px(x2)}" y2="${px(y2)}" stroke="currentColor" stroke-opacity="${opacity}"${extra} />`;
}

export function renderChart(
	definition: ChartDefinition,
	options: ChartRenderOptions
): ChartScene {
	const width = Math.max(1, Math.round(options.width || 0));
	const height = Math.max(1, Math.round(options.height || DEFAULT_HEIGHT));
	const marks = resolveMarks(definition.marks ?? []);
	const colors = createColorResolver(definition);

	const xValues: ChartValue[] = [];
	const yValues: ChartValue[] = [];

	for (const entry of marks) {
		for (const row of entry.rows) {
			if (!row.valid) continue;
			xValues.push(row.xValue);
			yValues.push(row.yValue);
			if (entry.mark.type !== 'bar' && entry.mark.type !== 'area') continue;
			if (entry.mark.orientation === 'y') yValues.push(row.base, row.top);
			else xValues.push(row.base, row.top);
		}
	}

	const tickCountX = tickCountFor('x', definition, width);
	const tickCountY = tickCountFor('y', definition, height);
	const xScale = createAxisScale('x', definition, marks, xValues, tickCountX);
	const yScale = createAxisScale('y', definition, marks, yValues, tickCountY);

	const xAxis = definition.axes?.x === false ? false : (definition.axes?.x ?? {});
	const yAxis = definition.axes?.y === false ? false : (definition.axes?.y ?? {});

	const xTickLabels =
		xAxis === false ? [] : xScale.ticks(tickCountX).map((tick) => formatTick(xAxis, tick));
	const yTickLabels =
		yAxis === false ? [] : yScale.ticks(tickCountY).map((tick) => formatTick(yAxis, tick));

	const margin = resolveMargin(definition.margin, {
		xLabel: xAxis === false ? undefined : xAxis.label,
		yLabel: yAxis === false ? undefined : yAxis.label,
		xTickLabels,
		yTickLabels
	});

	const bounds: ChartBounds = {
		x: margin.left,
		y: margin.top,
		width: Math.max(1, width - margin.left - margin.right),
		height: Math.max(1, height - margin.top - margin.bottom)
	};

	xScale.range(rangeFor('x', xScale, bounds));
	yScale.range(rangeFor('y', yScale, bounds));

	const xTicks = xScale.ticks(tickCountX);
	const yTicks = yScale.ticks(tickCountY);

	const gridNodes: string[] = [];
	const axisNodes: string[] = [];
	const markNodes: string[] = [];
	const points: ChartPoint[] = [];

	const centerX = (value: ChartValue) => scaleCenter(xScale, value);
	const centerY = (value: ChartValue) => scaleCenter(yScale, value);

	const xVisible = xAxis !== false && !xAxis.hide && xScale.domain().length > 0;
	const yVisible = yAxis !== false && !yAxis.hide && yScale.domain().length > 0;
	const xGrid = xAxis !== false && (xAxis.grid ?? definition.grid ?? false);
	const yGrid = yAxis !== false && (yAxis.grid ?? definition.grid ?? false);

	if (xAxis !== false && xVisible) {
		const bottom = bounds.y + bounds.height;
		if (xAxis.line !== false) {
			axisNodes.push(svgLine('ts-chart-baseline', bounds.x, bottom, bounds.x + bounds.width, bottom, 0.35));
		}
		for (const tick of xTicks) {
			const position = scaleCenter(xScale, tick.value);
			if (!isFinitePoint(position)) continue;
			axisNodes.push(svgLine('ts-chart-tick', position, bottom, position, bottom + 4, 0.5));
			axisNodes.push(
				svgText(position, bottom + 16, formatTick(xAxis, tick), 'middle', 0.72, 'ts-chart-tick-label')
			);
			if (xGrid) {
				gridNodes.push(svgLine('ts-chart-grid-line', position, bounds.y, position, bottom, 0.12));
			}
		}
		if (xAxis.label) {
			axisNodes.push(
				svgText(bounds.x + bounds.width / 2, height - 6, xAxis.label, 'middle', 0.9, 'ts-chart-axis-label')
			);
		}
	}

	if (yAxis !== false && yVisible) {
		if (yAxis.line !== false) {
			axisNodes.push(svgLine('ts-chart-baseline', bounds.x, bounds.y, bounds.x, bounds.y + bounds.height, 0.35));
		}
		for (const tick of yTicks) {
			const position = scaleCenter(yScale, tick.value);
			if (!isFinitePoint(position)) continue;
			axisNodes.push(svgLine('ts-chart-tick', bounds.x - 4, position, bounds.x, position, 0.5));
			axisNodes.push(
				svgText(bounds.x - 8, position, formatTick(yAxis, tick), 'end', 0.72, 'ts-chart-tick-label', '0.32em')
			);
			if (yGrid) {
				gridNodes.push(
					svgLine('ts-chart-grid-line', bounds.x, position, bounds.x + bounds.width, position, 0.12)
				);
			}
		}
		if (yAxis.label) {
			axisNodes.push(
				`<text class="ts-chart-axis-label" transform="rotate(-90)" x="${px(-(bounds.y + bounds.height / 2))}" y="12" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.9">${escapeXml(yAxis.label)}</text>`
			);
		}
	}

	for (const entry of marks) {
		const mark = entry.mark;
		const paint = (series: string) => mark.fill ?? colors.colorFor(series);
		const stroke = (series: string) => mark.stroke ?? colors.colorFor(series);
		const toPoint = (row: MarkRow, x: number, y: number): ChartPoint => ({
			markId: entry.id,
			markType: mark.type,
			datum: row.datum,
			label: row.series,
			color: colors.colorFor(row.series),
			category: mark.orientation === 'y' ? row.xValue : row.yValue,
			value: mark.orientation === 'y' ? row.yValue : row.xValue,
			xValue: row.xValue,
			yValue: row.yValue,
			x,
			y
		});

		const valuePoint = (row: MarkRow): XY => ({ x: centerX(row.xValue), y: centerY(row.yValue) });

		if (mark.type === 'line') {
			for (const group of seriesGroups(entry.rows)) {
				const color = stroke(group.series);
				const path = splitSegments(group.rows, valuePoint)
					.map(pathFrom)
					.filter(Boolean)
					.join(' ');
				if (path) {
					markNodes.push(
						`<path class="ts-chart-mark ts-chart-line" d="${path}" fill="none" stroke="${escapeXml(color)}" stroke-width="${mark.strokeWidth ?? 2}" stroke-linecap="round" stroke-linejoin="round" />`
					);
				}
				if (mark.points) {
					for (const row of group.rows) {
						if (!row.valid) continue;
						const projected = valuePoint(row);
						if (!isFinitePoint(projected.x) || !isFinitePoint(projected.y)) continue;
						markNodes.push(
							`<circle class="ts-chart-mark ts-chart-point" cx="${px(projected.x)}" cy="${px(projected.y)}" r="3" fill="${escapeXml(color)}" />`
						);
					}
				}
			}
			for (const row of entry.rows) {
				if (!row.valid) continue;
				const projected = valuePoint(row);
				if (isFinitePoint(projected.x) && isFinitePoint(projected.y)) {
					points.push(toPoint(row, projected.x, projected.y));
				}
			}
			continue;
		}

		if (mark.type === 'area') {
			const projectTop = (row: MarkRow): XY =>
				mark.orientation === 'y'
					? { x: centerX(row.xValue), y: yScale(row.top) }
					: { x: xScale(row.top), y: centerY(row.yValue) };
			const projectBase = (row: MarkRow): XY =>
				mark.orientation === 'y'
					? { x: centerX(row.xValue), y: yScale(row.base) }
					: { x: xScale(row.base), y: centerY(row.yValue) };

			for (const group of seriesGroups(entry.rows)) {
				const color = paint(group.series);
				const path = areaPathFrom(group.rows, projectTop, projectBase);
				if (path) {
					markNodes.push(
						`<path class="ts-chart-mark ts-chart-area" d="${path}" fill="${escapeXml(color)}" fill-opacity="${mark.fillOpacity ?? 0.18}"${mark.stroke ? ` stroke="${escapeXml(mark.stroke)}" stroke-width="1.5"` : ''} />`
					);
				}
			}
			for (const row of entry.rows) {
				if (!row.valid) continue;
				const projected = projectTop(row);
				if (isFinitePoint(projected.x) && isFinitePoint(projected.y)) {
					points.push(toPoint(row, projected.x, projected.y));
				}
			}
			continue;
		}

		if (mark.type === 'bar') {
			for (const row of entry.rows) {
				if (!row.valid) continue;
				const color = paint(row.series);
				if (mark.orientation === 'y') {
					const span = bandSpan(xScale, row.xValue, mark.inset ?? 0);
					const yTop = yScale(row.top);
					const yBase = yScale(row.base);
					if (!isFinitePoint(span.start) || !isFinitePoint(yTop) || !isFinitePoint(yBase)) continue;
					const barHeight = Math.abs(yBase - yTop);
					if (!(span.size > 0) || !(barHeight > 0)) continue;
					const radius = mark.radius ?? 0;
					const rx = radius > 0 ? Math.min(radius, span.size / 2, barHeight / 2) : 0;
					markNodes.push(
						`<rect class="ts-chart-mark ts-chart-bar" x="${px(span.start)}" y="${px(Math.min(yTop, yBase))}" width="${px(span.size)}" height="${px(barHeight)}"${rx ? ` rx="${px(rx)}"` : ''} fill="${escapeXml(color)}"${mark.stroke ? ` stroke="${escapeXml(mark.stroke)}"` : ''} />`
					);
					points.push(toPoint(row, span.start + span.size / 2, yTop));
				} else {
					const span = bandSpan(yScale, row.yValue, mark.inset ?? 0);
					const xTop = xScale(row.top);
					const xBase = xScale(row.base);
					if (!isFinitePoint(span.start) || !isFinitePoint(xTop) || !isFinitePoint(xBase)) continue;
					const barWidth = Math.abs(xBase - xTop);
					if (!(span.size > 0) || !(barWidth > 0)) continue;
					const radius = mark.radius ?? 0;
					const rx = radius > 0 ? Math.min(radius, barWidth / 2, span.size / 2) : 0;
					markNodes.push(
						`<rect class="ts-chart-mark ts-chart-bar" x="${px(Math.min(xTop, xBase))}" y="${px(span.start)}" width="${px(barWidth)}" height="${px(span.size)}"${rx ? ` rx="${px(rx)}"` : ''} fill="${escapeXml(color)}"${mark.stroke ? ` stroke="${escapeXml(mark.stroke)}"` : ''} />`
					);
					points.push(toPoint(row, xTop, span.start + span.size / 2));
				}
			}
			continue;
		}

		for (const row of entry.rows) {
			if (!row.valid) continue;
			const projected = valuePoint(row);
			if (!isFinitePoint(projected.x) || !isFinitePoint(projected.y)) continue;
			const color = paint(row.series);
			markNodes.push(
				`<circle class="ts-chart-mark ts-chart-point" cx="${px(projected.x)}" cy="${px(projected.y)}" r="${mark.r ?? 3.5}" fill="${escapeXml(color)}"${mark.stroke ? ` stroke="${escapeXml(mark.stroke)}"` : ''} />`
			);
			points.push(toPoint(row, projected.x, projected.y));
		}
	}

	const dimensions = `viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"`;
	const id = options.id ? ` id="${escapeXml(options.id)}"` : '';
	const label = escapeXml(options.ariaLabel ?? 'Chart');
	const description = options.ariaDescription
		? ` aria-description="${escapeXml(options.ariaDescription)}"`
		: '';
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="ts-chart"${id} ${dimensions} role="img" aria-label="${label}"${description}><g class="ts-chart-grid">${gridNodes.join('')}</g><g class="ts-chart-marks">${markNodes.join('')}</g><g class="ts-chart-axes">${axisNodes.join('')}</g></svg>`;

	return { svg, points, bounds, width, height, margin };
}

export function nearestPoint(
	points: readonly ChartPoint[],
	x: number,
	y: number
): ChartPoint | undefined {
	let nearest: ChartPoint | undefined;
	let distance = Number.POSITIVE_INFINITY;
	for (const point of points) {
		const dx = point.x - x;
		const dy = point.y - y;
		const candidate = dx * dx + dy * dy;
		if (candidate < distance) {
			distance = candidate;
			nearest = point;
		}
	}
	return nearest;
}

/** The points a tooltip target describes: every mark that shares the active category. */
export function tooltipPoints(
	points: readonly ChartPoint[],
	active: ChartPoint
): ChartPoint[] {
	const category = keyOf(active.category);
	return points.filter((point) => keyOf(point.category) === category);
}

export function buildTooltipContent(
	points: readonly ChartPoint[],
	active: ChartPoint
): ChartTooltipContent {
	const seen = new Set<string>();
	const rows: ChartTooltipRow[] = [];

	for (const point of tooltipPoints(points, active)) {
		const key = `${point.markId}\u0000${point.label}`;
		if (seen.has(key)) continue;
		seen.add(key);
		rows.push({
			label: point.label,
			value: formatChartValue(point.value),
			color: point.color,
			active: point === active
		});
	}

	if (!rows.some((row) => row.active)) {
		const match = rows.find(
			(row) => row.label === active.label && row.value === formatChartValue(active.value)
		);
		if (match) {
			match.active = true;
		} else {
			rows.push({
				label: active.label,
				value: formatChartValue(active.value),
				color: active.color,
				active: true
			});
		}
	}

	return { title: formatChartValue(active.category), rows };
}
