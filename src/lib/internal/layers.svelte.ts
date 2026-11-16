// Layered overlay behaviour: escape ordering, outside dismissal, focus trapping, and scroll lock.
// One module rather than four, because these four always travel together on the same element and
// share the global layer stack that decides which overlay owns a key press.

export type EscapeBehavior = 'close' | 'ignore' | 'defer-otherwise-close';

interface EscapeEntry {
	behavior: EscapeBehavior;
	onEscape: (event: KeyboardEvent) => void;
}

const escapeStack: EscapeEntry[] = [];
let escapeListenerAttached = false;

function onDocumentKeydown(event: KeyboardEvent) {
	if (event.key !== 'Escape' || !escapeStack.length) return;
	// The topmost layer that does not defer owns the key; if every layer defers, the first one wins.
	const owner =
		[...escapeStack].reverse().find((entry) => entry.behavior === 'close' || entry.behavior === 'ignore') ??
		escapeStack[0];
	if (owner.behavior === 'ignore') return;
	const cloned = new KeyboardEvent(event.type, event);
	event.preventDefault();
	owner.onEscape(cloned);
}

function attachEscape() {
	if (escapeListenerAttached || typeof document === 'undefined') return;
	document.addEventListener('keydown', onDocumentKeydown, { passive: false });
	escapeListenerAttached = true;
}

function detachEscape() {
	if (!escapeListenerAttached || escapeStack.length) return;
	document.removeEventListener('keydown', onDocumentKeydown);
	escapeListenerAttached = false;
}

export interface EscapeLayerOptions {
	enabled: () => boolean;
	onEscape: (event: KeyboardEvent) => void;
	behavior?: () => EscapeBehavior;
}

export function useEscapeLayer(options: EscapeLayerOptions): void {
	$effect(() => {
		if (!options.enabled()) return;
		const entry: EscapeEntry = { behavior: options.behavior?.() ?? 'close', onEscape: options.onEscape };
		escapeStack.push(entry);
		attachEscape();
		return () => {
			const index = escapeStack.indexOf(entry);
			if (index !== -1) escapeStack.splice(index, 1);
			detachEscape();
		};
	});
}

export interface InteractOutsideEvent extends CustomEvent<{ originalEvent: Event }> {
	detail: { originalEvent: Event };
}

export interface DismissableLayerOptions {
	enabled: () => boolean;
	getNode: () => HTMLElement | null;
	/** Elements that count as inside, such as a trigger or an anchor. */
	getExclude?: () => (Element | null | undefined)[];
	/** Elements that must stay focusable and clickable although they sit outside the layer. */
	getPersistentElements?: () => (Element | null | undefined)[];
	onPointerDownOutside?: (event: InteractOutsideEvent) => void;
	onFocusOutside?: (event: InteractOutsideEvent) => void;
	onInteractOutside?: (event: InteractOutsideEvent) => void;
}

const layerStack: (Element | null)[] = [];

function isInside(target: Node | null, layers: (Element | null)[], exclude: (Element | null | undefined)[]) {
	for (const layer of layers) {
		if (layer && layer.contains(target)) return true;
	}
	for (const element of exclude) {
		if (element && element.contains(target)) return true;
	}
	return false;
}

function createInteractEvent(type: string, originalEvent: Event): InteractOutsideEvent {
	return new CustomEvent(type, { detail: { originalEvent }, cancelable: true, bubbles: false }) as InteractOutsideEvent;
}

export function useDismissableLayer(options: DismissableLayerOptions): void {
	$effect(() => {
		if (!options.enabled()) return;
		const node = options.getNode();
		if (!node) return;
		const doc = node.ownerDocument;

		layerStack.push(node);

		const onPointerDown = (event: Event) => {
			const target = event.target as Node | null;
			const layer = options.getNode();
			if (!layer) return;
			const exclude = [...(options.getExclude?.() ?? []), ...(options.getPersistentElements?.() ?? [])];
			if (isInside(target, [layer], exclude)) return;
			const outside = createInteractEvent('pointerdown.outside', event);
			options.onPointerDownOutside?.(outside);
			if (outside.defaultPrevented) return;
			const interact = createInteractEvent('interact.outside', event);
			options.onInteractOutside?.(interact);
		};

		const onFocusIn = (event: FocusEvent) => {
			const target = event.target as Node | null;
			const layer = options.getNode();
			if (!layer) return;
			const exclude = [...(options.getExclude?.() ?? []), ...(options.getPersistentElements?.() ?? [])];
			if (isInside(target, [layer], exclude)) return;
			const outside = createInteractEvent('focus.outside', event);
			options.onFocusOutside?.(outside);
			if (outside.defaultPrevented) return;
			const interact = createInteractEvent('interact.outside', event);
			options.onInteractOutside?.(interact);
		};

		doc.addEventListener('pointerdown', onPointerDown, true);
		doc.addEventListener('focusin', onFocusIn, true);

		return () => {
			doc.removeEventListener('pointerdown', onPointerDown, true);
			doc.removeEventListener('focusin', onFocusIn, true);
			const index = layerStack.indexOf(node);
			if (index !== -1) layerStack.splice(index, 1);
		};
	});
}

const tabbableSelector = [
	'a[href]',
	'area[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'iframe',
	'object',
	'embed',
	'audio[controls]',
	'video[controls]',
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

function isVisible(element: HTMLElement): boolean {
	if (element.hidden) return false;
	if (element.hasAttribute('inert')) return false;
	// `checkVisibility` understands ancestor visibility; fall back to the element's own computed style
	// where it is missing (jsdom), and to `offsetParent` in browsers without either.
	const check = (element as HTMLElement & { checkVisibility?: (options?: object) => boolean }).checkVisibility;
	if (typeof check === 'function') return check.call(element, { checkVisibilityCSS: true });
	const style = element.ownerDocument.defaultView?.getComputedStyle(element);
	if (style) return style.display !== 'none' && style.visibility !== 'hidden';
	return element.offsetParent !== null;
}

export function getTabbables(container: Element): HTMLElement[] {
	return Array.from(container.querySelectorAll<HTMLElement>(tabbableSelector)).filter((element) => {
		if (element.hasAttribute('disabled')) return false;
		if (element.getAttribute('aria-hidden') === 'true') return false;
		return isVisible(element) || element === element.ownerDocument.activeElement;
	});
}

export interface FocusScopeOptions {
	enabled: () => boolean;
	getNode: () => HTMLElement | null;
	trap?: () => boolean;
	/** Element that receives focus on open; defaults to the first tabbable inside the scope. */
	getInitialFocus?: () => HTMLElement | null | undefined;
}

export function useFocusScope(options: FocusScopeOptions): void {
	$effect(() => {
		if (!options.enabled()) return;
		const node = options.getNode();
		if (!node) return;
		const doc = node.ownerDocument;
		const previouslyFocused = doc.activeElement as HTMLElement | null;

		// Ark focuses the layer container itself (it carries tabindex="-1"), not its first control.
		const requested = options.getInitialFocus?.();
		if (requested) {
			requested.focus({ preventScroll: true });
		} else {
			node.focus({ preventScroll: true });
			if (doc.activeElement !== node) (getTabbables(node)[0] ?? node).focus({ preventScroll: true });
		}

		const onKeydown = (event: KeyboardEvent) => {
			if (event.key !== 'Tab') return;
			if (options.trap?.() === false) return;
			const current = options.getNode();
			if (!current) return;
			const tabbables = getTabbables(current);
			if (!tabbables.length) {
				event.preventDefault();
				current.focus({ preventScroll: true });
				return;
			}
			const first = tabbables[0];
			const last = tabbables[tabbables.length - 1];
			const active = doc.activeElement;
			if (!event.shiftKey && active === last) {
				event.preventDefault();
				first.focus();
			} else if (event.shiftKey && (active === first || active === current)) {
				event.preventDefault();
				last.focus();
			}
		};

		doc.addEventListener('keydown', onKeydown, true);

		return () => {
			doc.removeEventListener('keydown', onKeydown, true);
			if (previouslyFocused && previouslyFocused.isConnected) previouslyFocused.focus({ preventScroll: true });
		};
	});
}

let scrollLockCount = 0;
let scrollLockPrevious: { overflow: string; paddingRight: string } | null = null;

export function useScrollLock(enabled: () => boolean): void {
	$effect(() => {
		if (!enabled()) return;
		if (typeof document === 'undefined') return;
		const body = document.body;
		if (scrollLockCount === 0) {
			const scrollbar = window.innerWidth - document.documentElement.clientWidth;
			scrollLockPrevious = {
				overflow: body.style.overflow,
				paddingRight: body.style.paddingRight
			};
			body.style.overflow = 'hidden';
			if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
		}
		scrollLockCount += 1;

		return () => {
			scrollLockCount -= 1;
			if (scrollLockCount > 0 || !scrollLockPrevious) return;
			body.style.overflow = scrollLockPrevious.overflow;
			body.style.paddingRight = scrollLockPrevious.paddingRight;
			scrollLockPrevious = null;
		};
	});
}

const ariaHiddenStack: { element: Element; previous: string | null }[] = [];

/**
 * Hides everything outside the layer from assistive technology, as Zag's aria-hidden does.
 * `getPersistent` keeps the elements that must stay exposed: for a modal popover that is its own
 * trigger, which would otherwise vanish from the accessibility tree.
 */
export function useAriaHidden(
	enabled: () => boolean,
	getNode: () => HTMLElement | null,
	getPersistent?: () => (Element | null | undefined)[]
): void {
	$effect(() => {
		if (!enabled()) return;
		const node = getNode();
		if (!node || typeof document === 'undefined') return;

		const hidden: { element: Element; previous: string | null }[] = [];
		const persistent = () => (getPersistent?.() ?? []).filter(Boolean) as Element[];
		const isPersistent = (element: Element) =>
			persistent().some((item) => item === element || item.contains(element) || element.contains(item));

		const hide = (element: Element) => {
			if (element === node || node.contains(element)) return;
			if (element.hasAttribute('data-rta-aria-hidden-ignore')) return;
			if (isPersistent(element)) return;
			hidden.push({ element, previous: element.getAttribute('aria-hidden') });
			element.setAttribute('aria-hidden', 'true');
		};

		// Walk from the layer up to the body, hiding every sibling on the way.
		let current: Element | null = node;
		while (current && current !== document.body) {
			const parent: Element | null = current.parentElement;
			if (!parent) break;
			for (const sibling of Array.from(parent.children)) hide(sibling);
			current = parent;
		}

		ariaHiddenStack.push(...hidden);

		return () => {
			for (const entry of hidden) {
				if (entry.previous === null) entry.element.removeAttribute('aria-hidden');
				else entry.element.setAttribute('aria-hidden', entry.previous);
				const index = ariaHiddenStack.indexOf(entry);
				if (index !== -1) ariaHiddenStack.splice(index, 1);
			}
		};
	});
}

export { layerStack };
