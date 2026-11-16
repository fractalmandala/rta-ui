import { createContext } from '../../internal/context';
import { qrEncode, qrPatternPath, type QrCodeEncoding } from './qr-encode';

export interface QrCodeValueChangeDetails {
	value: string;
}

export interface QrCodeGenerateOptions extends QrCodeEncoding {}

export interface QrCodeElementIds {
	root?: string;
	frame?: string;
	overlay?: string;
}

export interface QrCodeDownloadTriggerOptions {
	fileName: string;
	mimeType?: string;
	quality?: number;
}

export interface UseQrCodeProps {
	id?: string | null;
	ids?: QrCodeElementIds;
	defaultValue?: string;
	value?: string;
	encoding?: QrCodeGenerateOptions;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	pixelSize?: number;
	getRootNode?: () => ShadowRoot | Document | Node;
	onValueChange?: (details: QrCodeValueChangeDetails) => void;
}

export interface QrCodeApi {
	readonly value: string;
	setValue(value: string): void;
	getDataUrl(type?: string, quality?: number): Promise<string>;
	rootAttrs(): Record<string, unknown>;
	frameAttrs(): Record<string, unknown>;
	patternAttrs(): Record<string, unknown>;
	overlayAttrs(): Record<string, unknown>;
	downloadTriggerAttrs(options: QrCodeDownloadTriggerOptions): Record<string, unknown>;
	registerFrame(node: globalThis.Element | null): void;
	registerOverlay(node: globalThis.Element | null): void;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

function serializeSvg(node: SVGSVGElement): string {
	const clone = node.cloneNode(true) as SVGSVGElement;
	clone.setAttribute('xmlns', SVG_NS);
	clone.querySelectorAll('foreignObject').forEach((child) => child.remove());
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
}

async function rasterize(
	source: string,
	size: { width: number; height: number },
	type: string,
	quality?: number
): Promise<string> {
	const win = typeof window === 'undefined' ? undefined : window;
	if (!win) return source;
	const image = new win.Image();
	await new Promise<void>((resolve, reject) => {
		image.onload = () => resolve();
		image.onerror = () => reject(new Error('Failed to rasterize the QR code'));
		image.src = source;
	});
	const canvas = win.document.createElement('canvas');
	canvas.width = Math.max(1, Math.round(size.width || image.naturalWidth || 1));
	canvas.height = Math.max(1, Math.round(size.height || image.naturalHeight || 1));
	const context = canvas.getContext('2d');
	if (!context) return source;
	context.drawImage(image, 0, 0, canvas.width, canvas.height);
	return canvas.toDataURL(type, quality);
}

function overlayImage(svg: SVGSVGElement, overlay: Element): SVGImageElement | null {
	const box = svg.getBoundingClientRect();
	const overlayBox = overlay.getBoundingClientRect();
	if (!box.width || !overlayBox.width) return null;

	const image = overlay.querySelector('img');
	let href: string | null = image?.currentSrc || image?.src || null;
	if (!href) {
		const nested = overlay.querySelector('svg');
		if (!nested) return null;
		const clone = nested.cloneNode(true) as SVGSVGElement;
		clone.setAttribute('xmlns', SVG_NS);
		href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
	}
	if (!href) return null;

	const viewBox = svg.viewBox.baseVal;
	const scaleX = (viewBox.width || box.width) / box.width;
	const scaleY = (viewBox.height || box.height) / box.height;
	const node = svg.ownerDocument.createElementNS(SVG_NS, 'image');
	node.setAttribute('href', href);
	node.setAttribute('x', String((overlayBox.left - box.left) * scaleX));
	node.setAttribute('y', String((overlayBox.top - box.top) * scaleY));
	node.setAttribute('width', String(overlayBox.width * scaleX));
	node.setAttribute('height', String(overlayBox.height * scaleY));
	return node;
}

const qrCodeContext = createContext<QrCodeApi>('QrCode', 'QrCode.Root');
export const useQrCodeContext = () => qrCodeContext.get();
export const setQrCodeContext = (api: QrCodeApi) => qrCodeContext.set(api);

export function createQrCode(getProps: () => UseQrCodeProps, uid: string): QrCodeApi {
	const rootId = () => getProps().ids?.root ?? `qrcode:${getProps().id ?? uid}:root`;
	const frameId = () => getProps().ids?.frame ?? `qrcode:${getProps().id ?? uid}:frame`;
	const overlayId = () => getProps().ids?.overlay ?? `qrcode:${getProps().id ?? uid}:overlay`;
	const pixelSize = () => getProps().pixelSize ?? 10;

	let internalValue = $state(getProps().defaultValue ?? '');
	let frameNode: SVGSVGElement | null = null;
	let overlayNode: globalThis.Element | null = null;

	const value = () => getProps().value ?? internalValue;
	const matrix = $derived(qrEncode(value(), getProps().encoding));
	const width = $derived(matrix.size * pixelSize());

	function setValue(next: string) {
		const previous = value();
		if (getProps().value === undefined) internalValue = next;
		if (previous !== next) getProps().onValueChange?.({ value: next });
	}

	function download(options: QrCodeDownloadTriggerOptions) {
		void getDataUrl(options.mimeType, options.quality).then((href) => {
			const doc = frameNode?.ownerDocument ?? document;
			const anchor = doc.createElement('a');
			anchor.href = href;
			anchor.rel = 'noopener';
			anchor.download = options.fileName;
			anchor.click();
			setTimeout(() => anchor.remove(), 0);
		});
	}

	async function getDataUrl(type = 'image/png', quality?: number): Promise<string> {
		if (!frameNode) throw new Error('QrCode.Frame must be rendered before reading a data URL');
		const source = serializeSvg(frameNode);
		if (type === 'image/svg+xml') return source;

		const clone = frameNode.cloneNode(true) as SVGSVGElement;
		clone.querySelectorAll('foreignObject').forEach((child) => child.remove());
		if (overlayNode) {
			const image = overlayImage(clone, overlayNode);
			if (image) clone.appendChild(image);
		}
		const box = frameNode.getBoundingClientRect();
		clone.setAttribute('xmlns', SVG_NS);
		const serialized = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
		return rasterize(serialized, box, type, quality);
	}

	return {
		get value() {
			return value();
		},
		setValue,
		getDataUrl,
		rootAttrs: () =>
			dropUndefined({
				id: rootId(),
				dir: getProps().dir ?? undefined,
				style: `--qrcode-pixel-size: ${pixelSize()}px; --qrcode-width: ${width}px; --qrcode-height: ${width}px; position: relative;`
			}),
		frameAttrs: () =>
			dropUndefined({
				id: frameId(),
				xmlns: SVG_NS,
				viewBox: `0 0 ${width} ${width}`
			}),
		patternAttrs: () => dropUndefined({ d: qrPatternPath(matrix, pixelSize()) }),
		overlayAttrs: () =>
			dropUndefined({
				id: overlayId(),
				style: 'position: absolute; top: 50%; left: 50%; translate: -50% -50%;'
			}),
		downloadTriggerAttrs: (options) =>
			dropUndefined({
				type: 'button',
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					download(options);
				}
			}),
		registerFrame: (node) => {
			frameNode = node as SVGSVGElement | null;
		},
		registerOverlay: (node) => {
			overlayNode = node;
		}
	};
}
