export interface SliderPoint {
	x: number;
	y: number;
}

export interface SliderRect {
	x: number;
	y: number;
	width: number;
	height: number;
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
	midX: number;
	midY: number;
	center: SliderPoint;
}

export interface SliderValueRange {
	min: number;
	max: number;
	value: number;
}

const { abs, floor, max, min, pow, round, sign } = Math;

const keyMap: Record<string, string> = {
	Up: 'ArrowUp',
	Down: 'ArrowDown',
	Left: 'ArrowLeft',
	Right: 'ArrowRight',
	Esc: 'Escape',
	' ': 'Space'
};

const rtlKeyMap: Record<string, string> = {
	ArrowLeft: 'ArrowRight',
	ArrowRight: 'ArrowLeft'
};

const pageKeys = new Set(['PageUp', 'PageDown']);
const arrowKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

export const nan = (value: number) => (Number.isNaN(value) ? 0 : value);

export const clampValue = (value: number, minValue: number, maxValue: number) =>
	min(max(nan(value), minValue), maxValue);

export const clampPercent = (value: number) => clampValue(value, 0, 1);

export const getValuePercent = (value: number, minValue: number, maxValue: number) =>
	(nan(value) - minValue) / (maxValue - minValue);

export const roundValue = (value: number, minValue: number, step: number) =>
	round((nan(value) - minValue) / step) * step + minValue;

export const getPercentValue = (
	percent: number,
	minValue: number,
	maxValue: number,
	step: number
) => clampValue(roundValue(percent * (maxValue - minValue) + minValue, minValue, step), minValue, maxValue);

export const countDecimals = (value: number) => {
	if (!Number.isFinite(value)) return 0;
	let exponent = 1;
	let count = 0;
	while (Math.round(value * exponent) / exponent !== value) {
		exponent *= 10;
		count += 1;
	}
	return count;
};

export const roundToStepPrecision = (value: number, step: number) => {
	const stepString = step.toString();
	const dotIndex = stepString.indexOf('.');
	const precision = dotIndex >= 0 ? stepString.length - dotIndex : 0;
	if (precision <= 0) return value;
	const factor = pow(10, precision);
	return round(value * factor) / factor;
};

export function snapValueToStep(value: number, minValue: number, maxValue: number, step: number) {
	const low = minValue != null ? Number(minValue) : 0;
	const high = Number(maxValue);
	const remainder = (value - low) % step;
	let snapped =
		abs(remainder) * 2 >= step ? value + sign(remainder) * (step - abs(remainder)) : value - remainder;
	snapped = roundToStepPrecision(snapped, step);
	if (!Number.isNaN(low) && snapped < low) {
		snapped = low;
	} else if (!Number.isNaN(high) && snapped > high) {
		const scale = pow(10, Math.max(countDecimals(low), countDecimals(high), countDecimals(step)));
		const stepsInRange = floor((round(high * scale) - round(low * scale)) / round(step * scale));
		const largestValidStep = low + stepsInRange * step;
		snapped = stepsInRange <= 0 || largestValidStep < low ? high : largestValidStep;
	}
	return roundToStepPrecision(snapped, step);
}

export const setValueAtIndex = (values: number[], index: number, value: number) => {
	if (values[index] === value) return values;
	return [...values.slice(0, index), value, ...values.slice(index + 1)];
};

export const getValueRanges = (
	values: number[],
	minValue: number,
	maxValue: number,
	gap = 0
): SliderValueRange[] =>
	values.map((value, index) => ({
		min: index === 0 ? minValue : values[index - 1] + gap,
		max: index === values.length - 1 ? maxValue : values[index + 1] - gap,
		value
	}));

export const getValueTransformer = ([a, b]: [number, number], [c, d]: [number, number]) => {
	return (value: number) => (a === b || c === d ? c : c + ((d - c) / (b - a)) * (value - a));
};

export interface SliderStepContext {
	values: number[];
	min: number;
	max: number;
	step: number;
}

function getValueSetterAtIndex(index: number, ctx: SliderStepContext) {
	const { values, min: minValue, max: maxValue, step } = ctx;
	const minValueAtIndex = index === 0 ? minValue : values[index - 1];
	const maxValueAtIndex = index === values.length - 1 ? maxValue : values[index + 1];
	let nextValues = values.slice();
	return (value: number) => {
		nextValues = setValueAtIndex(nextValues, index, value);
		nextValues[index] = snapValueToStep(value, minValueAtIndex, maxValueAtIndex, step);
		return nextValues;
	};
}

export const getNextStepValue = (index: number, ctx: SliderStepContext) =>
	getValueSetterAtIndex(index, ctx)(ctx.values[index] + ctx.step);

export const getPreviousStepValue = (index: number, ctx: SliderStepContext) =>
	getValueSetterAtIndex(index, ctx)(ctx.values[index] - ctx.step);

export const getPointAngle = (rect: SliderRect, point: SliderPoint, reference = rect.center) => {
	const x = point.x - reference.x;
	const y = point.y - reference.y;
	return 360 - (Math.atan2(x, y) * (180 / Math.PI) + 180);
};

export const createRect = (rect: {
	x: number;
	y: number;
	width: number;
	height: number;
}): SliderRect => {
	const { x, y, width, height } = rect;
	const midX = x + width / 2;
	const midY = y + height / 2;
	return {
		x,
		y,
		width,
		height,
		minX: x,
		minY: y,
		maxX: x + width,
		maxY: y + height,
		midX,
		midY,
		center: { x: midX, y: midY }
	};
};

export function getEventKey(
	event: Pick<KeyboardEvent, 'key'>,
	options: { dir?: 'ltr' | 'rtl' | 'auto' | null; orientation?: 'horizontal' | 'vertical' } = {}
) {
	const { dir = 'ltr', orientation = 'horizontal' } = options;
	let key = event.key;
	key = keyMap[key] ?? key;
	if (dir === 'rtl' && orientation === 'horizontal' && key in rtlKeyMap) key = rtlKeyMap[key];
	return key;
}

export const getEventStep = (event: Pick<KeyboardEvent, 'key' | 'shiftKey'>) =>
	pageKeys.has(event.key) || (event.shiftKey && arrowKeys.has(event.key)) ? 10 : 1;

export const getEventStepValue = (
	event: Pick<KeyboardEvent, 'key' | 'shiftKey' | 'altKey'>,
	options: { step: number; largeStep: number; smallStep?: number }
) => {
	const { step, largeStep, smallStep } = options;
	const isArrowKey = arrowKeys.has(event.key);
	if (smallStep != null && event.altKey && isArrowKey) return smallStep;
	return pageKeys.has(event.key) || (event.shiftKey && isArrowKey) ? largeStep : step;
};

export const isLeftClick = (event: Pick<PointerEvent, 'button'>) => event.button === 0;

export const isModifierKey = (event: Pick<KeyboardEvent, 'ctrlKey' | 'altKey' | 'metaKey'>) =>
	event.ctrlKey || event.altKey || event.metaKey;

export const isCtrlOrMetaKey = (event: Pick<KeyboardEvent, 'ctrlKey' | 'metaKey'>) =>
	event.ctrlKey || event.metaKey;

export type StyleValue = string | number | undefined | null;

export function serializeStyle(style: Record<string, StyleValue>) {
	return Object.entries(style)
		.filter(([, value]) => value !== undefined && value !== null && value !== '')
		.map(([name, value]) => `${name}: ${value}`)
		.join('; ');
}
