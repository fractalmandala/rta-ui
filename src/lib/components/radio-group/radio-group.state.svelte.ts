import { createContext } from '../../internal/context';
import { dataAttr, visuallyHiddenStyle } from '../../internal/dom';

export interface RadioGroupValueChangeDetails {
	value: string | null;
}

export interface UseRadioGroupProps {
	value?: string | null;
	defaultValue?: string | null;
	onValueChange?: (details: RadioGroupValueChangeDetails) => void;
	disabled?: boolean;
	invalid?: boolean;
	readOnly?: boolean;
	required?: boolean;
	name?: string;
	form?: string;
	orientation?: 'horizontal' | 'vertical';
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: {
		root?: string;
		label?: string;
		indicator?: string;
		item?: (value: string) => string;
		itemLabel?: (value: string) => string;
		itemControl?: (value: string) => string;
		itemHiddenInput?: (value: string) => string;
	};
}

export interface RadioGroupItemState {
	value: string;
	checked: boolean;
	focused: boolean;
	focusVisible: boolean;
	hovered: boolean;
	active: boolean;
	disabled: boolean;
	invalid: boolean;
}

export interface RadioGroupRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface RadioGroupApi {
	readonly value: string | null;
	readonly disabled: boolean;
	readonly invalid: boolean;
	readonly readOnly: boolean;
	readonly required: boolean;
	readonly orientation: 'horizontal' | 'vertical';
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly rootId: string;
	readonly labelId: string;
	readonly indicatorId: string;
	readonly indicatorRect: RadioGroupRect | null;
	itemId(value: string): string;
	itemLabelId(value: string): string;
	itemControlId(value: string): string;
	itemHiddenInputId(value: string): string;
	itemState(value: string, options?: { disabled?: boolean; invalid?: boolean }): RadioGroupItemState;
	setValue(next: string | null): void;
	setFocused(value: string | null, focusVisible?: boolean): void;
	setHovered(value: string | null): void;
	setActive(value: string | null): void;
	registerRoot(node: globalThis.Element | null): void;
	measure(): void;
	focus(): void;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	itemAttrs(value: string, options?: { disabled?: boolean; invalid?: boolean }): Record<string, unknown>;
	itemTextAttrs(value: string, options?: { disabled?: boolean; invalid?: boolean }): Record<string, unknown>;
	itemControlAttrs(value: string, options?: { disabled?: boolean; invalid?: boolean }): Record<string, unknown>;
	hiddenInputAttrs(value: string, options?: { disabled?: boolean; invalid?: boolean }): Record<string, unknown>;
	indicatorStyle(): string;
}

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

const radioGroupContext = createContext<RadioGroupApi>('RadioGroup', 'RadioGroup.Root');
export const useRadioGroupContext = () => radioGroupContext.get();
export const setRadioGroupContext = (api: RadioGroupApi) => radioGroupContext.set(api);

export function createRadioGroup(getProps: () => UseRadioGroupProps, uid: string): RadioGroupApi {
	const rootId = () => getProps().ids?.root ?? getProps().id ?? `radio-group:${uid}`;
	const labelId = () => getProps().ids?.label ?? `${rootId()}:label`;
	const indicatorId = () => getProps().ids?.indicator ?? `${rootId()}:indicator`;
	const itemId = (value: string) => getProps().ids?.item?.(value) ?? `${rootId()}:item:${value}`;
	const itemLabelId = (value: string) =>
		getProps().ids?.itemLabel?.(value) ?? `${rootId()}:item:${value}:label`;
	const itemControlId = (value: string) =>
		getProps().ids?.itemControl?.(value) ?? `${rootId()}:item:${value}:control`;
	const itemHiddenInputId = (value: string) =>
		getProps().ids?.itemHiddenInput?.(value) ?? `${rootId()}:item:${value}:input`;

	let internalValue = $state<string | null>(getProps().defaultValue ?? getProps().value ?? null);
	let focusedValue = $state<string | null>(null);
	let focusVisibleValue = $state<string | null>(null);
	let hoveredValue = $state<string | null>(null);
	let activeValue = $state<string | null>(null);
	let indicatorRect = $state<RadioGroupRect | null>(null);
	let rootNode: globalThis.Element | null = null;

	const isControlled = () => getProps().value !== undefined;
	const value = () => (isControlled() ? (getProps().value ?? null) : internalValue);

	function setValue(next: string | null) {
		if (getProps().disabled || getProps().readOnly) return;
		if (!isControlled()) internalValue = next;
		getProps().onValueChange?.({ value: next });
	}

	function measure() {
		const current = value();
		if (!rootNode || current == null) {
			indicatorRect = null;
			return;
		}
		const node = rootNode.querySelector<HTMLElement>(`[id="${itemControlId(current)}"]`);
		if (!node) {
			indicatorRect = null;
			return;
		}
		indicatorRect = {
			x: node.offsetLeft,
			y: node.offsetTop,
			width: node.offsetWidth,
			height: node.offsetHeight
		};
	}

	function itemState(target: string, options?: { disabled?: boolean; invalid?: boolean }) {
		return {
			value: target,
			checked: value() === target,
			focused: focusedValue === target,
			focusVisible: focusVisibleValue === target,
			hovered: hoveredValue === target,
			active: activeValue === target,
			disabled: Boolean(options?.disabled || getProps().disabled),
			invalid: Boolean(options?.invalid || getProps().invalid)
		};
	}

	function itemDataAttrs(target: string, options?: { disabled?: boolean; invalid?: boolean }) {
		const state = itemState(target, options);
		return {
			dir: getProps().dir ?? undefined,
			'data-focus': dataAttr(state.focused),
			'data-focus-visible': dataAttr(state.focusVisible),
			'data-disabled': dataAttr(state.disabled),
			'data-readonly': dataAttr(Boolean(getProps().readOnly)),
			'data-state': state.checked ? 'checked' : 'unchecked',
			'data-hover': dataAttr(state.hovered),
			'data-invalid': dataAttr(state.invalid),
			'data-orientation': getProps().orientation ?? 'horizontal'
		};
	}

	return {
		itemId,
		itemLabelId,
		itemControlId,
		itemHiddenInputId,
		itemState,
		setValue,
		setFocused(next, focusVisible = false) {
			focusedValue = next;
			focusVisibleValue = focusVisible ? next : null;
		},
		setHovered(next) {
			hoveredValue = next;
		},
		setActive(next) {
			activeValue = next;
		},
		registerRoot(node) {
			rootNode = node;
		},
		measure,
		focus() {
			const checked = rootNode?.querySelector<HTMLInputElement>('input[type="radio"]:checked');
			const first = rootNode?.querySelector<HTMLInputElement>('input[type="radio"]:not([disabled])');
			(checked ?? first)?.focus();
		},
		rootAttrs() {
			const disabled = Boolean(getProps().disabled);
			return dropUndefined({
				id: rootId(),
				role: 'radiogroup',
				dir: getProps().dir ?? undefined,
				'aria-labelledby': labelId(),
				'aria-required': getProps().required || undefined,
				'aria-disabled': disabled || undefined,
				'aria-readonly': getProps().readOnly || undefined,
				'aria-orientation': getProps().orientation ?? 'horizontal',
				'data-orientation': getProps().orientation ?? 'horizontal',
				'data-disabled': dataAttr(disabled),
				'data-invalid': dataAttr(Boolean(getProps().invalid)),
				'data-required': dataAttr(Boolean(getProps().required)),
				style: 'position: relative'
			});
		},
		labelAttrs() {
			return dropUndefined({
				id: labelId(),
				dir: getProps().dir ?? undefined,
				'data-orientation': getProps().orientation ?? 'horizontal',
				'data-disabled': dataAttr(Boolean(getProps().disabled)),
				'data-invalid': dataAttr(Boolean(getProps().invalid)),
				'data-required': dataAttr(Boolean(getProps().required))
			});
		},
		itemAttrs(target, options) {
			return dropUndefined({
				...itemDataAttrs(target, options),
				id: itemId(target),
				for: itemHiddenInputId(target)
			});
		},
		itemTextAttrs(target, options) {
			return dropUndefined({
				...itemDataAttrs(target, options),
				id: itemLabelId(target)
			});
		},
		itemControlAttrs(target, options) {
			const state = itemState(target, options);
			return dropUndefined({
				...itemDataAttrs(target, options),
				id: itemControlId(target),
				'data-active': dataAttr(state.active),
				'aria-hidden': 'true'
			});
		},
		hiddenInputAttrs(target, options) {
			const state = itemState(target, options);
			const readOnly = Boolean(getProps().readOnly);
			return dropUndefined({
				id: itemHiddenInputId(target),
				type: 'radio',
				name: getProps().name ?? getProps().id ?? undefined,
				form: getProps().form ?? undefined,
				value: target,
				required: getProps().required,
				checked: state.checked,
				disabled: state.disabled || readOnly,
				'aria-labelledby': itemLabelId(target),
				'aria-invalid': state.invalid || undefined,
				'data-ownedby': rootId(),
				style: visuallyHiddenStyle
			});
		},
		indicatorStyle() {
			const rect = indicatorRect;
			const style: Record<string, string> = {
				'--left': `${rect?.x ?? 0}px`,
				'--top': `${rect?.y ?? 0}px`,
				'--width': `${rect?.width ?? 0}px`,
				'--height': `${rect?.height ?? 0}px`,
				'--transition-property': 'left, top, width, height',
				position: 'absolute',
				'will-change': 'var(--transition-property)',
				'transition-property': 'var(--transition-property)',
				'transition-duration': 'var(--transition-duration, 150ms)',
				'transition-timing-function': 'var(--transition-timing-function)'
			};
			return Object.entries(style)
				.map(([name, entry]) => `${name}: ${entry}`)
				.join('; ');
		},
		get value() {
			return value();
		},
		get disabled() {
			return Boolean(getProps().disabled);
		},
		get invalid() {
			return Boolean(getProps().invalid);
		},
		get readOnly() {
			return Boolean(getProps().readOnly);
		},
		get required() {
			return Boolean(getProps().required);
		},
		get orientation() {
			return getProps().orientation ?? 'horizontal';
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
		get indicatorId() {
			return indicatorId();
		},
		get indicatorRect() {
			return indicatorRect;
		}
	};
}
