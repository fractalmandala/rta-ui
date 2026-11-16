// Svelte binding for the positioning engine. Mirrors Zag's popper package: `getPlacement` returns a
// cleanup and writes the CSS custom properties the positioner transform reads, so the style strings
// here are the Ark/Zag contract rather than a local choice.
import {
	arrow,
	autoUpdate,
	computePosition,
	flip,
	hide,
	offset,
	shift,
	size,
	transformOrigin,
	type Alignment,
	type Boundary,
	type OffsetOptions,
	type Placement,
	type Strategy
} from './position.js';

export type { Placement, Strategy, Alignment };

export interface PositionOptions {
	strategy?: Strategy;
	placement?: Placement;
	gutter?: number;
	offset?: OffsetOptions;
	flip?: boolean | Placement[];
	slide?: boolean;
	overlap?: boolean;
	sameWidth?: boolean;
	fitViewport?: boolean;
	overflowPadding?: number;
	arrowPadding?: number;
	arrowElement?: HTMLElement | null;
	boundary?: Boundary;
	hideWhenDetached?: boolean;
	listeners?: boolean;
	applyStyles?: boolean;
	rtl?: boolean;
	onComplete?: (result: { x: number; y: number; placement: Placement }) => void;
}

const round = (win: Window, value: number) => {
	const ratio = win.devicePixelRatio || 1;
	return Math.round(value * ratio) / ratio;
};

/** Positioner style: identical declarations and order to Zag's `getPlacementStyles().floating`. */
export function floatingStyle(options: {
	strategy?: Strategy;
	placement?: Placement;
	sameWidth?: boolean;
	fitViewport?: boolean;
	applyStyles?: boolean;
} = {}): string {
	const { placement, sameWidth, fitViewport, strategy = 'absolute', applyStyles = true } = options;
	const declarations = [
		`position: ${strategy}`,
		'isolation: isolate',
		sameWidth ? undefined : 'min-width: max-content',
		sameWidth ? 'width: var(--reference-width)' : undefined,
		fitViewport ? 'max-width: var(--available-width)' : undefined,
		fitViewport ? 'max-height: var(--available-height)' : undefined,
		placement ? undefined : 'pointer-events: none',
		'top: 0px',
		'left: 0px',
		placement
			? 'transform: translate3d(var(--x, 0), var(--y, -100vh), 0)'
			: 'transform: translate3d(0, -100vh, 0)',
		applyStyles === false ? 'z-index: var(--z-index)' : undefined
	];
	return `${declarations.filter(Boolean).join('; ')};`;
}

/** Arrow style: `--arrow-size` / `--arrow-size-half` / `--arrow-offset`, as Zag emits them. */
export const arrowStyle =
	'position: absolute; width: var(--arrow-size); height: var(--arrow-size); --arrow-size-half: calc(var(--arrow-size) / 2); --arrow-offset: calc(var(--arrow-size-half) * -1);';

const arrowTipRotation: Record<string, string> = {
	top: 'rotate(45deg)',
	bottom: 'rotate(225deg)',
	left: 'rotate(135deg)',
	right: 'rotate(315deg)'
};

export function arrowTipStyle(placement?: Placement): string {
	const side = placement?.split('-')[0] ?? '';
	const rotate = arrowTipRotation[side];
	return [
		rotate ? `transform: ${rotate}` : undefined,
		'background: var(--arrow-background)',
		'top: 0',
		'left: 0',
		'width: 100%',
		'height: 100%',
		'position: absolute',
		'z-index: inherit'
	]
		.filter(Boolean)
		.join('; ')
		.concat(';');
}

export type AnchorLike = Element | { getBoundingClientRect: () => DOMRect } | null;

function asReference(anchor: AnchorLike): Element | null {
	if (!anchor) return null;
	if (anchor instanceof Element) return anchor;
	return anchor as unknown as Element;
}

/**
 * Positions `floating` against `anchor`, writing Zag's custom properties. Returns a cleanup that
 * detaches the observers and listeners it installed.
 */
export function getPlacement(
	anchor: AnchorLike | (() => AnchorLike),
	floating: HTMLElement | null | (() => HTMLElement | null),
	options: PositionOptions = {}
): () => void {
	const resolveAnchor = () => (typeof anchor === 'function' ? anchor() : anchor);
	const resolveFloating = () => (typeof floating === 'function' ? floating() : floating);

	const reference = asReference(resolveAnchor());
	const element = resolveFloating();
	if (!reference || !element) return () => {};

	let lastX: number | undefined;
	let lastY: number | undefined;
	let lastZIndex: string | undefined;
	let disposed = false;

	const update = () => {
		if (disposed) return;
		const reference = asReference(resolveAnchor());
		const element = resolveFloating();
		if (!reference || !element) return;

		const arrowElement = options.arrowElement ?? (element.querySelector('[data-part="arrow"]') as HTMLElement | null);
		const result = computePosition(reference, element, {
			placement: options.placement ?? 'bottom',
			strategy: options.strategy ?? 'absolute',
			rtl: options.rtl ?? false,
			middleware: [
				offset({ mainAxis: options.gutter ?? 8, crossAxis: 0, alignmentAxis: options.slide ? 0 : undefined }),
				options.flip === false
					? undefined
					: flip({
							padding: options.overflowPadding ?? 8,
							fallbackPlacements: Array.isArray(options.flip) ? options.flip : undefined,
							boundary: options.boundary
						}),
				options.slide || options.overlap
					? shift({
							mainAxis: options.slide,
							crossAxis: options.overlap,
							padding: options.overflowPadding ?? 8,
							boundary: options.boundary
						})
					: undefined,
				arrow({ element: arrowElement, padding: options.arrowPadding ?? 4 }),
				transformOrigin({ gutter: options.gutter, offset: options.offset, overlap: options.overlap, arrowElement }),
				size({
					padding: options.overflowPadding ?? 8,
					boundary: options.boundary,
					apply: ({ availableHeight, availableWidth, rects }) => {
						element.style.setProperty('--reference-width', `${Math.round(rects.reference.width)}px`);
						element.style.setProperty('--reference-height', `${Math.round(rects.reference.height)}px`);
						element.style.setProperty('--available-width', `${Math.floor(availableWidth)}px`);
						element.style.setProperty('--available-height', `${Math.floor(availableHeight)}px`);
					}
				}),
				options.hideWhenDetached ? hide({ padding: 0, boundary: options.boundary }) : undefined
			].filter((item): item is NonNullable<typeof item> => Boolean(item))
		});

		const win = element.ownerDocument.defaultView ?? window;
		const x = round(win, result.x);
		const y = round(win, result.y);

		options.onComplete?.({ x, y, placement: result.placement });

		if (options.applyStyles === false) return;

		if (lastX === undefined || Math.abs(lastX - x) >= 0.5) {
			element.style.setProperty('--x', `${x}px`);
			lastX = x;
		}
		if (lastY === undefined || Math.abs(lastY - y) >= 0.5) {
			element.style.setProperty('--y', `${y}px`);
			lastY = y;
		}
		if (options.hideWhenDetached) {
			if (result.middlewareData.hide?.referenceHidden) {
				element.style.setProperty('visibility', 'hidden');
				element.style.setProperty('pointer-events', 'none');
			} else {
				element.style.removeProperty('visibility');
				element.style.removeProperty('pointer-events');
			}
		}

		const arrowData = result.middlewareData.arrow;
		if (arrowElement && arrowData) {
			const side = result.placement.split('-')[0];
			if (arrowData.x != null) arrowElement.style.left = `${arrowData.x}px`;
			if (arrowData.y != null) arrowElement.style.top = `${arrowData.y}px`;
			arrowElement.style[side as 'top' | 'left'] = 'calc(100% + var(--arrow-offset))';
		}

		const content = element.firstElementChild;
		if (content && lastZIndex === undefined) {
			const zIndex = win.getComputedStyle(content).zIndex;
			if (zIndex !== 'auto') {
				element.style.setProperty('--z-index', zIndex);
				element.style.setProperty('z-index', 'var(--z-index)');
			}
			lastZIndex = zIndex;
		}
	};

	update();

	const stopAutoUpdate =
		options.listeners === false
			? () => {}
			: autoUpdate(reference, element, update, {
					ancestorResize: true,
					ancestorScroll: true,
					elementResize: true
				});

	return () => {
		disposed = true;
		stopAutoUpdate();
	};
}

export type Side = 'top' | 'right' | 'bottom' | 'left';

export function getSide(placement: Placement): Side {
	return placement.split('-')[0] as Side;
}

export function getOppositeSide(placement: Placement): Placement {
	const opposite: Record<Side, Side> = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' };
	const side = getSide(placement);
	const alignment = placement.split('-')[1];
	return (alignment ? `${opposite[side]}-${alignment}` : opposite[side]) as Placement;
}
