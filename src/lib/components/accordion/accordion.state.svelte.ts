import { createContext } from '../../internal/context';

export interface AccordionValueChangeDetails {
	value: string[];
}

export interface AccordionFocusChangeDetails {
	value: string | null;
}

export interface UseAccordionProps {
	/** Controlled expanded item values. */
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (details: AccordionValueChangeDetails) => void;
	onFocusChange?: (details: AccordionFocusChangeDetails) => void;
	/** Allow several items to be open at once. */
	multiple?: boolean;
	/** Allow an open item to be collapsed again. */
	collapsible?: boolean;
	disabled?: boolean;
	orientation?: 'horizontal' | 'vertical';
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: {
		root?: string;
		item?: (value: string) => string;
		itemTrigger?: (value: string) => string;
		itemContent?: (value: string) => string;
	};
}

export interface AccordionApi {
	readonly value: string[];
	readonly focusedValue: string | null;
	readonly multiple: boolean;
	readonly collapsible: boolean;
	readonly disabled: boolean;
	readonly orientation: 'horizontal' | 'vertical';
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly rootId: string;
	itemId(value: string): string;
	itemTriggerId(value: string): string;
	itemContentId(value: string): string;
	isExpanded(value: string): boolean;
	isFocused(value: string): boolean;
	isItemDisabled(value: string, disabled?: boolean): boolean;
	setValue(value: string[]): void;
	toggleItem(value: string, disabled?: boolean): void;
	focusItem(value: string, disabled?: boolean): void;
	blurItem(): void;
	moveFocus(from: string, move: 'next' | 'prev' | 'first' | 'last', disabled?: boolean): void;
	registerRoot(node: HTMLElement | null): void;
}

export interface AccordionItemApi {
	readonly value: string;
	readonly disabled: boolean;
	readonly expanded: boolean;
	readonly focused: boolean;
	readonly orientation: 'horizontal' | 'vertical';
}

const accordionContext = createContext<AccordionApi>('Accordion', 'Accordion.Root');
export const useAccordionContext = () => accordionContext.get();
export const setAccordionContext = (api: AccordionApi) => accordionContext.set(api);

const accordionItemContext = createContext<AccordionItemApi>('AccordionItem', 'Accordion.Item');
export const useAccordionItemContext = () => accordionItemContext.get();
export const setAccordionItemContext = (api: AccordionItemApi) => accordionItemContext.set(api);

export function createAccordion(getProps: () => UseAccordionProps, uid: string): AccordionApi {
	const id = getProps().id ?? uid;
	const rootId = getProps().ids?.root ?? `accordion:${id}`;
	const itemId = (value: string) => getProps().ids?.item?.(value) ?? `accordion:${id}:item:${value}`;
	const itemTriggerId = (value: string) =>
		getProps().ids?.itemTrigger?.(value) ?? `accordion:${id}:item:${value}:trigger`;
	const itemContentId = (value: string) =>
		getProps().ids?.itemContent?.(value) ?? `accordion:${id}:item:${value}:content`;

	let internalValue = $state(getProps().defaultValue ?? getProps().value ?? []);
	let internalFocused = $state<string | null>(null);
	let rootNode: HTMLElement | null = null;

	const isControlled = () => getProps().value !== undefined;
	const currentValue = () => (isControlled() ? (getProps().value ?? []) : internalValue);
	const isExpanded = (value: string) => currentValue().includes(value);
	const isItemDisabled = (value: string, disabled?: boolean) =>
		Boolean(disabled ?? getProps().disabled);
	const triggers = () =>
		rootNode
			? Array.from(
					rootNode.querySelectorAll<HTMLButtonElement>('[data-scope="accordion"][data-part="item-trigger"]')
				).filter((trigger) => !trigger.disabled)
			: [];

	function setValue(next: string[]) {
		const multiple = Boolean(getProps().multiple);
		const value = !multiple && next.length > 1 ? [next[0]] : next;
		if (!isControlled()) internalValue = value;
		getProps().onValueChange?.({ value });
	}

	function setFocused(value: string | null) {
		if (internalFocused === value) return;
		internalFocused = value;
		getProps().onFocusChange?.({ value });
	}

	return {
		rootId,
		itemId,
		itemTriggerId,
		itemContentId,
		isExpanded,
		isItemDisabled,
		get value() {
			return currentValue();
		},
		get focusedValue() {
			return internalFocused;
		},
		get multiple() {
			return Boolean(getProps().multiple);
		},
		get collapsible() {
			return getProps().collapsible ?? true;
		},
		get disabled() {
			return Boolean(getProps().disabled);
		},
		get orientation() {
			return getProps().orientation ?? 'vertical';
		},
		get dir() {
			return getProps().dir;
		},
		isFocused(value) {
			return internalFocused === value;
		},
		toggleItem(value, disabled) {
			if (isItemDisabled(value, disabled)) return;
			const expanded = isExpanded(value);
			if (expanded) {
				const canCollapse = Boolean(getProps().multiple) || (getProps().collapsible ?? true);
				if (!canCollapse) return;
				setValue(currentValue().filter((item) => item !== value));
				return;
			}
			setValue(getProps().multiple ? [...currentValue(), value] : [value]);
		},
		focusItem(value, disabled) {
			if (isItemDisabled(value, disabled)) return;
			setFocused(value);
		},
		blurItem() {
			setFocused(null);
		},
		moveFocus(from, move, disabled) {
			if (isItemDisabled(from, disabled)) return;
			const list = triggers();
			if (!list.length) return;
			const index = list.findIndex((trigger) => trigger.id === itemTriggerId(from));
			const target =
				move === 'first'
					? 0
					: move === 'last'
						? list.length - 1
						: (index + (move === 'next' ? 1 : -1) + list.length) % list.length;
			list[target]?.focus();
		},
		registerRoot(node) {
			rootNode = node;
		},
		setValue
	};
}
