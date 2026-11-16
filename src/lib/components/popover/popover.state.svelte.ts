import { createContext } from '../../internal/context';
import {
	useAriaHidden,
	useDismissableLayer,
	useEscapeLayer,
	useFocusScope,
	useScrollLock,
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

export interface PopoverOpenChangeDetails {
	open: boolean;
}

export interface PopoverTriggerValueChangeDetails {
	value: string | null;
	triggerElement: HTMLElement | null;
}

export interface PopoverIntlTranslations {
	closeTriggerLabel?: string;
}

export interface PopoverElementIds {
	anchor?: string;
	trigger?: string | ((value?: string) => string);
	content?: string;
	title?: string;
	description?: string;
	closeTrigger?: string;
	positioner?: string;
	arrow?: string;
}

export type PopoverPortalRef = HTMLElement | (() => HTMLElement | null | undefined);

export type PopoverFocusOutsideEvent = InteractOutsideEvent;
export type PopoverInteractOutsideEvent = InteractOutsideEvent;
export type PopoverPointerDownOutsideEvent = InteractOutsideEvent;

export interface UsePopoverProps {
	id?: string | null;
	ids?: PopoverElementIds;
	translations?: PopoverIntlTranslations;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (details: PopoverOpenChangeDetails) => void;
	triggerValue?: string | null;
	defaultTriggerValue?: string | null;
	onTriggerValueChange?: (details: PopoverTriggerValueChangeDetails) => void;
	modal?: boolean;
	portalled?: boolean;
	portalRef?: PopoverPortalRef;
	autoFocus?: boolean;
	initialFocusEl?: () => HTMLElement | null | false;
	finalFocusEl?: () => HTMLElement | null;
	restoreFocus?: boolean;
	closeOnInteractOutside?: boolean;
	closeOnEscape?: boolean;
	positioning?: PositionOptions;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	onExitComplete?: () => void;
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	onPointerDownOutside?: (event: PopoverPointerDownOutsideEvent) => void;
	onFocusOutside?: (event: PopoverFocusOutsideEvent) => void;
	onInteractOutside?: (event: PopoverInteractOutsideEvent) => void;
}

export interface PopoverApi {
	readonly id: string;
	readonly open: boolean;
	readonly present: boolean;
	readonly hidden: boolean;
	readonly dataState: 'open' | 'closed';
	readonly portalled: boolean;
	readonly portalTarget: Element | null | undefined;
	readonly modal: boolean;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly triggerValue: string | null;
	readonly placement: Placement;
	readonly side: Side;
	readonly anchorId: string;
	readonly contentId: string;
	readonly positionerId: string;
	readonly arrowId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly closeTriggerId: string;
	readonly hasTitle: boolean;
	readonly hasDescription: boolean;
	readonly closeTriggerLabel: string;
	readonly positionerStyle: string;
	readonly arrowTipStyle: string;
	triggerId(value?: string | null): string;
	activeTriggerNode(): HTMLElement | null;
	setOpen(open: boolean): void;
	setTriggerValue(value: string | null): void;
	toggleTrigger(value?: string | null): void;
	reposition(options?: Partial<PositionOptions>): void;
	setContentNode(node: HTMLElement | null): void;
	setPositionerNode(node: HTMLElement | null): void;
	setAnchorNode(node: HTMLElement | null): void;
	setTitleNode(node: HTMLElement | null): void;
	setDescriptionNode(node: HTMLElement | null): void;
	registerTrigger(value: string | null, node: HTMLElement): () => void;
}

interface TriggerEntry {
	value: string | null;
	node: HTMLElement;
}

const popoverContext = createContext<PopoverApi>('Popover', 'Popover.Root');

export const usePopoverContext = () => popoverContext.get();
export const setPopoverContext = (api: PopoverApi) => popoverContext.set(api);

export function createPopover(getProps: () => UsePopoverProps, uid: string): PopoverApi {
	const id = getProps().id ?? uid;
	const ids = getProps().ids ?? {};

	const anchorId = ids.anchor ?? `popover:${id}:anchor`;
	const contentId = ids.content ?? `popover:${id}:content`;
	const positionerId = ids.positioner ?? `popover:${id}:popper`;
	const arrowId = ids.arrow ?? `popover:${id}:arrow`;
	const titleId = ids.title ?? `popover:${id}:title`;
	const descriptionId = ids.description ?? `popover:${id}:desc`;
	const closeTriggerId = ids.closeTrigger ?? `popover:${id}:close`;
	const customTriggerId = ids.trigger;

	let internalOpen = $state(Boolean(getProps().defaultOpen));
	let internalTriggerValue = $state<string | null>(getProps().defaultTriggerValue ?? null);
	let currentPlacement = $state<Placement>(getProps().positioning?.placement ?? 'bottom');
	let contentNode = $state<HTMLElement | null>(null);
	let positionerNode = $state<HTMLElement | null>(null);
	let anchorNode = $state<HTMLElement | null>(null);
	let titleNode = $state<HTMLElement | null>(null);
	let descriptionNode = $state<HTMLElement | null>(null);
	// Written from a plain mirror so the registering effect never reads the reactive list.
	let triggerList: TriggerEntry[] = [];
	let triggers = $state<TriggerEntry[]>([]);

	const isControlled = () => getProps().open !== undefined;
	const isOpen = () => (isControlled() ? Boolean(getProps().open) : internalOpen);
	const triggerValueOf = () =>
		getProps().triggerValue !== undefined ? getProps().triggerValue : internalTriggerValue;

	function triggerId(value?: string | null): string {
		if (customTriggerId != null) {
			return typeof customTriggerId === 'function' ? customTriggerId(value ?? undefined) : customTriggerId;
		}
		return value ? `popover:${id}:trigger:${value}` : `popover:${id}:trigger`;
	}

	function nodeForValue(value: string | null): HTMLElement | null {
		return triggerList.find((entry) => entry.value === value)?.node ?? null;
	}

	function triggerNodes(): HTMLElement[] {
		return triggerList.map((entry) => entry.node);
	}

	function activeTriggerNode(): HTMLElement | null {
		const value = triggerValueOf();
		if (value != null) return nodeForValue(value);
		return nodeForValue(null) ?? triggerList[0]?.node ?? null;
	}

	function setOpen(open: boolean) {
		if (open === isOpen()) return;
		if (!isControlled()) internalOpen = open;
		getProps().onOpenChange?.({ open });
	}

	function setTriggerValue(value: string | null) {
		if (value === triggerValueOf()) return;
		if (getProps().triggerValue === undefined) internalTriggerValue = value;
		getProps().onTriggerValueChange?.({ value, triggerElement: nodeForValue(value) });
	}

	function toggleTrigger(value?: string | null) {
		const current = value == null ? false : triggerValueOf() === value;
		if (isOpen() && value != null && !current) {
			setTriggerValue(value);
			return;
		}
		if (value != null && !current) setTriggerValue(value);
		setOpen(!isOpen());
	}

	function positionAgainst(options: Partial<PositionOptions> = {}, listeners = true) {
		const positioner = positionerNode;
		const anchor = anchorNode ?? activeTriggerNode();
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

	const presence = createPresence({
		present: () => isOpen(),
		getNode: () => contentNode,
		lazyMount: () => getProps().lazyMount ?? true,
		unmountOnExit: () => getProps().unmountOnExit ?? true,
		onExitComplete: () => getProps().onExitComplete?.()
	});

	// Reads the registry so a late-mounting trigger re-runs positioning.
	$effect(() => {
		void triggers.length;
		if (!isOpen()) return;
		const positioner = positionerNode;
		const anchor = anchorNode ?? activeTriggerNode();
		if (!positioner || !anchor) return;
		return positionAgainst({}, true);
	});

	useEscapeLayer({
		enabled: () => isOpen(),
		onEscape(event) {
			getProps().onEscapeKeyDown?.(event);
			if (event.defaultPrevented) return;
			if (getProps().closeOnEscape === false) return;
			setOpen(false);
		}
	});

	useDismissableLayer({
		enabled: () => isOpen(),
		getNode: () => contentNode,
		getExclude: () => [anchorNode, ...triggerNodes()],
		onPointerDownOutside: (event) => getProps().onPointerDownOutside?.(event),
		onFocusOutside: (event) => getProps().onFocusOutside?.(event),
		onInteractOutside(event) {
			getProps().onInteractOutside?.(event);
			if (event.defaultPrevented) return;
			if (getProps().closeOnInteractOutside === false) return;
			setOpen(false);
		}
	});

	useScrollLock(() => isOpen() && Boolean(getProps().modal));
	useAriaHidden(
		() => isOpen() && Boolean(getProps().modal),
		() => contentNode
	);

	useFocusScope({
		enabled: () => isOpen() && Boolean(getProps().modal),
		getNode: () => contentNode,
		getInitialFocus: () => {
			const content = contentNode;
			if (!content) return null;
			return initialFocusFor(content) ?? content;
		}
	});

	function initialFocusFor(root: HTMLElement): HTMLElement | null {
		if (getProps().autoFocus === false) return null;
		const custom = getProps().initialFocusEl?.();
		if (custom === false) return null;
		if (custom) return custom;
		// Zag focuses the content element itself, which carries tabindex="-1"; the first control is
		// only reached by tabbing.
		return root;
	}

	$effect(() => {
		if (!isOpen() || getProps().modal) return;
		const content = contentNode;
		if (!content) return;
		const element = initialFocusFor(content);
		if (!element) return;
		const frame = requestAnimationFrame(() => {
			if (element.isConnected) element.focus({ preventScroll: true });
		});
		return () => cancelAnimationFrame(frame);
	});

	let lastOpen = $state(isOpen());
	$effect(() => {
		const open = isOpen();
		if (open === lastOpen) return;
		lastOpen = open;
		if (open) return;
		if (getProps().restoreFocus === false) return;
		const target = getProps().finalFocusEl?.() ?? activeTriggerNode();
		requestAnimationFrame(() => {
			if (target?.isConnected) target.focus({ preventScroll: true });
		});
	});

	return {
		id,
		anchorId,
		contentId,
		positionerId,
		arrowId,
		titleId,
		descriptionId,
		closeTriggerId,
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
		get portalled() {
			return Boolean(getProps().modal) || getProps().portalled !== false;
		},
		get portalTarget() {
			const ref = getProps().portalRef;
			return (typeof ref === 'function' ? ref() : ref) ?? undefined;
		},
		get modal() {
			return Boolean(getProps().modal);
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
		get hasTitle() {
			return titleNode !== null;
		},
		get hasDescription() {
			return descriptionNode !== null;
		},
		get closeTriggerLabel() {
			return getProps().translations?.closeTriggerLabel ?? 'close';
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
		setOpen,
		setTriggerValue,
		toggleTrigger,
		reposition,
		setContentNode(node) {
			contentNode = node;
		},
		setPositionerNode(node) {
			positionerNode = node;
		},
		setAnchorNode(node) {
			anchorNode = node;
		},
		setTitleNode(node) {
			titleNode = node;
		},
		setDescriptionNode(node) {
			descriptionNode = node;
		},
		registerTrigger(value, node) {
			triggerList = [...triggerList, { value, node }];
			triggers = [...triggerList];
			return () => {
				triggerList = triggerList.filter((entry) => entry.node !== node);
				triggers = [...triggerList];
			};
		}
	};
}
