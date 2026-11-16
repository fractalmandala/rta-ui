import { createContext } from '../../internal/context';
import { dataAttr, toPx } from '../../internal/dom';

export const MIN_THUMB_SIZE = 20;
export const SCROLL_TIMEOUT = 1000;

export type ScrollAreaOrientation = 'vertical' | 'horizontal';
export type ScrollAreaEdge = 'top' | 'right' | 'bottom' | 'left';

export interface ScrollAreaElementIds {
	root?: string;
	viewport?: string;
	content?: string;
}

export interface ScrollAreaScrollbarOptions {
	orientation?: ScrollAreaOrientation;
}

export interface ScrollAreaScrollToDetails {
	top?: number;
	left?: number;
	behavior?: ScrollBehavior;
	easing?: (value: number) => number;
	duration?: number;
}

export interface ScrollAreaScrollToEdgeDetails {
	edge: ScrollAreaEdge;
	behavior?: ScrollBehavior;
	easing?: (value: number) => number;
	duration?: number;
}

export interface ScrollAreaScrollProgress {
	x: number;
	y: number;
}

export interface ScrollAreaScrollbarState {
	hovering: boolean;
	dragging: boolean;
	scrolling: boolean;
	hidden: boolean;
}

export interface UseScrollAreaProps {
	id?: string | null;
	ids?: ScrollAreaElementIds;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	getRootNode?: () => ShadowRoot | Document | Node;
}

export interface ScrollAreaApi {
	readonly isAtTop: boolean;
	readonly isAtBottom: boolean;
	readonly isAtLeft: boolean;
	readonly isAtRight: boolean;
	readonly hasOverflowX: boolean;
	readonly hasOverflowY: boolean;
	getScrollProgress(): ScrollAreaScrollProgress;
	scrollTo(details?: ScrollAreaScrollToDetails): void;
	scrollToEdge(details: ScrollAreaScrollToEdgeDetails): void;
	getScrollbarState(options?: ScrollAreaScrollbarOptions): ScrollAreaScrollbarState;
	measure(): void;
	rootAttrs(): Record<string, unknown>;
	viewportAttrs(): Record<string, unknown>;
	contentAttrs(): Record<string, unknown>;
	scrollbarAttrs(options?: ScrollAreaScrollbarOptions): Record<string, unknown>;
	thumbAttrs(options?: ScrollAreaScrollbarOptions): Record<string, unknown>;
	cornerAttrs(): Record<string, unknown>;
	registerRoot(node: globalThis.Element | null): void;
	registerViewport(node: globalThis.Element | null): void;
	registerContent(node: globalThis.Element | null): void;
	registerScrollbar(node: globalThis.Element | null, orientation: ScrollAreaOrientation): void;
	registerThumb(node: globalThis.Element | null, orientation: ScrollAreaOrientation): void;
	registerCorner(node: globalThis.Element | null): void;
}

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function px(value: string | undefined): number {
	const parsed = Number.parseFloat(value ?? '');
	return Number.isFinite(parsed) ? parsed : 0;
}

function styleValue(node: globalThis.Element | null, property: string): number {
	if (!node || typeof getComputedStyle !== 'function') return 0;
	return px(getComputedStyle(node).getPropertyValue(property) ?? '');
}

function scrollOffset(node: globalThis.Element | null, kind: 'padding' | 'margin', axis: 'x' | 'y') {
	if (!node) return 0;
	const block = axis === 'x' ? 'Inline' : 'Block';
	if (axis === 'x' && kind === 'margin') {
		return styleValue(node, `${kind}-inline-start`) * 2;
	}
	return styleValue(node, `${kind}-${block.toLowerCase()}-start`) + styleValue(node, `${kind}-${block.toLowerCase()}-end`);
}

function getScrollSides(node: HTMLElement, dir: 'ltr' | 'rtl' | 'auto' | null | undefined) {
	const threshold = 1;
	const hasVerticalScroll = node.scrollHeight - node.clientHeight > threshold;
	const hasHorizontalScroll = node.scrollWidth - node.clientWidth > threshold;
	const maxScrollLeft = node.scrollWidth - node.clientWidth;
	const maxScrollTop = node.scrollHeight - node.clientHeight;
	const isRtl = dir === 'rtl';

	let atLeft = false;
	let atRight = false;
	let atTop = false;
	let atBottom = false;

	if (hasHorizontalScroll) {
		const scrollLeft = node.scrollLeft;
		if (isRtl) {
			if (scrollLeft <= 0) {
				atLeft = Math.abs(scrollLeft) >= maxScrollLeft - threshold;
				atRight = Math.abs(scrollLeft) <= threshold;
			} else {
				atLeft = scrollLeft <= threshold;
				atRight = scrollLeft >= maxScrollLeft - threshold;
			}
		} else {
			atLeft = scrollLeft <= threshold;
			atRight = scrollLeft >= maxScrollLeft - threshold;
		}
	}

	if (hasVerticalScroll) {
		atTop = node.scrollTop <= threshold;
		atBottom = node.scrollTop >= maxScrollTop - threshold;
	}

	return { top: atTop, right: atRight, bottom: atBottom, left: atLeft };
}

function getScrollProgress(node: HTMLElement | null): ScrollAreaScrollProgress {
	if (!node) return { x: 0, y: 0 };
	let x = 0;
	let y = 0;
	const maxScrollX = node.scrollWidth - node.clientWidth;
	if (maxScrollX > 0) x = clamp(node.scrollLeft / maxScrollX, 0, 1);
	const maxScrollY = node.scrollHeight - node.clientHeight;
	if (maxScrollY > 0) y = clamp(node.scrollTop / maxScrollY, 0, 1);
	return { x, y };
}

function smoothScroll(
	node: HTMLElement,
	details: ScrollAreaScrollToDetails,
	easing: (value: number) => number = (value) => value,
	duration = 400
) {
	const start = { top: node.scrollTop, left: node.scrollLeft };
	const target = {
		top: details.top ?? start.top,
		left: details.left ?? start.left
	};
	const delta = { top: target.top - start.top, left: target.left - start.left };
	if (!delta.top && !delta.left) return;

	const win = node.ownerDocument.defaultView;
	if (!win?.requestAnimationFrame) {
		node.scrollTo({ ...target, behavior: 'auto' });
		return;
	}

	const startTime = win.performance.now();
	const step = (now: number) => {
		const progress = Math.min(1, (now - startTime) / duration);
		const eased = easing(progress);
		node.scrollTop = start.top + delta.top * eased;
		node.scrollLeft = start.left + delta.left * eased;
		if (progress < 1) win.requestAnimationFrame(step);
	};
	win.requestAnimationFrame(step);
}

const scrollAreaContext = createContext<ScrollAreaApi>('ScrollArea', 'ScrollArea.Root');
export const useScrollAreaContext = () => scrollAreaContext.get();
export const setScrollAreaContext = (api: ScrollAreaApi) => scrollAreaContext.set(api);

export function createScrollArea(
	getProps: () => UseScrollAreaProps,
	uid: string
): ScrollAreaApi {
	const rootId = () => getProps().ids?.root ?? `scroll-area-${getProps().id ?? uid}`;
	const viewportId = () => getProps().ids?.viewport ?? `scroll-area-${getProps().id ?? uid}:viewport`;
	const contentId = () => getProps().ids?.content ?? `scroll-area-${getProps().id ?? uid}:content`;

	let viewportNode: HTMLElement | null = null;
	let contentNode: HTMLElement | null = null;
	let cornerNode: globalThis.Element | null = null;
	const scrollbars: Record<ScrollAreaOrientation, HTMLElement | null> = {
		vertical: null,
		horizontal: null
	};
	const thumbs: Record<ScrollAreaOrientation, HTMLElement | null> = {
		vertical: null,
		horizontal: null
	};

	let atSides = $state({ top: true, right: false, bottom: false, left: true });
	let hiddenState = $state({ scrollbarYHidden: false, scrollbarXHidden: false, cornerHidden: false });
	let thumbSize = $state({ width: 0, height: 0 });
	let cornerSize = $state({ width: 0, height: 0 });
	let hovering = $state(false);
	let scrollingX = $state(false);
	let scrollingY = $state(false);
	let draggingOrientation = $state<ScrollAreaOrientation | null>(null);

	let startPoint = { x: 0, y: 0 };
	let startScroll = { top: 0, left: 0 };
	let scrollPosition = { x: 0, y: 0 };
	let scrollXTimeout: ReturnType<typeof setTimeout> | undefined;
	let scrollYTimeout: ReturnType<typeof setTimeout> | undefined;
	let detachPointerMove: (() => void) | undefined;

	function sameHidden(a: typeof hiddenState, b: typeof hiddenState) {
		return (
			a.scrollbarXHidden === b.scrollbarXHidden &&
			a.scrollbarYHidden === b.scrollbarYHidden &&
			a.cornerHidden === b.cornerHidden
		);
	}

	function measure() {
		const viewport = viewportNode;
		if (!viewport) return;
		const scrollableContentHeight = viewport.scrollHeight;
		const scrollableContentWidth = viewport.scrollWidth;
		if (!scrollableContentHeight || !scrollableContentWidth) return;

		const viewportHeight = viewport.clientHeight;
		const viewportWidth = viewport.clientWidth;
		const scrollbarYHidden = viewportHeight >= scrollableContentHeight;
		const scrollbarXHidden = viewportWidth >= scrollableContentWidth;

		const ratioX = viewportWidth / scrollableContentWidth;
		const ratioY = viewportHeight / scrollableContentHeight;
		const nextWidth = scrollbarXHidden ? 0 : viewportWidth;
		const nextHeight = scrollbarYHidden ? 0 : viewportHeight;

		const scrollbarY = scrollbars.vertical;
		const scrollbarX = scrollbars.horizontal;
		const thumbY = thumbs.vertical;
		const thumbX = thumbs.horizontal;

		const scrollbarXOffset = scrollOffset(scrollbarX, 'padding', 'x');
		const scrollbarYOffset = scrollOffset(scrollbarY, 'padding', 'y');
		const thumbXOffset = scrollOffset(thumbX, 'margin', 'x');
		const thumbYOffset = scrollOffset(thumbY, 'margin', 'y');

		const idealNextWidth = nextWidth - scrollbarXOffset - thumbXOffset;
		const idealNextHeight = nextHeight - scrollbarYOffset - thumbYOffset;
		const maxNextWidth = scrollbarX
			? Math.min(scrollbarX.offsetWidth, idealNextWidth)
			: idealNextWidth;
		const maxNextHeight = scrollbarY
			? Math.min(scrollbarY.offsetHeight, idealNextHeight)
			: idealNextHeight;

		const clampedNextWidth = Math.max(MIN_THUMB_SIZE, maxNextWidth * ratioX);
		const clampedNextHeight = Math.max(MIN_THUMB_SIZE, maxNextHeight * ratioY);

		if (thumbSize.width !== clampedNextWidth || thumbSize.height !== clampedNextHeight) {
			thumbSize = { width: clampedNextWidth, height: clampedNextHeight };
		}

		if (scrollbarY && thumbY) {
			const maxThumbOffsetY = scrollbarY.offsetHeight - clampedNextHeight - scrollbarYOffset - thumbYOffset;
			const scrollRatioY = viewport.scrollTop / (scrollableContentHeight - viewportHeight);
			const thumbOffsetY = Math.min(maxThumbOffsetY, Math.max(0, scrollRatioY * maxThumbOffsetY));
			thumbY.style.transform = `translate3d(0,${Number.isFinite(thumbOffsetY) ? thumbOffsetY : 0}px,0)`;
		}

		if (scrollbarX && thumbX) {
			const maxThumbOffsetX = scrollbarX.offsetWidth - clampedNextWidth - scrollbarXOffset - thumbXOffset;
			const scrollRatioX = viewport.scrollLeft / (scrollableContentWidth - viewportWidth);
			const isRtl = getProps().dir === 'rtl';
			const thumbOffsetX = isRtl
				? clamp(scrollRatioX * maxThumbOffsetX, -maxThumbOffsetX, 0)
				: clamp(scrollRatioX * maxThumbOffsetX, 0, maxThumbOffsetX);
			thumbX.style.transform = `translate3d(${Number.isFinite(thumbOffsetX) ? thumbOffsetX : 0}px,0,0)`;
		}

		if (cornerNode) {
			if (scrollbarXHidden || scrollbarYHidden) {
				if (cornerSize.width || cornerSize.height) cornerSize = { width: 0, height: 0 };
			} else {
				const nextCornerSize = {
					width: scrollbarY?.offsetWidth ?? 0,
					height: scrollbarX?.offsetHeight ?? 0
				};
				if (cornerSize.width !== nextCornerSize.width || cornerSize.height !== nextCornerSize.height) {
					cornerSize = nextCornerSize;
				}
			}
		}

		const nextHiddenState = {
			scrollbarYHidden,
			scrollbarXHidden,
			cornerHidden: scrollbarYHidden || scrollbarXHidden
		};
		if (!sameHidden(hiddenState, nextHiddenState)) hiddenState = nextHiddenState;

		const nextAtSides = getScrollSides(viewport, getProps().dir);
		if (
			nextAtSides.top !== atSides.top ||
			nextAtSides.right !== atSides.right ||
			nextAtSides.bottom !== atSides.bottom ||
			nextAtSides.left !== atSides.left
		) {
			atSides = nextAtSides;
		}

		const maxScrollTop = Math.max(0, scrollableContentHeight - viewportHeight);
		const maxScrollLeft = Math.max(0, scrollableContentWidth - viewportWidth);
		let scrollLeftFromStart = 0;
		let scrollLeftFromEnd = 0;
		if (!scrollbarXHidden) {
			scrollLeftFromStart =
				getProps().dir === 'rtl'
					? clamp(-viewport.scrollLeft, 0, maxScrollLeft)
					: clamp(viewport.scrollLeft, 0, maxScrollLeft);
			scrollLeftFromEnd = maxScrollLeft - scrollLeftFromStart;
		}
		const scrollTopFromStart = scrollbarYHidden ? 0 : clamp(viewport.scrollTop, 0, maxScrollTop);
		const scrollTopFromEnd = scrollbarYHidden ? 0 : maxScrollTop - scrollTopFromStart;

		viewport.style.setProperty('--scroll-area-overflow-x-start', `${scrollLeftFromStart}px`);
		viewport.style.setProperty('--scroll-area-overflow-x-end', `${scrollLeftFromEnd}px`);
		viewport.style.setProperty('--scroll-area-overflow-y-start', `${scrollTopFromStart}px`);
		viewport.style.setProperty('--scroll-area-overflow-y-end', `${scrollTopFromEnd}px`);
	}

	function setScrolling(node: HTMLElement) {
		const next = { x: node.scrollLeft, y: node.scrollTop };
		const offsetX = next.x - scrollPosition.x;
		const offsetY = next.y - scrollPosition.y;
		scrollPosition = next;

		const nextAtSides = getScrollSides(node, getProps().dir);
		if (
			nextAtSides.top !== atSides.top ||
			nextAtSides.right !== atSides.right ||
			nextAtSides.bottom !== atSides.bottom ||
			nextAtSides.left !== atSides.left
		) {
			atSides = nextAtSides;
		}

		if (offsetY !== 0) {
			scrollingY = true;
			clearTimeout(scrollYTimeout);
			scrollYTimeout = setTimeout(() => {
				scrollingY = false;
			}, SCROLL_TIMEOUT);
		}
		if (offsetX !== 0) {
			scrollingX = true;
			clearTimeout(scrollXTimeout);
			scrollXTimeout = setTimeout(() => {
				scrollingX = false;
			}, SCROLL_TIMEOUT);
		}
	}

	function stopDragging() {
		detachPointerMove?.();
		detachPointerMove = undefined;
		draggingOrientation = null;
	}

	function startDragging(orientation: ScrollAreaOrientation, point: { x: number; y: number }) {
		startPoint = point;
		startScroll = {
			top: viewportNode?.scrollTop ?? 0,
			left: viewportNode?.scrollLeft ?? 0
		};
		draggingOrientation = orientation;

		const doc = viewportNode?.ownerDocument ?? document;
		const move = (event: PointerEvent) => {
			const viewport = viewportNode;
			if (!viewport) return;
			const deltaX = event.clientX - startPoint.x;
			const deltaY = event.clientY - startPoint.y;

			if (orientation === 'vertical' && thumbs.vertical && scrollbars.vertical) {
				const scrollbarOffset = scrollOffset(scrollbars.vertical, 'padding', 'y');
				const thumbOffset = scrollOffset(thumbs.vertical, 'margin', 'y');
				const track =
					scrollbars.vertical.offsetHeight -
					thumbs.vertical.offsetHeight -
					scrollbarOffset -
					thumbOffset;
				if (track) {
					viewport.scrollTop =
						startScroll.top +
						(deltaY / track) * (viewport.scrollHeight - viewport.clientHeight);
				}
				scrollingY = true;
				clearTimeout(scrollYTimeout);
				scrollYTimeout = setTimeout(() => {
					scrollingY = false;
				}, SCROLL_TIMEOUT);
			}

			if (orientation === 'horizontal' && thumbs.horizontal && scrollbars.horizontal) {
				const scrollbarOffset = scrollOffset(scrollbars.horizontal, 'padding', 'x');
				const thumbOffset = scrollOffset(thumbs.horizontal, 'margin', 'x');
				const track =
					scrollbars.horizontal.offsetWidth -
					thumbs.horizontal.offsetWidth -
					scrollbarOffset -
					thumbOffset;
				if (track) {
					viewport.scrollLeft =
						startScroll.left +
						(deltaX / track) * (viewport.scrollWidth - viewport.clientWidth);
				}
				scrollingX = true;
				clearTimeout(scrollXTimeout);
				scrollXTimeout = setTimeout(() => {
					scrollingX = false;
				}, SCROLL_TIMEOUT);
			}

			measure();
		};

		const up = () => {
			stopDragging();
			measure();
		};

		doc.addEventListener('pointermove', move);
		doc.addEventListener('pointerup', up);
		detachPointerMove = () => {
			doc.removeEventListener('pointermove', move);
			doc.removeEventListener('pointerup', up);
		};
	}

	function scrollToDetails(node: HTMLElement, details: ScrollAreaScrollToDetails) {
		const { behavior = 'smooth', easing, duration } = details;
		if (behavior === 'smooth') {
			smoothScroll(node, details, easing, duration);
			return;
		}
		const options: ScrollToOptions = { behavior };
		if (details.top !== undefined) options.top = details.top;
		if (details.left !== undefined) options.left = details.left;
		node.scrollTo(options);
	}

	return {
		get isAtTop() {
			return atSides.top;
		},
		get isAtBottom() {
			return atSides.bottom;
		},
		get isAtLeft() {
			return atSides.left;
		},
		get isAtRight() {
			return atSides.right;
		},
		get hasOverflowX() {
			return !hiddenState.scrollbarXHidden;
		},
		get hasOverflowY() {
			return !hiddenState.scrollbarYHidden;
		},
		getScrollProgress: () => getScrollProgress(viewportNode),
		scrollTo: (details = {}) => {
			if (viewportNode) scrollToDetails(viewportNode, details);
		},
		scrollToEdge: ({ edge, behavior = 'smooth', easing, duration }) => {
			const node = viewportNode;
			if (!node) return;
			const maxLeft = node.scrollWidth - node.clientWidth;
			const maxTop = node.scrollHeight - node.clientHeight;
			const isRtl = getProps().dir === 'rtl';
			let top: number | undefined;
			let left: number | undefined;

			switch (edge) {
				case 'top':
					top = 0;
					break;
				case 'bottom':
					top = maxTop;
					break;
				case 'left':
					left = isRtl ? (node.scrollLeft <= 0 ? -maxLeft : 0) : 0;
					break;
				case 'right':
					left = isRtl ? (node.scrollLeft <= 0 ? 0 : maxLeft) : maxLeft;
					break;
			}

			scrollToDetails(node, { top, left, behavior, easing, duration });
		},
		getScrollbarState: ({ orientation = 'vertical' } = {}) => {
			const horizontal = orientation === 'horizontal';
			return {
				hovering,
				dragging: draggingOrientation === orientation,
				scrolling: horizontal ? scrollingX : scrollingY,
				hidden: horizontal ? hiddenState.scrollbarXHidden : hiddenState.scrollbarYHidden
			};
		},
		measure,
		rootAttrs: () =>
			dropUndefined({
				id: rootId(),
				role: 'presentation',
				dir: getProps().dir ?? undefined,
				'data-overflow-x': dataAttr(!hiddenState.scrollbarXHidden),
				'data-overflow-y': dataAttr(!hiddenState.scrollbarYHidden),
				style: `position: relative; --corner-width: ${toPx(cornerSize.width)}; --corner-height: ${toPx(cornerSize.height)}; --thumb-width: ${toPx(thumbSize.width)}; --thumb-height: ${toPx(thumbSize.height)};`,
				onpointerenter(event: PointerEvent) {
					if (!(event.currentTarget as globalThis.Element).contains(event.target as Node)) return;
					hovering = true;
				},
				onpointermove(event: PointerEvent) {
					if (!(event.currentTarget as globalThis.Element).contains(event.target as Node)) return;
					hovering = true;
				},
				onpointerdown() {
					measure();
				},
				onpointerleave(event: PointerEvent) {
					const current = getProps().getRootNode?.() ?? undefined;
					void current;
					if ((event.currentTarget as globalThis.Element).contains(event.relatedTarget as Node)) return;
					hovering = false;
				}
			}),
		viewportAttrs: () => {
			const handleUserInteraction = () => measure();
			return dropUndefined({
				id: viewportId(),
				role: 'presentation',
				'data-ownedby': rootId(),
				'data-at-top': dataAttr(atSides.top),
				'data-at-bottom': dataAttr(atSides.bottom),
				'data-at-left': dataAttr(atSides.left),
				'data-at-right': dataAttr(atSides.right),
				'data-overflow-x': dataAttr(!hiddenState.scrollbarXHidden),
				'data-overflow-y': dataAttr(!hiddenState.scrollbarYHidden),
				tabindex: hiddenState.scrollbarXHidden || hiddenState.scrollbarYHidden ? undefined : 0,
				style: 'overflow: auto;',
				onscroll(event: Event & { currentTarget: HTMLElement }) {
					setScrolling(event.currentTarget);
					measure();
				},
				onwheel: handleUserInteraction,
				ontouchmove: handleUserInteraction,
				onpointermove: handleUserInteraction,
				onpointerenter: handleUserInteraction,
				onkeydown: handleUserInteraction
			});
		},
		contentAttrs: () =>
			dropUndefined({
				id: contentId(),
				role: 'presentation',
				'data-overflow-x': dataAttr(!hiddenState.scrollbarXHidden),
				'data-overflow-y': dataAttr(!hiddenState.scrollbarYHidden),
				style: 'min-width: fit-content;'
			}),
		scrollbarAttrs: ({ orientation = 'vertical' } = {}) => {
			const horizontal = orientation === 'horizontal';
			return dropUndefined({
				'data-ownedby': rootId(),
				'data-orientation': orientation,
				'data-scrolling': dataAttr(horizontal ? scrollingX : scrollingY),
				'data-hover': dataAttr(hovering),
				'data-dragging': dataAttr(draggingOrientation === orientation),
				'data-overflow-x': dataAttr(!hiddenState.scrollbarXHidden),
				'data-overflow-y': dataAttr(!hiddenState.scrollbarYHidden),
				style: horizontal
					? 'position: absolute; touch-action: none; user-select: none; -webkit-user-select: none; inset-inline-start: 0; inset-inline-end: var(--corner-width); bottom: 0;'
					: 'position: absolute; touch-action: none; user-select: none; -webkit-user-select: none; top: 0; bottom: var(--corner-height); inset-inline-end: 0;',
				onpointerup() {
					if (draggingOrientation === orientation) stopDragging();
				},
				onpointerdown(event: PointerEvent) {
					if (event.button !== 0) return;
					if (event.currentTarget !== event.target) return;
					const node = viewportNode;
					const scrollbar = event.currentTarget as HTMLElement;
					const thumb = thumbs[orientation];
					if (!node || !thumb) return;

					if (orientation === 'vertical') {
						const thumbOffset = scrollOffset(thumb, 'margin', 'y');
						const scrollbarOffset = scrollOffset(scrollbar, 'padding', 'y');
						const rect = scrollbar.getBoundingClientRect();
						const clickY =
							event.clientY - rect.top - thumb.offsetHeight / 2 - scrollbarOffset + thumbOffset / 2;
						const track = scrollbar.offsetHeight - thumb.offsetHeight - scrollbarOffset - thumbOffset;
						if (track) {
							node.scrollTop =
								(clickY / track) * (node.scrollHeight - node.clientHeight);
						}
					} else {
						const thumbOffset = scrollOffset(thumb, 'margin', 'x');
						const scrollbarOffset = scrollOffset(scrollbar, 'padding', 'x');
						const rect = scrollbar.getBoundingClientRect();
						const clickX =
							event.clientX - rect.left - thumb.offsetWidth / 2 - scrollbarOffset + thumbOffset / 2;
						const track = scrollbar.offsetWidth - thumb.offsetWidth - scrollbarOffset - thumbOffset;
						if (track) {
							const ratio = clickX / track;
							let next = ratio * (node.scrollWidth - node.clientWidth);
							if (getProps().dir === 'rtl') {
								next = (1 - ratio) * (node.scrollWidth - node.clientWidth);
								if (node.scrollLeft <= 0) next = -next;
							}
							node.scrollLeft = next;
						}
					}

					startDragging(orientation, { x: event.clientX, y: event.clientY });
					event.stopPropagation();
				}
			});
		},
		thumbAttrs: ({ orientation = 'vertical' } = {}) =>
			dropUndefined({
				'data-ownedby': rootId(),
				'data-orientation': orientation,
				'data-hover': dataAttr(hovering),
				'data-dragging': dataAttr(draggingOrientation === orientation),
				style: orientation === 'vertical' ? 'height: var(--thumb-height);' : 'width: var(--thumb-width);',
				onpointerdown(event: PointerEvent) {
					if (event.button !== 0) return;
					startDragging(orientation, { x: event.clientX, y: event.clientY });
				}
			}),
		cornerAttrs: () =>
			dropUndefined({
				'data-ownedby': rootId(),
				'data-hover': dataAttr(hovering),
				'data-state': hiddenState.cornerHidden ? 'hidden' : 'visible',
				'data-overflow-x': dataAttr(!hiddenState.scrollbarXHidden),
				'data-overflow-y': dataAttr(!hiddenState.scrollbarYHidden),
				style:
					'position: absolute; bottom: 0; inset-inline-end: 0; width: var(--corner-width); height: var(--corner-height);'
			}),
		registerRoot: () => {},
		registerViewport: (node) => {
			viewportNode = node as HTMLElement | null;
		},
		registerContent: (node) => {
			contentNode = node as HTMLElement | null;
			void contentNode;
		},
		registerScrollbar: (node, orientation) => {
			scrollbars[orientation] = node as HTMLElement | null;
		},
		registerThumb: (node, orientation) => {
			thumbs[orientation] = node as HTMLElement | null;
		},
		registerCorner: (node) => {
			cornerNode = node;
		}
	};
}
