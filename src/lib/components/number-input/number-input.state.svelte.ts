import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import { useFieldContext } from '../field/field.state.svelte';

export type NumberInputDir = 'ltr' | 'rtl' | 'auto';
export type NumberInputInputMode = 'text' | 'tel' | 'numeric' | 'decimal';
export type NumberInputValidityState = 'rangeUnderflow' | 'rangeOverflow';

export interface NumberInputElementIds {
	root?: string;
	label?: string;
	input?: string;
	incrementTrigger?: string;
	decrementTrigger?: string;
	scrubber?: string;
}

export interface NumberInputTranslations {
	valueText?: (value: string) => string;
	incrementLabel?: string;
	decrementLabel?: string;
}

export interface NumberInputValueChangeDetails {
	value: string;
	valueAsNumber: number;
}

export interface NumberInputFocusChangeDetails extends NumberInputValueChangeDetails {
	focused: boolean;
}

export interface NumberInputValueInvalidDetails extends NumberInputValueChangeDetails {
	reason: NumberInputValidityState;
}

export interface UseNumberInputProps {
	id?: string | null;
	ids?: NumberInputElementIds;
	dir?: NumberInputDir | null;
	locale?: string;
	formatOptions?: Intl.NumberFormatOptions;
	name?: string;
	form?: string;
	disabled?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	required?: boolean;
	pattern?: string;
	value?: string;
	defaultValue?: string;
	min?: number;
	max?: number;
	step?: number;
	largeStep?: number;
	smallStep?: number;
	allowMouseWheel?: boolean;
	allowOverflow?: boolean;
	clampValueOnBlur?: boolean;
	focusInputOnChange?: boolean;
	inputMode?: NumberInputInputMode;
	spinOnPress?: boolean;
	translations?: NumberInputTranslations;
	onValueChange?: (details: NumberInputValueChangeDetails) => void;
	onValueInvalid?: (details: NumberInputValueInvalidDetails) => void;
	onFocusChange?: (details: NumberInputFocusChangeDetails) => void;
	onValueCommit?: (details: NumberInputValueChangeDetails) => void;
}

export interface NumberInputApi {
	readonly focused: boolean;
	readonly invalid: boolean;
	readonly empty: boolean;
	readonly value: string;
	readonly rawValue: string;
	readonly formattedValue: string;
	readonly valueAsNumber: number;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly required: boolean;
	readonly scrubber: boolean;
	readonly scrubbing: boolean;
	readonly ids: {
		root: string;
		label: string;
		input: string;
		incrementTrigger: string;
		decrementTrigger: string;
		scrubber: string;
	};
	setValue(value: string | number): void;
	clearValue(): void;
	increment(step?: number): void;
	decrement(step?: number): void;
	setToMax(): void;
	setToMin(): void;
	focus(): void;
	registerRoot(node: Element | null): void;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	inputAttrs(): Record<string, unknown>;
	valueTextAttrs(): Record<string, unknown>;
	incrementTriggerAttrs(): Record<string, unknown>;
	decrementTriggerAttrs(): Record<string, unknown>;
	scrubberAttrs(): Record<string, unknown>;
}

type Hint = 'increment' | 'decrement' | null;

const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
const MAX_Z_INDEX = 2147483647;

const nan = (value: number) => (Number.isNaN(value) ? 0 : value);
const ariaAttr = (value: boolean | undefined) => (value ? true : undefined);
const dropUndefined = (record: Record<string, unknown>) => {
	for (const key of Object.keys(record)) {
		if (record[key] === undefined) delete record[key];
	}
	return record;
};

const countDecimals = (value: number) => {
	if (Math.floor(value) === value) return 0;
	let text = value.toString();
	if (text.indexOf('e-') >= 0) return parseInt(text.slice(text.indexOf('e-') + 2), 10);
	let decimals = 0;
	if (text.indexOf('.') >= 0) {
		text = text.replace(/0+$/, '');
		decimals = text.length - text.indexOf('.') - 1;
	}
	return decimals;
};

const decimalOp = (value: number, op: '+' | '-', step: number) => {
	let result = op === '+' ? value + step : value - step;
	if (value % 1 !== 0 || step % 1 !== 0) {
		const multiplier = 10 ** Math.max(countDecimals(value), countDecimals(step));
		const left = Math.round(value * multiplier);
		const right = Math.round(step * multiplier);
		result = op === '+' ? left + right : left - right;
		result /= multiplier;
	}
	return result;
};

const incrementValue = (value: number, step: number) => decimalOp(nan(value), '+', step);
const decrementValue = (value: number, step: number) => decimalOp(nan(value), '-', step);

const clampValue = (value: number, min: number, max: number) =>
	Math.min(Math.max(nan(value), min), max);

const isValueWithinRange = (value: number, min: number, max: number) =>
	value >= min && value <= max;

const roundToDpr = (value: number, dpr: number) =>
	typeof dpr === 'number' ? Math.floor(value * dpr + 0.5) / dpr : Math.round(value);

const wrap = (value: number, max: number) => {
	const v = value % max;
	return v >= 0 ? v : v + max;
};

const isModifierKey = (event: KeyboardEvent) =>
	event.ctrlKey || event.altKey || event.metaKey;

const arrowKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
const pageKeys = new Set(['PageUp', 'PageDown']);

const getEventStepValue = (
	event: { key: string; altKey: boolean; shiftKey: boolean },
	options: { step: number; largeStep: number; smallStep: number },
) => {
	const isArrowKey = arrowKeys.has(event.key);
	if (event.altKey && isArrowKey) return options.smallStep;
	const isLargeStep = pageKeys.has(event.key) || (event.shiftKey && isArrowKey);
	return isLargeStep ? options.largeStep : options.step;
};

const raf = (callback: () => void) => {
	if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => callback());
	else setTimeout(callback, 0);
};

class NumberParser {
	private format: Intl.NumberFormat;
	private options: Intl.NumberFormatOptions;
	private decimal = '.';
	private group = ',';
	private minusSign = '-';
	private digits: Array<[string, string]> = [];

	constructor(locale: string | undefined, options: Intl.NumberFormatOptions) {
		this.options = options;
		this.format = new Intl.NumberFormat(locale, options);
		const parts = this.format.formatToParts(123456.7);
		for (const part of parts) {
			if (part.type === 'group') this.group = part.value;
			if (part.type === 'decimal') this.decimal = part.value;
		}
		const negative = this.format.formatToParts(-1);
		for (const part of negative) {
			if (part.type === 'minusSign') this.minusSign = part.value;
		}
		const digitFormat = new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 0 });
		const seen = new Set<string>();
		for (let index = 0; index < 10; index += 1) {
			const glyph = digitFormat.format(index);
			if (glyph.length === 1 && !seen.has(glyph)) {
				seen.add(glyph);
				this.digits.push([glyph, String(index)]);
			}
		}
	}

	private normalize(value: string) {
		let text = value;
		for (const [glyph, digit] of this.digits) {
			if (text.includes(glyph)) text = text.split(glyph).join(digit);
		}
		return text;
	}

	parse(value: string) {
		if (value === '') return NaN;
		let text = this.normalize(value);
		let negative = false;
		for (const sign of [this.minusSign, '-', '−']) {
			if (sign && text.includes(sign)) {
				negative = true;
				text = text.split(sign).join('');
			}
		}
		if (this.group) text = text.split(this.group).join('');
		text = text.replace(/[\s\u00a0\u202f]/g, '');
		let kept = '';
		for (const char of text) {
			if ((char >= '0' && char <= '9') || char === this.decimal) kept += char;
		}
		if (kept === '' || kept === this.decimal) return NaN;
		const ascii = this.decimal === '.' ? kept : kept.split(this.decimal).join('.');
		const parsed = Number.parseFloat(ascii);
		if (Number.isNaN(parsed)) return NaN;
		const scaled = this.options.style === 'percent' ? parsed / 100 : parsed;
		return negative ? -scaled : scaled;
	}

	isValidPartialNumber(value: string) {
		let text = this.normalize(value);
		let kept = '';
		for (const char of text) {
			if ((char >= '0' && char <= '9') || char === this.decimal) kept += char;
			else if (char === this.minusSign || char === '-') kept += '-';
		}
		const ascii = this.decimal === '.' ? kept : kept.split(this.decimal).join('.');
		return /^-?\d*\.?\d*$/.test(ascii);
	}
}

const defaultTranslations = (): Required<Pick<NumberInputTranslations, 'incrementLabel' | 'decrementLabel'>> => ({
	incrementLabel: 'increment value',
	decrementLabel: 'decrease value',
});

const numberInputContext = createContext<NumberInputApi>('NumberInput', 'NumberInput');

export const setNumberInputContext = (api: NumberInputApi): NumberInputApi =>
	numberInputContext.set(api);
export const useNumberInputContext = (): NumberInputApi => numberInputContext.get();

export function createNumberInput(
	getProps: () => UseNumberInputProps,
	uid: string,
): NumberInputApi {
	const field = useFieldContext();

	const dir = () => {
		const value = getProps().dir;
		if (value === null) return undefined;
		return value ?? 'ltr';
	};
	const locale = () => getProps().locale ?? 'en-US';
	const ids = () => ({
		...(field ? { label: field.ids.label, input: field.ids.control } : {}),
		...getProps().ids,
	});
	const rootId = () => ids().root ?? `number-input:${uid}`;
	const labelId = () => ids().label ?? `number-input:${uid}:label`;
	const inputId = () => ids().input ?? `number-input:${uid}:input`;
	const incrementTriggerId = () => ids().incrementTrigger ?? `number-input:${uid}:inc`;
	const decrementTriggerId = () => ids().decrementTrigger ?? `number-input:${uid}:dec`;
	const scrubberId = () => ids().scrubber ?? `number-input:${uid}:scrubber`;
	const cursorId = () => `number-input:${uid}:cursor`;
	const translations = () => ({ ...defaultTranslations(), ...getProps().translations });

	const stepValue = () => {
		const configured = getProps().step;
		if (configured != null && !Number.isNaN(configured)) return configured;
		return getProps().formatOptions?.style === 'percent' ? 0.01 : 1;
	};
	const largeStep = () => getProps().largeStep ?? stepValue() * 10;
	const smallStep = () => getProps().smallStep ?? stepValue() / 10;
	const min = () => getProps().min ?? MIN_SAFE_INTEGER;
	const max = () => getProps().max ?? MAX_SAFE_INTEGER;
	const allowOverflow = () => Boolean(getProps().allowOverflow);
	const clampValueOnBlur = () => {
		const configured = getProps().clampValueOnBlur;
		if (configured == null) return !allowOverflow();
		return configured;
	};
	const focusInputOnChange = () => getProps().focusInputOnChange ?? true;
	const spinOnPress = () => getProps().spinOnPress ?? true;

	let i18nCache: { key: string; formatter: Intl.NumberFormat; parser: NumberParser } | null = null;
	const i18n = () => {
		const key = `${locale()}|${JSON.stringify(getProps().formatOptions ?? null)}`;
		if (!i18nCache || i18nCache.key !== key) {
			i18nCache = {
				key,
				formatter: new Intl.NumberFormat(locale(), getProps().formatOptions),
				parser: new NumberParser(locale(), getProps().formatOptions ?? {}),
			};
		}
		return i18nCache;
	};

	const parseValue = (value: string) => {
		if (!getProps().formatOptions) return Number.parseFloat(value);
		if (value === '') return NaN;
		return i18n().parser.parse(value);
	};
	const formatValue = (value: number) => {
		if (Number.isNaN(value)) return '';
		if (!getProps().formatOptions) return value.toString();
		return i18n().formatter.format(value);
	};

	let rootNode = $state<Element | null>(null);
	let focused = $state(false);
	let spinning = $state(false);
	let scrubbing = $state(false);
	let fieldsetDisabled = $state(false);
	let internalValue = $state(getProps().defaultValue ?? '');
	let inputValue = $state(formatValue(parseValue(getProps().value ?? getProps().defaultValue ?? '')));

	const initialValue = getProps().value ?? getProps().defaultValue ?? '';
	let syncedValue = getProps().value ?? getProps().defaultValue ?? '';
	let syncedLocale = locale();
	let syncedFormat = JSON.stringify(getProps().formatOptions ?? null);

	const value = () => {
		const controlled = getProps().value;
		return controlled === undefined ? internalValue : controlled;
	};
	const valueAsNumber = () => parseValue(value());
	const formattedValue = () => formatValue(valueAsNumber());
	const empty = () => value() === '';
	const isAtMin = () => valueAsNumber() <= min();
	const isAtMax = () => valueAsNumber() >= max();
	const outOfRange = () => !isValueWithinRange(valueAsNumber(), min(), max());
	const disabled = () => Boolean(getProps().disabled) || fieldsetDisabled;
	const readOnly = () => Boolean(getProps().readOnly);
	const invalid = () => {
		const configured = getProps().invalid;
		return configured === undefined ? outOfRange() : Boolean(configured);
	};
	const required = () => Boolean(getProps().required);

	const byId = (id: string) => {
		if (!rootNode) return null;
		const scope = rootNode.getRootNode() as Document | ShadowRoot;
		return scope.getElementById(id);
	};
	const inputEl = () => byId(inputId()) as HTMLInputElement | null;
	const documentRef = () => inputEl()?.ownerDocument ?? (typeof document === 'undefined' ? null : document);

	const rootAttrs = () =>
		dropUndefined({
			id: rootId(),
			'data-scope': 'number-input',
			'data-part': 'root',
			dir: dir(),
			'data-disabled': dataAttr(disabled()),
			'data-focus': dataAttr(focused),
			'data-invalid': dataAttr(invalid()),
			'data-scrubbing': dataAttr(scrubbing),
		});

	const labelAttrs = () =>
		dropUndefined({
			'data-scope': 'number-input',
			'data-part': 'label',
			dir: dir(),
			'data-disabled': dataAttr(disabled()),
			'data-focus': dataAttr(focused),
			'data-invalid': dataAttr(invalid()),
			'data-required': dataAttr(required()),
			'data-scrubbing': dataAttr(scrubbing),
			id: labelId(),
			for: inputId(),
			onclick: (event: MouseEvent) => {
				event.preventDefault();
				raf(() => setCaretToEnd(inputEl()));
			},
		});

	const controlAttrs = () =>
		dropUndefined({
			'data-scope': 'number-input',
			'data-part': 'control',
			dir: dir(),
			role: 'group',
			'aria-disabled': disabled(),
			'data-focus': dataAttr(focused),
			'data-disabled': dataAttr(disabled()),
			'data-invalid': dataAttr(invalid()),
			'data-scrubbing': dataAttr(scrubbing),
			'aria-invalid': ariaAttr(invalid()),
		});

	const valueTextAttrs = () =>
		dropUndefined({
			'data-scope': 'number-input',
			'data-part': 'value-text',
			dir: dir(),
			'data-disabled': dataAttr(disabled()),
			'data-invalid': dataAttr(invalid()),
			'data-focus': dataAttr(focused),
			'data-scrubbing': dataAttr(scrubbing),
		});

	const handleInput = (event: Event) => {
		const target = event.currentTarget as HTMLInputElement;
		setTyped(target.value);
	};

	const handleBeforeInput = (event: InputEvent) => {
		const target = event.currentTarget as HTMLInputElement;
		const start = target.selectionStart;
		const end = target.selectionEnd;
		if (start == null || end == null) return;
		const next = `${target.value.slice(0, start)}${event.data ?? ''}${target.value.slice(end)}`;
		if (!i18n().parser.isValidPartialNumber(next)) event.preventDefault();
	};

	const handleFocus = () => {
		if (focused) return;
		focused = true;
		getProps().onFocusChange?.({ focused: true, ...details() });
	};

	const handleBlur = () => {
		focused = false;
		clearSpinTimers();
		spinning = false;

		if (clampValueOnBlur() && !empty() && outOfRange()) {
			setFormattedValue(formatValue(clampValue(valueAsNumber(), min(), max())));
			invokeBlur();
			invokeCommit();
			return;
		}

		if (outOfRange()) {
			setFormattedValue(formattedValue());
			invokeBlur();
			invokeInvalid();
			invokeCommit();
			return;
		}

		setFormattedValue(formattedValue());
		invokeBlur();
		invokeCommit();
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.defaultPrevented) return;
		if (readOnly()) return;
		if (event.isComposing) return;

		const eventStep = getEventStepValue(event, {
			step: stepValue(),
			largeStep: largeStep(),
			smallStep: smallStep(),
		});

		switch (event.key) {
			case 'ArrowUp':
				increment(eventStep);
				event.preventDefault();
				break;
			case 'ArrowDown':
				decrement(eventStep);
				event.preventDefault();
				break;
			case 'PageUp':
				increment(eventStep);
				event.preventDefault();
				break;
			case 'PageDown':
				decrement(eventStep);
				event.preventDefault();
				break;
			case 'Home':
				if (isModifierKey(event)) return;
				setToMin();
				event.preventDefault();
				break;
			case 'End':
				if (isModifierKey(event)) return;
				setToMax();
				event.preventDefault();
				break;
			case 'Enter': {
				setFormattedValue(formattedValue());
				invokeBlur();
				invokeCommit();
				break;
			}
			default:
				break;
		}
	};

	const handleWheel = (event: WheelEvent) => {
		if (!getProps().allowMouseWheel || !focused) return;
		event.preventDefault();
		const delta = Math.sign(event.deltaY) * -1;
		if (delta === 1) increment();
		else if (delta === -1) decrement();
	};

	const inputAttrs = () =>
		dropUndefined({
			'data-scope': 'number-input',
			'data-part': 'input',
			dir: dir(),
			name: getProps().name,
			form: getProps().form,
			id: inputId(),
			role: 'spinbutton',
			value: inputValue,
			pattern: getProps().formatOptions ? undefined : getProps().pattern || '-?[0-9]*(.[0-9]+)?',
			inputmode: getProps().inputMode ?? 'decimal',
			'aria-invalid': ariaAttr(invalid()),
			'data-invalid': dataAttr(invalid()),
			disabled: disabled(),
			'data-disabled': dataAttr(disabled()),
			readonly: readOnly(),
			required: required(),
			autocomplete: 'off',
			autocorrect: 'off',
			spellcheck: 'false',
			type: 'text',
			'aria-roledescription': 'numberfield',
			'aria-valuemin': min(),
			'aria-valuemax': max(),
			'aria-valuenow': Number.isNaN(valueAsNumber()) ? undefined : valueAsNumber(),
			'aria-valuetext': translations().valueText?.(value()),
			'data-scrubbing': dataAttr(scrubbing),
			'aria-describedby': field?.ariaDescribedby,
			onbeforeinput: handleBeforeInput,
			oninput: handleInput,
			onfocus: handleFocus,
			onblur: handleBlur,
			onkeydown: handleKeyDown,
			onwheel: handleWheel,
		});

	const triggerCommon = (kind: 'increment' | 'decrement') =>
		dropUndefined({
			'data-scope': 'number-input',
			'data-part': kind === 'increment' ? 'increment-trigger' : 'decrement-trigger',
			dir: dir(),
			id: kind === 'increment' ? incrementTriggerId() : decrementTriggerId(),
			disabled: triggerDisabled(kind),
			'data-disabled': dataAttr(triggerDisabled(kind)),
			'aria-label':
				kind === 'increment' ? translations().incrementLabel : translations().decrementLabel,
			type: 'button',
			tabindex: -1,
			'aria-controls': inputId(),
			'data-scrubbing': dataAttr(scrubbing),
			onpointerdown: (event: PointerEvent) => pressDown(kind, event),
			onpointerup: () => pressUp(),
			onpointerleave: () => pressUp(),
		});

	const incrementTriggerAttrs = () => triggerCommon('increment');
	const decrementTriggerAttrs = () => triggerCommon('decrement');

	const scrubberAttrs = () =>
		dropUndefined({
			'data-scope': 'number-input',
			'data-part': 'scrubber',
			dir: dir(),
			'data-disabled': dataAttr(disabled()),
			id: scrubberId(),
			role: 'presentation',
			'data-scrubbing': dataAttr(scrubbing),
			style: disabled() ? undefined : 'cursor: ew-resize',
			onmousedown: startScrub,
			onpointerdown: startTouchScrub,
		});

	const details = (): NumberInputValueChangeDetails => ({
		value: formattedValue(),
		valueAsNumber: valueAsNumber(),
	});

	const invokeFocus = () => {
		getProps().onFocusChange?.({ focused: true, ...details() });
	};
	const invokeBlur = () => {
		getProps().onFocusChange?.({ focused: false, ...details() });
	};
	const invokeCommit = () => {
		getProps().onValueCommit?.(details());
	};
	const invokeInvalid = () => {
		if (!outOfRange()) return;
		getProps().onValueInvalid?.({
			reason: valueAsNumber() > max() ? 'rangeOverflow' : 'rangeUnderflow',
			...details(),
		});
	};

	const syncTrackers = () => {
		syncedValue = value();
		syncedLocale = locale();
		syncedFormat = JSON.stringify(getProps().formatOptions ?? null);
	};

	const notifyChange = (next: string) => {
		getProps().onValueChange?.({ value: next, valueAsNumber: parseValue(next) });
	};

	function setTyped(next: string) {
		if (getProps().value === undefined) internalValue = next;
		inputValue = next;
		syncTrackers();
		notifyChange(next);
	}

	function setFormattedValue(next: string) {
		const previous = value();
		if (getProps().value === undefined) internalValue = next;
		inputValue = formatValue(parseValue(next));
		syncTrackers();
		if (next !== previous) notifyChange(next);
	}

	function setRawValue(next: number | string) {
		let parsed = typeof next === 'number' ? next : parseValue(next);
		if (!allowOverflow()) parsed = clampValue(parsed, min(), max());
		setFormattedValue(formatValue(parsed));
	}

	function increment(step?: number) {
		let next = incrementValue(valueAsNumber(), step ?? stepValue());
		if (!allowOverflow()) next = clampValue(next, min(), max());
		setFormattedValue(formatValue(next));
	}

	function decrement(step?: number) {
		let next = decrementValue(valueAsNumber(), step ?? stepValue());
		if (!allowOverflow()) next = clampValue(next, min(), max());
		setFormattedValue(formatValue(next));
	}

	function setToMax() {
		setFormattedValue(formatValue(max()));
	}

	function setToMin() {
		setFormattedValue(formatValue(min()));
	}

	function clearValue() {
		setFormattedValue('');
	}

	function focusInput() {
		if (!focusInputOnChange()) return;
		const input = inputEl();
		if (!input) return;
		if (input.ownerDocument.activeElement === input) return;
		raf(() => input.focus({ preventScroll: true }));
	}

	function focus() {
		focusInput();
	}

	function triggerDisabled(kind: 'increment' | 'decrement') {
		if (disabled() || readOnly()) return true;
		return kind === 'increment' ? isAtMax() : isAtMin();
	}

	let spinDelay: ReturnType<typeof setTimeout> | undefined;
	let spinInterval: ReturnType<typeof setInterval> | undefined;

	function clearSpinTimers() {
		if (spinDelay !== undefined) clearTimeout(spinDelay);
		if (spinInterval !== undefined) clearInterval(spinInterval);
		spinDelay = undefined;
		spinInterval = undefined;
	}

	function startSpin(nextHint: 'increment' | 'decrement') {
		clearSpinTimers();
		if (nextHint === 'increment') increment();
		else decrement();
		spinDelay = setTimeout(() => {
			spinDelay = undefined;
			if (outOfRange() || !spinOnPress()) return;
			spinning = true;
			spinInterval = setInterval(() => {
				if (outOfRange()) {
					if (spinInterval !== undefined) clearInterval(spinInterval);
					spinInterval = undefined;
					return;
				}
				if (nextHint === 'increment') increment();
				else decrement();
			}, 50);
		}, 300);
	}

	function pressDown(kind: 'increment' | 'decrement', event: PointerEvent) {
		if (triggerDisabled(kind)) return;
		if (event.button !== 0) return;
		if (event.pointerType === 'mouse') event.preventDefault();
		if (event.pointerType === 'touch') {
			(event.currentTarget as HTMLElement | null)?.focus({ preventScroll: true });
		}
		if (!focused) {
			focused = true;
			invokeFocus();
		}
		focusInput();
		startSpin(kind);
	}

	function pressUp() {
		clearSpinTimers();
		if (spinning) {
			spinning = false;
			focusInput();
		}
	}

	let cursorEl: HTMLElement | null = null;
	let scrubCleanup: (() => void) | null = null;

	const isSafari = () =>
		typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	function setCaretToEnd(input: HTMLInputElement | null) {
		if (!input) return;
		input.focus({ preventScroll: true });
		const end = input.value.length;
		input.setSelectionRange(end, end);
	}

	function removeCursor() {
		cursorEl?.remove();
		cursorEl = null;
	}

	function createCursor(point: { x: number; y: number }) {
		const doc = documentRef();
		if (!doc) return;
		removeCursor();
		const el = doc.createElement('div');
		el.className = 'scrubber--cursor';
		el.id = cursorId();
		Object.assign(el.style, {
			width: '15px',
			height: '15px',
			position: 'fixed',
			pointerEvents: 'none',
			left: '0px',
			top: '0px',
			zIndex: `${MAX_Z_INDEX}`,
			transform: `translate3d(${point.x}px, ${point.y}px, 0px)`,
			willChange: 'transform',
		});
		el.innerHTML = `
      <svg width="46" height="15" style="left: -15.5px; position: absolute; top: 0; filter: drop-shadow(rgba(0, 0, 0, 0.4) 0px 1px 1.1px);">
        <g transform="translate(2 3)">
          <path fill-rule="evenodd" d="M 15 4.5L 15 2L 11.5 5.5L 15 9L 15 6.5L 31 6.5L 31 9L 34.5 5.5L 31 2L 31 4.5Z" style="stroke-width: 2px; stroke: white;"></path>
          <path fill-rule="evenodd" d="M 15 4.5L 15 2L 11.5 5.5L 15 9L 15 6.5L 31 6.5L 31 9L 34.5 5.5L 31 2L 31 4.5Z"></path>
        </g>
      </svg>`;
		doc.body.appendChild(el);
		cursorEl = el;
	}

	function moveCursor(x: number, y: number) {
		if (!cursorEl) return;
		cursorEl.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
	}

	function blockTextSelection() {
		const doc = documentRef();
		if (!doc) return () => {};
		const html = doc.documentElement;
		const body = doc.body;
		body.style.pointerEvents = 'none';
		html.style.userSelect = 'none';
		html.style.cursor = 'ew-resize';
		return () => {
			body.style.pointerEvents = '';
			html.style.userSelect = '';
			html.style.cursor = '';
			if (!html.style.length) html.removeAttribute('style');
			if (!body.style.length) body.removeAttribute('style');
		};
	}

	function requestPointerLock(doc: Document | null) {
		if (!doc || isSafari()) return () => {};
		const root = doc.documentElement as HTMLElement & {
			requestPointerLock?: () => Promise<void> | void;
		};
		const result = root.requestPointerLock?.();
		if (result && typeof (result as Promise<void>).catch === 'function') {
			(result as Promise<void>).catch(() => {});
		}
		return () => {
			if (doc.pointerLockElement) doc.exitPointerLock?.();
		};
	}

	function endScrub() {
		scrubCleanup?.();
		scrubCleanup = null;
		scrubbing = false;
		removeCursor();
		if (spinInterval !== undefined) {
			clearInterval(spinInterval);
			spinInterval = undefined;
		}
		focusInput();
	}

	function beginScrub(
		doc: Document,
		clientX: number,
		clientY: number,
		moveEventName: 'mousemove' | 'pointermove',
		upEventName: 'mouseup' | 'pointerup'
	) {
		const win = doc.defaultView;
		const dpr = win?.devicePixelRatio ?? 1;
		const half = roundToDpr(7.5, dpr);
		let x = clientX - half;
		let y = clientY - half;

		scrubbing = true;
		createCursor({ x, y });
		const restoreSelection = blockTextSelection();
		const releasePointerLock = requestPointerLock(doc);
		raf(() => setCaretToEnd(inputEl()));

		const onMove = (moveEvent: MouseEvent) => {
			const dx = roundToDpr(moveEvent.movementX, dpr);
			const dy = roundToDpr(moveEvent.movementY, dpr);
			let hint: 'increment' | 'decrement' | null =
				dx > 0 ? 'increment' : dx < 0 ? 'decrement' : null;
			if (hint && dir() === 'rtl') hint = hint === 'increment' ? 'decrement' : 'increment';
			if (!hint) return;
			if (hint === 'increment') increment();
			else decrement();
			x = wrap(x + dx + half, win?.innerWidth ?? 1024) - half;
			y += dy;
			moveCursor(x, y);
		};

		const onUp = () => endScrub();

		doc.addEventListener(moveEventName, onMove, false);
		doc.addEventListener(upEventName, onUp, false);

		scrubCleanup = () => {
			doc.removeEventListener(moveEventName, onMove, false);
			doc.removeEventListener(upEventName, onUp, false);
			restoreSelection();
			releasePointerLock();
		};
	}

	function prepareScrub(event: Event, button: number) {
		if (disabled() || scrubbing || button !== 0) return null;
		const doc = documentRef();
		if (!doc) return null;
		if (!focused) {
			focused = true;
			invokeFocus();
		}
		event.preventDefault();
		return doc;
	}

	function startScrub(event: MouseEvent) {
		const doc = prepareScrub(event, event.button);
		if (!doc) return;
		beginScrub(doc, event.clientX, event.clientY, 'mousemove', 'mouseup');
	}

	function startTouchScrub(event: PointerEvent) {
		if (event.pointerType === 'mouse') return;
		const doc = prepareScrub(event, event.button);
		if (!doc) return;
		beginScrub(doc, event.clientX, event.clientY, 'pointermove', 'pointerup');
	}

	// Keep the visible input in sync when the value is controlled from outside,
	// or when locale/format options change.
	$effect(() => {
		const nextValue = value();
		const nextLocale = locale();
		const nextFormat = JSON.stringify(getProps().formatOptions ?? null);
		if (nextValue === syncedValue && nextLocale === syncedLocale && nextFormat === syncedFormat) {
			return;
		}
		syncedValue = nextValue;
		syncedLocale = nextLocale;
		syncedFormat = nextFormat;
		inputValue = formatValue(parseValue(nextValue));
	});

	$effect(() => {
		const input = byId(inputId()) as HTMLInputElement | null;
		if (!input) return;
		const fieldset = input.closest('fieldset');
		let observer: MutationObserver | undefined;

		if (fieldset) {
			fieldsetDisabled = fieldset.disabled;
			if (typeof MutationObserver !== 'undefined') {
				observer = new MutationObserver(() => {
					fieldsetDisabled = fieldset.disabled;
				});
				observer.observe(fieldset, { attributes: true, attributeFilter: ['disabled'] });
			}
		} else {
			fieldsetDisabled = false;
		}

		const form = input.form;
		const onReset = () => {
			setFormattedValue(formatValue(parseValue(initialValue)));
		};
		form?.addEventListener('reset', onReset);

		return () => {
			observer?.disconnect();
			form?.removeEventListener('reset', onReset);
		};
	});

	return {
		get focused() {
			return focused;
		},
		get invalid() {
			return invalid();
		},
		get empty() {
			return empty();
		},
		get value() {
			return formattedValue();
		},
		get rawValue() {
			return value();
		},
		get formattedValue() {
			return formattedValue();
		},
		get valueAsNumber() {
			return valueAsNumber();
		},
		get disabled() {
			return disabled();
		},
		get readOnly() {
			return readOnly();
		},
		get required() {
			return required();
		},
		get scrubber() {
			return scrubbing;
		},
		get scrubbing() {
			return scrubbing;
		},
		get ids() {
			return {
				root: rootId(),
				label: labelId(),
				input: inputId(),
				incrementTrigger: incrementTriggerId(),
				decrementTrigger: decrementTriggerId(),
				scrubber: scrubberId(),
			};
		},
		setValue: setRawValue,
		clearValue,
		increment,
		decrement,
		setToMax,
		setToMin,
		focus,
		registerRoot(node: Element | null) {
			rootNode = node;
		},
		rootAttrs,
		labelAttrs,
		controlAttrs,
		inputAttrs,
		valueTextAttrs,
		incrementTriggerAttrs,
		decrementTriggerAttrs,
		scrubberAttrs,
	};
}
