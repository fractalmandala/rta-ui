// Menu state: Zag's menu machine (open/highlight/trigger-value state, guards, keyboard map,
// typeahead, submenu wiring) with @zag-js/menu's connect() attribute output. Submenus compose: a
// Menu nested in another Menu's content registers itself as a child of it.

import { isPrintableKey } from '../../internal/collection';
import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import { getTabbables, type InteractOutsideEvent } from '../../internal/layers.svelte';
import { mergeProps } from '../../internal/mergeProps';
import type { Placement, PositionOptions } from '../../internal/positioning.svelte';
import { createPresence } from '../../internal/presence.svelte';
import { createMenuTypeahead } from './menu.typeahead.svelte';

export type MenuInteractOutsideEvent = InteractOutsideEvent;
export type MenuFocusOutsideEvent = InteractOutsideEvent;
export type MenuPointerDownOutsideEvent = InteractOutsideEvent;

export interface MenuPoint {
	x: number;
	y: number;
}

export interface MenuModifierKeys {
	altKey: boolean;
	ctrlKey: boolean;
	metaKey: boolean;
	shiftKey: boolean;
}

export interface MenuOpenChangeDetails {
	open: boolean;
}

export interface MenuHighlightChangeDetails {
	highlightedValue: string | null;
}

export interface MenuTriggerValueChangeDetails {
	value: string | null;
	triggerElement: HTMLElement | null;
}

export interface MenuSelectionDetails {
	value: string;
	modifiers: MenuModifierKeys;
}

export interface MenuValueChangeDetails {
	value: string | null;
}

export interface MenuNavigateDetails {
	value: string | null;
	node: HTMLAnchorElement;
	href: string;
	modifiers: MenuModifierKeys;
}

export interface MenuItemData {
	value: string;
	valueText?: string;
	disabled?: boolean;
	closeOnSelect?: boolean;
}

export interface MenuOptionItemData extends MenuItemData {
	type: 'checkbox' | 'radio';
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
}

export interface MenuItemState {
	id: string;
	disabled: boolean;
	highlighted: boolean;
}

export interface MenuOptionItemState extends MenuItemState {
	checked: boolean;
}

/** Item props shared with MenuItemText / MenuItemIndicator through context. */
export interface MenuItemPropsApi {
	value: string;
	type?: 'checkbox' | 'radio';
	checked?: boolean;
	disabled?: boolean;
}

export interface MenuItemGroupApi {
	id: string;
	value?: string | null;
	onValueChange?: (details: MenuValueChangeDetails) => void;
}

export interface UseMenuProps {
	id?: string | null;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	open?: boolean;
	defaultOpen?: boolean;
	highlightedValue?: string | null;
	defaultHighlightedValue?: string | null;
	triggerValue?: string | null;
	defaultTriggerValue?: string | null;
	anchorPoint?: MenuPoint | null;
	closeOnSelect?: boolean;
	closeOnEscape?: boolean;
	composite?: boolean;
	loopFocus?: boolean;
	typeahead?: boolean;
	positioning?: PositionOptions;
	portalled?: boolean;
	portalRef?: HTMLElement | null;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	'aria-label'?: string;
	initialFocusEl?: () => HTMLElement | null | undefined;
	finalFocusEl?: () => HTMLElement | null | undefined;
	navigate?: (details: MenuNavigateDetails) => void;
	onOpenChange?: (details: MenuOpenChangeDetails) => void;
	onHighlightChange?: (details: MenuHighlightChangeDetails) => void;
	onTriggerValueChange?: (details: MenuTriggerValueChangeDetails) => void;
	onSelect?: (details: MenuSelectionDetails) => void;
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	onPointerDownOutside?: (event: MenuPointerDownOutsideEvent) => void;
	onFocusOutside?: (event: MenuFocusOutsideEvent) => void;
	onInteractOutside?: (event: MenuInteractOutsideEvent) => void;
	onRequestDismiss?: (event: Event) => void;
}

const itemSelectEvent = 'menu:select';

/**
 * The slice of the api that a submenu needs from its parent (and vice versa). Keeping this separate
 * from `MenuApi` is what stops `MenuApi = ReturnType<typeof createMenu>` from being circular.
 */
interface MenuTree {
	readonly rootId: string;
	readonly isSubmenu: boolean;
	readonly parentMenu: () => MenuTree | undefined;
	readonly childMenus: () => MenuTree[];
	readonly triggerAttrs: () => Record<string, unknown>;
	readonly contextTriggerNodes: () => HTMLElement[];
	setOpen(open: boolean): void;
	highlightFirst(): void;
	focusMenu(): void;
	isWithinMenuTree(target: Node | null): boolean;
	removeChild(id: string): void;
}

const menuContext = createContext<MenuApi>('Menu', 'Menu.Root');
export const useMenuContext = () => menuContext.get();
export const useOptionalMenuContext = () => menuContext.use();
export const setMenuContext = (api: MenuApi) => menuContext.set(api);

const menuItemContext = createContext<MenuItemState>('MenuItem', 'Menu.Item');
export const useMenuItemContext = () => menuItemContext.get();
export const setMenuItemContext = (state: MenuItemState) => menuItemContext.set(state);

const menuItemPropsContext = createContext<MenuItemPropsApi>('MenuItemProps', 'Menu.Item');
export const useMenuItemPropsContext = () => menuItemPropsContext.use();
export const setMenuItemPropsContext = (props: MenuItemPropsApi) => menuItemPropsContext.set(props);

const menuItemGroupContext = createContext<MenuItemGroupApi>('MenuItemGroup', 'Menu.ItemGroup');
export const useMenuItemGroupContext = () => menuItemGroupContext.use();
export const setMenuItemGroupContext = (group: MenuItemGroupApi) => menuItemGroupContext.set(group);

const menuTriggerItemContext = createContext<() => Record<string, unknown>>(
	'MenuTriggerItem',
	'Menu.TriggerItem'
);
export const useMenuTriggerItemContext = () => menuTriggerItemContext.use();
export const setMenuTriggerItemContext = (getAttrs: () => Record<string, unknown>) =>
	menuTriggerItemContext.set(getAttrs);

function dropUndefined(value: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

function getModifierKeys(event: MouseEvent | KeyboardEvent): MenuModifierKeys {
	return {
		altKey: event.altKey,
		ctrlKey: event.ctrlKey,
		metaKey: event.metaKey,
		shiftKey: event.shiftKey
	};
}

function isEditableElement(element: Element | null): boolean {
	if (!element) return false;
	return (
		element.matches('input, textarea, select, [contenteditable]:not([contenteditable="false"])') ||
		element.closest('[contenteditable]:not([contenteditable="false"])') !== null
	);
}

function isTriggerItem(element: EventTarget | null): boolean {
	return (
		element instanceof Element &&
		(element.getAttribute('role') ?? '').startsWith('menuitem') &&
		element.hasAttribute('data-controls')
	);
}

function focusableOutsideTarget(event: Event): boolean {
	const target = event.target;
	if (!(target instanceof Element)) return false;
	return target.closest('a[href], button, input, select, textarea, [tabindex]') !== null;
}

function anchorFromPoint(point: MenuPoint): Element {
	const rect = { x: point.x, y: point.y, width: 0, height: 0, top: point.y, left: point.x, right: point.x, bottom: point.y };
	const anchor = {
		getBoundingClientRect: () =>
			({
				...rect,
				toJSON: () => rect
			}) as DOMRect,
		addEventListener() {},
		removeEventListener() {}
	};
	return anchor as unknown as Element;
}

export function createMenu(getProps: () => UseMenuProps, uid: string) {
	let rootNode: HTMLElement | null = null;
	let contentNode = $state<HTMLElement | null>(null);
	let triggerNode = $state<HTMLElement | null>(null);
	let positionerNode = $state<HTMLElement | null>(null);
	let contentTriggers = new Map<string | null, HTMLElement>();
	let placement = $state<Placement | undefined>(undefined);
	let anchorPoint = $state<MenuPoint | null>(null);
	let internalOpen = $state(getProps().defaultOpen ?? false);
	let internalHighlighted = $state<string | null>(getProps().defaultHighlightedValue ?? null);
	let internalTriggerValue = $state<string | null>(getProps().defaultTriggerValue ?? null);
	let intentTimer: ReturnType<typeof setTimeout> | undefined;
	let longPressTimer: ReturnType<typeof setTimeout> | undefined;
	let restoreFocus = true;

	const children = new Map<string, MenuTree>();
	let parent: MenuTree | undefined;

	const rootId = () => getProps().id ?? uid;
	const isSubmenu = () => parent !== undefined;
	const open = () => getProps().open ?? internalOpen;
	const highlightedValue = () => getProps().highlightedValue ?? internalHighlighted;
	const triggerValue = () => getProps().triggerValue ?? internalTriggerValue;
	const dir = () => getProps().dir ?? undefined;
	const composite = () => getProps().composite ?? true;
	const contentId = () => `menu:${rootId()}:content`;
	const arrowId = () => `menu:${rootId()}:arrow`;
	const positionerId = () => `menu:${rootId()}:popper`;
	const triggerId = (value?: string | null) =>
		value == null ? `menu:${rootId()}:trigger` : `menu:${rootId()}:trigger:${value}`;
	const contextTriggerId = (value?: string | null) =>
		value == null ? `menu:${rootId()}:ctx-trigger` : `menu:${rootId()}:ctx-trigger:${value}`;
	const groupId = (id: string) => `menu:${rootId()}:group:${id}`;
	const groupLabelId = (id: string) => `menu:${rootId()}:group-label:${id}`;
	const itemId = (value: string) => `${rootId()}/${value}`;
	const currentPlacement = () => placement;
	const side = () => placement?.split('-')[0];

	const typeahead = createMenuTypeahead({
		getItems: () =>
			itemElements().map((element) => ({
				value: element.dataset.value ?? '',
				label: element.dataset.valuetext ?? (element.textContent ?? '').trim()
			})),
		enabled: () => getProps().typeahead ?? true
	});

	const presence = createPresence({
		present: () => open(),
		getNode: () => contentNode,
		lazyMount: () => getProps().lazyMount ?? true,
		unmountOnExit: () => getProps().unmountOnExit ?? true
	});

	function defer(task: () => void) {
		if (contentNode) queueMicrotask(task);
		else setTimeout(task, 0);
	}

	function activeTriggerElement(): HTMLElement | null {
		const value = triggerValue();
		const registered = contentTriggers.get(value) ?? contentTriggers.get(null) ?? triggerNode;
		if (registered) return registered;
		if (typeof document === 'undefined') return null;
		return document.getElementById(triggerId(value));
	}

	function itemElements(): HTMLElement[] {
		const node = contentNode;
		if (!node) return [];
		return Array.from(
			node.querySelectorAll<HTMLElement>(
				`[role^="menuitem"][data-ownedby="${contentId()}"]:not([data-disabled])`
			)
		);
	}

	function isMatch(element: HTMLElement, value: string | null): boolean {
		if (!value) return false;
		return element.id === value || element.dataset.value === value;
	}

	function highlightedId(): string | undefined {
		const value = highlightedValue();
		if (!value) return undefined;
		return itemElements().find((element) => isMatch(element, value))?.id;
	}

	function highlightedElement(): HTMLElement | undefined {
		const id = highlightedId();
		if (id) return contentNode?.querySelector<HTMLElement>(`[id="${id}"]`) ?? undefined;
		return undefined;
	}

	function setHighlightedValue(value: string | null | undefined) {
		const next = value ?? null;
		if (next === null) internalHighlighted = null;
		else internalHighlighted = next;
		getProps().onHighlightChange?.({ highlightedValue: next });
	}

	function focusMenu() {
		queueMicrotask(() => {
			const node = contentNode;
			if (!node) return;
			const doc = node.ownerDocument;
			if (node.contains(doc.activeElement)) return;
			const initial = getProps().initialFocusEl?.();
			if (initial) {
				initial.focus({ preventScroll: true });
				return;
			}
			const target =
				getTabbables(node).find(
					(element) => !(element.getAttribute('role') ?? '').startsWith('menuitem')
				) ?? node;
			target.focus({ preventScroll: true });
		});
	}

	function focusTrigger(restoreFocus?: boolean) {
		if (isSubmenu() || restoreFocus === false) return;
		queueMicrotask(() => {
			const target = getProps().finalFocusEl?.() ?? activeTriggerElement();
			target?.focus({ preventScroll: true });
		});
	}

	function setOpen(next: boolean, options: { restoreFocus?: boolean } = {}) {
		const changed = next !== open();
		if (getProps().open === undefined) internalOpen = next;
		if (changed) getProps().onOpenChange?.({ open: next });
		if (next) {
			focusMenu();
			return;
		}
		internalHighlighted = null;
		anchorPoint = null;
		clearIntentTimers();
		typeahead.clear();
		focusTrigger(options.restoreFocus);
	}

	function setTriggerValue(value: string | null | undefined) {
		if (value === undefined) return;
		if (getProps().triggerValue === undefined) internalTriggerValue = value;
		getProps().onTriggerValueChange?.({
			value: value ?? null,
			triggerElement: activeTriggerElement()
		});
	}

	function clearIntentTimers() {
		if (intentTimer !== undefined) clearTimeout(intentTimer);
		if (longPressTimer !== undefined) clearTimeout(longPressTimer);
		intentTimer = undefined;
		longPressTimer = undefined;
	}

	function closeRootMenu() {
		let current: MenuTree | undefined = api;
		while (current && current.isSubmenu) current = current.parentMenu();
		(current ?? api).setOpen(false);
	}

	function clearLongPress() {
		if (longPressTimer !== undefined) clearTimeout(longPressTimer);
		longPressTimer = undefined;
	}

	function openContextMenu(point: MenuPoint, value?: string | null) {
		anchorPoint = point;
		setTriggerValue(value ?? null);
		setOpen(true);
	}

	function startLongPress(point: MenuPoint, value?: string | null) {
		clearLongPress();
		longPressTimer = setTimeout(() => openContextMenu(point, value), 700);
	}

	function highlightFirst() {
		defer(() => {
			const first = itemElements()[0];
			if (first) setHighlightedValue(first.dataset.value ?? first.id);
		});
	}

	function highlightLast() {
		defer(() => {
			const items = itemElements();
			const last = items[items.length - 1];
			if (last) setHighlightedValue(last.dataset.value ?? last.id);
		});
	}

	function moveHighlight(step: 1 | -1, loop?: boolean) {
		const items = itemElements();
		if (!items.length) return;
		const index = items.findIndex((element) => isMatch(element, highlightedValue()));
		const limit = items.length;
		const wraps = loop ?? getProps().loopFocus ?? false;
		let next = index + step;
		if (index === -1) next = step > 0 ? 0 : limit - 1;
		else if (next >= limit || next < 0) next = wraps ? (next + limit) % limit : -1;
		setHighlightedValue(next === -1 ? null : (items[next].dataset.value ?? items[next].id));
	}

	function isTriggerItemHighlighted(): boolean {
		return highlightedElement()?.hasAttribute('data-controls') ?? false;
	}

	function openSubmenu() {
		const element = highlightedElement();
		const id = element?.dataset.uid;
		const child = id ? children.get(id) : undefined;
		if (!child) return;
		setHighlightedValue(element?.dataset.value ?? highlightedValue());
		child.setOpen(true);
		child.highlightFirst();
	}

	function clickHighlightedItem(event: KeyboardEvent) {
		const element = highlightedElement();
		if (!element || element.hasAttribute('data-disabled')) return;
		const value = highlightedValue();
		const modifiers = getModifierKeys(event);
		if (element instanceof HTMLAnchorElement) {
			getProps().navigate?.({
				value,
				node: element,
				href: element.href,
				modifiers
			});
			if (modifiers.metaKey || modifiers.ctrlKey) return;
		}
		const MouseEventCtor = element.ownerDocument.defaultView?.MouseEvent ?? MouseEvent;
		queueMicrotask(() =>
			element.dispatchEvent(
				new MouseEventCtor('click', { bubbles: true, cancelable: true, composed: true, ...modifiers })
			)
		);
	}

	function typeaheadKey(key: string) {
		const next = typeahead.onKey(key, highlightedValue() ?? undefined);
		if (next !== undefined) setHighlightedValue(next);
	}

	function invokeOnSelect(value: string, event: MouseEvent) {
		const detail = { value };
		const node = event.currentTarget;
		if (node instanceof Element) {
			const Win = node.ownerDocument.defaultView;
			if (Win) node.dispatchEvent(new Win.CustomEvent(itemSelectEvent, { detail }));
		}
		getProps().onSelect?.({ value, modifiers: getModifierKeys(event) });
	}

	function selectItem(
		item: MenuItemData,
		event: MouseEvent,
		option?: MenuOptionItemData
	) {
		if (isTriggerItem(event.currentTarget)) {
			setHighlightedValue(item.value);
			return;
		}
		if (isEditableElement(event.currentTarget as Element)) return;
		invokeOnSelect(item.value, event);
		if (option) setOptionState(option);
		const closeOnSelect = item.closeOnSelect ?? getProps().closeOnSelect ?? true;
		if (!closeOnSelect) {
			setHighlightedValue(item.value);
			return;
		}
		setOpen(false);
	}

	function setOptionState(option: MenuOptionItemData) {
		if (option.type === 'radio') option.onCheckedChange?.(true);
		else option.onCheckedChange?.(!option.checked);
	}

	function isWithinContextTrigger(target: Node | null): boolean {
		if (!target) return false;
		for (const node of contentTriggers.values()) {
			if (node.contains(target)) return true;
		}
		return false;
	}

	function isWithinTree(target: Node | null): boolean {
		if (!target) return false;
		if (contentNode?.contains(target)) return true;
		for (const child of children.values()) {
			if (child.isWithinMenuTree(target)) return true;
		}
		return false;
	}

	function onItemClick(item: MenuItemData, event: MouseEvent, option?: MenuOptionItemData) {
		if (item.disabled) return;
		const anchor = (event.currentTarget as Element).closest('a[href], area[href]');
		if (anchor instanceof HTMLAnchorElement && anchor.hasAttribute('download')) return;
		if (anchor instanceof HTMLAnchorElement && (event.metaKey || event.ctrlKey)) return;
		selectItem(item, event, option);
	}

	function itemState(item: MenuItemData): MenuItemState {
		return {
			id: itemId(item.value),
			disabled: !!item.disabled,
			highlighted: highlightedValue() === item.value
		};
	}

	function optionItemState(option: MenuOptionItemData): MenuOptionItemState {
		return { ...itemState(option), checked: !!option.checked };
	}

	function triggerAttrs(props: { value?: string | null } = {}): Record<string, unknown> {
		const value = props.value ?? null;
		const current = value == null ? false : triggerValue() === value;
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': isSubmenu() ? 'trigger-item' : 'trigger',
			'data-placement': currentPlacement(),
			'data-side': side(),
			type: 'button',
			dir: dir(),
			id: triggerId(value),
			'data-ownedby': value == null ? undefined : rootId(),
			'data-value': value,
			'data-current': value == null ? undefined : dataAttr(current),
			'data-uid': rootId(),
			'aria-haspopup': composite() ? 'menu' : 'dialog',
			'aria-controls': contentId(),
			'data-controls': contentId(),
			'aria-expanded': value == null ? open() : open() && current,
			'data-state': open() ? 'open' : 'closed',
			onpointermove(event: PointerEvent) {
				if (!isSubmenu()) return;
				if (event.pointerType && event.pointerType !== 'mouse') return;
				if ((event.currentTarget as HTMLElement).hasAttribute('disabled')) return;
				clearIntentTimers();
				const self = api;
				intentTimer = setTimeout(() => {
					intentTimer = undefined;
					self.setOpen(true);
				}, 200);
			},
			onpointerleave(event: PointerEvent) {
				if (!isSubmenu()) return;
				if (event.pointerType && event.pointerType !== 'mouse') return;
				clearIntentTimers();
				const self = api;
				intentTimer = setTimeout(() => {
					intentTimer = undefined;
					self.setOpen(false);
				}, 100);
			},
			onpointerdown(event: PointerEvent) {
				if ((event.currentTarget as HTMLElement).hasAttribute('disabled')) return;
				event.preventDefault();
			},
			onclick(event: MouseEvent) {
				if (event.defaultPrevented) return;
				if ((event.currentTarget as HTMLElement).hasAttribute('disabled')) return;
				if (isTriggerItem(event.currentTarget)) return;
				if (open()) {
					if (value != null && !current) {
						setTriggerValue(value);
						focusMenu();
						return;
					}
					setOpen(false);
					return;
				}
				setOpen(true);
				setTriggerValue(value);
			},
			onkeydown(event: KeyboardEvent) {
				if (event.defaultPrevented) return;
				if (isTriggerItem(event.currentTarget)) return;
				switch (event.key) {
					case 'ArrowDown':
					case 'Enter':
					case ' ':
						event.preventDefault();
						openWithHighlight('first', value);
						break;
					case 'ArrowUp':
						event.preventDefault();
						openWithHighlight('last', value);
						break;
					default:
						break;
				}
			}
		});
	}

	function openWithHighlight(which: 'first' | 'last', value?: string | null) {
		setOpen(true);
		setTriggerValue(value ?? triggerValue());
		if (which === 'first') highlightFirst();
		else highlightLast();
	}

	function contentAttrs(): Record<string, unknown> {
		const hasLabel = !!getProps()['aria-label'];
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': 'content',
			id: contentId(),
			'aria-label': getProps()['aria-label'],
			hidden: !open(),
			'data-state': open() ? 'open' : 'closed',
			role: composite() ? 'menu' : 'dialog',
			tabindex: 0,
			dir: dir(),
			'aria-activedescendant': highlightedId(),
			'aria-labelledby': hasLabel
				? undefined
				: anchorPoint
					? contextTriggerId(triggerValue())
					: triggerId(triggerValue()),
			'data-placement': currentPlacement(),
			'data-side': side(),
			onpointerenter(event: PointerEvent) {
				if (event.pointerType && event.pointerType !== 'mouse') return;
				clearIntentTimers();
			},
			onkeydown(event: KeyboardEvent) {
				onContentKeydown(event);
			}
		});
	}

	function onContentKeydown(event: KeyboardEvent) {
		if (event.defaultPrevented) return;
		const node = contentNode;
		if (!node) return;
		const target = event.target as HTMLElement | null;
		if (!target || !node.contains(target)) return;
		if (target !== node && target.closest('[role="menu"]') !== node) return;
		if (event.key === 'Tab') {
			if (event.altKey || event.ctrlKey || event.metaKey) event.preventDefault();
			return;
		}
		const rtl = dir() === 'rtl';
		let key = event.key;
		if (rtl && key === 'ArrowLeft') key = 'ArrowRight';
		else if (rtl && key === 'ArrowRight') key = 'ArrowLeft';

		const exec = (() => {
			switch (key) {
				case 'ArrowDown':
					return () => moveHighlight(1);
				case 'ArrowUp':
					return () => moveHighlight(-1);
				case 'ArrowLeft':
					return () => {
						if (!isSubmenu()) return;
						setOpen(false);
						parent?.focusMenu();
					};
				case 'ArrowRight':
					return () => {
						if (isTriggerItemHighlighted()) openSubmenu();
					};
				case 'Enter':
					return () => clickHighlightedItem(event);
				case ' ':
					return () => {
						if (typeahead.search) typeaheadKey(event.key);
						else clickHighlightedItem(event);
					};
				case 'Home':
					return () => highlightFirst();
				case 'End':
					return () => highlightLast();
				default:
					return undefined;
			}
		})();

		if (exec) {
			exec();
			event.stopPropagation();
			event.preventDefault();
			return;
		}
		if (!(getProps().typeahead ?? true)) return;
		if (!isPrintableKey(event)) return;
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		if (isEditableElement(target)) return;
		typeaheadKey(event.key);
		event.preventDefault();
	}

	function contextTriggerAttrs(props: { value?: string | null } = {}): Record<string, unknown> {
		const value = props.value ?? null;
		const current = value == null ? false : triggerValue() === value;
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': 'context-trigger',
			dir: dir(),
			id: contextTriggerId(value),
			'data-ownedby': rootId(),
			'data-value': value ?? undefined,
			'data-current': value == null ? undefined : dataAttr(current),
			'data-state': open() ? 'open' : 'closed',
			style: '-webkit-touch-callout: none; -webkit-user-select: none; user-select: none;',
			onpointerdown(event: PointerEvent) {
				if (event.pointerType === 'mouse') return;
				startLongPress({ x: event.clientX, y: event.clientY }, value);
			},
			onpointercancel() {
				clearLongPress();
			},
			onpointermove(event: PointerEvent) {
				if (event.pointerType === 'mouse') return;
				clearLongPress();
			},
			onpointerup(event: PointerEvent) {
				if (event.pointerType === 'mouse') return;
				clearLongPress();
			},
			oncontextmenu(event: MouseEvent) {
				const point = { x: event.clientX, y: event.clientY };
				if (open() && value != null && triggerValue() !== value) setTriggerValue(value);
				else openContextMenu(point, value);
				event.preventDefault();
			}
		});
	}

	function indicatorAttrs(): Record<string, unknown> {
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': 'indicator',
			dir: dir(),
			'data-state': open() ? 'open' : 'closed'
		});
	}

	function positionerAttrs(): Record<string, unknown> {
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': 'positioner',
			dir: dir(),
			id: positionerId()
		});
	}

	function arrowAttrs(): Record<string, unknown> {
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': 'arrow',
			id: arrowId(),
			dir: dir()
		});
	}

	function arrowTipAttrs(): Record<string, unknown> {
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': 'arrow-tip',
			dir: dir()
		});
	}

	function separatorAttrs(): Record<string, unknown> {
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': 'separator',
			role: 'separator',
			dir: dir(),
			'aria-orientation': 'horizontal'
		});
	}

	function itemAttrs(item: MenuItemData): Record<string, unknown> {
		const state = itemState(item);
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': 'item',
			id: state.id,
			role: 'menuitem',
			'aria-disabled': state.disabled ? true : undefined,
			'data-disabled': dataAttr(state.disabled),
			'data-ownedby': contentId(),
			'data-highlighted': dataAttr(state.highlighted),
			'data-value': item.value,
			'data-valuetext': item.valueText,
			'data-close-on-select':
				item.closeOnSelect == null ? undefined : String(item.closeOnSelect),
			ondragstart(event: DragEvent) {
				if ((event.currentTarget as Element).matches('a[href]')) event.preventDefault();
			},
			onpointermove(event: PointerEvent) {
				if (item.disabled) return;
				if (event.pointerType && event.pointerType !== 'mouse') return;
				if (highlightedValue() === item.value) return;
				setHighlightedValue(item.value);
				focusMenu();
			},
			onpointerleave(event: PointerEvent) {
				if (item.disabled) return;
				if (event.pointerType && event.pointerType !== 'mouse') return;
				if (isTriggerItem(event.currentTarget)) return;
				setHighlightedValue(null);
			},
			onpointerdown() {
				if (item.disabled) return;
				setHighlightedValue(item.value);
			},
			onclick(event: MouseEvent) {
				onItemClick(item, event);
			}
		});
	}

	function optionItemAttrs(option: MenuOptionItemData): Record<string, unknown> {
		return {
			...itemAttrs(option),
			'data-type': option.type,
			dir: dir(),
			role: `menuitem${option.type}`,
			'aria-checked': !!option.checked,
			'data-state': option.checked ? 'checked' : 'unchecked',
			onclick(event: MouseEvent) {
				onItemClick(option, event, option);
			}
		};
	}

	function itemIndicatorAttrs(props: MenuOptionItemData | MenuItemPropsApi): Record<string, unknown> {
		const option = props as MenuOptionItemData;
		const state = optionItemState(option);
		const hasChecked = 'checked' in props;
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': 'item-indicator',
			dir: dir(),
			'data-disabled': dataAttr(state.disabled),
			'data-highlighted': dataAttr(state.highlighted),
			'data-state': hasChecked ? (state.checked ? 'checked' : 'unchecked') : undefined,
			hidden: hasChecked ? !state.checked : undefined
		});
	}

	function itemTextAttrs(props: MenuOptionItemData | MenuItemPropsApi): Record<string, unknown> {
		const option = props as MenuOptionItemData;
		const state = optionItemState(option);
		const hasChecked = 'checked' in props;
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': 'item-text',
			dir: dir(),
			'data-disabled': dataAttr(state.disabled),
			'data-highlighted': dataAttr(state.highlighted),
			'data-state': hasChecked ? (state.checked ? 'checked' : 'unchecked') : undefined
		});
	}

	function itemGroupAttrs(props: { id: string }): Record<string, unknown> {
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': 'item-group',
			id: groupId(props.id),
			dir: dir(),
			'aria-labelledby': groupLabelId(props.id),
			role: 'group'
		});
	}

	function itemGroupLabelAttrs(props: { htmlFor: string }): Record<string, unknown> {
		return dropUndefined({
			'data-scope': 'menu',
			'data-part': 'item-group-label',
			id: groupLabelId(props.htmlFor),
			dir: dir()
		});
	}

	const api = {
		get open() {
			return open();
		},
		get highlightedValue() {
			return highlightedValue();
		},
		get triggerValue() {
			return triggerValue();
		},
		get isSubmenu() {
			return isSubmenu();
		},
		get present() {
			return presence.present;
		},
		get rootId() {
			return rootId();
		},
		get contentId() {
			return contentId();
		},
		get dir() {
			return dir();
		},
		get placement() {
			return placement;
		},
		get anchorPoint() {
			return anchorPoint;
		},
		get contentNode() {
			return contentNode;
		},
		get triggerNode() {
			return activeTriggerElement();
		},
		get positionerNode() {
			return positionerNode;
		},
		get root() {
			return rootNode;
		},
		get closeOnEscape() {
			return getProps().closeOnEscape ?? true;
		},
		positioningOptions(): PositionOptions {
			const base = getProps().positioning ?? {};
			if (!isSubmenu()) return { placement: 'bottom-start', gutter: 8, ...base };
			return { ...base, placement: dir() === 'rtl' ? 'left-start' : 'right-start', gutter: 0 };
		},
		triggerId,
		contextTriggerId,
		groupId,
		groupLabelId,
		itemId,
		activeTriggerElement,
		itemElements,
		highlightedElement,
		highlightedId,
		setOpen,
		setHighlightedValue,
		setTriggerValue,
		setPlacement(next: Placement | undefined) {
			placement = next;
		},
		setAnchorPoint(next: MenuPoint | null) {
			anchorPoint = next;
		},
		anchor() {
			return anchorPoint ? anchorFromPoint(anchorPoint) : activeTriggerElement();
		},
		focusMenu,
		focusTrigger,
		clearIntentTimers,
		clearLongPress,
		closeRootMenu,
		highlightFirst,
		highlightLast,
		moveHighlight,
		isTriggerItemHighlighted,
		openSubmenu,
		registerRoot(node: HTMLElement | null) {
			rootNode = node;
		},
		registerContent(node: HTMLElement | null) {
			contentNode = node;
		},
		registerPositioner(node: HTMLElement | null) {
			positionerNode = node;
		},
		registerTrigger(node: HTMLElement | null) {
			triggerNode = node;
		},
		registerContentTrigger(value: string | null, node: HTMLElement | null) {
			if (node) contentTriggers.set(value, node);
			else contentTriggers.delete(value);
		},
		setParent(parentApi: MenuTree) {
			parent = parentApi;
		},
		parentMenu() {
			return parent;
		},
		setChild(child: MenuTree) {
			children.set(child.rootId, child);
		},
		removeChild(id: string) {
			children.delete(id);
		},
		childMenus() {
			return Array.from(children.values());
		},
		getTriggerItemAttrs(child: MenuTree) {
			const trigger = child.triggerAttrs();
			return mergeProps(itemAttrs({ value: String(trigger.id ?? '') }), trigger) as Record<
				string,
				unknown
			>;
		},
		isWithinMenuTree: isWithinTree,
		handleEscapeKeyDown(event: KeyboardEvent) {
			getProps().onEscapeKeyDown?.(event);
			if (event.defaultPrevented) return;
			closeRootMenu();
		},
		handlePointerDownOutside(event: MenuPointerDownOutsideEvent) {
			getProps().onPointerDownOutside?.(event);
			if (event.defaultPrevented) return;
			restoreFocus = !focusableOutsideTarget(event.detail.originalEvent);
		},
		handleFocusOutside(event: MenuFocusOutsideEvent) {
			getProps().onFocusOutside?.(event);
			if (event.defaultPrevented) return;
			const target = event.detail.originalEvent.target as Node | null;
			if (isWithinContextTrigger(target) || isWithinTree(target)) event.preventDefault();
		},
		handleInteractOutside(event: MenuInteractOutsideEvent) {
			getProps().onInteractOutside?.(event);
			getProps().onRequestDismiss?.(event);
			if (event.defaultPrevented) return;
			setOpen(false, { restoreFocus });
		},
		contextTriggerNodes() {
			return Array.from(contentTriggers.values());
		},
		addItemListener(props: { id: string; node?: HTMLElement | null; onSelect?: () => void }) {
			const node =
				props.node ?? contentNode?.ownerDocument.getElementById(props.id) ?? null;
			if (!node) return () => {};
			const listener = () => props.onSelect?.();
			node.addEventListener(itemSelectEvent, listener);
			return () => node.removeEventListener(itemSelectEvent, listener);
		},
		triggerAttrs,
		contentAttrs,
		contextTriggerAttrs,
		indicatorAttrs,
		positionerAttrs,
		arrowAttrs,
		arrowTipAttrs,
		separatorAttrs,
		itemAttrs,
		optionItemAttrs,
		itemIndicatorAttrs,
		itemTextAttrs,
		itemGroupAttrs,
		itemGroupLabelAttrs,
		itemState,
		optionItemState
	};

	return api;
}

export type MenuApi = ReturnType<typeof createMenu>;
