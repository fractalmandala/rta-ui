import { untrack } from 'svelte';
import { createContext } from '../../internal/context';
import { createPresence } from '../../internal/presence.svelte.js';

export type ToastType = 'success' | 'error' | 'loading' | 'info' | 'warning' | (string & {});
export type ToastQueuePriority = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ToastPlacement = 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end';
export type ToastStatus = 'visible' | 'dismissing' | 'unmounted';
export type ToastState = 'open' | 'closing' | 'closed';

export interface ToastStatusChangeDetails {
	status: ToastStatus;
	src?: string | undefined;
}

export interface ToastActionOptions {
	label: string;
	onClick: () => void;
}

export interface ToastIntlTranslations {
	closeTriggerLabel?: string | undefined;
}

export interface ToastHeight {
	id: string;
	height: number;
}

export interface ToastOptions {
	title?: unknown;
	description?: unknown;
	duration?: number | undefined;
	removeDelay?: number | undefined;
	id?: string | undefined;
	type?: ToastType | undefined;
	priority?: ToastQueuePriority | undefined;
	onStatusChange?: ((details: ToastStatusChangeDetails) => void) | undefined;
	action?: ToastActionOptions | undefined;
	closable?: boolean | undefined;
	meta?: Record<string, unknown> | undefined;
}

export interface ToastPromiseOptions<V> {
	loading: ToastOptions;
	success?: ToastOptions & { type?: 'success' | 'warning' } | ((value: V) => ToastOptions & { type?: 'success' | 'warning' });
	error?: ToastOptions | ((error: unknown) => ToastOptions);
	finally?: () => void | Promise<void>;
}

interface ToastData extends ToastOptions {
	promise?: unknown;
}

export interface ToastRecord extends Omit<ToastOptions, 'priority'> {
	id: string;
	type: ToastType;
	duration: number;
	removeDelay: number;
	gap: number;
	priority: number;
	paused: boolean;
	promise?: unknown;
	dismiss?: boolean;
	message?: string;
}

export type ToastStoreEvent = Partial<ToastRecord> & { id: string };

export interface ToastStoreProps {
	placement?: ToastPlacement | undefined;
	max?: number | undefined;
	overlap?: boolean | undefined;
	duration?: number | undefined;
	gap?: number | undefined;
	offsets?: string | Record<'left' | 'right' | 'bottom' | 'top', string> | undefined;
	hotkey?: string[] | undefined;
	removeDelay?: number | undefined;
	pauseOnPageIdle?: boolean | undefined;
}

export type ToastAttrs = Required<Omit<ToastStoreProps, 'duration'>> & Pick<ToastStoreProps, 'duration'>;

export interface CreateToasterProps extends ToastStoreProps {}

export interface ToastStore {
	attrs: ToastAttrs;
	subscribe: (subscriber: (event: ToastStoreEvent) => void) => () => void;
	create: (data: ToastOptions) => string;
	update: (id: string, data: ToastOptions | ((current: ToastRecord) => ToastOptions)) => string;
	remove: (id?: string) => void;
	dismiss: (id?: string) => void;
	error: (data: ToastOptions) => string;
	success: (data: ToastOptions) => string;
	info: (data: ToastOptions) => string;
	warning: (data: ToastOptions) => string;
	loading: (data: ToastOptions) => string;
	getVisibleToasts: () => ToastRecord[];
	getCount: () => number;
	promise: <V>(
		promise: Promise<V> | (() => Promise<V>),
		options: ToastPromiseOptions<V>,
		shared?: ToastOptions
	) => { id: string | undefined; unwrap: () => Promise<V> } | undefined;
	pause: (id?: string) => void;
	resume: (id?: string) => void;
	isVisible: (id: string) => boolean;
	isDismissed: (id: string) => boolean;
	expand: () => void;
	collapse: () => void;
	subscribeLayout: (subscriber: (stacked: boolean) => void) => () => void;
}

export type CreateToasterReturn<T = unknown> = ToastStore;

const defaultTimeouts: Record<string, number> = {
	info: 5000,
	error: 5000,
	success: 2000,
	loading: Number.POSITIVE_INFINITY,
	warning: 5000,
	DEFAULT: 5000
};

export function getToastDuration(duration: number | undefined, type: string): number {
	return duration ?? defaultTimeouts[type] ?? defaultTimeouts.DEFAULT;
}

const priorities: Record<string, [number, number]> = {
	error: [1, 2],
	warning: [3, 6],
	loading: [4, 5],
	success: [5, 7],
	info: [6, 8]
};

const DEFAULT_TYPE = 'info';

function getPriorityForType(type: string | undefined, hasAction: boolean): number {
	const pair = priorities[type ?? DEFAULT_TYPE] ?? priorities[DEFAULT_TYPE];
	return hasAction ? pair[0] : pair[1];
}

function compactOptions(data: ToastOptions): Partial<ToastRecord> {
	const result: Partial<ToastRecord> = {};
	if (data.type !== undefined) result.type = data.type;
	if (data.title !== undefined) result.title = data.title;
	if (data.description !== undefined) result.description = data.description;
	if (data.duration !== undefined) result.duration = data.duration;
	if (data.removeDelay !== undefined) result.removeDelay = data.removeDelay;
	if (data.id !== undefined) result.id = data.id;
	if (data.priority !== undefined) result.priority = data.priority;
	if (data.onStatusChange !== undefined) result.onStatusChange = data.onStatusChange;
	if (data.action !== undefined) result.action = data.action;
	if (data.closable !== undefined) result.closable = data.closable;
	if (data.meta !== undefined) result.meta = data.meta;
	return result;
}

function uuid(): string {
	return Math.random().toString(36).slice(2, 10);
}

function resolveOptions<A>(
	options: ToastOptions | ((arg: A) => ToastOptions) | undefined,
	arg: A
): ToastOptions {
	return typeof options === 'function' ? options(arg) : (options ?? {});
}

function isHttpResponse(value: unknown): value is { ok: boolean; status: number } {
	return (
		typeof value === 'object' &&
		value !== null &&
		'ok' in value &&
		typeof (value as { ok: unknown }).ok === 'boolean' &&
		'status' in value &&
		typeof (value as { status: unknown }).status === 'number'
	);
}

/** The global toast store: creation, queueing, timing and dismissal, independent of the DOM. */
export function createToaster(props: CreateToasterProps = {}): CreateToasterReturn {
	const attrs: ToastAttrs = {
		placement: props.placement ?? 'bottom',
		overlap: props.overlap ?? false,
		max: props.max ?? 24,
		gap: props.gap ?? 16,
		offsets: props.offsets ?? '1rem',
		hotkey: props.hotkey ?? ['altKey', 'KeyT'],
		removeDelay: props.removeDelay ?? 200,
		pauseOnPageIdle: props.pauseOnPageIdle ?? true,
		duration: props.duration
	};

	let subscribers: ((event: ToastStoreEvent) => void)[] = [];
	let toasts: ToastRecord[] = [];
	const dismissedToasts = new Set<string>();
	let toastQueue: ToastRecord[] = [];
	const closingToasts = new Set<string>();
	const promiseTokens = new Map<string, symbol>();
	let paused = false;
	const layoutSubscribers = new Set<(stacked: boolean) => void>();

	const subscribe = (subscriber: (event: ToastStoreEvent) => void) => {
		subscribers.push(subscriber);
		let active = true;
		return () => {
			if (!active) return;
			active = false;
			const index = subscribers.indexOf(subscriber);
			if (index !== -1) subscribers.splice(index, 1);
		};
	};

	const pending: ToastStoreEvent[] = [];
	let publishing = false;

	const publish = (...events: ToastStoreEvent[]) => {
		pending.push(...events);
		if (publishing) return;
		publishing = true;
		try {
			while (pending.length) {
				const next = pending.shift();
				if (!next) continue;
				for (const subscriber of subscribers.slice()) subscriber(next);
			}
		} finally {
			publishing = false;
			pending.length = 0;
		}
	};

	const addToast = (record: ToastRecord) => {
		if (toasts.length >= attrs.max) {
			toastQueue.push(record);
			return;
		}
		toasts.unshift(record);
		publish(record);
	};

	const processQueue = () => {
		toastQueue = [...toastQueue].sort((a, b) => (a.priority ?? 8) - (b.priority ?? 8));
		while (toastQueue.length > 0 && toasts.length < attrs.max) {
			const next = toastQueue.shift();
			if (!next) continue;
			const record = { ...next, paused: paused || next.paused };
			toasts.unshift(record);
			publish(record);
		}
	};

	const create = (data: ToastOptions): string => {
		const id = data.id ?? `toast:${uuid()}`;
		const exists = toasts.find((toast) => toast.id === id) ?? toastQueue.find((toast) => toast.id === id);
		if (closingToasts.has(id)) return id;
		if (typeof data === 'object' && data !== null && 'promise' in data && data.promise !== exists?.promise) {
			promiseTokens.delete(id);
		}
		dismissedToasts.delete(id);

		if (exists) {
			const next: ToastRecord = { ...exists, ...compactOptions(data), id };
			if (toasts.some((toast) => toast.id === id)) {
				toasts = toasts.map((toast) => (toast.id === id ? next : toast));
				publish(next);
			} else {
				toastQueue = toastQueue.map((toast) => (toast.id === id ? next : toast));
			}
			return id;
		}

		const patch = compactOptions(data);
		const record: ToastRecord = {
			id,
			type: patch.type ?? DEFAULT_TYPE,
			duration: getToastDuration(patch.duration ?? attrs.duration, patch.type ?? DEFAULT_TYPE),
			removeDelay: patch.removeDelay ?? attrs.removeDelay,
			priority: patch.priority ?? getPriorityForType(patch.type, Boolean(patch.action)),
			title: patch.title,
			description: patch.description,
			action: patch.action,
			closable: patch.closable,
			meta: patch.meta,
			onStatusChange: patch.onStatusChange,
			promise: (data as ToastData).promise,
			gap: attrs.gap,
			paused
		};
		addToast(record);
		return id;
	};

	const remove = (id?: string) => {
		const removed =
			id == null ? [...toasts, ...toastQueue] : [...toasts, ...toastQueue].filter((toast) => toast.id === id);
		const visible = id == null ? toasts : toasts.filter((toast) => toast.id === id);
		for (const toast of removed) {
			dismissedToasts.add(toast.id);
			closingToasts.delete(toast.id);
			promiseTokens.delete(toast.id);
		}
		if (id != null) dismissedToasts.add(id);
		toasts = id == null ? [] : toasts.filter((toast) => toast.id !== id);
		toastQueue = id == null ? [] : toastQueue.filter((toast) => toast.id !== id);
		if (id != null && !visible.length) publish({ id, dismiss: true });
		publish(...visible.map((toast) => ({ id: toast.id, dismiss: true })));
		processQueue();
	};

	const typed = (type: ToastType) => (data: ToastOptions) => create({ ...data, type });

	const getVisibleToasts = () => toasts.filter((toast) => !dismissedToasts.has(toast.id));

	const promise = <V>(
		input: Promise<V> | (() => Promise<V>),
		options: ToastPromiseOptions<V>,
		shared: ToastOptions = {}
	) => {
		if (!options || !options.loading) return undefined;
		const data: ToastData = { ...shared, ...options.loading, type: 'loading', promise: input };
		const id = create(data);
		const token = Symbol('toast-promise');
		const current = toasts.find((toast) => toast.id === id) ?? toastQueue.find((toast) => toast.id === id);
		if (current?.promise === input && !closingToasts.has(id)) promiseTokens.set(id, token);
		const isCurrent = () => promiseTokens.get(id) === token && !closingToasts.has(id);
		let removable = true;
		let result: ['resolve' | 'reject', unknown] = ['resolve', undefined];

		const tracked = (typeof input === 'function' ? input() : input)
			.then(async (response: V) => {
				result = ['resolve', response];
				if (isHttpResponse(response) && !response.ok) {
					removable = false;
					const errorOptions = resolveOptions(options.error, `HTTP Error! status: ${response.status}`);
					if (isCurrent()) create({ ...shared, ...errorOptions, id, type: 'error' });
				} else if (options.success !== undefined) {
					removable = false;
					const successOptions = resolveOptions(
						options.success as ToastOptions | ((value: V) => ToastOptions) | undefined,
						response
					) as ToastOptions & { type?: 'success' | 'warning' };
					if (isCurrent()) create({ ...shared, ...successOptions, id, type: successOptions.type ?? 'success' });
				}
			})
			.catch(async (error: unknown) => {
				result = ['reject', error];
				if (options.error !== undefined) {
					removable = false;
					const errorOptions = resolveOptions(options.error, error);
					if (isCurrent()) create({ ...shared, ...errorOptions, id, type: 'error' });
				}
			})
			.finally(() => {
				if (removable && isCurrent()) remove(id);
				if (promiseTokens.get(id) === token) promiseTokens.delete(id);
				options.finally?.();
			});

		const unwrap = () =>
			new Promise<V>((resolve, reject) => {
				tracked.then(
					() => (result[0] === 'reject' ? reject(result[1]) : resolve(result[1] as V)),
					reject
				);
			});

		return { id, unwrap };
	};

	const update = (id: string, data: ToastOptions | ((current: ToastRecord) => ToastOptions)): string => {
		if (closingToasts.has(id)) return id;
		if (typeof data !== 'function') return create({ ...data, id });
		const current = toasts.find((toast) => toast.id === id) ?? toastQueue.find((toast) => toast.id === id);
		if (!current) return id;
		const next = { ...data({ ...current }), id };
		if (closingToasts.has(id)) return id;
		if (toasts.some((toast) => toast.id === id)) return create(next);
		if (!toastQueue.some((toast) => toast.id === id)) return id;
		return create(next);
	};

	const changeToasts = (data: Partial<ToastRecord>, id?: string) => {
		const changed: ToastStoreEvent[] = [];
		toasts = toasts.map((toast) => {
			if ((id != null && toast.id !== id) || closingToasts.has(toast.id)) return toast;
			const next = { ...toast, ...data };
			changed.push(next);
			return next;
		});
		toastQueue = toastQueue.map((toast) => (id == null || toast.id === id ? { ...toast, ...data } : toast));
		publish(...changed);
	};

	const pause = (id?: string) => {
		if (id == null) paused = true;
		changeToasts({ paused: true }, id);
	};

	const resume = (id?: string) => {
		if (id == null) paused = false;
		changeToasts({ paused: false }, id);
	};

	const dismiss = (id?: string) => {
		const queued = toastQueue.filter((toast) => id == null || toast.id === id);
		toastQueue = toastQueue.filter((toast) => id != null && toast.id !== id);
		for (const toast of queued) {
			dismissedToasts.add(toast.id);
			promiseTokens.delete(toast.id);
		}
		const changed = toasts.filter((toast) => (id == null || toast.id === id) && !closingToasts.has(toast.id));
		for (const toast of changed) closingToasts.add(toast.id);
		toasts = toasts.map((toast) => (closingToasts.has(toast.id) ? { ...toast, message: 'DISMISS' } : toast));
		publish(...changed.map((toast) => ({ ...toast, message: 'DISMISS' })));
	};

	const subscribeLayout = (subscriber: (stacked: boolean) => void) => {
		layoutSubscribers.add(subscriber);
		return () => {
			layoutSubscribers.delete(subscriber);
		};
	};

	return {
		attrs,
		subscribe,
		create,
		update,
		remove,
		dismiss,
		error: typed('error'),
		success: typed('success'),
		info: typed('info'),
		warning: typed('warning'),
		loading: typed('loading'),
		getVisibleToasts,
		getCount: () => toasts.length,
		promise,
		pause,
		resume,
		isVisible: (id: string) => !dismissedToasts.has(id) && Boolean(toasts.find((toast) => toast.id === id)),
		isDismissed: (id: string) => dismissedToasts.has(id),
		expand: () => layoutSubscribers.forEach((subscriber) => subscriber(true)),
		collapse: () => layoutSubscribers.forEach((subscriber) => subscriber(false)),
		subscribeLayout
	};
}

type StyleRecord = Record<string, string | number | undefined>;

function toStyle(style: StyleRecord): string {
	const declarations = Object.entries(style)
		.filter(([, value]) => value !== undefined)
		.map(([name, value]) => `${name}: ${value}`);
	return `${declarations.join('; ')};`;
}

const MAX_Z_INDEX = 2147483647;

function getOffsets(offsets: string | Record<'left' | 'right' | 'bottom' | 'top', string>) {
	return typeof offsets === 'string'
		? { left: offsets, right: offsets, bottom: offsets, top: offsets }
		: offsets;
}

export type ToastPortalRef = HTMLElement | (() => HTMLElement | null | undefined);

export interface UseToastGroupProps {
	store: ToastStore;
	id?: string | null;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	label?: string;
	portalled?: boolean;
	portalRef?: ToastPortalRef;
}

export interface ToastGroupApi {
	readonly store: ToastStore;
	readonly id: string;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly label: string;
	readonly placement: ToastPlacement;
	readonly state: 'stack' | 'overlap';
	readonly toasts: ToastRecord[];
	readonly count: number;
	readonly heights: ToastHeight[];
	readonly regionId: string;
	readonly hotkeyLabel: string;
	readonly groupStyle: string;
	readonly portalled: boolean;
	readonly portalTarget: Element | null | undefined;
	setRegionNode(node: HTMLElement | null): void;
	setHeight(item: ToastHeight): void;
	removeHeight(id: string): void;
	heightOf(id: string): number;
	heightIndexOf(id: string): number;
	heightBefore(id: string): number;
	pauseAll(): void;
	resumeAll(): void;
	handlePointerEnter(): void;
	handlePointerLeave(): void;
	handleFocus(event: FocusEvent): void;
	handleBlur(event: FocusEvent): void;
}

const toastGroupContext = createContext<ToastGroupApi>('ToastGroup', 'Toast.Toaster');

export const useToastGroupContext = () => toastGroupContext.get();
export const setToastGroupContext = (api: ToastGroupApi) => toastGroupContext.set(api);

/** The toast group machine: visible toasts, stacking, heights and hover/focus pausing. */
export function createToastGroup(getProps: () => UseToastGroupProps, uid: string): ToastGroupApi {
	const id = getProps().id ?? uid;

	let toasts = $state<ToastRecord[]>([]);
	let heights = $state<ToastHeight[]>([]);
	let interaction = $state<'stack' | 'overlap'>(getProps().store.attrs.overlap ? 'overlap' : 'stack');
	let regionNode = $state<HTMLElement | null>(null);
	let pointerWithin = false;
	let focusWithin = false;
	let lastFocusedEl: HTMLElement | null = null;

	$effect(() => {
		const store = getProps().store;
		toasts = store.getVisibleToasts();
		return store.subscribe((event) => {
			if (event.dismiss) {
				toasts = toasts.filter((toast) => toast.id !== event.id);
				return;
			}
			const record = event as ToastRecord;
			const index = toasts.findIndex((toast) => toast.id === record.id);
			if (index === -1) {
				toasts = [record, ...toasts];
				return;
			}
			toasts = toasts.map((toast, itemIndex) => (itemIndex === index ? { ...toast, ...record } : toast));
		});
	});

	$effect(() =>
		getProps().store.subscribeLayout((stacked) => {
			interaction = stacked ? 'stack' : 'overlap';
		})
	);

	$effect(() => {
		if (!getProps().store.attrs.overlap) return;
		if (toasts.length > 1) return;
		interaction = 'overlap';
	});

	$effect(() => {
		const store = getProps().store;
		if (!store.attrs.pauseOnPageIdle) return;
		if (typeof document === 'undefined') return;
		const onChange = () => {
			if (document.visibilityState === 'hidden') store.pause();
			else store.resume();
		};
		document.addEventListener('visibilitychange', onChange);
		return () => document.removeEventListener('visibilitychange', onChange);
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		const onKeyDown = (event: KeyboardEvent) => {
			const hotkey = getProps().store.attrs.hotkey;
			if (!hotkey.every((key) => event[key as keyof KeyboardEvent] || event.code === key)) return;
			queueMicrotask(() => regionNode?.focus());
		};
		document.addEventListener('keydown', onKeyDown, { capture: true });
		return () => document.removeEventListener('keydown', onKeyDown, { capture: true });
	});

	function placement(): ToastPlacement {
		return getProps().store.attrs.placement;
	}

	function resume() {
		const store = getProps().store;
		if (store.attrs.pauseOnPageIdle && typeof document !== 'undefined' && document.visibilityState === 'hidden') {
			return;
		}
		store.resume();
	}

	function restoreFocusIfPointerOut() {
		if (!lastFocusedEl || pointerWithin) return;
		lastFocusedEl.focus({ preventScroll: true });
		lastFocusedEl = null;
		focusWithin = false;
	}

	return {
		get store() {
			return getProps().store;
		},
		id,
		get dir() {
			return getProps().dir;
		},
		get label() {
			return getProps().label ?? 'Notifications';
		},
		get placement() {
			return placement();
		},
		get state() {
			return interaction;
		},
		get toasts() {
			return toasts;
		},
		get count() {
			return toasts.length;
		},
		get heights() {
			return heights;
		},
		get regionId() {
			return `toast-group:${placement()}`;
		},
		get hotkeyLabel() {
			return getProps()
				.store.attrs.hotkey.join('+')
				.replace(/Key/g, '')
				.replace(/Digit/g, '');
		},
		get groupStyle() {
			const { offsets, gap } = getProps().store.attrs;
			const computedOffset = getOffsets(offsets);
			const rtl = getProps().dir === 'rtl';
			const computedPlacement = placement()
				.replace('-start', rtl ? '-right' : '-left')
				.replace('-end', rtl ? '-left' : '-right');
			const isRighty = computedPlacement.includes('right');
			const isLefty = computedPlacement.includes('left');
			const style: StyleRecord = {
				position: 'fixed',
				'pointer-events': toasts.length > 0 ? undefined : 'none',
				display: 'flex',
				'flex-direction': 'column',
				'--gap': `${gap}px`,
				'--first-height': `${heights[0]?.height || 0}px`,
				'--viewport-offset-left': computedOffset.left,
				'--viewport-offset-right': computedOffset.right,
				'--viewport-offset-top': computedOffset.top,
				'--viewport-offset-bottom': computedOffset.bottom,
				'z-index': MAX_Z_INDEX,
				'align-items': isRighty ? 'flex-end' : isLefty ? 'flex-start' : 'center'
			};
			if (computedPlacement.includes('top')) {
				style.top = `max(env(safe-area-inset-top, 0px), ${computedOffset.top})`;
			}
			if (computedPlacement.includes('bottom')) {
				style.bottom = `max(env(safe-area-inset-bottom, 0px), ${computedOffset.bottom})`;
			}
			if (!computedPlacement.includes('left')) {
				style['inset-inline-end'] = `calc(env(safe-area-inset-right, 0px) + ${computedOffset.right})`;
			}
			if (!computedPlacement.includes('right')) {
				style['inset-inline-start'] = `calc(env(safe-area-inset-left, 0px) + ${computedOffset.left})`;
			}
			return toStyle(style);
		},
		get portalled() {
			return getProps().portalled !== false;
		},
		get portalTarget() {
			const ref = getProps().portalRef;
			return (typeof ref === 'function' ? ref() : ref) ?? undefined;
		},
		setRegionNode(node) {
			regionNode = node;
		},
		setHeight(item) {
			const existing = heights.find((entry) => entry.id === item.id);
			if (existing) {
				if (existing.height === item.height) return;
				heights = heights.map((entry) => (entry.id === item.id ? { ...entry, height: item.height } : entry));
				return;
			}
			const rank = (toastId: string) => toasts.findIndex((toast) => toast.id === toastId);
			const index = rank(item.id);
			let insertAt = heights.findIndex((entry) => {
				const entryRank = rank(entry.id);
				return entryRank === -1 || entryRank > index;
			});
			if (insertAt === -1) insertAt = heights.length;
			heights = [...heights.slice(0, insertAt), item, ...heights.slice(insertAt)];
		},
		removeHeight(toastId) {
			heights = heights.filter((entry) => entry.id !== toastId);
		},
		heightOf(toastId) {
			return heights.find((entry) => entry.id === toastId)?.height ?? 0;
		},
		heightIndexOf(toastId) {
			return heights.findIndex((entry) => entry.id === toastId);
		},
		heightBefore(toastId) {
			const index = heights.findIndex((entry) => entry.id === toastId);
			return heights.reduce(
				(total, entry, entryIndex) => (entryIndex >= index ? total : total + entry.height),
				0
			);
		},
		pauseAll() {
			getProps().store.pause();
		},
		resumeAll() {
			resume();
		},
		handlePointerEnter() {
			if (pointerWithin && interaction === 'stack') return;
			pointerWithin = true;
			interaction = 'stack';
			getProps().store.pause();
		},
		handlePointerLeave() {
			if (!pointerWithin) return;
			pointerWithin = false;
			if (focusWithin) return;
			resume();
			if (getProps().store.attrs.overlap) interaction = 'overlap';
		},
		handleFocus(event) {
			if (focusWithin) return;
			focusWithin = true;
			lastFocusedEl = (event.relatedTarget as HTMLElement | null) ?? null;
			interaction = 'stack';
			getProps().store.pause();
		},
		handleBlur(event) {
			const current = event.currentTarget as HTMLElement | null;
			if (!focusWithin) return;
			if (current && event.relatedTarget && current.contains(event.relatedTarget as Node)) return;
			queueMicrotask(() => {
				if (!focusWithin) return;
				const active = current?.ownerDocument.activeElement;
				if (current && active && current.contains(active)) return;
				focusWithin = false;
				if (pointerWithin) return;
				resume();
				if (getProps().store.attrs.overlap) interaction = 'overlap';
				restoreFocusIfPointerOut();
			});
		}
	};
}

export interface UseToastProps {
	record: ToastRecord;
	index: number;
	group: ToastGroupApi;
}

export interface ToastApi {
	readonly id: string;
	readonly rootId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly closeTriggerId: string;
	readonly type: ToastType;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly title: unknown;
	readonly description: unknown;
	readonly action: ToastActionOptions | undefined;
	readonly closable: boolean;
	readonly placement: ToastPlacement;
	readonly side: string;
	readonly align: string;
	readonly state: ToastState;
	readonly visible: boolean;
	readonly paused: boolean;
	readonly mounted: boolean;
	readonly frontmost: boolean;
	readonly stacked: boolean;
	readonly present: boolean;
	readonly rootStyle: string;
	readonly ghostBeforeStyle: string;
	readonly ghostAfterStyle: string;
	readonly progress: number;
	readonly progressPercent: number;
	readonly ariaLabelledby: string | undefined;
	readonly ariaDescribedby: string | undefined;
	dismiss(src?: string): void;
	pause(): void;
	resume(): void;
	setRootNode(node: HTMLElement | null): void;
}

const toastContext = createContext<ToastApi>('Toast', 'Toast');

export const useToastContext = () => toastContext.get();
export const setToastContext = (api: ToastApi) => toastContext.set(api);

/** One toast machine: state, timers, mounting and the style strings Zag writes inline. */
export function createToast(getProps: () => UseToastProps, uid: string): ToastApi {
	const record = () => getProps().record;
	const group = () => getProps().group;

	const id = record().id ?? `toast:${uid}`;
	const rootId = id.startsWith('toast:') ? id : `toast:${id}`;
	const titleId = `${rootId}:title`;
	const descriptionId = `${rootId}:description`;
	const closeTriggerId = `${rootId}:close`;

	const durationOf = () => record().duration;
	const persist = () => record().type === 'loading' || !Number.isFinite(durationOf());

	let status = $state<ToastState>(record().message === 'DISMISS' ? 'closing' : 'open');
	let mounted = $state(false);
	let rootNode = $state<HTMLElement | null>(null);
	let measuredHeight = $state(0);
	let remainingMs = $state(Number.isFinite(durationOf()) ? durationOf() : 0);
	let now = $state(Date.now());
	let autoTimer: ReturnType<typeof setTimeout> | null = null;
	let closeTimer: ReturnType<typeof setTimeout> | null = null;
	let startedAt = Date.now();

	const presence = createPresence({
		present: () => status !== 'closed',
		getNode: () => rootNode,
		lazyMount: () => false,
		unmountOnExit: () => true,
		onExitComplete: () => {
			record().onStatusChange?.({ status: 'unmounted' });
			group().store.remove(id);
		}
	});

	function stopTimer() {
		if (autoTimer === null) return;
		clearTimeout(autoTimer);
		autoTimer = null;
		remainingMs = Math.max(0, remainingMs - (Date.now() - startedAt));
	}

	function dismiss(src = 'programmatic') {
		if (status !== 'open') return;
		stopTimer();
		status = 'closing';
		record().onStatusChange?.({ status: 'dismissing', src });
		group().store.dismiss(id);
		closeTimer = setTimeout(() => {
			closeTimer = null;
			status = 'closed';
		}, record().removeDelay);
	}

	record().onStatusChange?.({ status: 'visible' });

	$effect(() => {
		const frame = requestAnimationFrame(() => {
			mounted = true;
		});
		return () => cancelAnimationFrame(frame);
	});

	$effect(() => {
		if (record().message !== 'DISMISS') return;
		dismiss('programmatic');
	});

	$effect(() => {
		const isPaused = record().paused || persist();
		if (status !== 'open' || isPaused) {
			stopTimer();
			return;
		}
		startedAt = Date.now();
		const budget = Math.max(0, untrack(() => remainingMs));
		autoTimer = setTimeout(() => dismiss('timer'), budget);
		return () => stopTimer();
	});

	$effect(() => {
		if (status !== 'open' || record().paused || persist()) return;
		const interval = setInterval(() => {
			now = Date.now();
		}, 100);
		return () => clearInterval(interval);
	});

	$effect(() => {
		const node = rootNode;
		if (!node) return;
		const measure = () => {
			measuredHeight = node.offsetHeight;
			group().setHeight({ id, height: node.offsetHeight });
		};
		const frame = requestAnimationFrame(measure);
		const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
		observer?.observe(node);
		return () => {
			cancelAnimationFrame(frame);
			observer?.disconnect();
		};
	});

	function placementStyle(visible: boolean): string {
		const parent = group();
		const gap = parent.store.attrs.gap;
		const [side] = parent.placement.split('-');
		const height = measuredHeight;
		const frontmost = getProps().index === 0;
		const sibling = !frontmost;
		const stacked = parent.state === 'stack';
		const overlap = !stacked;
		const total = record().type === 'loading' ? Number.MAX_SAFE_INTEGER : remainingMs;
		const offset = parent.heightIndexOf(id) * gap + parent.heightBefore(id);
		const zIndex = parent.count - parent.toasts.findIndex((toast) => toast.id === id);
		const style: StyleRecord = {
			position: 'absolute',
			'pointer-events': 'auto',
			'--opacity': '0',
			'--remove-delay': `${record().removeDelay}ms`,
			'--duration': `${total}ms`,
			'--initial-height': `${height}px`,
			'--offset': `${offset}px`,
			'--index': getProps().index,
			'--z-index': zIndex,
			'--lift-amount': 'calc(var(--lift) * var(--gap))',
			'--y': '100%',
			'--x': '0'
		};

		if (side === 'top') {
			Object.assign(style, { top: '0', '--sign': '-1', '--y': '-100%', '--lift': '1' });
		} else if (side === 'bottom') {
			Object.assign(style, { bottom: '0', '--sign': '1', '--y': '100%', '--lift': '-1' });
		}

		if (mounted) {
			Object.assign(style, { '--y': '0', '--opacity': '1' });
			if (stacked) {
				Object.assign(style, {
					'--y': 'calc(var(--lift) * var(--offset))',
					'--height': 'var(--initial-height)'
				});
			}
		}

		if (!visible) Object.assign(style, { '--opacity': '0', 'pointer-events': 'none' });

		if (sibling && overlap) {
			Object.assign(style, {
				'--base-scale': 'var(--index) * 0.05 + 1',
				'--y': 'calc(var(--lift-amount) * var(--index))',
				'--scale': 'calc(-1 * var(--base-scale))',
				'--height': 'var(--first-height)'
			});
			if (!visible) style['--y'] = 'calc(var(--sign) * 40%)';
		}

		if (sibling && stacked && !visible) {
			style['--y'] = 'calc(var(--lift) * var(--offset) + var(--lift) * -100%)';
		}

		if (frontmost && !visible) style['--y'] = 'calc(var(--lift) * -100%)';

		return toStyle(style);
	}

	const isVisible = () => status === 'open';

	return {
		id,
		rootId,
		titleId,
		descriptionId,
		closeTriggerId,
		get type() {
			return record().type;
		},
		get dir() {
			return group().dir;
		},
		get title() {
			return record().title;
		},
		get description() {
			return record().description;
		},
		get action() {
			return record().action;
		},
		get closable() {
			return record().closable !== false;
		},
		get placement() {
			return group().placement;
		},
		get side() {
			return group().placement.split('-')[0];
		},
		get align() {
			return group().placement.split('-')[1] ?? 'center';
		},
		get state() {
			return status;
		},
		get visible() {
			return isVisible();
		},
		get paused() {
			return Boolean(record().paused);
		},
		get mounted() {
			return mounted;
		},
		get frontmost() {
			return getProps().index === 0;
		},
		get stacked() {
			return group().state === 'stack';
		},
		get present() {
			return presence.present;
		},
		get rootStyle() {
			return placementStyle(isVisible());
		},
		get ghostBeforeStyle() {
			const style: StyleRecord = {
				position: 'absolute',
				inset: '0',
				scale: '1 2',
				'pointer-events': isVisible() ? 'none' : 'auto'
			};
			if (getProps().index === 0 && !isVisible()) {
				style.height = 'calc(var(--initial-height) + 80%)';
			}
			return toStyle(style);
		},
		get ghostAfterStyle() {
			return toStyle({
				position: 'absolute',
				left: '0',
				height: 'calc(var(--gap) + 2px)',
				bottom: '100%',
				width: '100%'
			});
		},
		get progress() {
			const duration = durationOf();
			if (persist() || duration <= 0) return 1;
			const remaining = record().paused ? remainingMs : Math.max(0, remainingMs - (now - startedAt));
			return Math.min(1, Math.max(0, remaining / duration));
		},
		get progressPercent() {
			const duration = durationOf();
			if (persist() || duration <= 0) return 100;
			const remaining = record().paused ? remainingMs : Math.max(0, remainingMs - (now - startedAt));
			return Math.min(100, Math.max(0, (remaining / duration) * 100));
		},
		get ariaLabelledby() {
			return record().title != null ? titleId : undefined;
		},
		get ariaDescribedby() {
			return record().description != null ? descriptionId : undefined;
		},
		dismiss,
		pause() {
			group().store.pause(id);
		},
		resume() {
			group().store.resume(id);
		},
		setRootNode(node) {
			rootNode = node;
		}
	};
}
