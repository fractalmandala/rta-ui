import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';

export interface ClipboardValueChangeDetails {
	value: string;
}

export interface ClipboardCopyStatusDetails {
	value: string;
}

export interface UseClipboardProps {
	value?: string;
	defaultValue?: string;
	timeout?: number;
	id?: string | null;
	onValueChange?: (details: ClipboardValueChangeDetails) => void;
	onCopy?: (details: ClipboardCopyStatusDetails) => void;
}

export interface ClipboardApi {
	readonly copied: boolean;
	readonly value: string;
	readonly rootId: string;
	readonly inputId: string;
	readonly labelId: string;
	setValue(value: string): void;
	copy(): void;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	inputAttrs(): Record<string, unknown>;
	triggerAttrs(): Record<string, unknown>;
	indicatorAttrs(copied: boolean): Record<string, unknown>;
}

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

const clipboardContext = createContext<ClipboardApi>('Clipboard', 'Clipboard.Root');
export const useClipboardContext = () => clipboardContext.get();
export const setClipboardContext = (api: ClipboardApi) => clipboardContext.set(api);

export function createClipboard(getProps: () => UseClipboardProps, uid: string): ClipboardApi {
	const rootId = () => getProps().id ?? `clipboard:${uid}`;
	const inputId = () => `${rootId()}:input`;
	const labelId = () => `${rootId()}:label`;

	let internalValue = $state(getProps().defaultValue ?? '');
	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const value = () => getProps().value ?? internalValue;

	function setValue(next: string) {
		if (getProps().value === undefined) internalValue = next;
		getProps().onValueChange?.({ value: next });
	}

	function copy() {
		const next = value();
		void navigator.clipboard?.writeText(next);
		if (timer) clearTimeout(timer);
		copied = true;
		getProps().onCopy?.({ value: next });
		timer = setTimeout(() => {
			copied = false;
		}, getProps().timeout ?? 3000);
	}

	return {
		setValue,
		copy,
		rootAttrs: () => ({ id: rootId(), 'data-copied': dataAttr(copied) }),
		labelAttrs: () =>
			dropUndefined({ for: inputId(), id: labelId(), 'data-copied': dataAttr(copied) }),
		controlAttrs: () => ({ 'data-copied': dataAttr(copied) }),
		inputAttrs: () =>
			dropUndefined({
				id: inputId(),
				value: value(),
				readonly: true,
				'data-readonly': 'true',
				'data-copied': dataAttr(copied),
				onfocus(event: FocusEvent) {
					(event.currentTarget as HTMLInputElement).select();
				},
				oncopy() {
					if (timer) clearTimeout(timer);
					copied = true;
					getProps().onCopy?.({ value: value() });
					timer = setTimeout(() => {
						copied = false;
					}, getProps().timeout ?? 3000);
				}
			}),
		triggerAttrs: () =>
			dropUndefined({
				type: 'button',
				'aria-label': copied ? 'Copied to clipboard' : 'Copy to clipboard',
				'data-copied': dataAttr(copied),
				onclick() {
					copy();
				}
			}),
		indicatorAttrs: (indicatorCopied: boolean) => ({ hidden: indicatorCopied !== copied }),
		get copied() {
			return copied;
		},
		get value() {
			return value();
		},
		get rootId() {
			return rootId();
		},
		get inputId() {
			return inputId();
		},
		get labelId() {
			return labelId();
		}
	};
}
