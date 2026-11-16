import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';

export interface UseFieldsetProps {
	id?: string | null;
	disabled?: boolean;
	invalid?: boolean;
}

export interface FieldsetApi {
	readonly disabled: boolean;
	readonly invalid: boolean;
	readonly ids: {
		legend: string;
		errorText: string;
		helperText: string;
	};
	setRootRef(node: Element | null): void;
	rootAttrs(): Record<string, unknown>;
	legendAttrs(): Record<string, unknown>;
	helperTextAttrs(): Record<string, unknown>;
	errorTextAttrs(): Record<string, unknown>;
}

const fieldsetContext = createContext<FieldsetApi>('Fieldset', 'Fieldset');

export const setFieldsetContext = (api: FieldsetApi): FieldsetApi => fieldsetContext.set(api);
export const useFieldsetContext = (): FieldsetApi | undefined => fieldsetContext.use();

export function createFieldset(props: () => UseFieldsetProps, uid: string): FieldsetApi {
	const resolvedId = () => props().id ?? uid;
	const disabled = () => props().disabled ?? false;
	const invalid = () => props().invalid ?? false;

	const legendId = () => `fieldset::${resolvedId()}::legend`;
	const errorTextId = () => `fieldset::${resolvedId()}::error-text`;
	const helperTextId = () => `fieldset::${resolvedId()}::helper-text`;

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

	const describedBy = () => {
		const ids: string[] = [];
		if (hasErrorText && invalid()) ids.push(errorTextId());
		if (hasHelperText) ids.push(helperTextId());
		return ids.join(' ') || undefined;
	};

	return {
		get disabled() {
			return disabled();
		},
		get invalid() {
			return invalid();
		},
		get ids() {
			return {
				legend: legendId(),
				errorText: errorTextId(),
				helperText: helperTextId()
			};
		},
		setRootRef(node) {
			rootRef = node;
		},
		rootAttrs: () => ({
			disabled: disabled() || undefined,
			'data-disabled': dataAttr(disabled()),
			'data-invalid': dataAttr(invalid()),
			'aria-labelledby': legendId(),
			'aria-describedby': describedBy()
		}),
		legendAttrs: () => ({
			id: legendId(),
			'data-disabled': dataAttr(disabled()),
			'data-invalid': dataAttr(invalid())
		}),
		helperTextAttrs: () => ({
			id: helperTextId()
		}),
		errorTextAttrs: () => ({
			id: errorTextId(),
			'aria-live': 'polite'
		})
	};
}
