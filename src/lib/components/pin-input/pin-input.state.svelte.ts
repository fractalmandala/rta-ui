import { untrack } from 'svelte';
import { createContext } from '../../internal/context';
import { dataAttr, visuallyHiddenStyle } from '../../internal/dom';
import { useFieldContext } from '../field/field.state.svelte';

export type PinInputType = 'numeric' | 'alphabetic' | 'alphanumeric';

export interface PinInputValueChangeDetails {
	value: string[];
	valueAsString: string;
}

export interface PinInputValueCompleteDetails {
	value: string[];
	valueAsString: string;
}

export interface PinInputValueInvalidDetails {
	value: string;
	index: number;
}

export interface PinInputElementIds {
	root?: string;
	label?: string;
	control?: string;
	hiddenInput?: string;
	input?: (index: number) => string;
}

export interface UsePinInputProps {
	autoFocus?: boolean;
	autoSubmit?: boolean;
	blurOnComplete?: boolean;
	count?: number;
	defaultValue?: string[];
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	disabled?: boolean;
	form?: string;
	id?: string | null;
	ids?: PinInputElementIds;
	invalid?: boolean;
	mask?: boolean;
	name?: string;
	onValueChange?: (details: PinInputValueChangeDetails) => void;
	onValueComplete?: (details: PinInputValueCompleteDetails) => void;
	onValueInvalid?: (details: PinInputValueInvalidDetails) => void;
	otp?: boolean;
	pattern?: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	sanitizeValue?: (value: string) => string;
	selectOnFocus?: boolean;
	translations?: { inputLabel?: (index: number, length: number) => string };
	type?: PinInputType;
	value?: string[];
}

export interface PinInputApi {
	readonly value: string[];
	readonly valueAsString: string;
	readonly count: number;
	readonly items: number[];
	readonly complete: boolean;
	readonly focusedIndex: number;
	readonly disabled: boolean;
	readonly invalid: boolean;
	readonly readOnly: boolean;
	readonly required: boolean;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly rootId: string;
	readonly labelId: string;
	readonly controlId: string;
	readonly hiddenInputId: string;
	inputId(index: number): string;
	focus(): void;
	setValue(next: string[]): void;
	setValueAtIndex(index: number, next: string): void;
	clearValue(): void;
	registerInput(index: number, node: HTMLInputElement | null): void;
	registerHiddenInput(node: HTMLInputElement | null): void;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	inputAttrs(index: number): Record<string, unknown>;
	hiddenInputAttrs(): Record<string, unknown>;
}

const CHAR_PATTERN: Record<PinInputType, string> = {
	numeric: '[0-9]',
	alphabetic: '[A-Za-z]',
	alphanumeric: '[a-zA-Z0-9]'
};

const TYPE_PATTERN: Record<PinInputType, RegExp> = {
	numeric: /^[0-9]+$/,
	alphabetic: /^[A-Za-z]+$/,
	alphanumeric: /^[a-zA-Z0-9]+$/
};

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

function isEqual(a: string[], b: string[]) {
	return a.length === b.length && a.every((entry, index) => entry === b[index]);
}

function fill(value: string[], count: number) {
	const length = count || value.length;
	return Array.from({ length }, (_, index) => value[index] || '');
}

function getNextValue(current: string, next: string) {
	let nextValue = next;
	if (current[0] === next[0]) nextValue = next[1];
	else if (current[0] === next[1]) nextValue = next[0];
	const chars = nextValue.split('');
	return chars[chars.length - 1] ?? '';
}

function setInputValue(element: HTMLInputElement | null, value: string) {
	if (!element) return;
	element.value = value;
	element.setAttribute('value', value);
}

function nativeEvent<E extends Event>(event: E): E {
	return ((event as { nativeEvent?: Event }).nativeEvent as E | undefined) ?? event;
}

const pinInputContext = createContext<PinInputApi>('PinInput', 'PinInput.Root');
export const usePinInputContext = () => pinInputContext.get();
export const setPinInputContext = (api: PinInputApi) => pinInputContext.set(api);

export function createPinInput(getProps: () => UsePinInputProps, uid: string): PinInputApi {
	const field = useFieldContext();

	let renderedCount = $state(0);
	const count = () => getProps().count ?? renderedCount;
	const rootId = () => getProps().ids?.root ?? `pin-input:${uid}`;
	const labelId = () => getProps().ids?.label ?? field?.ids.label ?? `pin-input:${uid}:label`;
	const controlId = () => getProps().ids?.control ?? `pin-input:${uid}:control`;
	const hiddenInputId = () =>
		getProps().ids?.hiddenInput ?? field?.ids.control ?? `pin-input:${uid}:hidden`;
	const inputId = (index: number) =>
		getProps().ids?.input?.(index) ?? `pin-input:${uid}:${index}`;

	const disabled = () => Boolean(getProps().disabled ?? field?.disabled);
	const readOnly = () => Boolean(getProps().readOnly ?? field?.readOnly);
	const invalid = () => Boolean(getProps().invalid ?? field?.invalid);
	const required = () => Boolean(getProps().required ?? field?.required);

	let internalValue = $state<string[]>(fill(getProps().defaultValue ?? [], count()));
	let focusedIndex = $state(getProps().autoFocus ? 0 : -1);

	const inputs: (HTMLInputElement | null)[] = [];
	let hiddenInput: HTMLInputElement | null = null;

	const isControlled = () => getProps().value !== undefined;
	const value = () =>
		fill(isControlled() ? (getProps().value ?? []) : internalValue, count());
	const focusedValue = () => value()[focusedIndex] || '';
	const filledValueLength = () => value().filter((entry) => entry.trim() !== '').length;
	const complete = () => value().length === filledValueLength();

	function isValidValue(candidate: string) {
		const pattern = getProps().pattern;
		if (pattern) return new RegExp(pattern, 'g').test(candidate);
		return TYPE_PATTERN[getProps().type ?? 'numeric'].test(candidate);
	}

	function commit(next: string[]): string[] {
		const filled = fill(next, count());
		if (isEqual(filled, value())) return filled;
		if (!isControlled()) internalValue = filled;
		getProps().onValueChange?.({ value: filled, valueAsString: filled.join('') });
		return filled;
	}

	function setValue(next: string[]) {
		commit(next);
	}

	function setValueAtIndex(index: number, next: string) {
		const current = value();
		const resolved = getNextValue(current[index] || '', next);
		commit(current.map((entry, position) => (position === index ? resolved : entry)));
	}

	function clearValue() {
		commit(Array.from({ length: count() }, () => ''));
		focusedIndex = 0;
	}

	function clearFocusedValue() {
		if (focusedIndex === -1) return;
		const next = [...value()];
		next.splice(focusedIndex, 1);
		next.push('');
		commit(next);
	}

	function tabbableIndex() {
		return focusedIndex !== -1
			? focusedIndex
			: Math.min(filledValueLength(), Math.max(value().length - 1, 0));
	}

	function focusInputAt(index: number) {
		const element = inputs[index];
		if (!element) return;
		if (element.ownerDocument.activeElement === element) return;
		element.focus({ preventScroll: true });
	}

	function setFocusedIndex(index: number) {
		const maxIndex = Math.min(filledValueLength(), value().length - 1);
		focusedIndex = Math.min(index, maxIndex);
	}

	function setPrevFocusedIndex() {
		focusedIndex = Math.max(focusedIndex - 1, 0);
	}

	function setNextFocusedIndex() {
		const maxIndex = Math.min(filledValueLength(), value().length - 1);
		focusedIndex = Math.min(focusedIndex + 1, maxIndex);
	}

	function setFocusIndexToLast() {
		focusedIndex = Math.max(filledValueLength() - 1, 0);
	}

	function setLastValueFocusIndex() {
		focusedIndex = Math.min(filledValueLength(), value().length - 1);
	}

	function advanceFocusedIndex() {
		focusedIndex = Math.min(focusedIndex + 1, value().length - 1);
	}

	function paste(pastedValue: string) {
		const valueLength = value().length;
		const focused = focusedIndex;
		const startIndex = Math.min(focused, filledValueLength());
		const serialized = value().join('');
		const prefix = startIndex > 0 ? serialized.substring(0, focused) : '';
		const next = fill(
			`${prefix}${pastedValue.substring(0, valueLength - startIndex)}`.split(''),
			valueLength
		);
		commit(next);
		setLastValueFocusIndex();
	}

	let lastSynced: string | undefined;
	let lastComplete = complete();

	$effect(() => {
		const current = value();
		const serialized = current.join('\u0000');
		untrack(() => {
			inputs.forEach((element, index) => setInputValue(element, current[index] ?? ''));
			if (hiddenInput) {
				hiddenInput.value = current.join('');
				if (lastSynced !== undefined && lastSynced !== serialized) {
					hiddenInput.dispatchEvent(
						new InputEvent('input', { bubbles: true, cancelable: true, composed: true })
					);
				}
			}
			lastSynced = serialized;
		});
	});

	$effect(() => {
		const index = focusedIndex;
		const selectOnFocus = getProps().selectOnFocus;
		untrack(() => {
			if (index === -1) return;
			queueMicrotask(() => {
				focusInputAt(index);
				if (selectOnFocus) inputs[index]?.select();
			});
		});
	});

	$effect(() => {
		const isComplete = complete();
		untrack(() => {
			if (isComplete === lastComplete) return;
			lastComplete = isComplete;
			if (!isComplete) return;
			const current = value();
			getProps().onValueComplete?.({ value: current, valueAsString: current.join('') });
			if (getProps().autoSubmit) hiddenInput?.form?.requestSubmit();
			if (getProps().blurOnComplete) {
				queueMicrotask(() => inputs[focusedIndex]?.blur());
			}
		});
	});

	function handlePaste(event: Event) {
		let pastedValue = (event as ClipboardEvent).clipboardData?.getData('text/plain');
		if (!pastedValue) return;
		const transformer = getProps().sanitizeValue;
		if (transformer) pastedValue = transformer(pastedValue);
		if (!isValidValue(pastedValue)) {
			if (focusedIndex !== -1) {
				getProps().onValueInvalid?.({ value: pastedValue, index: focusedIndex });
			}
			event.preventDefault();
			return;
		}
		event.preventDefault();
		if (focusedIndex === -1) return;
		paste(pastedValue);
	}

	function handleBeforeInput(event: Event) {
		const element = event.currentTarget as HTMLInputElement;
		const inputType = (nativeEvent(event) as InputEvent).inputType;
		if (inputType?.startsWith('delete')) return;
		const data = (event as InputEvent).data;
		const candidate =
			element.value.slice(0, element.selectionStart ?? 0) +
			(data ?? '') +
			element.value.slice(element.selectionEnd ?? 0);
		if (!isValidValue(candidate)) {
			if (focusedIndex !== -1) {
				getProps().onValueInvalid?.({ value: candidate, index: focusedIndex });
			}
			event.preventDefault();
		}
		if (candidate.length > 1) element.setSelectionRange(0, 1, 'forward');
	}

	function handleInput(event: Event) {
		const element = event.currentTarget as HTMLInputElement;
		const inputType = (nativeEvent(event) as InputEvent).inputType;
		const nextValue = element.value;

		if (inputType === 'insertFromPaste') {
			element.value = nextValue[0] || '';
			return;
		}

		if (nextValue.length > 2) {
			if (focusedIndex !== -1) paste(nextValue);
			element.value = nextValue[0];
			event.preventDefault();
			return;
		}

		if (focusedIndex === -1) return;

		if (inputType === 'deleteContentBackward') {
			if (focusedValue() !== '') {
				clearFocusedValue();
				setPrevFocusedIndex();
			} else {
				setPrevFocusedIndex();
				clearFocusedValue();
			}
			return;
		}

		if (inputType === 'deleteByCut') {
			if (focusedValue() !== '') clearFocusedValue();
			return;
		}

		if (nextValue === focusedValue()) return;

		const current = (() => {
			const before = value();
			const resolved = getNextValue(focusedValue(), nextValue);
			const next = before.map((entry, position) =>
				position === focusedIndex ? resolved : entry
			);
			return commit(next);
		})();
		setInputValue(element, current[focusedIndex] ?? '');
		advanceFocusedIndex();
	}

	function handleKeyDown(event: Event) {
		const keyboard = event as KeyboardEvent;
		if (event.defaultPrevented) return;
		if (nativeEvent(keyboard).isComposing || keyboard.keyCode === 229) return;

		const dir = getProps().dir;
		const key = (() => {
			const aliases: Record<string, string> = {
				Up: 'ArrowUp',
				Down: 'ArrowDown',
				Esc: 'Escape',
				' ': 'Space'
			};
			const resolved = aliases[keyboard.key] ?? keyboard.key;
			if (dir === 'rtl') {
				if (resolved === 'ArrowLeft') return 'ArrowRight';
				if (resolved === 'ArrowRight') return 'ArrowLeft';
			}
			return resolved;
		})();

		if (
			(keyboard.ctrlKey || keyboard.metaKey) &&
			!keyboard.altKey &&
			(key === 'ArrowLeft' || key === 'ArrowRight')
		) {
			event.preventDefault();
			if (key === 'ArrowLeft') focusedIndex = 0;
			else setFocusIndexToLast();
			return;
		}

		if (keyboard.ctrlKey || keyboard.altKey || keyboard.metaKey) return;

		if (keyboard.key.length === 1 && focusedValue() === keyboard.key) {
			event.preventDefault();
			advanceFocusedIndex();
			return;
		}

		if (focusedIndex === -1) return;

		const keymap: Record<string, (() => void) | undefined> = {
			Backspace: () => {
				if (focusedValue() !== '') {
					clearFocusedValue();
					setPrevFocusedIndex();
					return;
				}
				setPrevFocusedIndex();
				clearFocusedValue();
			},
			Delete: () => {
				if (focusedValue() !== '') clearFocusedValue();
			},
			ArrowLeft: setPrevFocusedIndex,
			ArrowRight: setNextFocusedIndex,
			Enter: () => {
				hiddenInput?.form?.requestSubmit();
			},
			Home: () => {
				focusedIndex = 0;
			},
			End: setFocusIndexToLast,
			ArrowUp: () => {
				focusedIndex = 0;
			},
			ArrowDown: setFocusIndexToLast
		};

		const action = keymap[key];
		if (!action) return;
		event.preventDefault();
		action();
	}

	return {
		inputId,
		setValue,
		setValueAtIndex,
		clearValue,
		focus() {
			focusInputAt(0);
		},
		registerInput(index, node) {
			inputs[index] = node;
			if (node && !getProps().count) renderedCount = Math.max(renderedCount, index + 1);
		},
		registerHiddenInput(node) {
			hiddenInput = node;
		},
		rootAttrs() {
			return dropUndefined({
				dir: getProps().dir ?? undefined,
				id: rootId(),
				'data-invalid': dataAttr(invalid()),
				'data-disabled': dataAttr(disabled()),
				'data-complete': dataAttr(complete()),
				'data-readonly': dataAttr(readOnly())
			});
		},
		labelAttrs() {
			return dropUndefined({
				dir: getProps().dir ?? undefined,
				for: hiddenInputId(),
				id: labelId(),
				'data-invalid': dataAttr(invalid()),
				'data-disabled': dataAttr(disabled()),
				'data-complete': dataAttr(complete()),
				'data-required': dataAttr(required()),
				'data-readonly': dataAttr(readOnly()),
				onclick(event: MouseEvent) {
					event.preventDefault();
					focusInputAt(0);
				}
			});
		},
		controlAttrs() {
			return dropUndefined({
				dir: getProps().dir ?? undefined,
				id: controlId(),
				role: 'group',
				'aria-labelledby': labelId()
			});
		},
		inputAttrs(index) {
			const valueLength = value().length;
			const tabIndex = tabbableIndex();
			return dropUndefined({
				dir: getProps().dir ?? undefined,
				disabled: disabled(),
				tabindex: index === tabIndex ? 0 : -1,
				'data-disabled': dataAttr(disabled()),
				'data-complete': dataAttr(complete()),
				'data-filled': dataAttr(value()[index] !== ''),
				id: inputId(index),
				'data-index': index,
				'data-ownedby': rootId(),
				'aria-label':
					getProps().translations?.inputLabel?.(index, valueLength) ??
					`pin code ${index + 1} of ${valueLength}`,
				inputmode:
					getProps().otp || (getProps().type ?? 'numeric') === 'numeric' ? 'numeric' : 'text',
				'aria-invalid': invalid() || undefined,
				'data-invalid': dataAttr(invalid()),
				enterkeyhint: index === valueLength - 1 ? 'done' : 'next',
				type: getProps().mask
					? 'password'
					: (getProps().type ?? 'numeric') === 'numeric'
						? 'tel'
						: 'text',
				readonly: readOnly(),
				required: required(),
				autocapitalize: 'none',
				autocomplete: getProps().otp ? 'one-time-code' : 'off',
				placeholder: focusedIndex === index ? '' : (getProps().placeholder ?? '○'),
				onpaste: handlePaste,
				onbeforeinput: handleBeforeInput,
				oninput: handleInput,
				onkeydown: handleKeyDown,
				onfocus: () => setFocusedIndex(index),
				onblur(event: FocusEvent) {
					const target = event.relatedTarget as Element | null;
					if (target?.closest?.(`[data-ownedby~="${rootId()}"]`)) return;
					focusedIndex = -1;
				}
			});
		},
		hiddenInputAttrs() {
			const valueLength = value().length;
			const type = getProps().type ?? 'numeric';
			return dropUndefined({
				'aria-hidden': true,
				type: 'text',
				tabindex: -1,
				id: hiddenInputId(),
				readonly: readOnly(),
				disabled: disabled(),
				required: required(),
				name: getProps().name ?? undefined,
				form: getProps().form ?? undefined,
				style: visuallyHiddenStyle,
				minlength: valueLength,
				maxlength: valueLength,
				pattern: `${getProps().pattern ? '.' : (CHAR_PATTERN[type] ?? '.')}{${valueLength}}`,
				onfocus: () => focusInputAt(tabbableIndex())
			});
		},
		get focusedIndex() {
			return focusedIndex;
		},
		get value() {
			return value();
		},
		get valueAsString() {
			return value().join('');
		},
		get count() {
			return count();
		},
		get items() {
			return Array.from({ length: count() }, (_, index) => index);
		},
		get complete() {
			return complete();
		},
		get disabled() {
			return disabled();
		},
		get invalid() {
			return invalid();
		},
		get readOnly() {
			return readOnly();
		},
		get required() {
			return required();
		},
		get dir() {
			return getProps().dir;
		},
		get rootId() {
			return rootId();
		},
		get labelId() {
			return labelId();
		},
		get controlId() {
			return controlId();
		},
		get hiddenInputId() {
			return hiddenInputId();
		}
	};
}
