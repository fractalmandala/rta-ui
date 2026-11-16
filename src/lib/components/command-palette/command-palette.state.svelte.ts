import { untrack } from 'svelte';
import { createCollection, type CollectionItem } from '../../internal/collection';
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

/** The consumer's command shape: `value` is canonical, every other field is theirs to keep. */
export interface CommandPaletteEntry extends CollectionItem {
	[key: string]: unknown;
}

export type CommandPaletteInputBehavior = 'none' | 'autohighlight';
export type CommandPaletteSelectionBehavior = 'clear' | 'replace' | 'preserve';

export interface CommandPaletteOpenChangeDetails {
	open: boolean;
	reason: string;
}

export interface CommandPaletteValueChangeDetails {
	value: string[];
	items: CommandPaletteEntry[];
}

export interface CommandPaletteInputValueChangeDetails {
	inputValue: string;
	reason: string;
}

export interface CommandPaletteHighlightChangeDetails {
	highlightedValue: string | null;
	highlightedItem: CommandPaletteEntry | undefined;
}

export interface CommandPaletteModifierKeys {
	shift: boolean;
	ctrl: boolean;
	alt: boolean;
	meta: boolean;
}

export interface CommandPaletteSelectDetails {
	value: string[];
	itemValue: string;
	modifiers: CommandPaletteModifierKeys;
}

export type CommandPaletteFocusOutsideEvent = InteractOutsideEvent;
export type CommandPalettePointerDownOutsideEvent = InteractOutsideEvent;
export type CommandPaletteInteractOutsideEvent = InteractOutsideEvent;

export type CommandPalettePortalTarget = Element | (() => Element | null | undefined) | null;

export interface CommandPaletteTranslations {
	searchLabel: string;
	clearTriggerLabel: string;
	noResults: string;
}

export interface CommandPaletteElementIds {
	trigger?: string;
	positioner?: string;
	backdrop?: string;
	content?: string;
	title?: string;
	description?: string;
}

export interface CommandPaletteComboboxElementIds {
	root?: string;
	control?: string;
	input?: string;
	content?: string;
	clearTrigger?: string;
	item?: (value: string) => string;
	itemGroup?: (id: string) => string;
	itemGroupLabel?: (id: string) => string;
}

export interface UseCommandPaletteProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (details: CommandPaletteOpenChangeDetails) => void;
	modal?: boolean;
	trapFocus?: boolean;
	preventScroll?: boolean;
	restoreFocus?: boolean;
	closeOnEscape?: boolean;
	closeOnInteractOutside?: boolean;
	'aria-label'?: string;
	initialFocusEl?: () => Element | null | undefined | false;
	finalFocusEl?: () => Element | null | undefined;
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	onFocusOutside?: (event: CommandPaletteFocusOutsideEvent) => void;
	onInteractOutside?: (event: CommandPaletteInteractOutsideEvent) => void;
	onPointerDownOutside?: (event: CommandPalettePointerDownOutsideEvent) => void;
	persistentElements?: (() => Element | null | undefined)[];
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: CommandPaletteElementIds;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	onExitComplete?: () => void;
	/** Render the overlay inside `document.body`. Set `false` to keep it in place. */
	portalled?: boolean;
	/** Element or getter for the portal container. */
	portalRef?: CommandPalettePortalTarget;
	/** Global hotkey that toggles the palette, such as `mod+k`. `false` disables it. */
	shortcut?: false | string;
}

export interface CommandPaletteApi {
	readonly open: boolean;
	readonly modal: boolean;
	readonly state: 'open' | 'closed';
	readonly present: boolean;
	readonly unmounted: boolean;
	readonly titleRendered: boolean;
	readonly triggerId: string;
	readonly contentId: string;
	readonly positionerId: string;
	readonly backdropId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	setOpen(open: boolean, reason?: string): void;
	triggerAttrs(): Record<string, unknown>;
	backdropAttrs(): Record<string, unknown>;
	positionerAttrs(): Record<string, unknown>;
	contentAttrs(): Record<string, unknown>;
	titleAttrs(): Record<string, unknown>;
	descriptionAttrs(): Record<string, unknown>;
	registerContent(node: Element | null): void;
	registerTrigger(node: Element | null): void;
	/** The element that takes focus when the palette opens; the search input claims it. */
	registerFocusTarget(node: Element | null): void;
	/** Marks a rendered title or description part, which drives the content's aria wiring. */
	markRendered(part: 'title' | 'description', rendered: boolean): void;
}

export interface CommandPaletteItemOptions {
	item: CommandPaletteEntry;
	persistFocus?: boolean;
}

export interface CommandPaletteItemState {
	value: string;
	label: string;
	disabled: boolean;
	highlighted: boolean;
	selected: boolean;
}

export interface UseCommandPaletteComboboxProps {
	items?: CommandPaletteEntry[];
	itemToValue?: (item: CommandPaletteEntry) => string;
	itemToString?: (item: CommandPaletteEntry) => string;
	isItemDisabled?: (item: CommandPaletteEntry) => boolean;
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (details: CommandPaletteValueChangeDetails) => void;
	onSelect?: (details: CommandPaletteSelectDetails) => void;
	inputValue?: string;
	defaultInputValue?: string;
	onInputValueChange?: (details: CommandPaletteInputValueChangeDetails) => void;
	highlightedValue?: string | null;
	defaultHighlightedValue?: string | null;
	onHighlightChange?: (details: CommandPaletteHighlightChangeDetails) => void;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	loopFocus?: boolean;
	closeOnSelect?: boolean;
	inputBehavior?: CommandPaletteInputBehavior;
	selectionBehavior?: CommandPaletteSelectionBehavior;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: CommandPaletteComboboxElementIds;
	translations?: Partial<CommandPaletteTranslations>;
}

export interface CommandPaletteComboboxApi {
	readonly inputValue: string;
	readonly value: string[];
	readonly valueAsString: string;
	readonly highlightedValue: string | null;
	readonly highlightedItem: CommandPaletteEntry | undefined;
	readonly empty: boolean;
	readonly items: CommandPaletteEntry[];
	readonly focused: boolean;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly translations: CommandPaletteTranslations;
	readonly rootId: string;
	readonly controlId: string;
	readonly inputId: string;
	readonly contentId: string;
	readonly clearTriggerId: string;
	itemId(value: string): string;
	itemGroupId(id: string): string;
	itemGroupLabelId(id: string): string;
	itemState(options: CommandPaletteItemOptions): CommandPaletteItemState;
	rootAttrs(): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	inputAttrs(): Record<string, unknown>;
	clearTriggerAttrs(): Record<string, unknown>;
	contentAttrs(): Record<string, unknown>;
	emptyAttrs(): Record<string, unknown>;
	itemAttrs(options: CommandPaletteItemOptions): Record<string, unknown>;
	itemTextAttrs(options: CommandPaletteItemOptions): Record<string, unknown>;
	itemIndicatorAttrs(options: CommandPaletteItemOptions): Record<string, unknown>;
	itemGroupAttrs(options: { id: string }): Record<string, unknown>;
	itemGroupLabelAttrs(options: { htmlFor: string }): Record<string, unknown>;
	registerInput(node: Element | null): void;
	setInputValue(value: string, reason?: string): void;
	setValue(value: string[]): void;
	setHighlightedValue(value: string | null): void;
	clearHighlightedValue(): void;
	selectValue(value: string): void;
	clearValue(): void;
	focus(): void;
}

const defaultTranslations: CommandPaletteTranslations = {
	searchLabel: 'Search commands',
	clearTriggerLabel: 'Clear search',
	noResults: 'No results found'
};

const commandPaletteContext = createContext<CommandPaletteApi>('CommandPalette', 'CommandPalette');
const commandPaletteComboboxContext = createContext<CommandPaletteComboboxApi>(
	'CommandPaletteCombobox',
	'CommandPalette.Combobox'
);
const commandPaletteItemContext = createContext<() => CommandPaletteItemOptions>(
	'CommandPaletteItem',
	'CommandPalette.Item'
);
const commandPaletteItemGroupContext = createContext<() => string>(
	'CommandPaletteItemGroup',
	'CommandPalette.ItemGroup'
);

export const setCommandPaletteContext = (api: CommandPaletteApi): CommandPaletteApi =>
	commandPaletteContext.set(api);
export const useCommandPaletteContext = (): CommandPaletteApi => commandPaletteContext.get();
export const setCommandPaletteComboboxContext = (
	api: CommandPaletteComboboxApi
): CommandPaletteComboboxApi => commandPaletteComboboxContext.set(api);
export const useCommandPaletteComboboxContext = (): CommandPaletteComboboxApi =>
	commandPaletteComboboxContext.get();
export const setCommandPaletteItemContext = (
	options: () => CommandPaletteItemOptions
): (() => CommandPaletteItemOptions) => commandPaletteItemContext.set(options);
export const useCommandPaletteItemContext = (): (() => CommandPaletteItemOptions) =>
	commandPaletteItemContext.get();
export const setCommandPaletteItemGroupContext = (id: () => string): (() => string) =>
	commandPaletteItemGroupContext.set(id);
export const useCommandPaletteItemGroupContext = (): (() => string) =>
	commandPaletteItemGroupContext.get();

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	const result: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry !== undefined) result[key] = entry;
	}
	return result as T;
}

function getModifiers(event: {
	shiftKey: boolean;
	ctrlKey: boolean;
	altKey: boolean;
	metaKey: boolean;
}): CommandPaletteModifierKeys {
	return {
		shift: event.shiftKey,
		ctrl: event.ctrlKey,
		alt: event.altKey,
		meta: event.metaKey
	};
}

export interface Hotkey {
	key: string;
	mod: boolean;
	meta: boolean;
	ctrl: boolean;
	shift: boolean;
	alt: boolean;
}

/** `mod+k`, `meta+shift+p`, `alt+k`: the modifier list `isHotKey` accepts, resolved to flags. */
export function parseShortcut(shortcut: string): Hotkey | undefined {
	const tokens = shortcut
		.split('+')
		.map((token) => token.trim().toLowerCase())
		.filter(Boolean);
	const key = tokens.pop();
	if (!key) return undefined;
	const hotkey: Hotkey = { key, mod: false, meta: false, ctrl: false, shift: false, alt: false };
	for (const token of tokens) {
		if (token === 'mod') hotkey.mod = true;
		else if (token === 'meta' || token === 'cmd' || token === 'command') hotkey.meta = true;
		else if (token === 'ctrl' || token === 'control') hotkey.ctrl = true;
		else if (token === 'shift') hotkey.shift = true;
		else if (token === 'alt' || token === 'option') hotkey.alt = true;
	}
	return hotkey;
}

function matchesHotkey(hotkey: Hotkey, event: KeyboardEvent): boolean {
	if (event.key.toLowerCase() !== hotkey.key) return false;
	if (event.shiftKey !== hotkey.shift) return false;
	if (event.altKey !== hotkey.alt) return false;
	// `mod` is whichever of meta or ctrl the platform uses; either satisfies it, never both.
	if (hotkey.mod && !hotkey.meta && !hotkey.ctrl) {
		if (event.metaKey === event.ctrlKey) return false;
		return true;
	}
	if (event.metaKey !== (hotkey.meta || hotkey.mod)) return false;
	if (event.ctrlKey !== (hotkey.ctrl || hotkey.mod)) return false;
	return true;
}

function isEditableTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	const tag = target.tagName;
	return (
		tag === 'INPUT' ||
		tag === 'TEXTAREA' ||
		tag === 'SELECT' ||
		target.isContentEditable ||
		target.closest('[contenteditable="true"]') !== null
	);
}

const asHTMLElement = (node: Element | null): HTMLElement | null =>
	node instanceof HTMLElement ? node : null;

export function createCommandPalette(
	props: () => UseCommandPaletteProps,
	uid: string
): CommandPaletteApi {
	const prop = <K extends keyof UseCommandPaletteProps>(key: K): UseCommandPaletteProps[K] =>
		props()[key];

	const dialogId = () => prop('id') ?? uid;
	const triggerId = () => prop('ids')?.trigger ?? `dialog:${dialogId()}:trigger`;
	const contentId = () => prop('ids')?.content ?? `dialog:${dialogId()}:content`;
	const positionerId = () => prop('ids')?.positioner ?? `dialog:${dialogId()}:positioner`;
	const backdropId = () => prop('ids')?.backdrop ?? `dialog:${dialogId()}:backdrop`;
	const titleId = () => prop('ids')?.title ?? `dialog:${dialogId()}:title`;
	const descriptionId = () =>
		prop('ids')?.description ?? `dialog:${dialogId()}:description`;

	let internalOpen = $state(Boolean(prop('defaultOpen')));
	let contentNode = $state<HTMLElement | null>(null);
	let focusTarget = $state<HTMLElement | null>(null);
	let rendered = $state({ title: false, description: false });
	let mountedOnce = $state(false);
	const triggerNodes: HTMLElement[] = [];

	const isControlled = () => prop('open') !== undefined;
	const open = () => (isControlled() ? Boolean(prop('open')) : internalOpen);
	const modal = () => prop('modal') ?? true;
	const trapFocus = () => prop('trapFocus') ?? modal();
	const closeOnEscape = () => prop('closeOnEscape') ?? true;
	const closeOnInteractOutside = () => prop('closeOnInteractOutside') ?? modal();
	const lazy = () => prop('lazyMount') ?? true;
	const keepAfterExit = () => prop('unmountOnExit') ?? true;

	const presence = createPresence({
		present: () => open(),
		getNode: () => contentNode,
		lazyMount: () => true,
		// The shared presence waits for the exit animation; `unmounted` re-applies the consumer's
		// own lazyMount / unmountOnExit strategy on top of it.
		unmountOnExit: () => true,
		onExitComplete: () => prop('onExitComplete')?.()
	});

	const unmounted = () =>
		!open() && !presence.present ? (mountedOnce ? keepAfterExit() : lazy()) : false;

	$effect(() => {
		if (open()) mountedOnce = true;
	});

	function setOpen(next: boolean, reason = 'script') {
		if (next === open()) return;
		if (!isControlled()) internalOpen = next;
		prop('onOpenChange')?.({ open: next, reason });
	}

	useEscapeLayer({
		enabled: () => open() && closeOnEscape(),
		onEscape(event) {
			prop('onEscapeKeyDown')?.(event);
			if (event.defaultPrevented) return;
			setOpen(false, 'escape-key');
		}
	});

	useDismissableLayer({
		enabled: () => open() && !unmounted() && closeOnInteractOutside(),
		getNode: () => contentNode,
		getExclude: () => [...triggerNodes, ...(prop('persistentElements') ?? []).map((item) => item())],
		onPointerDownOutside: (event) => prop('onPointerDownOutside')?.(event),
		onFocusOutside: (event) => prop('onFocusOutside')?.(event),
		onInteractOutside(event) {
			prop('onInteractOutside')?.(event);
			if (event.defaultPrevented) return;
			setOpen(false, 'interact-outside');
		}
	});

	useFocusScope({
		enabled: () => open() && contentNode !== null,
		getNode: () => contentNode,
		trap: () => trapFocus(),
		getInitialFocus: () => {
			const provided = prop('initialFocusEl')?.();
			if (provided) return provided instanceof HTMLElement ? provided : null;
			return untrack(() => focusTarget);
		}
	});

	// The input mounts after the content, so the focus scope usually runs before it registers.
	// Claiming focus here keeps the palette's "focus the search field on open" contract deterministic.
	$effect(() => {
		if (!open()) return;
		const target = focusTarget;
		if (!target) return;
		untrack(() => {
			const active = target.ownerDocument.activeElement;
			if (active === target) return;
			if (active && active !== contentNode && contentNode?.contains(active)) return;
			target.focus({ preventScroll: true });
		});
	});

	useScrollLock(() => open() && modal() && (prop('preventScroll') ?? true));
	useAriaHidden(
		() => open() && modal(),
		() => contentNode
	);

	let lastOpen = open();
	$effect(() => {
		const current = open();
		const previous = lastOpen;
		lastOpen = current;
		if (current || !previous) return;
		const target = prop('finalFocusEl')?.();
		if (!target) return;
		requestAnimationFrame(() => {
			if (!open()) (target as HTMLElement).focus({ preventScroll: true });
		});
	});

	// The global shortcut toggles the palette; while it is open the shortcut also fires from form
	// fields, which is what Ark's `enableOnFormTags` does for a dialog that already owns focus.
	$effect(() => {
		const shortcut = prop('shortcut');
		if (!shortcut) return;
		const hotkey = parseShortcut(shortcut);
		if (!hotkey) return;
		const doc = typeof document === 'undefined' ? null : document;
		if (!doc) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.defaultPrevented || event.repeat || event.isComposing) return;
			if (!matchesHotkey(hotkey, event)) return;
			if (!open() && isEditableTarget(event.target)) return;
			event.preventDefault();
			setOpen(!open(), 'shortcut');
		};

		doc.addEventListener('keydown', onKeyDown);
		return () => doc.removeEventListener('keydown', onKeyDown);
	});

	return {
		get open() {
			return open();
		},
		get modal() {
			return modal();
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
		get titleRendered() {
			return rendered.title;
		},
		get triggerId() {
			return triggerId();
		},
		get contentId() {
			return contentId();
		},
		get positionerId() {
			return positionerId();
		},
		get backdropId() {
			return backdropId();
		},
		get titleId() {
			return titleId();
		},
		get descriptionId() {
			return descriptionId();
		},
		setOpen,
		triggerAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: triggerId(),
				'data-ownedby': dialogId(),
				'aria-haspopup': 'dialog',
				type: 'button',
				'aria-expanded': open(),
				'data-state': open() ? 'open' : 'closed',
				'aria-controls': presence.present ? contentId() : undefined,
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					setOpen(!open(), 'trigger-click');
				}
			});
		},
		backdropAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				hidden: !presence.present,
				id: backdropId(),
				'data-state': open() ? 'open' : 'closed'
			});
		},
		positionerAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: positionerId(),
				style: !open() || !modal() ? 'pointer-events: none;' : undefined
			});
		},
		contentAttrs() {
			const label = prop('aria-label');
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				role: 'dialog',
				hidden: !presence.present,
				id: contentId(),
				tabindex: -1,
				'data-state': open() ? 'open' : 'closed',
				'aria-modal': modal(),
				'aria-label': label,
				'aria-labelledby': label || !rendered.title ? undefined : titleId(),
				'aria-describedby': rendered.description ? descriptionId() : undefined,
				style: modal() ? undefined : 'pointer-events: auto;'
			});
		},
		titleAttrs() {
			return dropUndefined({ dir: prop('dir') ?? undefined, id: titleId() });
		},
		descriptionAttrs() {
			return dropUndefined({ dir: prop('dir') ?? undefined, id: descriptionId() });
		},
		registerContent(node) {
			contentNode = asHTMLElement(node);
		},
		registerTrigger(node) {
			const element = asHTMLElement(node);
			if (!element) {
				triggerNodes.length = 0;
				return;
			}
			if (!triggerNodes.includes(element)) triggerNodes.push(element);
		},
		registerFocusTarget(node) {
			focusTarget = asHTMLElement(node);
		},
		markRendered(part, isRendered) {
			untrack(() => {
				if (rendered[part] === isRendered) return;
				rendered[part] = isRendered;
			});
		}
	};
}

export function createCommandPaletteCombobox(
	root: CommandPaletteApi,
	props: () => UseCommandPaletteComboboxProps,
	uid: string
): CommandPaletteComboboxApi {
	const prop = <K extends keyof UseCommandPaletteComboboxProps>(
		key: K
	): UseCommandPaletteComboboxProps[K] => props()[key];

	const disabled = () => Boolean(prop('disabled'));
	const readOnly = () => Boolean(prop('readOnly'));
	const interactive = () => !disabled() && !readOnly();
	const loopFocus = () => prop('loopFocus') !== false;
	const closeOnSelect = () => prop('closeOnSelect') !== false;
	const inputBehavior = (): CommandPaletteInputBehavior => prop('inputBehavior') ?? 'autohighlight';
	const selectionBehavior = (): CommandPaletteSelectionBehavior =>
		prop('selectionBehavior') ?? 'preserve';
	const translations = (): CommandPaletteTranslations => ({
		...defaultTranslations,
		...prop('translations')
	});

	const rootId = () => prop('ids')?.root ?? prop('id') ?? `combobox:${uid}`;
	const controlId = () => prop('ids')?.control ?? `${rootId()}:control`;
	const inputId = () => prop('ids')?.input ?? `${rootId()}:input`;
	const contentId = () => prop('ids')?.content ?? `${rootId()}:content`;
	const clearTriggerId = () => prop('ids')?.clearTrigger ?? `${rootId()}:clear-btn`;
	const itemId = (value: string) => prop('ids')?.item?.(value) ?? `${rootId()}:option:${value}`;
	const itemGroupId = (id: string) => prop('ids')?.itemGroup?.(id) ?? `${rootId()}:optgroup:${id}`;
	const itemGroupLabelId = (id: string) =>
		prop('ids')?.itemGroupLabel?.(id) ?? `${rootId()}:optgroup-label:${id}`;

	const toValue = (item: CommandPaletteEntry) => prop('itemToValue')?.(item) ?? item.value;
	const toString = (item: CommandPaletteEntry) =>
		prop('itemToString')?.(item) ?? item.label ?? item.value;
	const toDisabled = (item: CommandPaletteEntry) =>
		Boolean(prop('isItemDisabled')?.(item) ?? item.disabled);

	const collection = createCollection<CommandPaletteEntry>({
		items: () => prop('items') ?? [],
		itemToValue: toValue,
		itemToString: toString,
		isItemDisabled: toDisabled
	});

	let internalValue = $state<string[]>(prop('defaultValue') ?? []);
	let internalInputValue = $state<string>(prop('defaultInputValue') ?? '');
	let internalHighlighted = $state<string | null>(prop('defaultHighlightedValue') ?? null);
	let focused = $state(false);
	let modality = $state<'pointer' | 'keyboard'>('pointer');
	let inputNode = $state<Element | null>(null);

	const value = () => prop('value') ?? internalValue;
	const inputValue = () => prop('inputValue') ?? internalInputValue;
	const highlightedValue = () => {
		const controlled = prop('highlightedValue');
		return controlled !== undefined ? controlled : internalHighlighted;
	};

	const resolve = (entry: string): CommandPaletteEntry =>
		collection.nodeOf(entry)?.item ?? { value: entry };
	const valueAsString = () =>
		value()
			.map((entry) => toString(resolve(entry)))
			.join(', ');

	function setHighlighted(next: string | null) {
		if (highlightedValue() === next) return;
		if (prop('highlightedValue') === undefined) internalHighlighted = next;
		prop('onHighlightChange')?.({
			highlightedValue: next,
			highlightedItem: next ? resolve(next) : undefined
		});
	}

	function setInputValue(next: string, reason: string) {
		if (prop('inputValue') === undefined) internalInputValue = next;
		prop('onInputValueChange')?.({ inputValue: next, reason });
	}

	function commitValue(next: string[]) {
		if (prop('value') === undefined) internalValue = next;
		prop('onValueChange')?.({ value: next, items: next.map(resolve) });
	}

	const highlightable = () => collection.items.filter((node) => !node.disabled);
	const firstValue = () => highlightable()[0]?.value;
	const lastValue = () => {
		const nodes = highlightable();
		return nodes[nodes.length - 1]?.value;
	};

	function move(step: 1 | -1) {
		const nodes = highlightable();
		if (!nodes.length) return;
		const index = nodes.findIndex((node) => node.value === highlightedValue());
		if (index === -1) {
			setHighlighted(step > 0 ? nodes[0].value : nodes[nodes.length - 1].value);
			return;
		}
		const next = nodes[index + step] ?? (loopFocus() ? nodes[step > 0 ? 0 : nodes.length - 1] : undefined);
		if (next) setHighlighted(next.value);
	}

	// The consumer re-filters `items` in `onInputValueChange`, so "highlight the first match" is
	// driven by the item set and the query rather than by the keystroke itself.
	let itemSignature = '';
	$effect(() => {
		const nodes = collection.items;
		const signature = `${inputValue()}\u0000${nodes
			.map((node) => `${node.value}|${node.label}|${node.disabled}`)
			.join(',')}`;
		const changed = signature !== itemSignature;
		itemSignature = signature;
		const highlighted = highlightedValue();
		if (!changed && highlighted != null && nodes.some((node) => node.value === highlighted)) return;
		if (inputBehavior() === 'autohighlight') {
			const first = nodes.find((node) => !node.disabled)?.value;
			if (first && first !== highlighted) setHighlighted(first);
			else if (!first && highlighted != null) setHighlighted(null);
			return;
		}
		if (highlighted != null) setHighlighted(null);
	});

	function selectItem(entry: string, modifiers: CommandPaletteModifierKeys) {
		const next = [entry];
		prop('onSelect')?.({ value: next, itemValue: entry, modifiers });
		commitValue(next);
		const behavior = selectionBehavior();
		if (behavior === 'clear') setInputValue('', 'item-select');
		else if (behavior === 'replace') setInputValue(toString(resolve(entry)), 'item-select');
		if (closeOnSelect()) root.setOpen(false, 'item-select');
	}

	function handleInput(event: Event) {
		if (!interactive()) return;
		setInputValue((event.currentTarget as HTMLInputElement).value, 'input-change');
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.defaultPrevented || !interactive() || event.isComposing) return;
		if ((event.ctrlKey || event.shiftKey) && event.key !== 'Enter') return;
		modality = 'keyboard';

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				move(1);
				return;
			case 'ArrowUp':
				event.preventDefault();
				move(-1);
				return;
			case 'Home':
				if (event.metaKey) return;
				event.preventDefault();
				setHighlighted(firstValue() ?? null);
				return;
			case 'End':
				if (event.metaKey) return;
				event.preventDefault();
				setHighlighted(lastValue() ?? null);
				return;
			case 'Enter': {
				const highlighted = highlightedValue();
				if (highlighted == null) return;
				if (collection.nodeOf(highlighted)?.disabled) return;
				event.preventDefault();
				selectItem(highlighted, getModifiers(event));
				return;
			}
			default:
				return;
		}
	}

	function itemState(options: CommandPaletteItemOptions): CommandPaletteItemState {
		const entryValue = toValue(options.item);
		return {
			value: entryValue,
			label: toString(options.item),
			disabled: Boolean(disabled() || toDisabled(options.item)),
			highlighted: highlightedValue() === entryValue,
			selected: value().includes(entryValue)
		};
	}

	function focus() {
		const node = inputNode as HTMLInputElement | null;
		if (!node) return;
		if (node.ownerDocument.activeElement === node) return;
		node.focus({ preventScroll: true });
		try {
			node.setSelectionRange(node.value.length, node.value.length);
		} catch {
			// Some input types have no selection range; focusing is the part that matters.
		}
	}

	return {
		get inputValue() {
			return inputValue();
		},
		get value() {
			return value();
		},
		get valueAsString() {
			return valueAsString();
		},
		get highlightedValue() {
			return highlightedValue();
		},
		get highlightedItem() {
			const entry = highlightedValue();
			return entry ? resolve(entry) : undefined;
		},
		get empty() {
			return collection.size === 0;
		},
		get items() {
			return collection.items.map((node) => node.item);
		},
		get focused() {
			return focused;
		},
		get disabled() {
			return disabled();
		},
		get readOnly() {
			return readOnly();
		},
		get translations() {
			return translations();
		},
		get rootId() {
			return rootId();
		},
		get controlId() {
			return controlId();
		},
		get inputId() {
			return inputId();
		},
		get contentId() {
			return contentId();
		},
		get clearTriggerId() {
			return clearTriggerId();
		},
		itemId,
		itemGroupId,
		itemGroupLabelId,
		itemState,
		rootAttrs() {
			return dropUndefined({
				id: rootId(),
				dir: prop('dir') ?? undefined,
				'data-readonly': dataAttr(readOnly()),
				'data-disabled': dataAttr(disabled())
			});
		},
		controlAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: controlId(),
				'data-state': root.open ? 'open' : 'closed',
				'data-focus': dataAttr(focused),
				'data-disabled': dataAttr(disabled())
			});
		},
		inputAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				disabled: disabled(),
				readonly: readOnly(),
				autocomplete: 'off',
				autocorrect: 'off',
				autocapitalize: 'none',
				spellcheck: 'false',
				placeholder: prop('placeholder'),
				id: inputId(),
				type: 'text',
				role: 'combobox',
				value: inputValue(),
				'aria-autocomplete': 'list',
				'aria-controls': contentId(),
				'aria-expanded': root.open,
				'aria-haspopup': 'listbox',
				'data-state': root.open ? 'open' : 'closed',
				'aria-activedescendant': highlightedValue() ? itemId(highlightedValue() as string) : undefined,
				oninput: handleInput,
				onkeydown: handleKeyDown,
				onfocus() {
					focused = true;
					modality = 'keyboard';
				},
				onblur() {
					focused = false;
				}
			});
		},
		clearTriggerAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: clearTriggerId(),
				type: 'button',
				tabindex: -1,
				disabled: disabled(),
				'aria-label': translations().clearTriggerLabel,
				'aria-controls': inputId(),
				hidden: inputValue() === '',
				onpointerdown(event: PointerEvent) {
					if (event.button !== 0) return;
					modality = 'pointer';
					event.preventDefault();
				},
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!interactive()) return;
					setInputValue('', 'clear-trigger');
					focus();
				}
			});
		},
		contentAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: contentId(),
				role: 'listbox',
				tabindex: -1,
				'data-state': root.open ? 'open' : 'closed',
				'data-empty': dataAttr(collection.size === 0),
				'aria-labelledby': root.titleRendered ? root.titleId : undefined,
				onpointerdown(event: PointerEvent) {
					if (event.button !== 0) return;
					modality = 'pointer';
					event.preventDefault();
				}
			});
		},
		emptyAttrs() {
			return { role: 'presentation' };
		},
		itemAttrs(options) {
			const state = itemState(options);
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: itemId(state.value),
				role: 'option',
				tabindex: -1,
				'data-value': state.value,
				'data-highlighted': dataAttr(state.highlighted),
				'data-selected': dataAttr(state.selected),
				'data-state': state.selected ? 'checked' : 'unchecked',
				'data-disabled': dataAttr(state.disabled),
				'aria-selected': state.selected,
				'aria-disabled': state.disabled || undefined,
				onpointermove() {
					if (modality !== 'pointer') return;
					if (state.disabled) return;
					if (highlightedValue() === state.value) return;
					setHighlighted(state.value);
				},
				onpointerleave() {
					if (modality !== 'pointer') return;
					if (options.persistFocus) return;
					if (state.disabled) return;
					if (highlightedValue() !== state.value) return;
					setHighlighted(null);
				},
				onkeydown(event: KeyboardEvent) {
					if (event.defaultPrevented) return;
					if (event.key !== 'Enter' && event.key !== ' ') return;
					event.preventDefault();
					if (state.disabled) return;
					selectItem(state.value, getModifiers(event));
				},
				onclick(event: MouseEvent) {
					if (event.button !== 0) return;
					if (state.disabled) return;
					selectItem(state.value, getModifiers(event));
				}
			});
		},
		itemTextAttrs(options) {
			const state = itemState(options);
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				'data-state': state.selected ? 'checked' : 'unchecked',
				'data-highlighted': dataAttr(state.highlighted),
				'data-disabled': dataAttr(state.disabled)
			});
		},
		itemIndicatorAttrs(options) {
			const state = itemState(options);
			return dropUndefined({
				'aria-hidden': true,
				dir: prop('dir') ?? undefined,
				'data-state': state.selected ? 'checked' : 'unchecked',
				hidden: !state.selected
			});
		},
		itemGroupAttrs(options) {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: itemGroupId(options.id),
				'aria-labelledby': itemGroupLabelId(options.id),
				'data-empty': dataAttr(collection.size === 0),
				role: 'group'
			});
		},
		itemGroupLabelAttrs(options) {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: itemGroupLabelId(options.htmlFor),
				role: 'presentation'
			});
		},
		registerInput(node) {
			inputNode = node;
		},
		setInputValue(next, reason = 'script') {
			setInputValue(next, reason);
		},
		setValue(next) {
			commitValue(next);
		},
		setHighlightedValue(next) {
			setHighlighted(next);
		},
		clearHighlightedValue() {
			setHighlighted(null);
		},
		selectValue(entry) {
			selectItem(entry, { shift: false, ctrl: false, alt: false, meta: false });
		},
		clearValue() {
			commitValue([]);
			setInputValue('', 'clear-trigger');
			focus();
		},
		focus
	};
}
