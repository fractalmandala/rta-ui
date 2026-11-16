import { untrack } from 'svelte';
import { createContext } from '../../internal/context';
import { dataAttr, toPx } from '../../internal/dom';
import {
	useAriaHidden,
	useDismissableLayer,
	useEscapeLayer,
	useFocusScope,
	useScrollLock,
	type InteractOutsideEvent
} from '../../internal/layers.svelte';
import { createPresence } from '../../internal/presence.svelte';
import {
	DrawerSwipeSession,
	dedupeSnapPoints,
	findClosestSnapPoint,
	getSwipeDirectionSize,
	hasOpeningSwipeIntent,
	isNegativeSwipeDirection,
	isTextSelectedIn,
	isVerticalSwipeDirection,
	oppositeSwipeDirection,
	resolveSnapPoint,
	resolveSwipeDirection,
	resolveSwipeProgress,
	shouldIgnoreDragPointerDown,
	type DrawerPoint,
	type DrawerResolvedSnapPoint,
	type DrawerSnapPoint,
	type DrawerSwipeDirection
} from './drawer.session';
import type { DrawerStack } from './drawer.stack.svelte';

export type {
	DrawerSnapPoint,
	DrawerSwipeDirection,
	DrawerResolvedSnapPoint,
	DrawerPhysicalSwipeDirection
} from './drawer.session';

export interface DrawerOpenChangeDetails {
	open: boolean;
}

export interface DrawerSnapPointChangeDetails {
	snapPoint: DrawerSnapPoint | null;
}

export interface DrawerTriggerValueChangeDetails {
	value: string | null;
	triggerElement: HTMLElement | null;
}

export type DrawerFocusOutsideEvent = InteractOutsideEvent;
export type DrawerInteractOutsideEvent = InteractOutsideEvent;
export type DrawerPointerDownOutsideEvent = InteractOutsideEvent;

export type DrawerRole = 'dialog' | 'alertdialog';
export type DrawerPortalTarget = Element | (() => Element | null | undefined) | null;

export interface DrawerElementIds {
	backdrop?: string;
	positioner?: string;
	content?: string;
	title?: string;
	description?: string;
	header?: string;
	trigger?: string | ((value?: string) => string);
	grabber?: string;
	grabberIndicator?: string;
	closeTrigger?: string;
	swipeArea?: string;
}

export interface UseDrawerProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (details: DrawerOpenChangeDetails) => void;
	triggerValue?: string | null;
	defaultTriggerValue?: string | null;
	onTriggerValueChange?: (details: DrawerTriggerValueChangeDetails) => void;
	snapPoints?: DrawerSnapPoint[];
	snapPoint?: DrawerSnapPoint | null;
	defaultSnapPoint?: DrawerSnapPoint | null;
	onSnapPointChange?: (details: DrawerSnapPointChangeDetails) => void;
	snapToSequentialPoints?: boolean;
	swipeDirection?: DrawerSwipeDirection;
	swipeVelocityThreshold?: number;
	closeThreshold?: number;
	preventDragOnScroll?: boolean;
	modal?: boolean;
	role?: DrawerRole;
	trapFocus?: boolean;
	preventScroll?: boolean;
	restoreFocus?: boolean;
	closeOnEscape?: boolean;
	closeOnInteractOutside?: boolean;
	initialFocusEl?: () => Element | null | undefined | false;
	finalFocusEl?: () => Element | null | undefined;
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	onFocusOutside?: (event: DrawerFocusOutsideEvent) => void;
	onInteractOutside?: (event: DrawerInteractOutsideEvent) => void;
	onPointerDownOutside?: (event: DrawerPointerDownOutsideEvent) => void;
	persistentElements?: (() => Element | null | undefined)[];
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: DrawerElementIds;
	stack?: DrawerStack;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	onExitComplete?: () => void;
	portalled?: boolean;
	portalRef?: DrawerPortalTarget;
}

export interface DrawerApi {
	readonly open: boolean;
	readonly modal: boolean;
	readonly dragging: boolean;
	readonly state: 'open' | 'closed';
	readonly present: boolean;
	readonly unmounted: boolean;
	readonly triggerValue: string | null;
	readonly snapPoint: DrawerSnapPoint | null;
	readonly snapPoints: DrawerSnapPoint[];
	readonly resolvedSnapPoints: DrawerResolvedSnapPoint[];
	readonly resolvedActiveSnapPoint: DrawerResolvedSnapPoint | null;
	readonly nextSnapPoint: DrawerSnapPoint | null;
	readonly swipeDirection: DrawerSwipeDirection;
	readonly swipeProgress: number;
	readonly contentId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly backdropId: string;
	readonly positionerId: string;
	readonly closeTriggerId: string;
	readonly grabberId: string;
	readonly grabberIndicatorId: string;
	readonly swipeAreaId: string;
	setOpen(open: boolean): void;
	setSnapPoint(snapPoint: DrawerSnapPoint | null): void;
	setTriggerValue(value: string | null): void;
	getOpenPercentage(): number;
	getSnapPointIndex(): number;
	getContentSize(): number | null;
	triggerIdFor(value?: string): string;
	triggerAttrs(options?: { value?: string }): Record<string, unknown>;
	backdropAttrs(): Record<string, unknown>;
	positionerAttrs(): Record<string, unknown>;
	contentAttrs(options?: { draggable?: boolean }): Record<string, unknown>;
	titleAttrs(): Record<string, unknown>;
	descriptionAttrs(): Record<string, unknown>;
	closeTriggerAttrs(): Record<string, unknown>;
	grabberAttrs(): Record<string, unknown>;
	grabberIndicatorAttrs(): Record<string, unknown>;
	swipeAreaAttrs(options?: {
		disabled?: boolean;
		swipeDirection?: DrawerSwipeDirection;
	}): Record<string, unknown>;
	registerContent(node: Element | null): void;
	registerCloseTrigger(node: Element | null): void;
	registerTrigger(node: Element | null, value?: string): void;
	markRendered(part: 'title' | 'description', rendered: boolean): void;
}

const drawerContext = createContext<DrawerApi>('Drawer', 'Drawer.Root');

export const useDrawerContext = () => drawerContext.get();
export const setDrawerContext = (api: DrawerApi) => drawerContext.set(api);

const asHTMLElement = (node: Element | null): HTMLElement | null =>
	node instanceof HTMLElement ? node : null;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const MIN_PENDING_DRAG_PX = 6;
const PENDING_DRAG_RATIO = 1.35;

export function createDrawer(getProps: () => UseDrawerProps, uid: string): DrawerApi {
	const drawerId = () => getProps().id ?? uid;

	const triggerIdFor = (value?: string) => {
		const custom = getProps().ids?.trigger;
		if (custom != null) return typeof custom === 'function' ? custom(value) : custom;
		return value ? `drawer:${drawerId()}:trigger:${value}` : `drawer:${drawerId()}:trigger`;
	};

	const contentId = () => getProps().ids?.content ?? `drawer:${drawerId()}:content`;
	const positionerId = () => getProps().ids?.positioner ?? `drawer:${drawerId()}:positioner`;
	const backdropId = () => getProps().ids?.backdrop ?? `drawer:${drawerId()}:backdrop`;
	const titleId = () => getProps().ids?.title ?? `drawer:${drawerId()}:title`;
	const descriptionId = () => getProps().ids?.description ?? `drawer:${drawerId()}:description`;
	const closeTriggerId = () => getProps().ids?.closeTrigger ?? `drawer:${drawerId()}:close-trigger`;
	const grabberId = () => getProps().ids?.grabber ?? `drawer:${drawerId()}:grabber`;
	const grabberIndicatorId = () =>
		getProps().ids?.grabberIndicator ?? `drawer:${drawerId()}:grabber-indicator`;
	const swipeAreaId = () => getProps().ids?.swipeArea ?? `drawer:${drawerId()}:swipe-area`;

	let internalOpen = $state(Boolean(getProps().defaultOpen));
	let internalTriggerValue = $state<string | null>(getProps().defaultTriggerValue ?? null);
	let internalSnapPoint = $state<DrawerSnapPoint | null>(
		getProps().defaultSnapPoint ?? getProps().snapPoints?.[0] ?? 1
	);

	const isControlled = () => getProps().open !== undefined;
	const open = () => (isControlled() ? Boolean(getProps().open) : internalOpen);
	const modal = () => getProps().modal ?? true;
	const role = () => getProps().role ?? 'dialog';
	const trapFocus = () => getProps().trapFocus ?? modal();
	const preventScroll = () => getProps().preventScroll ?? modal();
	const closeOnEscape = () => getProps().closeOnEscape ?? true;
	const lazy = () => getProps().lazyMount ?? true;
	const keepAfterExit = () => getProps().unmountOnExit ?? true;
	const closeOnInteractOutside = () => getProps().closeOnInteractOutside ?? true;
	const snapPoints = () => getProps().snapPoints ?? [1];
	const sequential = () => getProps().snapToSequentialPoints ?? false;

	const snapPoint = () =>
		getProps().snapPoint !== undefined ? (getProps().snapPoint ?? null) : internalSnapPoint;
	const triggerValue = () =>
		getProps().triggerValue !== undefined
			? (getProps().triggerValue ?? null)
			: internalTriggerValue;

	const swipeDirection = () => getProps().swipeDirection ?? 'down';
	const physicalSwipeDirection = () =>
		resolveSwipeDirection(swipeDirection(), getProps().dir);

	let contentNode = $state<HTMLElement | null>(null);
	let closeTriggerNode = $state<HTMLElement | null>(null);
	let rendered = $state({ title: false, description: false });
	let mountedOnce = $state(false);
	let dragOffset = $state<number | null>(null);
	let swipeOpen = $state(false);
	const swipingOpen = () => swipeOpen;
	let swipeStrength = $state(1);
	let contentSize = $state<number | null>(null);
	let viewportSize = $state(0);
	let rootFontSize = $state(16);
	const triggerNodes = new Map<string | undefined, HTMLElement>();
	const session = new DrawerSwipeSession();

	const dragging = () => dragOffset !== null;
	const active = () => open() || swipingOpen();

	const presence = createPresence({
		present: () => active(),
		getNode: () => contentNode,
		lazyMount: () => true,
		unmountOnExit: () => true,
		onExitComplete: () => getProps().onExitComplete?.()
	});

	const closing = () => !active() && presence.present;
	const unmounted = () =>
		!active() && !presence.present ? (!mountedOnce ? lazy() : keepAfterExit()) : false;

	$effect(() => {
		if (active()) mountedOnce = true;
	});

	const resolvedSnapPoints = $derived.by<DrawerResolvedSnapPoint[]>(() => {
		const size = contentSize;
		if (size === null) return [];
		const points: DrawerResolvedSnapPoint[] = [];
		for (const point of snapPoints()) {
			const resolved = resolveSnapPoint(point, { contentSize: size, viewportSize, rootFontSize });
			if (resolved) points.push(resolved);
		}
		return dedupeSnapPoints(points);
	});

	const resolvedActiveSnapPoint = $derived.by<DrawerResolvedSnapPoint | null>(() => {
		const current = snapPoint();
		const size = contentSize;
		if (current === null || size === null) return null;
		const matched = resolvedSnapPoints.find((point) => Object.is(point.value, current));
		if (matched) return matched;
		const resolved = resolveSnapPoint(current, { contentSize: size, viewportSize, rootFontSize });
		return resolved ?? resolvedSnapPoints[0] ?? null;
	});

	const activeSnapOffset = () => resolvedActiveSnapPoint?.offset ?? 0;

	function setOpen(next: boolean) {
		if (next === open()) return;
		if (!isControlled()) internalOpen = next;
		getProps().onOpenChange?.({ open: next });
	}

	function setSnapPoint(next: DrawerSnapPoint | null) {
		if (Object.is(next, snapPoint())) return;
		if (getProps().snapPoint === undefined) internalSnapPoint = next;
		getProps().onSnapPointChange?.({ snapPoint: next });
	}

	function applyTriggerValue(value: string | null) {
		if (value == null) return;
		if (getProps().triggerValue === undefined) internalTriggerValue = value;
		getProps().onTriggerValueChange?.({
			value,
			triggerElement: triggerNodes.get(value) ?? null
		});
	}

	function persistent(): (Element | null | undefined)[] {
		return (getProps().persistentElements ?? []).map((element) => element());
	}

	function ownerDocument(): Document {
		return contentNode?.ownerDocument ?? document;
	}

	let gesture: 'dismiss' | 'open' | null = null;
	let trackingBound = false;

	function onDocumentPointerMove(event: PointerEvent) {
		const point: DrawerPoint = { x: event.clientX, y: event.clientY };
		const direction = physicalSwipeDirection();
		session.track(point, direction);
		if (gesture === 'open') {
			const start = session.getStart();
			if (!start) return;
			if (!swipingOpen) {
				if (!hasOpeningSwipeIntent(start, point, direction)) return;
				swipeOpen = true;
			}
			session.setSwipeOpenOffset(point, contentSize ?? 0, direction);
			dragOffset = session.dragOffset;
			return;
		}
		if (dragOffset === null) {
			const preventDragOnScroll = getProps().preventDragOnScroll ?? true;
			if (
				!session.canStartDrag(
					point,
					event.target as Node | null,
					contentNode,
					preventDragOnScroll,
					direction
				)
			) {
				return;
			}
		}
		session.setDragOffset(point, activeSnapOffset(), direction);
		dragOffset = session.dragOffset;
	}

	function onDocumentPointerUp(event: PointerEvent) {
		const point: DrawerPoint = { x: event.clientX, y: event.clientY };
		session.track(point, physicalSwipeDirection());
		if (gesture === 'open') {
			const shouldOpen = session.shouldOpenOnRelease(
				contentSize,
				getProps().swipeVelocityThreshold ?? 500,
				getProps().closeThreshold ?? 0.5
			);
			const strength = session.getSwipeStrength(shouldOpen ? 0 : (contentSize ?? 0));
			endGesture();
			swipeStrength = strength;
			swipeOpen = false;
			if (shouldOpen) setOpen(true);
			return;
		}
		if (dragOffset === null) {
			endGesture();
			return;
		}

		const points = resolvedSnapPoints;
		const activePoint = resolvedActiveSnapPoint;
		const restOffset = activePoint?.offset ?? 0;
		const dismiss =
			!sequential() && session.shouldDismissOnRelease(contentSize, points, restOffset);
		const target = dismiss
			? null
			: session.resolveSnapPointOnRelease(points, activePoint, sequential(), contentSize ?? 0);
		const strength = session.getSwipeStrength(
			target === null ? (contentSize ?? 0) : snapOffsetOf(target, points),
			restOffset
		);
		endGesture();
		swipeStrength = strength;
		if (target === null) {
			setOpen(false);
			return;
		}
		setSnapPoint(target);
	}

	function snapOffsetOf(value: DrawerSnapPoint, points: DrawerResolvedSnapPoint[]) {
		const resolved = resolveSnapPoint(value, {
			contentSize: contentSize ?? 0,
			viewportSize,
			rootFontSize
		});
		if (resolved) return resolved.offset;
		return points.find((point) => Object.is(point.value, value))?.offset ?? 0;
	}

	function onDocumentPointerCancel() {
		swipeOpen = false;
		endGesture();
	}

	function onVisibilityChange() {
		if (ownerDocument().visibilityState !== 'hidden') return;
		onDocumentPointerCancel();
	}

	function bindTracking() {
		if (trackingBound) return;
		trackingBound = true;
		const doc = ownerDocument();
		doc.addEventListener('pointermove', onDocumentPointerMove);
		doc.addEventListener('pointerup', onDocumentPointerUp);
		doc.addEventListener('pointercancel', onDocumentPointerCancel);
		doc.addEventListener('visibilitychange', onVisibilityChange);
	}

	function unbindTracking() {
		if (!trackingBound) return;
		trackingBound = false;
		const doc = ownerDocument();
		doc.removeEventListener('pointermove', onDocumentPointerMove);
		doc.removeEventListener('pointerup', onDocumentPointerUp);
		doc.removeEventListener('pointercancel', onDocumentPointerCancel);
		doc.removeEventListener('visibilitychange', onVisibilityChange);
	}

	function beginDrag(point: DrawerPoint, target: Node | null, mode: 'dismiss' | 'open') {
		if (trackingBound) return;
		swipeStrength = 1;
		gesture = mode;
		session.setStart(point, target);
		bindTracking();
	}

	function endGesture() {
		unbindTracking();
		cancelPending();
		gesture = null;
		session.reset();
		dragOffset = null;
	}

	let pendingDrag: {
		pointerId: number;
		start: DrawerPoint;
		target: Node | null;
		mode: 'dismiss' | 'open';
	} | null = null;
	let pendingBound = false;

	function onPendingMove(event: PointerEvent) {
		const pending = pendingDrag;
		if (!pending || event.pointerId !== pending.pointerId) return;
		const direction = physicalSwipeDirection();
		const vertical = isVerticalSwipeDirection(direction);
		const mainDelta = vertical
			? event.clientY - pending.start.y
			: event.clientX - pending.start.x;
		const crossDelta = vertical
			? event.clientX - pending.start.x
			: event.clientY - pending.start.y;
		const absMain = Math.abs(mainDelta);
		if (absMain < MIN_PENDING_DRAG_PX) return;
		if (absMain < Math.abs(crossDelta) * PENDING_DRAG_RATIO) return;
		const { start, target, mode } = pending;
		cancelPending();
		beginDrag(start, target, mode);
		onDocumentPointerMove(event);
	}

	function onPendingEnd(event: PointerEvent) {
		if (pendingDrag && event.pointerId !== pendingDrag.pointerId) return;
		cancelPending();
	}

	function bindPending() {
		if (pendingBound) return;
		pendingBound = true;
		const view = ownerDocument().defaultView;
		view?.addEventListener('pointermove', onPendingMove, true);
		view?.addEventListener('pointerup', onPendingEnd, true);
		view?.addEventListener('pointercancel', onPendingEnd, true);
	}

	function cancelPending() {
		pendingDrag = null;
		if (!pendingBound) return;
		pendingBound = false;
		const view = ownerDocument().defaultView;
		view?.removeEventListener('pointermove', onPendingMove, true);
		view?.removeEventListener('pointerup', onPendingEnd, true);
		view?.removeEventListener('pointercancel', onPendingEnd, true);
	}

	function deferDrag(event: PointerEvent, mode: 'dismiss' | 'open') {
		pendingDrag = {
			pointerId: event.pointerId,
			start: { x: event.clientX, y: event.clientY },
			target: event.target as Node | null,
			mode
		};
		bindPending();
	}

	function contentPointerDown(event: PointerEvent) {
		if (!active() || closing()) return;
		const direction = physicalSwipeDirection();
		const axis = isVerticalSwipeDirection(direction) ? 'y' : 'x';
		if (shouldIgnoreDragPointerDown(event, axis)) return;
		if (isTextSelectedIn(ownerDocument(), contentNode)) return;
		if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
			deferDrag(event, 'dismiss');
			return;
		}
		beginDrag({ x: event.clientX, y: event.clientY }, event.target as Node | null, 'dismiss');
	}

	function grabberPointerDown(event: PointerEvent) {
		if (!active() || closing()) return;
		const axis = isVerticalSwipeDirection(physicalSwipeDirection()) ? 'y' : 'x';
		if (shouldIgnoreDragPointerDown(event, axis)) return;
		cancelPending();
		beginDrag({ x: event.clientX, y: event.clientY }, event.target as Node | null, 'dismiss');
	}

	function swipeAreaPointerDown(event: PointerEvent, isDisabled: boolean) {
		if (isDisabled) return;
		if (swipingOpen()) return;
		if (open()) return;
		if (event.pointerType === 'mouse' || event.pointerType === 'pen' || event.pointerType === '') {
			if (event.button !== 0) return;
		}
		cancelPending();
		beginDrag({ x: event.clientX, y: event.clientY }, event.target as Node | null, 'open');
		if (event.cancelable) event.preventDefault();
	}

	$effect(() => {
		const node = contentNode;
		if (!node) return;
		const doc = node.ownerDocument;
		const view = doc.defaultView;
		const measure = () => {
			const direction = physicalSwipeDirection();
			const rect = node.getBoundingClientRect();
			const html = doc.documentElement;
			contentSize = getSwipeDirectionSize(rect, direction);
			viewportSize = isVerticalSwipeDirection(direction) ? html.clientHeight : html.clientWidth;
			const root = Number.parseFloat(getComputedStyle(html).fontSize);
			rootFontSize = Number.isFinite(root) ? root : 16;
			getProps().stack?.setHeight(drawerId(), contentSize ?? 0);
		};
		measure();
		const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
		observer?.observe(node);
		view?.addEventListener('resize', measure);
		return () => {
			observer?.disconnect();
			view?.removeEventListener('resize', measure);
		};
	});

	$effect(() => {
		const stack = getProps().stack;
		if (!stack) return;
		const id = drawerId();
		stack.register(id);
		return () => {
			stack.setSwipe(id, false, 0);
			stack.setOpen(id, false);
			stack.unregister(id);
		};
	});

	$effect(() => {
		getProps().stack?.setOpen(drawerId(), active());
	});

	$effect(() => {
		getProps().stack?.setSwipe(
			drawerId(),
			dragOffset !== null,
			resolveSwipeProgress(contentSize, dragOffset, activeSnapOffset())
		);
	});

	let outsidePointerStart: Node | null = null;
	let pointerUpBound = false;

	function onOutsidePointerUp(event: PointerEvent) {
		const start = outsidePointerStart;
		outsidePointerStart = null;
		unbindPointerUp();
		if (!start || !active()) return;
		const layer = contentNode;
		if (!layer) return;
		const target = event.target as Node | null;
		if (target && layer.contains(target)) return;
		setOpen(false);
	}

	function bindPointerUp(doc: Document) {
		if (pointerUpBound) return;
		pointerUpBound = true;
		doc.addEventListener('pointerup', onOutsidePointerUp, true);
		doc.addEventListener('pointercancel', onOutsidePointerUp, true);
	}

	function unbindPointerUp() {
		if (!pointerUpBound) return;
		pointerUpBound = false;
		const doc = ownerDocument();
		doc.removeEventListener('pointerup', onOutsidePointerUp, true);
		doc.removeEventListener('pointercancel', onOutsidePointerUp, true);
	}

	useEscapeLayer({
		enabled: () => active() && closeOnEscape(),
		onEscape(event) {
			getProps().onEscapeKeyDown?.(event);
			if (event.defaultPrevented) return;
			setOpen(false);
		}
	});

	useDismissableLayer({
		enabled: () => active() && !unmounted() && closeOnInteractOutside(),
		getNode: () => contentNode,
		getExclude: () => [...triggerNodes.values(), ...persistent()],
		onPointerDownOutside(event) {
			getProps().onPointerDownOutside?.(event);
		},
		onFocusOutside(event) {
			getProps().onFocusOutside?.(event);
		},
		onInteractOutside(event) {
			getProps().onInteractOutside?.(event);
			if (event.defaultPrevented) return;
			const original = event.detail.originalEvent;
			if (original.type === 'focusin') {
				setOpen(false);
				return;
			}
			outsidePointerStart = original.target as Node | null;
			const node = contentNode;
			if (node) bindPointerUp(node.ownerDocument);
		}
	});

	useFocusScope({
		enabled: () => active() && contentNode !== null,
		getNode: () => contentNode,
		trap: () => trapFocus(),
		getInitialFocus: () => {
			const provided = getProps().initialFocusEl?.();
			if (provided) return provided instanceof HTMLElement ? provided : null;
			if (role() === 'alertdialog') return closeTriggerNode;
			return null;
		}
	});

	useScrollLock(() => active() && modal() && preventScroll());
	useAriaHidden(() => active() && modal(), () => contentNode);

	let lastActive = active();
	$effect(() => {
		const current = active();
		const previous = lastActive;
		lastActive = current;
		if (current || !previous) return;
		const target = getProps().finalFocusEl?.();
		if (!target) return;
		requestAnimationFrame(() => {
			if (!active()) (target as HTMLElement).focus({ preventScroll: true });
		});
	});

	$effect(() => () => {
		unbindPointerUp();
		unbindTracking();
		cancelPending();
	});

	return {
		get open() {
			return open();
		},
		get modal() {
			return modal();
		},
		get dragging() {
			return dragging();
		},
		get state() {
			return active() ? 'open' : 'closed';
		},
		get present() {
			return presence.present;
		},
		get unmounted() {
			return unmounted();
		},
		get triggerValue() {
			return triggerValue();
		},
		get snapPoint() {
			return snapPoint();
		},
		get snapPoints() {
			return snapPoints();
		},
		get resolvedSnapPoints() {
			return resolvedSnapPoints;
		},
		get resolvedActiveSnapPoint() {
			return resolvedActiveSnapPoint;
		},
		get nextSnapPoint() {
			const points = resolvedSnapPoints;
			if (!points.length) return null;
			const offset = dragOffset ?? activeSnapOffset();
			return findClosestSnapPoint(offset, points)?.value ?? null;
		},
		get swipeDirection() {
			return swipeDirection();
		},
		get swipeProgress() {
			return resolveSwipeProgress(contentSize, dragOffset, activeSnapOffset());
		},
		get contentId() {
			return contentId();
		},
		get titleId() {
			return titleId();
		},
		get descriptionId() {
			return descriptionId();
		},
		get backdropId() {
			return backdropId();
		},
		get positionerId() {
			return positionerId();
		},
		get closeTriggerId() {
			return closeTriggerId();
		},
		get grabberId() {
			return grabberId();
		},
		get grabberIndicatorId() {
			return grabberIndicatorId();
		},
		get swipeAreaId() {
			return swipeAreaId();
		},
		setOpen,
		setSnapPoint,
		setTriggerValue(value) {
			applyTriggerValue(value);
			setOpen(true);
		},
		getOpenPercentage() {
			if (!active() || !contentSize) return 0;
			const current = dragOffset ?? activeSnapOffset();
			return clamp(1 - current / contentSize, 0, 1);
		},
		getSnapPointIndex() {
			const current = snapPoint();
			if (current === null) return -1;
			return snapPoints().indexOf(current);
		},
		getContentSize() {
			return contentSize;
		},
		triggerIdFor,
		triggerAttrs(options = {}) {
			const value = options.value;
			const current = value == null ? false : triggerValue() === value;
			return {
				id: triggerIdFor(value),
				dir: getProps().dir ?? undefined,
				'data-ownedby': drawerId(),
				'data-value': value,
				'aria-haspopup': 'dialog',
				type: 'button',
				'aria-expanded': value == null ? open() : open() && current,
				'data-state': open() ? 'open' : 'closed',
				'aria-controls': unmounted() ? undefined : contentId(),
				'data-current': dataAttr(current),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (open() && value != null && !current) {
						applyTriggerValue(value);
						return;
					}
					if (open()) {
						setOpen(false);
						return;
					}
					applyTriggerValue(value ?? null);
					setOpen(true);
				}
			};
		},
		backdropAttrs() {
			const swiping = dragging() || swipingOpen();
			const declarations = ['will-change: opacity'];
			if (closing()) declarations.push('pointer-events: none');
			declarations.push(
				`--drawer-swipe-progress: ${
					swiping && contentSize
						? clamp(
								Math.abs(
									(dragOffset ?? activeSnapOffset()) - activeSnapOffset()
								) / contentSize,
								0,
								1
							)
						: swipingOpen()
							? 1
							: 0
				}`
			);
			declarations.push(`--drawer-swipe-strength: ${swipeStrength}`);
			return {
				id: backdropId(),
				hidden: !active() || (swipingOpen() && dragOffset === null),
				'data-state': active() ? 'open' : 'closed',
				'data-swiping': swiping ? '' : undefined,
				style: `${declarations.join('; ')};`
			};
		},
		positionerAttrs() {
			return {
				id: positionerId(),
				dir: getProps().dir ?? undefined,
				hidden: !presence.present,
				'data-state': active() ? 'open' : 'closed',
				'data-swipe-direction': physicalSwipeDirection(),
				style: closing() || !modal() ? 'pointer-events: none;' : undefined
			};
		},
		contentAttrs(options = {}) {
			const draggable = options.draggable ?? true;
			const direction = physicalSwipeDirection();
			const vertical = isVerticalSwipeDirection(direction);
			const negative = isNegativeSwipeDirection(direction);
			const snapOffset = activeSnapOffset();
			const swiping = dragging() || swipingOpen();
			const currentOffset = (swipingOpen() && dragOffset === null ? (contentSize ?? 9999) : null) ?? dragOffset ?? snapOffset;
			const signedCurrent = negative ? -currentOffset : currentOffset;
			const translateX = vertical ? 0 : signedCurrent;
			const translateY = vertical ? signedCurrent : 0;
			const signedSnapOffset = negative ? -snapOffset : snapOffset;
			const movement = swiping ? currentOffset - snapOffset : 0;
			const signedMovement = negative ? -movement : movement;
			const movementX = vertical ? 0 : signedMovement;
			const movementY = vertical ? signedMovement : 0;
			const declarations: string[] = [];
			if (!modal()) declarations.push('pointer-events: auto');
			if (swipingOpen() && dragOffset === null) declarations.push('visibility: hidden');
			declarations.push(
				'transform: translate3d(var(--drawer-translate-x, 0px), var(--drawer-translate-y, 0px), 0)'
			);
			if (dragging() || swipingOpen()) declarations.push('transition-duration: 0s');
			declarations.push(`--drawer-translate: ${toPx(translateY)}`);
			declarations.push(`--drawer-translate-x: ${toPx(translateX)}`);
			declarations.push(`--drawer-translate-y: ${toPx(translateY)}`);
			declarations.push(
				`--drawer-snap-point-offset-x: ${vertical ? '0px' : `${toPx(signedSnapOffset)}`}`
			);
			declarations.push(
				`--drawer-snap-point-offset-y: ${vertical ? `${toPx(signedSnapOffset)}` : '0px'}`
			);
			declarations.push(`--drawer-swipe-movement-x: ${toPx(movementX)}`);
			declarations.push(`--drawer-swipe-movement-y: ${toPx(movementY)}`);
			declarations.push(`--drawer-swipe-strength: ${swipeStrength}`);
			declarations.push('--nested-drawers: 0');
			declarations.push('will-change: transform');
			return {
				dir: getProps().dir ?? undefined,
				id: contentId(),
				tabindex: -1,
				role: role(),
				'aria-modal': modal(),
				'aria-labelledby': rendered.title ? titleId() : undefined,
				'aria-describedby': rendered.description ? descriptionId() : undefined,
				hidden: !presence.present,
				'data-state': active() ? 'open' : 'closed',
				'data-expanded': resolvedActiveSnapPoint?.offset === 0 ? '' : undefined,
				'data-swipe-direction': direction,
				'data-snap-point': snapPoint() == null ? undefined : String(snapPoint()),
				'data-swiping': swiping ? '' : undefined,
				'data-dragging': dragging() ? '' : undefined,
				style: `${declarations.join('; ')};`,
				onpointerdown(event: PointerEvent) {
					if (!draggable) return;
					contentPointerDown(event);
				}
			};
		},
		titleAttrs() {
			return { id: titleId(), dir: getProps().dir ?? undefined };
		},
		descriptionAttrs() {
			return { id: descriptionId(), dir: getProps().dir ?? undefined };
		},
		closeTriggerAttrs() {
			return {
				id: closeTriggerId(),
				type: 'button',
				onclick() {
					setOpen(false);
				}
			};
		},
		grabberAttrs() {
			return {
				id: grabberId(),
				onpointerdown(event: PointerEvent) {
					grabberPointerDown(event);
				},
				style: 'touch-action: none;'
			};
		},
		grabberIndicatorAttrs() {
			return { id: grabberIndicatorId() };
		},
		swipeAreaAttrs(options: { disabled?: boolean; swipeDirection?: DrawerSwipeDirection } = {}) {
			const isDisabled = options.disabled ?? false;
			const openDirection = options.swipeDirection ?? oppositeSwipeDirection[swipeDirection()];
			const physicalOpen = resolveSwipeDirection(openDirection, getProps().dir);
			const vertical = isVerticalSwipeDirection(physicalOpen);
			return {
				id: swipeAreaId(),
				role: 'presentation',
				'aria-hidden': true,
				'data-state': active() ? 'open' : 'closed',
				'data-swiping': swipingOpen() ? '' : undefined,
				'data-swipe-direction': physicalOpen,
				'data-disabled': isDisabled ? '' : undefined,
				style: `touch-action: ${vertical ? 'pan-x' : 'pan-y'};${
					isDisabled || (open() && !swipingOpen()) ? ' pointer-events: none;' : ''
				}`,
				onpointerdown(event: PointerEvent) {
					swipeAreaPointerDown(event, isDisabled);
				}
			};
		},
		registerContent(node) {
			contentNode = asHTMLElement(node);
		},
		registerCloseTrigger(node) {
			closeTriggerNode = asHTMLElement(node);
		},
		registerTrigger(node, value) {
			const element = asHTMLElement(node);
			if (element) triggerNodes.set(value, element);
			else triggerNodes.delete(value);
		},
		markRendered(part, isRendered) {
			untrack(() => {
				if (rendered[part] === isRendered) return;
				rendered[part] = isRendered;
			});
		}
	};
}
