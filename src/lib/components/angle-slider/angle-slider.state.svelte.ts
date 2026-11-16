import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import {
	createRect,
	getEventKey,
	getEventStep,
	getPointAngle,
	isLeftClick,
	serializeStyle,
	snapValueToStep,
	type SliderPoint
} from '../slider/slider.math';

export const ANGLE_SLIDER_MIN = 0;
export const ANGLE_SLIDER_MAX = 359;

export interface AngleSliderValueChangeDetails {
	value: number;
	valueAsDegree: string;
}

export interface AngleSliderValueChangeEndDetails {
	value: number;
	valueAsDegree: string;
}

export interface AngleSliderIds {
	root?: string;
	thumb?: string;
	hiddenInput?: string;
	control?: string;
	valueText?: string;
	label?: string;
}

export interface UseAngleSliderProps {
	'aria-label'?: string;
	'aria-labelledby'?: string;
	value?: number;
	defaultValue?: number;
	step?: number;
	disabled?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	name?: string;
	id?: string | null;
	ids?: AngleSliderIds;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	onValueChange?: (details: AngleSliderValueChangeDetails) => void;
	onValueChangeEnd?: (details: AngleSliderValueChangeEndDetails) => void;
}

export interface AngleSliderMarkerProps {
	value: number;
}

export interface AngleSliderApi {
	readonly value: number;
	readonly valueAsDegree: string;
	readonly displayAngle: number;
	readonly dragging: boolean;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly invalid: boolean;
	readonly step: number;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null;
	readonly rootId: string;
	readonly thumbId: string;
	readonly hiddenInputId: string;
	readonly controlId: string;
	readonly valueTextId: string;
	readonly labelId: string;
	setValue(next: number): void;
	increment(amount?: number): void;
	decrement(amount?: number): void;
	focus(): void;
	setControlRef(node: Element | null): void;
	setThumbRef(node: Element | null): void;
	onControlPointerDown(event: PointerEvent): void;
	onLabelClick(event: MouseEvent): void;
	onThumbKeyDown(event: KeyboardEvent): void;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	thumbAttrs(): Record<string, unknown>;
	valueTextAttrs(): Record<string, unknown>;
	markerGroupAttrs(): Record<string, unknown>;
	markerAttrs(props: AngleSliderMarkerProps): Record<string, unknown>;
	hiddenInputAttrs(): Record<string, unknown>;
}

const angleSliderContext = createContext<AngleSliderApi>('AngleSlider', 'AngleSlider.Root');
export const useAngleSliderContext = () => angleSliderContext.get();
export const setAngleSliderContext = (api: AngleSliderApi) => angleSliderContext.set(api);

export const mirrorAngle = (angle: number) => (360 - angle) % 360;

export function getDisplayAngle(value: number, dir?: 'ltr' | 'rtl' | 'auto' | null) {
	return dir === 'rtl' ? mirrorAngle(value) : value;
}

export const clampAngle = (degree: number) => Math.min(Math.max(degree, ANGLE_SLIDER_MIN), ANGLE_SLIDER_MAX);

export function constrainAngle(degree: number, step: number) {
	const clampedDegree = clampAngle(degree);
	const upperStep = Math.ceil(clampedDegree / step);
	const nearestStep = Math.round(clampedDegree / step);
	if (upperStep >= clampedDegree / step) {
		const stepped = upperStep * step;
		return stepped === ANGLE_SLIDER_MAX ? 0 : stepped;
	}
	return nearestStep * step;
}

export const snapAngleToStep = (value: number, step: number) =>
	snapValueToStep(value, ANGLE_SLIDER_MIN, ANGLE_SLIDER_MAX, step);

export function getAngle(
	controlEl: HTMLElement,
	point: SliderPoint,
	angularOffset?: number | null,
	dir?: 'ltr' | 'rtl' | 'auto' | null
) {
	const rect = createRect(controlEl.getBoundingClientRect());
	let angle = getPointAngle(rect, point);
	if (angularOffset != null) return angle - angularOffset;
	if (dir === 'rtl') angle = mirrorAngle(angle);
	return angle;
}

export function getPointerValue(
	controlEl: HTMLElement,
	point: SliderPoint,
	angularOffset: number | null,
	value: number,
	dir?: 'ltr' | 'rtl' | 'auto' | null
) {
	if (angularOffset == null) return getAngle(controlEl, point, null, dir);
	const angle = getAngle(controlEl, point);
	const clickAngle = value + angularOffset;
	return dir === 'rtl' ? value + clickAngle - angle : angle - angularOffset;
}

export function createAngleSlider(
	getProps: () => UseAngleSliderProps,
	uid: string
): AngleSliderApi {
	const step = () => getProps().step ?? 1;
	const dir = () => getProps().dir ?? null;
	const disabled = () => !!getProps().disabled;
	const readOnly = () => !!getProps().readOnly;
	const invalid = () => !!getProps().invalid;
	const interactive = () => !disabled() && !readOnly();

	const rootId = () => getProps().ids?.root ?? getProps().id ?? `angle-slider:${uid}`;
	const thumbId = () => getProps().ids?.thumb ?? `angle-slider:${uid}:thumb`;
	const hiddenInputId = () => getProps().ids?.hiddenInput ?? `angle-slider:${uid}:input`;
	const controlId = () => getProps().ids?.control ?? `angle-slider:${uid}:control`;
	const valueTextId = () => getProps().ids?.valueText ?? `angle-slider:${uid}:value-text`;
	const labelId = () => getProps().ids?.label ?? `angle-slider:${uid}:label`;

	const defaultValue = () => clampAngle(getProps().defaultValue ?? 0);
	let internalValue = $state(defaultValue());
	let internalDragging = $state(false);

	let controlNode: HTMLElement | null = null;
	let thumbNode: HTMLElement | null = null;
	let dragOffset: number | null = null;

	const controlled = () => getProps().value !== undefined;
	const value = () => (controlled() ? clampAngle(getProps().value as number) : internalValue);
	const valueAsDegree = () => `${value()}deg`;
	const displayAngle = () => getDisplayAngle(value(), dir());
	const dragging = () => internalDragging;

	function emitChange() {
		getProps().onValueChange?.({ value: value(), valueAsDegree: valueAsDegree() });
	}

	function setValue(next: number) {
		const clamped = clampAngle(next);
		if (clamped === value()) return;
		if (!controlled()) internalValue = clamped;
		emitChange();
	}

	function invokeOnChangeEnd() {
		queueMicrotask(() =>
			getProps().onValueChangeEnd?.({ value: value(), valueAsDegree: valueAsDegree() })
		);
	}

	function increment(amount?: number) {
		setValue(snapAngleToStep(value() + (amount ?? step()), amount ?? step()));
		invokeOnChangeEnd();
	}

	function decrement(amount?: number) {
		setValue(snapAngleToStep(value() - (amount ?? step()), amount ?? step()));
		invokeOnChangeEnd();
	}

	function focusThumb() {
		thumbNode?.focus({ preventScroll: true });
	}

	function applyPointerValue(controlEl: HTMLElement, point: SliderPoint) {
		const deg = getPointerValue(controlEl, point, dragOffset, value(), dir());
		setValue(constrainAngle(deg, step()));
	}

	const docListeners = (() => {
		let target: Document | null = null;

		function stopListening() {
			if (!target) return;
			target.removeEventListener('pointermove', onPointerMove);
			target.removeEventListener('pointerup', onPointerUp);
			target = null;
		}

		function onPointerMove(event: PointerEvent) {
			if (!internalDragging || !controlNode) return;
			applyPointerValue(controlNode, { x: event.clientX, y: event.clientY });
		}

		function onPointerUp() {
			if (!internalDragging) return;
			internalDragging = false;
			dragOffset = null;
			stopListening();
			invokeOnChangeEnd();
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
			}
		};
	})();

	function cancelDrag() {
		internalDragging = false;
		dragOffset = null;
		docListeners.stop();
	}

	function onControlPointerDown(event: PointerEvent) {
		if (!interactive()) return;
		if (!isLeftClick(event)) return;
		const controlEl = (controlNode ?? event.currentTarget) as HTMLElement;
		const point = { x: event.clientX, y: event.clientY };
		const composedPath = event.composedPath?.() ?? [];
		let angularOffset: number | null = null;
		if (thumbNode && composedPath.includes(thumbNode)) {
			angularOffset = getAngle(controlEl, point) - value();
		}
		dragOffset = angularOffset;
		applyPointerValue(controlEl, point);
		internalDragging = true;
		docListeners.start();
		focusThumb();
		event.stopPropagation();
	}

	function onThumbKeyDown(event: KeyboardEvent) {
		if (!interactive()) return;
		const amount = getEventStep(event) * step();
		const key = getEventKey(event, { dir: dir(), orientation: 'horizontal' });
		switch (key) {
			case 'ArrowLeft':
			case 'ArrowUp':
				decrement(amount);
				break;
			case 'ArrowRight':
			case 'ArrowDown':
				increment(amount);
				break;
			case 'Home':
				setValue(ANGLE_SLIDER_MIN);
				invokeOnChangeEnd();
				break;
			case 'End':
				setValue(ANGLE_SLIDER_MAX);
				invokeOnChangeEnd();
				break;
			default:
				return;
		}
		event.preventDefault();
	}

	return {
		get value() {
			return value();
		},
		get valueAsDegree() {
			return valueAsDegree();
		},
		get displayAngle() {
			return displayAngle();
		},
		get dragging() {
			return dragging();
		},
		get disabled() {
			return disabled();
		},
		get readOnly() {
			return readOnly();
		},
		get invalid() {
			return invalid();
		},
		get step() {
			return step();
		},
		get dir() {
			return dir();
		},
		get rootId() {
			return rootId();
		},
		get thumbId() {
			return thumbId();
		},
		get hiddenInputId() {
			return hiddenInputId();
		},
		get controlId() {
			return controlId();
		},
		get valueTextId() {
			return valueTextId();
		},
		get labelId() {
			return labelId();
		},
		setValue,
		increment,
		decrement,
		focus() {
			if (!interactive()) return;
			focusThumb();
		},
		setControlRef(node) {
			controlNode = node instanceof HTMLElement ? node : null;
			if (!controlNode) cancelDrag();
		},
		setThumbRef(node) {
			thumbNode = node instanceof HTMLElement ? node : null;
		},
		onControlPointerDown,
		onLabelClick(event) {
			if (!interactive()) return;
			event.preventDefault();
			focusThumb();
		},
		onThumbKeyDown,
		rootAttrs() {
			return {
				id: rootId(),
				dir: dir() ?? undefined,
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly()),
				style: serializeStyle({
					'--value': value(),
					'--angle': `${displayAngle()}deg`
				})
			};
		},
		labelAttrs() {
			return {
				id: labelId(),
				dir: dir() ?? undefined,
				for: hiddenInputId(),
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly())
			};
		},
		controlAttrs() {
			return {
				id: controlId(),
				dir: dir() ?? undefined,
				role: 'presentation',
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly()),
				style: 'touch-action: none; user-select: none; -webkit-user-select: none'
			};
		},
		thumbAttrs() {
			const ariaLabel = getProps()['aria-label'];
			const ariaLabelledBy = getProps()['aria-labelledby'];
			return {
				id: thumbId(),
				role: 'slider',
				dir: dir() ?? undefined,
				'aria-label': ariaLabel,
				'aria-labelledby': ariaLabelledBy ?? labelId(),
				'aria-valuemax': 360,
				'aria-valuemin': ANGLE_SLIDER_MIN,
				'aria-valuenow': value(),
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly()),
				tabindex: disabled() ? undefined : 0,
				style: 'rotate: var(--angle)'
			};
		},
		valueTextAttrs() {
			return {
				id: valueTextId(),
				dir: dir() ?? undefined
			};
		},
		markerGroupAttrs() {
			return {
				dir: dir() ?? undefined
			};
		},
		markerAttrs(props) {
			const current = value();
			const markerState =
				props.value < current ? 'under-value' : props.value > current ? 'over-value' : 'at-value';
			return {
				dir: dir() ?? undefined,
				'data-value': props.value,
				'data-state': markerState,
				'data-disabled': dataAttr(disabled()),
				style: serializeStyle({
					'--marker-value': props.value,
					'--marker-display-value': getDisplayAngle(props.value, dir()),
					rotate: 'calc(var(--marker-display-value) * 1deg)'
				})
			};
		},
		hiddenInputAttrs() {
			return {
				type: 'hidden',
				value: String(value()),
				name: getProps().name,
				id: hiddenInputId(),
				dir: dir() ?? undefined
			};
		}
	};
}
