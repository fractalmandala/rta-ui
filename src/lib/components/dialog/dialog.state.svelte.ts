import { untrack } from 'svelte';
import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import {
	useAriaHidden,
	useDismissableLayer,
	useEscapeLayer,
	useFocusScope,
	useScrollLock,
	type InteractOutsideEvent
} from '../../internal/layers.svelte';
import { createPresence } from '../../internal/presence.svelte';

export interface DialogOpenChangeDetails {
	open: boolean;
}

export interface DialogTriggerValueChangeDetails {
	value: string | null;
	triggerElement: HTMLElement | null;
}

export type DialogFocusOutsideEvent = InteractOutsideEvent;
export type DialogInteractOutsideEvent = InteractOutsideEvent;
export type DialogPointerDownOutsideEvent = InteractOutsideEvent;

export type DialogRole = 'dialog' | 'alertdialog';

export interface DialogElementIds {
	trigger?: string | ((value?: string) => string);
	positioner?: string;
	backdrop?: string;
	content?: string;
	closeTrigger?: string;
	title?: string;
	description?: string;
}

export type DialogPortalTarget = Element | (() => Element | null | undefined) | null;

export interface UseDialogProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (details: DialogOpenChangeDetails) => void;
	triggerValue?: string | null;
	defaultTriggerValue?: string | null;
	onTriggerValueChange?: (details: DialogTriggerValueChangeDetails) => void;
	modal?: boolean;
	role?: DialogRole;
	trapFocus?: boolean;
	preventScroll?: boolean;
	restoreFocus?: boolean;
	closeOnEscape?: boolean;
	closeOnInteractOutside?: boolean;
	'aria-label'?: string;
	initialFocusEl?: () => Element | null | undefined | false;
	finalFocusEl?: () => Element | null | undefined;
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	onFocusOutside?: (event: DialogFocusOutsideEvent) => void;
	onInteractOutside?: (event: DialogInteractOutsideEvent) => void;
	onPointerDownOutside?: (event: DialogPointerDownOutsideEvent) => void;
	persistentElements?: (() => Element | null | undefined)[];
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: DialogElementIds;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	onExitComplete?: () => void;
	/** Render the overlay inside `document.body`. Set `false` to keep it in place. */
	portalled?: boolean;
	/** Element or getter for the portal container. */
	portalRef?: DialogPortalTarget;
}

export interface DialogApi {
	readonly open: boolean;
	readonly modal: boolean;
	readonly triggerValue: string | null;
	readonly state: 'open' | 'closed';
	readonly present: boolean;
	readonly unmounted: boolean;
	readonly contentId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly backdropId: string;
	readonly positionerId: string;
	readonly closeTriggerId: string;
	setOpen(open: boolean): void;
	setTriggerValue(value: string | null): void;
	triggerIdFor(value?: string): string;
	triggerAttrs(options?: { value?: string }): Record<string, unknown>;
	backdropAttrs(): Record<string, unknown>;
	positionerAttrs(): Record<string, unknown>;
	contentAttrs(): Record<string, unknown>;
	titleAttrs(): Record<string, unknown>;
	descriptionAttrs(): Record<string, unknown>;
	closeTriggerAttrs(): Record<string, unknown>;
	registerContent(node: Element | null): void;
	registerCloseTrigger(node: Element | null): void;
	registerTrigger(node: Element | null, value?: string): void;
	/** Marks a rendered title or description part, which drives the content's aria wiring. */
	markRendered(part: 'title' | 'description', rendered: boolean): void;
}

const dialogContext = createContext<DialogApi>('Dialog', 'Dialog.Root');

export const useDialogContext = () => dialogContext.get();
export const setDialogContext = (api: DialogApi) => dialogContext.set(api);

const asHTMLElement = (node: Element | null): HTMLElement | null =>
	node instanceof HTMLElement ? node : null;

export function createDialog(getProps: () => UseDialogProps, uid: string): DialogApi {
	const dialogId = () => getProps().id ?? uid;

	const triggerIdFor = (value?: string) => {
		const custom = getProps().ids?.trigger;
		if (custom != null) return typeof custom === 'function' ? custom(value) : custom;
		return value ? `dialog:${dialogId()}:trigger:${value}` : `dialog:${dialogId()}:trigger`;
	};

	const contentId = () => getProps().ids?.content ?? `dialog:${dialogId()}:content`;
	const positionerId = () => getProps().ids?.positioner ?? `dialog:${dialogId()}:positioner`;
	const backdropId = () => getProps().ids?.backdrop ?? `dialog:${dialogId()}:backdrop`;
	const titleId = () => getProps().ids?.title ?? `dialog:${dialogId()}:title`;
	const descriptionId = () => getProps().ids?.description ?? `dialog:${dialogId()}:description`;
	const closeTriggerId = () => getProps().ids?.closeTrigger ?? `dialog:${dialogId()}:close`;

	let internalOpen = $state(Boolean(getProps().defaultOpen));
	let internalTriggerValue = $state<string | null>(getProps().defaultTriggerValue ?? null);

	const isControlled = () => getProps().open !== undefined;
	const open = () => (isControlled() ? Boolean(getProps().open) : internalOpen);
	const modal = () => getProps().modal ?? true;
	const role = () => getProps().role ?? 'dialog';
	const trapFocus = () => getProps().trapFocus ?? modal();
	const preventScroll = () => getProps().preventScroll ?? modal();
	const closeOnEscape = () => getProps().closeOnEscape ?? true;
	const lazy = () => getProps().lazyMount ?? true;
	const keepAfterExit = () => getProps().unmountOnExit ?? true;
	const unmounted = () =>
		!open() && !presence.present ? (!mountedOnce ? lazy() : keepAfterExit()) : false;
	const closeOnInteractOutside = () =>
		getProps().closeOnInteractOutside ?? (modal() && role() !== 'alertdialog');
	const ariaLabel = () => getProps()['aria-label'];

	let contentNode = $state<HTMLElement | null>(null);
	let closeTriggerNode = $state<HTMLElement | null>(null);
	let rendered = $state({ title: false, description: false });
	const triggerNodes = new Map<string | undefined, HTMLElement>();

	const triggerValue = () =>
		getProps().triggerValue !== undefined
			? (getProps().triggerValue ?? null)
			: internalTriggerValue;

	let mountedOnce = $state(false);

	const presence = createPresence({
		present: () => open(),
		getNode: () => contentNode,
		lazyMount: () => true,
		// The shared presence keeps waiting for the exit animation, so `present` tracks visibility;
		// `unmounted` below re-applies the consumer's lazyMount / unmountOnExit strategy.
		unmountOnExit: () => true,
		onExitComplete: () => getProps().onExitComplete?.()
	});

	$effect(() => {
		if (open()) mountedOnce = true;
	});

	function setOpen(next: boolean) {
		if (next === open()) return;
		if (!isControlled()) internalOpen = next;
		getProps().onOpenChange?.({ open: next });
	}

	function setTriggerValue(value: string | null) {
		if (value === triggerValue()) return;
		if (getProps().triggerValue === undefined) internalTriggerValue = value;
		getProps().onTriggerValueChange?.({
			value,
			triggerElement: triggerNodes.get(value ?? undefined) ?? null
		});
	}

	function persistent(): (Element | null | undefined)[] {
		return (getProps().persistentElements ?? []).map((element) => element());
	}

	// The dialog closes on an outside pointer only when the pointer both starts and ends outside
	// the content, so a drag that begins inside the surface and releases over the backdrop is safe.
	let outsidePointerStart: Node | null = null;
	let pointerUpDoc: Document | null = null;

	function onDocumentPointerUp(event: PointerEvent) {
		const start = outsidePointerStart;
		outsidePointerStart = null;
		unbindPointerUp();
		if (!open() || !start) return;
		const layer = contentNode;
		if (!layer) return;
		const target = event.target as Node | null;
		if (target && layer.contains(target)) return;
		setOpen(false);
	}

	function bindPointerUp(doc: Document) {
		if (pointerUpDoc === doc) return;
		unbindPointerUp();
		pointerUpDoc = doc;
		doc.addEventListener('pointerup', onDocumentPointerUp, true);
		doc.addEventListener('pointercancel', onDocumentPointerUp, true);
	}

	function unbindPointerUp() {
		if (!pointerUpDoc) return;
		pointerUpDoc.removeEventListener('pointerup', onDocumentPointerUp, true);
		pointerUpDoc.removeEventListener('pointercancel', onDocumentPointerUp, true);
		pointerUpDoc = null;
	}

	useEscapeLayer({
		enabled: () => open() && closeOnEscape(),
		onEscape(event) {
			getProps().onEscapeKeyDown?.(event);
			if (event.defaultPrevented) return;
			setOpen(false);
		}
	});

	useDismissableLayer({
		enabled: () => open() && !unmounted() && closeOnInteractOutside(),
		getNode: () => contentNode,
		getExclude: () => [...triggerNodes.values(), ...persistent()],
		onPointerDownOutside(event) {
			getProps().onPointerDownOutside?.(event);
		},
		onFocusOutside(event) {
			getProps().onFocusOutside?.(event);
		},
		onInteractOutside(event) {
			getProps().onInteractOutside?.(event);
			if (event.defaultPrevented) return;
			const original = event.detail.originalEvent;
			if (original.type === 'focusin') {
				setOpen(false);
				return;
			}
			outsidePointerStart = original.target as Node | null;
			const node = contentNode;
			if (node) bindPointerUp(node.ownerDocument);
		}
	});

	useFocusScope({
		enabled: () => open() && contentNode !== null,
		getNode: () => contentNode,
		trap: () => trapFocus(),
		getInitialFocus: () => {
			const provided = getProps().initialFocusEl?.();
			if (provided) return provided instanceof HTMLElement ? provided : null;
			if (role() === 'alertdialog') return closeTriggerNode;
			return null;
		}
	});

	useScrollLock(() => open() && modal() && preventScroll());
	useAriaHidden(() => open() && modal(), () => contentNode);

	// Focus restoration on close goes through the focus scope; `finalFocusEl` overrides its target.
	let lastOpen = open();
	$effect(() => {
		const current = open();
		const previous = lastOpen;
		lastOpen = current;
		if (current || !previous) return;
		const target = getProps().finalFocusEl?.();
		if (!target) return;
		requestAnimationFrame(() => {
			if (!open()) (target as HTMLElement).focus({ preventScroll: true });
		});
	});

	$effect(() => () => unbindPointerUp());

	return {
		get open() {
			return open();
		},
		get modal() {
			return modal();
		},
		get triggerValue() {
			return triggerValue();
		},
		get state() {
			return open() ? 'open' : 'closed';
		},
		get present() {
			return presence.present;
		},
		get unmounted() {
			return unmounted();
		},
		get contentId() {
			return contentId();
		},
		get titleId() {
			return titleId();
		},
		get descriptionId() {
			return descriptionId();
		},
		get backdropId() {
			return backdropId();
		},
		get positionerId() {
			return positionerId();
		},
		get closeTriggerId() {
			return closeTriggerId();
		},
		setOpen,
		setTriggerValue,
		triggerIdFor,
		triggerAttrs(options = {}) {
			const value = options.value;
			const current = value == null ? false : triggerValue() === value;
			return {
				id: triggerIdFor(value),
				dir: getProps().dir ?? undefined,
				'data-ownedby': dialogId(),
				'data-value': value,
				'aria-haspopup': 'dialog',
				type: 'button',
				'aria-expanded': value == null ? open() : open() && current,
				'data-state': open() ? 'open' : 'closed',
				'aria-controls': unmounted() ? undefined : contentId(),
				'data-current': dataAttr(current),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (open() && value != null && !current) {
						setTriggerValue(value);
						return;
					}
					if (open()) {
						setOpen(false);
						return;
					}
					if (value != null) setTriggerValue(value);
					setOpen(true);
				}
			};
		},
		backdropAttrs() {
			return {
				dir: getProps().dir ?? undefined,
				hidden: !presence.present,
				id: backdropId(),
				'data-state': open() ? 'open' : 'closed'
			};
		},
		positionerAttrs() {
			return {
				dir: getProps().dir ?? undefined,
				id: positionerId(),
				style: !open() || !modal() ? 'pointer-events: none;' : undefined
			};
		},
		contentAttrs() {
			const label = ariaLabel();
			return {
				dir: getProps().dir ?? undefined,
				role: role(),
				hidden: !presence.present,
				id: contentId(),
				tabindex: -1,
				'data-state': open() ? 'open' : 'closed',
				'aria-modal': modal(),
				...(label ? { 'aria-label': label } : {}),
				'aria-labelledby': label || !rendered.title ? undefined : titleId(),
				'aria-describedby': rendered.description ? descriptionId() : undefined,
				style: modal() ? undefined : 'pointer-events: auto;'
			};
		},
		titleAttrs() {
			return { dir: getProps().dir ?? undefined, id: titleId() };
		},
		descriptionAttrs() {
			return { dir: getProps().dir ?? undefined, id: descriptionId() };
		},
		closeTriggerAttrs() {
			return {
				dir: getProps().dir ?? undefined,
				id: closeTriggerId(),
				type: 'button',
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					event.stopPropagation();
					setOpen(false);
				}
			};
		},
		registerContent(node) {
			contentNode = asHTMLElement(node);
		},
		registerCloseTrigger(node) {
			closeTriggerNode = asHTMLElement(node);
		},
		registerTrigger(node, value) {
			const element = asHTMLElement(node);
			if (element) triggerNodes.set(value, element);
			else triggerNodes.delete(value);
		},
		markRendered(part, isRendered) {
			untrack(() => {
				if (rendered[part] === isRendered) return;
				rendered[part] = isRendered;
			});
		}
	};
}
