import { createContext } from '../../internal/context';
import { dataAttr, visuallyHiddenStyle } from '../../internal/dom';
import { CalendarDate, tryParseDate } from '../../internal/date';
import {
	buildSegments,
	constrainSegments,
	displayValueOf,
	displayValueToDate,
	emptyDisplayValue,
	formatIsoDate,
	getGroupCount,
	getSegmentPlaceholders,
	getSegmentTemplate,
	isDigit,
	isDisplayValueComplete,
	monthFromName,
	PAGE_STEP,
	SEGMENT_LABELS,
	segmentMaxDigits,
	segmentLimits,
	type DateInputDisplayValue,
	type DateInputSegment,
	type DateInputSegmentTemplatePart,
	type DateInputSegmentType
} from './date-input.utils';

export type DateInputSelectionMode = 'single' | 'range';
export type DateInputValue = CalendarDate | CalendarDate[] | string | string[] | null | undefined;
export type DateInputDateValue = CalendarDate;

export interface DateInputValueChangeDetails {
	value: CalendarDate[];
	valueAsString: string[];
}

export interface DateInputFocusChangeDetails {
	focused: boolean;
}

export interface DateInputPlaceholderChangeDetails {
	value: CalendarDate[];
	valueAsString: string[];
	placeholderValue: CalendarDate;
}

export interface DateInputElementIds {
	root?: string;
	label?: (index?: number) => string;
	control?: string;
	segmentGroup?: (index: number) => string;
	hiddenInput?: (index: number) => string;
}

export interface DateInputTranslations {
	placeholder?: (locale: string) => Record<string, string>;
}

export interface UseDateInputProps {
	id?: string | null;
	ids?: DateInputElementIds;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	locale?: string;
	timeZone?: string;
	disabled?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	required?: boolean;
	name?: string;
	form?: string;
	selectionMode?: DateInputSelectionMode;
	min?: CalendarDate | string | null;
	max?: CalendarDate | string | null;
	value?: DateInputValue;
	defaultValue?: DateInputValue;
	placeholderValue?: CalendarDate | string | null;
	isDateUnavailable?: (date: CalendarDate, locale?: string) => boolean;
	translations?: DateInputTranslations;
	onValueChange?: (details: DateInputValueChangeDetails) => void;
	onFocusChange?: (details: DateInputFocusChangeDetails) => void;
	onPlaceholderChange?: (details: DateInputPlaceholderChangeDetails) => void;
}

export interface DateInputSegmentState {
	editable: boolean;
	focused: boolean;
	readonly: boolean;
}

type Attrs = Record<string, unknown>;

export interface DateInputApi {
	readonly id: string;
	readonly focused: boolean;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly invalid: boolean;
	readonly required: boolean;
	readonly value: CalendarDate[];
	readonly valueAsDate: Date[];
	readonly valueAsString: string[];
	readonly valueAsISO: string[];
	readonly placeholderValue: CalendarDate | undefined;
	readonly displayValues: DateInputDisplayValue[];
	readonly groupCount: number;
	readonly activeIndex: number;
	readonly activeSegmentIndex: number;
	focus(): void;
	setValue(values: (CalendarDate | string)[]): void;
	clearValue(): void;
	getSegments(options?: { index?: number }): DateInputSegment[];
	getSegmentState(options: {
		segment: DateInputSegment;
		index?: number;
		position?: number;
	}): DateInputSegmentState;
	getRootProps(): Attrs;
	getLabelProps(options?: { index?: number }): Attrs;
	getControlProps(): Attrs;
	getSegmentGroupProps(options?: { index?: number }): Attrs;
	getSegmentProps(options: { segment: DateInputSegment; index?: number; position?: number }): Attrs;
	getHiddenInputProps(options?: { index?: number; name?: string }): Attrs;
	setControlNode(node: HTMLElement | null): void;
}

const dateInputContext = createContext<DateInputApi>('DateInput', 'DateInput.Root');
const groupContext = createContext<() => number>('DateInputGroup', 'DateInput.SegmentGroup');

export const setDateInputGroupContext = (index: () => number) => groupContext.set(index);
export const useDateInputGroupContext = (): (() => number) => groupContext.use() ?? (() => 0);

export const useDateInputContext = () => dateInputContext.get();
export const setDateInputContext = (api: DateInputApi) => dateInputContext.set(api);

const ariaAttr = (value: unknown) => (value ? true : undefined);

const toCalendar = (value: CalendarDate | string | null | undefined): CalendarDate | undefined => {
	if (value == null) return undefined;
	if (typeof value === 'string') return tryParseDate(value.trim()) ?? undefined;
	return value;
};

const toDateList = (
	input: DateInputValue,
	min: CalendarDate | undefined,
	max: CalendarDate | undefined
): CalendarDate[] => {
	if (input == null) return [];
	const items = Array.isArray(input) ? input : [input];
	return items
		.map((item) => toCalendar(item as CalendarDate | string))
		.filter((item): item is CalendarDate => item != null)
		.map((item) => constrainSegments(item, min, max));
};

export const defaultTranslations: DateInputTranslations = {
	placeholder(locale: string) {
		return getSegmentPlaceholders(locale);
	}
};

export function createDateInput(getProps: () => UseDateInputProps, uid: string): DateInputApi {
	const props = getProps;
	const id = props().id ?? uid;
	const ids = props().ids ?? {};
	const locale = () => props().locale ?? 'en-US';
	const selectionMode = (): DateInputSelectionMode => props().selectionMode ?? 'single';
	const groupCount = () => getGroupCount(selectionMode());
	const disabled = () => Boolean(props().disabled);
	const readOnly = () => Boolean(props().readOnly);
	const minValue = () => toCalendar(props().min);
	const maxValue = () => toCalendar(props().max);

	const rootId = ids.root ?? `date-input:${id}`;
	const labelId = (index = 0) => ids.label?.(index) ?? `date-input:${id}:label:${index}`;
	const controlId = ids.control ?? `date-input:${id}:control`;
	const segmentGroupId = (index: number) =>
		ids.segmentGroup?.(index) ?? `date-input:${id}:segment-group:${index}`;
	const hiddenInputId = (index: number) =>
		ids.hiddenInput?.(index) ?? `date-input:${id}:hidden-input:${index}`;

	const template = (): DateInputSegmentTemplatePart[] => getSegmentTemplate(locale());
	const placeholders = () => ({
		...getSegmentPlaceholders(locale()),
		...(props().translations?.placeholder?.(locale()) ??
			defaultTranslations.placeholder?.(locale()) ??
			{})
	}) as Record<'day' | 'month' | 'year', string>;

	const isControlled = () => props().value !== undefined;
	const initialValue = () => toDateList(props().value ?? props().defaultValue, minValue(), maxValue());
	const firstValue = initialValue()[0];
	const placeholderValue = () => {
		const configured = toCalendar(props().placeholderValue);
		if (configured) return constrainSegments(configured, minValue(), maxValue());
		return firstValue;
	};

	let internalValue = $state<CalendarDate[]>(initialValue());
	let displayValues = $state<DateInputDisplayValue[]>(
		Array.from({ length: groupCount() }, (_, index) =>
			displayValueOf(internalValue[index] ?? firstValue)
		)
	);
	let focused = $state(false);
	let activeIndex = $state(0);
	let activeSegmentIndex = $state(-1);
	let enteredKeys = $state('');
	let controlNode = $state<HTMLElement | null>(null);

	const valueList = () => (isControlled() ? toDateList(props().value, minValue(), maxValue()) : internalValue);
	const isDateUnavailable = () =>
		props().isDateUnavailable
			? valueList().some((date) => props().isDateUnavailable?.(date, locale()))
			: false;
	const invalid = () => props().invalid ?? isDateUnavailable();

	const allSegments = (): DateInputSegment[][] => {
		const parts = template();
		const cells = placeholders();
		return Array.from({ length: groupCount() }, (_, index) =>
			buildSegments(parts, displayValues[index] ?? emptyDisplayValue(), cells)
		);
	};

	const groupOffset = (index: number) =>
		allSegments()
			.slice(0, index)
			.reduce((total, group) => total + group.length, 0);

	const displayedSegments = (index: number): DateInputSegment[] => {
		const segments = allSegments()[index] ?? [];
		const offset = groupOffset(index);
		if (focused && enteredKeys !== '' && index === activeIndex) {
			const localActive = activeSegmentIndex - offset;
			return segments.map((segment, position) =>
				position === localActive
					? { ...segment, text: enteredKeys, isPlaceholder: false }
					: segment
			);
		}
		return segments;
	};

	function setValues(values: CalendarDate[]) {
		const constrained = values.map((date) => constrainSegments(date, minValue(), maxValue()));
		if (!isControlled()) internalValue = constrained;
		displayValues = Array.from({ length: groupCount() }, (_, index) =>
			displayValueOf(constrained[index] ?? placeholderValue())
		);
		props().onValueChange?.({
			value: constrained,
			valueAsString: constrained.map((date) => date.toString())
		});
	}

	function commitDisplayValue(index: number, displayValue: DateInputDisplayValue) {
		const date = displayValueToDate(displayValue);
		if (!date) return;
		const values = [...valueList()];
		values[index] = date;
		setValues(values);
	}

	function setDisplayValue(index: number, displayValue: DateInputDisplayValue) {
		const next = [...displayValues];
		next[index] = displayValue;
		displayValues = next;
	}

	function activeDisplayValue(): DateInputDisplayValue {
		return displayValues[activeIndex] ?? emptyDisplayValue();
	}

	function activeSegment(): DateInputSegment | undefined {
		const segments = allSegments()[activeIndex];
		if (!segments) return undefined;
		return segments[activeSegmentIndex - groupOffset(activeIndex)];
	}

	function focusSegmentAt(index: number) {
		if (typeof requestAnimationFrame !== 'function') return;
		requestAnimationFrame(() => {
			const segments = controlNode?.querySelectorAll<HTMLElement>('[data-part="segment"]');
			const target = segments?.[index];
			if (target?.isConnected) target.focus({ preventScroll: true });
		});
	}

	const isFocusable = (segment: DateInputSegment) => segment.type !== 'literal';

	function nextSegmentPosition(direction: 1 | -1) {
		const groups = allSegments();
		const offset = groupOffset(activeIndex);
		const local = activeSegmentIndex - offset;
		const current = groups[activeIndex] ?? [];
		if (direction === 1) {
			for (let index = local + 1; index < current.length; index += 1) {
				if (isFocusable(current[index])) return { group: activeIndex, position: offset + index };
			}
			const next = groups[activeIndex + 1];
			if (!next) return undefined;
			const found = next.findIndex(isFocusable);
			if (found === -1) return undefined;
			return { group: activeIndex + 1, position: offset + current.length + found };
		}
		for (let index = local - 1; index >= 0; index -= 1) {
			if (isFocusable(current[index])) return { group: activeIndex, position: offset + index };
		}
		const previous = groups[activeIndex - 1];
		if (!previous) return undefined;
		let found = -1;
		for (let index = previous.length - 1; index >= 0; index -= 1) {
			if (isFocusable(previous[index])) {
				found = index;
				break;
			}
		}
		if (found === -1) return undefined;
		return { group: activeIndex - 1, position: groupOffset(activeIndex - 1) + found };
	}

	function moveSegment(direction: 1 | -1) {
		const target = nextSegmentPosition(direction);
		if (!target) return;
		activeIndex = target.group;
		activeSegmentIndex = target.position;
		enteredKeys = '';
	}

	function setSegmentFocusedWith(dateIndex: number, position: number) {
		const wasFocused = focused;
		activeIndex = dateIndex;
		activeSegmentIndex = position;
		if (wasFocused) enteredKeys = '';
		if (!wasFocused) {
			focused = true;
			props().onFocusChange?.({ focused: true });
		}
	}

	function setSegmentValue(type: DateInputSegmentType, value: number) {
		const displayValue = { ...activeDisplayValue(), [type]: value };
		setDisplayValue(activeIndex, displayValue);
		return displayValue;
	}

	function finishIfComplete(displayValue: DateInputDisplayValue) {
		if (!isDisplayValueComplete(displayValue)) return false;
		commitDisplayValue(activeIndex, displayValue);
		return true;
	}

	function adjustValue(segment: DateInputSegment, amount: number) {
		const limits = segmentLimits(segment.type, activeDisplayValue());
		const current = activeDisplayValue()[segment.type as 'day' | 'month' | 'year'];
		let next = (current ?? (amount > 0 ? limits.minValue - 1 : limits.maxValue + 1)) + amount;
		if (next < limits.minValue) next = limits.maxValue - (limits.minValue - next - 1);
		if (next > limits.maxValue) next = limits.minValue + (next - limits.maxValue - 1);
		const displayValue = setSegmentValue(segment.type, next);
		finishIfComplete(displayValue);
	}

	function setSegmentBound(segment: DateInputSegment, bound: 'minValue' | 'maxValue') {
		const limits = segmentLimits(segment.type, activeDisplayValue());
		const displayValue = setSegmentValue(segment.type, limits[bound]);
		finishIfComplete(displayValue);
	}

	function inputCharacter(segment: DateInputSegment, char: string) {
		if (segment.type === 'month' && !isDigit(char)) {
			const month = monthFromName(enteredKeys + char, locale());
			if (month == null) return;
			enteredKeys = '';
			const displayValue = setSegmentValue('month', month);
			if (finishIfComplete(displayValue)) return;
			moveSegment(1);
			return;
		}
		if (!isDigit(char)) return;
		const limits = segmentLimits(segment.type, activeDisplayValue());
		const digits = `${enteredKeys}${char}`;
		let numeric = Number.parseInt(digits, 10);
		let committed = digits;
		if (numeric > limits.maxValue) {
			numeric = Number.parseInt(char, 10);
			committed = char;
		}
		if (Number.isNaN(numeric)) return;
		const displayValue = setSegmentValue(segment.type, numeric);
		const maxDigits = segmentMaxDigits(segment.type);
		if (Number(`${numeric}0`) > limits.maxValue || committed.length >= maxDigits) {
			enteredKeys = '';
			if (finishIfComplete(displayValue)) return;
			moveSegment(1);
			return;
		}
		enteredKeys = committed;
	}

	function backspaceSegment(segment: DateInputSegment) {
		if (enteredKeys !== '') {
			const next = enteredKeys.slice(0, -1);
			if (next === '' || next === '0') {
				enteredKeys = '';
				const displayValue = { ...activeDisplayValue(), [segment.type]: null };
				setDisplayValue(activeIndex, displayValue);
				return;
			}
			enteredKeys = next;
			setSegmentValue(segment.type, Number.parseInt(next, 10));
			return;
		}
		if (segment.isPlaceholder) {
			moveSegment(-1);
			return;
		}
		enteredKeys = '';
		setDisplayValue(activeIndex, { ...activeDisplayValue(), [segment.type]: null });
	}

	function onBlur() {
		if (!focused) return;
		focused = false;
		enteredKeys = '';
		activeSegmentIndex = -1;
		const displayValue = activeDisplayValue();
		if (isDisplayValueComplete(displayValue)) commitDisplayValue(activeIndex, displayValue);
		props().onFocusChange?.({ focused: false });
	}

	function keydown(segment: DateInputSegment, event: KeyboardEvent) {
		if (event.defaultPrevented || event.ctrlKey || event.metaKey || readOnly()) return;
		const key = event.key;
		if (key.length === 1 && !event.altKey) {
			event.preventDefault();
			inputCharacter(segment, key);
			return;
		}
		const handlers: Record<string, () => void> = {
			ArrowLeft: () => moveSegment(-1),
			ArrowRight: () => moveSegment(1),
			ArrowUp: () => adjustValue(segment, 1),
			ArrowDown: () => adjustValue(segment, -1),
			PageUp: () => adjustValue(segment, PAGE_STEP[segment.type] ?? 1),
			PageDown: () => adjustValue(segment, -(PAGE_STEP[segment.type] ?? 1)),
			Backspace: () => backspaceSegment(segment),
			Delete: () => backspaceSegment(segment),
			Home: () => setSegmentBound(segment, 'minValue'),
			End: () => setSegmentBound(segment, 'maxValue'),
			Enter: () => {
				const displayValue = activeDisplayValue();
				if (isDisplayValueComplete(displayValue)) commitDisplayValue(activeIndex, displayValue);
			}
		};
		const handler = handlers[key];
		if (!handler) return;
		handler();
		event.preventDefault();
		event.stopPropagation();
	}

	$effect(() => {
		const source = valueList();
		if (source.length === 0) return;
		void props().locale;
		displayValues = Array.from({ length: groupCount() }, (_, index) =>
			displayValueOf(source[index] ?? placeholderValue())
		);
	});

	$effect(() => {
		const index = activeSegmentIndex;
		if (index < 0) return;
		focusSegmentAt(index);
	});

	const segmentStateFor = (
		segment: DateInputSegment,
		index: number,
		position: number
	): DateInputSegmentState => {
		const isEditable = !disabled() && !readOnly() && segment.isEditable;
		const global = groupOffset(index) + position;
		return {
			editable: isEditable,
			focused: focused && activeIndex === index && global === activeSegmentIndex,
			readonly: !segment.isEditable || readOnly()
		};
	};

	function templatePosition(segment: DateInputSegment): number {
		const parts = template();
		const exact = parts.findIndex((part) => part.type === segment.type);
		return exact === -1 ? 0 : exact;
	}

	function segmentProps(options: { segment: DateInputSegment; index?: number; position?: number }): Attrs {
		const segment = options.segment;
		const index = options.index ?? 0;
		if (segment.type === 'literal') {
			return {
				dir: props().dir,
				'aria-hidden': true,
				'data-type': segment.type,
				'data-segment': segment.type,
				'data-readonly': '',
				'data-disabled': ''
			};
		}
		const position = options.position ?? templatePosition(segment);
		const segmentState = segmentStateFor(segment, index, position);
		return {
			dir: props().dir,
			role: 'spinbutton',
			tabindex: disabled() ? undefined : 0,
			autocomplete: 'off',
			spellcheck: segmentState.editable ? 'false' : undefined,
			autocorrect: segmentState.editable ? 'off' : undefined,
			contenteditable: segmentState.editable ? true : undefined,
			inputmode: disabled() || !segmentState.editable ? undefined : 'numeric',
			enterkeyhint: 'next',
			'aria-label': SEGMENT_LABELS[segment.type],
			'aria-valuenow': segment.isPlaceholder ? undefined : segment.value,
			'aria-valuetext': segment.isPlaceholder ? segment.placeholder : segment.text,
			'aria-valuemin': segment.minValue,
			'aria-valuemax': segment.maxValue,
			'aria-invalid': ariaAttr(invalid()),
			'aria-readonly': ariaAttr(segmentState.readonly),
			'aria-disabled': ariaAttr(disabled()),
			'data-value': segment.value,
			'data-type': segment.type,
			'data-segment': segment.type,
			'data-placeholder': dataAttr(segment.isPlaceholder),
			'data-placeholder-shown': dataAttr(segment.isPlaceholder),
			'data-filled': dataAttr(!segment.isPlaceholder),
			'data-readonly': dataAttr(segmentState.readonly),
			'data-disabled': dataAttr(disabled()),
			'data-editable': dataAttr(segmentState.editable),
			'data-focus': dataAttr(segmentState.focused),
			style: 'caret-color: transparent',
			onfocus() {
				const global = groupOffset(index) + position;
				setSegmentFocusedWith(index, global);
				const node =
					controlNode?.querySelectorAll<HTMLElement>('[data-part="segment"]')[global] ?? null;
				const doc = node?.ownerDocument;
				const selection = doc?.getSelection?.();
				if (selection && node) selection.collapse(node);
			},
			onblur(event: FocusEvent) {
				const next = event.relatedTarget as Node | null;
				if (next && controlNode?.contains(next)) return;
				onBlur();
			},
			onkeydown(event: KeyboardEvent) {
				keydown(segment, event);
			},
			onbeforeinput(event: InputEvent) {
				event.preventDefault();
				if (event.data) inputCharacter(segment, event.data);
			},
			onpaste(event: ClipboardEvent) {
				event.preventDefault();
				const text = event.clipboardData?.getData('text/plain')?.trim();
				if (!text) return;
				const parsed = tryParseDate(text);
				if (!parsed) return;
				const displayValue = displayValueOf(parsed);
				setDisplayValue(activeIndex, displayValue);
				commitDisplayValue(activeIndex, displayValue);
			}
		};
	}

	return {
		id,
		get focused() {
			return focused;
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
		get required() {
			return Boolean(props().required);
		},
		get value() {
			return valueList();
		},
		get valueAsDate() {
			return valueList().map((date) => date.toDate());
		},
		get valueAsString() {
			return valueList().map((date) => date.toString());
		},
		get valueAsISO() {
			return valueList().map((date) => formatIsoDate(date));
		},
		get placeholderValue() {
			return placeholderValue();
		},
		get displayValues() {
			return allSegments().map((_, index) => displayValues[index] ?? emptyDisplayValue());
		},
		get groupCount() {
			return groupCount();
		},
		get activeIndex() {
			return activeIndex;
		},
		get activeSegmentIndex() {
			return activeSegmentIndex;
		},
		focus() {
			const segments = allSegments()[0] ?? [];
			const first = segments.findIndex(isFocusable);
			if (first === -1) return;
			setSegmentFocusedWith(0, first);
		},
		setValue(values) {
			setValues(
				values
					.map((value) => toCalendar(value as CalendarDate | string))
					.filter((value): value is CalendarDate => value != null)
			);
		},
		clearValue() {
			enteredKeys = '';
			displayValues = Array.from({ length: groupCount() }, () => emptyDisplayValue());
			setValues([]);
		},
		getSegments(options = {}) {
			return displayedSegments(options.index ?? 0);
		},
		getSegmentState(options) {
			return segmentStateFor(options.segment, options.index ?? 0, options.position ?? 0);
		},
		getRootProps() {
			return {
				dir: props().dir,
				id: rootId,
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(invalid())
			};
		},
		getLabelProps(options = {}) {
			const index = options.index ?? 0;
			return {
				id: labelId(index),
				dir: props().dir,
				for: hiddenInputId(index),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(invalid()),
				onclick() {
					if (disabled()) return;
					const segments = controlNode?.querySelectorAll<HTMLElement>('[data-part="segment"]');
					segments?.[0]?.focus();
				}
			};
		},
		getControlProps() {
			return {
				dir: props().dir,
				id: controlId,
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(invalid()),
				'data-focus': dataAttr(focused)
			};
		},
		getSegmentGroupProps(options = {}) {
			const index = options.index ?? 0;
			return {
				id: segmentGroupId(index),
				dir: props().dir,
				role: 'group',
				'aria-labelledby': labelId(index),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(invalid()),
				'data-focus': dataAttr(focused && activeIndex === index),
				style: 'unicode-bidi: isolate'
			};
		},
		getSegmentProps(options) {
			return segmentProps(options);
		},
		getHiddenInputProps(options = {}) {
			const index = options.index ?? 0;
			const inputName = options.name ?? props().name;
			const values = valueList();
			const date = values[index];
			return {
				type: 'hidden',
				id: hiddenInputId(index),
				name: inputName ? (values.length > 1 ? `${inputName}[${index}]` : inputName) : undefined,
				form: props().form,
				required: props().required ? true : undefined,
				disabled: disabled() ? true : undefined,
				readonly: readOnly() ? true : undefined,
				value: formatIsoDate(date),
				style: visuallyHiddenStyle
			};
		},
		setControlNode(node) {
			controlNode = node;
		}
	};
}

export type { CalendarDate };
