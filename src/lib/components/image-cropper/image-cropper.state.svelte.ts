import { untrack } from 'svelte';
import { createContext } from '../../internal/context';
import { dataAttr, toPx } from '../../internal/dom';
import {
	ZERO_POINT,
	addPoints,
	centerCropOnPoint,
	centerRect,
	clampOffset,
	clampPoint,
	clampValue,
	computeDefaultCropDimensions,
	computeMoveCrop,
	computeResizeCrop,
	constrainCrop,
	getCenterPoint,
	getCropSizeLimits,
	getCropSourcePoints,
	getCropSourceRect,
	getHandlePositionStyle,
	getImageTransformCss,
	getKeyboardMoveDelta,
	getMaxBounds,
	getNaturalCropSize,
	getNudgeStep,
	getViewportCenter,
	isAspectRatioEqual,
	isEqualFlip,
	isEqualRect,
	isSameSize,
	isValidRect,
	isVisibleRect,
	normalizeFlipState,
	resolveCropAspectRatio,
	roundRect,
	scaleRect,
	subtractPoints,
	type BoundingRect,
	type CropExportParams,
	type FlipState,
	type HandlePosition,
	type Point,
	type Rect,
	type Size
} from './crop';
import { canvasToBlob, drawCroppedImageToCanvas } from './image-cropper.canvas';

export type ImageCropperHandlePosition = HandlePosition;
export type ImageCropperRect = Rect;
export type ImageCropperFlipState = FlipState;
export type ImageCropperPoint = Point;
export type ImageCropperSize = Size;

export interface ImageCropperZoomChangeDetails {
	zoom: number;
}

export interface ImageCropperRotationChangeDetails {
	rotation: number;
}

export interface ImageCropperFlipChangeDetails {
	flip: FlipState;
}

export interface ImageCropperCropChangeDetails {
	crop: Rect;
}

export interface ImageCropperPreviewDescriptionDetails {
	zoom: number | null;
	rotation: number | null;
	crop: Rect;
}

export interface ImageCropperSelectionLabelDetails {
	shape: 'rectangle' | 'circle';
}

export interface ImageCropperSelectionValueTextDetails extends Rect {
	shape: 'rectangle' | 'circle';
}

export interface ImageCropperTranslations {
	rootLabel?: string;
	rootRoleDescription?: string;
	previewLoading?: string;
	previewDescription?: (details: ImageCropperPreviewDescriptionDetails) => string;
	selectionLabel?: (details: ImageCropperSelectionLabelDetails) => string;
	selectionRoleDescription?: string;
	selectionInstructions?: string;
	selectionValueText?: (details: ImageCropperSelectionValueTextDetails) => string;
}

export interface ImageCropperElementIds {
	root?: string;
	viewport?: string;
	image?: string;
	selection?: string;
	handle?: (position: HandlePosition) => string;
}

export interface ImageCropperCropData {
	x: number;
	y: number;
	width: number;
	height: number;
	corners: ReturnType<typeof getCropSourcePoints>;
	outputSize: Size;
	rotate: number;
	flipX: boolean;
	flipY: boolean;
}

export interface ImageCropperGetCroppedImageOptions {
	type?: string;
	quality?: number;
	maxSize?: Size;
	output?: 'blob' | 'dataUrl';
}

export interface ImageCropperHandleOptions {
	position: HandlePosition;
}

export interface ImageCropperGridOptions {
	axis: 'horizontal' | 'vertical';
}

export interface UseImageCropperProps {
	id?: string | null;
	ids?: ImageCropperElementIds;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	initialCrop?: Rect;
	minWidth?: number;
	minHeight?: number;
	maxWidth?: number;
	maxHeight?: number;
	aspectRatio?: number;
	cropShape?: 'rectangle' | 'circle';
	zoom?: number;
	rotation?: number;
	flip?: FlipState;
	defaultZoom?: number;
	defaultRotation?: number;
	defaultFlip?: FlipState;
	zoomStep?: number;
	zoomSensitivity?: number;
	minZoom?: number;
	maxZoom?: number;
	nudgeStep?: number;
	nudgeStepShift?: number;
	nudgeStepCtrl?: number;
	fixedCropArea?: boolean;
	translations?: ImageCropperTranslations;
	onZoomChange?: (details: ImageCropperZoomChangeDetails) => void;
	onRotationChange?: (details: ImageCropperRotationChangeDetails) => void;
	onFlipChange?: (details: ImageCropperFlipChangeDetails) => void;
	onCropChange?: (details: ImageCropperCropChangeDetails) => void;
}

type Attrs = Record<string, unknown>;

export interface ImageCropperApi {
	readonly zoom: number;
	readonly rotation: number;
	readonly flip: FlipState;
	readonly crop: Rect;
	readonly offset: Point;
	readonly naturalSize: Size;
	readonly viewportRect: BoundingRect;
	readonly viewportSize: Size;
	readonly dragging: boolean;
	readonly panning: boolean;
	setZoom(zoom: number): void;
	zoomBy(delta: number): void;
	setRotation(rotation: number): void;
	rotateBy(degrees: number): void;
	setFlip(flip: Partial<FlipState>): void;
	flipHorizontally(value?: boolean): void;
	flipVertically(value?: boolean): void;
	resize(handlePosition: HandlePosition, delta: number): void;
	setCrop(crop: Rect): void;
	reset(): void;
	getCropData(): ImageCropperCropData;
	getCroppedImage(options?: ImageCropperGetCroppedImageOptions): Promise<Blob | string | null>;
	rootAttrs(): Attrs;
	viewportAttrs(): Attrs;
	imageAttrs(): Attrs;
	selectionAttrs(): Attrs;
	handleAttrs(options: ImageCropperHandleOptions): Attrs;
	gridAttrs(options: ImageCropperGridOptions): Attrs;
	registerRoot(node: Element | null): void;
	registerViewport(node: Element | null): void;
	registerImage(node: Element | null): void;
	registerSelection(node: Element | null): void;
	measureViewport(): void;
}

export type UseImageCropperReturn = ImageCropperApi;
export type UseImageCropperContext = ImageCropperApi;

const defaultTranslations = {
	rootLabel: 'Image cropper',
	rootRoleDescription: 'Image cropper',
	previewLoading: 'Image cropper preview loading',
	previewDescription({ crop, zoom, rotation }: ImageCropperPreviewDescriptionDetails) {
		const zoomText =
			zoom != null && Number.isFinite(zoom) ? `${zoom.toFixed(2)}x zoom` : 'default zoom';
		const rotationText =
			rotation != null && Number.isFinite(rotation)
				? `${Math.round(rotation)} degrees rotation`
				: '0 degrees rotation';
		return `Image cropper preview, ${zoomText}, ${rotationText}. Crop positioned at ${crop.x}px from the left and ${crop.y}px from the top with a size of ${crop.width}px by ${crop.height}px.`;
	},
	selectionLabel: ({ shape }: ImageCropperSelectionLabelDetails) =>
		`Crop selection area (${shape === 'circle' ? 'circle' : 'rectangle'})`,
	selectionRoleDescription: '2d slider',
	selectionInstructions:
		'Use arrow keys to move the crop. Hold Alt with arrow keys to resize width or height. Press plus or minus to zoom.',
	selectionValueText({ shape, x, y, width, height }: ImageCropperSelectionValueTextDetails) {
		if (shape === 'circle') return `Position X ${x}px, Y ${y}px. Diameter ${width}px.`;
		return `Position X ${x}px, Y ${y}px. Size ${width}px by ${height}px.`;
	}
};

const EMPTY_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };
const EMPTY_BOUNDS: BoundingRect = {
	width: 0,
	height: 0,
	top: 0,
	left: 0,
	right: 0,
	bottom: 0
};

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	const result: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry !== undefined) result[key] = entry;
	}
	return result as T;
}

function contains(parent: Element | null | undefined, child: Node | null | undefined): boolean {
	return !!parent && !!child && parent.contains(child);
}

const imageCropperContext = createContext<ImageCropperApi>('ImageCropper', 'ImageCropper');

export const setImageCropperContext = (api: ImageCropperApi): ImageCropperApi =>
	imageCropperContext.set(api);
export const useImageCropperContext = (): ImageCropperApi => imageCropperContext.get();

export function createImageCropper(
	props: () => UseImageCropperProps,
	uid: string
): ImageCropperApi {
	const prop = <K extends keyof UseImageCropperProps>(key: K): UseImageCropperProps[K] =>
		props()[key];

	const minWidth = () => prop('minWidth') ?? 40;
	const minHeight = () => prop('minHeight') ?? 40;
	const maxWidth = () => prop('maxWidth') ?? Number.POSITIVE_INFINITY;
	const maxHeight = () => prop('maxHeight') ?? Number.POSITIVE_INFINITY;
	const cropShape = () => prop('cropShape') ?? 'rectangle';
	const fixedCropArea = () => Boolean(prop('fixedCropArea'));
	const zoomStep = () => Math.abs(prop('zoomStep') ?? 0.1);
	const zoomSensitivity = () => Math.max(0, prop('zoomSensitivity') ?? 2);
	const minZoom = () => prop('minZoom') ?? 1;
	const maxZoom = () => prop('maxZoom') ?? 5;
	const aspectRatioProp = () => prop('aspectRatio');
	const aspectRatio = () => resolveCropAspectRatio(cropShape(), aspectRatioProp());
	const sizeLimits = () =>
		getCropSizeLimits({
			minWidth: minWidth(),
			minHeight: minHeight(),
			maxWidth: maxWidth(),
			maxHeight: maxHeight()
		});
	const translations = () => ({ ...defaultTranslations, ...prop('translations') });

	const base = () => prop('id') ?? uid;
	const rootId = () => prop('ids')?.root ?? `image-cropper:${base()}`;
	const viewportId = () => prop('ids')?.viewport ?? `image-cropper:${base()}:viewport`;
	const imageId = () => prop('ids')?.image ?? `image-cropper:${base()}:image`;
	const selectionId = () => prop('ids')?.selection ?? `image-cropper:${base()}:selection`;
	const handleId = (position: HandlePosition) =>
		prop('ids')?.handle?.(position) ?? `image-cropper:${base()}:handle:${position}`;

	let internalZoom = $state(prop('defaultZoom') ?? 1);
	let internalRotation = $state(prop('defaultRotation') ?? 0);
	let internalFlip = $state<FlipState>({
		horizontal: prop('defaultFlip')?.horizontal ?? false,
		vertical: prop('defaultFlip')?.vertical ?? false
	});
	let crop = $state<Rect>({ ...EMPTY_RECT });
	let offset = $state<Point>({ ...ZERO_POINT });
	let naturalSize = $state<Size>({ width: 0, height: 0 });
	let viewportRect = $state<BoundingRect>({ ...EMPTY_BOUNDS });
	let phase = $state<'idle' | 'dragging' | 'panning'>('idle');

	let rootNode: Element | null = null;
	let viewportNode: HTMLElement | null = null;
	let imageNode: HTMLImageElement | null = null;
	let selectionNode: HTMLElement | null = null;
	let pointerStart: Point | null = null;
	let offsetStart: Point | null = null;
	let cropStart: Rect | null = null;
	let activeHandle: HandlePosition | null = null;
	let shiftLockRatio: number | null = null;
	let detachPointer: (() => void) | null = null;
	let resizeObserver: ResizeObserver | null = null;

	const zoom = () => prop('zoom') ?? internalZoom;
	const rotation = () => prop('rotation') ?? internalRotation;
	const flip = () => prop('flip') ?? internalFlip;
	const dragging = () => phase === 'dragging';
	const panning = () => phase === 'panning';
	const isMeasured = $derived(isVisibleRect(viewportRect) && isVisibleRect(crop));
	const isImageReady = $derived(isVisibleRect(naturalSize));

	function documentOf(): Document {
		return rootNode?.ownerDocument ?? viewportNode?.ownerDocument ?? globalThis.document;
	}

	function setZoomValue(next: number) {
		const value = clampValue(next, minZoom(), maxZoom());
		if (value === zoom()) return;
		if (prop('zoom') === undefined) internalZoom = value;
		prop('onZoomChange')?.({ zoom: value });
	}

	function setRotationValue(next: number) {
		const value = clampValue(next, 0, 360);
		if (value === rotation()) return;
		if (prop('rotation') === undefined) internalRotation = value;
		prop('onRotationChange')?.({ rotation: value });
	}

	function setFlipValue(next: Partial<FlipState>) {
		const current = flip();
		const normalized = normalizeFlipState(next, current);
		if (isEqualFlip(normalized, current)) return;
		if (prop('flip') === undefined) internalFlip = normalized;
		prop('onFlipChange')?.({ flip: normalized });
	}

	function setCropRect(next: Rect) {
		if (isEqualRect(next, crop)) return;
		crop = next;
		prop('onCropChange')?.({ crop: next });
	}

	function measureViewportRect(): BoundingRect | null {
		const node = viewportNode;
		if (!node) return null;
		const rect = node.getBoundingClientRect();
		if (!isVisibleRect(rect)) return null;
		return {
			width: rect.width,
			height: rect.height,
			top: rect.top,
			left: rect.left,
			right: rect.right,
			bottom: rect.bottom
		};
	}

	function setDefaultCrop() {
		const measured = measureViewportRect();
		if (!measured) return;
		const { minSize, maxSize } = sizeLimits();
		const ratio = aspectRatio();
		viewportRect = measured;

		const initialCrop = prop('initialCrop');
		if (initialCrop) {
			setCropRect(
				constrainCrop({ crop: initialCrop, viewportRect: measured, minSize, maxSize, aspectRatio: ratio })
			);
			return;
		}

		const defaultSize = computeDefaultCropDimensions(measured, ratio, fixedCropArea());
		const constrained = computeResizeCrop({
			cropStart: { x: 0, y: 0, width: defaultSize.width, height: defaultSize.height },
			handlePosition: 'se',
			delta: ZERO_POINT,
			viewportRect: measured,
			minSize,
			maxSize,
			aspectRatio: ratio
		});
		const position = centerRect(
			{ width: constrained.width, height: constrained.height },
			measured
		);
		setCropRect({ x: position.x, y: position.y, width: constrained.width, height: constrained.height });
	}

	function resizeCropToViewport(previousViewport: BoundingRect, nextViewport: BoundingRect) {
		const currentCrop = crop;
		if (!isVisibleRect(currentCrop)) {
			setDefaultCrop();
			return;
		}
		if (!isVisibleRect(previousViewport)) return;
		const { minSize, maxSize } = sizeLimits();
		const ratio = aspectRatio();
		const scaled = scaleRect(currentCrop, {
			x: nextViewport.width / previousViewport.width,
			y: nextViewport.height / previousViewport.height
		});
		const constrained = computeResizeCrop({
			cropStart: scaled,
			handlePosition: 'se',
			delta: ZERO_POINT,
			viewportRect: nextViewport,
			minSize,
			maxSize,
			aspectRatio: ratio
		});
		const maxBounds = getMaxBounds(constrained, nextViewport);
		const position = clampPoint(constrained, ZERO_POINT, maxBounds);
		setCropRect({
			x: position.x,
			y: position.y,
			width: constrained.width,
			height: constrained.height
		});
	}

	function measureViewport() {
		const measured = measureViewportRect();
		if (!measured) return;
		if (isSameSize(measured, viewportRect)) {
			viewportRect = measured;
			return;
		}
		const previous = viewportRect;
		viewportRect = measured;
		resizeCropToViewport(previous, measured);
	}

	function setNaturalSize(size: Size) {
		if (isSameSize(size, naturalSize)) return;
		naturalSize = size;
		setDefaultCrop();
	}

	function adjustCropAspectRatio() {
		if (!isVisibleRect(viewportRect)) return;
		const currentCrop = crop;
		if (!isVisibleRect(currentCrop)) return;
		const ratio = aspectRatio();
		if (ratio === undefined) return;
		const currentAspect = currentCrop.width / currentCrop.height;
		if (isAspectRatioEqual(currentAspect, ratio)) return;
		const { minSize, maxSize } = sizeLimits();
		const constrained = computeResizeCrop({
			cropStart: currentCrop,
			handlePosition: 'se',
			delta: ZERO_POINT,
			viewportRect,
			minSize,
			maxSize,
			aspectRatio: ratio
		});
		if (isSameSize(currentCrop, constrained)) return;
		const center = getCenterPoint(currentCrop);
		const position = centerCropOnPoint(constrained, center, viewportRect);
		setCropRect({
			x: position.x,
			y: position.y,
			width: constrained.width,
			height: constrained.height
		});
	}

	function updateCrop(point: Point, modifiers: { shiftKey: boolean; altKey: boolean }) {
		if (!pointerStart || !cropStart) return;
		let delta = subtractPoints(point, pointerStart);
		let ratio = aspectRatio();
		const { minSize, maxSize } = sizeLimits();
		let nextCrop: Rect;

		if (activeHandle) {
			if (aspectRatioProp() === undefined && cropShape() !== 'circle') {
				if (modifiers.shiftKey) {
					const width = crop.width;
					const height = crop.height;
					if (width > 0 && height > 0) {
						const current = width / height;
						if (current > 0) shiftLockRatio = current;
					}
					if (shiftLockRatio !== null && shiftLockRatio > 0) ratio = shiftLockRatio;
				} else shiftLockRatio = null;
			} else shiftLockRatio = null;

			if (modifiers.altKey) delta = { x: delta.x * 2, y: delta.y * 2 };

			nextCrop = computeResizeCrop({
				cropStart,
				handlePosition: activeHandle,
				delta,
				viewportRect,
				minSize,
				maxSize,
				aspectRatio: ratio
			});

			if (modifiers.altKey) {
				const originalCenter = getCenterPoint(cropStart);
				const position = centerCropOnPoint(nextCrop, originalCenter, viewportRect);
				nextCrop = { ...nextCrop, x: position.x, y: position.y };
			}
		} else {
			nextCrop = computeMoveCrop(cropStart, delta, viewportRect);
		}

		setCropRect(nextCrop);
	}

	function updatePanOffset(point: Point) {
		if (!pointerStart || !offsetStart) return;
		const delta = subtractPoints(point, pointerStart);
		offset = clampOffset({
			zoom: zoom(),
			rotation: rotation(),
			viewportSize: viewportRect,
			offset: addPoints(offsetStart, delta),
			fixedCropArea: fixedCropArea(),
			crop
		});
	}

	function endPointer() {
		phase = 'idle';
		pointerStart = null;
		offsetStart = null;
		cropStart = null;
		activeHandle = null;
		shiftLockRatio = null;
		detachPointer?.();
		detachPointer = null;
	}

	function trackPointer() {
		if (detachPointer) return;
		const doc = documentOf();
		const onMove = (event: PointerEvent) => {
			if (phase === 'dragging') {
				updateCrop({ x: event.clientX, y: event.clientY }, {
					shiftKey: event.shiftKey,
					altKey: event.altKey
				});
				return;
			}
			if (phase === 'panning') updatePanOffset({ x: event.clientX, y: event.clientY });
		};
		const onUp = () => endPointer();
		doc.addEventListener('pointermove', onMove);
		doc.addEventListener('pointerup', onUp);
		doc.addEventListener('pointercancel', onUp);
		detachPointer = () => {
			doc.removeEventListener('pointermove', onMove);
			doc.removeEventListener('pointerup', onUp);
			doc.removeEventListener('pointercancel', onUp);
		};
	}

	function canResizeCrop() {
		return !fixedCropArea() && isVisibleRect(viewportRect);
	}

	function canPan() {
		return isVisibleRect(naturalSize) && isVisibleRect(viewportRect);
	}

	function selectionPointerDown(event: PointerEvent) {
		if (fixedCropArea()) {
			event.preventDefault();
			return;
		}
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		if (!isVisibleRect(viewportRect)) return;
		pointerStart = { x: event.clientX, y: event.clientY };
		cropStart = crop;
		phase = 'dragging';
		event.preventDefault();
		trackPointer();
	}

	function handlePointerDown(position: HandlePosition, event: PointerEvent) {
		if (fixedCropArea()) {
			event.preventDefault();
			return;
		}
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		if (!canResizeCrop()) return;
		pointerStart = { x: event.clientX, y: event.clientY };
		cropStart = crop;
		activeHandle = position;
		phase = 'dragging';
		event.preventDefault();
		trackPointer();
	}

	function viewportPointerDown(event: PointerEvent) {
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		const target = event.target as Element | null;
		if (!fixedCropArea() && contains(selectionNode, target)) return;
		const handleElement = target?.closest('[data-scope="image-cropper"][data-part="handle"]');
		if (handleElement) return;
		if (!canPan()) return;
		pointerStart = { x: event.clientX, y: event.clientY };
		offsetStart = { ...offset };
		phase = 'panning';
		trackPointer();
	}

	function updateZoom(options: {
		zoom?: number;
		delta?: number;
		scale?: number;
		panDelta?: Point;
		point?: Point;
	}) {
		if (!isVisibleRect(viewportRect)) {
			if (typeof options.zoom === 'number') setZoomValue(options.zoom);
			return;
		}
		const currentZoom = zoom();
		const currentOffset = offset;
		const point = options.point ?? getCenterPoint(crop);
		let nextZoom: number | null = null;

		if (typeof options.zoom === 'number') {
			nextZoom = clampValue(options.zoom, minZoom(), maxZoom());
		} else if (typeof options.scale === 'number') {
			const clampedScale = clampValue(options.scale, 0.5, 2);
			const sensitivity = zoomSensitivity();
			nextZoom = clampValue(
				currentZoom * (sensitivity > 0 ? Math.pow(clampedScale, sensitivity) : clampedScale),
				minZoom(),
				maxZoom()
			);
		} else if (typeof options.delta === 'number') {
			const step = zoomStep();
			nextZoom = clampValue(
				currentZoom + step * (Math.sign(options.delta) < 0 ? 1 : -1),
				minZoom(),
				maxZoom()
			);
		}

		if (nextZoom === null) return;
		const applyClampedOffset = (targetZoom: number, target: Point) =>
			clampOffset({
				zoom: targetZoom,
				rotation: rotation(),
				viewportSize: viewportRect,
				offset: target,
				fixedCropArea: fixedCropArea(),
				crop
			});

		if (nextZoom === currentZoom && options.panDelta) {
			offset = applyClampedOffset(currentZoom, addPoints(currentOffset, options.panDelta));
			return;
		}
		if (nextZoom === currentZoom) return;

		const { width: viewportWidth, height: viewportHeight } = viewportRect;
		const center = getViewportCenter(viewportRect);
		const zoomRatio = nextZoom / currentZoom;
		let nextOffset = {
			x: (1 - zoomRatio) * (point.x - center.x) + zoomRatio * currentOffset.x,
			y: (1 - zoomRatio) * (point.y - center.y) + zoomRatio * currentOffset.y
		};

		if (options.panDelta) {
			nextOffset = applyClampedOffset(nextZoom, addPoints(nextOffset, options.panDelta));
		} else if (nextZoom < currentZoom) {
			if (fixedCropArea()) {
				nextOffset = applyClampedOffset(nextZoom, nextOffset);
			} else {
				const scaledImageWidth = viewportWidth * nextZoom;
				const scaledImageHeight = viewportHeight * nextZoom;
				if (scaledImageWidth <= viewportWidth) nextOffset.x = 0;
				else {
					const minX = viewportWidth - center.x - scaledImageWidth / 2;
					const maxX = scaledImageWidth / 2 - center.x;
					nextOffset.x = Math.max(minX, Math.min(maxX, nextOffset.x));
				}
				if (scaledImageHeight <= viewportHeight) nextOffset.y = 0;
				else {
					const minY = viewportHeight - center.y - scaledImageHeight / 2;
					const maxY = scaledImageHeight / 2 - center.y;
					nextOffset.y = Math.max(minY, Math.min(maxY, nextOffset.y));
				}
			}
		}

		setZoomValue(nextZoom);
		offset = nextOffset;
	}

	function wheelZoom(event: WheelEvent) {
		const node = viewportNode;
		if (!node) return;
		event.preventDefault();
		const rect = node.getBoundingClientRect();
		updateZoom({
			delta: event.deltaY,
			point: { x: event.clientX - rect.left, y: event.clientY - rect.top }
		});
	}

	function setZoom(target: number) {
		updateZoom({ zoom: target });
	}

	function zoomBy(delta: number) {
		updateZoom({ zoom: zoom() + delta });
	}

	function setRotation(value: number) {
		setRotationValue(value);
	}

	function rotateBy(degrees: number) {
		setRotationValue(rotation() + degrees);
	}

	function setFlip(nextFlip: Partial<FlipState> | undefined) {
		if (!nextFlip) return;
		setFlipValue(nextFlip);
	}

	function flipHorizontally(value?: boolean) {
		const next = typeof value === 'boolean' ? value : !flip().horizontal;
		if (next === flip().horizontal) return;
		setFlipValue({ horizontal: next });
	}

	function flipVertically(value?: boolean) {
		const next = typeof value === 'boolean' ? value : !flip().vertical;
		if (next === flip().vertical) return;
		setFlipValue({ vertical: next });
	}

	function resize(handlePosition: HandlePosition | null, delta: number) {
		if (!handlePosition) return;
		if (!canResizeCrop()) return;
		const { minSize, maxSize } = sizeLimits();
		let deltaX = 0;
		let deltaY = 0;
		if (handlePosition === 'w' || handlePosition === 'nw' || handlePosition === 'sw') {
			deltaX = -delta;
		} else if (handlePosition === 'e' || handlePosition === 'ne' || handlePosition === 'se') {
			deltaX = delta;
		}
		if (handlePosition === 'n' || handlePosition === 'nw' || handlePosition === 'ne') {
			deltaY = -delta;
		} else if (handlePosition === 's' || handlePosition === 'sw' || handlePosition === 'se') {
			deltaY = delta;
		}
		setCropRect(
			computeResizeCrop({
				cropStart: crop,
				handlePosition,
				delta: { x: deltaX, y: deltaY },
				viewportRect,
				minSize,
				maxSize,
				aspectRatio: aspectRatio()
			})
		);
	}

	function setCrop(nextCrop: Rect) {
		if (fixedCropArea()) return;
		if (!isValidRect(nextCrop)) return;
		if (!isVisibleRect(viewportRect)) return;
		const { minSize, maxSize } = sizeLimits();
		setCropRect(
			constrainCrop({ crop: nextCrop, viewportRect, minSize, maxSize, aspectRatio: aspectRatio() })
		);
	}

	function reset() {
		internalZoom = prop('defaultZoom') ?? 1;
		internalRotation = prop('defaultRotation') ?? 0;
		internalFlip = {
			horizontal: prop('defaultFlip')?.horizontal ?? false,
			vertical: prop('defaultFlip')?.vertical ?? false
		};
		offset = { ...ZERO_POINT };
		setDefaultCrop();
	}

	function getImageRect(): Rect | null {
		if (!imageNode || !viewportNode) return null;
		let x = 0;
		let y = 0;
		let current: HTMLElement | null = imageNode;
		while (current && current !== viewportNode) {
			x += current.offsetLeft;
			y += current.offsetTop;
			current = current.offsetParent as HTMLElement | null;
		}
		if (current !== viewportNode) return null;
		return { x, y, width: imageNode.offsetWidth, height: imageNode.offsetHeight };
	}

	function getCropExportParams(): CropExportParams {
		const measured = getImageRect();
		const imageRect =
			measured && measured.width > 0 && measured.height > 0
				? measured
				: {
						x: 0,
						y: 0,
						width: viewportRect.width || naturalSize.width || 1,
						height: viewportRect.height || naturalSize.height || 1
					};
		return {
			crop,
			zoom: zoom(),
			offset,
			rotation: rotation(),
			flip: flip(),
			imageRect,
			naturalSize
		};
	}

	function getCropData(): ImageCropperCropData {
		const params = getCropExportParams();
		const sourceRect = getCropSourceRect(params);
		return {
			x: Math.round(sourceRect.x),
			y: Math.round(sourceRect.y),
			width: Math.round(sourceRect.width),
			height: Math.round(sourceRect.height),
			corners: getCropSourcePoints(params),
			outputSize: getNaturalCropSize(params),
			rotate: rotation(),
			flipX: flip().horizontal,
			flipY: flip().vertical
		};
	}

	async function getCroppedImage(
		options: ImageCropperGetCroppedImageOptions = {}
	): Promise<Blob | string | null> {
		const { type = 'image/png', quality = 1, output = 'blob', maxSize } = options;
		if (!isVisibleRect(naturalSize)) return null;
		const canvas = drawCroppedImageToCanvas(imageNode, getCropExportParams(), maxSize);
		if (!canvas) return null;
		try {
			if (output === 'dataUrl') {
				const dataUrl = canvas.toDataURL(type, quality);
				return dataUrl === 'data:,' ? null : dataUrl;
			}
			return await canvasToBlob(canvas, type, quality);
		} catch {
			return null;
		}
	}

	$effect(() => {
		const ratio = prop('aspectRatio');
		const shape = prop('cropShape');
		if (ratio === undefined && shape === undefined) return;
		adjustCropAspectRatio();
	});

	$effect(() => {
		return () => {
			detachPointer?.();
			detachPointer = null;
			resizeObserver?.disconnect();
			resizeObserver = null;
		};
	});

	const rootAttrs = () =>
		dropUndefined({
			id: rootId(),
			dir: prop('dir') ?? undefined,
			role: 'group',
			'aria-roledescription': translations().rootRoleDescription,
			'aria-label': translations().rootLabel,
			'aria-description': isImageReady
				? translations().previewDescription({
						crop: roundRect(crop),
						zoom: Number.isFinite(zoom()) ? zoom() : null,
						rotation: Number.isFinite(rotation()) ? rotation() : null
					})
				: translations().previewLoading,
			'aria-live': 'polite',
			'aria-controls': `${viewportId()} ${selectionId()}`,
			'aria-busy': isImageReady ? undefined : 'true',
			'data-fixed': dataAttr(fixedCropArea()),
			'data-shape': cropShape(),
			'data-dragging': dataAttr(dragging()),
			'data-panning': dataAttr(panning()),
			style: [
				`--crop-width: ${toPx(crop.width)}`,
				`--crop-height: ${toPx(crop.height)}`,
				`--crop-x: ${toPx(crop.x)}`,
				`--crop-y: ${toPx(crop.y)}`,
				`--image-zoom: ${zoom()}`,
				`--image-rotation: ${rotation()}`,
				`--image-offset-x: ${toPx(offset.x)}`,
				`--image-offset-y: ${toPx(offset.y)}`
			].join('; ')
		});

	const viewportAttrs = () =>
		dropUndefined({
			id: viewportId(),
			role: 'presentation',
			'data-ownedby': rootId(),
			'data-disabled': dataAttr(fixedCropArea()),
			style: 'position: relative; overflow: hidden; touch-action: none; user-select: none',
			onpointerdown: viewportPointerDown,
			onwheel: wheelZoom
		});

	const imageAttrs = () =>
		dropUndefined({
			id: imageId(),
			draggable: false,
			role: 'presentation',
			alt: '',
			'aria-hidden': 'true',
			'data-ownedby': viewportId(),
			'data-ready': dataAttr(isImageReady),
			'data-flip-horizontal': dataAttr(flip().horizontal),
			'data-flip-vertical': dataAttr(flip().vertical),
			onload(event: Event) {
				const image = event.currentTarget as HTMLImageElement;
				if (!image?.complete) return;
				setNaturalSize({ width: image.naturalWidth, height: image.naturalHeight });
				measureViewport();
			},
			style: [
				'pointer-events: none',
				'user-select: none',
				'object-fit: fill',
				`transform: ${getImageTransformCss({ zoom: zoom(), offset, rotation: rotation(), flip: flip() })}`,
				'transform-origin: center center',
				'will-change: transform'
			].join('; ')
		});

	const selectionAttrs = () => {
		const roundedCrop = roundRect(crop);
		return dropUndefined({
			id: selectionId(),
			tabindex: 0,
			role: 'slider',
			'aria-label': translations().selectionLabel({ shape: cropShape() }),
			'aria-roledescription': translations().selectionRoleDescription,
			'aria-valuemin': 0,
			'aria-valuemax': isVisibleRect(viewportRect)
				? Math.max(0, Math.round(viewportRect.width - crop.width))
				: Math.max(roundedCrop.x, 0),
			'aria-valuenow': roundedCrop.x,
			'aria-valuetext': translations().selectionValueText({
				shape: cropShape(),
				...roundedCrop
			}),
			'aria-description': translations().selectionInstructions,
			'data-disabled': dataAttr(fixedCropArea()),
			'data-shape': cropShape(),
			'data-measured': dataAttr(isMeasured),
			'data-dragging': dataAttr(dragging()),
			'data-panning': dataAttr(panning()),
			style: [
				'position: absolute',
				'top: var(--crop-y)',
				'left: var(--crop-x)',
				'width: var(--crop-width)',
				'height: var(--crop-height)',
				'touch-action: none',
				`visibility: ${isMeasured ? 'visible' : 'hidden'}`
			].join('; '),
			onpointerdown: selectionPointerDown,
			onkeydown: selectionKeyDown
		});
	};

	function selectionKeyDown(event: KeyboardEvent) {
		if (event.defaultPrevented) return;
		const key = event.key;
		const isZoomInKey = key === '+' || key === '=';
		if (isZoomInKey || key === '-' || key === '_') {
			updateZoom({ delta: isZoomInKey ? -1 : 1 });
			event.preventDefault();
			return;
		}
		if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return;
		const modifiers = {
			shiftKey: event.shiftKey,
			ctrlKey: event.ctrlKey,
			metaKey: event.metaKey
		};
		const step = getNudgeStep(
			{
				nudgeStep: prop('nudgeStep') ?? 1,
				nudgeStepShift: prop('nudgeStepShift') ?? 10,
				nudgeStepCtrl: prop('nudgeStepCtrl') ?? 50
			},
			modifiers
		);
		const delta = getKeyboardMoveDelta(key, step);

		if (fixedCropArea()) {
			if (event.altKey) return;
			offset = clampOffset({
				zoom: zoom(),
				rotation: rotation(),
				viewportSize: viewportRect,
				offset: addPoints(offset, delta),
				fixedCropArea: true,
				crop
			});
			event.preventDefault();
			return;
		}

		const { minSize, maxSize } = sizeLimits();
		if (event.altKey) {
			const handlePosition: HandlePosition =
				key === 'ArrowUp' || key === 'ArrowDown' ? 's' : 'e';
			setCropRect(
				computeResizeCrop({
					cropStart: crop,
					handlePosition,
					delta,
					viewportRect,
					minSize,
					maxSize,
					aspectRatio: aspectRatio()
				})
			);
			event.preventDefault();
			return;
		}

		setCropRect(computeMoveCrop(crop, delta, viewportRect));
		event.preventDefault();
	}

	const handleAttrs = ({ position }: ImageCropperHandleOptions) =>
		dropUndefined({
			id: handleId(position),
			'data-position': position,
			'aria-hidden': 'true',
			role: 'presentation',
			'data-disabled': dataAttr(fixedCropArea()),
			style: getHandlePositionStyle(position),
			onpointerdown(event: PointerEvent) {
				handlePointerDown(position, event);
			}
		});

	const gridAttrs = ({ axis }: ImageCropperGridOptions) =>
		dropUndefined({
			'aria-hidden': 'true',
			'data-axis': axis,
			'data-dragging': dataAttr(dragging()),
			'data-panning': dataAttr(panning()),
			style: [
				'position: absolute',
				`inset: ${axis === 'horizontal' ? '33.33% 0' : '0 33.33%'}`,
				'pointer-events: none',
				`visibility: ${isMeasured ? 'visible' : 'hidden'}`
			].join('; ')
		});

	return {
		get zoom() {
			return zoom();
		},
		get rotation() {
			return rotation();
		},
		get flip() {
			return flip();
		},
		get crop() {
			return crop;
		},
		get offset() {
			return offset;
		},
		get naturalSize() {
			return naturalSize;
		},
		get viewportRect() {
			return viewportRect;
		},
		get viewportSize() {
			return { width: viewportRect.width, height: viewportRect.height };
		},
		get dragging() {
			return dragging();
		},
		get panning() {
			return panning();
		},
		setZoom,
		zoomBy,
		setRotation,
		rotateBy,
		setFlip,
		flipHorizontally,
		flipVertically,
		resize,
		setCrop,
		reset,
		getCropData,
		getCroppedImage,
		rootAttrs,
		viewportAttrs,
		imageAttrs,
		selectionAttrs,
		handleAttrs,
		gridAttrs,
		registerRoot: (node) => {
			rootNode = node;
		},
		registerViewport: (node) => {
			viewportNode = node as HTMLElement | null;
			resizeObserver?.disconnect();
			resizeObserver = null;
			if (!viewportNode) return;
			untrack(() => measureViewport());
			const Observer = globalThis.ResizeObserver;
			if (!Observer) return;
			resizeObserver = new Observer(() => measureViewport());
			resizeObserver.observe(viewportNode);
		},
		registerImage: (node) => {
			imageNode = node as HTMLImageElement | null;
			if (!imageNode || !imageNode.complete) return;
			const size = { width: imageNode.naturalWidth, height: imageNode.naturalHeight };
			untrack(() => {
				if (!isVisibleRect(naturalSize) && isVisibleRect(size)) setNaturalSize(size);
			});
		},
		registerSelection: (node) => {
			selectionNode = node as HTMLElement | null;
		},
		measureViewport
	};
}
