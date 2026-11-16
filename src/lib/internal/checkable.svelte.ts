import { dataAttr, isFocusVisible, visuallyHiddenStyle } from './dom';

export type CheckablePart = 'root' | 'label' | 'control' | 'indicator' | 'thumb' | 'hiddenInput';

export interface CheckableProps {
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (details: { checked: boolean }) => void;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	invalid?: boolean;
	name?: string;
	form?: string;
	value?: string;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: Partial<Record<CheckablePart, string>>;
}

export interface CheckableGroupAccess {
	has(value: string): boolean;
	toggle(value: string): void;
	readonly name: string | undefined;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly invalid: boolean;
	readonly required: boolean;
}

export interface CheckableDataAttrs {
	'data-active'?: '' | undefined;
	'data-focus'?: '' | undefined;
	'data-focus-visible'?: '' | undefined;
	'data-readonly'?: '' | undefined;
	'data-hover'?: '' | undefined;
	'data-disabled'?: '' | undefined;
	'data-state': string;
	'data-invalid'?: '' | undefined;
	'data-required'?: '' | undefined;
}

export interface CheckablePartProps extends CheckableDataAttrs {
	id: string;
}

export interface CheckableControlProps extends CheckablePartProps {
	'aria-hidden': true;
}

export interface CheckableHiddenInputProps {
	id: string;
	type: 'checkbox';
	required: boolean;
	defaultChecked: boolean;
	disabled: boolean;
	'aria-labelledby': string;
	'aria-invalid': boolean | undefined;
	name: string | undefined;
	form: string | undefined;
	value: string | undefined;
	style: string;
	onpointerdown: () => void;
	onpointerup: () => void;
	onfocus: () => void;
	onblur: () => void;
	onclick: (event: MouseEvent & { currentTarget: HTMLInputElement }) => void;
}

export interface CheckableApi {
	readonly checked: boolean;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly required: boolean;
	readonly invalid: boolean;
	readonly hovered: boolean;
	readonly focused: boolean;
	readonly focusVisible: boolean;
	readonly active: boolean;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	id(part: CheckablePart): string;
	setChecked(next: boolean): void;
	toggle(): void;
	setHovered(next: boolean): void;
	setActive(next: boolean): void;
	dataAttrs(state?: string): CheckableDataAttrs;
	labelProps(): CheckablePartProps;
	controlProps(): CheckableControlProps;
	hiddenInputProps(): CheckableHiddenInputProps;
}

export function createCheckable(
	kind: string,
	getProps: () => CheckableProps,
	uid: string,
	getGroup?: () => CheckableGroupAccess | undefined
): CheckableApi {
	const id = getProps().id ?? uid;
	const idFor = (part: CheckablePart) =>
		getProps().ids?.[part] ??
		(part === 'root' ? `${kind}:${id}` : `${kind}:${id}:${part === 'hiddenInput' ? 'input' : part}`);

	let internalChecked = $state(getProps().defaultChecked ?? getProps().checked ?? false);
	let hovered = $state(false);
	let focused = $state(false);
	let focusVisible = $state(false);
	let active = $state(false);

	const group = () => getGroup?.();
	const isControlled = () => getProps().checked !== undefined;
	const ownValue = () => getProps().value ?? '';
	const checked = () => {
		const current = group();
		if (current) return current.has(ownValue());
		return isControlled() ? Boolean(getProps().checked) : internalChecked;
	};
	const isDisabled = () => Boolean(getProps().disabled) || Boolean(group()?.disabled);
	const isReadOnly = () => Boolean(getProps().readOnly) || Boolean(group()?.readOnly);
	const isRequired = () => Boolean(getProps().required) || Boolean(group()?.required);
	const isInvalid = () => Boolean(getProps().invalid) || Boolean(group()?.invalid);

	function setChecked(next: boolean) {
		if (isDisabled() || isReadOnly()) return;
		const current = group();
		if (current) {
			if (current.has(ownValue()) !== next) current.toggle(ownValue());
		} else if (!isControlled()) {
			internalChecked = next;
		}
		getProps().onCheckedChange?.({ checked: next });
	}

	function dataAttrs(state?: string): CheckableDataAttrs {
		const disabled = isDisabled();
		return {
			'data-active': dataAttr(active),
			'data-focus': dataAttr(!disabled && focused),
			'data-focus-visible': dataAttr(!disabled && focusVisible),
			'data-readonly': dataAttr(isReadOnly()),
			'data-hover': dataAttr(hovered),
			'data-disabled': dataAttr(disabled),
			'data-state': state ?? (checked() ? 'checked' : 'unchecked'),
			'data-invalid': dataAttr(isInvalid()),
			'data-required': dataAttr(isRequired())
		};
	}

	return {
		id: idFor,
		setChecked,
		dataAttrs,
		get checked() {
			return checked();
		},
		get disabled() {
			return isDisabled();
		},
		get readOnly() {
			return isReadOnly();
		},
		get required() {
			return isRequired();
		},
		get invalid() {
			return isInvalid();
		},
		get hovered() {
			return hovered;
		},
		get focused() {
			return !isDisabled() && focused;
		},
		get focusVisible() {
			return !isDisabled() && focusVisible;
		},
		get active() {
			return active;
		},
		get dir() {
			return getProps().dir;
		},
		toggle() {
			setChecked(!checked());
		},
		setHovered(next) {
			if (isDisabled()) return;
			hovered = next;
		},
		setActive(next) {
			active = next;
		},
		labelProps() {
			return {
				id: idFor('label'),
				...dataAttrs()
			};
		},
		controlProps() {
			return {
				id: idFor('control'),
				'aria-hidden': true,
				...dataAttrs()
			};
		},
		hiddenInputProps() {
			return {
				id: idFor('hiddenInput'),
				type: 'checkbox',
				required: isRequired(),
				defaultChecked: checked(),
				disabled: isDisabled(),
				'aria-labelledby': idFor('label'),
				'aria-invalid': isInvalid(),
				name: group()?.name ?? getProps().name,
				form: getProps().form,
				value: getProps().value,
				style: visuallyHiddenStyle,
				onpointerdown() {
					active = true;
				},
				onpointerup() {
					active = false;
				},
				onfocus() {
					focused = true;
					focusVisible = isFocusVisible();
				},
				onblur() {
					focused = false;
					focusVisible = false;
				},
				onclick(event: MouseEvent & { currentTarget: HTMLInputElement }) {
					if (isDisabled()) return;
					if (isReadOnly()) {
						event.preventDefault();
						return;
					}
					setChecked(event.currentTarget.checked);
				}
			};
		}
	};
}
