// Positioning engine: the middleware chain Zag's popper package drives, implemented here so the
// package stays dependency-free. The CSS custom-property contract is Zag's, not an invention:
// `--x`, `--y`, `--reference-width`, `--reference-height`, `--available-width`, `--available-height`,
// `--transform-origin`, `--arrow-size`, `--arrow-size-half`, `--arrow-offset`, `--arrow-background`.

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Alignment = 'start' | 'end';
export type Placement = Side | `${Side}-${Alignment}`;
export type Strategy = 'absolute' | 'fixed';

export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface Coords {
	x: number;
	y: number;
}

export interface MiddlewareData {
	arrow?: Coords & { centerOffset: number };
	shift?: Coords & { x: number; y: number };
	hide?: { referenceHidden: boolean };
	transformOrigin?: string;
	rects?: { reference: Rect; floating: Rect };
	offset?: Coords;
	flip?: { index: number };
	size?: { availableWidth: number; availableHeight: number };
}

export interface MiddlewareState {
	placement: Placement;
	strategy: Strategy;
	rects: { reference: Rect; floating: Rect };
	elements: { reference: Element; floating: HTMLElement };
	middlewareData: MiddlewareData;
	x: number;
	y: number;
	rtl: boolean;
}

export interface Middleware {
	name: string;
	fn: (state: MiddlewareState) => Partial<Coords> & { data?: Record<string, unknown>; reset?: { placement?: Placement } } | void;
}

export type Boundary = 'clippingAncestors' | 'viewport' | Element | null;

export interface ArrowOptions {
	element: HTMLElement | null;
	padding?: number;
}

export interface OffsetOptions {
	mainAxis?: number;
	crossAxis?: number;
	alignmentAxis?: number;
}

export interface FlipOptions {
	fallbackPlacements?: Placement[];
	padding?: number;
	boundary?: Boundary;
}

export interface ShiftOptions {
	mainAxis?: boolean;
	crossAxis?: boolean;
	padding?: number;
	boundary?: Boundary;
	limiter?: (state: { x: number; y: number; rects: MiddlewareState['rects'] }) => Coords;
}

export interface SizeOptions {
	padding?: number;
	boundary?: Boundary;
	apply?: (args: { availableWidth: number; availableHeight: number; rects: MiddlewareState['rects'] }) => void;
}

export interface HideOptions {
	padding?: number;
	boundary?: Boundary;
}

export const sides: Side[] = ['top', 'right', 'bottom', 'left'];

export const getSide = (placement: Placement): Side => placement.split('-')[0] as Side;
export const getAlignment = (placement: Placement): Alignment | undefined =>
	placement.split('-')[1] as Alignment | undefined;

export const oppositeSide: Record<Side, Side> = {
	top: 'bottom',
	right: 'left',
	bottom: 'top',
	left: 'right'
};

const isVerticalSide = (side: Side) => side === 'top' || side === 'bottom';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function getViewportRect(doc: Document): Rect {
	const el = doc.documentElement;
	return { x: 0, y: 0, width: el.clientWidth, height: el.clientHeight };
}

export function getElementRect(element: Element): Rect {
	const rect = element.getBoundingClientRect();
	return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
}

function resolveBoundaryRect(state: MiddlewareState, boundary: Boundary, padding: number): Rect {
	const doc = state.elements.floating.ownerDocument;
	if (boundary instanceof Element) {
		const rect = getElementRect(boundary);
		return {
			x: rect.x + padding,
			y: rect.y + padding,
			width: rect.width - padding * 2,
			height: rect.height - padding * 2
		};
	}
	const rect = getViewportRect(doc);
	return {
		x: rect.x + padding,
		y: rect.y + padding,
		width: rect.width - padding * 2,
		height: rect.height - padding * 2
	};
}

function overflowAlong(floating: Rect, boundary: Rect, axis: 'x' | 'y'): number {
	if (axis === 'x') {
		return Math.max(boundary.x - floating.x, 0) + Math.max(floating.x + floating.width - (boundary.x + boundary.width), 0);
	}
	return Math.max(boundary.y - floating.y, 0) + Math.max(floating.y + floating.height - (boundary.y + boundary.height), 0);
}

function computeCoordsFromPlacement(
	reference: Rect,
	floating: Rect,
	placement: Placement,
	rtl: boolean
): Coords {
	const side = getSide(placement);
	const alignment = getAlignment(placement);
	const vertical = isVerticalSide(side);
	const commonX = reference.x + reference.width / 2 - floating.width / 2;
	const commonY = reference.y + reference.height / 2 - floating.height / 2;
	const commonAlign = (vertical ? reference.width - floating.width : reference.height - floating.height) / 2;

	let coords: Coords;
	switch (side) {
		case 'top':
			coords = { x: commonX, y: reference.y - floating.height };
			break;
		case 'bottom':
			coords = { x: commonX, y: reference.y + reference.height };
			break;
		case 'right':
			coords = { x: reference.x + reference.width, y: commonY };
			break;
		default:
			coords = { x: reference.x - floating.width, y: commonY };
			break;
	}

	if (alignment) {
		const sign = (alignment === 'start' ? -1 : 1) * (rtl && vertical ? -1 : 1);
		if (vertical) coords.x += commonAlign * sign;
		else coords.y += commonAlign * sign;
	}

	return coords;
}

export const offset = (options: OffsetOptions | ((state: MiddlewareState) => OffsetOptions)): Middleware => ({
	name: 'offset',
	fn(state) {
		const opts = typeof options === 'function' ? options(state) : options;
		const { mainAxis = 0, crossAxis = 0, alignmentAxis = 0 } = opts;
		const side = getSide(state.placement);
		const alignment = getAlignment(state.placement);
		const vertical = isVerticalSide(side);

		const coords: Coords = { x: 0, y: 0 };
		if (vertical) coords.y = side === 'top' ? -mainAxis : mainAxis;
		else coords.x = side === 'left' ? -mainAxis : mainAxis;

		if (alignment) {
			const sign = alignment === 'start' ? -1 : 1;
			if (vertical) coords.x = sign * (crossAxis || alignmentAxis);
			else coords.y = sign * (crossAxis || alignmentAxis);
		} else if (!vertical && alignmentAxis) {
			coords.y = alignmentAxis;
		}

		return { x: state.x + coords.x, y: state.y + coords.y, data: { offset: coords } };
	}
});

const fallbackPlacementsFor = (placement: Placement): Placement[] => {
	const side = getSide(placement);
	const alignment = getAlignment(placement);
	const opposite = oppositeSide[side];
	const list: Placement[] = [opposite as Placement];
	if (alignment) list.push(`${opposite}-${alignment}` as Placement);
	for (const other of sides) {
		if (other === side || other === opposite) continue;
		list.push(alignment ? (`${other}-${alignment}` as Placement) : other);
	}
	return list;
};

export const flip = (
	options: FlipOptions | ((state: MiddlewareState) => FlipOptions) = {}
): Middleware => ({
	name: 'flip',
	fn(state) {
		const opts = typeof options === 'function' ? options(state) : options;
		const padding = opts.padding ?? 0;
		const boundary = resolveBoundaryRect(state, opts.boundary ?? 'viewport', padding);
		const initial = state.placement;
		const candidates = [initial, ...(opts.fallbackPlacements ?? fallbackPlacementsFor(initial))];
		const mainAxis = isVerticalSide(getSide(initial)) ? 'y' : 'x';

		let best: { placement: Placement; coords: Coords; overflow: number } | null = null;
		for (const placement of candidates) {
			const coords = computeCoordsFromPlacement(state.rects.reference, state.rects.floating, placement, state.rtl);
			const floating = { x: coords.x, y: coords.y, width: state.rects.floating.width, height: state.rects.floating.height };
			const overflow = overflowAlong(floating, boundary, mainAxis);
			if (overflow === 0) {
				best = { placement, coords, overflow };
				break;
			}
			if (!best || overflow < best.overflow) best = { placement, coords, overflow };
		}

		if (!best) return;
		// No coordinates: the chain restarts and `offset` re-applies against the chosen side.
		return {
			reset: { placement: best.placement },
			data: { flip: { index: candidates.indexOf(best.placement) } }
		};
	}
});

export const shift = (
	options: ShiftOptions | ((state: MiddlewareState) => ShiftOptions) = {}
): Middleware => ({
	name: 'shift',
	fn(state) {
		const opts = typeof options === 'function' ? options(state) : options;
		const padding = opts.padding ?? 0;
		const boundary = resolveBoundaryRect(state, opts.boundary ?? 'viewport', padding);
		const floating = {
			x: state.x,
			y: state.y,
			width: state.rects.floating.width,
			height: state.rects.floating.height
		};

		let x = state.x;
		let y = state.y;

		if (opts.crossAxis !== false) {
			if (isVerticalSide(getSide(state.placement))) {
				x = clamp(x, boundary.x, boundary.x + boundary.width - floating.width);
			} else {
				y = clamp(y, boundary.y, boundary.y + boundary.height - floating.height);
			}
		}
		if (opts.mainAxis !== false) {
			if (isVerticalSide(getSide(state.placement))) {
				y = clamp(y, boundary.y, boundary.y + boundary.height - floating.height);
			} else {
				x = clamp(x, boundary.x, boundary.x + boundary.width - floating.width);
			}
		}

		if (opts.limiter && (x !== state.x || y !== state.y)) {
			const limited = opts.limiter({ x, y, rects: state.rects });
			x = limited.x;
			y = limited.y;
		}

		return { x, y, data: { shift: { x, y } } };
	}
});

export const arrow = (options: ArrowOptions): Middleware => ({
	name: 'arrow',
	fn(state) {
		const element = options.element;
		if (!element) return;
		const padding = options.padding ?? 0;
		const side = getSide(state.placement);
		const vertical = isVerticalSide(side);
		const arrowRect = element.getBoundingClientRect();
		const arrowSize = vertical ? arrowRect.width : arrowRect.height;
		const floating = state.rects.floating;

		let value: number;
		if (vertical) {
			const referenceCenter = state.rects.reference.x + state.rects.reference.width / 2 - state.x;
			value = referenceCenter - arrowSize / 2;
			value = clamp(value, padding, Math.max(floating.width - arrowSize - padding, padding));
			return { data: { arrow: { x: value, y: 0, centerOffset: value + arrowSize / 2 - floating.width / 2 } } };
		}

		const referenceCenter = state.rects.reference.y + state.rects.reference.height / 2 - state.y;
		value = referenceCenter - arrowSize / 2;
		value = clamp(value, padding, Math.max(floating.height - arrowSize - padding, padding));
		return { data: { arrow: { x: 0, y: value, centerOffset: value + arrowSize / 2 - floating.height / 2 } } };
	}
});

export const size = (options: SizeOptions | ((state: MiddlewareState) => SizeOptions) = {}): Middleware => ({
	name: 'size',
	fn(state) {
		const opts = typeof options === 'function' ? options(state) : options;
		const padding = opts.padding ?? 0;
		const boundary = resolveBoundaryRect(state, opts.boundary ?? 'viewport', padding);
		const floating = state.rects.floating;
		const side = getSide(state.placement);
		const vertical = isVerticalSide(side);

		let availableWidth = boundary.width;
		let availableHeight = boundary.height;
		if (vertical) {
			availableHeight = side === 'top' ? state.rects.reference.y - boundary.y - padding : boundary.y + boundary.height - (state.rects.reference.y + state.rects.reference.height);
		} else {
			availableWidth = side === 'left' ? state.rects.reference.x - boundary.x - padding : boundary.x + boundary.width - (state.rects.reference.x + state.rects.reference.width);
		}

		opts.apply?.({
			availableWidth: Math.floor(Math.max(availableWidth, 0)),
			availableHeight: Math.floor(Math.max(availableHeight, 0)),
			rects: state.rects
		});

		return {
			data: {
				size: {
					availableWidth: Math.floor(Math.max(availableWidth, floating.width)),
					availableHeight: Math.floor(Math.max(availableHeight, floating.height))
				}
			}
		};
	}
});

export const hide = (options: HideOptions = {}): Middleware => ({
	name: 'hide',
	fn(state) {
		const padding = options.padding ?? 0;
		const boundary = resolveBoundaryRect(state, options.boundary ?? 'viewport', padding);
		const reference = state.rects.reference;
		const referenceHidden =
			reference.x + reference.width < boundary.x ||
			reference.x > boundary.x + boundary.width ||
			reference.y + reference.height < boundary.y ||
			reference.y > boundary.y + boundary.height;
		return { data: { hide: { referenceHidden } } };
	}
});

export interface TransformOriginOptions {
	gutter?: number;
	offset?: OffsetOptions;
	overlap?: boolean;
	arrowElement?: HTMLElement | null;
}

export interface TransformOriginState extends MiddlewareState {
	arrow?: Coords | null;
}

// Zag sets `--transform-origin` so an anchored popup scales out of its arrow rather than a corner.
export const transformOrigin = (options: TransformOriginOptions = {}): Middleware => ({
	name: 'transformOrigin',
	fn(state) {
		const side = getSide(state.placement);
		const vertical = isVerticalSide(side);
		const arrowData = state.middlewareData.arrow;
		const arrowElement = options.arrowElement;
		const arrowWidth = arrowElement?.clientWidth ?? 0;
		const arrowHeight = arrowElement?.clientHeight ?? 0;
		const transformX = (arrowData?.x ?? 0) + arrowWidth / 2;
		const transformY = (arrowData?.y ?? 0) + arrowHeight / 2;
		const gutter = options.offset?.mainAxis ?? options.gutter ?? 8;
		const arrowOffset = arrowHeight / 2;
		const sideOffset = typeof gutter === 'number' ? gutter + arrowOffset : arrowOffset;

		const adjacent: Record<Side, string> = {
			top: `${transformX}px calc(100% + ${sideOffset}px)`,
			bottom: `${transformX}px ${-sideOffset}px`,
			left: `calc(100% + ${sideOffset}px) ${transformY}px`,
			right: `${-sideOffset}px ${transformY}px`
		};
		let value = adjacent[side];

		if (options.overlap && vertical) {
			const shiftY = Math.abs(state.middlewareData.shift?.y ?? 0);
			const halfReference = state.rects.reference.height / 2;
			if (shiftY > sideOffset) {
				value = `${transformX}px ${state.rects.reference.y + halfReference - state.y}px`;
			}
		}

		state.elements.floating.style.setProperty('--transform-origin', value);
		return { data: { transformOrigin: value } };
	}
});

const middlewareRects: Middleware = {
	name: 'rects',
	fn: (state) => ({ data: { rects: state.rects } })
};

function getWindowOf(element: Element): Window {
	return element.ownerDocument.defaultView ?? window;
}

export interface ComputePositionOptions {
	placement?: Placement;
	strategy?: Strategy;
	middleware?: Middleware[];
	rtl?: boolean;
}

export interface ComputePositionResult {
	x: number;
	y: number;
	placement: Placement;
	strategy: Strategy;
	middlewareData: MiddlewareData;
}

function positionedAncestor(element: HTMLElement | null): HTMLElement | null {
	let current = element?.parentElement ?? null;
	while (current) {
		const style = current.ownerDocument.defaultView?.getComputedStyle(current);
		if (
			style &&
			(style.position !== 'static' ||
				style.transform !== 'none' ||
				style.filter !== 'none' ||
				style.perspective !== 'none')
		) {
			return current;
		}
		current = current.parentElement;
	}
	return null;
}

/** Where the offset parent's coordinate origin sits in viewport coordinates. */
export function getCoordinateOrigin(floating: HTMLElement, strategy: Strategy): Coords {
	const doc = floating.ownerDocument;
	const win = doc.defaultView ?? window;
	if (strategy === 'fixed') return { x: 0, y: 0 };

	const ancestor = positionedAncestor(floating);
	if (!ancestor || ancestor === doc.documentElement || ancestor === doc.body) {
		return { x: win.scrollX, y: win.scrollY };
	}

	// A positioned ancestor is the coordinate origin for its absolutely positioned children, so its
	// viewport offset is subtracted rather than added.
	const rect = ancestor.getBoundingClientRect();
	return {
		x: -(rect.x + ancestor.clientLeft),
		y: -(rect.y + ancestor.clientTop)
	};
}

export function computePosition(
	reference: Element,
	floating: HTMLElement,
	options: ComputePositionOptions = {}
): ComputePositionResult {
	const strategy = options.strategy ?? 'absolute';
	const rtl = options.rtl ?? false;
	const middleware = [...(options.middleware ?? [])];

	const referenceRect = getElementRect(reference);
	const floatingRect: Rect = {
		x: 0,
		y: 0,
		width: floating.offsetWidth || floating.getBoundingClientRect().width,
		height: floating.offsetHeight || floating.getBoundingClientRect().height
	};

	let placement = options.placement ?? 'bottom';
	const state: MiddlewareState = {
		placement,
		strategy,
		rects: { reference: referenceRect, floating: floatingRect },
		elements: { reference, floating },
		middlewareData: {},
		x: 0,
		y: 0,
		rtl
	};

	// A middleware may ask for a different placement (flip does). floating-ui restarts the whole
	// chain in that case, so the offset middleware re-applies against the new side.
	for (let attempt = 0; attempt < 6; attempt += 1) {
		const initial = computeCoordsFromPlacement(referenceRect, floatingRect, placement, rtl);
		state.x = initial.x;
		state.y = initial.y;
		state.placement = placement;
		state.middlewareData = {};

		let resetTo: Placement | undefined;
		for (const item of middleware) {
			const result = item.fn(state);
			if (!result) continue;
			if (result.reset?.placement && result.reset.placement !== placement) {
				resetTo = result.reset.placement;
				break;
			}
			if (result.x != null) state.x = result.x;
			if (result.y != null) state.y = result.y;
			if (result.data) state.middlewareData = { ...state.middlewareData, ...result.data };
		}

		if (!resetTo) break;
		placement = resetTo;
	}

	state.middlewareData = { ...middlewareRects.fn(state)?.data, ...state.middlewareData };

	const origin = getCoordinateOrigin(floating, strategy);

	return {
		x: state.x + origin.x,
		y: state.y + origin.y,
		placement: state.placement,
		strategy,
		middlewareData: state.middlewareData
	};
}

export interface AutoUpdateOptions {
	ancestorResize?: boolean;
	ancestorScroll?: boolean;
	elementResize?: boolean;
}

export function autoUpdate(
	reference: Element,
	floating: HTMLElement,
	update: () => void,
	options: AutoUpdateOptions = {}
): () => void {
	const { ancestorResize = true, ancestorScroll = true, elementResize = true } = options;
	const win = getWindowOf(floating);
	const doc = floating.ownerDocument;
	const cleanups: (() => void)[] = [];

	const ResizeObserverCtor = (win as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
	if (elementResize && typeof ResizeObserverCtor === 'function') {
		const observer = new ResizeObserverCtor(() => update());
		observer.observe(reference);
		observer.observe(floating);
		cleanups.push(() => observer.disconnect());
	}

	if (ancestorScroll || ancestorResize) {
		const ancestors: (Element | Window)[] = [floating, reference];
		let parent: Element | null = floating.parentElement;
		while (parent && parent !== doc.body) {
			ancestors.push(parent);
			parent = parent.parentElement;
		}
		for (const ancestor of ancestors) {
			if (ancestorScroll) {
				ancestor.addEventListener('scroll', update, { passive: true });
				cleanups.push(() => ancestor.removeEventListener('scroll', update));
			}
			if (ancestorResize && ancestor !== floating && ancestor !== reference && ResizeObserverCtor) {
				const ro = new ResizeObserverCtor(() => update());
				ro.observe(ancestor as Element);
				cleanups.push(() => ro.disconnect());
			}
		}
		if (ancestorScroll) {
			win.addEventListener('scroll', update, { passive: true });
			win.addEventListener('resize', update);
			cleanups.push(() => {
				win.removeEventListener('scroll', update);
				win.removeEventListener('resize', update);
			});
		}
	}

	return () => {
		for (const cleanup of cleanups) cleanup();
	};
}
