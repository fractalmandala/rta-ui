import { createContext } from '../../internal/context';
import {
	useDismissableLayer,
	type InteractOutsideEvent
} from '../../internal/layers.svelte.js';
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

export interface HoverCardOpenChangeDetails {
	open: boolean;
}

export interface HoverCardTriggerValueChangeDetails {
	value: string | null;
	triggerElement: HTMLElement | null;
}

export interface HoverCardElementIds {
	trigger?: string | ((value?: string) => string);
	content?: string;
	positioner?: string;
	arrow?: string;
}

export type HoverCardPortalRef = HTMLElement | (() => HTMLElement | null | undefined);

export type HoverCardFocusOutsideEvent = InteractOutsideEvent;
export type HoverCardInteractOutsideEvent = InteractOutsideEvent;
export type HoverCardPointerDownOutsideEvent = InteractOutsideEvent;

export interface UseHoverCardProps {
	id?: string | null;
	ids?: HoverCardElementIds;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (details: HoverCardOpenChangeDetails) => void;
	openDelay?: number;
	closeDelay?: number;
	disabled?: boolean;
	portalled?: boolean;
	portalRef?: HoverCardPortalRef;
	triggerValue?: string | null;
	defaultTriggerValue?: string | null;
	onTriggerValueChange?: (details: HoverCardTriggerValueChangeDetails) => void;
	positioning?: PositionOptions;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	onExitComplete?: () => void;
	onPointerDownOutside?: (event: HoverCardPointerDownOutsideEvent) => void;
	onFocusOutside?: (event: HoverCardFocusOutsideEvent) => void;
	onInteractOutside?: (event: HoverCardInteractOutsideEvent) => void;
}

export interface HoverCardApi {
	readonly id: string;
	readonly open: boolean;
	readonly present: boolean;
	readonly hidden: boolean;
	readonly dataState: 'open' | 'closed';
	readonly disabled: boolean;
	readonly portalled: boolean;
	readonly portalTarget: Element | null | undefined;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly triggerValue: string | null;
	readonly placement: Placement;
	readonly side: Side;
	readonly contentId: string;
	readonly positionerId: string;
	readonly arrowId: string;
	readonly positionerStyle: string;
	readonly arrowTipStyle: string;
	triggerId(value?: string | null): string;
	activeTriggerNode(): HTMLElement | null;
	setOpen(open: boolean): void;
	setTriggerValue(value: string | null): void;
	reposition(options?: Partial<PositionOptions>): void;
	setContentNode(node: HTMLElement | null): void;
	setPositionerNode(node: HTMLElement | null): void;
	registerTrigger(value: string | null, node: HTMLElement): () => void;
	handleTriggerPointerEnter(value?: string): void;
	handleTriggerPointerLeave(): void;
	handleTriggerFocus(value?: string): void;
	handleTriggerBlur(): void;
	handleContentPointerEnter(): void;
	handleContentPointerLeave(): void;
}

type HoverCardStatus = 'closed' | 'opening' | 'open' | 'closing';

interface TriggerEntry {
	value: string | null;
	node: HTMLElement;
}

const hoverCardContext = createContext<HoverCardApi>('HoverCard', 'HoverCard.Root');

export const useHoverCardContext = () => hoverCardContext.get();
export const setHoverCardContext = (api: HoverCardApi) => hoverCardContext.set(api);

export function createHoverCard(getProps: () => UseHoverCardProps, uid: string): HoverCardApi {
	const id = getProps().id ?? uid;
	const ids = getProps().ids ?? {};

	const contentId = ids.content ?? `hover-card:${id}:content`;
	const positionerId = ids.positioner ?? `hover-card:${id}:popper`;
	const arrowId = ids.arrow ?? `hover-card:${id}:arrow`;
	const customTriggerId = ids.trigger;

	let status = $state<HoverCardStatus>(
		getProps().open || getProps().defaultOpen ? 'open' : 'closed'
	);
	let currentPlacement = $state<Placement>(getProps().positioning?.placement ?? 'bottom');
	let isPointer = $state(false);
	let internalTriggerValue = $state<string | null>(getProps().defaultTriggerValue ?? null);
	let contentNode = $state<HTMLElement | null>(null);
	let positionerNode = $state<HTMLElement | null>(null);
	// Written from a plain mirror so the registering effect never reads the reactive list.
	let triggerList: TriggerEntry[] = [];
	let triggers = $state<TriggerEntry[]>([]);

	let openTimer: ReturnType<typeof setTimeout> | null = null;
	let closeTimer: ReturnType<typeof setTimeout> | null = null;

	const isControlled = () => getProps().open !== undefined;
	const isOpen = () => status === 'open' || status === 'closing';
	const triggerValueOf = () =>
		getProps().triggerValue !== undefined ? getProps().triggerValue : internalTriggerValue;

	function triggerId(value?: string | null): string {
		if (customTriggerId != null) {
			return typeof customTriggerId === 'function' ? customTriggerId(value ?? undefined) : customTriggerId;
		}
		return value ? `hover-card:${id}:trigger:${value}` : `hover-card:${id}:trigger`;
	}

	function nodeForValue(value: string | null): HTMLElement | null {
		return triggerList.find((entry) => entry.value === value)?.node ?? null;
	}

	function activeTriggerNode(): HTMLElement | null {
		const value = triggerValueOf();
		if (value != null) return nodeForValue(value);
		return nodeForValue(null) ?? triggerList[0]?.node ?? null;
	}

	function triggerNodes(): HTMLElement[] {
		return triggerList.map((entry) => entry.node);
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

	function setTriggerValue(value: string | null) {
		if (value === triggerValueOf()) return;
		if (getProps().triggerValue === undefined) internalTriggerValue = value;
		getProps().onTriggerValueChange?.({ value, triggerElement: nodeForValue(value) });
	}

	function enter(next: HoverCardStatus) {
		clearTimers();
		status = next;
		if (next === 'closed') isPointer = false;
		if (next === 'opening') scheduleOpenDelay();
		if (next === 'closing') scheduleCloseDelay();
	}

	function scheduleOpenDelay() {
		openTimer = setTimeout(() => {
			openTimer = null;
			invokeOnOpen();
			if (!isControlled()) enter('open');
		}, getProps().openDelay ?? 600);
	}

	function scheduleCloseDelay() {
		closeTimer = setTimeout(() => {
			closeTimer = null;
			invokeOnClose();
			if (!isControlled()) enter('closed');
		}, getProps().closeDelay ?? 300);
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

	function close() {
		if (isControlled()) {
			invokeOnClose();
			return;
		}
		enter('closed');
		invokeOnClose();
	}

	function startOpening(value?: string) {
		if (value !== undefined) setTriggerValue(value);
		enter('opening');
	}

	function pointerEnter(value?: string) {
		if (getProps().disabled) return;
		const current = value == null ? false : triggerValueOf() === value;
		if (isOpen() && value != null && !current) {
			setTriggerValue(value);
			reposition();
			return;
		}
		if (status !== 'closed') {
			isPointer = true;
			if (status === 'closing') enter('open');
			return;
		}
		isPointer = true;
		startOpening(value);
	}

	function pointerLeave() {
		if (getProps().disabled) return;
		if (status === 'opening') {
			invokeOnClose();
			if (!isControlled()) enter('closed');
			return;
		}
		if (status === 'open') {
			enter('closing');
		}
	}

	function focusTrigger(value?: string) {
		if (getProps().disabled) return;
		const current = value == null ? false : triggerValueOf() === value;
		if (isOpen() && value != null && !current) {
			setTriggerValue(value);
			reposition();
			return;
		}
		if (status === 'opening' || status === 'open') return;
		if (status === 'closing') {
			if (value !== undefined) setTriggerValue(value);
			enter('open');
			return;
		}
		startOpening(value);
	}

	function blurTrigger() {
		if (getProps().disabled) return;
		if (isPointer) return;
		invokeOnClose();
		if (!isControlled()) enter('closed');
	}

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

	useDismissableLayer({
		enabled: () => isOpen(),
		getNode: () => contentNode,
		getExclude: () => triggerNodes(),
		onPointerDownOutside: (event) => getProps().onPointerDownOutside?.(event),
		onFocusOutside: (event) => {
			event.preventDefault();
			getProps().onFocusOutside?.(event);
		},
		onInteractOutside(event) {
			getProps().onInteractOutside?.(event);
			if (event.defaultPrevented) return;
			close();
		}
	});

	return {
		id,
		contentId,
		positionerId,
		arrowId,
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
		activeTriggerNode,
		setOpen(next) {
			if (getProps().disabled) return;
			if (next) {
				if (isOpen()) return;
				startOpening();
				return;
			}
			if (!isOpen()) return;
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
		registerTrigger(value, node) {
			triggerList = [...triggerList, { value, node }];
			triggers = [...triggerList];
			return () => {
				triggerList = triggerList.filter((entry) => entry.node !== node);
				triggers = [...triggerList];
			};
		},
		handleTriggerPointerEnter(value) {
			pointerEnter(value);
		},
		handleTriggerPointerLeave() {
			pointerLeave();
		},
		handleTriggerFocus(value) {
			focusTrigger(value);
		},
		handleTriggerBlur() {
			blurTrigger();
		},
		handleContentPointerEnter() {
			if (getProps().disabled) return;
			if (status === 'closing') {
				isPointer = true;
				enter('open');
				return;
			}
			isPointer = true;
		},
		handleContentPointerLeave() {
			if (getProps().disabled) return;
			if (status === 'open') enter('closing');
		}
	};
}
