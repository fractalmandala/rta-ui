import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';

export type CarouselOrientation = 'horizontal' | 'vertical';
export type CarouselSnapType = 'proximity' | 'mandatory';
export type CarouselSnapAlign = 'start' | 'center' | 'end';
export type CarouselAutoplay = boolean | { delay?: number };

export interface CarouselElementIds {
	root?: string;
	itemGroup?: string;
	item?: (index: number) => string;
	nextTrigger?: string;
	prevTrigger?: string;
	indicatorGroup?: string;
	indicator?: (index: number) => string;
	autoplayIndicator?: string;
}

export interface CarouselPageChangeDetails {
	page: number;
	pageSnapPoint: number;
}

export interface CarouselDragStatusDetails {
	type: 'dragging.start' | 'dragging' | 'dragging.end';
	isDragging: boolean;
	page: number;
}

export interface CarouselAutoplayStatusDetails {
	type: 'autoplay.start' | 'autoplay' | 'autoplay.stop';
	isPlaying: boolean;
	page: number;
}

export interface CarouselProgressTextDetails {
	page: number;
	totalPages: number;
}

export interface CarouselTranslations {
	nextTrigger?: string;
	prevTrigger?: string;
	indicator?: (index: number) => string;
	item?: (index: number, count: number) => string;
	autoplayStart?: string;
	autoplayStop?: string;
	progressText?: (details: CarouselProgressTextDetails) => string;
}

export interface UseCarouselProps {
	slideCount: number;
	page?: number;
	defaultPage?: number;
	onPageChange?: (details: CarouselPageChangeDetails) => void;
	orientation?: CarouselOrientation;
	snapType?: CarouselSnapType;
	loop?: boolean;
	slidesPerPage?: number;
	slidesPerMove?: number | 'auto';
	spacing?: string;
	padding?: string;
	autoplay?: CarouselAutoplay;
	allowMouseDrag?: boolean;
	autoSize?: boolean;
	inViewThreshold?: number | number[];
	/** Pixels a pointer gesture must travel before it commits to another page. */
	threshold?: number;
	/** Pauses autoplay while the pointer is over the carousel and resumes on leave. */
	pauseOnHover?: boolean;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: CarouselElementIds;
	getRootNode?: () => ShadowRoot | Document | Node;
	translations?: CarouselTranslations;
	onDragStatusChange?: (details: CarouselDragStatusDetails) => void;
	onAutoplayStatusChange?: (details: CarouselAutoplayStatusDetails) => void;
}

export interface CarouselApi {
	readonly page: number;
	/** Start index of every page snap point. */
	readonly pages: number[];
	/** `pages` under Ark's name, so context consumers keep working. */
	readonly pageSnapPoints: number[];
	readonly slideCount: number;
	readonly slidesPerPage: number;
	readonly slidesPerMove: number | 'auto';
	readonly orientation: CarouselOrientation;
	readonly snapType: CarouselSnapType;
	readonly spacing: string;
	readonly padding: string | undefined;
	readonly isHorizontal: boolean;
	readonly isRtl: boolean;
	readonly isPlaying: boolean;
	readonly isDragging: boolean;
	readonly canScrollNext: boolean;
	readonly canScrollPrev: boolean;
	readonly autoplayDelay: number;
	/** Share of the autoplay delay already elapsed, from 0 to 1. */
	readonly autoplayProgress: number;
	/** Whole seconds left before autoplay advances. */
	readonly autoplayRemaining: number;
	readonly rootId: string;
	readonly itemGroupId: string;
	readonly nextTriggerId: string;
	readonly prevTriggerId: string;
	readonly indicatorGroupId: string;
	readonly autoplayIndicatorId: string;
	itemId(index: number): string;
	indicatorId(index: number): string;
	getProgress(): number;
	getProgressText(): string;
	isInView(index: number): boolean;
	scrollToIndex(index: number, instant?: boolean): void;
	scrollTo(page: number, instant?: boolean): void;
	scrollNext(instant?: boolean): void;
	scrollPrev(instant?: boolean): void;
	play(): void;
	pause(): void;
	toggleAutoplay(): void;
	refresh(): void;
	rootAttrs(): Record<string, unknown>;
	itemGroupAttrs(): Record<string, unknown>;
	itemAttrs(index: number, snapAlign?: CarouselSnapAlign): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	nextTriggerAttrs(): Record<string, unknown>;
	prevTriggerAttrs(): Record<string, unknown>;
	indicatorGroupAttrs(): Record<string, unknown>;
	indicatorAttrs(index: number, readOnly?: boolean): Record<string, unknown>;
	autoplayTriggerAttrs(): Record<string, unknown>;
	autoplayIndicatorAttrs(): Record<string, unknown>;
	progressTextAttrs(): Record<string, unknown>;
	spinnerAttrs(): Record<string, unknown>;
	registerItemGroup(node: globalThis.Element | null): void;
	registerSlide(index: number, node: globalThis.Element | null): void;
	registerIndicator(index: number, node: globalThis.Element | null): void;
}

const carouselContext = createContext<CarouselApi>('Carousel', 'Carousel.Root');
export const useCarouselContext = () => carouselContext.get();
export const setCarouselContext = (api: CarouselApi) => carouselContext.set(api);

const DEFAULT_TRANSLATIONS = {
	nextTrigger: 'Next slide',
	prevTrigger: 'Previous slide',
	indicator: (index: number) => `Go to slide ${index + 1}`,
	item: (index: number, count: number) => `${index + 1} of ${count}`,
	autoplayStart: 'Start slide rotation',
	autoplayStop: 'Stop slide rotation',
	progressText: (details: CarouselProgressTextDetails) =>
		`${details.page} / ${details.totalPages}`
};

const DEFAULT_AUTOPLAY_DELAY = 4000;
const AUTOPLAY_TICK = 50;
const DEFAULT_DRAG_THRESHOLD = 40;
const TRANSITION = 'transform 400ms cubic-bezier(0.22, 0.61, 0.36, 1)';
const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
const SLIDE_SIZE =
	'calc(100% / var(--slides-per-page) - var(--slide-spacing) * (var(--slides-per-page) - 1) / var(--slides-per-page))';
/** Length of the spinner ring for r=9 (`2 * Math.PI * 9`). */
const SPINNER_CIRCUMFERENCE = 56.55;

function serialize(style: Record<string, string | number | undefined>) {
	return Object.entries(style)
		.filter(([, value]) => value !== undefined)
		.map(([name, value]) => `${name}: ${value}`)
		.join('; ');
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

/** Resolves the lengths the carousel writes inline; other units stay unmeasured. */
function toLength(value: string | undefined) {
	if (!value) return 0;
	const match = /^(-?(?:\d+\.?\d*|\.\d+))\s*(px|em|rem)?$/.exec(value.trim());
	if (!match) return 0;
	const amount = Number.parseFloat(match[1]);
	if (!Number.isFinite(amount)) return 0;
	return match[2] === 'em' || match[2] === 'rem' ? amount * 16 : amount;
}

function axisSize(node: globalThis.Element, horizontal: boolean) {
	const element = node as HTMLElement;
	const size = horizontal ? element.offsetWidth : element.offsetHeight;
	if (size) return size;
	const rect = node.getBoundingClientRect();
	return horizontal ? rect.width : rect.height;
}

function isFocusableTarget(target: globalThis.Element, current: globalThis.Element) {
	if (target === current) return false;
	const focusable = target.closest(FOCUSABLE);
	return focusable != null && focusable !== current;
}

function snapPointIndexes(
	slideCount: number,
	slidesPerMove: number | 'auto',
	slidesPerPage: number,
	autoSize: boolean
) {
	if (autoSize) return Array.from({ length: Math.max(0, slideCount) }, (_, index) => index);
	if (slidesPerPage <= 0) return [];
	const perMove = slidesPerMove === 'auto' ? Math.floor(slidesPerPage) : slidesPerMove;
	if (perMove <= 0) return [];
	const points: number[] = [];
	for (let index = 0; index < slideCount; index += perMove) {
		if (index + slidesPerPage > slideCount) break;
		points.push(index);
	}
	return points;
}

export function createCarousel(getProps: () => UseCarouselProps, uid: string): CarouselApi {
	const elementIds = () => getProps().ids;
	const rootId = () => elementIds()?.root ?? `carousel:${getProps().id ?? uid}`;
	const itemId = (index: number) => elementIds()?.item?.(index) ?? `${rootId()}:item:${index}`;
	const indicatorId = (index: number) =>
		elementIds()?.indicator?.(index) ?? `${rootId()}:indicator:${index}`;
	const itemGroupId = () => elementIds()?.itemGroup ?? `${rootId()}:item-group`;
	const nextTriggerId = () => elementIds()?.nextTrigger ?? `${rootId()}:next-trigger`;
	const prevTriggerId = () => elementIds()?.prevTrigger ?? `${rootId()}:prev-trigger`;
	const indicatorGroupId = () => elementIds()?.indicatorGroup ?? `${rootId()}:indicator-group`;
	const autoplayIndicatorId = () =>
		elementIds()?.autoplayIndicator ?? `${rootId()}:autoplay-indicator`;

	const orientation = () => getProps().orientation ?? 'horizontal';
	const isHorizontal = () => orientation() === 'horizontal';
	const isRtl = () => getProps().dir === 'rtl';
	const slidesPerPage = () => getProps().slidesPerPage ?? 1;
	const slidesPerMove = () => getProps().slidesPerMove ?? 'auto';
	const spacing = () => getProps().spacing ?? '0px';
	const padding = () => getProps().padding;
	const autoSize = () => Boolean(getProps().autoSize);
	const slideCount = () => getProps().slideCount ?? 0;
	const snapType = () => getProps().snapType ?? 'mandatory';
	const loop = () => Boolean(getProps().loop);
	const allowMouseDrag = () => Boolean(getProps().allowMouseDrag);
	const threshold = () => getProps().threshold ?? DEFAULT_DRAG_THRESHOLD;
	const dir = () => getProps().dir ?? undefined;
	const autoplayDelay = (): number => {
		const autoplay = getProps().autoplay;
		return autoplay && typeof autoplay === 'object' ? (autoplay.delay ?? DEFAULT_AUTOPLAY_DELAY) : DEFAULT_AUTOPLAY_DELAY;
	};
	const translations = () => ({ ...DEFAULT_TRANSLATIONS, ...getProps().translations });

	const pages = $derived(
		snapPointIndexes(slideCount(), slidesPerMove(), slidesPerPage(), autoSize())
	);

	const isControlled = () => getProps().page !== undefined;
	let internalPage = $state(getProps().defaultPage ?? 0);
	const page = $derived(
		clamp(
			isControlled() ? (getProps().page as number) : internalPage,
			0,
			Math.max(0, pages.length - 1)
		)
	);

	let isDragging = $state(false);
	let isPlaying = $state(Boolean(getProps().autoplay));
	let pausedByHover = $state(false);
	let elapsed = $state(0);
	let translate = $state(0);
	let instantMove = $state(false);

	let itemGroupNode: HTMLElement | null = null;
	const slideNodes = new Map<number, globalThis.Element>();
	const indicatorNodes = new Map<number, HTMLElement>();
	let sizes: number[] = [];

	const canScrollNext = $derived(loop() || page < pages.length - 1);
	const canScrollPrev = $derived(loop() || page > 0);
	const autoplayProgress = $derived(clamp(elapsed / Math.max(1, autoplayDelay()), 0, 1));
	const autoplayRemaining = $derived(
		Math.ceil(Math.max(0, autoplayDelay() - elapsed) / 1000)
	);

	/** Sign of container movement that advances a page. */
	const directionSign = () => (isHorizontal() && isRtl() ? 1 : -1);

	function offsetForPage(target: number) {
		const starts = pages;
		const bounded = clamp(target, 0, Math.max(0, starts.length - 1));
		const slideIndex = starts[bounded] ?? 0;
		const gap = toLength(spacing());
		let offset = 0;
		for (let index = 0; index < slideIndex; index += 1) {
			offset += (sizes[index] ?? 0) + gap;
		}
		return directionSign() * offset;
	}

	function syncTabIndex() {
		const group = itemGroupNode;
		if (!group) return;
		group.setAttribute('tabindex', group.querySelector(FOCUSABLE) != null ? '-1' : '0');
	}

	function measure() {
		const list: number[] = [];
		for (let index = 0; index < slideCount(); index += 1) {
			const node = slideNodes.get(index);
			list.push(node ? axisSize(node, isHorizontal()) : 0);
		}
		sizes = list;
		syncTabIndex();
		translate = offsetForPage(page);
	}

	function notifyDrag(type: CarouselDragStatusDetails['type']) {
		getProps().onDragStatusChange?.({ type, isDragging: type !== 'dragging.end', page });
	}

	function notifyAutoplay(type: CarouselAutoplayStatusDetails['type']) {
		getProps().onAutoplayStatusChange?.({ type, isPlaying, page });
	}

	function setPage(next: number, source: 'trigger' | 'indicator' | 'drag' | 'autoplay' | 'api') {
		const previous = page;
		const total = pages.length;
		let bounded = total ? clamp(next, 0, total - 1) : 0;
		if (loop() && total) bounded = ((next % total) + total) % total;
		if (source !== 'autoplay' && isPlaying) stopAutoplay();
		if (!isControlled()) internalPage = bounded;
		if (bounded !== previous) {
			getProps().onPageChange?.({ page: bounded, pageSnapPoint: pages[bounded] ?? 0 });
		}
		translate = offsetForPage(bounded);
	}

	function startAutoplay() {
		const wasPlaying = isPlaying;
		isPlaying = true;
		pausedByHover = false;
		elapsed = 0;
		if (!wasPlaying) notifyAutoplay('autoplay.start');
	}

	function stopAutoplay(reason: 'hover' | 'user' | 'drag' | 'prop' = 'user') {
		pausedByHover = reason === 'hover';
		if (!isPlaying) return;
		isPlaying = false;
		notifyAutoplay('autoplay.stop');
	}

	function play() {
		startAutoplay();
	}

	function pause() {
		stopAutoplay('user');
	}

	function toggleAutoplay() {
		if (isPlaying) pause();
		else play();
	}

	function scrollTo(target: number, instant?: boolean) {
		if (instant) {
			instantMove = true;
			setTimeout(() => {
				instantMove = false;
			}, 0);
		}
		setPage(target, 'api');
	}

	function scrollNext(instant?: boolean) {
		scrollTo(page + 1, instant);
	}

	function scrollPrev(instant?: boolean) {
		scrollTo(page - 1, instant);
	}

	function scrollToIndex(index: number, instant?: boolean) {
		let match = 0;
		pages.forEach((start, position) => {
			if (start <= index) match = position;
		});
		scrollTo(match, instant);
	}

	/** IntersectionObserver-style share of a slide that must be on screen to count as in view. */
	function inViewThreshold() {
		const value = getProps().inViewThreshold;
		if (Array.isArray(value)) return value.length ? Math.min(...value) : 0;
		return value ?? 0.6;
	}

	function isInView(index: number) {
		const start = pages[page] ?? 0;
		const perPage = autoSize() ? 1 : slidesPerPage();
		const overlap = clamp(
			Math.min(start + perPage, index + 1) - Math.max(start, index),
			0,
			1
		);
		return overlap > 0 && overlap >= inViewThreshold();
	}

	const drag = (() => {
		let target: Document | null = null;
		let startX = 0;
		let startY = 0;
		let startTranslate = 0;
		let travelled = 0;

		function detach() {
			if (!target) return;
			target.removeEventListener('pointermove', onPointerMove);
			target.removeEventListener('pointerup', onPointerUp);
			target.removeEventListener('pointercancel', onPointerCancel);
			target = null;
		}

		function onPointerMove(event: PointerEvent) {
			if (!isDragging) return;
			travelled = isHorizontal() ? event.clientX - startX : event.clientY - startY;
			translate = startTranslate + travelled;
			notifyDrag('dragging');
		}

		function end(cancelled: boolean) {
			if (!isDragging) return;
			isDragging = false;
			detach();
			const distance = travelled;
			travelled = 0;
			if (!cancelled && Math.abs(distance) >= threshold()) {
				setPage(page + (distance * directionSign() > 0 ? 1 : -1), 'drag');
			} else {
				translate = offsetForPage(page);
			}
			notifyDrag('dragging.end');
		}

		function onPointerUp() {
			end(false);
		}

		function onPointerCancel() {
			end(true);
		}

		return {
			start(event: PointerEvent) {
				if (isDragging) return;
				startX = event.clientX;
				startY = event.clientY;
				startTranslate = translate;
				travelled = 0;
				isDragging = true;
				if (isPlaying) stopAutoplay('drag');
				notifyDrag('dragging.start');
				detach();
				const doc = itemGroupNode?.ownerDocument ?? document;
				target = doc;
				doc.addEventListener('pointermove', onPointerMove);
				doc.addEventListener('pointerup', onPointerUp);
				doc.addEventListener('pointercancel', onPointerCancel);
			},
			stop: detach
		};
	})();

	function handlePointerDown(event: PointerEvent) {
		if (event.defaultPrevented) return;
		if (event.button !== 0) return;
		if (event.pointerType === 'mouse' && !allowMouseDrag()) return;
		const current = event.currentTarget as globalThis.Element | null;
		const target = event.target as globalThis.Element | null;
		if (current && target && isFocusableTarget(target, current)) return;
		event.preventDefault();
		drag.start(event);
	}

	function handleIndicatorKeydown(event: KeyboardEvent) {
		if (event.defaultPrevented) return;
		const horizontal = isHorizontal();
		let next: number;
		switch (event.key) {
			case 'ArrowLeft':
				if (!horizontal) return;
				next = isRtl() ? page + 1 : page - 1;
				break;
			case 'ArrowRight':
				if (!horizontal) return;
				next = isRtl() ? page - 1 : page + 1;
				break;
			case 'ArrowUp':
				if (horizontal) return;
				next = page - 1;
				break;
			case 'ArrowDown':
				if (horizontal) return;
				next = page + 1;
				break;
			case 'Home':
				next = 0;
				break;
			case 'End':
				next = pages.length - 1;
				break;
			default:
				return;
		}
		event.preventDefault();
		const active = (indicatorNodes.get(page)?.ownerDocument ?? document).activeElement;
		setPage(next, 'indicator');
		if ((active as HTMLElement | null)?.closest('[data-part="indicator"]')) {
			indicatorNodes.get(page)?.focus();
		}
	}

	function handleItemGroupKeydown(event: KeyboardEvent) {
		if (event.defaultPrevented) return;
		const horizontal = isHorizontal();
		let forward: boolean;
		switch (event.key) {
			case 'ArrowRight':
				if (!horizontal) return;
				forward = !isRtl();
				break;
			case 'ArrowLeft':
				if (!horizontal) return;
				forward = isRtl();
				break;
			case 'ArrowDown':
				if (horizontal) return;
				forward = true;
				break;
			case 'ArrowUp':
				if (horizontal) return;
				forward = false;
				break;
			case 'Home':
				event.preventDefault();
				setPage(0, 'trigger');
				return;
			case 'End':
				event.preventDefault();
				setPage(pages.length - 1, 'trigger');
				return;
			default:
				return;
		}
		event.preventDefault();
		setPage(page + (forward ? 1 : -1), 'trigger');
	}

	let autoplayProp = $state(Boolean(getProps().autoplay));

	$effect(() => {
		const next = Boolean(getProps().autoplay);
		if (next === autoplayProp) return;
		autoplayProp = next;
		if (next) startAutoplay();
		else stopAutoplay('prop');
	});

	$effect(() => {
		if (!isPlaying) return;
		const interval = setInterval(() => {
			elapsed += AUTOPLAY_TICK;
			if (elapsed < autoplayDelay()) return;
			elapsed = 0;
			if (!loop() && page >= pages.length - 1) {
				stopAutoplay('user');
				return;
			}
			const total = pages.length;
			const next = total ? (page + 1) % total : 0;
			if (!isControlled()) internalPage = next;
			getProps().onPageChange?.({ page: next, pageSnapPoint: pages[next] ?? 0 });
			translate = offsetForPage(next);
			notifyAutoplay('autoplay');
		}, AUTOPLAY_TICK);
		return () => clearInterval(interval);
	});

	$effect(() => {
		const doc = itemGroupNode?.ownerDocument;
		if (!doc) return;
		const onVisibilityChange = () => {
			if (doc.visibilityState === 'visible') return;
			stopAutoplay('user');
		};
		doc.addEventListener('visibilitychange', onVisibilityChange);
		return () => doc.removeEventListener('visibilitychange', onVisibilityChange);
	});

	$effect(() => {
		void orientation();
		void spacing();
		void autoSize();
		translate = offsetForPage(page);
	});

	$effect(() => () => drag.stop());

	return {
		itemId,
		indicatorId,
		scrollToIndex,
		scrollTo,
		scrollNext,
		scrollPrev,
		play,
		pause,
		toggleAutoplay,
		isInView,
		getProgress() {
			return pages.length ? page / pages.length : 0;
		},
		getProgressText() {
			return translations().progressText?.({ page: page + 1, totalPages: pages.length }) ?? '';
		},
		refresh() {
			measure();
		},
		registerItemGroup(node) {
			itemGroupNode = node as HTMLElement | null;
			if (node) measure();
		},
		registerSlide(index, node) {
			if (node) slideNodes.set(index, node);
			else slideNodes.delete(index);
			if (itemGroupNode) measure();
		},
		registerIndicator(index, node) {
			if (node) indicatorNodes.set(index, node as HTMLElement);
			else indicatorNodes.delete(index);
		},
		rootAttrs() {
			return {
				id: rootId(),
				role: 'region',
				'aria-roledescription': 'carousel',
				'data-orientation': orientation(),
				dir: dir(),
				style: serialize({
					'--slide-count': slideCount(),
					'--slides-per-page': slidesPerPage(),
					'--slide-spacing': spacing(),
					'--slide-size': autoSize() ? 'auto' : SLIDE_SIZE,
					'--slide-item-size': autoSize() ? 'auto' : SLIDE_SIZE,
					overflow: 'hidden',
					'touch-action': isHorizontal() ? 'pan-y' : 'pan-x'
				}),
				onpointerenter() {
					if (!getProps().pauseOnHover || !isPlaying) return;
					stopAutoplay('hover');
				},
				onpointerleave() {
					if (!pausedByHover) return;
					startAutoplay();
				}
			};
		},
		itemGroupAttrs() {
			return {
				id: itemGroupId(),
				dir: dir(),
				'data-orientation': orientation(),
				'data-dragging': dataAttr(isDragging),
				'aria-live': isPlaying ? 'off' : 'polite',
				style: serialize({
					display: 'flex',
					'flex-direction': isHorizontal() ? 'row' : 'column',
					gap: 'var(--slide-spacing)',
					'backface-visibility': 'hidden',
					'scroll-snap-type': `${isHorizontal() ? 'x' : 'y'} ${snapType()}`,
					'will-change': 'transform',
					transform: `translate3d(${isHorizontal() ? translate : 0}px, ${isHorizontal() ? 0 : translate}px, 0)`,
					transition: isDragging || instantMove ? 'none' : TRANSITION,
					[isHorizontal() ? 'padding-inline' : 'padding-block']: padding()
				}),
				onpointerdown: handlePointerDown,
				onkeydown: handleItemGroupKeydown,
				onfocusin() {
					syncTabIndex();
				},
				onfocusout(event: FocusEvent) {
					const group = event.currentTarget as globalThis.Element;
					const next = event.relatedTarget as globalThis.Element | null;
					if (next && group.contains(next)) return;
					syncTabIndex();
				}
			};
		},
		itemAttrs(index, snapAlign) {
			const perMove =
				slidesPerMove() === 'auto' ? Math.floor(slidesPerPage()) : Number(slidesPerMove());
			return {
				id: itemId(index),
				dir: dir(),
				role: 'group',
				'data-index': index,
				'data-inview': dataAttr(isInView(index)),
				'data-orientation': orientation(),
				'aria-roledescription': 'slide',
				'aria-label': translations().item?.(index, slideCount()),
				'aria-hidden': isInView(index) ? undefined : 'true',
				style: serialize({
					flex: '0 0 var(--slide-size)',
					[isHorizontal() ? 'max-width' : 'max-height']: '100%',
					'scroll-snap-align':
						perMove > 0 && index % perMove === 0 ? (snapAlign ?? 'start') : undefined
				})
			};
		},
		controlAttrs() {
			return { 'data-orientation': orientation() };
		},
		nextTriggerAttrs() {
			return {
				id: nextTriggerId(),
				type: 'button',
				dir: dir(),
				'data-orientation': orientation(),
				'aria-label': translations().nextTrigger,
				'aria-controls': itemGroupId(),
				disabled: !canScrollNext,
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					setPage(page + 1, 'trigger');
				}
			};
		},
		prevTriggerAttrs() {
			return {
				id: prevTriggerId(),
				type: 'button',
				dir: dir(),
				'data-orientation': orientation(),
				'aria-label': translations().prevTrigger,
				'aria-controls': itemGroupId(),
				disabled: !canScrollPrev,
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					setPage(page - 1, 'trigger');
				}
			};
		},
		indicatorGroupAttrs() {
			return {
				id: indicatorGroupId(),
				dir: dir(),
				'data-orientation': orientation(),
				onkeydown: handleIndicatorKeydown
			};
		},
		indicatorAttrs(index, readOnly) {
			return {
				id: indicatorId(index),
				type: 'button',
				dir: dir(),
				'data-orientation': orientation(),
				'data-index': index,
				'data-readonly': dataAttr(readOnly),
				'data-current': dataAttr(index === page),
				'aria-label': translations().indicator?.(index),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (readOnly) return;
					setPage(index, 'indicator');
				}
			};
		},
		autoplayTriggerAttrs() {
			return {
				type: 'button',
				dir: dir(),
				'data-orientation': orientation(),
				'data-pressed': dataAttr(isPlaying),
				'aria-label': isPlaying
					? translations().autoplayStop
					: translations().autoplayStart,
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					toggleAutoplay();
				}
			};
		},
		autoplayIndicatorAttrs() {
			return {
				id: autoplayIndicatorId(),
				dir: dir(),
				'data-orientation': orientation(),
				'data-paused': dataAttr(!isPlaying),
				style: serialize({ '--autoplay-progress': `${autoplayProgress * 100}%` })
			};
		},
		progressTextAttrs() {
			return {};
		},
		spinnerAttrs() {
			return {
				'data-orientation': orientation(),
				'data-paused': dataAttr(!isPlaying),
				'aria-hidden': 'true',
				style: serialize({
					'--autoplay-progress': `${autoplayProgress * 100}%`,
					'--carousel-spinner-offset': Number(
						(SPINNER_CIRCUMFERENCE * (1 - autoplayProgress)).toFixed(2)
					)
				})
			};
		},
		get page() {
			return page;
		},
		get pages() {
			return pages;
		},
		get pageSnapPoints() {
			return pages;
		},
		get slideCount() {
			return slideCount();
		},
		get slidesPerPage() {
			return slidesPerPage();
		},
		get slidesPerMove() {
			return slidesPerMove();
		},
		get orientation() {
			return orientation();
		},
		get snapType() {
			return snapType();
		},
		get spacing() {
			return spacing();
		},
		get padding() {
			return padding();
		},
		get isHorizontal() {
			return isHorizontal();
		},
		get isRtl() {
			return isRtl();
		},
		get isPlaying() {
			return isPlaying;
		},
		get isDragging() {
			return isDragging;
		},
		get canScrollNext() {
			return canScrollNext;
		},
		get canScrollPrev() {
			return canScrollPrev;
		},
		get autoplayDelay() {
			return autoplayDelay();
		},
		get autoplayProgress() {
			return autoplayProgress;
		},
		get autoplayRemaining() {
			return autoplayRemaining;
		},
		get rootId() {
			return rootId();
		},
		get itemGroupId() {
			return itemGroupId();
		},
		get nextTriggerId() {
			return nextTriggerId();
		},
		get prevTriggerId() {
			return prevTriggerId();
		},
		get indicatorGroupId() {
			return indicatorGroupId();
		},
		get autoplayIndicatorId() {
			return autoplayIndicatorId();
		}
	};
}
