import { createContext } from '../../internal/context';
import { isFocusVisible } from '../../internal/dom.js';
import { useEscapeLayer } from '../../internal/layers.svelte.js';
import {
	arrowTipStyle,
	floatingStyle,
	getPlacement,
	getSide,
	type Placement,
	type PositionOptions,
	type Side
} from '../../internal/positioning.svelte.js';
import { createPresence } from '../../internal/presence.svelte.js';

export interface TooltipOpenChangeDetails {
	open: boolean;
}

export interface TooltipTriggerValueChangeDetails {
	value: string | null;
	triggerElement: HTMLElement | null;
}

export interface TooltipElementIds {
	trigger?: string | ((value?: string) => string);
	content?: string;
	arrow?: string;
	positioner?: string;
}

export type TooltipPortalRef = HTMLElement | (() => HTMLElement | null | undefined);

export interface UseTooltipProps {
	id?: string | null;
	ids?: TooltipElementIds;
	openDelay?: number;
	closeDelay?: number;
	closeOnPointerDown?: boolean;
	closeOnClick?: boolean;
	closeOnEscape?: boolean;
	closeOnScroll?: boolean;
	interactive?: boolean;
	disabled?: boolean;
	portalled?: boolean;
	portalRef?: TooltipPortalRef;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (details: TooltipOpenChangeDetails) => void;
	triggerValue?: string | null;
	defaultTriggerValue?: string | null;
	onTriggerValueChange?: (details: TooltipTriggerValueChangeDetails) => void;
	'aria-label'?: string;
	positioning?: PositionOptions;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	onExitComplete?: () => void;
}

export interface TooltipApi {
	readonly id: string;
	readonly open: boolean;
	readonly present: boolean;
	readonly hidden: boolean;
	readonly dataState: 'open' | 'closed';
	readonly instant: boolean;
	readonly interactive: boolean;
	readonly disabled: boolean;
	readonly portalled: boolean;
	readonly portalTarget: Element | null | undefined;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly triggerValue: string | null;
	readonly placement: Placement;
	readonly side: Side;
	readonly contentId: string;
	readonly arrowId: string;
	readonly positionerId: string;
	readonly ariaLabel: string | undefined;
	readonly positionerStyle: string;
	readonly arrowTipStyle: string;
	triggerId(value?: string | null): string;
	setOpen(open: boolean): void;
	setTriggerValue(value: string | null): void;
	reposition(options?: Partial<PositionOptions>): void;
	setContentNode(node: HTMLElement | null): void;
	setPositionerNode(node: HTMLElement | null): void;
	activeTriggerNode(): HTMLElement | null;
	registerTrigger(value: string | null, node: HTMLElement): () => void;
	handleTriggerClick(value?: string): void;
	handleTriggerFocus(value?: string): void;
	handleTriggerBlur(relatedTarget: EventTarget | null): void;
	handleTriggerPointerDown(value?: string): void;
	handleTriggerPointerMove(value?: string): void;
	handleTriggerPointerLeave(): void;
	handleContentPointerEnter(): void;
	handleContentPointerLeave(): void;
}

type TooltipStatus = 'closed' | 'opening' | 'open' | 'closing';

interface TriggerEntry {
	value: string | null;
	node: HTMLElement;
}

type TooltipEvent =
	| { type: 'open'; value?: string }
	| { type: 'close' }
	| { type: 'pointer.move'; value?: string }
	| { type: 'pointer.leave' }
	| { type: 'content.pointer.move' }
	| { type: 'content.pointer.leave' }
	| { type: 'triggerValue.set'; value: string | null };

// Zag keeps the "instant" flag for a tooltip replacing another one in module state, so the second
// tooltip of a group opens without the open delay and the first one skips its exit animation.
interface TooltipStore {
	id: string | null;
	prevId: string | null;
	instant: boolean;
}

let store: TooltipStore = { id: null, prevId: null, instant: false };
const storeListeners = new Set<() => void>();

function updateStore(next: Partial<TooltipStore>) {
	store = { ...store, ...next };
	for (const listener of storeListeners) listener();
}

const tooltipContext = createContext<TooltipApi>('Tooltip', 'Tooltip.Root');

export const useTooltipContext = () => tooltipContext.get();
export const setTooltipContext = (api: TooltipApi) => tooltipContext.set(api);

export function createTooltip(getProps: () => UseTooltipProps, uid: string): TooltipApi {
	const id = getProps().id ?? uid;
	const ids = getProps().ids ?? {};

	const contentId = ids.content ?? `tooltip:${id}:content`;
	const arrowId = ids.arrow ?? `tooltip:${id}:arrow`;
	const positionerId = ids.positioner ?? `tooltip:${id}:popper`;
	const customTriggerId = ids.trigger;

	const startsOpen = Boolean(getProps().open || getProps().defaultOpen);
	let status = $state<TooltipStatus>(startsOpen ? 'open' : 'closed');
	let currentPlacement = $state<Placement>(getProps().positioning?.placement ?? 'bottom');
	let hasPointerMoveOpened = $state<string | null>(null);
	let internalTriggerValue = $state<string | null>(getProps().defaultTriggerValue ?? null);
	let contentNode = $state<HTMLElement | null>(null);
	let positionerNode = $state<HTMLElement | null>(null);
	// Written from a plain mirror so the registering effect never reads the reactive list.
	let triggerList: TriggerEntry[] = [];
	let triggers = $state<TriggerEntry[]>([]);

	let openTimer: ReturnType<typeof setTimeout> | null = null;
	let closeTimer: ReturnType<typeof setTimeout> | null = null;
	let openingTrigger: string | undefined;

	const isControlled = () => getProps().open !== undefined;
	const isOpen = () => status === 'open' || status === 'closing';
	const triggerValueOf = () =>
		getProps().triggerValue !== undefined ? getProps().triggerValue : internalTriggerValue;

	function triggerId(value?: string | null): string {
		if (customTriggerId != null) {
			return typeof customTriggerId === 'function' ? customTriggerId(value ?? undefined) : customTriggerId;
		}
		return value ? `tooltip:${id}:trigger:${value}` : `tooltip:${id}:trigger`;
	}

	function clearTimers() {
		if (openTimer !== null) {
			clearTimeout(openTimer);
			openTimer = null;
		}
		if (closeTimer !== null) {
			clearTimeout(closeTimer);
			closeTimer = null;
		}
	}

	function invokeOnOpen() {
		getProps().onOpenChange?.({ open: true });
	}

	function invokeOnClose() {
		getProps().onOpenChange?.({ open: false });
	}

	function setPointerMoveOpened(value?: string) {
		hasPointerMoveOpened = triggerId(value);
	}

	function clearPointerMoveOpened() {
		hasPointerMoveOpened = null;
	}

	function setGlobalId() {
		const prevId = store.id;
		const instant = prevId !== null && prevId !== id;
		updateStore({ id, prevId: instant ? prevId : null, instant });
	}

	function clearGlobalId() {
		if (store.id !== id) return;
		updateStore({ id: null, prevId: null, instant: false });
	}

	function nodeForValue(value: string | null): HTMLElement | null {
		return triggerList.find((entry) => entry.value === value)?.node ?? null;
	}

	function activeTriggerNode(): HTMLElement | null {
		const value = triggerValueOf();
		if (value != null) return nodeForValue(value);
		return nodeForValue(null) ?? triggerList[0]?.node ?? null;
	}

	function setTriggerValue(value: string | null) {
		if (value === triggerValueOf()) return;
		if (getProps().triggerValue === undefined) internalTriggerValue = value;
		getProps().onTriggerValueChange?.({ value, triggerElement: nodeForValue(value) });
	}

	function enter(next: TooltipStatus) {
		clearTimers();
		const wasOpen = isOpen();
		status = next;
		if (isOpen() && !wasOpen) setGlobalId();
		else if (!isOpen() && wasOpen) clearGlobalId();
		if (next === 'opening') scheduleOpenDelay();
		if (next === 'closing') scheduleCloseDelay();
	}

	function scheduleOpenDelay() {
		openTimer = setTimeout(() => {
			openTimer = null;
			setPointerMoveOpened(openingTrigger);
			invokeOnOpen();
			if (!isControlled()) enter('open');
		}, getProps().openDelay ?? 400);
	}

	function scheduleCloseDelay() {
		closeTimer = setTimeout(() => {
			closeTimer = null;
			invokeOnClose();
			if (!isControlled()) enter('closed');
		}, getProps().closeDelay ?? 150);
	}

	function positionAgainst(options: Partial<PositionOptions> = {}, listeners = true) {
		const positioner = positionerNode;
		const anchor = activeTriggerNode();
		if (!positioner || !anchor) return () => {};
		return getPlacement(anchor, positioner, {
			...getProps().positioning,
			...options,
			listeners,
			onComplete(result) {
				currentPlacement = result.placement;
			}
		});
	}

	function reposition(options: Partial<PositionOptions> = {}) {
		positionAgainst(options, false)();
	}

	function repositionImmediate() {
		positionAgainst()();
	}

	function close() {
		if (!isControlled()) {
			enter('closed');
			invokeOnClose();
			return;
		}
		invokeOnClose();
	}

	function send(event: TooltipEvent) {
		if (event.type === 'triggerValue.set') {
			if (event.value !== null) setTriggerValue(event.value);
			if (status !== 'open' && status !== 'closing') return;
			repositionImmediate();
			if (status === 'closing') enter('open');
			return;
		}

		if (status === 'closed') {
			switch (event.type) {
				case 'open':
					if (event.value !== undefined) setTriggerValue(event.value);
					invokeOnOpen();
					if (!isControlled()) enter('open');
					return;
				case 'pointer.leave':
					clearPointerMoveOpened();
					return;
				case 'pointer.move': {
					if (hasPointerMoveOpened) return;
					if (store.id === null) {
						if (event.value !== undefined) setTriggerValue(event.value);
						openingTrigger = event.value;
						enter('opening');
						return;
					}
					setPointerMoveOpened(event.value);
					invokeOnOpen();
					if (event.value !== undefined) setTriggerValue(event.value);
					if (!isControlled()) enter('open');
					return;
				}
				default:
					return;
			}
		}

		if (status === 'opening') {
			switch (event.type) {
				case 'open':
					if (event.value !== undefined) setTriggerValue(event.value);
					invokeOnOpen();
					if (!isControlled()) enter('open');
					return;
				case 'close':
					close();
					return;
				case 'pointer.leave':
					clearPointerMoveOpened();
					if (getProps().disabled) return;
					invokeOnClose();
					if (!isControlled()) enter('closed');
					return;
				default:
					return;
			}
		}

		if (status === 'open') {
			switch (event.type) {
				case 'close':
					close();
					return;
				case 'pointer.leave':
					clearPointerMoveOpened();
					if (getProps().disabled) return;
					if (store.id === id) {
						enter('closing');
						return;
					}
					close();
					return;
				case 'content.pointer.leave':
					if (!getProps().interactive) return;
					enter('closing');
					return;
				default:
					return;
			}
		}

		switch (event.type) {
			case 'close':
				close();
				return;
			case 'content.pointer.move':
				if (!getProps().interactive) return;
				enter('open');
				return;
			case 'pointer.move':
			case 'pointer.leave':
				return;
			default:
				return;
		}
	}

	if (startsOpen) setGlobalId();

	const presence = createPresence({
		present: () => isOpen(),
		getNode: () => contentNode,
		lazyMount: () => getProps().lazyMount ?? true,
		unmountOnExit: () => getProps().unmountOnExit ?? true,
		onExitComplete: () => getProps().onExitComplete?.()
	});

	$effect(() => {
		const controlled = getProps().open;
		if (controlled === undefined) return;
		if (controlled && status !== 'open') enter('open');
		else if (!controlled && status !== 'closed') enter('closed');
	});

	// Reads the registry so a late-mounting trigger re-runs positioning.
	$effect(() => {
		void triggers.length;
		if (!isOpen()) return;
		const positioner = positionerNode;
		if (!positioner || !activeTriggerNode()) return;
		return positionAgainst();
	});

	$effect(() => {
		const listener = () => {
			if (store.id !== null && store.id !== id) send({ type: 'close' });
		};
		storeListeners.add(listener);
		return () => {
			storeListeners.delete(listener);
		};
	});

	$effect(() => {
		if (!isOpen() || getProps().closeOnScroll === false) return;
		const doc = (activeTriggerNode() ?? contentNode)?.ownerDocument;
		if (!doc) return;
		const onScroll = () => send({ type: 'close' });
		const onPointerLock = () => send({ type: 'close' });
		doc.addEventListener('scroll', onScroll, { capture: true, passive: true });
		doc.addEventListener('pointerlockchange', onPointerLock);
		return () => {
			doc.removeEventListener('scroll', onScroll, { capture: true });
			doc.removeEventListener('pointerlockchange', onPointerLock);
		};
	});

	useEscapeLayer({
		enabled: () => isOpen() && getProps().closeOnEscape !== false,
		onEscape() {
			send({ type: 'close' });
		}
	});

	return {
		id,
		contentId,
		arrowId,
		positionerId,
		get open() {
			return isOpen();
		},
		get present() {
			return presence.present;
		},
		get hidden() {
			return !presence.present || (!isOpen() && !presence.unmountOnExit);
		},
		get dataState() {
			return presence.dataState;
		},
		get instant() {
			const isCurrentTooltip = store.id === id;
			const isPrevTooltip = store.prevId === id;
			return store.instant && ((isOpen() && isCurrentTooltip) || isPrevTooltip);
		},
		get interactive() {
			return Boolean(getProps().interactive);
		},
		get disabled() {
			return Boolean(getProps().disabled);
		},
		get portalled() {
			return getProps().portalled !== false;
		},
		get portalTarget() {
			const ref = getProps().portalRef;
			return (typeof ref === 'function' ? ref() : ref) ?? undefined;
		},
		get dir() {
			return getProps().dir;
		},
		get triggerValue(): string | null {
			return triggerValueOf() ?? null;
		},
		get placement() {
			return currentPlacement;
		},
		get side() {
			return getSide(currentPlacement);
		},
		get ariaLabel() {
			return getProps()['aria-label'];
		},
		get positionerStyle() {
			const positioning = getProps().positioning;
			return floatingStyle({
				placement: currentPlacement,
				strategy: positioning?.strategy,
				sameWidth: positioning?.sameWidth,
				fitViewport: positioning?.fitViewport,
				applyStyles: positioning?.applyStyles
			});
		},
		get arrowTipStyle() {
			return arrowTipStyle(currentPlacement);
		},
		triggerId,
		setOpen(open) {
			if (open) {
				invokeOnOpen();
				if (!isControlled()) enter('open');
				return;
			}
			close();
		},
		setTriggerValue,
		reposition,
		setContentNode(node) {
			contentNode = node;
		},
		setPositionerNode(node) {
			positionerNode = node;
		},
		activeTriggerNode,
		registerTrigger(value, node) {
			triggerList = [...triggerList, { value, node }];
			triggers = [...triggerList];
			return () => {
				triggerList = triggerList.filter((entry) => entry.node !== node);
				triggers = [...triggerList];
			};
		},
		handleTriggerClick(value) {
			if (getProps().disabled) return;
			const closeOnClick = getProps().closeOnClick ?? true;
			if (!closeOnClick) return;
			const current = value == null ? false : triggerValueOf() === value;
			if (isOpen() && value != null && !current) {
				send({ type: 'triggerValue.set', value });
				return;
			}
			send({ type: 'close' });
		},
		handleTriggerFocus(value) {
			if (getProps().disabled) return;
			if (!isFocusVisible()) return;
			const current = value == null ? false : triggerValueOf() === value;
			if (isOpen() && value != null && !current) {
				send({ type: 'triggerValue.set', value });
				return;
			}
			send({ type: 'open', value });
		},
		handleTriggerBlur(relatedTarget) {
			if (getProps().disabled) return;
			if (store.id !== id) return;
			const target = relatedTarget as HTMLElement | null;
			if (target?.closest(`[data-ownedby="${id}"]`)) return;
			send({ type: 'close' });
		},
		handleTriggerPointerDown() {
			if (getProps().disabled) return;
			const closeOnClick = getProps().closeOnClick ?? true;
			const closeOnPointerDown = getProps().closeOnPointerDown ?? closeOnClick;
			if (!closeOnPointerDown) return;
			if (store.id !== id) return;
			send({ type: 'close' });
		},
		handleTriggerPointerMove(value) {
			if (getProps().disabled) return;
			const current = value == null ? false : triggerValueOf() === value;
			if (isOpen() && value != null && !current) {
				send({ type: 'triggerValue.set', value });
				return;
			}
			send({ type: 'pointer.move', value });
		},
		handleTriggerPointerLeave() {
			send({ type: 'pointer.leave' });
		},
		handleContentPointerEnter() {
			send({ type: 'content.pointer.move' });
		},
		handleContentPointerLeave() {
			send({ type: 'content.pointer.leave' });
		}
	};
}
