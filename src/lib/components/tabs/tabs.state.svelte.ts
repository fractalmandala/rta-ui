import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';

export interface TabsValueChangeDetails {
	value: string | null;
}

export interface TabsFocusChangeDetails {
	value: string | null;
}

export interface UseTabsProps {
	value?: string | null;
	defaultValue?: string | null;
	onValueChange?: (details: TabsValueChangeDetails) => void;
	onFocusChange?: (details: TabsFocusChangeDetails) => void;
	orientation?: 'horizontal' | 'vertical';
	activationMode?: 'automatic' | 'manual';
	loopFocus?: boolean;
	composite?: boolean;
	deselectable?: boolean;
	translations?: { listLabel?: string };
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: {
		root?: string;
		list?: string;
		trigger?: (value: string) => string;
		content?: (value: string) => string;
		indicator?: string;
	};
}

export interface TabsRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface TabsApi {
	readonly value: string | null;
	readonly focusedValue: string | null;
	readonly orientation: 'horizontal' | 'vertical';
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly rootId: string;
	readonly listId: string;
	readonly indicatorId: string;
	readonly indicatorRect: TabsRect | null;
	readonly animateIndicator: boolean;
	triggerId(value: string): string;
	contentId(value: string): string;
	isSelected(value: string): boolean;
	setValue(next: string | null): void;
	setFocusedValue(next: string | null): void;
	blur(): void;
	registerList(node: globalThis.Element | null): void;
	measure(): void;
	focus(): void;
	focusFirst(): void;
	focusLast(): void;
	moveFocus(delta: number): void;
	rootAttrs(): Record<string, string | undefined>;
	listAttrs(): Record<string, string | number | undefined>;
	triggerAttrs(value: string, disabled?: boolean): Record<string, string | number | boolean | undefined>;
	contentAttrs(value: string): Record<string, string | number | boolean | undefined>;
	indicatorStyle(): string;
}

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

const tabsContext = createContext<TabsApi>('Tabs', 'Tabs.Root');
export const useTabsContext = () => tabsContext.get();
export const setTabsContext = (api: TabsApi) => tabsContext.set(api);

export function createTabs(getProps: () => UseTabsProps, uid: string): TabsApi {
	const rootId = () => getProps().ids?.root ?? getProps().id ?? `tabs:${uid}`;
	const listId = () => getProps().ids?.list ?? `${rootId()}:list`;
	const triggerId = (value: string) =>
		getProps().ids?.trigger?.(value) ?? `${rootId()}:trigger-${value}`;
	const contentId = (value: string) =>
		getProps().ids?.content?.(value) ?? `${rootId()}:content-${value}`;
	const indicatorId = () => getProps().ids?.indicator ?? `${rootId()}:indicator`;

	let internalValue = $state<string | null>(getProps().defaultValue ?? getProps().value ?? null);
	let focusedValue = $state<string | null>(null);
	let indicatorRect = $state<TabsRect | null>(null);
	let animateIndicator = $state(true);
	let listNode: globalThis.Element | null = null;

	const isControlled = () => getProps().value !== undefined;
	const value = () => (isControlled() ? (getProps().value ?? null) : internalValue);
	const orientation = () => getProps().orientation ?? 'horizontal';
	const composite = () => getProps().composite !== false;

	function setValue(next: string | null) {
		if (value() === next) return;
		if (!isControlled()) internalValue = next;
		animateIndicator = !getProps().deselectable || next !== null;
		getProps().onValueChange?.({ value: next });
	}

	function setFocusedValue(next: string | null) {
		if (focusedValue === next) return;
		focusedValue = next;
		getProps().onFocusChange?.({ value: next });
	}

	function triggers() {
		const scope = listNode ?? document;
		return Array.from(
			scope.querySelectorAll<HTMLElement>(
				`[data-ownedby="${listId()}"][role="tab"]:not([disabled])`
			)
		);
	}

	function measure() {
		const current = value();
		if (!listNode || !current) {
			indicatorRect = null;
			return;
		}
		const trigger = listNode.querySelector<HTMLElement>(`[id="${triggerId(current)}"]`);
		if (!trigger) {
			indicatorRect = null;
			return;
		}
		indicatorRect = {
			x: trigger.offsetLeft,
			y: trigger.offsetTop,
			width: trigger.offsetWidth,
			height: trigger.offsetHeight
		};
	}

	function focusValue(target: string | null) {
		if (!target) return;
		const node = listNode?.querySelector<HTMLElement>(`[id="${triggerId(target)}"]`);
		node?.focus();
	}

	function moveFocus(delta: number) {
		const list = triggers();
		if (list.length === 0) return;
		const current = focusedValue ?? value();
		const index = list.findIndex((node) => node.id === triggerId(current ?? ''));
		let next: number;
		if (index === -1) {
			next = delta > 0 ? 0 : list.length - 1;
		} else {
			next = index + delta;
			next = getProps().loopFocus === false ? Math.min(Math.max(next, 0), list.length - 1) : (next + list.length) % list.length;
		}
		const node = list[next];
		if (!node) return;
		const targetValue = node.getAttribute('data-value');
		if (targetValue == null) return;
		node.focus();
		setFocusedValue(targetValue);
		if ((getProps().activationMode ?? 'automatic') === 'automatic') setValue(targetValue);
	}

	return {
		triggerId,
		contentId,
		isSelected(target: string) {
			return value() === target;
		},
		setValue,
		setFocusedValue,
		blur() {
			setFocusedValue(null);
		},
		registerList(node) {
			listNode = node;
		},
		measure,
		focus() {
			focusValue(value());
		},
		focusFirst() {
			const list = triggers();
			const first = list[0];
			const targetValue = first?.getAttribute('data-value');
			if (!targetValue) return;
			first.focus();
			setFocusedValue(targetValue);
			if ((getProps().activationMode ?? 'automatic') === 'automatic') setValue(targetValue);
		},
		focusLast() {
			const list = triggers();
			const last = list[list.length - 1];
			const targetValue = last?.getAttribute('data-value');
			if (!targetValue) return;
			last.focus();
			setFocusedValue(targetValue);
			if ((getProps().activationMode ?? 'automatic') === 'automatic') setValue(targetValue);
		},
		moveFocus,
		rootAttrs() {
			return {
				id: rootId(),
				dir: getProps().dir ?? undefined,
				'data-orientation': orientation(),
				'data-focus': dataAttr(focusedValue != null)
			};
		},
		listAttrs() {
			return dropUndefined({
				id: listId(),
				role: 'tablist',
				dir: getProps().dir ?? undefined,
				tabindex: undefined,
				'aria-orientation': orientation(),
				'aria-label': getProps().translations?.listLabel,
				'data-orientation': orientation(),
				'data-focus': dataAttr(focusedValue != null)
			});
		},
		triggerAttrs(target: string, disabled?: boolean) {
			const selected = value() === target;
			return dropUndefined({
				id: triggerId(target),
				role: 'tab',
				type: 'button',
				dir: getProps().dir ?? undefined,
				disabled: Boolean(disabled),
				'aria-disabled': disabled,
				'aria-selected': selected,
				'aria-controls': selected ? contentId(target) : undefined,
				'data-value': target,
				'data-ownedby': listId(),
				'data-orientation': orientation(),
				'data-selected': dataAttr(selected),
				'data-focus': dataAttr(focusedValue === target),
				'data-disabled': dataAttr(Boolean(disabled)),
				tabindex: selected && composite() ? 0 : -1
			});
		},
		contentAttrs(target: string) {
			const selected = value() === target;
			return dropUndefined({
				id: contentId(target),
				role: 'tabpanel',
				dir: getProps().dir ?? undefined,
				'aria-labelledby': triggerId(target),
				'data-ownedby': listId(),
				'data-selected': dataAttr(selected),
				'data-orientation': orientation(),
				tabindex: composite() ? 0 : -1,
				hidden: !selected
			});
		},
		indicatorStyle() {
			const rect = indicatorRect;
			const style: Record<string, string> = {
				'--left': `${rect?.x ?? 0}px`,
				'--top': `${rect?.y ?? 0}px`,
				'--width': `${rect?.width ?? 0}px`,
				'--height': `${rect?.height ?? 0}px`,
				'--transition-property': 'left, right, top, bottom, width, height',
				position: 'absolute',
				'will-change': animateIndicator ? 'var(--transition-property)' : 'auto',
				'transition-property': animateIndicator ? 'var(--transition-property)' : 'none',
				'transition-duration': animateIndicator ? 'var(--transition-duration, 150ms)' : '0ms',
				'transition-timing-function': 'var(--transition-timing-function)'
			};
			return Object.entries(style)
				.map(([name, value]) => `${name}: ${value}`)
				.join('; ');
		},
		get value() {
			return value();
		},
		get focusedValue() {
			return focusedValue;
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
		get listId() {
			return listId();
		},
		get indicatorId() {
			return indicatorId();
		},
		get indicatorRect() {
			return indicatorRect;
		},
		get animateIndicator() {
			return animateIndicator;
		}
	};
}
