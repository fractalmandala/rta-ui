import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';

export interface LightboxSource {
	src: string;
	alt?: string;
	caption?: string;
	downloadUrl?: string;
}

export interface LightboxIndexChangeDetails {
	index: number;
}

export interface LightboxZoomChangeDetails {
	zoom: number;
}

export interface LightboxElementIds {
	viewport?: string;
	prevTrigger?: string;
	nextTrigger?: string;
	counter?: string;
	zoomTrigger?: string;
	downloadTrigger?: string;
	thumbnail?: (index: number) => string;
}

export interface LightboxTranslations {
	prev?: string;
	next?: string;
	zoomIn?: string;
	zoomOut?: string;
	resetZoom?: string;
	download?: string;
	thumbnail?: (index: number) => string;
}

export interface UseLightboxProps {
	sources?: LightboxSource[];
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (details: LightboxIndexChangeDetails) => void;
	/** Wraps around the gallery when the first or last image is reached. */
	loop?: boolean;
	zoom?: number;
	defaultZoom?: number;
	minZoom?: number;
	maxZoom?: number;
	zoomStep?: number;
	onZoomChange?: (details: LightboxZoomChangeDetails) => void;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: LightboxElementIds;
	translations?: LightboxTranslations;
}

export interface LightboxApi {
	readonly id: string;
	readonly sources: LightboxSource[];
	readonly index: number;
	readonly count: number;
	readonly current: LightboxSource | undefined;
	readonly loop: boolean;
	readonly hasPrev: boolean;
	readonly hasNext: boolean;
	readonly zoom: number;
	readonly minZoom: number;
	readonly maxZoom: number;
	readonly zoomStep: number;
	readonly zoomed: boolean;
	readonly viewportId: string;
	readonly prevTriggerId: string;
	readonly nextTriggerId: string;
	readonly counterId: string;
	readonly zoomTriggerId: string;
	readonly downloadTriggerId: string;
	readonly prevLabel: string;
	readonly nextLabel: string;
	readonly zoomLabel: string;
	readonly downloadLabel: string;
	thumbnailId(index: number): string;
	thumbnailLabel(index: number): string;
	setIndex(index: number): void;
	next(): void;
	prev(): void;
	setZoom(zoom: number): void;
	zoomIn(): void;
	zoomOut(): void;
	resetZoom(): void;
	toggleZoom(): void;
	handleKeydown(event: KeyboardEvent): void;
	imageStyle(): string;
	downloadHref(): string | undefined;
	viewportAttrs(): Record<string, unknown>;
	prevTriggerAttrs(): Record<string, unknown>;
	nextTriggerAttrs(): Record<string, unknown>;
	counterAttrs(): Record<string, unknown>;
	captionAttrs(): Record<string, unknown>;
	thumbnailAttrs(index: number): Record<string, unknown>;
	zoomTriggerAttrs(): Record<string, unknown>;
	downloadTriggerAttrs(): Record<string, unknown>;
	registerViewport(node: globalThis.Element | null): void;
}

function isEditable(target: EventTarget | null): boolean {
	if (!(target instanceof Element)) return false;
	return Boolean(target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'));
}

const lightboxContext = createContext<LightboxApi>('Lightbox', 'Lightbox.Root');

export const useLightboxContext = () => lightboxContext.get();
export const setLightboxContext = (api: LightboxApi) => lightboxContext.set(api);

export function createLightbox(getProps: () => UseLightboxProps, uid: string): LightboxApi {
	const id = () => getProps().id ?? `lightbox:${uid}`;
	const sources = () => getProps().sources ?? [];
	const count = () => sources().length;
	const loop = () => getProps().loop ?? false;
	const minZoom = () => getProps().minZoom ?? 1;
	const maxZoom = () => getProps().maxZoom ?? 4;
	const zoomStep = () => getProps().zoomStep ?? 0.5;

	let internalIndex = $state(getProps().defaultIndex ?? 0);
	let internalZoom = $state(getProps().defaultZoom ?? 1);
	let viewportNode = $state<HTMLElement | null>(null);

	const isIndexControlled = () => getProps().index !== undefined;
	const index = () => {
		const value = isIndexControlled() ? Number(getProps().index) : internalIndex;
		if (!count()) return 0;
		return Math.min(Math.max(value, 0), Math.max(count() - 1, 0));
	};

	const isZoomControlled = () => getProps().zoom !== undefined;
	const zoom = () => {
		const value = isZoomControlled() ? Number(getProps().zoom) : internalZoom;
		return Math.min(Math.max(value, minZoom()), maxZoom());
	};

	const viewportId = () => getProps().ids?.viewport ?? `${id()}:viewport`;
	const prevTriggerId = () => getProps().ids?.prevTrigger ?? `${id()}:prev-trigger`;
	const nextTriggerId = () => getProps().ids?.nextTrigger ?? `${id()}:next-trigger`;
	const counterId = () => getProps().ids?.counter ?? `${id()}:counter`;
	const zoomTriggerId = () => getProps().ids?.zoomTrigger ?? `${id()}:zoom-trigger`;
	const downloadTriggerId = () => getProps().ids?.downloadTrigger ?? `${id()}:download-trigger`;
	const thumbnailId = (value: number) => {
		const custom = getProps().ids?.thumbnail;
		return custom ? custom(value) : `${id()}:thumbnail:${value}`;
	};
	const thumbnailLabel = (value: number) => {
		const custom = getProps().translations?.thumbnail;
		return custom ? custom(value) : `Image ${value + 1}`;
	};
	const zoomLabel = () =>
		zoom() > minZoom()
			? (getProps().translations?.resetZoom ?? 'Reset zoom')
			: (getProps().translations?.zoomIn ?? 'Zoom in');

	function setIndex(next: number) {
		if (!count()) return;
		const bounded = Math.min(Math.max(next, 0), count() - 1);
		if (bounded === index()) return;
		if (!isIndexControlled()) internalIndex = bounded;
		getProps().onIndexChange?.({ index: bounded });
	}

	function step(delta: number) {
		const total = count();
		if (!total) return;
		const next = index() + delta;
		if (loop()) {
			setIndex(((next % total) + total) % total);
			return;
		}
		if (next < 0 || next > total - 1) return;
		setIndex(next);
	}

	function setZoom(next: number) {
		const bounded = Math.min(Math.max(next, minZoom()), maxZoom());
		if (bounded === zoom()) return;
		if (!isZoomControlled()) internalZoom = bounded;
		getProps().onZoomChange?.({ zoom: bounded });
	}

	function hasPrev() {
		return loop() || index() > 0;
	}

	function hasNext() {
		return loop() || index() < count() - 1;
	}

	$effect(() => {
		const node = viewportNode;
		if (!node) return;
		const doc = node.ownerDocument;
		const onKeydown = (event: KeyboardEvent) => {
			if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
			if (isEditable(event.target)) return;
			if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
			event.preventDefault();
			if (event.key === 'ArrowLeft') step(-1);
			else step(1);
		};
		doc.addEventListener('keydown', onKeydown);
		return () => doc.removeEventListener('keydown', onKeydown);
	});

	const dir = () => getProps().dir ?? undefined;

	return {
		get id() {
			return id();
		},
		get sources() {
			return sources();
		},
		get index() {
			return index();
		},
		get count() {
			return count();
		},
		get current() {
			return sources()[index()];
		},
		get loop() {
			return loop();
		},
		get hasPrev() {
			return hasPrev();
		},
		get hasNext() {
			return hasNext();
		},
		get zoom() {
			return zoom();
		},
		get minZoom() {
			return minZoom();
		},
		get maxZoom() {
			return maxZoom();
		},
		get zoomStep() {
			return zoomStep();
		},
		get zoomed() {
			return zoom() > minZoom();
		},
		get viewportId() {
			return viewportId();
		},
		get prevTriggerId() {
			return prevTriggerId();
		},
		get nextTriggerId() {
			return nextTriggerId();
		},
		get counterId() {
			return counterId();
		},
		get zoomTriggerId() {
			return zoomTriggerId();
		},
		get downloadTriggerId() {
			return downloadTriggerId();
		},
		get prevLabel() {
			return getProps().translations?.prev ?? 'Previous image';
		},
		get nextLabel() {
			return getProps().translations?.next ?? 'Next image';
		},
		get zoomLabel() {
			return zoomLabel();
		},
		get downloadLabel() {
			return getProps().translations?.download ?? 'Download image';
		},
		thumbnailId,
		thumbnailLabel,
		setIndex,
		next: () => step(1),
		prev: () => step(-1),
		setZoom,
		zoomIn: () => setZoom(zoom() + zoomStep()),
		zoomOut: () => setZoom(zoom() - zoomStep()),
		resetZoom: () => setZoom(minZoom()),
		toggleZoom: () => {
			if (zoom() > minZoom()) setZoom(minZoom());
			else setZoom(zoom() + zoomStep());
		},
		handleKeydown(event) {
			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				step(-1);
			} else if (event.key === 'ArrowRight') {
				event.preventDefault();
				step(1);
			}
		},
		imageStyle() {
			return `transform: scale(${zoom()}); transform-origin: center center; transition: transform var(--moduix-transition-default, 150ms ease);`;
		},
		downloadHref() {
			const current = sources()[index()];
			return current?.downloadUrl ?? current?.src;
		},
		viewportAttrs() {
			return {
				id: viewportId(),
				dir: dir(),
				tabindex: 0,
				'data-index': index(),
				'data-count': count(),
				'data-loop': dataAttr(loop()),
				onkeydown(event: KeyboardEvent) {
					if (event.defaultPrevented) return;
					if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
					event.preventDefault();
					if (event.key === 'ArrowLeft') step(-1);
					else step(1);
				}
			};
		},
		prevTriggerAttrs() {
			return {
				id: prevTriggerId(),
				dir: dir(),
				type: 'button',
				'aria-label': getProps().translations?.prev ?? 'Previous image',
				'aria-controls': viewportId(),
				disabled: !hasPrev(),
				'data-disabled': dataAttr(!hasPrev()),
				'data-index': index()
			};
		},
		nextTriggerAttrs() {
			return {
				id: nextTriggerId(),
				dir: dir(),
				type: 'button',
				'aria-label': getProps().translations?.next ?? 'Next image',
				'aria-controls': viewportId(),
				disabled: !hasNext(),
				'data-disabled': dataAttr(!hasNext()),
				'data-index': index()
			};
		},
		counterAttrs() {
			return {
				id: counterId(),
				dir: dir(),
				'aria-live': 'polite',
				'data-index': index(),
				'data-count': count()
			};
		},
		captionAttrs() {
			return { dir: dir(), 'data-index': index() };
		},
		thumbnailAttrs(value: number) {
			return {
				id: thumbnailId(value),
				dir: dir(),
				type: 'button',
				'aria-label': thumbnailLabel(value),
				'aria-current': value === index() ? 'true' : undefined,
				'aria-controls': viewportId(),
				'data-active': dataAttr(value === index()),
				'data-index': value
			};
		},
		zoomTriggerAttrs() {
			return {
				id: zoomTriggerId(),
				dir: dir(),
				type: 'button',
				'aria-label': zoomLabel(),
				'aria-pressed': zoom() > minZoom(),
				'aria-controls': viewportId(),
				'data-zoomed': dataAttr(zoom() > minZoom()),
				'data-zoom': zoom()
			};
		},
		downloadTriggerAttrs() {
			return {
				id: downloadTriggerId(),
				dir: dir(),
				'aria-label': getProps().translations?.download ?? 'Download image',
				href: sources()[index()]?.downloadUrl ?? sources()[index()]?.src,
				download: ''
			};
		},
		registerViewport(node) {
			viewportNode = node instanceof HTMLElement ? node : null;
		}
	};
}
