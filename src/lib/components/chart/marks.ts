import type { ChartValue } from './scales';

export type ChartMarkType = 'line' | 'bar' | 'area' | 'point';

export type Accessor<TDatum = unknown, TValue extends ChartValue = ChartValue> = (
	datum: TDatum,
	index: number
) => TValue;

/** A field name, a typed accessor, or a constant value. */
export type Channel<TDatum, TValue extends ChartValue = ChartValue> =
	| (keyof TDatum & string)
	| Accessor<TDatum, TValue>
	| TValue;

export interface ChartMark {
	type: ChartMarkType;
	orientation: 'x' | 'y';
	id?: string;
	label?: string;
	data: readonly unknown[];
	x: Accessor<unknown>;
	y: Accessor<unknown>;
	color?: Accessor<unknown, string>;
	stack?: string;
	points?: boolean;
	stroke?: string;
	fill?: string;
	strokeWidth?: number;
	fillOpacity?: number;
	radius?: number;
	inset?: number;
	r?: number;
}

export interface ChartMarkOptions<TDatum> {
	id?: string;
	label?: string;
	x: Channel<TDatum>;
	y: Channel<TDatum>;
	color?: string | Accessor<TDatum, string>;
}

export interface LineMarkOptions<TDatum> extends ChartMarkOptions<TDatum> {
	stroke?: string;
	fill?: string;
	strokeWidth?: number;
	points?: boolean;
}

export interface AreaMarkOptions<TDatum> extends ChartMarkOptions<TDatum> {
	fill?: string;
	stroke?: string;
	fillOpacity?: number;
	stack?: string | boolean;
}

export interface BarMarkOptions<TDatum> extends ChartMarkOptions<TDatum> {
	fill?: string;
	stroke?: string;
	stack?: string | boolean;
	radius?: number;
	inset?: number;
}

export interface PointMarkOptions<TDatum> extends ChartMarkOptions<TDatum> {
	fill?: string;
	stroke?: string;
	r?: number;
}

function readValue(raw: unknown): ChartValue {
	if (raw instanceof Date) return raw;
	if (typeof raw === 'number' || typeof raw === 'string') return raw;
	const numeric = Number(raw);
	return Number.isFinite(numeric) ? numeric : Number.NaN;
}

function resolveChannel<TDatum, TValue extends ChartValue>(
	channel: Channel<TDatum, TValue>
): Accessor<TDatum, TValue> {
	if (typeof channel === 'function') return channel as Accessor<TDatum, TValue>;
	if (typeof channel === 'string') {
		return ((datum: TDatum) => {
			if (datum !== null && typeof datum === 'object') {
				return readValue((datum as Record<string, unknown>)[channel]) as TValue;
			}
			return channel as TValue;
		}) as Accessor<TDatum, TValue>;
	}
	return () => channel;
}

function wrap<TDatum, TValue extends ChartValue>(
	accessor: Accessor<TDatum, TValue>
): Accessor<unknown, TValue> {
	return (datum, index) => accessor(datum as TDatum, index);
}

function resolveColor<TDatum>(
	color: string | Accessor<TDatum, string> | undefined
): Accessor<unknown, string> | undefined {
	if (color === undefined) return undefined;
	if (typeof color === 'function') return wrap(color);
	return () => color;
}

function normalizeStack(stack: string | boolean | undefined): string | undefined {
	if (stack === true) return 'stack';
	return stack || undefined;
}

function createMark<TDatum>(
	type: ChartMarkType,
	orientation: 'x' | 'y',
	data: readonly TDatum[],
	options: ChartMarkOptions<TDatum>,
	extras: Partial<ChartMark> = {}
): ChartMark {
	return {
		type,
		orientation,
		id: options.id,
		label: options.label,
		data,
		x: wrap(resolveChannel(options.x)),
		y: wrap(resolveChannel(options.y)),
		color: resolveColor(options.color),
		...extras
	};
}

export function lineY<TDatum>(data: readonly TDatum[], options: LineMarkOptions<TDatum>): ChartMark {
	return createMark('line', 'y', data, options, {
		stroke: options.stroke,
		fill: options.fill,
		strokeWidth: options.strokeWidth,
		points: options.points
	});
}

export function lineX<TDatum>(data: readonly TDatum[], options: LineMarkOptions<TDatum>): ChartMark {
	return createMark('line', 'x', data, options, {
		stroke: options.stroke,
		fill: options.fill,
		strokeWidth: options.strokeWidth,
		points: options.points
	});
}

export function areaY<TDatum>(data: readonly TDatum[], options: AreaMarkOptions<TDatum>): ChartMark {
	return createMark('area', 'y', data, options, {
		fill: options.fill,
		stroke: options.stroke,
		fillOpacity: options.fillOpacity,
		stack: normalizeStack(options.stack)
	});
}

export function areaX<TDatum>(data: readonly TDatum[], options: AreaMarkOptions<TDatum>): ChartMark {
	return createMark('area', 'x', data, options, {
		fill: options.fill,
		stroke: options.stroke,
		fillOpacity: options.fillOpacity,
		stack: normalizeStack(options.stack)
	});
}

export function barY<TDatum>(data: readonly TDatum[], options: BarMarkOptions<TDatum>): ChartMark {
	return createMark('bar', 'y', data, options, {
		fill: options.fill,
		stroke: options.stroke,
		stack: normalizeStack(options.stack),
		radius: options.radius,
		inset: options.inset
	});
}

export function barX<TDatum>(data: readonly TDatum[], options: BarMarkOptions<TDatum>): ChartMark {
	return createMark('bar', 'x', data, options, {
		fill: options.fill,
		stroke: options.stroke,
		stack: normalizeStack(options.stack),
		radius: options.radius,
		inset: options.inset
	});
}

export function point<TDatum>(data: readonly TDatum[], options: PointMarkOptions<TDatum>): ChartMark {
	return createMark('point', 'y', data, options, {
		fill: options.fill,
		stroke: options.stroke,
		r: options.r
	});
}
