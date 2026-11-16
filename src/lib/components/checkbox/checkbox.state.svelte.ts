import { createContext } from '../../internal/context';
import { createCheckable } from '../../internal/checkable.svelte.js';
import type { CheckableApi, CheckableProps } from '../../internal/checkable.svelte.js';
import { dataAttr } from '../../internal/dom';

export type CheckboxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface UseCheckboxProps extends CheckableProps {
	indeterminate?: boolean;
}

export interface CheckboxApi extends CheckableApi {
	readonly indeterminate: boolean;
	readonly checkedState: boolean;
	indicatorVisible(indeterminate?: boolean): boolean;
}

export interface UseCheckboxGroupProps {
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (details: { value: string[] }) => void;
	disabled?: boolean;
	invalid?: boolean;
	readOnly?: boolean;
	required?: boolean;
	name?: string;
	form?: string;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: { root?: string; group?: string };
}

export interface CheckboxGroupApi {
	readonly value: string[];
	readonly disabled: boolean;
	readonly invalid: boolean;
	readonly readOnly: boolean;
	readonly required: boolean;
	readonly name: string | undefined;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly groupId: string;
	has(value: string): boolean;
	toggle(value: string): void;
	setValue(next: string[]): void;
	groupAttrs(): { role: 'group'; 'data-disabled'?: '' | undefined; 'data-invalid'?: ''; 'data-required'?: '' };
}

const checkboxContext = createContext<CheckboxApi>('Checkbox', 'Checkbox.Root');
const checkboxGroupContext = createContext<CheckboxGroupApi>('CheckboxGroup', 'Checkbox.Group');

export const useCheckboxContext = () => checkboxContext.get();
export const setCheckboxContext = (api: CheckboxApi) => checkboxContext.set(api);
export const useCheckboxGroupContext = () => checkboxGroupContext.get();
export const setCheckboxGroupContext = (api: CheckboxGroupApi) => checkboxGroupContext.set(api);
export const getCheckboxGroupContext = () => checkboxGroupContext.use();

export function createCheckbox(getProps: () => UseCheckboxProps, uid: string): CheckboxApi {
	const group = getCheckboxGroupContext();
	const base = createCheckable('checkbox', getProps, uid, () => group);
	const indeterminate = () => Boolean(getProps().indeterminate) && !base.checked;

	return {
		id: base.id,
		setChecked: base.setChecked,
		toggle: base.toggle,
		setHovered: base.setHovered,
		setActive: base.setActive,
		labelProps: base.labelProps,
		controlProps: base.controlProps,
		hiddenInputProps: base.hiddenInputProps,
		dataAttrs: (state?: string) =>
			base.dataAttrs(state ?? (indeterminate() ? 'indeterminate' : undefined)),
		get checked() {
			return base.checked;
		},
		get checkedState() {
			return base.checked;
		},
		get indeterminate() {
			return indeterminate();
		},
		indicatorVisible(isIndeterminate?: boolean) {
			return isIndeterminate ? indeterminate() : base.checked;
		},
		get disabled() {
			return base.disabled;
		},
		get readOnly() {
			return base.readOnly;
		},
		get required() {
			return base.required;
		},
		get invalid() {
			return base.invalid;
		},
		get hovered() {
			return base.hovered;
		},
		get focused() {
			return base.focused;
		},
		get focusVisible() {
			return base.focusVisible;
		},
		get active() {
			return base.active;
		},
		get dir() {
			return base.dir;
		}
	};
}

export function createCheckboxGroup(
	getProps: () => UseCheckboxGroupProps,
	uid: string
): CheckboxGroupApi {
	const id = getProps().id ?? uid;
	let internalValue = $state<string[]>(getProps().defaultValue ?? getProps().value ?? []);
	const isControlled = () => getProps().value !== undefined;
	const value = () => (isControlled() ? (getProps().value ?? []) : internalValue);

	function setValue(next: string[]) {
		if (getProps().disabled || getProps().readOnly) return;
		if (!isControlled()) internalValue = next;
		getProps().onValueChange?.({ value: next });
	}

	return {
		has(target: string) {
			return value().includes(target);
		},
		toggle(target: string) {
			const current = value();
			setValue(current.includes(target) ? current.filter((item) => item !== target) : [...current, target]);
		},
		setValue,
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
		get name() {
			return getProps().name;
		},
		get dir() {
			return getProps().dir;
		},
		get groupId() {
			return getProps().ids?.group ?? `${id}:group`;
		},
		groupAttrs() {
			return {
				role: 'group' as const,
				'data-disabled': dataAttr(Boolean(getProps().disabled)),
				'data-invalid': dataAttr(Boolean(getProps().invalid)),
				'data-required': dataAttr(Boolean(getProps().required))
			};
		}
	};
}
