import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import type { ToggleSize, ToggleVariant } from '../toggle/toggle.state.svelte';

export interface ToggleGroupValueChangeDetails {
	value: string[];
}

export interface UseToggleGroupProps {
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (details: ToggleGroupValueChangeDetails) => void;
	multiple?: boolean;
	deselectable?: boolean;
	disabled?: boolean;
	rovingFocus?: boolean;
	loopFocus?: boolean;
	orientation?: 'horizontal' | 'vertical';
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: { root?: string; item?: (value: string) => string };
}

export interface ToggleGroupItemState {
	id: string;
	disabled: boolean;
	pressed: boolean;
	focused: boolean;
}

export interface ToggleGroupApi {
	readonly value: string[];
	readonly multiple: boolean;
	readonly rovingFocus: boolean;
	readonly orientation: 'horizontal' | 'vertical';
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly rootId: string;
	readonly focusedId: string | null;
	readonly role: 'radiogroup' | 'group';
	readonly disabled: boolean;
	has(value: string): boolean;
	setValue(next: string[]): void;
	toggleValue(value: string): void;
	itemId(value: string): string;
	itemState(value: string, disabled?: boolean): ToggleGroupItemState;
	registerRoot(node: HTMLElement | null): void;
	focusItem(value: string): void;
	setFocused(value: string): void;
	blur(): void;
	moveFocus(delta: number): void;
	focusFirst(): void;
	focusLast(): void;
}

export interface ToggleGroupStyle {
	readonly size: ToggleSize;
	readonly variant: ToggleVariant;
}

const toggleGroupContext = createContext<ToggleGroupApi>('ToggleGroup', 'ToggleGroup.Root');
const toggleGroupStyleContext = createContext<ToggleGroupStyle>(
	'ToggleGroupStyle',
	'ToggleGroup.Root'
);

export const useToggleGroupContext = () => toggleGroupContext.get();
export const setToggleGroupContext = (api: ToggleGroupApi) => toggleGroupContext.set(api);
export const setToggleGroupStyleContext = (style: ToggleGroupStyle) =>
	toggleGroupStyleContext.set(style);
export const useToggleGroupStyleContext = () =>
	toggleGroupStyleContext.use() ?? { size: 'md' as ToggleSize, variant: 'default' as ToggleVariant };

export function createToggleGroup(
	getProps: () => UseToggleGroupProps,
	uid: string
): ToggleGroupApi {
	const rootId = () => getProps().ids?.root ?? getProps().id ?? uid;
	const itemId = (value: string) =>
		getProps().ids?.item?.(value) ?? `${rootId()}:item:${value}`;

	let internalValue = $state<string[]>(getProps().defaultValue ?? getProps().value ?? []);
	let focusedId = $state<string | null>(null);
	let rootNode = $state<HTMLElement | null>(null);

	const isControlled = () => getProps().value !== undefined;
	const value = () => (isControlled() ? (getProps().value ?? []) : internalValue);
	const multiple = () => Boolean(getProps().multiple);
	const disabled = () => Boolean(getProps().disabled);
	const rovingFocus = () => getProps().rovingFocus !== false;
	const orientation = () => getProps().orientation ?? 'horizontal';

	function setValue(next: string[]) {
		if (disabled()) return;
		if (!isControlled()) internalValue = next;
		getProps().onValueChange?.({ value: next });
	}

	function toggleValue(target: string) {
		const current = value();
		if (current.includes(target)) {
			if (!getProps().deselectable && !multiple()) return;
			setValue(current.filter((item) => item !== target));
			return;
		}
		setValue(multiple() ? [...current, target] : [target]);
	}

	function items() {
		const scope = rootNode ?? document;
		return Array.from(
			scope.querySelectorAll<HTMLElement>(
				`[data-ownedby="${rootId()}"][data-part="item"]:not([disabled])`
			)
		);
	}

	function focusItem(target: string) {
		const node = rootNode?.querySelector<HTMLElement>(`[id="${itemId(target)}"]`);
		node?.focus();
	}

	function moveFocus(delta: number) {
		const list = items();
		if (list.length === 0) return;
		const index = list.findIndex((node) => node.id === focusedId);
		if (index === -1) {
			list[delta > 0 ? 0 : list.length - 1]?.focus();
			return;
		}
		let next = index + delta;
		if (getProps().loopFocus === false) {
			next = Math.min(Math.max(next, 0), list.length - 1);
		} else {
			next = (next + list.length) % list.length;
		}
		list[next]?.focus();
	}

	return {
		has(target: string) {
			return value().includes(target);
		},
		setValue,
		toggleValue,
		itemId,
		itemState(target: string, itemDisabled?: boolean) {
			const id = itemId(target);
			return {
				id,
				disabled: Boolean(itemDisabled || disabled()),
				pressed: value().includes(target),
				focused: focusedId === id
			};
		},
		registerRoot(node) {
			rootNode = node;
		},
		focusItem,
		setFocused(target: string) {
			focusedId = itemId(target);
		},
		blur() {
			focusedId = null;
		},
		moveFocus,
		focusFirst() {
			items()[0]?.focus();
		},
		focusLast() {
			const list = items();
			list[list.length - 1]?.focus();
		},
		get value() {
			return value();
		},
		get multiple() {
			return multiple();
		},
		get rovingFocus() {
			return rovingFocus();
		},
		get orientation() {
			return orientation();
		},
		get dir() {
			return getProps().dir;
		},
		get rootId() {
			return rootId();
		},
		get focusedId() {
			return focusedId;
		},
		get role() {
			return multiple() ? 'group' : 'radiogroup';
		},
		get disabled() {
			return disabled();
		}
	};
}

export function toggleGroupRootAttrs(api: ToggleGroupApi) {
	return {
		id: api.rootId,
		dir: api.dir,
		role: api.role,
		tabindex: 0,
		'data-disabled': dataAttr(api.disabled),
		'data-orientation': api.orientation,
		'data-focus': dataAttr(api.focusedId != null)
	};
}
