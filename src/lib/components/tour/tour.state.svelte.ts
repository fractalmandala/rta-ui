import { createContext } from '../../internal/context';
import {
	useDismissableLayer,
	useEscapeLayer,
	useFocusScope,
	type InteractOutsideEvent
} from '../../internal/layers.svelte.js';
import {
	arrowStyle as arrowBoxStyle,
	arrowTipStyle as arrowTipRotationStyle,
	floatingStyle,
	getPlacement,
	type Placement
} from '../../internal/positioning.svelte.js';
import { createPresence } from '../../internal/presence.svelte.js';

export interface Point {
	x: number;
	y: number;
}

export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface Size {
	width: number;
	height: number;
}

export type TourStepType = 'tooltip' | 'dialog' | 'wait' | 'floating';
export type TourStepActionType = 'next' | 'prev' | 'dismiss' | 'skip';
export type TourStepActionFn = (actionMap: TourStepActionMap) => void;
export type TourStepPlacement = Placement | 'center';
export type TourStatus = 'idle' | 'started' | 'skipped' | 'completed' | 'dismissed' | 'not-found';

export interface TourStepAction {
	label: string;
	action?: TourStepActionType | TourStepActionFn | undefined;
	attrs?: Record<string, string | undefined> | undefined;
}

export interface TourStepEffectArgs {
	next: () => void;
	goto: (id: string) => void;
	dismiss: () => void;
	show: () => void;
	update: (data: Partial<TourStepBaseDetails>) => void;
	target?: (() => HTMLElement | null) | undefined;
}

export type TourStepEffectCleanup = (() => void) | void;

export interface TourStepBaseDetails {
	type?: TourStepType | undefined;
	target?: (() => HTMLElement | null) | undefined;
	title: unknown;
	description: unknown;
	placement?: TourStepPlacement | undefined;
	offset?: { mainAxis?: number | undefined; crossAxis?: number | undefined } | undefined;
	meta?: Record<string, unknown> | undefined;
	backdrop?: boolean | undefined;
	arrow?: boolean | undefined;
	actions?: TourStepAction[] | undefined;
}

export interface TourStepDetails extends TourStepBaseDetails {
	id: string;
	effect?: ((args: TourStepEffectArgs) => TourStepEffectCleanup) | undefined;
}

export interface TourStepChangeDetails {
	stepId: string | null;
	stepIndex: number;
	totalSteps: number;
	complete: boolean;
	progress: number;
}

export interface TourStepsChangeDetails {
	steps: TourStepDetails[];
}

export interface TourStepActionMap {
	next: () => void;
	prev: () => void;
	dismiss: () => void;
	skip: () => void;
	goto: (id: string) => void;
}

export interface TourStatusChangeDetails {
	status: TourStatus;
	stepId: string | null;
	stepIndex: number;
}

export interface TourProgressTextDetails {
	current: number;
	total: number;
}

export interface TourIntlTranslations {
	progressText?: ((details: TourProgressTextDetails) => string) | undefined;
	nextStep?: string | undefined;
	prevStep?: string | undefined;
	close?: string | undefined;
	skip?: string | undefined;
}

export interface TourElementIds {
	content?: string;
	title?: string;
	description?: string;
	positioner?: string;
	backdrop?: string;
	arrow?: string;
}

export type TourFocusOutsideEvent = InteractOutsideEvent;
export type TourInteractOutsideEvent = InteractOutsideEvent;
export type TourPointerDownOutsideEvent = InteractOutsideEvent;

export type TourPortalRef = HTMLElement | (() => HTMLElement | null | undefined);

export interface UseTourProps {
	id?: string | null;
	ids?: TourElementIds;
	steps?: TourStepDetails[];
	stepId?: string | null;
	onStepChange?: ((details: TourStepChangeDetails) => void) | undefined;
	onStepsChange?: ((details: TourStepsChangeDetails) => void) | undefined;
	onStatusChange?: ((details: TourStatusChangeDetails) => void) | undefined;
	closeOnInteractOutside?: boolean;
	closeOnEscape?: boolean;
	keyboardNavigation?: boolean;
	preventInteraction?: boolean;
	spotlightOffset?: Point;
	spotlightRadius?: number;
	scrollToTargetFn?: ((details: { target: HTMLElement; step: TourStepDetails }) => void) | undefined;
	translations?: TourIntlTranslations;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	portalled?: boolean;
	portalRef?: TourPortalRef;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	onExitComplete?: () => void;
	onFocusOutside?: (event: TourFocusOutsideEvent) => void;
	onPointerDownOutside?: (event: TourPointerDownOutsideEvent) => void;
	onInteractOutside?: (event: TourInteractOutsideEvent) => void;
}

export interface TourActionTriggerAttrs {
	'data-type': string;
	disabled?: boolean;
	'data-disabled'?: '' | undefined;
	onclick: (event: MouseEvent) => void;
}

export interface TourApi {
	readonly id: string;
	readonly open: boolean;
	readonly state: 'inactive' | 'resolving' | 'active';
	readonly present: boolean;
	readonly dataState: 'open' | 'closed';
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly portalled: boolean;
	readonly portalTarget: Element | null | undefined;
	readonly stepId: string | null;
	readonly stepIndex: number;
	readonly step: TourStepDetails | null;
	readonly steps: TourStepDetails[];
	readonly totalSteps: number;
	readonly hasNextStep: boolean;
	readonly hasPrevStep: boolean;
	readonly firstStep: boolean;
	readonly lastStep: boolean;
	readonly progress: number;
	readonly progressPercent: number;
	readonly progressText: string;
	readonly placement: TourStepPlacement | undefined;
	readonly side: string | undefined;
	readonly target: HTMLElement | null;
	readonly targetRect: Rect;
	readonly instant: boolean;
	readonly backdrop: boolean;
	readonly arrow: boolean;
	readonly preventInteraction: boolean;
	readonly closeOnEscape: boolean;
	readonly closeOnInteractOutside: boolean;
	readonly keyboardNavigation: boolean;
	readonly contentId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly positionerId: string;
	readonly arrowId: string;
	readonly backdropId: string;
	readonly backdropStyle: string;
	readonly spotlightStyle: string;
	readonly positionerStyle: string;
	readonly arrowStyle: string;
	readonly arrowTipStyle: string;
	readonly progressBarStyle: string;
	readonly closeLabel: string;
	readonly skipLabel: string;
	readonly nextStepLabel: string;
	readonly prevStepLabel: string;
	start(id?: string): void;
	next(): void;
	prev(): void;
	setStep(id: string): void;
	setSteps(steps: TourStepDetails[]): void;
	addStep(step: TourStepDetails): void;
	removeStep(id: string): void;
	updateStep(id: string, stepOverrides: Partial<TourStepDetails>): void;
	isValidStep(id: string): boolean;
	isCurrentStep(id: string): boolean;
	dismiss(): void;
	skip(): void;
	getProgressPercent(): number;
	getProgressText(): string;
	actionTriggerAttrs(action: TourStepAction): TourActionTriggerAttrs;
	handleContentKeydown(event: KeyboardEvent): void;
	setContentNode(node: HTMLElement | null): void;
	setPositionerNode(node: HTMLElement | null): void;
}

const defaultTranslations: Required<TourIntlTranslations> = {
	nextStep: 'next step',
	prevStep: 'previous step',
	close: 'close tour',
	skip: 'skip tour',
	progressText: ({ current, total }) => `${current + 1} of ${total}`
};

type StyleRecord = Record<string, string | number | undefined>;

function toStyle(style: StyleRecord): string {
	const declarations = Object.entries(style)
		.filter(([, value]) => value !== undefined)
		.map(([name, value]) => `${name}: ${value}`);
	return `${declarations.join('; ')};`;
}

function toPx(value: number | undefined): string | undefined {
	return value == null ? undefined : `${value}px`;
}

function normalizeStep(step: TourStepDetails): TourStepDetails {
	if (step.type === 'floating') {
		return { backdrop: false, arrow: false, placement: 'bottom-end', ...step };
	}
	if (step.target == null || step.type === 'dialog') {
		return { type: 'dialog', placement: 'center', backdrop: true, ...step };
	}
	if (!step.type || step.type === 'tooltip') {
		return { type: 'tooltip', arrow: true, backdrop: true, ...step };
	}
	return step;
}

function findStepIndex(steps: TourStepDetails[], id: string | null): number {
	return id != null ? steps.findIndex((step) => step.id === id) : -1;
}

function findStep(steps: TourStepDetails[], id: string | null): TourStepDetails | null {
	const index = findStepIndex(steps, id);
	return index === -1 ? null : normalizeStep(steps[index]);
}

function getEffectiveSteps(steps: TourStepDetails[]): TourStepDetails[] {
	return steps.filter((step) => step.type !== 'wait');
}

function effectiveStepIndex(steps: TourStepDetails[], id: string | null): number {
	return findStepIndex(getEffectiveSteps(steps), id);
}

function isTooltipStep(step: TourStepDetails | null): boolean {
	return step?.type === 'tooltip';
}

function isDialogStep(step: TourStepDetails | null): boolean {
	return step?.type === 'dialog';
}

function isTooltipPlacement(placement: TourStepPlacement | undefined): placement is Placement {
	return placement != null && placement !== 'center';
}

function inflateRect(rect: DOMRect, offset: Point): Rect {
	const dx = offset.x || 0;
	const dy = offset.y || 0;
	return { x: rect.x - dx, y: rect.y - dy, width: rect.width + dx + dx, height: rect.height + dy + dy };
}

function isSameRect(a: Rect | undefined, b: Rect): boolean {
	if (!a) return false;
	return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

function isEventInRect(rect: Rect, event: MouseEvent): boolean {
	return (
		rect.y <= event.clientY &&
		event.clientY <= rect.y + rect.height &&
		rect.x <= event.clientX &&
		event.clientX <= rect.x + rect.width
	);
}

interface CornerRadius {
	topLeft?: number;
	topRight?: number;
	bottomRight?: number;
	bottomLeft?: number;
}

/** The spotlight cut-out for tooltip steps, drawn as a two-subpath clip path. */
export function getClipPath(options: {
	enabled?: boolean;
	rect: Rect;
	rootSize: Size;
	radius?: number | CornerRadius;
}): string {
	const { enabled = true, rect, rootSize } = options;
	if (!enabled) return '';
	const width = rootSize.width;
	const height = rootSize.height;
	const radius = options.radius ?? 0;
	const { topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0 } =
		typeof radius === 'number'
			? { topLeft: radius, topRight: radius, bottomRight: radius, bottomLeft: radius }
			: radius;
	const { x, y, width: rectWidth, height: rectHeight } = rect;
	return `M${width},${height}\
  H0\
  V0\
  H${width}\
  V${height}\
  Z\
  M${x + topLeft},${y}\
  a${topLeft},${topLeft},0,0,0-${topLeft},${topLeft}\
  V${rectHeight + y - bottomLeft}\
  a${bottomLeft},${bottomLeft},0,0,0,${bottomLeft},${bottomLeft}\
  H${rectWidth + x - bottomRight}\
  a${bottomRight},${bottomRight},0,0,0,${bottomRight}-${bottomRight}\
  V${y + topRight}\
  a${topRight},${topRight},0,0,0-${topRight}-${topRight}\
  Z`;
}

function isEditableElement(element: EventTarget | null): boolean {
	const node = element as HTMLElement | null;
	if (!node) return false;
	const tag = node.tagName;
	if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
	return node.isContentEditable;
}

function isActionableElement(element: EventTarget | null): boolean {
	const node = element as HTMLElement | null;
	if (!node) return false;
	const tag = node.tagName;
	if (tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY') return true;
	if (node.getAttribute('role') === 'button') return true;
	return node.hasAttribute('tabindex') && node.getAttribute('tabindex') !== '-1';
}

const tourContext = createContext<TourApi>('Tour', 'Tour');

export const setTourContext = (api: TourApi) => tourContext.set(api);
export const useTourContext = () => tourContext.get();

export function createTour(getProps: () => UseTourProps, uid: string): TourApi {
	const id = getProps().id ?? uid;
	const ids = getProps().ids ?? {};
	const contentId = ids.content ?? `tour-content-${id}`;
	const titleId = ids.title ?? `tour-title-${id}`;
	const descriptionId = ids.description ?? `tour-desc-${id}`;
	const positionerId = ids.positioner ?? `tour-positioner-${id}`;
	const arrowId = ids.arrow ?? `tour-arrow-${id}`;
	const backdropId = ids.backdrop ?? `tour-backdrop-${id}`;

	let steps = $state<TourStepDetails[]>(getProps().steps ?? []);
	let currentStepId = $state<string | null>(getProps().stepId ?? null);
	let phase = $state<'inactive' | 'resolving' | 'active'>('inactive');
	let resolvedTarget = $state<HTMLElement | null>(null);
	let targetRect = $state<Rect>({ x: 0, y: 0, width: 0, height: 0 });
	let boundarySize = $state<Size>({ width: 0, height: 0 });
	let currentPlacement = $state<TourStepPlacement | undefined>(undefined);
	let floatingOffset = $state<Point | null>(null);
	let instant = $state(true);
	let contentNode = $state<HTMLElement | null>(null);
	let positionerNode = $state<HTMLElement | null>(null);

	let externalSteps: TourStepDetails[] | undefined;
	let prevSpotlightStepId: string | null | undefined = undefined;
	let prevSpotlightRect: Rect | undefined;
	let prevTarget: HTMLElement | null | undefined = undefined;
	let targetCleanup: (() => void) | undefined;
	let effectCleanup: TourStepEffectCleanup;
	let restoreFocusEl: HTMLElement | null = null;
	let observer: MutationObserver | null = null;
	let notFoundTimer: ReturnType<typeof setTimeout> | null = null;

	const translations = () => ({ ...defaultTranslations, ...getProps().translations });

	const stepId = () => {
		const controlled = getProps().stepId;
		return controlled !== undefined ? controlled : currentStepId;
	};
	const currentStep = () => findStep(steps, stepId());
	const stepIndex = () => findStepIndex(steps, stepId());
	const isOpen = () => phase === 'active';

	const presence = createPresence({
		present: () => isOpen(),
		getNode: () => contentNode,
		lazyMount: () => getProps().lazyMount ?? true,
		unmountOnExit: () => getProps().unmountOnExit ?? true,
		onExitComplete: () => getProps().onExitComplete?.()
	});

	$effect(() => {
		const next = getProps().steps;
		if (!next || next === externalSteps) return;
		externalSteps = next;
		steps = [...next];
	});

	$effect(() => {
		const value = getProps().stepId;
		if (value === undefined) return;
		if (value === currentStepId) return;
		transitionTo(Math.max(0, findStepIndex(steps, value ?? null)));
	});

	$effect(() => {
		if (!isOpen()) return;
		if (typeof document === 'undefined') return;
		const update = () => {
			const width = window.visualViewport?.width ?? window.innerWidth;
			const height = document.documentElement.scrollHeight;
			if (boundarySize.width === width && boundarySize.height === height) return;
			boundarySize = { width, height };
		};
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	});

	useEscapeLayer({
		enabled: () => isOpen(),
		onEscape() {
			if (getProps().closeOnEscape === false) return;
			dismiss();
		}
	});

	useDismissableLayer({
		enabled: () => isOpen() && getProps().closeOnInteractOutside !== false,
		getNode: () => contentNode,
		getExclude: () => [resolvedTarget],
		onPointerDownOutside(event) {
			getProps().onPointerDownOutside?.(event);
			const original = event.detail.originalEvent as MouseEvent;
			if (isEventInRect(targetRect, original)) {
				event.preventDefault();
				return;
			}
			if (getProps().closeOnInteractOutside === false) event.preventDefault();
		},
		onFocusOutside(event) {
			getProps().onFocusOutside?.(event);
			if (getProps().closeOnInteractOutside === false) event.preventDefault();
		},
		onInteractOutside(event) {
			getProps().onInteractOutside?.(event);
			if (event.defaultPrevented) return;
			dismiss();
		}
	});

	useFocusScope({
		enabled: () => isOpen(),
		getNode: () => contentNode,
		trap: () => true,
		getInitialFocus: () => contentNode ?? resolvedTarget
	});

	$effect(() => {
		if (!isOpen()) return;
		const step = currentStep();
		if (!step || !isTooltipStep(step)) {
			currentPlacement = step?.placement;
			prevSpotlightStepId = undefined;
			prevSpotlightRect = undefined;
			instant = true;
			floatingOffset = null;
			if (resolvedTarget) targetRect = inflateRect(resolvedTarget.getBoundingClientRect(), spotlightOffset());
			return;
		}
		currentPlacement = step.placement ?? 'bottom';
		if (!resolvedTarget || !positionerNode) return;
		positionStep(step);
	});

	$effect(() => {
		if (!isOpen()) return;
		if (!isTooltipStep(currentStep())) return;
		const doc = positionerNode?.ownerDocument ?? (typeof document === 'undefined' ? null : document);
		if (!doc) return;
		const onScroll = () => {
			const step = currentStep();
			if (step && isTooltipStep(step) && positionerNode) positionStep(step);
		};
		doc.addEventListener('scroll', onScroll, { capture: true, passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			doc.removeEventListener('scroll', onScroll, { capture: true });
			window.removeEventListener('resize', onScroll);
		};
	});

	function spotlightOffset(): Point {
		return getProps().spotlightOffset ?? { x: 10, y: 10 };
	}

	function positionStep(step: TourStepDetails) {
		const anchor = resolvedTarget;
		const positioner = positionerNode;
		if (!anchor || !positioner) return;
		const placement = isTooltipPlacement(step.placement) ? step.placement : 'bottom';
		const cleanup = getPlacement(
			{ getBoundingClientRect: () => anchor.getBoundingClientRect() },
			positioner,
			{
				placement,
				strategy: 'absolute',
				gutter: 10,
				offset: step.offset,
				applyStyles: false,
				listeners: false,
				onComplete(result) {
					const reference = inflateRect(anchor.getBoundingClientRect(), spotlightOffset());
					if (!isSameRect(prevSpotlightRect, reference)) {
						instant = prevSpotlightStepId == null || prevSpotlightStepId === stepId();
					}
					prevSpotlightStepId = stepId();
					prevSpotlightRect = reference;
					currentPlacement = result.placement;
					targetRect = reference;
					floatingOffset = { x: result.x, y: result.y };
				}
			}
		);
		cleanup();
	}

	function syncTarget() {
		const target = resolvedTarget;
		if (target !== prevTarget) {
			targetCleanup?.();
			targetCleanup = undefined;
		}
		if (!target) {
			prevTarget = null;
			return;
		}
		if (target === prevTarget) return;
		if (getProps().preventInteraction) target.inert = true;
		target.setAttribute('data-tour-highlighted', '');
		targetCleanup = () => {
			if (getProps().preventInteraction) target.inert = false;
			target.removeAttribute('data-tour-highlighted');
		};
		prevTarget = target;
	}

	function clearTarget() {
		targetCleanup?.();
		targetCleanup = undefined;
		prevTarget = null;
		resolvedTarget = null;
		targetRect = { x: 0, y: 0, width: 0, height: 0 };
		currentPlacement = undefined;
		floatingOffset = null;
		instant = true;
		prevSpotlightStepId = undefined;
		prevSpotlightRect = undefined;
	}

	function cleanupTimers() {
		if (observer) {
			observer.disconnect();
			observer = null;
		}
		if (notFoundTimer !== null) {
			clearTimeout(notFoundTimer);
			notFoundTimer = null;
		}
	}

	function runEffectCleanup() {
		if (typeof effectCleanup === 'function') effectCleanup();
		effectCleanup = undefined;
	}

	function cleanupAll() {
		cleanupTimers();
		runEffectCleanup();
		clearTarget();
	}

	function restoreFocus() {
		const element = restoreFocusEl;
		restoreFocusEl = null;
		if (!element || !element.isConnected) return;
		requestAnimationFrame(() => {
			if (!element.isConnected) return;
			element.focus({ preventScroll: true });
		});
	}

	function invokeStatus(status: TourStatus) {
		getProps().onStatusChange?.({
			status,
			stepId: stepId(),
			stepIndex: stepIndex()
		});
	}

	function setStepId(next: string | null) {
		if (currentStepId === next) return;
		currentStepId = next;
		const index = findStepIndex(steps, next);
		const total = getEffectiveSteps(steps).length;
		getProps().onStepChange?.({
			stepId: next,
			stepIndex: index,
			totalSteps: steps.length,
			complete: index === steps.length - 1,
			progress: total === 0 ? 0 : (effectiveStepIndex(steps, next) + 1) / total
		});
	}

	function route(step: TourStepDetails, target: HTMLElement | null) {
		if (step.type === 'wait') {
			phase = 'inactive';
			return;
		}
		if (target) {
			scrollToTarget(step, target);
			phase = 'active';
			return;
		}
		if (step.target) {
			observeTarget(step);
			return;
		}
		phase = 'active';
	}

	function scrollToTarget(step: TourStepDetails, target: HTMLElement) {
		const scrollToTargetFn = getProps().scrollToTargetFn;
		if (scrollToTargetFn) {
			scrollToTargetFn({ target, step });
			return;
		}
		if (typeof target.scrollIntoView !== 'function') return;
		try {
			target.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
		} catch {
			// Engines without scroll options still scroll with the default behaviour.
			target.scrollIntoView();
		}
	}

	function observeTarget(step: TourStepDetails) {
		phase = 'resolving';
		if (typeof document === 'undefined') return;
		observer = new MutationObserver(() => {
			const node = step.target?.() ?? null;
			if (!node) return;
			observer?.disconnect();
			observer = null;
			resolvedTarget = node;
			syncTarget();
			route(step, node);
		});
		observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
		notFoundTimer = setTimeout(() => {
			notFoundTimer = null;
			observer?.disconnect();
			observer = null;
			invokeStatus('not-found');
			clearTarget();
			setStepId(null);
			phase = 'inactive';
			restoreFocus();
		}, 3000);
	}

	function show() {
		const step = currentStep();
		if (!step) return;
		const target = step.target?.() ?? null;
		resolvedTarget = target;
		syncTarget();
		setStepId(step.id);
		route(step, target);
	}

	function transitionTo(index: number) {
		const step = steps[index];
		if (!step) {
			cleanupAll();
			setStepId(null);
			phase = 'inactive';
			return;
		}
		if (currentStepId === step.id && phase !== 'inactive') return;
		cleanupAll();
		const normalized = normalizeStep(step);
		if (normalized.effect) {
			const utils: TourStepEffectArgs = {
				next: () => next(),
				goto: (targetId: string) => {
					const targetIndex = findStepIndex(steps, targetId);
					if (targetIndex === -1) return;
					transitionTo(targetIndex);
				},
				dismiss: () => dismiss(),
				show,
				update: (data) => updateStep(normalized.id, data),
				target: normalized.target
			};
			try {
				effectCleanup = normalized.effect(utils);
			} catch {
				effectCleanup = undefined;
			}
			if (normalized.type === 'wait') show();
			return;
		}
		const target = normalized.target?.() ?? null;
		resolvedTarget = target;
		syncTarget();
		setStepId(normalized.id);
		route(normalized, target);
	}

	function start(stepIdOrIndex?: string) {
		if (steps.length === 0) return;
		restoreFocusEl = typeof document === 'undefined' ? null : (document.activeElement as HTMLElement | null);
		cleanupAll();
		currentStepId = null;
		phase = 'inactive';
		const index = stepIdOrIndex == null ? 0 : Math.max(0, findStepIndex(steps, stepIdOrIndex));
		transitionTo(index);
		invokeStatus('started');
	}

	function end(kind: 'dismiss' | 'skip') {
		const completed = kind === 'dismiss' && stepIndex() === steps.length - 1;
		cleanupAll();
		restoreFocus();
		if (kind === 'skip') invokeStatus('skipped');
		else {
			invokeStatus('dismissed');
			if (completed) invokeStatus('completed');
		}
		currentStepId = null;
		phase = 'inactive';
	}

	function dismiss() {
		if (phase === 'inactive' && stepId() == null) return;
		end('dismiss');
	}

	function skip() {
		if (phase === 'inactive' && stepId() == null) return;
		end('skip');
	}

	function next() {
		const index = stepIndex();
		if (index >= steps.length - 1) return;
		transitionTo(index + 1);
	}

	function prev() {
		const index = stepIndex();
		if (index <= 0) return;
		transitionTo(index - 1);
	}

	function setStep(targetId: string) {
		const index = findStepIndex(steps, targetId);
		if (index === -1) return;
		transitionTo(index);
	}

	function setSteps(next: TourStepDetails[]) {
		steps = [...next];
		getProps().onStepsChange?.({ steps });
	}

	function addStep(step: TourStepDetails) {
		setSteps([...steps, step]);
	}

	function removeStep(targetId: string) {
		setSteps(steps.filter((step) => step.id !== targetId));
	}

	function updateStep(targetId: string, stepOverrides: Partial<TourStepDetails>) {
		setSteps(steps.map((step) => (step.id === targetId ? { ...step, ...stepOverrides } : step)));
	}

	function getProgressPercent(): number {
		const total = getEffectiveSteps(steps).length;
		if (!total) return 0;
		return ((effectiveStepIndex(steps, stepId()) + 1) / total) * 100;
	}

	function getProgressText(): string {
		return translations().progressText({
			current: effectiveStepIndex(steps, stepId()),
			total: getEffectiveSteps(steps).length
		});
	}

	function actionMap(): TourStepActionMap {
		return { next, prev, dismiss, skip, goto: (targetId) => setStep(targetId) };
	}

	function actionTriggerAttrs(action: TourStepAction): TourActionTriggerAttrs {
		switch (action.action) {
			case 'next':
				return {
					'data-type': 'next',
					disabled: !(stepIndex() < steps.length - 1),
					'data-disabled': stepIndex() < steps.length - 1 ? undefined : '',
					onclick: () => next()
				};
			case 'prev':
				return {
					'data-type': 'prev',
					disabled: stepIndex() <= 0,
					'data-disabled': stepIndex() <= 0 ? '' : undefined,
					onclick: () => prev()
				};
			case 'dismiss':
				return { 'data-type': 'close', onclick: () => dismiss() };
			case 'skip':
				return { 'data-type': 'skip', onclick: () => skip() };
			case undefined:
				return { 'data-type': 'custom', onclick: () => {} };
			default: {
				const handler = action.action;
				return {
					'data-type': 'custom',
					onclick: () => {
						if (typeof handler === 'function') handler(actionMap());
					}
				};
			}
		}
	}

	function handleContentKeydown(event: KeyboardEvent) {
		if (event.defaultPrevented) return;
		if (getProps().keyboardNavigation === false) return;
		if (isEditableElement(event.target)) return;
		const isRtl = getProps().dir === 'rtl';
		const hasNext = stepIndex() < steps.length - 1;
		const hasPrev = stepIndex() > 0;

		switch (event.key) {
			case 'ArrowRight':
				if (isRtl ? !hasPrev : !hasNext) return;
				event.preventDefault();
				if (isRtl) prev();
				else next();
				return;
			case 'ArrowLeft':
				if (isRtl ? !hasNext : !hasPrev) return;
				event.preventDefault();
				if (isRtl) next();
				else prev();
				return;
			case 'Enter':
				if (isActionableElement(event.target)) return;
				event.preventDefault();
				if (hasNext) next();
				else dismiss();
				return;
			default:
				return;
		}
	}

	const step = () => currentStep();

	return {
		id,
		contentId,
		titleId,
		descriptionId,
		positionerId,
		arrowId,
		backdropId,
		get open() {
			return isOpen();
		},
		get state() {
			return phase;
		},
		get present() {
			return presence.present;
		},
		get dataState() {
			return isOpen() ? 'open' : 'closed';
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
		get stepId() {
			return stepId();
		},
		get stepIndex() {
			return stepIndex();
		},
		get step() {
			return step();
		},
		get steps() {
			return steps;
		},
		get totalSteps() {
			return steps.length;
		},
		get hasNextStep() {
			return stepIndex() < steps.length - 1;
		},
		get hasPrevStep() {
			return stepIndex() > 0;
		},
		get firstStep() {
			return stepIndex() === 0;
		},
		get lastStep() {
			return stepIndex() === steps.length - 1;
		},
		get progress() {
			return getProgressPercent() / 100;
		},
		get progressPercent() {
			return getProgressPercent();
		},
		get progressText() {
			return getProgressText();
		},
		get placement() {
			return currentPlacement ?? step()?.placement;
		},
		get side() {
			const placement = currentPlacement ?? step()?.placement;
			return isTooltipPlacement(placement) ? placement.split('-')[0] : undefined;
		},
		get target() {
			return resolvedTarget;
		},
		get targetRect() {
			return targetRect;
		},
		get instant() {
			return instant;
		},
		get backdrop() {
			return step()?.backdrop !== false;
		},
		get arrow() {
			return step()?.arrow !== false;
		},
		get preventInteraction() {
			return Boolean(getProps().preventInteraction);
		},
		get closeOnEscape() {
			return getProps().closeOnEscape !== false;
		},
		get closeOnInteractOutside() {
			return getProps().closeOnInteractOutside !== false;
		},
		get keyboardNavigation() {
			return getProps().keyboardNavigation !== false;
		},
		get backdropStyle() {
			const current = step();
			const clipPath = isTooltipStep(current)
				? `path("${getClipPath({
						enabled: true,
						rect: targetRect,
						rootSize: boundarySize,
						radius: getProps().spotlightRadius ?? 4
					})}")`
				: undefined;
			return toStyle({
				'--tour-layer': 0,
				'clip-path': clipPath,
				position: isDialogStep(current) ? 'fixed' : 'absolute',
				inset: '0',
				'will-change': isTooltipStep(current) ? 'clip-path' : undefined
			});
		},
		get spotlightStyle() {
			const radius = getProps().spotlightRadius ?? 4;
			return toStyle({
				'--tour-layer': 1,
				'--spotlight-x': toPx(targetRect.x),
				'--spotlight-y': toPx(targetRect.y),
				'--spotlight-width': toPx(targetRect.width),
				'--spotlight-height': toPx(targetRect.height),
				position: 'absolute',
				width: 'var(--spotlight-width)',
				height: 'var(--spotlight-height)',
				left: 'var(--spotlight-x)',
				top: 'var(--spotlight-y)',
				'border-radius': toPx(radius),
				'pointer-events': 'none',
				'transition-duration': instant ? '0ms' : undefined,
				'transition-delay': instant ? '0ms' : undefined
			});
		},
		get positionerStyle() {
			const current = step();
			const layer = '--tour-layer: 2;';
			if (!isTooltipStep(current)) {
				return isOpen() ? layer : `${layer} pointer-events: none;`;
			}
			const tooltipPositioned = floatingOffset != null;
			const floating = floatingStyle({
				strategy: 'absolute',
				placement: tooltipPositioned && isTooltipPlacement(currentPlacement) ? currentPlacement : undefined,
				applyStyles: false
			});
			const extra = toStyle({
				'--tour-layer': 2,
				'--x': floatingOffset ? toPx(floatingOffset.x) : undefined,
				'--y': floatingOffset ? toPx(floatingOffset.y) : undefined,
				'--z-index': 'calc(var(--tour-layer) + var(--tour-z-index))'
			});
			return `${floating} ${extra}${isOpen() ? '' : ' pointer-events: none;'}`;
		},
		get arrowStyle() {
			const hasTarget = typeof step()?.target !== 'undefined';
			const tooltipPositioned = floatingOffset != null;
			return `${arrowBoxStyle}${tooltipPositioned ? '' : ' visibility: hidden;'}${hasTarget ? '' : ' opacity: 0;'}`;
		},
		get arrowTipStyle() {
			const placement = currentPlacement;
			return isTooltipPlacement(placement) ? arrowTipRotationStyle(placement) : arrowTipRotationStyle();
		},
		get progressBarStyle() {
			const percent = getProgressPercent();
			return `width: ${percent}%;`;
		},
		get closeLabel() {
			return translations().close;
		},
		get skipLabel() {
			return translations().skip;
		},
		get nextStepLabel() {
			return translations().nextStep;
		},
		get prevStepLabel() {
			return translations().prevStep;
		},
		start,
		next,
		prev,
		setStep,
		setSteps,
		addStep,
		removeStep,
		updateStep,
		isValidStep: (targetId: string) => steps.some((entry) => entry.id === targetId),
		isCurrentStep: (targetId: string) => stepId() === targetId,
		dismiss,
		skip,
		getProgressPercent,
		getProgressText,
		actionTriggerAttrs,
		handleContentKeydown,
		setContentNode(node) {
			contentNode = node;
		},
		setPositionerNode(node) {
			positionerNode = node;
		}
	};
}
