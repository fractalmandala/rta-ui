export type ChartValue = number | string | Date;

export type ChartScaleKind = 'linear' | 'time' | 'point' | 'band';

export interface ChartTick {
	value: ChartValue;
	position: number;
	label: string;
}

export interface ChartScale<TValue extends ChartValue = ChartValue> {
	(value: ChartValue): number;
	kind: ChartScaleKind;
	domain(): TValue[];
	domain(values: readonly TValue[]): ChartScale<TValue>;
	range(): [number, number];
	range(values: readonly [number, number]): ChartScale<TValue>;
	bandwidth(): number;
	step(): number;
	padding(): number;
	padding(value: number): ChartScale<TValue>;
	ticks(count?: number): ChartTick[];
	nice(count?: number): ChartScale<TValue>;
	copy(): ChartScale<TValue>;
}

export interface BandScaleOptions {
	padding?: number;
	paddingInner?: number;
	paddingOuter?: number;
}

export interface PointScaleOptions {
	padding?: number;
}

interface ScaleSettings {
	padding: number;
	paddingInner: number;
	paddingOuter: number;
}

const MAX_TICKS = 1000;

export function keyOf(value: ChartValue): string {
	if (value instanceof Date) return `date:${value.getTime()}`;
	return `${typeof value}:${value}`;
}

export function toNumber(value: ChartValue): number {
	if (value instanceof Date) return value.getTime();
	if (typeof value === 'number') return value;
	return Number(value);
}

export function formatChartValue(value: ChartValue): string {
	if (value instanceof Date) {
		const iso = value.toISOString();
		return iso.endsWith('T00:00:00.000Z') ? iso.slice(0, 10) : iso.slice(0, 16).replace('T', ' ');
	}
	if (typeof value === 'number') {
		if (!Number.isFinite(value)) return '';
		if (Number.isInteger(value)) return String(value);
		return value
			.toFixed(3)
			.replace(/0+$/, '')
			.replace(/\.$/, '');
	}
	return value;
}

function niceStep(span: number, count: number): number {
	const raw = span / Math.max(1, Math.round(count));
	const power = 10 ** Math.floor(Math.log10(raw));
	const norm = raw / power;
	const factor = norm >= 7.5 ? 10 : norm >= 3.5 ? 5 : norm >= 1.5 ? 2 : 1;
	return factor * power;
}

function roundValue(value: number, step: number): number {
	const precision = step >= 1 ? 0 : Math.min(12, Math.ceil(-Math.log10(step)));
	return Number(value.toFixed(precision));
}

/** 1/2/5×10ⁿ tick values covering the extent, clipped to it. */
export function niceTicks(min: number, max: number, count = 5): number[] {
	if (!Number.isFinite(min) || !Number.isFinite(max)) return [];
	const lo = Math.min(min, max);
	const hi = Math.max(min, max);
	if (lo === hi) return [lo];
	const step = niceStep(hi - lo, count);
	const start = Math.ceil(lo / step - 1e-9) * step;
	const end = Math.floor(hi / step + 1e-9) * step;
	const ticks: number[] = [];
	for (let index = 0; index <= MAX_TICKS; index++) {
		const value = start + index * step;
		if (value > end + step * 1e-9) break;
		ticks.push(roundValue(value, step));
	}
	return ticks.length ? ticks : [lo, hi];
}

/** Extends an extent outward to the next 1/2/5×10ⁿ step. */
export function niceExtent(min: number, max: number, count = 5): [number, number] {
	if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
	const lo = Math.min(min, max);
	const hi = Math.max(min, max);
	if (lo === hi) return [lo - 1, hi + 1];
	const step = niceStep(hi - lo, count);
	return [roundValue(Math.floor(lo / step) * step, step), roundValue(Math.ceil(hi / step) * step, step)];
}

const TIME_STEPS = [
	1000, 5000, 15000, 30000, 60000, 300000, 900000, 1800000, 3600000, 10800000, 21600000, 43200000,
	86400000, 604800000, 2592000000, 7776000000, 31536000000
];

/** Epoch-aligned duration ticks; calendar-aware month and year intervals are not reproduced. */
export function timeTicks(min: number, max: number, count = 5): number[] {
	if (!Number.isFinite(min) || !Number.isFinite(max)) return [];
	const lo = Math.min(min, max);
	const hi = Math.max(min, max);
	if (lo === hi) return [lo];
	const target = (hi - lo) / Math.max(1, Math.round(count));
	const step = TIME_STEPS.find((candidate) => candidate >= target) ?? TIME_STEPS[TIME_STEPS.length - 1];
	const start = Math.ceil(lo / step) * step;
	const ticks: number[] = [];
	for (let index = 0; index <= MAX_TICKS; index++) {
		const value = start + index * step;
		if (value > hi) break;
		ticks.push(value);
	}
	return ticks.length ? ticks : [lo, hi];
}

function numericDomain(values: readonly ChartValue[]): [number, number] {
	let lo = Number.POSITIVE_INFINITY;
	let hi = Number.NEGATIVE_INFINITY;
	for (const value of values) {
		const numeric = toNumber(value);
		if (!Number.isFinite(numeric)) continue;
		if (numeric < lo) lo = numeric;
		if (numeric > hi) hi = numeric;
	}
	if (lo === Number.POSITIVE_INFINITY) return [0, 1];
	return lo === hi ? [lo - 1, hi + 1] : [lo, hi];
}

/** Center of a categorical band; point and continuous scales already map to the center. */
export function scaleCenter(scale: ChartScale, value: ChartValue): number {
	const mapped = scale(value);
	if (scale.kind !== 'band') return mapped;
	const bandwidth = scale.bandwidth();
	if (!bandwidth) return mapped;
	return mapped + (scale.range()[1] >= scale.range()[0] ? bandwidth / 2 : -bandwidth / 2);
}

function categoricalPosition(
	kind: 'point' | 'band',
	settings: ScaleSettings,
	count: number,
	range: [number, number],
	index: number
): number {
	const span = range[1] - range[0];
	if (count <= 0) return range[0];
	const step =
		kind === 'band'
			? span / Math.max(1, count - settings.paddingInner + 2 * settings.paddingOuter)
			: count > 1
				? span / (count - 1 + 2 * settings.padding)
				: 0;
	const start =
		kind === 'band'
			? range[0] + step * settings.paddingOuter
			: range[0] + (count > 1 ? step * settings.padding : span / 2);
	return start + index * step;
}

function mapValue(
	kind: ChartScaleKind,
	settings: ScaleSettings,
	values: readonly ChartValue[],
	range: [number, number],
	value: ChartValue
): number {
	if (kind === 'point' || kind === 'band') {
		const index = values.findIndex((candidate) => keyOf(candidate) === keyOf(value));
		if (index < 0) return Number.NaN;
		return categoricalPosition(kind, settings, values.length, range, index);
	}
	const [domainStart, domainEnd] = numericDomain(values);
	const numeric = toNumber(value);
	if (!Number.isFinite(numeric) || domainStart === domainEnd) return range[0];
	return range[0] + ((numeric - domainStart) / (domainEnd - domainStart)) * (range[1] - range[0]);
}

function createScale<TValue extends ChartValue>(
	kind: ChartScaleKind,
	settings: ScaleSettings
): ChartScale<TValue> {
	let values: TValue[] = [];
	let rangeValues: [number, number] = [0, 1];

	const scale = ((value: ChartValue) =>
		mapValue(kind, settings, values, rangeValues, value)) as ChartScale<TValue>;
	scale.kind = kind;

	const domain = (next?: readonly TValue[]): TValue[] | ChartScale<TValue> => {
		if (next === undefined) return values.slice();
		values = [...next];
		return scale;
	};
	scale.domain = domain as ChartScale<TValue>['domain'];

	const range = (next?: readonly [number, number]): [number, number] | ChartScale<TValue> => {
		if (next === undefined) return [rangeValues[0], rangeValues[1]];
		rangeValues = [next[0], next[1]];
		return scale;
	};
	scale.range = range as ChartScale<TValue>['range'];

	scale.bandwidth = () => {
		if (kind !== 'band' || !values.length) return 0;
		const span = Math.abs(rangeValues[1] - rangeValues[0]);
		const step = span / Math.max(1, values.length - settings.paddingInner + 2 * settings.paddingOuter);
		return step * (1 - settings.paddingInner);
	};

	scale.step = () => {
		if (!values.length) return 0;
		const span = rangeValues[1] - rangeValues[0];
		if (kind === 'band') {
			return Math.abs(span) / Math.max(1, values.length - settings.paddingInner + 2 * settings.paddingOuter);
		}
		if (kind === 'point') {
			return values.length > 1 ? Math.abs(span) / (values.length - 1 + 2 * settings.padding) : 0;
		}
		return 0;
	};

	const padding = (next?: number): number | ChartScale<TValue> => {
		if (next === undefined) return kind === 'band' ? settings.paddingInner : settings.padding;
		settings.padding = next;
		if (kind === 'band') settings.paddingInner = next;
		return scale;
	};
	scale.padding = padding as ChartScale<TValue>['padding'];

	scale.ticks = (count = 5) => {
		if (kind === 'linear' || kind === 'time') {
			const [lo, hi] = numericDomain(values);
			const numbers = kind === 'time' ? timeTicks(lo, hi, count) : niceTicks(lo, hi, count);
			return numbers.map((numeric) => {
				const value = (kind === 'time' ? new Date(numeric) : numeric) as ChartValue;
				return {
					value,
					position: scale(value),
					label: formatChartValue(value)
				};
			});
		}
		return values.map((value) => ({
			value,
			position: scaleCenter(scale, value),
			label: formatChartValue(value)
		}));
	};

	scale.nice = (count = 5) => {
		if (kind !== 'linear' && kind !== 'time') return scale;
		const [lo, hi] = numericDomain(values);
		const [niceStart, niceEnd] = niceExtent(lo, hi, count);
		values =
			kind === 'time'
				? ([new Date(niceStart), new Date(niceEnd)] as unknown as TValue[])
				: ([niceStart, niceEnd] as unknown as TValue[]);
		return scale;
	};

	scale.copy = (() => {
		const next = createScale<TValue>(kind, { ...settings });
		next.domain(values);
		next.range(rangeValues);
		return next;
	}) as ChartScale<TValue>['copy'];

	return scale;
}

export function scaleLinear(): ChartScale {
	return createScale<ChartValue>('linear', {
		padding: 0,
		paddingInner: 0,
		paddingOuter: 0
	});
}

export function scaleTime(): ChartScale {
	return createScale<ChartValue>('time', {
		padding: 0,
		paddingInner: 0,
		paddingOuter: 0
	});
}

export function scalePoint<TValue extends ChartValue = ChartValue>(
	options: PointScaleOptions = {}
): ChartScale<TValue> {
	return createScale<TValue>('point', {
		padding: options.padding ?? 0,
		paddingInner: 0,
		paddingOuter: 0
	});
}

export function scaleBand<TValue extends ChartValue = ChartValue>(
	options: BandScaleOptions = {}
): ChartScale<TValue> {
	const padding = options.padding;
	return createScale<TValue>('band', {
		padding: 0,
		paddingInner: padding ?? options.paddingInner ?? 0,
		paddingOuter: padding ?? options.paddingOuter ?? 0
	});
}
