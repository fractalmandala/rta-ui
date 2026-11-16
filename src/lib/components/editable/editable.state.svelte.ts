import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import { useFieldContext } from '../field/field.state.svelte';

const ariaAttr = (value: unknown): true | undefined => (value ? true : undefined);

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

export type EditableActivationMode = 'focus' | 'dblclick' | 'click' | 'none';

export type EditableSubmitMode = 'enter' | 'blur' | 'both' | 'none';

export interface EditableValueChangeDetails {
	value: string;
}

export interface EditableEditChangeDetails {
	edit: boolean;
}

export interface EditableTranslations {
	input?: string | undefined;
	edit?: string | undefined;
	submit?: string | undefined;
	cancel?: string | undefined;
}

export interface EditablePlaceholder {
	edit: string;
	preview: string;
}

export interface EditableElementIds {
	root?: string | undefined;
	area?: string | undefined;
	label?: string | undefined;
	preview?: string | undefined;
	input?: string | undefined;
	control?: string | undefined;
	submitTrigger?: string | undefined;
	cancelTrigger?: string | undefined;
	editTrigger?: string | undefined;
}

export interface EditableInteractOutsideEvent {
	readonly defaultPrevented: boolean;
	readonly originalEvent: Event;
	readonly detail: { focusable: Element | null };
	preventDefault(): void;
}

export interface UseEditableProps {
	id?: string | null;
	ids?: EditableElementIds;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	value?: string;
	defaultValue?: string;
	edit?: boolean;
	defaultEdit?: boolean;
	name?: string;
	form?: string;
	maxLength?: number;
	placeholder?: string | EditablePlaceholder;
	translations?: EditableTranslations;
	autoResize?: boolean;
	activationMode?: EditableActivationMode;
	submitMode?: EditableSubmitMode;
	selectOnFocus?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	required?: boolean;
	finalFocusEl?: (() => HTMLElement | null) | undefined;
	onValueChange?: (details: EditableValueChangeDetails) => void;
	onValueCommit?: (details: EditableValueChangeDetails) => void;
	onValueRevert?: (details: EditableValueChangeDetails) => void;
	onEditChange?: (details: EditableEditChangeDetails) => void;
	onFocusOutside?: (event: EditableInteractOutsideEvent) => void;
	onPointerDownOutside?: (event: EditableInteractOutsideEvent) => void;
	onInteractOutside?: (event: EditableInteractOutsideEvent) => void;
}

export interface EditableApi {
	readonly editing: boolean;
	readonly empty: boolean;
	readonly value: string;
	readonly valueText: string;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly invalid: boolean;
	readonly required: boolean;
	readonly autoResize: boolean;
	readonly activationMode: EditableActivationMode;
	readonly submitMode: EditableSubmitMode;
	readonly ids: {
		root: string;
		area: string;
		label: string;
		preview: string;
		input: string;
		control: string;
		editTrigger: string;
		submitTrigger: string;
		cancelTrigger: string;
	};
	setValue(value: string): void;
	clearValue(): void;
	edit(): void;
	cancel(): void;
	submit(): void;
	registerRoot(node: Element | null): void;
	rootAttrs(): Record<string, unknown>;
	areaAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	previewAttrs(): Record<string, unknown>;
	inputAttrs(): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	editTriggerAttrs(): Record<string, unknown>;
	submitTriggerAttrs(): Record<string, unknown>;
	cancelTriggerAttrs(): Record<string, unknown>;
}

const editableContext = createContext<EditableApi>('Editable', 'Editable');

export const setEditableContext = (api: EditableApi): EditableApi => editableContext.set(api);

export const useEditableContext = (): EditableApi => editableContext.get();

const defaultTranslations: Required<EditableTranslations> = {
	input: 'editable input',
	edit: 'edit',
	submit: 'submit',
	cancel: 'cancel'
};

export function createEditable(getProps: () => UseEditableProps, uid: string): EditableApi {
	const field = useFieldContext();

	const propId = () => getProps().id ?? uid;
	const rootId = () => ids().root ?? `editable:${propId()}`;
	const areaId = () => ids().area ?? `editable:${propId()}:area`;
	const labelId = () => ids().label ?? `editable:${propId()}:label`;
	const previewId = () => ids().preview ?? `editable:${propId()}:preview`;
	const inputId = () => ids().input ?? `editable:${propId()}:input`;
	const controlId = () => ids().control ?? `editable:${propId()}:control`;
	const editTriggerId = () => ids().editTrigger ?? `editable:${propId()}:edit`;
	const submitTriggerId = () => ids().submitTrigger ?? `editable:${propId()}:submit`;
	const cancelTriggerId = () => ids().cancelTrigger ?? `editable:${propId()}:cancel`;

	const ids = (): EditableElementIds => {
		const fieldIds: EditableElementIds = field
			? { label: field.ids.label, input: field.ids.control }
			: {};
		return { ...fieldIds, ...getProps().ids };
	};

	const disabled = () => Boolean(getProps().disabled ?? field?.disabled);
	const invalid = () => Boolean(getProps().invalid ?? field?.invalid);
	const readOnly = () => Boolean(getProps().readOnly ?? field?.readOnly);
	const required = () => Boolean(getProps().required ?? field?.required);
	const autoResize = () => Boolean(getProps().autoResize);
	const interactive = () => !(disabled() || readOnly());

	const activationMode = (): EditableActivationMode => getProps().activationMode ?? 'focus';
	const submitMode = (): EditableSubmitMode => getProps().submitMode ?? 'both';
	const selectOnFocus = () => getProps().selectOnFocus ?? true;
	const submitOnEnter = () => submitMode() === 'both' || submitMode() === 'enter';
	const submitOnBlur = () => submitMode() === 'both' || submitMode() === 'blur';
	const translations = (): Required<EditableTranslations> => ({
		...defaultTranslations,
		...getProps().translations
	});
	const dir = () => getProps().dir ?? undefined;

	let internalValue = $state(getProps().defaultValue ?? '');
	let internalEditing = $state(Boolean(getProps().edit || getProps().defaultEdit));
	let previousValue = $state(getProps().value ?? getProps().defaultValue ?? '');
	let pendingSubmit = $state(false);
	let rootNode = $state<Element | null>(null);

	const value = () => getProps().value ?? internalValue;
	const editing = () => getProps().edit ?? internalEditing;
	const empty = () => value().trim() === '';

	const placeholder = (): EditablePlaceholder | undefined => {
		const prop = getProps().placeholder;
		if (prop == null) return undefined;
		return typeof prop === 'string' ? { edit: prop, preview: prop } : prop;
	};
	const valueText = () => (empty() ? (placeholder()?.preview ?? '') : value());

	const byId = (elementId: string): HTMLElement | null => {
		const node = rootNode;
		if (!node) return null;
		const root = node.getRootNode() as Document | ShadowRoot;
		return (root.getElementById?.(elementId) as HTMLElement | null) ?? null;
	};
	const inputEl = () => byId(inputId()) as HTMLInputElement | HTMLTextAreaElement | null;
	const previewEl = () => byId(previewId());
	const editTriggerEl = () => byId(editTriggerId());
	const submitTriggerEl = () => byId(submitTriggerId());
	const cancelTriggerEl = () => byId(cancelTriggerId());

	const raf = (callback: () => void) => {
		const win = rootNode?.ownerDocument?.defaultView;
		if (win?.requestAnimationFrame) win.requestAnimationFrame(() => callback());
		else setTimeout(callback, 0);
	};

	const focusInput = () => {
		raf(() => {
			const input = inputEl();
			if (!input) return;
			input.focus({ preventScroll: true });
			if (selectOnFocus()) input.select();
		});
	};

	const restoreFocus = (skip: boolean) => {
		if (skip) return;
		raf(() => {
			const target = getProps().finalFocusEl?.() ?? editTriggerEl();
			target?.focus({ preventScroll: true });
		});
	};

	const blurInput = () => inputEl()?.blur();

	const setValue = (next: string) => {
		const maxLength = getProps().maxLength;
		const limited = maxLength != null ? next.slice(0, maxLength) : next;
		if (getProps().value === undefined) internalValue = limited;
		getProps().onValueChange?.({ value: limited });
	};

	const clearValue = () => setValue('');

	const enterEdit = () => {
		previousValue = value();
		focusInput();
	};

	const edit = () => {
		if (!interactive() || editing()) return;
		if (getProps().edit !== undefined) {
			getProps().onEditChange?.({ edit: true });
			return;
		}
		internalEditing = true;
		enterEdit();
		getProps().onEditChange?.({ edit: true });
	};

	const cancel = (focusable?: Element | null) => {
		if (!interactive() || !editing()) return;
		if (getProps().edit !== undefined) {
			pendingSubmit = false;
			getProps().onEditChange?.({ edit: false });
			return;
		}
		const reverted = previousValue;
		internalEditing = false;
		setValue(reverted);
		blurInput();
		restoreFocus(Boolean(focusable));
		getProps().onValueRevert?.({ value: reverted });
		getProps().onEditChange?.({ edit: false });
	};

	const submit = (focusable?: Element | null) => {
		if (!interactive() || !editing()) return;
		if (getProps().edit !== undefined) {
			pendingSubmit = true;
			getProps().onEditChange?.({ edit: false });
			return;
		}
		syncFromInput();
		previousValue = value();
		internalEditing = false;
		blurInput();
		restoreFocus(Boolean(focusable));
		getProps().onValueCommit?.({ value: value() });
		getProps().onEditChange?.({ edit: false });
	};

	$effect(() => {
		const next = value();
		const input = inputEl();
		if (!input || input.value === next) return;
		input.value = next;
	});

	let watchedEdit = getProps().edit;
	$effect(() => {
		const next = getProps().edit;
		if (next === undefined || next === watchedEdit) return;
		watchedEdit = next;
		if (next) {
			enterEdit();
			return;
		}
		if (pendingSubmit) {
			pendingSubmit = false;
			previousValue = value();
			getProps().onValueCommit?.({ value: value() });
			return;
		}
		const reverted = previousValue;
		setValue(reverted);
		getProps().onValueRevert?.({ value: reverted });
	});

	$effect(() => {
		if (!editing()) return;
		const node = rootNode;
		if (!node) return;
		const win = node.ownerDocument.defaultView;
		if (!win) return;

		const isExcluded = (target: Node) =>
			Boolean(cancelTriggerEl()?.contains(target) || submitTriggerEl()?.contains(target));

		const interactOutside = (originalEvent: Event, focusable: Element | null) => {
			let prevented = false;
			const event: EditableInteractOutsideEvent = {
				originalEvent,
				detail: { focusable },
				get defaultPrevented() {
					return prevented;
				},
				preventDefault() {
					prevented = true;
				}
			};
			if (originalEvent.type === 'focusin') getProps().onFocusOutside?.(event);
			else getProps().onPointerDownOutside?.(event);
			if (prevented) return;
			getProps().onInteractOutside?.(event);
			if (prevented) return;
			if (submitOnBlur()) submit(focusable);
			else cancel(focusable);
		};

		const onPointerDown = (event: Event) => {
			const target = event.target as Node | null;
			if (!target || inputEl()?.contains(target) || isExcluded(target)) return;
			interactOutside(event, null);
		};

		const onFocusIn = (event: Event) => {
			const target = event.target as Node | null;
			if (!target || inputEl()?.contains(target) || isExcluded(target)) return;
			interactOutside(event, target as Element);
		};

		win.document.addEventListener('pointerdown', onPointerDown, true);
		win.document.addEventListener('focusin', onFocusIn, true);
		return () => {
			win.document.removeEventListener('pointerdown', onPointerDown, true);
			win.document.removeEventListener('focusin', onFocusIn, true);
		};
	});

	const stateData = () => (editing() ? 'edit' : 'preview');

	const handleChange = (event: Event) => {
		const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement;
		setValue(target.value);
	};

	const activatePreview = (event: MouseEvent) => {
		if (!interactive()) return;
		event.preventDefault();
		edit();
	};

	const syncFromInput = () => {
		const current = inputEl()?.value;
		if (current !== undefined && current !== value()) setValue(current);
	};

	return {
		get editing() {
			return editing();
		},
		get empty() {
			return empty();
		},
		get value() {
			return value();
		},
		get valueText() {
			return valueText();
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
			return required();
		},
		get autoResize() {
			return autoResize();
		},
		get activationMode() {
			return activationMode();
		},
		get submitMode() {
			return submitMode();
		},
		get ids() {
			return {
				root: rootId(),
				area: areaId(),
				label: labelId(),
				preview: previewId(),
				input: inputId(),
				control: controlId(),
				editTrigger: editTriggerId(),
				submitTrigger: submitTriggerId(),
				cancelTrigger: cancelTriggerId()
			};
		},
		setValue,
		clearValue,
		edit,
		cancel: () => cancel(),
		submit: () => submit(),
		registerRoot: (node) => {
			rootNode = node;
		},
		rootAttrs: () =>
			dropUndefined({
				'data-scope': 'editable',
				'data-part': 'root',
				id: rootId(),
				dir: dir(),
				'data-state': stateData(),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(invalid()),
				'data-required': dataAttr(required())
			}),
		areaAttrs: () =>
			dropUndefined({
				'data-scope': 'editable',
				'data-part': 'area',
				id: areaId(),
				dir: dir(),
				'data-state': stateData(),
				'data-focus': dataAttr(editing()),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(invalid()),
				'data-empty': dataAttr(empty()),
				'data-placeholder-shown': dataAttr(empty() && Boolean(placeholder()?.preview)),
				style: autoResize() ? 'display: inline-grid;' : undefined
			}),
		labelAttrs: () =>
			dropUndefined({
				'data-scope': 'editable',
				'data-part': 'label',
				id: labelId(),
				dir: dir(),
				for: inputId(),
				'data-state': stateData(),
				'data-focus': dataAttr(editing()),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(invalid()),
				'data-required': dataAttr(required()),
				onclick: () => {
					if (!interactive()) return;
					previewEl()?.focus();
				}
			}),
		previewAttrs: () =>
			dropUndefined({
				'data-scope': 'editable',
				'data-part': 'preview',
				dir: dir(),
				id: previewId(),
				tabindex: interactive() ? 0 : undefined,
				'aria-label': translations().edit,
				'aria-disabled': ariaAttr(disabled()),
				'aria-invalid': ariaAttr(invalid()),
				'data-state': stateData(),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(invalid()),
				'data-empty': dataAttr(empty()),
				'data-placeholder-shown': dataAttr(empty() && Boolean(placeholder()?.preview)),
				'data-autoresize': dataAttr(autoResize()),
				hidden: autoResize() ? undefined : editing(),
				style: autoResize()
					? `white-space: pre; grid-area: 1 / 1 / auto / auto; overflow: hidden; text-overflow: ellipsis;${
							editing() ? ' visibility: hidden;' : ''
						}`
					: undefined,
				onclick: (event: MouseEvent) => {
					if (activationMode() === 'click') activatePreview(event);
				},
				ondblclick: (event: MouseEvent) => {
					if (activationMode() === 'dblclick') activatePreview(event);
				},
				onfocus: () => {
					if (activationMode() === 'focus' && !editing()) edit();
				}
			}),
		inputAttrs: () =>
			dropUndefined({
				'data-scope': 'editable',
				'data-part': 'input',
				id: inputId(),
				'aria-label': !field ? translations().input : undefined,
				'aria-labelledby': labelId(),
				'aria-describedby': field?.ariaDescribedby,
				'aria-invalid': ariaAttr(invalid()),
				name: getProps().name,
				form: getProps().form,
				'data-state': stateData(),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(invalid()),
				'data-empty': dataAttr(empty()),
				'data-placeholder-shown': dataAttr(empty() && Boolean(placeholder()?.edit)),
				'data-autoresize': dataAttr(autoResize()),
				placeholder: placeholder()?.edit,
				maxlength: getProps().maxLength,
				size: autoResize() ? 1 : undefined,
				autofocus: getProps().edit || getProps().defaultEdit || undefined,
				hidden: autoResize() ? undefined : !editing(),
				disabled: disabled() || undefined,
				readonly: readOnly() || undefined,
				required: required() || undefined,
				dir: dir(),
				autocomplete: 'off',
				autocapitalize: 'off',
				autocorrect: 'off',
				spellcheck: 'false',
				style: autoResize()
					? `grid-area: 1 / 1 / auto / auto;${editing() ? '' : ' visibility: hidden;'}`
					: undefined,
				onchange: handleChange,
				onkeydown: (event: KeyboardEvent) => {
					if (event.defaultPrevented || event.isComposing) return;
					if (event.key === 'Escape') {
						if (activationMode() === 'none') return;
						event.preventDefault();
						cancel();
						return;
					}
					if (event.key !== 'Enter' || !submitOnEnter()) return;
					const localName = (event.currentTarget as HTMLElement).localName;
					if (localName === 'textarea') {
						if (!(event.metaKey || event.ctrlKey)) return;
						event.preventDefault();
						submit();
						return;
					}
					if (localName === 'input' && !event.shiftKey && !event.metaKey) {
						event.preventDefault();
						submit();
					}
				}
			}),
		controlAttrs: () =>
			dropUndefined({
				'data-scope': 'editable',
				'data-part': 'control',
				id: controlId(),
				'data-state': stateData(),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly())
			}),
		editTriggerAttrs: () =>
			dropUndefined({
				'data-scope': 'editable',
				'data-part': 'edit-trigger',
				id: editTriggerId(),
				type: 'button',
				'aria-label': translations().edit,
				'data-state': stateData(),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				disabled: disabled() || undefined,
				hidden: editing(),
				onclick: () => edit()
			}),
		submitTriggerAttrs: () =>
			dropUndefined({
				'data-scope': 'editable',
				'data-part': 'submit-trigger',
				id: submitTriggerId(),
				type: 'button',
				'aria-label': translations().submit,
				'data-state': stateData(),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				disabled: disabled() || undefined,
				onclick: () => submit()
			}),
		cancelTriggerAttrs: () =>
			dropUndefined({
				'data-scope': 'editable',
				'data-part': 'cancel-trigger',
				id: cancelTriggerId(),
				type: 'button',
				'aria-label': translations().cancel,
				'data-state': stateData(),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				disabled: disabled() || undefined,
				onclick: () => cancel()
			})
	};
}
