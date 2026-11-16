import { untrack } from 'svelte';
import { createContext } from '../../internal/context';
import { dataAttr, toPx, visuallyHiddenStyle } from '../../internal/dom.js';
import { useDismissableLayer, useEscapeLayer } from '../../internal/layers.svelte.js';
import { createPresence } from '../../internal/presence.svelte.js';

export interface NavigationMenuPoint {
	x: number;
	y: number;
}

export interface NavigationMenuRect extends NavigationMenuPoint {
	width: number;
	height: number;
}

export interface NavigationMenuSize {
	width: number;
	height: number;
}

export type NavigationMenuOrientation = 'horizontal' | 'vertical';

export type NavigationMenuAlign = 'start' | 'center' | 'end';

export interface NavigationMenuValueChangeDetails {
	value: string;
}

export interface NavigationMenuElementIds {
	root?: string;
	list?: string;
	item?: (value: string) => string;
	trigger?: (value: string) => string;
	triggerProxy?: (value: string) => string;
	content?: (value: string) => string;
	viewport?: string;
}

export interface NavigationMenuIntlTranslations {
	rootLabel?: string;
}

export interface NavigationMenuItemProps {
	value: string;
	disabled?: boolean;
}

export interface NavigationMenuContentProps {
	value: string;
}

export interface NavigationMenuLinkProps {
	value: string;
	current?: boolean;
	onSelect?: (event: CustomEvent) => void;
	closeOnClick?: boolean;
}

export interface NavigationMenuViewportProps {
	align?: NavigationMenuAlign;
}

export interface UseNavigationMenuProps {
	id?: string | null;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	value?: string;
	defaultValue?: string;
	onValueChange?: (details: NavigationMenuValueChangeDetails) => void;
	openDelay?: number;
	closeDelay?: number;
	orientation?: NavigationMenuOrientation;
	ids?: NavigationMenuElementIds;
	disableClickTrigger?: boolean;
	disableHoverTrigger?: boolean;
	disablePointerLeaveClose?: boolean;
	translations?: NavigationMenuIntlTranslations;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	closeOnEscape?: boolean;
	closeOnInteractOutside?: boolean;
	onExitComplete?: () => void;
}

export type NavigationMenuAttrs = Record<string, unknown>;

function cssVars(entries: [string, string | undefined][]): string | undefined {
	const declarations = entries
		.filter((entry): entry is [string, string] => entry[1] !== undefined)
		.map(([name, value]) => `${name}: ${value}`);
	return declarations.length ? `${declarations.join('; ')};` : undefined;
}

function transitionDeclaration(value: string | undefined): [string, string | undefined] | undefined {
	return value === undefined ? undefined : ['transition', value];
}

export interface NavigationMenuApi {
	readonly id: string;
	readonly value: string;
	readonly previousValue: string;
	readonly open: boolean;
	readonly orientation: NavigationMenuOrientation;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly isViewportRendered: boolean;
	readonly viewportNode: HTMLElement | null;
	readonly viewportSize: NavigationMenuSize | null;
	readonly viewportPosition: NavigationMenuPoint | null;
	readonly triggerRect: NavigationMenuRect | null;
	readonly translations: Required<NavigationMenuIntlTranslations>;
	readonly rootId: string;
	readonly listId: string;
	readonly viewportId: string;
	triggerId(value: string): string;
	contentId(value: string): string;
	itemId(value: string): string;
	setValue(value: string): void;
	select(value: string): void;
	close(): void;
	reposition(): void;
	isSelected(value: string): boolean;
	rootAttrs(): NavigationMenuAttrs;
	listAttrs(): NavigationMenuAttrs;
	itemAttrs(props: NavigationMenuItemProps): NavigationMenuAttrs;
	triggerAttrs(props: NavigationMenuItemProps): NavigationMenuAttrs;
	contentAttrs(props: NavigationMenuContentProps): NavigationMenuAttrs;
	itemIndicatorAttrs(props: NavigationMenuContentProps): NavigationMenuAttrs;
	indicatorAttrs(): NavigationMenuAttrs;
	arrowAttrs(): NavigationMenuAttrs;
	linkAttrs(props: NavigationMenuLinkProps): NavigationMenuAttrs;
	viewportPositionerAttrs(props?: NavigationMenuViewportProps): NavigationMenuAttrs;
	viewportAttrs(props?: NavigationMenuViewportProps): NavigationMenuAttrs;
	triggerProxyAttrs(props: NavigationMenuContentProps): NavigationMenuAttrs;
	viewportProxyAttrs(props: NavigationMenuContentProps): NavigationMenuAttrs;
	registerTrigger(value: string, node: HTMLElement): () => void;
	registerList(node: HTMLElement | null): void;
	registerViewport(node: HTMLElement | null): void;
	registerContent(value: string, node: HTMLElement): () => void;
	clearPreviousValue(value: string): void;
	createContentPresence(value: string, getNode: () => HTMLElement | null): {
		readonly present: boolean;
	};
}

function toTimers(fn: () => void, delay: number) {
	const win = typeof window === 'undefined' ? null : window;
	return win ? win.setTimeout(fn, delay) : setTimeout(fn, delay);
}

function clearTimer(id: ReturnType<typeof setTimeout> | null | undefined) {
	if (id == null) return;
	clearTimeout(id as Parameters<typeof clearTimeout>[0]);
}

const queryAll = <T extends Element>(root: ParentNode | null, selector: string): T[] =>
	root ? Array.from(root.querySelectorAll<T>(selector)) : [];

// Port of @zag-js/dom-query `navigate` for the element lists a navigation menu walks.
function navigateElements(
	items: HTMLElement[],
	current: Element | null,
	options: {
		key: string;
		orientation: NavigationMenuOrientation | 'both';
		dir: 'ltr' | 'rtl' | 'auto';
		loop: boolean;
	}
): HTMLElement | null {
	if (!current) return null;
	const { orientation, dir = 'ltr', key, loop } = options;
	if (!items.length || !key) return null;
	const isVertical = key === 'ArrowUp' || key === 'ArrowDown';
	const isHorizontal = key === 'ArrowLeft' || key === 'ArrowRight';
	if (!isVertical && !isHorizontal && key !== 'Home' && key !== 'End') return null;
	if ((orientation === 'vertical' && isHorizontal) || (orientation === 'horizontal' && isVertical)) return null;
	if (key === 'Home') return items[0] ?? null;
	if (key === 'End') return items[items.length - 1] ?? null;
	const index = items.indexOf(current as HTMLElement);
	if (index === -1) return null;
	const forward =
		orientation === 'both'
			? key === 'ArrowDown' || (dir === 'ltr' ? key === 'ArrowRight' : key === 'ArrowLeft')
			: isVertical
				? key === 'ArrowDown'
				: dir === 'ltr'
					? key === 'ArrowRight'
					: key === 'ArrowLeft';
	const next = forward
		? loop
			? (index + 1) % items.length
			: Math.min(index + 1, items.length - 1)
		: loop
			? (index - 1 + items.length) % items.length
			: Math.max(0, index - 1);
	return items[next] ?? null;
}

const tabbableSelector = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

function tabbablesOf(root: HTMLElement): HTMLElement[] {
	return queryAll<HTMLElement>(root, tabbableSelector).filter(
		(element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true'
	);
}

function defined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}

const navigationMenuContext = createContext<NavigationMenuApi>('NavigationMenu', 'NavigationMenu.Root');
const navigationMenuItemContext = createContext<() => NavigationMenuItemProps>(
	'NavigationMenuItem',
	'NavigationMenuItem'
);
const navigationMenuViewportContext = createContext<() => NavigationMenuViewportProps>(
	'NavigationMenuViewport',
	'NavigationMenuViewportPositioner'
);

export const useNavigationMenuContext = () => navigationMenuContext.get();
export const setNavigationMenuContext = (api: NavigationMenuApi) => navigationMenuContext.set(api);
export const useNavigationMenuItemPropsContext = () => navigationMenuItemContext.use();
export const setNavigationMenuItemPropsContext = (getProps: () => NavigationMenuItemProps) =>
	navigationMenuItemContext.set(getProps);
export const useNavigationMenuViewportPropsContext = () => navigationMenuViewportContext.use();
export const setNavigationMenuViewportPropsContext = (getProps: () => NavigationMenuViewportProps) =>
	navigationMenuViewportContext.set(getProps);

export function createNavigationMenu(
	getProps: () => UseNavigationMenuProps,
	uid: string
): NavigationMenuApi {
	const id = getProps().id ?? uid;
	const ids = getProps().ids ?? {};
	const rootId = ids.root ?? `nav-menu:${id}`;
	const listId = ids.list ?? `nav-menu:${id}:list`;
	const viewportId = ids.viewport ?? `nav-menu:${id}:viewport`;

	const triggerId = (value: string) => ids.trigger?.(value) ?? `nav-menu:${id}:trigger:${value}`;
	const triggerProxyId = (value: string) =>
		ids.triggerProxy?.(value) ?? `nav-menu:${id}:trigger-proxy:${value}`;
	const contentId = (value: string) => ids.content?.(value) ?? `nav-menu:${id}:content:${value}`;
	const itemId = (value: string) => ids.item?.(value) ?? `nav-menu:${id}:item:${value}`;

	const orientation = (): NavigationMenuOrientation => getProps().orientation ?? 'horizontal';
	const dir = () => getProps().dir;
	const resolvedDir = (): 'ltr' | 'rtl' => (getProps().dir === 'rtl' ? 'rtl' : 'ltr');
	const translations = (): Required<NavigationMenuIntlTranslations> => ({
		rootLabel: getProps().translations?.rootLabel ?? 'Main'
	});

	let internalValue = $state(getProps().defaultValue ?? '');
	let internalPreviousValue = $state('');
	let viewportSize = $state<NavigationMenuSize | null>(null);
	let viewportPosition = $state<NavigationMenuPoint | null>(null);
	let triggerRect = $state<NavigationMenuRect | null>(null);
	let triggerNode = $state<HTMLElement | null>(null);
	let listNode = $state<HTMLElement | null>(null);
	let viewportNode = $state<HTMLElement | null>(null);
	let triggerList: { value: string; node: HTMLElement }[] = [];
	let contentList: { value: string; node: HTMLElement }[] = [];
	let triggers = $state<{ value: string; node: HTMLElement }[]>([]);
	let contents = $state<{ value: string; node: HTMLElement }[]>([]);
	let closeTimeoutId: ReturnType<typeof setTimeout> | null = null;
	const openTimeoutIds: Record<string, ReturnType<typeof setTimeout>> = {};

	const valueOf = (): string => {
		const value = getProps().value;
		return value === undefined ? internalValue : value;
	};
	const previousValueOf = () => internalPreviousValue;
	const isOpen = () => Boolean(valueOf());
	const isViewportRendered = () => viewportNode !== null;

	function clearCloseTimeout() {
		clearTimer(closeTimeoutId);
		closeTimeoutId = null;
	}

	function clearOpenTimeout(value: string) {
		const timeoutId = openTimeoutIds[value];
		if (timeoutId == null) return;
		clearTimer(timeoutId);
		delete openTimeoutIds[value];
	}

	function clearAllOpenTimeouts() {
		for (const key of Object.keys(openTimeoutIds)) clearOpenTimeout(key);
	}

	function setCloseTimeout() {
		clearCloseTimeout();
		closeTimeoutId = toTimers(() => {
			setValue('');
		}, getProps().closeDelay ?? 300);
	}

	function setValue(next: string) {
		if (next === valueOf()) return;
		if (getProps().value === undefined) internalValue = next;
		getProps().onValueChange?.({ value: next });
	}

	function select(value: string) {
		internalPreviousValue = valueOf();
		setValue(value);
	}

	function setValueWithDelay(value: string) {
		const skipDelay = valueOf() !== '';
		clearOpenTimeout(value);
		const openTimeoutId = toTimers(
			() => {
				const innerTimeoutId = toTimers(() => {
					clearOpenTimeout(value);
					select(value);
				}, 0);
				openTimeoutIds[value] = innerTimeoutId;
			},
			skipDelay ? 0 : (getProps().openDelay ?? 200)
		);
		openTimeoutIds[value] = openTimeoutId;
	}

	function deselectValue() {
		clearAllOpenTimeouts();
		clearCloseTimeout();
		internalPreviousValue = '';
		setValue('');
	}

	function docOf() {
		return listNode?.ownerDocument ?? viewportNode?.ownerDocument ?? null;
	}

	function activeElement(): Element | null {
		return docOf()?.activeElement ?? null;
	}

	function triggerNodeFor(value: string): HTMLElement | null {
		return triggerList.find((entry) => entry.value === value)?.node ?? null;
	}

	function contentNodeFor(value: string): HTMLElement | null {
		return contentList.find((entry) => entry.value === value)?.node ?? null;
	}

	function activeContentNode(): HTMLElement | null {
		return contentNodeFor(valueOf()) ?? contentNodeFor(previousValueOf());
	}

	function triggerElements(): HTMLElement[] {
		const registered = triggerList.map((entry) => entry.node);
		if (registered.length) return registered.filter((node) => !node.hasAttribute('data-disabled'));
		return queryAll<HTMLElement>(
			listNode,
			`[data-part="trigger"][data-uid="${id}"]:not([data-disabled])`
		);
	}

	function linkElements(value: string): HTMLElement[] {
		const content = contentNodeFor(value);
		return queryAll<HTMLElement>(content, '[data-part="link"]').filter((node) =>
			(node.getAttribute('data-ownedby') ?? '').split(/\s+/).includes(contentId(value))
		);
	}

	function elements(): HTMLElement[] {
		return [...triggerElements(), ...queryAll<HTMLElement>(listNode, '[data-part="item"] > [data-part="link"]')];
	}

	function focusFirst(candidates: HTMLElement[], side: 'start' | 'end') {
		const ordered = side === 'start' ? candidates : [...candidates].reverse();
		for (const candidate of ordered) {
			const previous = activeElement();
			if (candidate === previous) return;
			candidate.focus();
			if (activeElement() !== previous) return;
		}
	}

	function focusContent(value: string, side: 'start' | 'end') {
		const win = docOf()?.defaultView;
		const focus = () => {
			const content = contentNodeFor(value || valueOf());
			if (!content) return;
			focusFirst(tabbablesOf(content), side);
		};
		if (win) win.requestAnimationFrame(focus);
		else requestAnimationFrame(focus);
	}

	function focusTrigger(value: string) {
		triggerNodeFor(value)?.focus();
	}

	function focusTriggerIfNeeded(value: string) {
		const content = contentNodeFor(value);
		if (!content) return;
		const active = activeElement();
		if (!active || !content.contains(active)) return;
		triggerNodeFor(value)?.focus();
	}

	function close() {
		const value = valueOf();
		focusTriggerIfNeeded(value);
		deselectValue();
	}

	function measureTrigger() {
		const node = triggerNode;
		if (!node) return;
		triggerRect = {
			x: node.offsetLeft,
			y: node.offsetTop,
			width: node.offsetWidth,
			height: node.offsetHeight
		};
	}

	function measureViewport() {
		const content = activeContentNode();
		if (!content) return;
		viewportSize = { width: content.offsetWidth, height: content.offsetHeight };
	}

	function setViewportPosition() {
		const content = activeContentNode();
		const trigger = triggerNode;
		const root = listNode?.closest('[data-scope="navigation-menu"][data-part="root"]') as HTMLElement | null;
		const doc = docOf();
		if (!content || !trigger || !root || !doc) return;
		const align = viewportNode?.dataset.align ?? 'center';
		const bodyWidth = doc.documentElement.offsetWidth;
		const bodyHeight = doc.documentElement.offsetHeight;
		const rootRect = root.getBoundingClientRect();
		const rect = trigger.getBoundingClientRect();
		const { offsetWidth, offsetHeight } = content;
		const startLeft = rect.left - rootRect.left;
		const startTop = rect.top - rootRect.top;
		let x: number;
		let y: number;
		if (align === 'start') {
			x = startLeft;
			y = startTop;
		} else if (align === 'end') {
			x = startLeft - offsetWidth + rect.width;
			y = startTop - offsetHeight + rect.height;
		} else {
			x = startLeft - offsetWidth / 2 + rect.width / 2;
			y = startTop - offsetHeight / 2 + rect.height / 2;
		}
		const screenOffset = 10;
		if (x + rootRect.left < screenOffset) x = screenOffset - rootRect.left;
		const rightOffset = x + rootRect.left + offsetWidth;
		if (rightOffset > bodyWidth - screenOffset) {
			x -= rightOffset - bodyWidth + screenOffset;
			if (x < screenOffset - rootRect.left) x = screenOffset - rootRect.left;
		}
		if (y + rootRect.top < screenOffset) y = screenOffset - rootRect.top;
		const bottomOffset = y + rootRect.top + offsetHeight;
		if (bottomOffset > bodyHeight - screenOffset) {
			y -= bottomOffset - bodyHeight + screenOffset;
			if (y < screenOffset - rootRect.top) y = screenOffset - rootRect.top;
		}
		viewportPosition = { x: Math.round(x), y: Math.round(y) };
	}

	function reposition() {
		measureTrigger();
		measureViewport();
		setViewportPosition();
	}

	function clearPreviousValue(value: string) {
		if (internalPreviousValue !== value) return;
		internalPreviousValue = '';
	}

	function setMotionAttribute(value: string, previous: string) {
		const doc = docOf();
		if (!doc || !isViewportRendered()) return;
		const triggers = triggerElements();
		if (!triggers.length) return;
		let values = triggers.map((trigger) => trigger.getAttribute('data-value') ?? '');
		if (resolvedDir() === 'rtl') values.reverse();
		const index = values.indexOf(value);
		const previousIndex = values.indexOf(previous);
		for (const content of queryAll<HTMLElement>(
			doc,
			`[data-scope="navigation-menu"][data-part="content"][data-uid="${id}"]`
		)) {
			const itemValue = content.dataset.value ?? '';
			const selected = value === itemValue;
			const wasSelected = previousIndex === values.indexOf(itemValue);
			if (!selected && !wasSelected) {
				delete content.dataset.motion;
				continue;
			}
			let motion: string | null = null;
			if (index !== previousIndex) {
				if (selected && previousIndex !== -1) motion = index > previousIndex ? 'from-end' : 'from-start';
				else if (wasSelected && index !== -1) motion = index > previousIndex ? 'to-start' : 'to-end';
			}
			if (motion) content.dataset.motion = motion;
			else delete content.dataset.motion;
		}
	}

	$effect(() => {
		void triggers.length;
		void contents.length;
		void valueOf();
		untrack(() => {
			const node = triggerNodeFor(valueOf());
			triggerNode = node;
			measureTrigger();
			measureViewport();
			setViewportPosition();
		});
	});

	$effect(() => {
		const value = valueOf();
		const previous = previousValueOf();
		void triggers.length;
		void contents.length;
		untrack(() => setMotionAttribute(value, previous));
	});

	$effect(() => {
		if (!isOpen()) return;
		const win = docOf()?.defaultView;
		if (!win) return;
		const onResize = () => reposition();
		win.addEventListener('resize', onResize);
		return () => win.removeEventListener('resize', onResize);
	});

	useEscapeLayer({
		enabled: () => isOpen() && getProps().closeOnEscape !== false,
		onEscape(event) {
			event.preventDefault();
			close();
		}
	});

	useDismissableLayer({
		enabled: () => isOpen(),
		getNode: () => viewportNode ?? activeContentNode(),
		getExclude: () => triggerList.map((entry) => entry.node),
		onFocusOutside(event) {
			const target = event.detail.originalEvent.target as Element | null;
			if (!target) return;
			if (target.closest('[data-trigger-proxy]')) {
				event.preventDefault();
				return;
			}
			const root = docOf()?.querySelector(
				`[data-scope="navigation-menu"][data-part="root"]`
			) as HTMLElement | null;
			if (root?.contains(target)) event.preventDefault();
		},
		onPointerDownOutside(event) {
			const target = event.detail.originalEvent.target as Element | null;
			if (!target) return;
			if (triggerList.some((entry) => entry.node.contains(target))) event.preventDefault();
			else if (viewportNode?.contains(target)) event.preventDefault();
		},
		onInteractOutside(event) {
			if (event.defaultPrevented) return;
			if (getProps().closeOnInteractOutside === false) return;
			close();
		}
	});

	function itemState(props: NavigationMenuItemProps) {
		const selected = valueOf() === props.value;
		const wasSelected = !valueOf() && previousValueOf() === props.value;
		return {
			selected,
			wasSelected,
			open: selected || wasSelected,
			disabled: Boolean(props.disabled)
		};
	}

	function rootAttrs(): NavigationMenuAttrs {
		return defined({
			id: rootId,
			dir: dir() ?? undefined,
			'aria-label': translations().rootLabel,
			'data-orientation': orientation(),
			style: cssVars([
				['--trigger-width', toPx(triggerRect?.width)],
				['--trigger-height', toPx(triggerRect?.height)],
				['--trigger-x', toPx(triggerRect?.x)],
				['--trigger-y', toPx(triggerRect?.y)],
				['--viewport-width', toPx(viewportSize?.width)],
				['--viewport-height', toPx(viewportSize?.height)],
				['--viewport-x', toPx(viewportPosition?.x)],
				['--viewport-y', toPx(viewportPosition?.y)]
			])
		});
	}

	function viewportMetrics(): [string, string | undefined][] {
		return [
			['--viewport-width', toPx(viewportSize?.width)],
			['--viewport-height', toPx(viewportSize?.height)],
			['--viewport-x', toPx(viewportPosition?.x)],
			['--viewport-y', toPx(viewportPosition?.y)],
			['--navigation-menu-viewport-width', toPx(viewportSize?.width)],
			['--navigation-menu-viewport-height', toPx(viewportSize?.height)]
		];
	}

	return {
		id,
		rootId,
		listId,
		viewportId,
		triggerId,
		contentId,
		itemId,
		get value() {
			return valueOf();
		},
		get previousValue() {
			return previousValueOf();
		},
		get open() {
			return isOpen();
		},
		get orientation() {
			return orientation();
		},
		get dir() {
			return dir();
		},
		get isViewportRendered() {
			return isViewportRendered();
		},
		get viewportNode() {
			return viewportNode;
		},
		get viewportSize() {
			return viewportSize;
		},
		get viewportPosition() {
			return viewportPosition;
		},
		get triggerRect() {
			return triggerRect;
		},
		get translations() {
			return translations();
		},
		setValue,
		select,
		close,
		reposition,
		isSelected: (value) => valueOf() === value,
		rootAttrs,
		listAttrs: () =>
			defined({
				id: listId,
				dir: dir() ?? undefined,
				'data-orientation': orientation(),
				style: 'position: relative;'
			}),
		itemAttrs(props) {
			const state = itemState(props);
			return defined({
				id: itemId(props.value),
				dir: dir() ?? undefined,
				'data-value': props.value,
				'data-state': state.open ? 'open' : 'closed',
				'data-orientation': orientation(),
				'data-disabled': dataAttr(state.disabled),
				onkeydown(event: KeyboardEvent) {
					switch (event.key) {
						case 'ArrowDown':
						case 'ArrowUp':
						case 'ArrowLeft':
						case 'ArrowRight':
						case 'Home':
						case 'End': {
							const active = activeElement();
							const links = linkElements(props.value);
							if (active && links.includes(active as HTMLElement)) {
								const next = navigateElements(links, active, {
									key: event.key,
									orientation: 'both',
									dir: resolvedDir(),
									loop: false
								});
								next?.focus();
							}
							event.preventDefault();
							event.stopPropagation();
							break;
						}
					}
				}
			});
		},
		triggerAttrs(props) {
			const state = itemState(props);
			return defined({
				id: triggerId(props.value),
				type: 'button',
				'data-uid': id,
				'data-trigger-proxy-id': triggerProxyId(props.value),
				dir: dir() ?? undefined,
				disabled: state.disabled,
				'data-value': props.value,
				'data-state': state.selected ? 'open' : 'closed',
				'data-disabled': dataAttr(state.disabled),
				'aria-controls': contentId(props.value),
				'aria-expanded': state.selected,
				onpointerenter(event: PointerEvent) {
					if (getProps().disableHoverTrigger) return;
					if (event.pointerType !== 'mouse') return;
					if (state.disabled) return;
					setValueWithDelay(props.value);
				},
				onpointerleave(event: PointerEvent) {
					if (getProps().disableHoverTrigger) return;
					if (event.pointerType !== 'mouse') return;
					if (state.disabled) return;
					clearOpenTimeout(props.value);
					setCloseTimeout();
				},
				onclick() {
					if (getProps().disableClickTrigger) return;
					if (valueOf() === props.value) deselectValue();
					else select(props.value);
				},
				onkeydown(event: KeyboardEvent) {
					const entryKey =
						orientation() === 'horizontal'
							? 'ArrowDown'
							: resolvedDir() === 'rtl'
								? 'ArrowLeft'
								: 'ArrowRight';
					if (isOpen() && event.key === entryKey) {
						focusContent(props.value, 'start');
						event.preventDefault();
						event.stopPropagation();
						return;
					}
					const next = navigateElements(elements(), event.currentTarget as Element, {
						key: event.key,
						orientation: orientation(),
						dir: resolvedDir(),
						loop: false
					});
					if (!next) return;
					next.focus();
					event.preventDefault();
					event.stopPropagation();
				}
			});
		},
		contentAttrs(props) {
			const state = itemState(props);
			const activeValue = valueOf() || previousValueOf();
			const selected = isViewportRendered() ? activeValue === props.value : state.selected;
			return defined({
				id: contentId(props.value),
				dir: dir() ?? undefined,
				hidden: !selected,
				'aria-labelledby': triggerId(props.value),
				'data-uid': id,
				'data-state': selected ? 'open' : 'closed',
				'data-orientation': orientation(),
				'data-value': props.value,
				onpointerenter(event: PointerEvent) {
					if (event.pointerType !== 'mouse') return;
					clearCloseTimeout();
				},
				onpointerleave(event: PointerEvent) {
					if (event.pointerType !== 'mouse') return;
					setCloseTimeout();
				},
				onkeydown(event: KeyboardEvent) {
					if (event.defaultPrevented) return;
					const current = event.currentTarget as HTMLElement;
					if (!current.closest('[data-scope="navigation-menu"][data-part="root"]')) return;
					const meta = event.altKey || event.ctrlKey || event.metaKey;
					const candidates = tabbablesOf(current);
					if (event.key === 'Tab' && !meta) {
						const active = activeElement();
						const index = candidates.findIndex((candidate) => candidate === active);
						const next =
							event.shiftKey
								? candidates.slice(0, index).reverse()
								: candidates.slice(index + 1, candidates.length);
						for (const candidate of next) {
							if (candidate === activeElement()) continue;
							candidate.focus();
							if (activeElement() === candidate) {
								event.preventDefault();
								return;
							}
						}
						close();
						focusTrigger(props.value);
						event.preventDefault();
						return;
					}
					if (event.currentTarget !== event.target) return;
					const next = navigateElements(candidates, activeElement(), {
						key: event.key,
						orientation: orientation(),
						dir: resolvedDir(),
						loop: false
					});
					if (!next) return;
					next.focus();
					event.preventDefault();
					event.stopPropagation();
				}
			});
		},
		itemIndicatorAttrs(props) {
			const state = itemState(props);
			return defined({
				'aria-hidden': true,
				dir: dir() ?? undefined,
				hidden: !state.selected,
				'data-state': state.selected ? 'open' : 'closed',
				'data-orientation': orientation(),
				'data-value': props.value
			});
		},
		indicatorAttrs() {
			const open = isOpen();
			const preventTransition = Boolean(valueOf()) && !previousValueOf();
			return defined({
				'aria-hidden': true,
				dir: dir() ?? undefined,
				hidden: !open,
				'data-state': open ? 'open' : 'closed',
				'data-orientation': orientation(),
				style: `position: absolute;${preventTransition ? ' transition: none;' : ''}`
			});
		},
		arrowAttrs: () =>
			defined({
				'aria-hidden': true,
				dir: dir() ?? undefined,
				'data-orientation': orientation()
			}),
		linkAttrs(props) {
			const closeOnClick = props.closeOnClick ?? true;
			return defined({
				dir: dir() ?? undefined,
				'data-value': props.value,
				'data-current': dataAttr(props.current),
				'aria-current': props.current ? 'page' : undefined,
				'data-ownedby': contentId(props.value),
				onclick(event: MouseEvent) {
					const target = event.currentTarget as HTMLElement;
					const win = target.ownerDocument.defaultView;
					if (props.onSelect) target.addEventListener('link.select', props.onSelect as EventListener, { once: true });
					const selectEvent = new (win?.CustomEvent ?? CustomEvent)('link.select', {
						bubbles: true,
						cancelable: true,
						detail: { originalEvent: event }
					});
					target.dispatchEvent(selectEvent);
					if (closeOnClick && !selectEvent.defaultPrevented && !event.metaKey) close();
				},
				onkeydown(event: KeyboardEvent) {
					const currentElement = event.currentTarget as HTMLElement;
					const list = currentElement.closest('[data-scope="navigation-menu"][data-part="content"]')
						? linkElements(props.value)
						: elements();
					const next = navigateElements(list, currentElement, {
						key: event.key,
						orientation: orientation(),
						dir: resolvedDir(),
						loop: false
					});
					if (!next) return;
					next.focus();
					event.preventDefault();
					event.stopPropagation();
				}
			});
		},
		viewportPositionerAttrs(props = {}) {
			const align = props.align ?? 'center';
			return defined({
				dir: dir() ?? undefined,
				'data-orientation': orientation(),
				'data-align': align
			});
		},
		viewportAttrs(props = {}) {
			const align = props.align ?? 'center';
			const open = isOpen();
			const preventTransition = Boolean(valueOf()) && !previousValueOf();
			const style = cssVars([
				transitionDeclaration(preventTransition ? 'none' : undefined),
				open ? undefined : ['pointer-events', 'none'],
				...viewportMetrics()
			].filter(Boolean) as [string, string | undefined][]);
			return defined({
				id: viewportId,
				dir: dir() ?? undefined,
				hidden: !open,
				'data-state': open ? 'open' : 'closed',
				'data-orientation': orientation(),
				'data-align': align,
				style
			});
		},
		triggerProxyAttrs(props) {
			const state = itemState(props);
			return defined({
				'aria-hidden': true,
				tabindex: 0,
				'data-trigger-proxy': '',
				id: triggerProxyId(props.value),
				'data-trigger-id': triggerId(props.value),
				hidden: !state.selected,
				style: visuallyHiddenStyle,
				onfocus(event: FocusEvent) {
					const content = contentNodeFor(props.value);
					if (!content) return;
					const previous = event.relatedTarget as Element | null;
					const fromTrigger = previous === triggerNodeFor(props.value);
					const fromContent = previous ? content.contains(previous) : false;
					if (fromTrigger || !fromContent) focusContent(props.value, fromTrigger ? 'start' : 'end');
				}
			});
		},
		viewportProxyAttrs(props) {
			if (!itemState(props).selected || !isViewportRendered()) return { hidden: true };
			return { 'aria-owns': contentId(props.value) };
		},
		registerTrigger(value, node) {
			triggerList = [...triggerList.filter((entry) => entry.node !== node), { value, node }];
			triggers = [...triggerList];
			return () => {
				triggerList = triggerList.filter((entry) => entry.node !== node);
				triggers = [...triggerList];
			};
		},
		registerList(node) {
			listNode = node;
		},
		registerViewport(node) {
			viewportNode = node;
		},
		registerContent(value, node) {
			contentList = [...contentList.filter((entry) => entry.node !== node), { value, node }];
			contents = [...contentList];
			return () => {
				contentList = contentList.filter((entry) => entry.node !== node);
				contents = [...contentList];
			};
		},
		clearPreviousValue,
		createContentPresence(value, getNode) {
			return createPresence({
				present: () => valueOf() === value,
				getNode,
				lazyMount: () => getProps().lazyMount ?? false,
				unmountOnExit: () => getProps().unmountOnExit ?? false,
				onExitComplete: () => {
					clearPreviousValue(value);
					getProps().onExitComplete?.();
				}
			});
		}
	};
}
