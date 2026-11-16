import { getContext, hasContext, setContext } from 'svelte';
import { createContext } from '../../internal/context';

export interface DrawerStackSnapshot {
	active: boolean;
	openCount: number;
	swipeProgress: number;
	frontmostHeight: number;
}

interface StackEntry {
	order: number;
	open: boolean;
	height: number;
	swiping: boolean;
	swipeProgress: number;
}

export interface DrawerStack {
	getSnapshot(): DrawerStackSnapshot;
	subscribe(listener: () => void): () => void;
	register(id: string): void;
	unregister(id: string): void;
	setOpen(id: string, open: boolean): void;
	setHeight(id: string, height: number): void;
	setSwipe(id: string, swiping: boolean, progress: number): void;
}

export interface DrawerStackApi {
	getIndentProps(): Record<string, unknown>;
	getIndentBackgroundProps(): Record<string, unknown>;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const frozen = (snapshot: DrawerStackSnapshot): DrawerStackSnapshot => Object.freeze(snapshot);

function resolveSnapshot(entries: Map<string, StackEntry>): DrawerStackSnapshot {
	let openCount = 0;
	let frontmostHeight = 0;
	let swipeProgress = 0;
	let frontmostOrder = -1;
	for (const entry of entries.values()) {
		if (!entry.open) continue;
		openCount += 1;
		if (entry.order < frontmostOrder) continue;
		frontmostOrder = entry.order;
		frontmostHeight = entry.height > 0 ? entry.height : 0;
		swipeProgress = entry.swiping ? clamp(entry.swipeProgress, 0, 1) : 0;
	}
	return { active: openCount > 0, openCount, swipeProgress, frontmostHeight };
}

export function createDrawerStack(): DrawerStack {
	const entries = new Map<string, StackEntry>();
	const listeners = new Set<() => void>();
	let order = 0;
	let pending = false;
	let snapshot = frozen({ active: false, openCount: 0, swipeProgress: 0, frontmostHeight: 0 });

	const notify = () => {
		if (pending) return;
		pending = true;
		queueMicrotask(() => {
			pending = false;
			for (const listener of listeners) listener();
		});
	};

	const sync = () => {
		const next = resolveSnapshot(entries);
		if (
			snapshot.active === next.active &&
			snapshot.openCount === next.openCount &&
			snapshot.swipeProgress === next.swipeProgress &&
			snapshot.frontmostHeight === next.frontmostHeight
		) {
			return;
		}
		snapshot = frozen(next);
		notify();
	};

	const ensure = (id: string) => {
		let entry = entries.get(id);
		if (!entry) {
			entry = { order: (order += 1), open: false, height: 0, swiping: false, swipeProgress: 0 };
			entries.set(id, entry);
		}
		return entry;
	};

	return {
		getSnapshot: () => snapshot,
		subscribe(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		register(id) {
			ensure(id);
			sync();
		},
		unregister(id) {
			if (!entries.delete(id)) return;
			sync();
		},
		setOpen(id, open) {
			const entry = ensure(id);
			if (entry.open === open) return;
			entry.open = open;
			if (!open) {
				entry.swiping = false;
				entry.swipeProgress = 0;
			}
			sync();
		},
		setHeight(id, height) {
			const entry = ensure(id);
			const next = Number.isFinite(height) && height > 0 ? height : 0;
			if (entry.height === next) return;
			entry.height = next;
			sync();
		},
		setSwipe(id, swiping, progress) {
			const entry = ensure(id);
			const next = swiping ? clamp(Number.isFinite(progress) ? progress : 0, 0, 1) : 0;
			if (entry.swiping === swiping && entry.swipeProgress === next) return;
			entry.swiping = swiping;
			entry.swipeProgress = next;
			sync();
		}
	};
}

export function connectDrawerStack(getSnapshot: () => DrawerStackSnapshot): DrawerStackApi {
	const props = () => {
		const snapshot = getSnapshot();
		const declarations = [`--drawer-swipe-progress: ${clamp(snapshot.swipeProgress, 0, 1)}`];
		if (snapshot.frontmostHeight > 0) {
			declarations.push(`--drawer-frontmost-height: ${snapshot.frontmostHeight}px`);
		}
		return {
			'data-active': snapshot.active ? '' : undefined,
			'data-inactive': snapshot.active ? undefined : '',
			style: `${declarations.join('; ')};`
		};
	};
	return { getIndentProps: props, getIndentBackgroundProps: props };
}

const fallback: DrawerStackApi = {
	getIndentProps: () => ({ 'data-inactive': '' }),
	getIndentBackgroundProps: () => ({ 'data-inactive': '' })
};

const stackContext = createContext<DrawerStackApi>('DrawerStack', 'DrawerStack');

export const setDrawerStackContext = (api: DrawerStackApi) => stackContext.set(api);
export const useDrawerStackContext = () => stackContext.use() ?? fallback;

const STORE_KEY = Symbol('DrawerStackStore');

export const provideDrawerStackStore = (stack: DrawerStack) => setContext(STORE_KEY, stack);
export const useDrawerStackStore = () =>
	hasContext(STORE_KEY) ? getContext<DrawerStack>(STORE_KEY) : undefined;
