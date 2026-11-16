import { getContext, setContext } from 'svelte';
import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import { getStroke, getSvgPathFromStroke } from './signature-pad-stroke';

export interface SignaturePadPoint {
	x: number;
	y: number;
	pressure?: number;
}

export interface SignaturePadDrawingOptions {
	size?: number;
	thinning?: number;
	smoothing?: number;
	streamline?: number;
	simulatePressure?: boolean;
	fill?: string;
	last?: boolean;
}

export interface SignaturePadDrawDetails {
	paths: string[];
	currentPath: string | null;
}

export type SignaturePadDataUrlType = 'image/png' | 'image/jpeg' | 'image/svg+xml';

export interface SignaturePadDataUrlOptions {
	type: SignaturePadDataUrlType;
	quality?: number;
}

export interface SignaturePadDrawEndDetails {
	paths: string[];
	getDataUrl(type: SignaturePadDataUrlType, quality?: number): Promise<string>;
}

export interface SignaturePadElementIds {
	root?: string;
	control?: string;
	label?: string;
	hiddenInput?: string;
}

export interface SignaturePadTranslations {
	control?: string;
	clearTrigger?: string;
}

export interface UseSignaturePadProps {
	defaultPaths?: string[];
	paths?: string[];
	drawing?: SignaturePadDrawingOptions;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	name?: string;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: SignaturePadElementIds;
	translations?: SignaturePadTranslations;
	onDraw?: (details: SignaturePadDrawDetails) => void;
	onDrawEnd?: (details: SignaturePadDrawEndDetails) => void;
}

export type SignaturePadDir = 'ltr' | 'rtl' | 'auto' | null;

export interface SignaturePadApi {
	readonly empty: boolean;
	readonly drawing: boolean;
	readonly currentPath: string | null;
	readonly paths: string[];
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly required: boolean;
	readonly dir: SignaturePadDir | undefined;
	readonly rootId: string;
	readonly controlId: string;
	readonly labelId: string;
	readonly hiddenInputId: string;
	clear(): void;
	getDataUrl(type: SignaturePadDataUrlType, quality?: number): Promise<string>;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	segmentAttrs(): Record<string, unknown>;
	segmentPathAttrs(path: string): Record<string, unknown>;
	guideAttrs(): Record<string, unknown>;
	clearTriggerAttrs(): Record<string, unknown>;
	hiddenInputAttrs(props: { value: string }): Record<string, unknown>;
	registerControl(node: Element | null): void;
	registerSegment(node: Element | null): void;
}

const defaultDrawing = {
	size: 2,
	simulatePressure: false,
	thinning: 0.7,
	smoothing: 0.4,
	streamline: 0.6,
};

const defaultTranslations = {
	control: 'signature pad',
	clearTrigger: 'clear signature',
};

const SVG_NS = 'http://www.w3.org/2000/svg';

const CONTROL_STYLE = 'position: relative; touch-action: none; user-select: none; -webkit-user-select: none;';

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	for (const key of Object.keys(value)) if (value[key] === undefined) delete value[key];
	return value;
}

function isLeftClick(event: PointerEvent) {
	return event.button === 0 && event.ctrlKey === false;
}

function currentDocument(node: Element | null | undefined): Document | null {
	if (node?.ownerDocument) return node.ownerDocument;
	return typeof document === 'undefined' ? null : document;
}

function isModifierKey(event: PointerEvent) {
	return event.altKey || event.ctrlKey || event.metaKey;
}

function relativePoint(event: PointerEvent, element: Element) {
	const { left, top } = element.getBoundingClientRect();
	return { x: event.clientX - left, y: event.clientY - top };
}

export function createSignaturePad(getProps: () => UseSignaturePadProps, uid: string): SignaturePadApi {
	let internalPaths = $state<string[]>(getProps().defaultPaths ?? []);
	let currentPoints = $state<SignaturePadPoint[]>([]);
	let currentPath = $state<string | null>(null);
	let isDrawing = $state(false);
	let controlNode = $state<HTMLElement | null>(null);
	let segmentNode = $state<SVGElement | null>(null);
	let stopTracking: (() => void) | null = null;

	const id = () => getProps().id ?? uid;
	const rootId = () => getProps().ids?.root ?? `signature-${id()}`;
	const controlId = () => getProps().ids?.control ?? `signature-control-${id()}`;
	const labelId = () => getProps().ids?.label ?? `signature-label-${id()}`;
	const hiddenInputId = () => getProps().ids?.hiddenInput ?? `signature-input-${id()}`;

	const isControlled = () => getProps().paths !== undefined;
	const paths = () => (isControlled() ? (getProps().paths ?? []) : internalPaths);
	const disabled = () => Boolean(getProps().disabled);
	const readOnly = () => Boolean(getProps().readOnly);
	const required = () => Boolean(getProps().required);
	const interactive = () => !disabled() && !readOnly();
	const drawingOptions = (): SignaturePadDrawingOptions => ({ ...defaultDrawing, ...getProps().drawing });
	const translations = () => ({ ...defaultTranslations, ...getProps().translations });
	const dir = () => getProps().dir ?? undefined;

	function setPaths(next: string[]) {
		internalPaths = next;
		getProps().onDraw?.({ paths: next, currentPath: null });
	}

	function addPoint(point: SignaturePadPoint) {
		currentPoints = [...currentPoints, point];
		currentPath = getSvgPathFromStroke(getStroke(currentPoints, drawingOptions()));
	}

	function endStroke() {
		setPaths([...paths(), currentPath ?? '']);
		currentPoints = [];
		currentPath = null;
	}

	function invokeOnDrawEnd(details: string[]) {
		getProps().onDrawEnd?.({
			paths: details,
			getDataUrl: (type, quality = 0.92) => getDataUrlValue(type, quality),
		});
	}

	function focusControl() {
		queueMicrotask(() => controlNode?.focus({ preventScroll: true }));
	}

	function clear() {
		currentPoints = [];
		setPaths([]);
		currentPath = null;
		invokeOnDrawEnd([]);
		focusControl();
	}

	function stopPointerTracking() {
		stopTracking?.();
		stopTracking = null;
	}

	function trackPointerMove() {
		stopPointerTracking();
		const doc = currentDocument(controlNode);
		if (!doc) return;
		const onMove = (event: PointerEvent) => {
			const control = controlNode;
			if (!control) return;
			addPoint({ ...relativePoint(event, control), pressure: event.pressure });
			getProps().onDraw?.({ paths: paths(), currentPath: currentPath ?? '' });
		};
		const onUp = () => {
			stopPointerTracking();
			isDrawing = false;
			endStroke();
			invokeOnDrawEnd([...paths()]);
		};
		doc.addEventListener('pointermove', onMove);
		doc.addEventListener('pointerup', onUp);
		stopTracking = () => {
			doc.removeEventListener('pointermove', onMove);
			doc.removeEventListener('pointerup', onUp);
		};
	}

	async function getDataUrlValue(type: SignaturePadDataUrlType, quality = 1): Promise<string> {
		if (!paths().length) return '';
		const control = controlNode;
		const segment = (segmentNode as SVGSVGElement | null) ?? control?.querySelector<SVGSVGElement>('[data-part="segment"]') ?? null;
		if (!segment) return '';
		const doc = segment.ownerDocument;
		const rect = segment.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const clone = segment.cloneNode(true) as SVGSVGElement;
		clone.setAttribute('width', `${width}`);
		clone.setAttribute('height', `${height}`);
		clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
		const xml = new XMLSerializer().serializeToString(clone);
		const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
		if (type === 'image/svg+xml') return dataUrl;
		const view = doc.defaultView;
		if (!view) return dataUrl;
		const image = new view.Image();
		await new Promise<void>((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = () => reject(new Error('The signature could not be rasterized'));
			image.src = dataUrl;
		});
		const canvas = doc.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const context = canvas.getContext('2d');
		if (!context) return dataUrl;
		context.drawImage(image, 0, 0, width, height);
		return canvas.toDataURL(type, quality);
	}

	$effect(() => () => stopPointerTracking());

	return {
		get empty() {
			return paths().length === 0;
		},
		get drawing() {
			return isDrawing;
		},
		get currentPath() {
			return currentPath;
		},
		get paths() {
			return paths();
		},
		get disabled() {
			return disabled();
		},
		get readOnly() {
			return readOnly();
		},
		get required() {
			return required();
		},
		get dir() {
			return dir();
		},
		get rootId() {
			return rootId();
		},
		get controlId() {
			return controlId();
		},
		get labelId() {
			return labelId();
		},
		get hiddenInputId() {
			return hiddenInputId();
		},
		clear,
		getDataUrl: getDataUrlValue,
		registerControl(node) {
			controlNode = (node as HTMLElement | null) ?? null;
		},
		registerSegment(node) {
			segmentNode = (node as SVGElement | null) ?? null;
		},
		rootAttrs() {
			return dropUndefined({
				id: rootId(),
				dir: dir(),
				'data-disabled': dataAttr(disabled()),
			});
		},
		labelAttrs() {
			return dropUndefined({
				id: labelId(),
				dir: dir(),
				for: hiddenInputId(),
				'data-disabled': dataAttr(disabled()),
				'data-required': dataAttr(required()),
				onclick(event: MouseEvent) {
					if (!interactive()) return;
					if (event.defaultPrevented) return;
					controlNode?.focus({ preventScroll: true });
				},
			});
		},
		controlAttrs() {
			return dropUndefined({
				id: controlId(),
				dir: dir(),
				tabindex: disabled() ? undefined : 0,
				role: 'application',
				'aria-roledescription': 'signature pad',
				'aria-label': translations().control,
				'aria-disabled': disabled(),
				'data-disabled': dataAttr(disabled()),
				style: CONTROL_STYLE,
				onpointerdown(event: PointerEvent) {
					if (!isLeftClick(event)) return;
					if (isModifierKey(event)) return;
					if (!interactive()) return;
					if ((event.target as Element | null)?.closest('[data-part=clear-trigger]')) return;
					const currentTarget = event.currentTarget as HTMLElement | null;
					currentTarget?.setPointerCapture?.(event.pointerId);
					const control = currentTarget ?? controlNode;
					if (!control) return;
					addPoint({ ...relativePoint(event, control), pressure: event.pressure });
					isDrawing = true;
					trackPointerMove();
				},
				onpointerup(event: PointerEvent) {
					if (!interactive()) return;
					const currentTarget = event.currentTarget as HTMLElement | null;
					if (!currentTarget?.hasPointerCapture?.(event.pointerId)) return;
					currentTarget.releasePointerCapture(event.pointerId);
				},
			});
		},
		segmentAttrs() {
			const fill = drawingOptions().fill;
			const style = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;${fill === undefined ? '' : ` fill: ${fill};`}`;
			return { style };
		},
		segmentPathAttrs(path) {
			return { d: path };
		},
		guideAttrs() {
			return dropUndefined({
				dir: dir(),
				'data-disabled': dataAttr(disabled()),
			});
		},
		clearTriggerAttrs() {
			return dropUndefined({
				dir: dir(),
				type: 'button',
				'aria-label': translations().clearTrigger,
				hidden: !paths().length || isDrawing || readOnly(),
				disabled: disabled(),
				onclick() {
					clear();
				},
			});
		},
		hiddenInputAttrs({ value }) {
			return dropUndefined({
				id: hiddenInputId(),
				type: 'text',
				hidden: true,
				disabled: disabled(),
				required: required(),
				readonly: true,
				name: getProps().name ?? undefined,
				value,
			});
		},
	};
}

const signaturePadContext = createContext<SignaturePadApi>('SignaturePad', 'SignaturePad.Root');

export const setSignaturePadContext = signaturePadContext.set;

export function useSignaturePadContext(): SignaturePadApi {
	return signaturePadContext.get();
}

type ReadOnlyAccessor = () => boolean | undefined;

const signaturePadReadOnlyKey = Symbol('SignaturePadReadOnly');

export function setSignaturePadReadOnly(readOnly: ReadOnlyAccessor): void {
	setContext(signaturePadReadOnlyKey, readOnly);
}

export function getSignaturePadReadOnly(): ReadOnlyAccessor | undefined {
	return getContext<ReadOnlyAccessor | undefined>(signaturePadReadOnlyKey);
}
