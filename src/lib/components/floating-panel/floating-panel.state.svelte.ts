import { untrack } from 'svelte';
import { createContext } from '../../internal/context';
import { dataAttr, toPx } from '../../internal/dom.js';
import { useEscapeLayer } from '../../internal/layers.svelte.js';
import { createPresence } from '../../internal/presence.svelte.js';

export interface FloatingPanelPoint {
	x: number;
	y: number;
}

export interface FloatingPanelSize {
	width: number;
	height: number;
}

export type FloatingPanelResizeTriggerAxis = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

export type FloatingPanelStage = 'minimized' | 'maximized' | 'default';

export interface FloatingPanelOpenChangeDetails {
	open: boolean;
}

export interface FloatingPanelPositionChangeDetails {
	position: FloatingPanelPoint;
}

export interface FloatingPanelSizeChangeDetails {
	size: FloatingPanelSize;
}

export interface FloatingPanelStageChangeDetails {
	stage: FloatingPanelStage;
}

export interface FloatingPanelAnchorPositionDetails {
	triggerRect: DOMRect | null;
	boundaryRect: DOMRect | null;
}

export interface FloatingPanelIntlTranslations {
	minimize?: string;
	maximize?: string;
	restore?: string;
}

export interface FloatingPanelElementIds {
	trigger?: string;
	positioner?: string;
	content?: string;
	title?: string;
	header?: string;
}

export type FloatingPanelPortalRef = HTMLElement | (() => HTMLElement | null | undefined);

export interface UseFloatingPanelProps {
	id?: string | null;
	ids?: FloatingPanelElementIds;
	translations?: FloatingPanelIntlTranslations;
	strategy?: 'absolute' | 'fixed';
	allowOverflow?: boolean;
	open?: boolean;
	defaultOpen?: boolean;
	draggable?: boolean;
	resizable?: boolean;
	size?: FloatingPanelSize;
	defaultSize?: FloatingPanelSize;
	minSize?: FloatingPanelSize;
	maxSize?: FloatingPanelSize;
	position?: FloatingPanelPoint;
	defaultPosition?: FloatingPanelPoint;
	getAnchorPosition?: (details: FloatingPanelAnchorPositionDetails) => FloatingPanelPoint;
	lockAspectRatio?: boolean;
	closeOnEscape?: boolean;
	getBoundaryEl?: () => HTMLElement | null;
	initialFocusEl?: () => HTMLElement | null | false;
	finalFocusEl?: () => HTMLElement | null;
	restoreFocus?: boolean;
	disabled?: boolean;
	onPositionChange?: (details: FloatingPanelPositionChangeDetails) => void;
	onPositionChangeEnd?: (details: FloatingPanelPositionChangeDetails) => void;
	onOpenChange?: (details: FloatingPanelOpenChangeDetails) => void;
	onSizeChange?: (details: FloatingPanelSizeChangeDetails) => void;
	onSizeChangeEnd?: (details: FloatingPanelSizeChangeDetails) => void;
	onStageChange?: (details: FloatingPanelStageChangeDetails) => void;
	persistRect?: boolean;
	gridSize?: number;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	portalled?: boolean;
	portalRef?: FloatingPanelPortalRef;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	onExitComplete?: () => void;
}

export type FloatingPanelAttrs = Record<string, unknown>;

export interface FloatingPanelApi {
	readonly id: string;
	readonly open: boolean;
	readonly present: boolean;
	readonly dataState: 'open' | 'closed';
	readonly dragging: boolean;
	readonly resizing: boolean;
	readonly position: FloatingPanelPoint;
	readonly size: FloatingPanelSize;
	readonly stage: FloatingPanelStage;
	readonly isMaximized: boolean;
	readonly isMinimized: boolean;
	readonly isStaged: boolean;
	readonly canResize: boolean;
	readonly canDrag: boolean;
	readonly resizable: boolean;
	readonly draggable: boolean;
	readonly topmost: boolean;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly portalled: boolean;
	readonly portalTarget: Element | null | undefined;
	readonly triggerId: string;
	readonly contentId: string;
	readonly positionerId: string;
	readonly titleId: string;
	readonly headerId: string;
	readonly translations: Required<FloatingPanelIntlTranslations>;
	setOpen(open: boolean): void;
	setPosition(position: FloatingPanelPoint): void;
	setSize(size: FloatingPanelSize): void;
	minimize(): void;
	maximize(): void;
	restore(): void;
	triggerAttrs(): FloatingPanelAttrs;
	positionerAttrs(): FloatingPanelAttrs;
	contentAttrs(): FloatingPanelAttrs;
	titleAttrs(): FloatingPanelAttrs;
	headerAttrs(): FloatingPanelAttrs;
	bodyAttrs(): FloatingPanelAttrs;
	closeTriggerAttrs(): FloatingPanelAttrs;
	controlAttrs(): FloatingPanelAttrs;
	stageTriggerAttrs(props: { stage: FloatingPanelStage }): FloatingPanelAttrs;
	dragTriggerAttrs(): FloatingPanelAttrs;
	resizeTriggerAttrs(props: { axis: FloatingPanelResizeTriggerAxis }): FloatingPanelAttrs;
	setContentNode(node: HTMLElement | null): void;
	setPositionerNode(node: HTMLElement | null): void;
	setHeaderNode(node: HTMLElement | null): void;
	setTriggerNode(node: HTMLElement | null): void;
}

interface InternalRect {
	x: number;
	y: number;
	width: number;
	height: number;
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
	midX: number;
	midY: number;
}

const NO_OFFSET: FloatingPanelPoint = { x: 0, y: 0 };
const FALLBACK_SIZE: FloatingPanelSize = { width: 320, height: 240 };
const FALLBACK_POSITION: FloatingPanelPoint = { x: 300, y: 100 };
const defaultMinSize: FloatingPanelSize = { width: 0, height: 0 };
const defaultMaxSize: FloatingPanelSize = { width: Number.MAX_VALUE, height: Number.MAX_VALUE };

const createRect = (rect: FloatingPanelPoint & FloatingPanelSize): InternalRect => ({
	x: rect.x,
	y: rect.y,
	width: rect.width,
	height: rect.height,
	minX: rect.x,
	minY: rect.y,
	maxX: rect.x + rect.width,
	maxY: rect.y + rect.height,
	midX: rect.x + rect.width / 2,
	midY: rect.y + rect.height / 2
});

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function clampPoint(position: FloatingPanelPoint, size: FloatingPanelSize, boundary: InternalRect) {
	return {
		x: clamp(position.x, boundary.x, boundary.x + boundary.width - size.width),
		y: clamp(position.y, boundary.y, boundary.y + boundary.height - size.height)
	};
}

function clampSize(
	size: FloatingPanelSize,
	minSize: FloatingPanelSize = defaultMinSize,
	maxSize: FloatingPanelSize = defaultMaxSize
): FloatingPanelSize {
	return {
		width: Math.min(Math.max(size.width, minSize.width), maxSize.width),
		height: Math.min(Math.max(size.height, minSize.height), maxSize.height)
	};
}

function constrainRect(rect: FloatingPanelPoint & FloatingPanelSize, boundary: InternalRect) {
	return {
		x: Math.max(boundary.x, Math.min(rect.x, boundary.x + boundary.width - rect.width)),
		y: Math.max(boundary.y, Math.min(rect.y, boundary.y + boundary.height - rect.height)),
		width: Math.min(rect.width, boundary.width),
		height: Math.min(rect.height, boundary.height)
	};
}

const compassDirectionMap: Record<FloatingPanelResizeTriggerAxis, FloatingPanelPoint> = {
	n: { x: 0.5, y: 0 },
	ne: { x: 1, y: 0 },
	e: { x: 1, y: 0.5 },
	se: { x: 1, y: 1 },
	s: { x: 0.5, y: 1 },
	sw: { x: 0, y: 1 },
	w: { x: 0, y: 0.5 },
	nw: { x: 0, y: 0 }
};

const oppositeDirectionMap: Record<FloatingPanelResizeTriggerAxis, FloatingPanelResizeTriggerAxis> = {
	n: 's',
	ne: 'sw',
	e: 'w',
	se: 'nw',
	s: 'n',
	sw: 'ne',
	w: 'e',
	nw: 'se'
};

function extentPoint(rect: InternalRect, direction: FloatingPanelResizeTriggerAxis) {
	return {
		x: direction.includes('w') ? rect.minX : direction.includes('e') ? rect.maxX : rect.midX,
		y: direction.includes('n') ? rect.minY : direction.includes('s') ? rect.maxY : rect.midY
	};
}

function scaleRect(
	rect: InternalRect,
	scale: FloatingPanelPoint,
	origin: FloatingPanelPoint
): FloatingPanelPoint & FloatingPanelSize {
	const min = {
		x: origin.x + scale.x * (rect.minX - origin.x),
		y: origin.y + scale.y * (rect.minY - origin.y)
	};
	const max = {
		x: origin.x + scale.x * (rect.maxX - origin.x),
		y: origin.y + scale.y * (rect.maxY - origin.y)
	};
	return {
		x: Math.min(min.x, max.x),
		y: Math.min(min.y, max.y),
		width: Math.abs(max.x - min.x),
		height: Math.abs(max.y - min.y)
	};
}

// Port of @zag-js/rect-utils `resizeRect`: scale the rect about the opposite extent so the
// anchored corner stays put, then normalise the flipped rect.
function resizeRect(
	rect: InternalRect,
	offset: FloatingPanelPoint,
	direction: FloatingPanelResizeTriggerAxis,
	options: { scalingOriginMode: 'extent' | 'center'; lockAspectRatio: boolean }
): FloatingPanelPoint & FloatingPanelSize {
	const nextOffset =
		options.scalingOriginMode === 'center'
			? { x: offset.x * 2, y: offset.y * 2 }
			: offset;
	const extent = extentPoint(rect, direction);
	const opposite = extentPoint(rect, oppositeDirectionMap[direction]);
	const newExtent = { x: extent.x + nextOffset.x, y: extent.y + nextOffset.y };
	const multiplier = {
		x: compassDirectionMap[direction].x * 2 - 1,
		y: compassDirectionMap[direction].y * 2 - 1
	};
	const newSize = {
		width: newExtent.x - opposite.x,
		height: newExtent.y - opposite.y
	};
	const scaleX = (multiplier.x * newSize.width) / rect.width;
	const scaleY = (multiplier.y * newSize.height) / rect.height;
	const largestMagnitude = Math.abs(scaleX) > Math.abs(scaleY) ? scaleX : scaleY;
	const scale = options.lockAspectRatio
		? { x: largestMagnitude, y: largestMagnitude }
		: {
				x: extent.x === opposite.x ? 1 : scaleX,
				y: extent.y === opposite.y ? 1 : scaleY
			};
	if (extent.y === opposite.y) scale.y = Math.abs(scale.y);
	else if (Math.sign(scale.y) !== Math.sign(scaleY)) scale.y *= -1;
	if (extent.x === opposite.x) scale.x = Math.abs(scale.x);
	else if (Math.sign(scale.x) !== Math.sign(scaleX)) scale.x *= -1;
	const origin =
		options.scalingOriginMode === 'center'
			? { x: rect.midX, y: rect.midY }
			: opposite;
	return scaleRect(rect, scale, origin);
}

function toNumber(value: string): number {
	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

function elementRect(el: HTMLElement): InternalRect {
	const win = el.ownerDocument.defaultView;
	const { x, y, width, height } = el.getBoundingClientRect();
	const borders = win
		? win.getComputedStyle(el)
		: ({ borderTopWidth: '0', borderRightWidth: '0', borderBottomWidth: '0', borderLeftWidth: '0' } as CSSStyleDeclaration);
	const left = toNumber(borders.borderLeftWidth);
	const top = toNumber(borders.borderTopWidth);
	return createRect({
		x: x + left,
		y: y + top,
		width: width - left - toNumber(borders.borderRightWidth),
		height: height - top - toNumber(borders.borderBottomWidth)
	});
}

function windowRect(win: Window): InternalRect {
	const { innerWidth, innerHeight, visualViewport } = win;
	return createRect({
		x: 0,
		y: 0,
		width: visualViewport?.width || innerWidth,
		height: visualViewport?.height || innerHeight
	});
}

function toDomRect(rect: InternalRect): DOMRect {
	if (typeof DOMRect === 'function') {
		try {
			return new DOMRect(rect.x, rect.y, rect.width, rect.height);
		} catch {
			// Older DOMRect implementations require width/height in the constructor args too.
		}
	}
	return { ...rect, top: rect.y, left: rect.x, right: rect.maxX, bottom: rect.maxY } as unknown as DOMRect;
}

function pick<T extends object, K extends keyof T>(value: T, keys: readonly K[]): Pick<T, K> {
	const result = {} as Pick<T, K>;
	for (const key of keys) result[key] = value[key];
	return result;
}

function defined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}

function isPointEqual(a: FloatingPanelPoint, b: FloatingPanelPoint | null): boolean {
	return a.x === b?.x && a.y === b?.y;
}

function isSizeEqual(a: FloatingPanelSize, b: FloatingPanelSize | null): boolean {
	return a.width === b?.width && a.height === b?.height;
}

const axisStyle: Record<FloatingPanelResizeTriggerAxis, string> = {
	n: 'cursor: n-resize; width: 100%; top: 0; left: 50%; translate: -50%;',
	e: 'cursor: e-resize; height: 100%; right: 0; top: 50%; translate: 0 -50%;',
	s: 'cursor: s-resize; width: 100%; bottom: 0; left: 50%; translate: -50%;',
	w: 'cursor: w-resize; height: 100%; left: 0; top: 50%; translate: 0 -50%;',
	se: 'cursor: se-resize; bottom: 0; right: 0;',
	sw: 'cursor: sw-resize; bottom: 0; left: 0;',
	ne: 'cursor: ne-resize; top: 0; right: 0;',
	nw: 'cursor: nw-resize; top: 0; left: 0;'
};

const validStages: FloatingPanelStage[] = ['minimized', 'maximized', 'default'];

const rtlKeyMap: Record<string, string> = { ArrowLeft: 'ArrowRight', ArrowRight: 'ArrowLeft' };

// The panel stack decides which panel is topmost and the z-index each one renders at.
const stackIds: string[] = [];
const stackListeners = new Set<() => void>();

function notifyStack() {
	for (const listener of [...stackListeners]) listener();
}

function bringToFrontOfPanelStack(panelId: string) {
	if (stackIds[stackIds.length - 1] === panelId) return;
	const index = stackIds.indexOf(panelId);
	if (index !== -1) stackIds.splice(index, 1);
	stackIds.push(panelId);
	notifyStack();
}

function removeFromPanelStack(panelId: string) {
	const index = stackIds.indexOf(panelId);
	if (index === -1) return;
	stackIds.splice(index, 1);
	notifyStack();
}

const floatingPanelContext = createContext<FloatingPanelApi>('FloatingPanel', 'FloatingPanel.Root');

export const useFloatingPanelContext = () => floatingPanelContext.get();
export const setFloatingPanelContext = (api: FloatingPanelApi) => floatingPanelContext.set(api);

export function createFloatingPanel(
	getProps: () => UseFloatingPanelProps,
	uid: string
): FloatingPanelApi {
	const id = getProps().id ?? uid;
	const ids = getProps().ids ?? {};
	const triggerId = ids.trigger ?? `float:${id}:trigger`;
	const positionerId = ids.positioner ?? `float:${id}:positioner`;
	const contentId = ids.content ?? `float:${id}:content`;
	const titleId = ids.title ?? `float:${id}:title`;
	const headerId = ids.header ?? `float:${id}:header`;

	const strategy = () => getProps().strategy ?? 'fixed';
	const gridSize = () => getProps().gridSize ?? 1;
	const translations = (): Required<FloatingPanelIntlTranslations> => ({
		minimize: getProps().translations?.minimize ?? 'Minimize window',
		maximize: getProps().translations?.maximize ?? 'Maximize window',
		restore: getProps().translations?.restore ?? 'Restore window'
	});

	let internalOpen = $state(Boolean(getProps().defaultOpen));
	let internalSize = $state<FloatingPanelSize>(getProps().defaultSize ?? FALLBACK_SIZE);
	let internalPosition = $state<FloatingPanelPoint>(
		getProps().defaultPosition ?? FALLBACK_POSITION
	);
	let internalStage = $state<FloatingPanelStage>('default');
	let prevPosition = $state<FloatingPanelPoint | null>(null);
	let prevSize = $state<FloatingPanelSize | null>(null);
	let lastEventPosition = $state<FloatingPanelPoint | null>(null);
	let offsetOrigin = $state<FloatingPanelPoint>(NO_OFFSET);
	let dragging = $state(false);
	let resizing = $state(false);
	let stackIndex = $state(-1);
	let topmost = $state(false);
	let contentNode = $state<HTMLElement | null>(null);
	let positionerNode = $state<HTMLElement | null>(null);
	let headerNode = $state<HTMLElement | null>(null);
	let triggerNode = $state<HTMLElement | null>(null);

	const isOpen = () => (getProps().open !== undefined ? Boolean(getProps().open) : internalOpen);
	const sizeOf = () => getProps().size ?? internalSize;
	const positionOf = () => getProps().position ?? internalPosition;
	const stage = () => internalStage;
	const isMaximized = () => stage() === 'maximized';
	const isMinimized = () => stage() === 'minimized';
	const isStaged = () => stage() !== 'default';
	const canResize = () =>
		(getProps().resizable ?? true) && !getProps().disabled && stage() === 'default';
	const canDrag = () =>
		(getProps().draggable ?? true) && !getProps().disabled && !isMaximized();

	const presence = createPresence({
		present: () => isOpen(),
		getNode: () => positionerNode ?? contentNode,
		lazyMount: () => getProps().lazyMount ?? true,
		unmountOnExit: () => getProps().unmountOnExit ?? true,
		onExitComplete: () => getProps().onExitComplete?.()
	});

	function docOf(): Document | null {
		const node = contentNode ?? positionerNode ?? triggerNode ?? headerNode;
		return node?.ownerDocument ?? (typeof document === 'undefined' ? null : document);
	}

	function winOf(): Window | null {
		return docOf()?.defaultView ?? (typeof window === 'undefined' ? null : window);
	}

	function boundaryRect(allowOverflow: boolean): InternalRect {
		const element = getProps().getBoundaryEl?.();
		let rect = element ? elementRect(element) : null;
		if (!rect) {
			const win = winOf();
			rect = win ? windowRect(win) : createRect({ x: 0, y: 0, width: 0, height: 0 });
		}
		if (!allowOverflow) return rect;
		return createRect({
			x: -rect.width,
			y: rect.minY,
			width: rect.width * 3,
			height: rect.height * 2
		});
	}

	function setPositionValue(next: FloatingPanelPoint) {
		if (isPointEqual(next, positionOf())) return;
		if (getProps().position === undefined) internalPosition = next;
		getProps().onPositionChange?.({ position: next });
	}

	function setSizeValue(next: FloatingPanelSize) {
		if (isSizeEqual(next, sizeOf())) return;
		if (getProps().size === undefined) internalSize = next;
		getProps().onSizeChange?.({ size: next });
	}

	function setStageValue(next: FloatingPanelStage) {
		if (next === stage()) return;
		internalStage = next;
		getProps().onStageChange?.({ stage: next });
	}

	function setOpen(next: boolean) {
		if (next === isOpen()) return;
		if (getProps().open === undefined) internalOpen = next;
		getProps().onOpenChange?.({ open: next });
	}

	function applyOffsetOrigin() {
		if (strategy() !== 'absolute') {
			offsetOrigin = NO_OFFSET;
			return;
		}
		const parent = positionerNode?.offsetParent;
		if (!(parent instanceof HTMLElement)) return;
		offsetOrigin = pick(elementRect(parent), ['x', 'y']);
	}

	function applyAnchorPosition() {
		if (getProps().position !== undefined || getProps().defaultPosition != null) return;
		if (prevPosition || prevSize) return;
		const boundary = boundaryRect(false);
		const trigger = triggerNode;
		const anchor =
			getProps().getAnchorPosition?.({
				triggerRect: trigger ? toDomRect(elementRect(trigger)) : null,
				boundaryRect: toDomRect(boundary)
			}) ?? {
				x: boundary.x + (boundary.width - sizeOf().width) / 2,
				y: boundary.y + (boundary.height - sizeOf().height) / 2
			};
		setPositionValue(anchor);
	}

	function nextFrame(callback: () => void) {
		const win = winOf();
		if (win) win.requestAnimationFrame(callback);
		else requestAnimationFrame(callback);
	}

	function focusInitial() {
		nextFrame(() => {
			const custom = getProps().initialFocusEl?.();
			if (custom === false) return;
			const target = custom ?? contentNode;
			if (target?.isConnected) target.focus({ preventScroll: true });
		});
	}

	function focusFinal() {
		if (getProps().restoreFocus === false) return;
		nextFrame(() => {
			const target = getProps().finalFocusEl?.() ?? triggerNode;
			if (target?.isConnected) target.focus({ preventScroll: true });
		});
	}

	function resetRect() {
		setStageValue('default');
		if (getProps().persistRect) return;
		internalPosition = getProps().defaultPosition ?? FALLBACK_POSITION;
		internalSize = getProps().defaultSize ?? FALLBACK_SIZE;
	}

	let lastOpen = false;
	$effect(() => {
		const open = isOpen();
		if (open === lastOpen) return;
		lastOpen = open;
		untrack(() => {
			if (open) {
				bringToFrontOfPanelStack(id);
				applyOffsetOrigin();
				applyAnchorPosition();
				focusInitial();
				return;
			}
			resetRect();
			focusFinal();
		});
	});

	$effect(() => {
		const listener = () => {
			topmost = stackIds[stackIds.length - 1] === id;
			stackIndex = stackIds.indexOf(id);
		};
		stackListeners.add(listener);
		listener();
		return () => {
			stackListeners.delete(listener);
			removeFromPanelStack(id);
		};
	});

	// Position is clamped into the boundary whenever the window or the boundary element resizes.
	$effect(() => {
		if (!isOpen()) return;
		const boundaryEl = getProps().getBoundaryEl?.() ?? null;
		const win = winOf();
		const resizeTarget: Window | HTMLElement | null = boundaryEl ?? win;
		if (!resizeTarget) return;

		let previous = currentBoundary();
		const sync = () => {
			const rect = currentBoundary();
			applyOffsetOrigin();
			const dx = rect.x - previous.x;
			const dy = rect.y - previous.y;
			if (dx !== 0 || dy !== 0) {
				const position = positionOf();
				setPositionValue({ x: position.x + dx, y: position.y + dy });
			}
			if (rect.width !== previous.width || rect.height !== previous.height) {
				const panelRect = { ...positionOf(), ...sizeOf() };
				const nextRect = isMaximized() ? rect : constrainRect(panelRect, rect);
				setSizeValue(pick(nextRect, ['width', 'height']));
				setPositionValue(pick(nextRect, ['x', 'y']));
			}
			previous = rect;
		};
		nextFrame(() => applyOffsetOrigin());
		const observer =
			boundaryEl && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null;
		if (observer && boundaryEl) observer.observe(boundaryEl);
		resizeTarget.addEventListener('resize', sync);
		return () => {
			observer?.disconnect();
			resizeTarget.removeEventListener('resize', sync);
		};
	});

	function currentBoundary(): InternalRect {
		return boundaryRect(false);
	}

	useEscapeLayer({
		enabled: () => isOpen() && getProps().closeOnEscape !== false,
		onEscape() {
			// A drag or resize in flight owns Escape: it restores the rect instead of closing.
			if (dragging || resizing) return;
			if (!topmost) return;
			setOpen(false);
		}
	});

	function capturePointer(node: Element, pointerId: number) {
		const el = node as HTMLElement;
		try {
			el.setPointerCapture?.(pointerId);
		} catch {
			// jsdom has no pointer capture; the document listeners still run the drag.
		}
	}

	function releasePointer(node: Element, pointerId: number) {
		const el = node as HTMLElement;
		try {
			if (el.hasPointerCapture?.(pointerId)) el.releasePointerCapture(pointerId);
		} catch {
			// jsdom has no pointer capture.
		}
	}

	let detachDrag: (() => void) | null = null;

	function endDrag() {
		if (!dragging) return;
		dragging = false;
		detachDrag?.();
		detachDrag = null;
		getProps().onPositionChangeEnd?.({ position: positionOf() });
		if (!getProps().persistRect) prevPosition = null;
		lastEventPosition = null;
	}

	function dragTo(point: FloatingPanelPoint) {
		const last = lastEventPosition;
		const previous = prevPosition;
		if (!last || !previous) return;
		const grid = gridSize();
		const diff = {
			x: Math.round((point.x - last.x) / grid) * grid,
			y: Math.round((point.y - last.y) / grid) * grid
		};
		const boundary = boundaryRect(getProps().allowOverflow ?? true);
		setPositionValue(
			clampPoint(
				{ x: previous.x + diff.x, y: previous.y + diff.y },
				sizeOf(),
				boundary
			)
		);
	}

	function startDrag(event: PointerEvent, node: Element) {
		if (!canDrag() || event.button !== 0) return;
		const target = event.target as Element | null;
		if (target?.closest('button') || target?.closest('[data-no-drag]')) return;
		prevPosition = { ...positionOf() };
		lastEventPosition = { x: event.clientX, y: event.clientY };
		dragging = true;
		capturePointer(node, event.pointerId);
		event.stopPropagation();

		if (detachDrag) detachDrag();
		const doc = node.ownerDocument;
		const onPointerMove = (moveEvent: PointerEvent) => {
			const boundary = boundaryRect(false);
			dragTo({
				x: clamp(moveEvent.clientX, boundary.x, boundary.x + boundary.width),
				y: clamp(moveEvent.clientY, boundary.y, boundary.y + boundary.height)
			});
		};
		const onPointerUp = (upEvent: PointerEvent) => {
			releasePointer(node, upEvent.pointerId);
			endDrag();
		};
		const onKeyDown = (keyEvent: KeyboardEvent) => {
			if (keyEvent.key !== 'Escape') return;
			keyEvent.preventDefault();
			if (prevPosition) setPositionValue({ ...prevPosition });
			endDrag();
		};
		doc.addEventListener('pointermove', onPointerMove);
		doc.addEventListener('pointerup', onPointerUp);
		doc.addEventListener('pointercancel', onPointerUp);
		doc.addEventListener('keydown', onKeyDown);
		detachDrag = () => {
			doc.removeEventListener('pointermove', onPointerMove);
			doc.removeEventListener('pointerup', onPointerUp);
			doc.removeEventListener('pointercancel', onPointerUp);
			doc.removeEventListener('keydown', onKeyDown);
		};
	}

	let detachResize: (() => void) | null = null;

	function endResize() {
		if (!resizing) return;
		resizing = false;
		detachResize?.();
		detachResize = null;
		getProps().onSizeChangeEnd?.({ size: sizeOf() });
		prevSize = null;
		prevPosition = null;
		lastEventPosition = null;
	}

	function applyResize(point: FloatingPanelPoint, axis: FloatingPanelResizeTriggerAxis, altKey: boolean, shiftKey: boolean) {
		const size = prevSize;
		const position = prevPosition;
		const last = lastEventPosition;
		if (!size || !position || !last) return;
		const rect = createRect({ ...position, ...size });
		const offset = { x: point.x - last.x, y: point.y - last.y };
		const nextRect = resizeRect(rect, offset, axis, {
			scalingOriginMode: altKey ? 'center' : 'extent',
			lockAspectRatio: Boolean(getProps().lockAspectRatio) || shiftKey
		});
		const boundary = boundaryRect(false);
		const nextSize = clampSize(
			clampSize(pick(nextRect, ['width', 'height']), getProps().minSize, getProps().maxSize),
			getProps().minSize,
			boundary
		);
		setSizeValue(nextSize);
		setPositionValue(clampPoint(pick(nextRect, ['x', 'y']), nextSize, boundary));
	}

	function startResize(event: PointerEvent, axis: FloatingPanelResizeTriggerAxis, node: Element) {
		if (!canResize() || event.button !== 0) return;
		prevSize = { ...sizeOf() };
		prevPosition = { ...positionOf() };
		lastEventPosition = { x: event.clientX, y: event.clientY };
		resizing = true;
		capturePointer(node, event.pointerId);
		event.stopPropagation();

		if (detachResize) detachResize();
		const doc = node.ownerDocument;
		const onPointerMove = (moveEvent: PointerEvent) => {
			const boundary = boundaryRect(false);
			applyResize(
				{
					x: clamp(moveEvent.clientX, boundary.x, boundary.x + boundary.width),
					y: clamp(moveEvent.clientY, boundary.y, boundary.y + boundary.height)
				},
				axis,
				moveEvent.altKey,
				moveEvent.shiftKey
			);
		};
		const onPointerUp = (upEvent: PointerEvent) => {
			releasePointer(node, upEvent.pointerId);
			endResize();
		};
		const onKeyDown = (keyEvent: KeyboardEvent) => {
			if (keyEvent.key !== 'Escape') return;
			keyEvent.preventDefault();
			if (prevSize) setSizeValue({ ...prevSize });
			if (prevPosition) setPositionValue({ ...prevPosition });
			endResize();
		};
		doc.addEventListener('pointermove', onPointerMove);
		doc.addEventListener('pointerup', onPointerUp);
		doc.addEventListener('pointercancel', onPointerUp);
		doc.addEventListener('keydown', onKeyDown);
		detachResize = () => {
			doc.removeEventListener('pointermove', onPointerMove);
			doc.removeEventListener('pointerup', onPointerUp);
			doc.removeEventListener('pointercancel', onPointerUp);
			doc.removeEventListener('keydown', onKeyDown);
		};
	}

	function moveBy(direction: 'left' | 'right' | 'up' | 'down', step: number) {
		const position = positionOf();
		const next = {
			left: { x: position.x - step, y: position.y },
			right: { x: position.x + step, y: position.y },
			up: { x: position.x, y: position.y - step },
			down: { x: position.x, y: position.y + step }
		}[direction];
		setPositionValue(clampPoint(next, sizeOf(), boundaryRect(false)));
	}

	function resizeByStep(axis: FloatingPanelResizeTriggerAxis, dx: number, dy: number) {
		const rect = createRect({ ...positionOf(), ...sizeOf() });
		const nextRect = resizeRect(rect, { x: dx, y: dy }, axis, {
			scalingOriginMode: 'extent',
			lockAspectRatio: false
		});
		const boundary = boundaryRect(false);
		const nextSize = clampSize(
			clampSize(pick(nextRect, ['width', 'height']), getProps().minSize, getProps().maxSize),
			getProps().minSize,
			boundary
		);
		setSizeValue(nextSize);
		setPositionValue(clampPoint(pick(nextRect, ['x', 'y']), nextSize, boundary));
	}

	function keyboardStep(event: KeyboardEvent): number {
		const arrow = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key);
		return ((event.key === 'PageUp' || event.key === 'PageDown') || (event.shiftKey && arrow) ? 10 : 1) * gridSize();
	}

	function isRtl() {
		const dir = getProps().dir;
		if (dir === 'rtl') return true;
		if (dir === 'ltr') return false;
		return docOf()?.documentElement?.dir === 'rtl';
	}

	function directedKey(event: KeyboardEvent): string {
		if (!isRtl()) return event.key;
		return rtlKeyMap[event.key] ?? event.key;
	}

	function minimize() {
		if (stage() === 'minimized') return;
		const wasDefault = stage() === 'default';
		const currentSize = { ...sizeOf() };
		const currentPosition = { ...positionOf() };
		setStageValue('minimized');
		if (wasDefault) {
			prevSize = currentSize;
			prevPosition = currentPosition;
		}
		const header = headerNode;
		if (!header) return;
		setSizeValue({ ...currentSize, height: header.offsetHeight });
	}

	function maximize() {
		if (stage() === 'maximized') return;
		const wasDefault = stage() === 'default';
		const currentSize = { ...sizeOf() };
		const currentPosition = { ...positionOf() };
		const boundary = boundaryRect(false);
		setStageValue('maximized');
		if (wasDefault) {
			prevSize = currentSize;
			prevPosition = currentPosition;
		}
		setPositionValue({ x: boundary.x, y: boundary.y });
		setSizeValue({ width: boundary.width, height: boundary.height });
	}

	function restore() {
		const boundary = boundaryRect(false);
		setStageValue('default');
		let restoredSize = sizeOf();
		if (prevSize) {
			restoredSize = clampSize(
				clampSize(prevSize, getProps().minSize, getProps().maxSize),
				getProps().minSize,
				boundary
			);
		}
		let restoredPosition = positionOf();
		if (prevPosition) restoredPosition = clampPoint(prevPosition, restoredSize, boundary);
		setSizeValue(restoredSize);
		setPositionValue(restoredPosition);
		prevSize = null;
		prevPosition = null;
	}

	function setPosition(position: FloatingPanelPoint) {
		setPositionValue(clampPoint(position, sizeOf(), boundaryRect(getProps().allowOverflow ?? true)));
	}

	function setSize(size: FloatingPanelSize) {
		const boundary = boundaryRect(false);
		const nextSize = clampSize(
			clampSize(size, getProps().minSize, getProps().maxSize),
			getProps().minSize,
			boundary
		);
		setSizeValue(nextSize);
		setPositionValue(clampPoint(positionOf(), nextSize, boundary));
	}

	function triggerAttrs(): FloatingPanelAttrs {
		return defined({
			dir: getProps().dir ?? undefined,
			type: 'button',
			disabled: getProps().disabled,
			id: triggerId,
			'data-state': isOpen() ? 'open' : 'closed',
			'data-dragging': dataAttr(dragging),
			'aria-controls': presence.present ? contentId : undefined,
			'aria-expanded': isOpen() ? 'true' : 'false',
			onclick(event: MouseEvent) {
				if (event.defaultPrevented) return;
				if (getProps().disabled) return;
				setOpen(!isOpen());
			}
		});
	}

	function positionerAttrs(): FloatingPanelAttrs {
		const position = positionOf();
		const size = sizeOf();
		const declarations = [
			`--width: ${toPx(size.width)}`,
			`--height: ${toPx(size.height)}`,
			`--x: ${toPx(position.x - offsetOrigin.x)}`,
			`--y: ${toPx(position.y - offsetOrigin.y)}`,
			stackIndex > -1 ? `--z-index: ${stackIndex + 1}` : undefined,
			`position: ${strategy()}`,
			'isolation: isolate',
			'top: var(--y)',
			'left: var(--x)'
		].filter(Boolean);
		return defined({
			dir: getProps().dir ?? undefined,
			id: positionerId,
			style: `${declarations.join('; ')};`
		});
	}

	function contentAttrs(): FloatingPanelAttrs {
		const minimized = isMinimized();
		return defined({
			dir: getProps().dir ?? undefined,
			role: 'dialog',
			tabindex: 0,
			hidden: !isOpen(),
			id: contentId,
			'aria-labelledby': titleId,
			'data-state': isOpen() ? 'open' : 'closed',
			'data-dragging': dataAttr(dragging),
			'data-topmost': dataAttr(topmost),
			'data-behind': dataAttr(!topmost),
			'data-minimized': dataAttr(minimized),
			'data-maximized': dataAttr(isMaximized()),
			'data-staged': dataAttr(isStaged()),
			style: minimized
				? 'width: var(--width); height: var(--height); overflow: hidden;'
				: 'width: var(--width); height: var(--height);',
			onfocus() {
				bringToFrontOfPanelStack(id);
			},
			onkeydown(event: KeyboardEvent) {
				if (event.defaultPrevented) return;
				if (event.currentTarget !== event.target) return;
				const step = keyboardStep(event);
				const handler = {
					ArrowLeft: () => moveBy('left', step),
					ArrowRight: () => moveBy('right', step),
					ArrowUp: () => moveBy('up', step),
					ArrowDown: () => moveBy('down', step)
				}[directedKey(event)] as (() => void) | undefined;
				if (!handler) return;
				event.preventDefault();
				handler();
			}
		});
	}

	function stageStateAttrs(): Record<string, unknown> {
		return {
			'data-minimized': dataAttr(isMinimized()),
			'data-maximized': dataAttr(isMaximized()),
			'data-staged': dataAttr(isStaged())
		};
	}

	function resizeTriggerAttrs(props: { axis: FloatingPanelResizeTriggerAxis }): FloatingPanelAttrs {
		const { axis } = props;
		const size = sizeOf();
		const horizontal = axis.includes('e') || axis.includes('w');
		const minSize = getProps().minSize;
		const maxSize = getProps().maxSize;
		const value = horizontal ? size.width : size.height;
		const minimum = horizontal ? (minSize?.width ?? 0) : (minSize?.height ?? 0);
		const maximum = horizontal
			? (maxSize?.width ?? Number.MAX_VALUE)
			: (maxSize?.height ?? Number.MAX_VALUE);
		const step = gridSize();
		return defined({
			dir: getProps().dir ?? undefined,
			role: 'separator',
			tabindex: 0,
			'aria-orientation': horizontal ? 'vertical' : 'horizontal',
			'aria-valuenow': Math.round(value),
			'aria-valuemin': Math.round(minimum),
			'aria-valuemax': maximum === Number.MAX_VALUE ? undefined : Math.round(maximum),
			'aria-controls': contentId,
			'data-disabled': dataAttr(!canResize()),
			'data-axis': axis,
			style: `position: absolute; touch-action: none; ${axisStyle[axis]}`,
			onpointerdown(event: PointerEvent) {
				startResize(event, axis, event.currentTarget as Element);
			},
			onpointerup(event: PointerEvent) {
				releasePointer(event.currentTarget as Element, event.pointerId);
			},
			onkeydown(event: KeyboardEvent) {
				if (event.defaultPrevented || !canResize()) return;
				const amount = (event.shiftKey ? 10 : 1) * step;
				const key = directedKey(event);
				let dx = 0;
				let dy = 0;
				if (key === 'ArrowRight') dx = amount;
				else if (key === 'ArrowLeft') dx = -amount;
				else if (key === 'ArrowDown') dy = amount;
				else if (key === 'ArrowUp') dy = -amount;
				else return;
				event.preventDefault();
				resizeByStep(axis, dx, dy);
			}
		});
	}

	return {
		id,
		triggerId,
		contentId,
		positionerId,
		titleId,
		headerId,
		get open() {
			return isOpen();
		},
		get present() {
			return presence.present;
		},
		get dataState() {
			return isOpen() ? 'open' : 'closed';
		},
		get dragging() {
			return dragging;
		},
		get resizing() {
			return resizing;
		},
		get position() {
			return positionOf();
		},
		get size() {
			return sizeOf();
		},
		get stage() {
			return stage();
		},
		get isMaximized() {
			return isMaximized();
		},
		get isMinimized() {
			return isMinimized();
		},
		get isStaged() {
			return isStaged();
		},
		get canResize() {
			return canResize();
		},
		get canDrag() {
			return canDrag();
		},
		get resizable() {
			return getProps().resizable ?? true;
		},
		get draggable() {
			return getProps().draggable ?? true;
		},
		get topmost() {
			return topmost;
		},
		get dir() {
			return getProps().dir;
		},
		get portalled() {
			return getProps().portalled !== false;
		},
		get portalTarget() {
			const ref = getProps().portalRef;
			return (typeof ref === 'function' ? ref() : ref) ?? undefined;
		},
		get translations() {
			return translations();
		},
		setOpen,
		setPosition,
		setSize,
		minimize,
		maximize,
		restore,
		triggerAttrs,
		positionerAttrs,
		contentAttrs,
		titleAttrs: () =>
			defined({
				dir: getProps().dir ?? undefined,
				id: titleId
			}),
		headerAttrs: () =>
			defined({
				dir: getProps().dir ?? undefined,
				id: headerId,
				'data-dragging': dataAttr(dragging),
				'data-topmost': dataAttr(topmost),
				'data-behind': dataAttr(!topmost),
				...stageStateAttrs(),
				onpointerdown(event: PointerEvent) {
					startDrag(event, event.currentTarget as Element);
				}
			}),
		bodyAttrs: () =>
			defined({
				dir: getProps().dir ?? undefined,
				'data-dragging': dataAttr(dragging),
				...stageStateAttrs(),
				hidden: isMinimized()
			}),
		closeTriggerAttrs: () =>
			defined({
				dir: getProps().dir ?? undefined,
				disabled: getProps().disabled,
				'aria-label': 'Close Window',
				type: 'button',
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					setOpen(false);
				}
			}),
		controlAttrs: () =>
			defined({
				dir: getProps().dir ?? undefined,
				'data-disabled': dataAttr(getProps().disabled),
				'data-stage': stage(),
				...stageStateAttrs()
			}),
		stageTriggerAttrs(props) {
			const { stage: target } = props;
			if (!validStages.includes(target)) {
				throw new Error(`[floating-panel] Invalid stage: ${target}`);
			}
			const action =
				target === 'minimized'
					? { 'aria-label': translations().minimize, hidden: isStaged() }
					: target === 'maximized'
						? { 'aria-label': translations().maximize, hidden: isStaged() }
						: { 'aria-label': translations().restore, hidden: !isStaged() };
			return defined({
				dir: getProps().dir ?? undefined,
				disabled: getProps().disabled,
				'data-stage': target,
				...action,
				type: 'button',
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!(getProps().resizable ?? true)) return;
					if (target === 'minimized') minimize();
					else if (target === 'maximized') maximize();
					else restore();
				}
			});
		},
		dragTriggerAttrs: () =>
			defined({
				dir: getProps().dir ?? undefined,
				tabindex: 0,
				'aria-label': 'Move window',
				'data-disabled': dataAttr(!canDrag()),
				style: 'user-select: none; -webkit-user-select: none; touch-action: none; cursor: move;',
				onpointerdown(event: PointerEvent) {
					startDrag(event, event.currentTarget as Element);
				},
				onpointerup(event: PointerEvent) {
					releasePointer(event.currentTarget as Element, event.pointerId);
				},
				onkeydown(event: KeyboardEvent) {
					if (event.defaultPrevented || !canDrag()) return;
					const step = keyboardStep(event);
					const key = directedKey(event);
					if (key === 'ArrowRight') moveBy('right', step);
					else if (key === 'ArrowLeft') moveBy('left', step);
					else if (key === 'ArrowDown') moveBy('down', step);
					else if (key === 'ArrowUp') moveBy('up', step);
					else return;
					event.preventDefault();
				},
				ondblclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!(getProps().resizable ?? true)) return;
					if (isStaged()) restore();
					else maximize();
				}
			}),
		resizeTriggerAttrs,
		setContentNode(node) {
			contentNode = node;
		},
		setPositionerNode(node) {
			positionerNode = node;
		},
		setHeaderNode(node) {
			headerNode = node;
		},
		setTriggerNode(node) {
			triggerNode = node;
		}
	};
}
