import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import { useFieldsetContext } from '../fieldset/fieldset.state.svelte';

const ariaAttr = (value: unknown): true | undefined => (value ? true : undefined);

export interface FieldIds {
	root?: string;
	control?: string;
	label?: string;
	errorText?: string;
	helperText?: string;
}

export interface UseFieldProps {
	id?: string | null;
	ids?: FieldIds;
	disabled?: boolean;
	invalid?: boolean;
	readOnly?: boolean;
	required?: boolean;
	target?: string;
}

export interface FieldApi {
	readonly disabled: boolean;
	readonly invalid: boolean;
	readonly readOnly: boolean;
	readonly required: boolean;
	readonly ariaDescribedby: string | undefined;
	readonly ids: {
		root: string;
		label: string;
		control: string;
		input: string;
		textarea: string;
		select: string;
		errorText: string;
		helperText: string;
		item: string;
		requiredIndicator: string;
	};
	setRootRef(node: Element | null): void;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	inputAttrs(): Record<string, unknown>;
	textareaAttrs(): Record<string, unknown>;
	selectAttrs(): Record<string, unknown>;
	errorTextAttrs(): Record<string, unknown>;
	helperTextAttrs(): Record<string, unknown>;
	requiredIndicatorAttrs(): Record<string, unknown>;
}

const fieldContext = createContext<FieldApi>('Field', 'Field');

export const setFieldContext = (api: FieldApi): FieldApi => fieldContext.set(api);
export const useFieldContext = (): FieldApi | undefined => fieldContext.use();

export function createField(props: () => UseFieldProps, uid: string): FieldApi {
	const fieldset = useFieldsetContext();

	const resolvedId = () => props().id ?? uid;
	const ids = () => props().ids;
	const disabled = () => props().disabled ?? Boolean(fieldset?.disabled);
	const invalid = () => props().invalid ?? false;
	const readOnly = () => props().readOnly ?? false;
	const required = () => props().required ?? false;

	const rootId = () => ids()?.root ?? `field::${resolvedId()}`;
	const controlId = () => ids()?.control ?? `field::${resolvedId()}::control`;
	const errorTextId = () => ids()?.errorText ?? `field::${resolvedId()}::error-text`;
	const helperTextId = () => ids()?.helperText ?? `field::${resolvedId()}::helper-text`;
	const labelId = () => ids()?.label ?? `field::${resolvedId()}::label`;
	const requiredIndicatorId = () => `field::${resolvedId()}::required-indicator`;

	let rootRef = $state<Element | null>(null);
	let hasErrorText = $state(false);
	let hasHelperText = $state(false);

	const checkTextElements = () => {
		if (!rootRef) return;
		const root = rootRef.getRootNode() as Document | ShadowRoot;
		hasErrorText = Boolean(root.getElementById?.(errorTextId()));
		hasHelperText = Boolean(root.getElementById?.(helperTextId()));
	};

	$effect(() => {
		if (!rootRef) return;
		checkTextElements();
		const win = rootRef.ownerDocument?.defaultView;
		if (!win) return;
		const observer = new win.MutationObserver(checkTextElements);
		observer.observe(rootRef, { childList: true, subtree: true });
		return () => observer.disconnect();
	});

	const errorMessageId = () => (hasErrorText && invalid() ? errorTextId() : undefined);
	const describedBy = () =>
		[errorMessageId(), hasHelperText ? helperTextId() : undefined]
			.filter(Boolean)
			.join(' ') || undefined;

	const targetControlId = () => {
		const target = props().target;
		return target ? `field::${resolvedId()}::item::${target}` : undefined;
	};

	const controlAttrs = () => ({
		'aria-describedby': describedBy(),
		'aria-invalid': ariaAttr(invalid()),
		'data-invalid': dataAttr(invalid()),
		'data-required': dataAttr(required()),
		'data-readonly': dataAttr(readOnly()),
		id: controlId(),
		required: required() || undefined,
		disabled: disabled() || undefined,
		readonly: readOnly() || undefined
	});

	return {
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
		get ariaDescribedby() {
			return describedBy();
		},
		get ids() {
			const control = controlId();
			return {
				root: rootId(),
				label: labelId(),
				control,
				input: control,
				textarea: control,
				select: control,
				errorText: errorTextId(),
				helperText: helperTextId(),
				item: control,
				requiredIndicator: requiredIndicatorId()
			};
		},
		setRootRef(node) {
			rootRef = node;
		},
		rootAttrs: () => ({
			id: rootId(),
			role: 'group',
			'data-disabled': dataAttr(disabled()),
			'data-invalid': dataAttr(invalid()),
			'data-readonly': dataAttr(readOnly())
		}),
		labelAttrs: () => ({
			id: labelId(),
			'data-disabled': dataAttr(disabled()),
			'data-invalid': dataAttr(invalid()),
			'data-readonly': dataAttr(readOnly()),
			'data-required': dataAttr(required()),
			for: targetControlId() ?? controlId()
		}),
		inputAttrs: () => controlAttrs(),
		textareaAttrs: () => controlAttrs(),
		selectAttrs: () => controlAttrs(),
		errorTextAttrs: () => ({
			id: errorTextId(),
			'aria-live': 'polite'
		}),
		helperTextAttrs: () => ({
			id: helperTextId(),
			'data-disabled': dataAttr(disabled())
		}),
		requiredIndicatorAttrs: () => ({
			'aria-hidden': true
		})
	};
}

export function createFieldItem(parent: FieldApi, value: () => string): FieldApi {
	const controlId = () => `${parent.ids.root}::item::${value()}`;
	const labelId = () => `${controlId()}::label`;
	const control = () => ({ ...parent.inputAttrs(), id: controlId() });

	return {
		get disabled() {
			return parent.disabled;
		},
		get invalid() {
			return parent.invalid;
		},
		get readOnly() {
			return parent.readOnly;
		},
		get required() {
			return parent.required;
		},
		get ariaDescribedby() {
			return parent.ariaDescribedby;
		},
		get ids() {
			const id = controlId();
			return {
				...parent.ids,
				control: id,
				label: labelId(),
				input: id,
				textarea: id,
				select: id,
				item: id
			};
		},
		setRootRef: (node) => parent.setRootRef(node),
		rootAttrs: () => parent.rootAttrs(),
		labelAttrs: () => ({ ...parent.labelAttrs(), id: labelId(), for: controlId() }),
		inputAttrs: control,
		textareaAttrs: control,
		selectAttrs: control,
		errorTextAttrs: () => parent.errorTextAttrs(),
		helperTextAttrs: () => parent.helperTextAttrs(),
		requiredIndicatorAttrs: () => parent.requiredIndicatorAttrs()
	};
}
