import { untrack } from 'svelte';
import { createContext } from '../../internal/context';
import { dataAttr, toPx } from '../../internal/dom';

export interface TocItemData {
	value: string;
	depth: number;
	label?: string;
}

export interface TocActiveChangeDetails {
	activeIds: string[];
	activeItems: TocItemData[];
}

export interface TocScrollToDetails {
	behavior?: ScrollBehavior;
}

export interface TocRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface TocItemState {
	active: boolean;
	first: boolean;
	last: boolean;
	depth: number;
}

export interface TocElementIds {
	root?: string;
	nav?: string;
	title?: string;
	list?: string;
	item?: (value: string) => string;
	link?: (value: string) => string;
	indicator?: string;
}

export interface UseTocProps {
	items: TocItemData[];
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: TocElementIds;
	rootMargin?: string;
	threshold?: number | number[];
	scrollEl?: () => HTMLElement | null;
	autoScroll?: boolean;
	scrollBehavior?: ScrollBehavior;
	multiple?: boolean;
	activeIds?: string[];
	defaultActiveIds?: string[];
	onActiveChange?: (details: TocActiveChangeDetails) => void;
	getRootNode?: () => Node | undefined;
}

export interface TocApi {
	readonly activeIds: string[];
	readonly activeItems: TocItemData[];
	readonly items: TocItemData[];
	readonly indicatorRect: TocRect | null;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly rootId: string;
	readonly navId: string;
	readonly titleId: string;
	readonly listId: string;
	readonly indicatorId: string;
	itemId(value: string): string;
	linkId(value: string): string;
	setActiveIds(value: string[]): void;
	scrollTo(value: string, details?: TocScrollToDetails): void;
	getItemState(item: TocItemData): TocItemState;
	rootAttrs(): Record<string, unknown>;
	navAttrs(): Record<string, unknown>;
	titleAttrs(): Record<string, unknown>;
	listAttrs(): Record<string, unknown>;
	itemAttrs(item: TocItemData): Record<string, unknown>;
	linkAttrs(item: TocItemData): Record<string, unknown>;
	indicatorAttrs(): Record<string, unknown>;
	handleLinkClick(event: MouseEvent): void;
}

interface TocHeading {
	value: string;
	el: HTMLElement;
}

function sameIds(a: string[], b: string[]): boolean {
	return a.length === b.length && a.every((value, index) => value === b[index]);
}

function sameRect(a: TocRect | null, b: TocRect): boolean {
	return (
		a != null && a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
	);
}

function getDocument(getRootNode?: () => Node | undefined): Document {
	const node = getRootNode?.();
	if (node && node.nodeType === 9) return node as Document;
	if (node?.ownerDocument) return node.ownerDocument;
	return document;
}

function getScope(getRootNode?: () => Node | undefined): ParentNode {
	const node = getRootNode?.();
	if (node && typeof (node as unknown as ParentNode).querySelector === 'function') {
		return node as unknown as ParentNode;
	}
	return getDocument(getRootNode);
}

function queryId(scope: ParentNode, id: string): HTMLElement | null {
	const escaped = id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	return scope.querySelector<HTMLElement>(`[id="${escaped}"]`);
}

function getConstructor<K extends string>(
	win: (Window & typeof globalThis) | null | undefined,
	name: K
): unknown {
	const local = win ? (win as unknown as Record<string, unknown>)[name] : undefined;
	if (typeof local === 'function') return local;
	const shared = (globalThis as unknown as Record<string, unknown>)[name];
	return typeof shared === 'function' ? shared : undefined;
}

function isScrollableY(el: HTMLElement): boolean {
	const style = el.ownerDocument.defaultView?.getComputedStyle(el);
	if (!style || !/auto|scroll|overlay|hidden/.test(style.overflowY)) return false;
	return el.scrollHeight > el.clientHeight;
}

function getScrollParent(el: HTMLElement, stop?: (node: HTMLElement) => boolean): HTMLElement | null {
	let node: HTMLElement | null = el.parentElement;
	while (node && node !== node.ownerDocument.documentElement) {
		if (stop?.(node)) return null;
		if (isScrollableY(node)) return node;
		node = node.parentElement;
	}
	return null;
}

function getScrollContainer(scrollEl: HTMLElement | null, headingEl: HTMLElement): HTMLElement {
	if (scrollEl) return scrollEl;
	const parent = getScrollParent(headingEl);
	if (parent) return parent;
	const scrollingElement = headingEl.ownerDocument.scrollingElement as HTMLElement | null;
	return scrollingElement ?? headingEl.ownerDocument.documentElement;
}

function resolveScrollContainer(
	cached: HTMLElement | null,
	scrollEl: HTMLElement | null,
	headingEl: HTMLElement
): HTMLElement {
	if (cached && cached.scrollHeight > cached.clientHeight) return cached;
	return getScrollContainer(scrollEl, headingEl);
}

function getBandTop(container: HTMLElement, rootBounds: { top: number } | null): number {
	const viewTop =
		container === container.ownerDocument.scrollingElement
			? 0
			: container.getBoundingClientRect().top;
	return Math.max(rootBounds?.top ?? viewTop, viewTop);
}

function findCurrentSection(headings: TocHeading[], bandTop: number): string | undefined {
	let low = 0;
	let high = headings.length - 1;
	let value: string | undefined;
	while (low <= high) {
		const mid = (low + high) >> 1;
		if (headings[mid].el.getBoundingClientRect().top <= bandTop) {
			value = headings[mid].value;
			low = mid + 1;
		} else {
			high = mid - 1;
		}
	}
	return value;
}

function findEndOfPageHeading(
	headings: TocHeading[],
	container: HTMLElement,
	bandTop: number
): string | undefined {
	const lastHeading = headings[headings.length - 1];
	if (!lastHeading) return undefined;
	const maxScroll = container.scrollHeight - container.clientHeight;
	const remaining = maxScroll - container.scrollTop;
	const overflow = lastHeading.el.getBoundingClientRect().top - bandTop - remaining;
	if (overflow <= 0) return undefined;
	const stretch = Math.min(overflow, maxScroll);
	if (remaining >= stretch) return undefined;
	const line = bandTop + overflow * (1 - remaining / stretch);
	return headings.find((heading) => heading.el.getBoundingClientRect().top >= line - 1)?.value;
}

function getScrollTopToElement(el: HTMLElement, rootEl: HTMLElement): number {
	const elTop = el.getBoundingClientRect().top;
	let distance = elTop;
	if (rootEl !== rootEl.ownerDocument.scrollingElement) {
		const rootRect = rootEl.getBoundingClientRect();
		const scale = rootEl.offsetHeight ? rootRect.height / rootEl.offsetHeight : 1;
		distance = (elTop - rootRect.top) / scale - rootEl.clientTop;
	}
	const maxScroll = rootEl.scrollHeight - rootEl.clientHeight;
	return Math.min(Math.max(rootEl.scrollTop + distance, 0), maxScroll);
}

function scrollElement(rootEl: HTMLElement, top: number, behavior?: ScrollBehavior) {
	if (!Number.isFinite(top)) return;
	if (typeof rootEl.scrollTo === 'function') {
		rootEl.scrollTo({ top, ...(behavior ? { behavior } : {}) });
		return;
	}
	rootEl.scrollTop = top;
}

function getNearestScrollOffset(el: HTMLElement, rootEl: HTMLElement): number | null {
	if (!rootEl.contains(el)) return null;
	const rootRect = rootEl.getBoundingClientRect();
	const elRect = el.getBoundingClientRect();
	const viewStart = rootRect.top + rootEl.clientTop;
	const viewEnd = viewStart + (rootEl.clientHeight || rootRect.height - rootEl.clientTop * 2);
	let delta: number;
	if (elRect.top < viewStart) delta = elRect.top - viewStart;
	else if (elRect.bottom > viewEnd) delta = elRect.bottom - viewEnd;
	else return null;
	if (!delta || !Number.isFinite(delta)) return null;
	return rootEl.scrollTop + delta;
}

function isCtrlOrMetaKey(event: MouseEvent): boolean {
	const userAgent = typeof navigator === 'undefined' ? '' : (navigator.userAgent ?? '');
	const isApple = /mac|iphone|ipad|ipod/i.test(userAgent);
	return isApple ? event.metaKey : event.ctrlKey;
}

function isOpeningInNewTab(event: MouseEvent): boolean {
	const el = event.currentTarget as HTMLElement | null;
	if (!el) return false;
	if (!el.matches("a[href], button[type='submit'], input[type='submit']")) return false;
	return event.button === 1 || isCtrlOrMetaKey(event);
}

function isDownloadingEvent(event: MouseEvent): boolean {
	const el = event.currentTarget as HTMLElement | null;
	if (!el || !event.altKey) return false;
	const localName = el.localName;
	if (localName === 'a') return true;
	if (localName === 'button' && (el as HTMLButtonElement).type === 'submit') return true;
	if (localName === 'input' && (el as HTMLInputElement).type === 'submit') return true;
	return false;
}

function getSamePageHash(el: HTMLAnchorElement): string | null {
	const href = el.getAttribute('href');
	if (!href) return null;
	const win = el.ownerDocument.defaultView;
	if (!win) return null;
	let url: URL;
	try {
		url = new win.URL(href, win.location.href);
	} catch {
		return null;
	}
	if (url.origin !== win.location.origin) return null;
	if (url.pathname !== win.location.pathname) return null;
	if (url.search !== win.location.search) return null;
	try {
		return decodeURIComponent(url.hash.slice(1)) || null;
	} catch {
		return null;
	}
}

function pushHash(win: Window, value: string) {
	const oldURL = win.location.href;
	win.history.pushState(null, '', `#${value}`);
	const HashChange = (win as Window & { HashChangeEvent?: typeof HashChangeEvent }).HashChangeEvent;
	if (typeof HashChange !== 'function') return;
	win.dispatchEvent(new HashChange('hashchange', { oldURL, newURL: win.location.href }));
}

const tocContext = createContext<TocApi>('Toc', 'Toc.Root');
export const useTocContext = () => tocContext.get();
export const setTocContext = (api: TocApi) => tocContext.set(api);

const tocItemPropsContext = createContext<() => TocItemData>('TocItemProps', 'Toc.Item');
export const useTocItemPropsContext = () => tocItemPropsContext.get();
export const setTocItemPropsContext = (item: () => TocItemData) => tocItemPropsContext.set(item);

export function createToc(getProps: () => UseTocProps, uid: string): TocApi {
	const rootId = () => getProps().ids?.root ?? `toc:${getProps().id ?? uid}`;
	const navId = () => getProps().ids?.nav ?? `${rootId()}:nav`;
	const titleId = () => getProps().ids?.title ?? `${rootId()}:title`;
	const listId = () => getProps().ids?.list ?? `${rootId()}:list`;
	const itemId = (value: string) => getProps().ids?.item?.(value) ?? `${rootId()}:item-${value}`;
	const linkId = (value: string) => getProps().ids?.link?.(value) ?? `${rootId()}:link-${value}`;
	const indicatorId = () => getProps().ids?.indicator ?? `${rootId()}:indicator`;

	let internalActiveIds = $state<string[]>(getProps().defaultActiveIds ?? []);
	let indicatorRect = $state<TocRect | null>(null);

	let headings: TocHeading[] = [];
	let visibility = new Map<string, boolean>();
	let rootBounds: { top: number } | null = null;
	let observer: IntersectionObserver | null = null;
	let indicatorCleanup: (() => void) | null = null;
	let scrollContainer: HTMLElement | null = null;
	let frame: number | null = null;
	let started = false;

	const isControlled = () => getProps().activeIds !== undefined;
	const activeIds = () => (isControlled() ? (getProps().activeIds ?? []) : internalActiveIds);
	const items = () => getProps().items;
	const activeItems = () => items().filter((item) => activeIds().includes(item.value));
	const multiple = () => getProps().multiple !== false;
	const autoScroll = () => getProps().autoScroll === true;
	const scrollBehavior = () => getProps().scrollBehavior ?? 'smooth';
	const rootMargin = () => getProps().rootMargin ?? '-20px 0% -40% 0%';
	const threshold = () => getProps().threshold ?? 0;

	const doc = () => getDocument(getProps().getRootNode);
	const partEl = (id: string) => queryId(getScope(getProps().getRootNode), id) ?? doc().getElementById(id);
	const headingEl = (value: string) => doc().getElementById(value);

	function setActiveIds(value: string[]) {
		if (sameIds(activeIds(), value)) return;
		if (!isControlled()) internalActiveIds = value;
		getProps().onActiveChange?.({
			activeIds: value,
			activeItems: items().filter((item) => value.includes(item.value))
		});
	}

	function getItemState(item: TocItemData): TocItemState {
		const ids = activeIds();
		return {
			active: ids.includes(item.value),
			first: ids.length > 0 && item.value === ids[0],
			last: ids.length > 0 && item.value === ids[ids.length - 1],
			depth: item.depth
		};
	}

	function syncActiveIds() {
		if (headings.length === 0) return;
		const visibleIds = headings
			.filter((heading) => visibility.get(heading.value))
			.map((heading) => heading.value);
		let nextActiveIds = visibleIds;
		if (!multiple() || visibleIds.length === 0) {
			const container = resolveScrollContainer(
				scrollContainer,
				getProps().scrollEl?.() ?? null,
				headings[0].el
			);
			scrollContainer = container;
			const bandTop = getBandTop(container, rootBounds);
			if (!multiple()) {
				const endpoint = findEndOfPageHeading(headings, container, bandTop) ?? visibleIds[0];
				nextActiveIds = endpoint ? [endpoint] : [];
			}
			if (nextActiveIds.length === 0) {
				const current = findCurrentSection(headings, bandTop);
				nextActiveIds = current ? [current] : [];
			}
		}
		if (nextActiveIds.length === 0 || sameIds(activeIds(), nextActiveIds)) return;
		setActiveIds(nextActiveIds);
	}

	function scheduleSync() {
		const win = doc().defaultView;
		if (!win?.requestAnimationFrame) {
			syncActiveIds();
			return;
		}
		if (frame != null) return;
		frame = win.requestAnimationFrame(() => {
			frame = null;
			syncActiveIds();
		});
	}

	function createHeadingObserver(): IntersectionObserver | null {
		const scrollEl = getProps().scrollEl?.() ?? null;
		const win = scrollEl?.ownerDocument.defaultView ?? doc().defaultView;
		const Ctor = getConstructor(win, 'IntersectionObserver') as
			| (new (
					callback: (entries: IntersectionObserverEntry[]) => void,
					options?: IntersectionObserverInit
			  ) => IntersectionObserver)
			| undefined;
		if (!Ctor) return null;
		return new Ctor(
			(entries) => {
				for (const entry of entries) {
					const node = entry.target as HTMLElement;
					if (node.id) visibility.set(node.id, entry.isIntersecting);
				}
				const bounds = entries[0]?.rootBounds;
				if (bounds) rootBounds = { top: bounds.top };
				syncActiveIds();
			},
			{ root: scrollEl, rootMargin: rootMargin(), threshold: threshold() }
		);
	}

	function observeHeadings() {
		observer?.disconnect();
		observer = null;
		visibility = new Map();
		headings = items().flatMap((item) => {
			const el = headingEl(item.value);
			return el ? [{ value: item.value, el }] : [];
		});
		scrollContainer = headings.length
			? getScrollContainer(getProps().scrollEl?.() ?? null, headings[0].el)
			: null;
		const next = createHeadingObserver();
		if (next) {
			observer = next;
			for (const heading of headings) next.observe(heading.el);
		}
		if (headings.length === 0) {
			untrack(() => {
				if (activeIds().length > 0) setActiveIds([]);
			});
		}
	}

	function syncIndicatorRect(ids: string[]) {
		indicatorCleanup?.();
		indicatorCleanup = null;
		if (ids.length === 0) {
			indicatorRect = null;
			return;
		}
		const measure = () => {
			const current = activeIds();
			if (current.length === 0) {
				indicatorRect = null;
				return;
			}
			const firstEl = partEl(itemId(current[0]));
			const lastEl = partEl(itemId(current[current.length - 1]));
			if (!firstEl) return;
			const firstRect = firstEl.getBoundingClientRect();
			const lastRect = (lastEl ?? firstEl).getBoundingClientRect();
			const listEl = partEl(listId());
			const listRect = listEl?.getBoundingClientRect();
			const originX = listEl && listRect ? listRect.left - listEl.scrollLeft : 0;
			const originY = listEl && listRect ? listRect.top - listEl.scrollTop : 0;
			const nextRect: TocRect = {
				x: firstRect.left - originX,
				y: firstRect.top - originY,
				width: firstRect.width,
				height: lastRect.bottom - firstRect.top
			};
			if (!sameRect(indicatorRect, nextRect)) indicatorRect = nextRect;
		};
		measure();
		const cleanups: Array<() => void> = [];
		const ResizeObserverCtor = getConstructor(doc().defaultView, 'ResizeObserver') as
			| (new (callback: () => void) => ResizeObserver)
			| undefined;
		if (ResizeObserverCtor) {
			for (const id of ids) {
				const el = partEl(itemId(id));
				if (!el) continue;
				const resizeObserver = new ResizeObserverCtor(measure);
				resizeObserver.observe(el);
				cleanups.push(() => resizeObserver.disconnect());
			}
		}
		indicatorCleanup = () => {
			for (const cleanup of cleanups) cleanup();
		};
	}

	function autoScrollToActive(ids: string[]) {
		if (!autoScroll()) return;
		const activeId = ids[0];
		if (!activeId) return;
		const itemEl = partEl(itemId(activeId));
		if (!itemEl) return;
		const contentEl = getProps().scrollEl?.() ?? headingEl(activeId);
		if (!contentEl) return;
		const target = getScrollParent(itemEl, (node) => node.contains(contentEl));
		if (!target) return;
		const top = getNearestScrollOffset(itemEl, target);
		if (top == null) return;
		scrollElement(target, top, scrollBehavior());
	}

	function scrollTo(value: string, details?: TocScrollToDetails): boolean {
		const heading = headingEl(value);
		if (!heading) return false;
		const behavior = details?.behavior ?? scrollBehavior();
		const container = getProps().scrollEl?.() ?? null;
		if (!container) {
			if (typeof heading.scrollIntoView === 'function') {
				heading.scrollIntoView({ behavior, block: 'start' });
			}
			return true;
		}
		if (!container.contains(heading)) return false;
		scrollElement(container, getScrollTopToElement(heading, container), behavior);
		return true;
	}

	function handleLinkClick(event: MouseEvent) {
		if (event.defaultPrevented) return;
		if (isDownloadingEvent(event)) return;
		if (isOpeningInNewTab(event)) return;
		const el = event.currentTarget as HTMLAnchorElement | null;
		if (!el) return;
		const value = getSamePageHash(el);
		if (!value || !headingEl(value)) return;
		setActiveIds([value]);
		const container = getProps().scrollEl?.() ?? null;
		if (!container) return;
		if (!scrollTo(value)) return;
		event.preventDefault();
		const win = el.ownerDocument.defaultView;
		if (win) pushHash(win, value);
	}

	$effect(() => {
		observeHeadings();
		const target = doc();
		const onScroll = () => scheduleSync();
		target.addEventListener('scroll', onScroll, { capture: true, passive: true });
		return () => {
			target.removeEventListener('scroll', onScroll, { capture: true });
			observer?.disconnect();
			observer = null;
			indicatorCleanup?.();
			indicatorCleanup = null;
			if (frame != null) {
				doc().defaultView?.cancelAnimationFrame?.(frame);
				frame = null;
			}
			visibility = new Map();
			headings = [];
			scrollContainer = null;
		};
	});

	$effect(() => {
		const ids = activeIds();
		untrack(() => {
			syncIndicatorRect(ids);
			autoScrollToActive(ids);
		});
	});

	$effect(() => {
		multiple();
		if (!started) {
			started = true;
			return;
		}
		syncActiveIds();
	});

	const dir = () => getProps().dir ?? undefined;

	return {
		itemId,
		linkId,
		setActiveIds,
		scrollTo(value, details) {
			if (!scrollTo(value, details)) return;
			setActiveIds([value]);
		},
		getItemState,
		handleLinkClick,
		rootAttrs() {
			const rect = indicatorRect;
			const vars = [
				['--top', toPx(rect?.y)],
				['--left', toPx(rect?.x)],
				['--width', toPx(rect?.width)],
				['--height', toPx(rect?.height)]
			]
				.filter(([, value]) => value != null)
				.map(([name, value]) => `${name}: ${value}`)
				.join('; ');
			return {
				id: rootId(),
				dir: dir(),
				style: vars || undefined
			};
		},
		navAttrs() {
			return {
				id: navId(),
				dir: dir(),
				'aria-labelledby': titleId()
			};
		},
		titleAttrs() {
			return { id: titleId(), dir: dir() };
		},
		listAttrs() {
			return { id: listId(), dir: dir() };
		},
		itemAttrs(item) {
			const state = getItemState(item);
			return {
				id: itemId(item.value),
				dir: dir(),
				'data-value': item.value,
				'data-depth': String(state.depth),
				'data-active': dataAttr(state.active),
				'data-first': dataAttr(state.first),
				'data-last': dataAttr(state.last),
				style: `--depth: ${state.depth}`
			};
		},
		linkAttrs(item) {
			const state = getItemState(item);
			return {
				id: linkId(item.value),
				dir: dir(),
				'data-value': item.value,
				'data-active': dataAttr(state.active),
				'aria-current': state.active ? 'location' : undefined
			};
		},
		indicatorAttrs() {
			return {
				id: indicatorId(),
				hidden: rectIsEmpty(indicatorRect) || undefined,
				style: 'position: absolute'
			};
		},
		get activeIds() {
			return activeIds();
		},
		get activeItems() {
			return activeItems();
		},
		get items() {
			return items();
		},
		get indicatorRect() {
			return indicatorRect;
		},
		get dir() {
			return getProps().dir;
		},
		get rootId() {
			return rootId();
		},
		get navId() {
			return navId();
		},
		get titleId() {
			return titleId();
		},
		get listId() {
			return listId();
		},
		get indicatorId() {
			return indicatorId();
		}
	};
}

function rectIsEmpty(rect: TocRect | null): boolean {
	return rect == null || (rect.width === 0 && rect.height === 0 && rect.x === 0 && rect.y === 0);
}
