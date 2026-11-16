import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import { a11yLabels } from '../../internal/a11yLabels.js';
import type { SplitterPanelData } from '../splitter/splitter.state.svelte.js';

export type SidebarSide = 'left' | 'right';
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';
export type SidebarState = 'expanded' | 'collapsed';

/** Cookie the open state is written to when `persist` is on. */
export const SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_KEYBOARD_SHORTCUT = 'mod+b';
export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_ICON = '3rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_MOBILE_BREAKPOINT = 768;

export interface SidebarElementIds {
	root?: string;
	trigger?: string;
	rail?: string;
}

export interface SidebarTranslations {
	toggle?: string;
	resize?: string;
	rail?: string;
}

export interface SidebarOpenChangeDetails {
	open: boolean;
}

export interface UseSidebarProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (details: SidebarOpenChangeDetails) => void;
	collapsible?: SidebarCollapsible;
	side?: SidebarSide;
	panelId?: string;
	/** Keyboard shortcut that toggles the sidebar, `mod+b` by default. Set `false` to disable. */
	keyboardShortcut?: string | false;
	/** Writes the open state to a cookie so the server can render the matching markup. */
	persist?: boolean;
	persistKey?: string;
	/** Forced mobile layout, in place of the viewport check. */
	mobile?: boolean;
	mobileBreakpoint?: number;
	width?: string;
	height?: string;
	widthIcon?: string;
	widthMobile?: string;
	/** Vertical offset of the floating trigger, read by `Sidebar.module.css`. */
	triggerOffsetY?: string;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: SidebarElementIds;
	translations?: SidebarTranslations;
}

export interface SidebarApi {
	readonly id: string;
	readonly panelId: string;
	readonly side: SidebarSide;
	readonly collapsible: SidebarCollapsible;
	readonly open: boolean;
	readonly collapsed: boolean;
	readonly state: SidebarState;
	readonly mobile: boolean;
	readonly rootId: string;
	readonly triggerId: string;
	readonly railId: string;
	readonly toggleLabel: string;
	readonly resizeLabel: string;
	readonly railLabel: string;
	setOpen(open: boolean): void;
	toggle(): void;
	toggleSidebar(): void;
	rootAttrs(): Record<string, unknown>;
	triggerAttrs(): Record<string, unknown>;
	railAttrs(): Record<string, unknown>;
	panelAttrs(): Record<string, unknown>;
	insetAttrs(): Record<string, unknown>;
	contentAttrs(): Record<string, unknown>;
	expandedContentAttrs(): Record<string, unknown>;
	collapsedContentAttrs(): Record<string, unknown>;
	registerRoot(node: globalThis.Element | null): void;
}

export function getSidebarPanels(side: SidebarSide, panelId: string): SplitterPanelData[] {
	const sidebar: SplitterPanelData = {
		id: panelId,
		minSize: SIDEBAR_WIDTH_ICON,
		maxSize: '18rem',
		collapsible: true,
		collapsedSize: SIDEBAR_WIDTH_ICON
	};
	const content: SplitterPanelData = { id: 'content' };
	return side === 'left' ? [sidebar, content] : [content, sidebar];
}

export function getSidebarDefaultSize(side: SidebarSide): Array<number | string> {
	const size: Array<number | string> = [];
	size[side === 'left' ? 0 : 1] = SIDEBAR_WIDTH;
	return size;
}

function readCookie(name: string): string | null {
	if (typeof document === 'undefined') return null;
	const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
	if (typeof document === 'undefined') return;
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function isEditable(target: EventTarget | null): boolean {
	if (!(target instanceof Element)) return false;
	return Boolean(target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'));
}

function matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
	const parts = shortcut.toLowerCase().split('+').map((part) => part.trim()).filter(Boolean);
	const key = parts.at(-1);
	if (!key || event.key.toLowerCase() !== key) return false;

	if (parts.includes('mod')) {
		if (!event.ctrlKey && !event.metaKey) return false;
	} else if (parts.includes('ctrl') !== event.ctrlKey) return false;
	if (!parts.includes('mod') && parts.includes('meta') !== event.metaKey) return false;
	if (parts.includes('alt') !== event.altKey) return false;
	if (parts.includes('shift') !== event.shiftKey) return false;
	return true;
}

function asHTMLElement(node: globalThis.Element | null): HTMLElement | null {
	return node instanceof HTMLElement ? node : null;
}

const sidebarContext = createContext<SidebarApi>('Sidebar', 'Sidebar.Root');

export const useSidebarContext = () => sidebarContext.get();
export const setSidebarContext = (api: SidebarApi) => sidebarContext.set(api);
/** moduix's name for the same lookup. */
export const useSidebar = () => sidebarContext.get();

export function createSidebar(getProps: () => UseSidebarProps, uid: string): SidebarApi {
	const id = () => getProps().id ?? `sidebar:${uid}`;
	const panelId = () => getProps().panelId ?? 'sidebar';
	const side = (): SidebarSide => getProps().side ?? 'left';
	const collapsible = (): SidebarCollapsible => getProps().collapsible ?? 'icon';
	const rootId = () => getProps().ids?.root ?? id();
	const triggerId = () => getProps().ids?.trigger ?? `${id()}:trigger`;
	const railId = () => getProps().ids?.rail ?? `${id()}:rail`;

	const stored = () => {
		if (!getProps().persist) return null;
		const value = readCookie(getProps().persistKey ?? SIDEBAR_COOKIE_NAME);
		return value === 'true' ? true : value === 'false' ? false : null;
	};

	let internalOpen = $state(Boolean(getProps().defaultOpen ?? stored() ?? true));
	let viewportMobile = $state(false);
	let rootNode = $state<HTMLElement | null>(null);

	const isControlled = () => getProps().open !== undefined;
	const open = () => (isControlled() ? Boolean(getProps().open) : internalOpen);
	const mobile = () => getProps().mobile ?? viewportMobile;
	const state = (): SidebarState => (open() ? 'expanded' : 'collapsed');

	function setOpen(next: boolean) {
		if (next === open()) return;
		if (!isControlled()) internalOpen = next;
		if (getProps().persist) writeCookie(getProps().persistKey ?? SIDEBAR_COOKIE_NAME, String(next));
		getProps().onOpenChange?.({ open: next });
	}

	function toggle() {
		if (collapsible() === 'none') return;
		setOpen(!open());
	}

	$effect(() => {
		if (getProps().mobile !== undefined) return;
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
		const query = window.matchMedia(`(max-width: ${getProps().mobileBreakpoint ?? SIDEBAR_MOBILE_BREAKPOINT}px)`);
		viewportMobile = query.matches;
		const onChange = (event: MediaQueryListEvent) => {
			viewportMobile = event.matches;
		};
		query.addEventListener('change', onChange);
		return () => query.removeEventListener('change', onChange);
	});

	$effect(() => {
		const shortcut = getProps().keyboardShortcut ?? SIDEBAR_KEYBOARD_SHORTCUT;
		const node = asHTMLElement(rootNode);
		if (!shortcut || !node) return;
		const doc = node.ownerDocument;
		const onKeydown = (event: KeyboardEvent) => {
			if (event.defaultPrevented || isEditable(event.target)) return;
			if (!matchesShortcut(event, shortcut)) return;
			event.preventDefault();
			toggle();
		};
		doc.addEventListener('keydown', onKeydown);
		return () => doc.removeEventListener('keydown', onKeydown);
	});

	return {
		get id() {
			return id();
		},
		get panelId() {
			return panelId();
		},
		get side() {
			return side();
		},
		get collapsible() {
			return collapsible();
		},
		get open() {
			return open();
		},
		get collapsed() {
			return !open();
		},
		get state() {
			return state();
		},
		get mobile() {
			return mobile();
		},
		get rootId() {
			return rootId();
		},
		get triggerId() {
			return triggerId();
		},
		get railId() {
			return railId();
		},
		get toggleLabel() {
			return getProps().translations?.toggle ?? a11yLabels.toggleSidebar;
		},
		get resizeLabel() {
			return getProps().translations?.resize ?? a11yLabels.resizeSidebar;
		},
		get railLabel() {
			return getProps().translations?.rail ?? a11yLabels.toggleSidebar;
		},
		setOpen,
		toggle,
		toggleSidebar: toggle,
		rootAttrs() {
			const width = getProps().width ?? SIDEBAR_WIDTH;
			const height = getProps().height ?? '100dvh';
			const offset = getProps().triggerOffsetY ?? '40px';
			return {
				id: rootId(),
				dir: getProps().dir ?? undefined,
				'data-state': state(),
				'data-collapsible': collapsible(),
				'data-side': side(),
				'data-mobile': dataAttr(mobile()),
				style: `--moduix-sidebar-width: ${width}; --moduix-sidebar-height: ${height}; --moduix-sidebar-width-icon: ${getProps().widthIcon ?? SIDEBAR_WIDTH_ICON}; --moduix-sidebar-width-mobile: ${getProps().widthMobile ?? SIDEBAR_WIDTH_MOBILE}; --moduix-sidebar-trigger-offset-y: ${offset}; width: var(--moduix-sidebar-width); height: var(--moduix-sidebar-height);`
			};
		},
		triggerAttrs() {
			return {
				id: triggerId(),
				dir: getProps().dir ?? undefined,
				type: 'button',
				'aria-label': getProps().translations?.toggle ?? a11yLabels.toggleSidebar,
				'aria-expanded': open(),
				'aria-controls': rootId(),
				'data-state': state(),
				'data-side': side(),
				disabled: collapsible() === 'none'
			};
		},
		railAttrs() {
			return {
				id: railId(),
				dir: getProps().dir ?? undefined,
				type: 'button',
				tabindex: -1,
				'aria-label': getProps().translations?.rail ?? a11yLabels.toggleSidebar,
				'aria-expanded': open(),
				'aria-controls': rootId(),
				'data-state': state(),
				'data-side': side()
			};
		},
		panelAttrs() {
			return {
				dir: getProps().dir ?? undefined,
				'data-state': state(),
				'data-collapsible': collapsible(),
				'data-side': side()
			};
		},
		insetAttrs() {
			return {
				dir: getProps().dir ?? undefined,
				'data-side': side(),
				'data-state': state()
			};
		},
		contentAttrs() {
			return {
				dir: getProps().dir ?? undefined,
				'data-state': state(),
				'data-collapsible': collapsible()
			};
		},
		expandedContentAttrs() {
			return { dir: getProps().dir ?? undefined, hidden: !open() };
		},
		collapsedContentAttrs() {
			return { dir: getProps().dir ?? undefined, hidden: open() };
		},
		registerRoot(node) {
			rootNode = asHTMLElement(node);
		}
	};
}
