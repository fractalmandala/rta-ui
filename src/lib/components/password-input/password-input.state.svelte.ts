import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import { useFieldContext } from '../field/field.state.svelte';

export interface PasswordInputVisibilityChangeDetails {
	visible: boolean;
}

export interface PasswordInputElementIds {
	root?: string;
	input?: string;
}

export interface UsePasswordInputProps {
	autoComplete?: string;
	defaultVisible?: boolean;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	disabled?: boolean;
	id?: string | null;
	ids?: PasswordInputElementIds;
	ignorePasswordManagers?: boolean;
	invalid?: boolean;
	name?: string;
	onVisibilityChange?: (details: PasswordInputVisibilityChangeDetails) => void;
	readOnly?: boolean;
	required?: boolean;
	translations?: { visibilityTrigger?: (visible: boolean) => string };
	visible?: boolean;
}

export interface PasswordInputApi {
	readonly visible: boolean;
	readonly disabled: boolean;
	readonly invalid: boolean;
	readonly readOnly: boolean;
	readonly required: boolean;
	readonly rootId: string;
	readonly inputId: string;
	focus(): void;
	setVisible(next: boolean): void;
	toggleVisible(): void;
	registerInput(node: HTMLInputElement | null): void;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	inputAttrs(): Record<string, unknown>;
	indicatorAttrs(): Record<string, unknown>;
	visibilityTriggerAttrs(): Record<string, unknown>;
}

const passwordManagerAttrs = {
	'data-1p-ignore': '',
	'data-lpignore': 'true',
	'data-bwignore': 'true',
	'data-form-type': 'other',
	'data-protonpass-ignore': 'true'
};

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

function nativeEvent<E extends Event>(event: E): E {
	return ((event as { nativeEvent?: Event }).nativeEvent as E | undefined) ?? event;
}

function isVirtualClick(event: MouseEvent & { pointerType?: string }) {
	if (event.pointerType === '' && event.isTrusted) return true;
	if (/Android/i.test(navigator.userAgent) && event.pointerType) {
		return event.type === 'click' && event.buttons === 1;
	}
	return event.detail === 0 && !event.pointerType;
}

const passwordInputContext = createContext<PasswordInputApi>('PasswordInput', 'PasswordInput.Root');
export const usePasswordInputContext = () => passwordInputContext.get();
export const setPasswordInputContext = (api: PasswordInputApi) =>
	passwordInputContext.set(api);

export function createPasswordInput(
	getProps: () => UsePasswordInputProps,
	uid: string
): PasswordInputApi {
	const field = useFieldContext();

	const rootId = () => getProps().ids?.root ?? `p-input-${uid}`;
	const inputId = () => getProps().ids?.input ?? field?.ids.control ?? `p-input-${uid}-input`;

	const disabled = () => Boolean(getProps().disabled ?? field?.disabled);
	const readOnly = () => Boolean(getProps().readOnly ?? field?.readOnly);
	const invalid = () => Boolean(getProps().invalid ?? field?.invalid);
	const required = () => Boolean(getProps().required ?? field?.required);
	const interactive = () => !readOnly() && !disabled();

	let internalVisible = $state(Boolean(getProps().defaultVisible));
	let inputNode = $state<HTMLInputElement | null>(null);

	const isControlled = () => getProps().visible !== undefined;
	const visible = () => (isControlled() ? Boolean(getProps().visible) : internalVisible);

	function setVisible(next: boolean) {
		if (!isControlled()) internalVisible = next;
		getProps().onVisibilityChange?.({ visible: next });
	}

	function toggleVisible() {
		setVisible(!visible());
	}

	$effect(() => {
		const node = inputNode;
		if (!node) return;
		const form = node.form;
		if (!form) return;
		const controller = new AbortController();
		form.addEventListener('reset', () => setVisible(false), { signal: controller.signal });
		form.addEventListener('submit', () => setVisible(false), { signal: controller.signal });
		return () => controller.abort();
	});

	function handlePointerDown(event: PointerEvent) {
		if (event.button !== 0) return;
		if (!interactive()) return;
		event.preventDefault();
		toggleVisible();
	}

	function handleClick(event: MouseEvent) {
		if (!isVirtualClick(nativeEvent(event))) return;
		if (!interactive()) return;
		toggleVisible();
	}

	return {
		focus() {
			inputNode?.focus();
		},
		setVisible,
		toggleVisible,
		registerInput(node) {
			inputNode = node;
		},
		rootAttrs() {
			return dropUndefined({
				id: rootId(),
				dir: getProps().dir ?? undefined,
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly())
			});
		},
		labelAttrs() {
			return dropUndefined({
				for: inputId(),
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly()),
				'data-required': dataAttr(required())
			});
		},
		controlAttrs() {
			return dropUndefined({
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly())
			});
		},
		inputAttrs() {
			return dropUndefined({
				id: inputId(),
				autocapitalize: 'off',
				name: getProps().name ?? undefined,
				required: required(),
				autocomplete: getProps().autoComplete ?? undefined,
				spellcheck: false,
				readonly: readOnly(),
				disabled: disabled(),
				type: visible() ? 'text' : 'password',
				'data-state': visible() ? 'visible' : 'hidden',
				'aria-invalid': invalid() || undefined,
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly()),
				...(getProps().ignorePasswordManagers ? passwordManagerAttrs : {})
			});
		},
		indicatorAttrs() {
			return dropUndefined({
				'aria-hidden': true,
				'data-state': visible() ? 'visible' : 'hidden',
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly())
			});
		},
		visibilityTriggerAttrs() {
			const label =
				getProps().translations?.visibilityTrigger?.(visible()) ??
				(visible() ? 'Hide password' : 'Show password');
			return dropUndefined({
				type: 'button',
				'aria-controls': inputId(),
				'aria-label': label,
				disabled: disabled(),
				'data-state': visible() ? 'visible' : 'hidden',
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				onpointerdown: handlePointerDown,
				onclick: handleClick
			});
		},
		get visible() {
			return visible();
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
		get rootId() {
			return rootId();
		},
		get inputId() {
			return inputId();
		}
	};
}
