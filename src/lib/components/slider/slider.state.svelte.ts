import { createContext } from '../../internal/context';
import { dataAttr, toPx } from '../../internal/dom';
import {
	clampPercent,
	clampValue,
	getEventKey,
	getEventStepValue,
	getNextStepValue,
	getPercentValue,
	getPreviousStepValue,
	getValuePercent,
	getValueRanges,
	getValueTransformer,
	isLeftClick,
	isModifierKey,
	serializeStyle,
	setValueAtIndex,
	snapValueToStep,
	type SliderPoint,
	type SliderValueRange
} from './slider.math';

const ariaAttr = (value: unknown): true | undefined => (value ? true : undefined);

export type SliderOrientation = 'horizontal' | 'vertical';
export type SliderOrigin = 'start' | 'center' | 'end';
export type SliderThumbAlignment = 'center' | 'contain';
export type SliderThumbCollisionBehavior = 'none' | 'push' | 'swap';

export interface SliderThumbSize {
	width: number;
	height: number;
}

export interface SliderValueChangeDetails {
	value: number[];
}

export interface SliderValueChangeEndDetails {
	value: number[];
}

export interface SliderFocusChangeDetails {
	focusedIndex: number;
	value: number[];
}

export interface SliderIds {
	root?: string;
	thumb?: (index: number) => string;
	hiddenInput?: (index: number) => string;
	control?: string;
	track?: string;
	range?: string;
	label?: string;
	valueText?: string;
	marker?: (value: number) => string;
}

export interface UseSliderProps {
	'aria-label'?: string | string[];
	'aria-labelledby'?: string | string[];
	value?: number[];
	defaultValue?: number[];
	min?: number;
	max?: number;
	step?: number;
	largeStep?: number;
	minStepsBetweenThumbs?: number;
	orientation?: SliderOrientation;
	origin?: SliderOrigin;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	disabled?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	name?: string;
	form?: string;
	id?: string | null;
	ids?: SliderIds;
	thumbAlignment?: SliderThumbAlignment;
	thumbCollisionBehavior?: SliderThumbCollisionBehavior;
	thumbSize?: SliderThumbSize;
	getAriaValueText?: (details: { value: number; index: number }) => string;
	onValueChange?: (details: SliderValueChangeDetails) => void;
	onValueChangeEnd?: (details: SliderValueChangeEndDetails) => void;
	onFocusChange?: (details: SliderFocusChangeDetails) => void;
}

export interface SliderThumbAttrsOptions {
	name?: string;
}

export interface SliderApi {
	readonly value: number[];
	readonly dragging: boolean;
	readonly focused: boolean;
	readonly focusedIndex: number;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly invalid: boolean;
	readonly orientation: SliderOrientation;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null;
	readonly min: number;
	readonly max: number;
	readonly step: number;
	readonly largeStep: number;
	readonly rootId: string;
	readonly labelId: string;
	readonly valueTextId: string;
	readonly controlId: string;
	readonly trackId: string;
	readonly rangeId: string;
	thumbId(index: number): string;
	hiddenInputId(index: number): string;
	markerId(value: number): string;
	thumbValue(index: number): number;
	thumbPercent(index: number): number;
	thumbMin(index: number): number;
	thumbMax(index: number): number;
	setValue(next: number[]): void;
	setThumbValue(index: number, next: number): void;
	setThumbPercent(index: number, percent: number): void;
	increment(index?: number): void;
	decrement(index?: number): void;
	focus(): void;
	setControlRef(node: Element | null): void;
	measureThumbSize(): void;
	onControlPointerDown(event: PointerEvent): void;
	onLabelClick(event: MouseEvent): void;
	onThumbPointerDown(index: number, event: PointerEvent): void;
	onThumbFocus(index: number): void;
	onThumbBlur(): void;
	onThumbKeyDown(index: number, event: KeyboardEvent): void;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	valueTextAttrs(): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	trackAttrs(): Record<string, unknown>;
	rangeAttrs(): Record<string, unknown>;
	thumbAttrs(index: number, options?: SliderThumbAttrsOptions): Record<string, unknown>;
	markerGroupAttrs(): Record<string, unknown>;
	markerAttrs(value: number): Record<string, unknown>;
	draggingIndicatorAttrs(index?: number): Record<string, unknown>;
	hiddenInputAttrs(index: number, options?: SliderThumbAttrsOptions): Record<string, unknown>;
}

export interface SliderThumbContextValue {
	readonly index: number;
}

const sliderContext = createContext<SliderApi>('Slider', 'Slider.Root');
export const useSliderContext = () => sliderContext.get();
export const setSliderContext = (api: SliderApi) => sliderContext.set(api);

const sliderThumbContext = createContext<SliderThumbContextValue>(
	'SliderThumb',
	'Slider.Thumb'
);
export const useSliderThumbContext = () => sliderThumbContext.use();
export const setSliderThumbContext = (value: SliderThumbContextValue) =>
	sliderThumbContext.set(value);

interface CollisionResult {
	values: number[];
	index: number;
	swapped: boolean;
}

interface CollisionContext {
	index: number;
	value: number;
	values: number[];
	min: number;
	max: number;
	gap: number;
}

const round = (value: number) => Math.round(value * 1e10) / 1e10;

function getThumbBounds(ctx: CollisionContext) {
	const { index, values, min, max, gap } = ctx;
	const prevThumb = values[index - 1];
	const nextThumb = values[index + 1];
	return {
		min: prevThumb != null ? prevThumb + gap : min,
		max: nextThumb != null ? nextThumb - gap : max
	};
}

function handleNone(ctx: CollisionContext): CollisionResult {
	const bounds = getThumbBounds(ctx);
	const values = ctx.values.slice();
	values[ctx.index] = round(clampValue(ctx.value, bounds.min, bounds.max));
	return { values, index: ctx.index, swapped: false };
}

function handlePush(ctx: CollisionContext): CollisionResult {
	const { index, value, values, min, max, gap } = ctx;
	const next = values.slice();
	const absoluteMin = min + index * gap;
	const absoluteMax = max - (values.length - 1 - index) * gap;
	next[index] = round(clampValue(value, absoluteMin, absoluteMax));
	for (let i = index + 1; i < values.length; i++) {
		const minAllowed = next[i - 1] + gap;
		if (next[i] < minAllowed) next[i] = round(minAllowed);
	}
	for (let i = index - 1; i >= 0; i--) {
		const maxAllowed = next[i + 1] - gap;
		if (next[i] > maxAllowed) next[i] = round(maxAllowed);
	}
	return { values: next, index, swapped: false };
}

function handleSwap(ctx: CollisionContext, startValue: number): CollisionResult {
	const { index, value, values, gap } = ctx;
	const prevThumb = values[index - 1];
	const nextThumb = values[index + 1];
	const crossingNext = nextThumb != null && value >= nextThumb && value > startValue;
	const crossingPrev = prevThumb != null && value <= prevThumb && value < startValue;
	if (!crossingNext && !crossingPrev) return handleNone(ctx);
	const swapIndex = crossingNext ? index + 1 : index - 1;
	const next = values.slice();
	const bounds = getThumbBounds({ ...ctx, index: swapIndex });
	next[swapIndex] = round(clampValue(value, bounds.min, bounds.max));
	next[index] = values[swapIndex];
	if (crossingNext && next[index] > next[swapIndex] - gap) next[index] = round(next[swapIndex] - gap);
	else if (crossingPrev && next[index] < next[swapIndex] + gap) next[index] = round(next[swapIndex] + gap);
	return { values: next, index: swapIndex, swapped: true };
}

function getRangeOffsets(
	value: number[],
	percent: number[],
	origin: SliderOrigin
): { start: string; end: string } {
	const firstPercent = percent[0];
	const lastPercent = percent[percent.length - 1];
	if (percent.length === 1) {
		if (origin === 'center') {
			const isNegative = percent[0] < 50;
			return {
				start: isNegative ? `${percent[0]}%` : '50%',
				end: isNegative ? '50%' : `${100 - percent[0]}%`
			};
		}
		if (origin === 'end') return { start: `${lastPercent}%`, end: '0%' };
		return { start: '0%', end: `${100 - lastPercent}%` };
	}
	return { start: `${firstPercent}%`, end: `${100 - lastPercent}%` };
}

export function createSlider(getProps: () => UseSliderProps, uid: string): SliderApi {
	const min = () => getProps().min ?? 0;
	const max = () => getProps().max ?? 100;
	const step = () => getProps().step ?? 1;
	const largeStep = () => getProps().largeStep ?? step() * 10;
	const minStepsBetweenThumbs = () => getProps().minStepsBetweenThumbs ?? 0;
	const gap = () => minStepsBetweenThumbs() * step();
	const orientation = (): SliderOrientation => getProps().orientation ?? 'horizontal';
	const origin = (): SliderOrigin => getProps().origin ?? 'start';
	const dir = () => getProps().dir ?? null;
	const isHorizontal = () => orientation() === 'horizontal';
	const isVertical = () => orientation() === 'vertical';
	const isRtl = () => isHorizontal() && dir() === 'rtl';
	const disabled = () => !!getProps().disabled;
	const readOnly = () => !!getProps().readOnly;
	const interactive = () => !readOnly() && !disabled();
	const thumbAlignment = (): SliderThumbAlignment => getProps().thumbAlignment ?? 'contain';
	const collisionBehavior = (): SliderThumbCollisionBehavior =>
		getProps().thumbCollisionBehavior ?? 'none';

	const rootId = () => getProps().ids?.root ?? getProps().id ?? `slider:${uid}`;
	const thumbId = (index: number) =>
		getProps().ids?.thumb?.(index) ?? `slider:${uid}:thumb:${index}`;
	const hiddenInputId = (index: number) =>
		getProps().ids?.hiddenInput?.(index) ?? `slider:${uid}:input:${index}`;
	const controlId = () => getProps().ids?.control ?? `slider:${uid}:control`;
	const trackId = () => getProps().ids?.track ?? `slider:${uid}:track`;
	const rangeId = () => getProps().ids?.range ?? `slider:${uid}:range`;
	const labelId = () => getProps().ids?.label ?? `slider:${uid}:label`;
	const valueTextId = () => getProps().ids?.valueText ?? `slider:${uid}:value-text`;
	const markerId = (value: number) =>
		getProps().ids?.marker?.(value) ?? `slider:${uid}:marker:${value}`;

	function normalizeValues(values: number[]): number[] {
		const ranges = getValueRanges(values, min(), max(), gap());
		return values.map((candidate, index) => constrainValue(candidate, index, ranges));
	}

	function constrainValue(
		candidate: number,
		index: number,
		ranges?: SliderValueRange[]
	): number {
		const range = (ranges ?? getValueRanges(value(), min(), max(), gap()))[index];
		const snapped = snapValueToStep(candidate, min(), max(), step());
		return range ? clampValue(snapped, range.min, range.max) : snapped;
	}

	const defaultValue = () => getProps().defaultValue ?? [min()];

	let internalValue = $state<number[]>(normalizeValues(defaultValue()));
	let internalFocusedIndex = $state(-1);
	let internalDragging = $state(false);
	let internalThumbSize = $state<SliderThumbSize | null>(getProps().thumbSize ?? null);

	let controlNode: HTMLElement | null = null;
	let resizeObserver: ResizeObserver | null = null;
	let dragOffset: SliderPoint | null = null;
	let dragStartValue: number[] | null = null;

	const controlled = () => getProps().value !== undefined;
	const value = () => (controlled() ? (getProps().value as number[]) : internalValue);
	const thumbSize = () => getProps().thumbSize ?? internalThumbSize;
	const dragging = () => internalDragging;
	const focusedIndex = () => internalFocusedIndex;
	const focused = () => !internalDragging && internalFocusedIndex >= 0;
	const percentages = () =>
		value().map((thumbValue) => getValuePercent(thumbValue, min(), max()) * 100);

	function rangeAtIndex(index: number) {
		return getValueRanges(value(), min(), max(), gap())[index];
	}

	function setFocusedIndex(index: number) {
		const next = selectMovableThumb(index);
		if (next === internalFocusedIndex) return;
		internalFocusedIndex = next;
		getProps().onFocusChange?.({ focusedIndex: next, value: value() });
	}

	function clearFocusedIndex() {
		if (internalFocusedIndex === -1) return;
		internalFocusedIndex = -1;
		getProps().onFocusChange?.({ focusedIndex: -1, value: value() });
	}

	function selectMovableThumb(index: number) {
		const values = value();
		if (values[index] === max()) {
			let movableIndex = index;
			while (movableIndex > 0 && values[movableIndex - 1] === max()) movableIndex -= 1;
			return movableIndex;
		}
		return index;
	}

	function setValue(next: number[]) {
		const normalized = normalizeValues(next);
		if (isEqualValues(normalized, value())) return;
		if (!controlled()) internalValue = normalized;
		getProps().onValueChange?.({ value: normalized });
	}

	function isEqualValues(a: number[], b: number[]) {
		return a.length === b.length && a.every((item, index) => item === b[index]);
	}

	function invokeOnChangeEnd() {
		queueMicrotask(() => getProps().onValueChangeEnd?.({ value: value() }));
	}

	function activeIndex(index?: number) {
		return index ?? (internalFocusedIndex >= 0 ? internalFocusedIndex : 0);
	}

	function increment(index?: number, amount?: number) {
		const target = activeIndex(index);
		const range = rangeAtIndex(target);
		if (!range) return;
		const next = getNextStepValue(target, {
			values: value(),
			min: range.min,
			max: range.max,
			step: amount ?? step()
		});
		next[target] = clampValue(next[target], range.min, range.max);
		setValue(next);
		invokeOnChangeEnd();
	}

	function decrement(index?: number, amount?: number) {
		const target = activeIndex(index);
		const range = rangeAtIndex(target);
		if (!range) return;
		const next = getPreviousStepValue(target, {
			values: value(),
			min: range.min,
			max: range.max,
			step: amount ?? step()
		});
		next[target] = clampValue(next[target], range.min, range.max);
		setValue(next);
		invokeOnChangeEnd();
	}

	function setToBound(index: number, bound: 'min' | 'max') {
		const range = rangeAtIndex(index);
		if (!range) return;
		setValue(setValueAtIndex(value(), index, range[bound]));
		invokeOnChangeEnd();
	}

	function thumbElement(index: number) {
		return controlNode?.querySelector<HTMLElement>(`[role="slider"][data-index="${index}"]`) ?? null;
	}

	function focusThumb(index: number) {
		thumbElement(index)?.focus({ preventScroll: true });
	}

	function thumbInset() {
		if (thumbAlignment() === 'center') return 0;
		const size = thumbSize();
		if (!size) return 0;
		return (isVertical() ? size.height : size.width) / 2;
	}

	function getPointValue(point: SliderPoint) {
		if (!controlNode) return undefined;
		const rect = controlNode.getBoundingClientRect();
		const inset = thumbInset();
		const x = point.x - (dragOffset?.x ?? 0);
		const y = point.y - (dragOffset?.y ?? 0);
		const effectiveWidth = rect.width - inset * 2;
		const effectiveHeight = rect.height - inset * 2;
		const percentX = effectiveWidth > 0 ? clampPercent((x - (rect.left + inset)) / effectiveWidth) : 0;
		const percentY =
			effectiveHeight > 0 ? clampPercent((y - (rect.top + inset)) / effectiveHeight) : 0;
		const percent = isHorizontal() ? (isRtl() ? 1 - percentX : percentX) : 1 - percentY;
		return getPercentValue(percent, min(), max(), step());
	}

	function getClosestIndex(pointValue: number) {
		const values = value();
		let closestIndex = 0;
		let minDistance = Math.abs(values[0] - pointValue);
		for (let index = 1; index < values.length; index++) {
			const distance = Math.abs(values[index] - pointValue);
			if (distance <= minDistance) {
				closestIndex = index;
				minDistance = distance;
			}
		}
		return selectMovableThumb(closestIndex);
	}

	function resolveThumbCollision(
		behavior: SliderThumbCollisionBehavior,
		index: number,
		nextValue: number,
		values: number[],
		startValue?: number
	): CollisionResult {
		if (values.length === 1) {
			return { values: [round(clampValue(nextValue, min(), max()))], index: 0, swapped: false };
		}
		const ctx: CollisionContext = {
			index,
			value: nextValue,
			values,
			min: min(),
			max: max(),
			gap: gap()
		};
		if (behavior === 'push') return handlePush(ctx);
		if (behavior === 'swap') return handleSwap(ctx, startValue ?? values[index]);
		return handleNone(ctx);
	}

	function applyPointerValue(pointValue: number) {
		const index = internalFocusedIndex;
		if (index < 0) return;
		const result = resolveThumbCollision(
			collisionBehavior(),
			index,
			pointValue,
			value(),
			dragStartValue?.[index]
		);
		if (result.swapped) internalFocusedIndex = result.index;
		setValue(result.values);
	}

	let syncedValueHash: string | null = null;

	const docListeners = (() => {
		let target: Document | null = null;

		function onPointerMove(event: PointerEvent) {
			if (!internalDragging) return;
			const pointValue = getPointValue({ x: event.clientX, y: event.clientY });
			if (pointValue == null) return;
			applyPointerValue(pointValue);
		}

		function stopListening() {
			if (!target) return;
			target.removeEventListener('pointermove', onPointerMove);
			target.removeEventListener('pointerup', onPointerUp);
			target.removeEventListener('pointercancel', onPointerCancel);
			target = null;
		}

		function endDrag(cancel: boolean) {
			if (!internalDragging) return;
			internalDragging = false;
			dragOffset = null;
			dragStartValue = null;
			stopListening();
			if (cancel) clearFocusedIndex();
			else invokeOnChangeEnd();
		}

		function onPointerUp() {
			endDrag(false);
		}

		function onPointerCancel() {
			endDrag(true);
		}

		return {
			stop() {
				stopListening();
			},
			start() {
				stopListening();
				const doc = controlNode?.ownerDocument ?? (typeof document !== 'undefined' ? document : null);
				if (!doc) return;
				target = doc;
				doc.addEventListener('pointermove', onPointerMove);
				doc.addEventListener('pointerup', onPointerUp);
				doc.addEventListener('pointercancel', onPointerCancel);
			}
		};
	})();

	function cancelDrag() {
		internalDragging = false;
		dragOffset = null;
		dragStartValue = null;
		docListeners.stop();
	}

	$effect(() => {
		const values = value();
		const hash = values.join(',');
		if (hash === syncedValueHash) return;
		const isFirstRun = syncedValueHash === null;
		syncedValueHash = hash;
		if (isFirstRun) return;
		const doc = controlNode?.ownerDocument ?? (typeof document !== 'undefined' ? document : null);
		if (!doc) return;
		const ViewEvent = doc.defaultView?.Event ?? Event;
		values.forEach((thumbValue, index) => {
			const input = doc.getElementById(hiddenInputId(index));
			if (!(input instanceof HTMLInputElement)) return;
			input.value = String(thumbValue);
			input.dispatchEvent(new ViewEvent('input', { bubbles: true }));
		});
	});

	function onControlPointerDown(event: PointerEvent) {
		if (!interactive()) return;
		if (!isLeftClick(event)) return;
		if (isModifierKey(event)) return;
		dragStartValue = value().slice();
		const pointValue = getPointValue({ x: event.clientX, y: event.clientY });
		if (pointValue != null) setFocusedIndex(getClosestIndex(pointValue));
		internalDragging = true;
		docListeners.start();
		if (pointValue != null) applyPointerValue(pointValue);
		focusThumb(internalFocusedIndex);
		event.preventDefault();
		event.stopPropagation();
	}

	function onThumbPointerDown(index: number, event: PointerEvent) {
		if (!interactive()) return;
		if (!isLeftClick(event)) return;
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		dragOffset = {
			x: event.clientX - (rect.left + rect.width / 2),
			y: event.clientY - (rect.top + rect.height / 2)
		};
		setFocusedIndex(index);
		dragStartValue = value().slice();
		internalDragging = true;
		docListeners.start();
		focusThumb(index);
		event.stopPropagation();
	}

	function onThumbKeyDown(index: number, event: KeyboardEvent) {
		if (event.defaultPrevented) return;
		if (!interactive()) return;
		const amount = getEventStepValue(event, { step: step(), largeStep: largeStep() });
		const key = getEventKey(event, { dir: dir(), orientation: orientation() });
		switch (key) {
			case 'ArrowUp':
				if (isVertical()) increment(index, amount);
				break;
			case 'ArrowDown':
				if (isVertical()) decrement(index, amount);
				break;
			case 'ArrowLeft':
				if (isHorizontal()) decrement(index, amount);
				break;
			case 'ArrowRight':
				if (isHorizontal()) increment(index, amount);
				break;
			case 'PageUp':
				increment(index, amount);
				break;
			case 'PageDown':
				decrement(index, amount);
				break;
			case 'Home':
				setToBound(index, 'min');
				break;
			case 'End':
				setToBound(index, 'max');
				break;
			default:
				return;
		}
		event.preventDefault();
		event.stopPropagation();
	}

	function measureThumbSize() {
		if (!controlNode) return;
		const thumbs = controlNode.querySelectorAll<HTMLElement>('[role="slider"]');
		if (!thumbs.length) return;
		let width = 0;
		let height = 0;
		thumbs.forEach((thumb) => {
			width = Math.max(width, thumb.offsetWidth);
			height = Math.max(height, thumb.offsetHeight);
		});
		const current = internalThumbSize;
		if (current && current.width === width && current.height === height) return;
		internalThumbSize = { width, height };
	}

	function getThumbOffset(thumbValue: number) {
		const percent = getValuePercent(thumbValue, min(), max()) * 100;
		if (thumbAlignment() === 'center') return `${percent}%`;
		const size = thumbSize();
		const sizeValue = (isVertical() ? size?.height : size?.width) ?? 0;
		const getValue = isRtl()
			? getValueTransformer([max(), min()], [-sizeValue / 2, sizeValue / 2])
			: getValueTransformer([min(), max()], [-sizeValue / 2, sizeValue / 2]);
		const raw = parseFloat(getValue(thumbValue).toFixed(2));
		return `calc(${percent}% - ${isRtl() ? -1 * raw : raw}px)`;
	}

	function getVisibility() {
		return thumbAlignment() === 'contain' && !thumbSize() ? 'hidden' : 'visible';
	}

	function thumbStyle(index: number) {
		return serializeStyle({
			visibility: getVisibility(),
			position: 'absolute',
			transform: 'var(--slider-thumb-transform)',
			[isVertical() ? 'bottom' : 'inset-inline-start']: `var(--slider-thumb-offset-${index})`,
			'z-index': focusedIndex() === index ? 1 : undefined
		});
	}

	function edgeState(markerValue: number) {
		const values = value();
		if (markerValue < values[0]) return 'under-value';
		if (markerValue > values[values.length - 1]) return 'over-value';
		return 'at-value';
	}

	return {
		get value() {
			return value();
		},
		get dragging() {
			return dragging();
		},
		get focused() {
			return focused();
		},
		get focusedIndex() {
			return focusedIndex();
		},
		get disabled() {
			return disabled();
		},
		get readOnly() {
			return readOnly();
		},
		get invalid() {
			return !!getProps().invalid;
		},
		get orientation() {
			return orientation();
		},
		get dir() {
			return dir();
		},
		get min() {
			return min();
		},
		get max() {
			return max();
		},
		get step() {
			return step();
		},
		get largeStep() {
			return largeStep();
		},
		get rootId() {
			return rootId();
		},
		get labelId() {
			return labelId();
		},
		get valueTextId() {
			return valueTextId();
		},
		get controlId() {
			return controlId();
		},
		get trackId() {
			return trackId();
		},
		get rangeId() {
			return rangeId();
		},
		thumbId,
		hiddenInputId,
		markerId,
		thumbValue: (index) => value()[index],
		thumbPercent: (index) => getValuePercent(value()[index], min(), max()),
		thumbMin: (index) => rangeAtIndex(index)?.min ?? min(),
		thumbMax: (index) => rangeAtIndex(index)?.max ?? max(),
		setValue,
		setThumbValue(index, next) {
			setValue(setValueAtIndex(value(), index, constrainValue(next, index)));
			invokeOnChangeEnd();
		},
		setThumbPercent(index, percent) {
			const next = getPercentValue(percent, min(), max(), step());
			setValue(setValueAtIndex(value(), index, constrainValue(next, index)));
			invokeOnChangeEnd();
		},
		increment,
		decrement,
		focus() {
			if (!interactive()) return;
			setFocusedIndex(0);
			focusThumb(0);
		},
		setControlRef(node) {
			const element = node instanceof HTMLElement ? node : null;
			if (controlNode === element) return;
			resizeObserver?.disconnect();
			resizeObserver = null;
			controlNode = element;
			if (!element) {
				cancelDrag();
				return;
			}
			if (thumbAlignment() === 'center' || getProps().thumbSize) return;
			measureThumbSize();
			const Observer = element.ownerDocument.defaultView?.ResizeObserver;
			if (!Observer) return;
			resizeObserver = new Observer(() => measureThumbSize());
			resizeObserver.observe(element);
			element.querySelectorAll('[role="slider"]').forEach((thumb) => resizeObserver?.observe(thumb));
		},
		measureThumbSize,
		onControlPointerDown,
		onLabelClick(event) {
			if (!interactive()) return;
			event.preventDefault();
			focusThumb(0);
		},
		onThumbPointerDown,
		onThumbFocus(index) {
			if (!interactive()) return;
			setFocusedIndex(index);
		},
		onThumbBlur() {
			if (!interactive()) return;
			clearFocusedIndex();
		},
		onThumbKeyDown,
		rootAttrs() {
			const style: Record<string, string | undefined> = {};
			value().forEach((thumbValue, index) => {
				style[`--slider-thumb-offset-${index}`] = getThumbOffset(thumbValue);
			});
			style['--slider-thumb-width'] = toPx(thumbSize()?.width);
			style['--slider-thumb-height'] = toPx(thumbSize()?.height);
			style['--slider-thumb-transform'] = isVertical()
				? 'translateY(50%)'
				: isRtl()
					? 'translateX(50%)'
					: 'translateX(-50%)';
			const range = getRangeOffsets(value(), percentages(), origin());
			style['--slider-range-start'] = range.start;
			style['--slider-range-end'] = range.end;
			return {
				id: rootId(),
				dir: dir() ?? undefined,
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-orientation': orientation(),
				'data-dragging': dataAttr(dragging()),
				'data-invalid': dataAttr(getProps().invalid),
				'data-focus': dataAttr(focused()),
				style: serializeStyle(style)
			};
		},
		labelAttrs() {
			return {
				id: labelId(),
				dir: dir() ?? undefined,
				for: hiddenInputId(0),
				'data-disabled': dataAttr(disabled()),
				'data-orientation': orientation(),
				'data-invalid': dataAttr(getProps().invalid),
				'data-dragging': dataAttr(dragging()),
				'data-focus': dataAttr(focused()),
				style: 'user-select: none; -webkit-user-select: none'
			};
		},
		valueTextAttrs() {
			return {
				id: valueTextId(),
				dir: dir() ?? undefined,
				'data-disabled': dataAttr(disabled()),
				'data-orientation': orientation(),
				'data-invalid': dataAttr(getProps().invalid),
				'data-focus': dataAttr(focused())
			};
		},
		controlAttrs() {
			return {
				id: controlId(),
				dir: dir() ?? undefined,
				'data-dragging': dataAttr(dragging()),
				'data-disabled': dataAttr(disabled()),
				'data-orientation': orientation(),
				'data-invalid': dataAttr(getProps().invalid),
				'data-focus': dataAttr(focused()),
				style:
					'touch-action: none; user-select: none; -webkit-user-select: none; position: relative'
			};
		},
		trackAttrs() {
			return {
				id: trackId(),
				dir: dir() ?? undefined,
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(getProps().invalid),
				'data-dragging': dataAttr(dragging()),
				'data-orientation': orientation(),
				'data-focus': dataAttr(focused()),
				style: 'position: relative'
			};
		},
		rangeAttrs() {
			return {
				id: rangeId(),
				dir: dir() ?? undefined,
				'data-dragging': dataAttr(dragging()),
				'data-focus': dataAttr(focused()),
				'data-invalid': dataAttr(getProps().invalid),
				'data-disabled': dataAttr(disabled()),
				'data-orientation': orientation(),
				style: isVertical()
					? 'position: absolute; bottom: var(--slider-range-start); top: var(--slider-range-end)'
					: serializeStyle({
							position: 'absolute',
							[isRtl() ? 'right' : 'left']: 'var(--slider-range-start)',
							[isRtl() ? 'left' : 'right']: 'var(--slider-range-end)'
						})
			};
		},
		thumbAttrs(index, options = {}) {
			const thumbValue = value()[index];
			const range = rangeAtIndex(index);
			const ariaLabel = getProps()['aria-label'];
			const ariaLabelledBy = getProps()['aria-labelledby'];
			return {
				id: thumbId(index),
				dir: dir() ?? undefined,
				role: 'slider',
				'data-index': index,
				'data-name': options.name,
				'data-disabled': dataAttr(disabled()),
				'data-orientation': orientation(),
				'data-focus': dataAttr(focused() && focusedIndex() === index),
				'data-dragging': dataAttr(dragging() && focusedIndex() === index),
				draggable: 'false',
				'aria-disabled': ariaAttr(disabled()),
				'aria-label': Array.isArray(ariaLabel) ? ariaLabel[index] : ariaLabel,
				'aria-labelledby':
					(Array.isArray(ariaLabelledBy) ? ariaLabelledBy[index] : ariaLabelledBy) ?? labelId(),
				'aria-orientation': orientation(),
				'aria-valuemax': range?.max ?? max(),
				'aria-valuemin': range?.min ?? min(),
				'aria-valuenow': thumbValue,
				'aria-valuetext': getProps().getAriaValueText?.({ value: thumbValue, index }),
				tabindex: disabled() ? undefined : 0,
				style: thumbStyle(index)
			};
		},
		markerGroupAttrs() {
			return {
				role: 'presentation',
				dir: dir() ?? undefined,
				'aria-hidden': 'true',
				'data-orientation': orientation(),
				style:
					'user-select: none; -webkit-user-select: none; pointer-events: none; position: relative'
			};
		},
		markerAttrs(markerValue) {
			return {
				id: markerId(markerValue),
				dir: dir() ?? undefined,
				role: 'presentation',
				'data-orientation': orientation(),
				'data-value': markerValue,
				'data-disabled': dataAttr(disabled()),
				'data-state': edgeState(markerValue),
				style: serializeStyle({
					visibility: getVisibility(),
					position: 'absolute',
					'pointer-events': 'none',
					[isHorizontal() ? 'inset-inline-start' : 'bottom']: getThumbOffset(markerValue),
					translate: 'var(--translate-x) var(--translate-y)',
					'--translate-x': isHorizontal() ? (isRtl() ? '50%' : '-50%') : '0%',
					'--translate-y': isHorizontal() ? '0%' : '50%'
				})
			};
		},
		draggingIndicatorAttrs(index = 0) {
			const isDragging = index === focusedIndex() && dragging();
			return {
				dir: dir() ?? undefined,
				role: 'presentation',
				hidden: !isDragging,
				'data-orientation': orientation(),
				'data-state': isDragging ? 'open' : 'closed',
				style: thumbStyle(index)
			};
		},
		hiddenInputAttrs(index, options = {}) {
			const name = getProps().name;
			return {
				id: hiddenInputId(index),
				name: options.name ?? (name ? name + (value().length > 1 ? '[]' : '') : undefined),
				form: getProps().form,
				type: 'text',
				hidden: true,
				value: String(value()[index])
			};
		}
	};
}
