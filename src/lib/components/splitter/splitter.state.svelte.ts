import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';

export interface SplitterPanelData {
	id: string;
	minSize?: number | string;
	maxSize?: number | string;
	collapsible?: boolean;
	collapsedSize?: number | string;
	order?: number;
}

export interface SplitterResizeDetails {
	size: number[];
}

export interface SplitterExpandCollapseDetails {
	panelId: string;
}

export interface UseSplitterProps {
	panels: SplitterPanelData[];
	defaultSize?: Array<number | string>;
	size?: Array<number | string>;
	orientation?: 'horizontal' | 'vertical';
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	keyboardResizeBy?: number;
	id?: string | null;
	onResize?: (details: SplitterResizeDetails) => void;
	onResizeStart?: () => void;
	onResizeEnd?: (details: SplitterResizeDetails) => void;
	onCollapse?: (details: SplitterExpandCollapseDetails) => void;
	onExpand?: (details: SplitterExpandCollapseDetails) => void;
}

export interface SplitterApi {
	readonly dragging: boolean;
	readonly orientation: 'horizontal' | 'vertical';
	readonly panels: SplitterPanelData[];
	readonly rootId: string;
	getSizes(): number[];
	setSizes(size: number[]): void;
	resetSizes(): void;
	collapsePanel(id: string): void;
	expandPanel(id: string, minSize?: number): void;
	resizePanel(id: string, size: number): void;
	getPanelSize(id: string): number;
	isPanelCollapsed(id: string): boolean;
	isPanelExpanded(id: string): boolean;
	getItems(): Array<{ type: 'panel' | 'handle'; id: string }>;
	rootAttrs(): Record<string, unknown>;
	panelAttrs(id: string): Record<string, unknown>;
	resizeTriggerAttrs(id: string, disabled?: boolean): Record<string, unknown>;
	resizeTriggerIndicatorAttrs(id: string, disabled?: boolean): Record<string, unknown>;
	registerRoot(node: globalThis.Element | null): void;
}

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

const sizeRegex = /^(-?\d*\.?\d+)(%|px|em|rem|vw|vh)?$/;

function parsePanelSize(size: number | string | null | undefined): number | undefined {
	if (size == null) return undefined;
	if (typeof size === 'number') return size;
	const match = size.trim().match(sizeRegex);
	if (!match) return undefined;
	const value = Number.parseFloat(match[1]);
	if (!Number.isFinite(value)) return undefined;
	const unit = match[2];
	if (unit == null || unit === '%') return value;
	return undefined;
}

function toCssPanelSize(size: number | string | null | undefined): string | undefined {
	if (size == null) return undefined;
	if (typeof size === 'number') return `${size}%`;
	const trimmed = size.trim();
	if (/^-?\d*\.?\d+%$/.test(trimmed)) return trimmed;
	const match = trimmed.match(sizeRegex);
	if (!match) return undefined;
	const value = Number.parseFloat(match[1]);
	if (!Number.isFinite(value)) return undefined;
	const unit = match[2];
	return unit == null ? `${value}%` : `${value}${unit}`;
}

function resolvePanelSizes(
	sizes: Array<number | string> | undefined,
	panels: SplitterPanelData[]
): number[] {
	const nextSize = new Array<number>(panels.length);
	let remaining = 100;
	let withSizes = 0;
	for (let index = 0; index < panels.length; index++) {
		const size = parsePanelSize(sizes?.[index]);
		if (size == null) continue;
		withSizes++;
		nextSize[index] = size;
		remaining -= size;
	}
	for (let index = 0; index < panels.length; index++) {
		if (nextSize[index] != null) continue;
		const remainingPanels = panels.length - withSizes;
		const size = remainingPanels > 0 ? remaining / remainingPanels : 0;
		withSizes++;
		nextSize[index] = size;
		remaining -= size;
	}
	return nextSize;
}

function flexStyle(
	panels: SplitterPanelData[],
	sizes: number[],
	panelIndex: number,
	horizontal: boolean,
	dragging: boolean
): string {
	const panel = panels[panelIndex];
	const resolved = sizes[panelIndex];
	const flexGrow = panels.length === 1 ? '1' : Number(resolved.toPrecision(3)).toString();
	const minSize = toCssPanelSize(panel?.minSize);
	const maxSize = toCssPanelSize(panel?.maxSize);
	const declarations = [
		'flex-basis: 0',
		`flex-grow: ${flexGrow}`,
		'flex-shrink: 1',
		minSize ? `min-${horizontal ? 'width' : 'height'}: ${minSize}` : undefined,
		maxSize ? `max-${horizontal ? 'width' : 'height'}: ${maxSize}` : undefined,
		'overflow: hidden',
		dragging ? 'pointer-events: none' : undefined
	].filter(Boolean);
	return `${declarations.join('; ')};`;
}

const splitterContext = createContext<SplitterApi>('Splitter', 'Splitter.Root');
export const useSplitterContext = () => splitterContext.get();
export const setSplitterContext = (api: SplitterApi) => splitterContext.set(api);

export function createSplitter(getProps: () => UseSplitterProps, uid: string): SplitterApi {
	const rootId = () => getProps().id ?? `splitter:${uid}`;
	const orientation = () => getProps().orientation ?? 'horizontal';
	const horizontal = () => orientation() === 'horizontal';
	const panels = () => getProps().panels;

	let internalSize = $state<number[]>(
		resolvePanelSizes(getProps().size ?? getProps().defaultSize, panels())
	);
	let dragState = $state<{ id: string; startSizes: number[]; startPoint: number } | null>(null);
	let rootNode: globalThis.Element | null = null;

	const sizes = () => (getProps().size ? resolvePanelSizes(getProps().size, panels()) : internalSize);
	const dragging = () => dragState !== null;

	function commit(next: number[]) {
		if (getProps().size === undefined) internalSize = next;
		getProps().onResize?.({ size: next });
	}

	function panelIndex(id: string) {
		return panels().findIndex((panel) => panel.id === id);
	}

	function clampPair(next: number[], beforeIndex: number, afterIndex: number) {
		const before = panels()[beforeIndex];
		const after = panels()[afterIndex];
		const pairTotal = next[beforeIndex] + next[afterIndex];
		const minBefore = before?.collapsible ? 0 : (parsePanelSize(before?.minSize) ?? 0);
		const minAfter = after?.collapsible ? 0 : (parsePanelSize(after?.minSize) ?? 0);
		const maxBefore = parsePanelSize(before?.maxSize) ?? pairTotal;
		const maxAfter = parsePanelSize(after?.maxSize) ?? pairTotal;
		const boundBefore = Math.min(Math.max(next[beforeIndex], minBefore), maxBefore);
		next[beforeIndex] = boundBefore;
		next[afterIndex] = Math.min(Math.max(pairTotal - boundBefore, minAfter), maxAfter);
		return next;
	}

	function moveBy(id: string, deltaPercent: number) {
		const [beforeId, afterId] = splitId(id);
		const beforeIndex = panelIndex(beforeId);
		const afterIndex = panelIndex(afterId);
		if (beforeIndex < 0 || afterIndex < 0) return;
		const next = [...sizes()];
		next[beforeIndex] += deltaPercent;
		next[afterIndex] -= deltaPercent;
		commit(clampPair(next, beforeIndex, afterIndex));
	}

	function splitId(id: string): [string, string] {
		const [beforeId, afterId] = id.split(':');
		if (beforeId && afterId) return [beforeId, afterId];
		const index = panelIndex(beforeId);
		const next = panels()[index + 1];
		return [beforeId, next?.id ?? ''];
	}

	function onPointerMove(event: PointerEvent) {
		if (!dragState) return;
		const rootSize = rootNode
			? horizontal()
				? rootNode.getBoundingClientRect().width
				: rootNode.getBoundingClientRect().height
			: 0;
		if (!rootSize) return;
		const point = horizontal() ? event.clientX : event.clientY;
		const deltaPercent = ((point - dragState.startPoint) / rootSize) * 100;
		const [beforeId, afterId] = splitId(dragState.id);
		const beforeIndex = panelIndex(beforeId);
		const afterIndex = panelIndex(afterId);
		if (beforeIndex < 0 || afterIndex < 0) return;
		const next = [...dragState.startSizes];
		next[beforeIndex] += deltaPercent;
		next[afterIndex] -= deltaPercent;
		commit(clampPair(next, beforeIndex, afterIndex));
	}

	function endDrag() {
		if (!dragState) return;
		dragState = null;
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', endDrag);
		getProps().onResizeEnd?.({ size: sizes() });
	}

	function resizePanel(id: string, size: number) {
		const index = panelIndex(id);
		if (index < 0) return;
		const next = [...sizes()];
		const delta = size - next[index];
		next[index] = size;
		const sibling = next[index + 1] != null ? index + 1 : index - 1;
		if (next[sibling] != null) next[sibling] -= delta;
		commit(next);
	}

	function isCollapsedPanel(id: string) {
		const panel = panels().find((entry) => entry.id === id);
		if (!panel?.collapsible) return false;
		const index = panelIndex(id);
		return Math.abs((sizes()[index] ?? 0) - (parsePanelSize(panel.collapsedSize) ?? 0)) < 0.1;
	}

	function collapsePanel(id: string) {
		const panel = panels().find((entry) => entry.id === id);
		if (!panel) return;
		resizePanel(id, parsePanelSize(panel.collapsedSize) ?? 0);
		getProps().onCollapse?.({ panelId: id });
	}

	function expandPanel(id: string, minSize?: number) {
		const panel = panels().find((entry) => entry.id === id);
		if (!panel) return;
		resizePanel(id, minSize ?? parsePanelSize(panel.minSize) ?? 0);
		getProps().onExpand?.({ panelId: id });
	}

	return {
		getSizes: () => sizes(),
		setSizes: (size) => commit(size),
		resetSizes: () =>
			commit(resolvePanelSizes(getProps().size ?? getProps().defaultSize, panels())),
		collapsePanel: (id) => collapsePanel(id),
		expandPanel: (id, minSize) => expandPanel(id, minSize),
		resizePanel,
		getPanelSize: (id) => {
			const index = panelIndex(id);
			return index < 0 ? 0 : sizes()[index];
		},
		isPanelCollapsed: (id) => {
			const panel = panels().find((entry) => entry.id === id);
			if (!panel?.collapsible) return false;
			return Math.abs((sizes()[panelIndex(id)] ?? 0) - (parsePanelSize(panel.collapsedSize) ?? 0)) < 0.1;
		},
		isPanelExpanded: (id) => {
			const panel = panels().find((entry) => entry.id === id);
			if (!panel?.collapsible) return true;
			return (sizes()[panelIndex(id)] ?? 0) > (parsePanelSize(panel.collapsedSize) ?? 0);
		},
		getItems: () =>
			panels().flatMap((panel, index, all) => {
				const next = all[index + 1];
				return next
					? [
							{ type: 'panel' as const, id: panel.id },
							{ type: 'handle' as const, id: `${panel.id}:${next.id}` }
						]
					: [{ type: 'panel' as const, id: panel.id }];
			}),
		rootAttrs: () =>
			dropUndefined({
				id: rootId(),
				dir: getProps().dir ?? undefined,
				'data-orientation': orientation(),
				'data-dragging': dataAttr(dragging()),
				style: `display: flex; flex-direction: ${horizontal() ? 'row' : 'column'}; height: 100%; width: 100%; overflow: hidden;`
			}),
		panelAttrs: (id) => {
			const index = panelIndex(id);
			return dropUndefined({
				id: `${rootId()}:panel:${id}`,
				dir: getProps().dir ?? undefined,
				'data-orientation': orientation(),
				'data-dragging': dataAttr(dragging()),
				'data-id': id,
				'data-index': index,
				'data-ownedby': rootId(),
				style: flexStyle(panels(), sizes(), Math.max(index, 0), horizontal(), dragging())
			});
		},
		resizeTriggerIndicatorAttrs: (id, disabled = false) => {
			const state = {
				dragging: dragState?.id === id,
				focused: dragState?.id === id,
				disabled
			};
			return dropUndefined({
				'data-orientation': orientation(),
				'data-focus': dataAttr(state.focused),
				'data-dragging': dataAttr(state.dragging),
				'data-disabled': dataAttr(state.disabled),
				'data-ownedby': rootId()
			});
		},
		resizeTriggerAttrs: (id, disabled = false) => {
			const [beforeId, afterId] = splitId(id);
			const beforeIndex = panelIndex(beforeId);
			const afterIndex = panelIndex(afterId);
			const beforeSize = sizes()[beforeIndex] ?? 0;
			const pairTotal =
				beforeSize + (sizes()[afterIndex] ?? 0) || 0;
			return dropUndefined({
				id: `${rootId()}:trigger:${id}`,
				dir: getProps().dir ?? undefined,
				role: 'separator',
				'data-id': id,
				'data-ownedby': rootId(),
				tabindex: disabled ? undefined : 0,
				'aria-valuenow': Math.round(beforeSize),
				'aria-valuemin': 0,
				'aria-valuemax': Math.round(pairTotal),
				'data-orientation': orientation(),
				'aria-orientation': horizontal() ? 'vertical' : 'horizontal',
				'aria-controls':
					beforeId && afterId
						? `${rootId()}:panel:${beforeId} ${rootId()}:panel:${afterId}`
						: undefined,
				'data-focus': dataAttr(dragState?.id === id),
				'data-dragging': dataAttr(dragState?.id === id),
				'data-disabled': dataAttr(disabled),
				style: `touch-action: none; user-select: none; -webkit-user-select: none; flex: 0 0 auto; ${disabled ? 'pointer-events: none;' : ''} cursor: ${horizontal() ? 'col-resize' : 'row-resize'}; ${horizontal() ? 'min-height' : 'min-width'}: 0;`,
				onpointerdown(event: PointerEvent) {
					if (event.button !== 0) return;
					if (disabled) {
						event.preventDefault();
						return;
					}
					const node = event.currentTarget as HTMLElement;
					node.focus({ preventScroll: true });
					dragState = {
						id,
						startSizes: [...sizes()],
						startPoint: horizontal() ? event.clientX : event.clientY
					};
					getProps().onResizeStart?.();
					node.setPointerCapture?.(event.pointerId);
					window.addEventListener('pointermove', onPointerMove);
					window.addEventListener('pointerup', endDrag);
					event.preventDefault();
					event.stopPropagation();
				},
				onkeydown(event: KeyboardEvent) {
					if (event.defaultPrevented || disabled) return;
					const delta = event.shiftKey ? 10 : (getProps().keyboardResizeBy ?? 1);
					const [beforeId, afterId] = splitId(id);
					switch (event.key) {
						case 'ArrowLeft':
							if (!horizontal()) return;
							event.preventDefault();
							moveBy(id, -delta);
							break;
						case 'ArrowRight':
							if (!horizontal()) return;
							event.preventDefault();
							moveBy(id, delta);
							break;
						case 'ArrowUp':
							if (horizontal()) return;
							event.preventDefault();
							moveBy(id, -delta);
							break;
						case 'ArrowDown':
							if (horizontal()) return;
							event.preventDefault();
							moveBy(id, delta);
							break;
						case 'Enter': {
							event.preventDefault();
							const panelId = event.altKey ? afterId : beforeId;
							if (!panels().some((entry) => entry.id === panelId && entry.collapsible)) return;
							if (isCollapsedPanel(panelId)) expandPanel(panelId);
							else collapsePanel(panelId);
							break;
						}
						default:
							break;
					}
				}
			});
		},
		registerRoot(node: globalThis.Element | null) {
			rootNode = node;
		},
		get dragging() {
			return dragging();
		},
		get orientation() {
			return orientation();
		},
		get panels() {
			return panels();
		},
		get rootId() {
			return rootId();
		}
	};
}
