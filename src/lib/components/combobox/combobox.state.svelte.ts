import {
	createCollection,
	createTypeahead,
	isPrintableKey,
	type CollectionItem
} from '../../internal/collection';
import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import {
	useDismissableLayer,
	useEscapeLayer,
	type InteractOutsideEvent
} from '../../internal/layers.svelte.js';
import {
	floatingStyle,
	type Placement,
	type PositionOptions
} from '../../internal/positioning.svelte.js';
import { createPresence } from '../../internal/presence.svelte.js';
import { useFieldContext } from '../field/field.state.svelte';

/** The consumer's item shape: `value` is canonical, every other field is theirs to keep. */
export interface ComboboxEntry extends CollectionItem {
	[key: string]: unknown;
}

export type ComboboxInputBehavior = 'none' | 'autocomplete' | 'autohighlight';
export type ComboboxSelectionBehavior = 'clear' | 'replace' | 'preserve';
export type ComboboxPositioningOptions = Partial<PositionOptions>;

export interface ComboboxValueChangeDetails {
	value: string[];
	items: ComboboxEntry[];
}

export interface ComboboxInputValueChangeDetails {
	inputValue: string;
	reason: string;
}

export interface ComboboxOpenChangeDetails {
	open: boolean;
	reason: string;
	value: string[];
}

export interface ComboboxHighlightChangeDetails {
	highlightedValue: string | null;
	highlightedItem: ComboboxEntry | undefined;
}

export interface ComboboxModifierKeys {
	shift: boolean;
	ctrl: boolean;
	alt: boolean;
	meta: boolean;
}

export interface ComboboxSelectionDetails {
	value: string[];
	itemValue: string;
	modifiers: ComboboxModifierKeys;
}

export type ComboboxFocusOutsideEvent = InteractOutsideEvent;
export type ComboboxPointerDownOutsideEvent = InteractOutsideEvent;
export type ComboboxInteractOutsideEvent = InteractOutsideEvent;

export interface ComboboxTranslations {
	triggerLabel: string;
	clearTriggerLabel: string;
	resultsCount: (count: number) => string;
	noResults: string;
	loading: string;
}

export interface ComboboxElementIds {
	root?: string;
	label?: string;
	control?: string;
	input?: string;
	content?: string;
	positioner?: string;
	trigger?: string;
	clearTrigger?: string;
	item?: (value: string) => string;
	itemGroup?: (id: string) => string;
	itemGroupLabel?: (id: string) => string;
	hiddenInput?: (value: string) => string;
}

export interface ComboboxHiddenInput {
	id: string;
	name: string | undefined;
	form: string | undefined;
	value: string;
}

export interface ComboboxItemOptions {
	item: ComboboxEntry;
	persistFocus?: boolean;
}

export interface ComboboxItemState {
	value: string;
	label: string;
	disabled: boolean;
	highlighted: boolean;
	selected: boolean;
}

export interface UseComboboxProps {
	items?: ComboboxEntry[];
	itemToValue?: (item: ComboboxEntry) => string;
	itemToString?: (item: ComboboxEntry) => string;
	isItemDisabled?: (item: ComboboxEntry) => boolean;
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (details: ComboboxValueChangeDetails) => void;
	onSelect?: (details: ComboboxSelectionDetails) => void;
	inputValue?: string;
	defaultInputValue?: string;
	onInputValueChange?: (details: ComboboxInputValueChangeDetails) => void;
	highlightedValue?: string | null;
	defaultHighlightedValue?: string | null;
	onHighlightChange?: (details: ComboboxHighlightChangeDetails) => void;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (details: ComboboxOpenChangeDetails) => void;
	multiple?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	invalid?: boolean;
	name?: string;
	form?: string;
	placeholder?: string;
	autoFocus?: boolean;
	loading?: boolean;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: ComboboxElementIds;
	loopFocus?: boolean;
	openOnClick?: boolean;
	openOnFocus?: boolean;
	openOnChange?: boolean | ((details: ComboboxInputValueChangeDetails) => boolean);
	openOnKeyPress?: boolean;
	closeOnSelect?: boolean;
	closeOnEscape?: boolean;
	closeOnInteractOutside?: boolean;
	disableLayer?: boolean;
	allowCustomValue?: boolean;
	alwaysSubmitOnEnter?: boolean;
	composite?: boolean;
	inputBehavior?: ComboboxInputBehavior;
	selectionBehavior?: ComboboxSelectionBehavior;
	portalled?: boolean;
	portalRef?: Element | (() => Element | null | undefined) | null;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	positioning?: ComboboxPositioningOptions;
	translations?: Partial<ComboboxTranslations>;
	onFocusOutside?: (event: InteractOutsideEvent) => void;
	onPointerDownOutside?: (event: InteractOutsideEvent) => void;
	onInteractOutside?: (event: InteractOutsideEvent) => void;
}

type Attrs = Record<string, unknown>;

type Phase = 'closed.idle' | 'closed.focused' | 'open.interacting' | 'open.suggesting';

export interface ComboboxApi {
	readonly open: boolean;
	readonly focused: boolean;
	readonly loading: boolean;
	readonly multiple: boolean;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly invalid: boolean;
	readonly required: boolean;
	readonly inputValue: string;
	readonly value: string[];
	readonly valueAsString: string;
	readonly hasSelectedItems: boolean;
	readonly selectedItems: ComboboxEntry[];
	readonly highlightedValue: string | null;
	readonly highlightedItem: ComboboxEntry | undefined;
	readonly isCustomValue: boolean;
	readonly empty: boolean;
	readonly items: ComboboxEntry[];
	readonly anchorNode: Element | null;
	readonly contentNode: Element | null;
	readonly translations: ComboboxTranslations;
	readonly currentPlacement: Placement | undefined;
	readonly present: boolean;
	readonly portalled: boolean;
	readonly portalTarget: Element | null;
	readonly positioning: ComboboxPositioningOptions;
	readonly rootId: string;
	readonly labelId: string;
	readonly controlId: string;
	readonly inputId: string;
	readonly contentId: string;
	readonly positionerId: string;
	readonly triggerId: string;
	readonly clearTriggerId: string;
	itemId(value: string): string;
	itemGroupId(id: string): string;
	itemGroupLabelId(id: string): string;
	itemState(options: ComboboxItemOptions): ComboboxItemState;
	hiddenInputs(): ComboboxHiddenInput[];
	rootAttrs(): Attrs;
	labelAttrs(): Attrs;
	controlAttrs(): Attrs;
	inputAttrs(): Attrs;
	triggerAttrs(): Attrs;
	clearTriggerAttrs(): Attrs;
	positionerAttrs(): Attrs;
	contentAttrs(): Attrs;
	listAttrs(): Attrs;
	emptyAttrs(): Attrs;
	itemAttrs(options: ComboboxItemOptions): Attrs;
	itemTextAttrs(options: ComboboxItemOptions): Attrs;
	itemIndicatorAttrs(options: ComboboxItemOptions): Attrs;
	itemGroupAttrs(options: { id: string }): Attrs;
	itemGroupLabelAttrs(options: { htmlFor: string }): Attrs;
	registerRoot(node: Element | null): void;
	registerInput(node: Element | null): void;
	registerControl(node: Element | null): void;
	registerContent(node: Element | null): void;
	registerTrigger(node: Element | null): void;
	setOpen(open: boolean, reason?: string): void;
	setValue(value: string[]): void;
	setInputValue(value: string, reason?: string): void;
	setHighlightedValue(value: string | null): void;
	clearHighlightedValue(): void;
	selectValue(value: string): void;
	clearValue(value?: string): void;
	focus(): void;
	setCurrentPlacement(placement: Placement): void;
}

const defaultTranslations: ComboboxTranslations = {
	triggerLabel: 'Toggle suggestions',
	clearTriggerLabel: 'Clear value',
	resultsCount: (count) => (count === 1 ? '1 result' : `${count} results`),
	noResults: 'No results',
	loading: 'Loading results'
};

const comboboxContext = createContext<ComboboxApi>('Combobox', 'Combobox');
const comboboxItemContext = createContext<() => ComboboxItemOptions>(
	'ComboboxItem',
	'Combobox.Item'
);
const comboboxItemGroupContext = createContext<{ id: string }>(
	'ComboboxItemGroup',
	'Combobox.ItemGroup'
);

export const setComboboxContext = (api: ComboboxApi): ComboboxApi => comboboxContext.set(api);
export const useComboboxContext = (): ComboboxApi => comboboxContext.get();
export const setComboboxItemContext = (
	options: () => ComboboxItemOptions
): (() => ComboboxItemOptions) => comboboxItemContext.set(options);
export const useComboboxItemContext = (): (() => ComboboxItemOptions) =>
	comboboxItemContext.get();
export const setComboboxItemGroupContext = (options: { id: string }): { id: string } =>
	comboboxItemGroupContext.set(options);
export const useComboboxItemGroupContext = (): { id: string } => comboboxItemGroupContext.get();

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	const result: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry !== undefined) result[key] = entry;
	}
	return result as T;
}

function toggleValue(values: string[], value: string): string[] {
	return values.includes(value) ? values.filter((entry) => entry !== value) : values.concat(value);
}

function getModifiers(event: {
	shiftKey: boolean;
	ctrlKey: boolean;
	altKey: boolean;
	metaKey: boolean;
}): ComboboxModifierKeys {
	return {
		shift: event.shiftKey,
		ctrl: event.ctrlKey,
		alt: event.altKey,
		meta: event.metaKey
	};
}

export function createCombobox(props: () => UseComboboxProps, uid: string): ComboboxApi {
	const field = useFieldContext();

	const prop = <K extends keyof UseComboboxProps>(key: K): UseComboboxProps[K] => props()[key];

	const disabled = () => Boolean(prop('disabled') ?? field?.disabled);
	const readOnly = () => Boolean(prop('readOnly') ?? field?.readOnly);
	const required = () => Boolean(prop('required') ?? field?.required);
	const invalid = () => Boolean(prop('invalid') ?? field?.invalid);
	const multiple = () => Boolean(prop('multiple'));
	const interactive = () => !disabled() && !readOnly();
	const loading = () => Boolean(prop('loading'));
	const loopFocus = () => prop('loopFocus') !== false;
	const composite = () => prop('composite') !== false;
	const allowCustomValue = () => Boolean(prop('allowCustomValue'));
	const alwaysSubmitOnEnter = () => Boolean(prop('alwaysSubmitOnEnter'));
	const closeOnSelect = () => prop('closeOnSelect') ?? !multiple();
	const openOnClick = () => Boolean(prop('openOnClick'));
	const openOnFocus = () => Boolean(prop('openOnFocus'));
	const openOnKeyPress = () => prop('openOnKeyPress') !== false;
	const closeOnEscape = () => prop('closeOnEscape') !== false;
	const closeOnInteractOutside = () => prop('closeOnInteractOutside') !== false;
	const inputBehavior = (): ComboboxInputBehavior => prop('inputBehavior') ?? 'none';
	const autoComplete = () => inputBehavior() === 'autocomplete' && !multiple();
	const autoHighlight = () => inputBehavior() === 'autohighlight';
	const selectionBehavior = (): ComboboxSelectionBehavior =>
		prop('selectionBehavior') ?? (multiple() ? 'clear' : 'replace');
	const translations = (): ComboboxTranslations => ({
		...defaultTranslations,
		...prop('translations')
	});
	const positioning = (): ComboboxPositioningOptions => ({
		placement: 'bottom',
		sameWidth: true,
		...prop('positioning')
	});
	const portalled = () => prop('portalled') !== false;
	const lazyMount = () => prop('lazyMount') !== false;
	const unmountOnExit = () => prop('unmountOnExit') !== false;

	const rootId = () => prop('ids')?.root ?? prop('id') ?? `combobox:${uid}`;
	const labelId = () => prop('ids')?.label ?? field?.ids.label ?? `${rootId()}:label`;
	const inputId = () => prop('ids')?.input ?? field?.ids.control ?? `${rootId()}:input`;
	const controlId = () => prop('ids')?.control ?? `${rootId()}:control`;
	const contentId = () => prop('ids')?.content ?? `${rootId()}:content`;
	const positionerId = () => prop('ids')?.positioner ?? `${rootId()}:popper`;
	const triggerId = () => prop('ids')?.trigger ?? `${rootId()}:toggle-btn`;
	const clearTriggerId = () => prop('ids')?.clearTrigger ?? `${rootId()}:clear-btn`;
	const itemId = (value: string) => prop('ids')?.item?.(value) ?? `${rootId()}:option:${value}`;
	const itemGroupId = (id: string) => prop('ids')?.itemGroup?.(id) ?? `${rootId()}:optgroup:${id}`;
	const itemGroupLabelId = (id: string) =>
		prop('ids')?.itemGroupLabel?.(id) ?? `${rootId()}:optgroup-label:${id}`;
	const hiddenInputId = (value: string) =>
		prop('ids')?.hiddenInput?.(value) ?? `${rootId()}:hidden-input:${value}`;

	const toValue = (item: ComboboxEntry) => prop('itemToValue')?.(item) ?? item.value;
	const toString = (item: ComboboxEntry) => prop('itemToString')?.(item) ?? item.label ?? item.value;
	const toDisabled = (item: ComboboxEntry) =>
		Boolean(prop('isItemDisabled')?.(item) ?? item.disabled);

	const collection = createCollection<ComboboxEntry>({
		items: () => prop('items') ?? [],
		itemToValue: toValue,
		itemToString: toString,
		isItemDisabled: toDisabled
	});

	const typeahead = createTypeahead({ getItems: () => collection.items });

	const initialValue = prop('value') ?? prop('defaultValue') ?? [];

	let internalValue = $state<string[]>(initialValue);
	let selectionCache = $state.raw<Record<string, ComboboxEntry>>({});
	let internalInputValue = $state<string>('');
	let internalHighlightedValue = $state<string | null>(prop('defaultHighlightedValue') ?? null);
	let phase = $state<Phase>(
		prop('open') ?? prop('defaultOpen')
			? 'open.interacting'
			: prop('autoFocus')
				? 'closed.focused'
				: 'closed.idle'
	);
	let currentPlacement = $state<Placement | undefined>(undefined);
	let modality = $state<'pointer' | 'keyboard'>('pointer');

	let rootNode = $state<Element | null>(null);
	let inputNode = $state<Element | null>(null);
	let controlNode = $state<Element | null>(null);
	let contentNode = $state<Element | null>(null);
	let triggerNode = $state<Element | null>(null);

	const value = () => prop('value') ?? internalValue;
	const inputValue = () => prop('inputValue') ?? internalInputValue;
	const highlightedValue = () => {
		const controlled = prop('highlightedValue');
		return controlled !== undefined ? controlled : internalHighlightedValue;
	};
	const isOpen = () =>
		prop('open') ?? (phase === 'open.interacting' || phase === 'open.suggesting');
	const focused = () => isOpen() || phase !== 'closed.idle';

	function cacheSelected(values: string[]) {
		const items = prop('items') ?? [];
		const next: Record<string, ComboboxEntry> = {};
		for (const entry of values) {
			const index = items.findIndex((item) => toValue(item) === entry);
			next[entry] = index === -1 ? (selectionCache[entry] ?? { value: entry }) : items[index];
		}
		selectionCache = next;
	}

	function resolveSelected(values: string[]): ComboboxEntry[] {
		const items = prop('items') ?? [];
		return values.map((entry) => {
			const item = items.find((candidate) => toValue(candidate) === entry);
			return item ?? selectionCache[entry] ?? { value: entry };
		});
	}

	function stringifyValues(values: string[]): string {
		return resolveSelected(values).map(toString).join(', ');
	}

	cacheSelected(initialValue);
	internalInputValue = resolveInitialInputValue();

	function resolveInitialInputValue(): string {
		const given = prop('inputValue') ?? prop('defaultInputValue') ?? '';
		if (given.trim() || multiple()) return given;
		const behavior = prop('selectionBehavior') ?? 'replace';
		if (behavior === 'preserve') return given;
		if (behavior === 'clear') return '';
		return stringifyValues(prop('value') ?? prop('defaultValue') ?? []);
	}

	const selectedItems = (): ComboboxEntry[] =>
		value().map((entry) => selectionCache[entry] ?? { value: entry });
	const valueAsString = () => selectedItems().map(toString).join(', ');
	const hasSelectedItems = () => value().length > 0;
	const isCustomValue = () => inputValue() !== valueAsString();

	const presence = createPresence({
		present: () => isOpen(),
		getNode: () => contentNode as HTMLElement | null,
		lazyMount,
		unmountOnExit
	});

	let valueSignature = value().join(',');
	let cacheSignature = '';

	$effect(() => {
		const next = value().join(',');
		if (next === valueSignature) return;
		valueSignature = next;
		cacheSelected(value());
		if (selectionBehavior() === 'preserve') return;
		applyInputValue(
			selectionBehavior() === 'replace' && value().length ? stringifyValues(value()) : '',
			'sync'
		);
	});

	$effect(() => {
		const signature = `${(prop('items') ?? []).length}:${collection.items
			.map((node) => `${node.value}|${node.label}`)
			.join(',')}`;
		if (signature !== cacheSignature) {
			cacheSignature = signature;
			cacheSelected(value());
		}

		const highlighted = highlightedValue();
		if (highlighted != null && collection.has(highlighted)) return;
		if (!isOpen()) {
			if (highlighted != null) setHighlighted(null);
			return;
		}
		if (autoHighlight() && collection.size > 0) {
			highlightFirstItem();
			return;
		}
		if (highlighted != null) setHighlighted(null);
	});

	$effect(() => {
		if (prop('open') === undefined) return;
		const wanted = Boolean(prop('open'));
		const openPhase = phase === 'open.interacting' || phase === 'open.suggesting';
		if (wanted === openPhase) return;
		phase = wanted ? 'open.interacting' : 'closed.idle';
	});

	$effect(() => {
		if (!prop('autoFocus')) return;
		focus();
	});

	$effect(() => {
		if (!isOpen()) return;
		const node = contentNode;
		const highlighted = highlightedValue();
		if (!node || highlighted == null) return;
		const target = node.ownerDocument.getElementById(itemId(highlighted));
		if (target && node.contains(target) && typeof target.scrollIntoView === 'function') {
			target.scrollIntoView({ block: 'nearest' });
		}
	});

	useEscapeLayer({
		enabled: () => isOpen() && closeOnEscape(),
		onEscape() {
			if (inputBehavior() === 'autocomplete') applyInputValue(valueAsString(), 'escape-key');
			close('escape-key');
		}
	});

	useDismissableLayer({
		enabled: () => isOpen() && closeOnInteractOutside() && !prop('disableLayer'),
		getNode: () => contentNode as HTMLElement | null,
		getExclude: () => [inputNode, triggerNode, controlNode],
		onPointerDownOutside: (event) => prop('onPointerDownOutside')?.(event),
		onFocusOutside: (event) => prop('onFocusOutside')?.(event),
		onInteractOutside: (event) => {
			prop('onInteractOutside')?.(event);
			if (event.defaultPrevented) return;
			const revert = isCustomValue() && !allowCustomValue();
			close('interact-outside', { restoreFocus: false });
			if (revert) revertInputValue();
		}
	});

	function notifyOpenChange(open: boolean, reason: string) {
		prop('onOpenChange')?.({ open, reason, value: value() });
	}

	function openWith(reason: string) {
		if (isOpen()) return;
		if (prop('open') === undefined) phase = 'open.interacting';
		notifyOpenChange(true, reason);
		focus();
	}

	function close(reason: string, options: { restoreFocus?: boolean } = {}) {
		if (!isOpen()) return;
		if (prop('open') === undefined) {
			phase = options.restoreFocus === false ? 'closed.idle' : 'closed.focused';
		}
		notifyOpenChange(false, reason);
		clearHighlight();
	}

	function applyInputValue(next: string, reason: string) {
		if (prop('inputValue') === undefined) internalInputValue = next;
		prop('onInputValueChange')?.({ inputValue: next, reason });
	}

	function commitValue(next: string[]) {
		cacheSelected(next);
		if (prop('value') === undefined) internalValue = next;
		prop('onValueChange')?.({ value: next, items: resolveSelected(next) });
	}

	function setHighlighted(next: string | null) {
		if (highlightedValue() === next) return;
		if (prop('highlightedValue') === undefined) internalHighlightedValue = next;
		prop('onHighlightChange')?.({
			highlightedValue: next,
			highlightedItem: next ? resolveSelected([next])[0] : undefined
		});
	}

	function highlightable() {
		return collection.items.filter((node) => !node.disabled);
	}

	function firstEnabledValue() {
		return highlightable()[0]?.value;
	}

	function lastEnabledValue() {
		const nodes = highlightable();
		return nodes[nodes.length - 1]?.value;
	}

	function highlightFirstItem() {
		const first = firstEnabledValue();
		if (first) setHighlighted(first);
	}

	function highlightLastItem() {
		const last = lastEnabledValue();
		if (last) setHighlighted(last);
	}

	function highlightNextItem() {
		const nodes = highlightable();
		if (!nodes.length) return;
		const index = nodes.findIndex((node) => node.value === highlightedValue());
		if (index === -1) {
			setHighlighted(nodes[0].value);
			return;
		}
		const next = nodes[index + 1] ?? (loopFocus() ? nodes[0] : undefined);
		if (next) setHighlighted(next.value);
	}

	function highlightPrevItem() {
		const nodes = highlightable();
		if (!nodes.length) return;
		const index = nodes.findIndex((node) => node.value === highlightedValue());
		if (index === -1) {
			setHighlighted(nodes[nodes.length - 1].value);
			return;
		}
		const next = nodes[index - 1] ?? (loopFocus() ? nodes[nodes.length - 1] : undefined);
		if (next) setHighlighted(next.value);
	}

	function highlightFirstOrSelectedItem() {
		if (hasSelectedItems()) {
			const entry = value()[0];
			if (entry && collection.has(entry)) {
				setHighlighted(entry);
				return;
			}
		}
		highlightFirstItem();
	}

	function highlightLastOrSelectedItem() {
		if (hasSelectedItems()) {
			const entry = value()[0];
			if (entry && collection.has(entry)) {
				setHighlighted(entry);
				return;
			}
		}
		highlightLastItem();
	}

	function selectionInput(next: string[]) {
		const behavior = selectionBehavior();
		if (behavior === 'preserve') return;
		applyInputValue(behavior === 'replace' ? stringifyValues(next) : '', 'item-select');
	}

	function selectItem(entry: string, modifiers: ComboboxModifierKeys) {
		const next = multiple() ? toggleValue(value(), entry) : [entry];
		prop('onSelect')?.({ value: next, itemValue: entry, modifiers });
		commitValue(next);
		selectionInput(next);
		if (closeOnSelect()) close('item-select');
	}

	function clearSelection(entry?: string) {
		if (entry == null) {
			commitValue([]);
			applyInputValue('', 'clear-trigger');
			focus();
			return;
		}
		const next = value().filter((candidate) => candidate !== entry);
		commitValue(next);
		selectionInput(next);
	}

	function revertInputValue() {
		const behavior = selectionBehavior();
		if (behavior === 'preserve') return;
		applyInputValue(
			behavior === 'replace' && hasSelectedItems() ? valueAsString() : '',
			'revert'
		);
	}

	function clearHighlight() {
		if (highlightedValue() == null) return;
		setHighlighted(null);
	}

	function openOnChangeResolved(next: string): boolean {
		const openOnChange = prop('openOnChange');
		if (typeof openOnChange === 'function') {
			return openOnChange({ inputValue: next, reason: 'input-change' });
		}
		return openOnChange !== false;
	}

	function handleInputChange(next: string) {
		if (!interactive()) return;
		const wasOpen = isOpen();
		applyInputValue(next, 'input-change');
		if (openOnChangeResolved(next)) {
			if (!wasOpen) openWith('input-change');
			phase = 'open.suggesting';
			if (autoComplete()) return;
			clearHighlight();
			if (autoHighlight()) highlightFirstItem();
			return;
		}
		if (!wasOpen) return;
		phase = 'open.suggesting';
		if (autoComplete()) return;
		clearHighlight();
	}

	function arrowDown(event: KeyboardEvent) {
		if (!openOnKeyPress() && !isOpen()) return;
		event.preventDefault();
		if (event.altKey) {
			openWith('arrow-key');
			return;
		}
		if (!isOpen()) {
			openWith('arrow-key');
			highlightFirstOrSelectedItem();
			return;
		}
		if (autoComplete() && highlightedValue() === lastEnabledValue()) {
			clearHighlight();
			return;
		}
		highlightNextItem();
	}

	function arrowUp(event: KeyboardEvent) {
		if (!openOnKeyPress() && !isOpen()) return;
		event.preventDefault();
		if (event.altKey) {
			close('arrow-key');
			return;
		}
		if (!isOpen()) {
			openWith('arrow-key');
			highlightLastOrSelectedItem();
			return;
		}
		if (autoComplete() && highlightedValue() === firstEnabledValue()) {
			clearHighlight();
			return;
		}
		highlightPrevItem();
	}

	function enter(event: KeyboardEvent) {
		const open = isOpen();
		const highlighted = highlightedValue();
		const rejected = isCustomValue() && !allowCustomValue();
		if (open && !alwaysSubmitOnEnter() && (highlighted != null || rejected)) {
			event.preventDefault();
		}
		if (!open) return;
		if (highlighted == null) {
			if (rejected) {
				revertInputValue();
				close('item-select', { restoreFocus: false });
			}
			return;
		}
		selectItem(highlighted, getModifiers(event));
	}

	function escape(event: KeyboardEvent) {
		event.preventDefault();
		if (isOpen()) return;
		if (isCustomValue() && !allowCustomValue()) revertInputValue();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.defaultPrevented || !interactive() || event.isComposing) return;
		if ((event.ctrlKey || event.shiftKey) && event.key !== 'Enter') return;
		modality = 'keyboard';

		const rtl = prop('dir') === 'rtl';
		const key =
			rtl && event.key === 'ArrowLeft'
				? 'ArrowRight'
				: rtl && event.key === 'ArrowRight'
					? 'ArrowLeft'
					: event.key;

		switch (key) {
			case 'ArrowDown':
				arrowDown(event);
				return;
			case 'ArrowUp':
				arrowUp(event);
				return;
			case 'Home':
				if (event.metaKey) return;
				if (isOpen()) {
					event.preventDefault();
					highlightFirstItem();
				}
				return;
			case 'End':
				if (event.metaKey) return;
				if (isOpen()) {
					event.preventDefault();
					highlightLastItem();
				}
				return;
			case 'Enter':
				enter(event);
				return;
			case 'Escape':
				escape(event);
				return;
			case 'Tab':
				leave('tab');
				return;
			default:
				break;
		}

		// Typing filters through `openOnChange`; when the consumer keeps the list static, typing
		// jumps the highlight instead.
		if (!isOpen() || !isPrintableKey(event) || key === ' ') return;
		if (openOnChangeResolved(inputValue())) return;
		const next = typeahead.onKey(event.key, highlightedValue() ?? undefined);
		if (next) setHighlighted(next);
	}

	function handleFocus() {
		if (disabled()) return;
		if (phase === 'closed.idle') phase = 'closed.focused';
		if (openOnFocus()) openWith('input-focus');
	}

	function leave(reason: string) {
		const revert = isCustomValue() && !allowCustomValue();
		close(reason);
		phase = 'closed.idle';
		if (revert) revertInputValue();
	}

	function handleBlur(event: FocusEvent) {
		if (disabled()) return;
		const related = event.relatedTarget as Node | null;
		if (related && rootNode?.contains(related)) return;
		if (related && contentNode?.contains(related)) return;
		if (phase === 'closed.idle' && !isOpen()) return;
		leave('blur');
	}

	function handleInputClick() {
		if (!openOnClick() || !interactive() || isOpen()) return;
		openWith('input-click');
		highlightFirstOrSelectedItem();
	}

	function handleTriggerClick() {
		if (!interactive()) return;
		if (isOpen()) {
			close('trigger-click');
			return;
		}
		openWith('trigger-click');
		highlightFirstOrSelectedItem();
	}

	function handleTriggerPointerDown(event: PointerEvent) {
		if (!interactive()) return;
		if (event.pointerType === 'touch') return;
		if (event.button !== 0) return;
		modality = 'pointer';
		event.preventDefault();
		queueMicrotask(() => focus());
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

	function itemState(options: ComboboxItemOptions): ComboboxItemState {
		const entryValue = toValue(options.item);
		return {
			value: entryValue,
			label: toString(options.item),
			disabled: Boolean(disabled() || toDisabled(options.item)),
			highlighted: highlightedValue() === entryValue,
			selected: value().includes(entryValue)
		};
	}

	return {
		get open() {
			return isOpen();
		},
		get focused() {
			return focused();
		},
		get loading() {
			return loading();
		},
		get multiple() {
			return multiple();
		},
		get disabled() {
			return disabled();
		},
		get readOnly() {
			return readOnly();
		},
		get invalid() {
			return invalid();
		},
		get required() {
			return required();
		},
		get inputValue() {
			return inputValue();
		},
		get value() {
			return value();
		},
		get valueAsString() {
			return valueAsString();
		},
		get hasSelectedItems() {
			return hasSelectedItems();
		},
		get selectedItems() {
			return selectedItems();
		},
		get highlightedValue() {
			return highlightedValue();
		},
		get highlightedItem() {
			const entry = highlightedValue();
			return entry ? resolveSelected([entry])[0] : undefined;
		},
		get isCustomValue() {
			return isCustomValue();
		},
		get empty() {
			return collection.size === 0;
		},
		get items() {
			return collection.items.map((node) => node.item);
		},
		get anchorNode() {
			return controlNode ?? triggerNode ?? inputNode;
		},
		get contentNode() {
			return contentNode;
		},
		get translations() {
			return translations();
		},
		get currentPlacement() {
			return currentPlacement;
		},
		get present() {
			return presence.present;
		},
		get portalled() {
			return portalled();
		},
		get portalTarget() {
			const reference = prop('portalRef');
			const resolved = typeof reference === 'function' ? reference() : reference;
			return resolved ?? null;
		},
		get positioning() {
			return positioning();
		},
		get rootId() {
			return rootId();
		},
		get labelId() {
			return labelId();
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
		get positionerId() {
			return positionerId();
		},
		get triggerId() {
			return triggerId();
		},
		get clearTriggerId() {
			return clearTriggerId();
		},
		itemId,
		itemGroupId,
		itemGroupLabelId,
		itemState,
		hiddenInputs() {
			const name = prop('name');
			if (!name || !multiple()) return [];
			return value().map((entry) => ({
				id: hiddenInputId(entry),
				name,
				form: prop('form'),
				value: entry
			}));
		},
		rootAttrs() {
			return dropUndefined({
				id: rootId(),
				dir: prop('dir') ?? undefined,
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly())
			});
		},
		labelAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: labelId(),
				for: inputId(),
				'data-readonly': dataAttr(readOnly()),
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-required': dataAttr(required()),
				onclick(event: MouseEvent) {
					if (composite()) return;
					event.preventDefault();
					(triggerNode as HTMLElement | null)?.focus({ preventScroll: true });
				}
			});
		},
		controlAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: controlId(),
				'data-state': isOpen() ? 'open' : 'closed',
				'data-focus': dataAttr(focused()),
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid())
			});
		},
		inputAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				'aria-invalid': invalid() || undefined,
				'data-invalid': dataAttr(invalid()),
				'data-autofocus': dataAttr(prop('autoFocus')),
				name: multiple() ? undefined : prop('name'),
				form: prop('form'),
				disabled: disabled(),
				required: required(),
				autocomplete: 'off',
				autocorrect: 'off',
				autocapitalize: 'none',
				spellcheck: 'false',
				readonly: readOnly(),
				placeholder: prop('placeholder'),
				id: inputId(),
				type: 'text',
				role: 'combobox',
				value: inputValue(),
				'aria-autocomplete': autoComplete() ? 'both' : 'list',
				'aria-controls': contentId(),
				'aria-expanded': isOpen(),
				'data-state': isOpen() ? 'open' : 'closed',
				'aria-activedescendant': highlightedValue()
					? itemId(highlightedValue() as string)
					: undefined,
				'aria-describedby': field?.ariaDescribedby,
				onclick: handleInputClick,
				onfocus: handleFocus,
				onblur: handleBlur,
				oninput(event: Event) {
					handleInputChange((event.currentTarget as HTMLInputElement).value);
				},
				onkeydown: handleKeyDown
			});
		},
		triggerAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: triggerId(),
				'aria-haspopup': composite() ? 'listbox' : 'dialog',
				type: 'button',
				tabindex: -1,
				'aria-label': translations().triggerLabel,
				'aria-expanded': isOpen(),
				'data-state': isOpen() ? 'open' : 'closed',
				'aria-controls': isOpen() ? contentId() : undefined,
				disabled: disabled(),
				'data-invalid': dataAttr(invalid()),
				'data-focusable': dataAttr(false),
				'data-readonly': dataAttr(readOnly()),
				'data-disabled': dataAttr(disabled()),
				onfocus() {
					if (!interactive()) return;
					if (phase === 'closed.idle') phase = 'closed.focused';
				},
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					handleTriggerClick();
				},
				onpointerdown: handleTriggerPointerDown,
				onkeydown(event: KeyboardEvent) {
					if (event.defaultPrevented || composite()) return;
					if (event.key === 'ArrowDown') arrowDown(event);
					else if (event.key === 'ArrowUp') arrowUp(event);
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
				'data-invalid': dataAttr(invalid()),
				'aria-label': translations().clearTriggerLabel,
				'aria-controls': inputId(),
				hidden: !value().length,
				onpointerdown(event: PointerEvent) {
					if (event.button !== 0) return;
					modality = 'pointer';
					event.preventDefault();
				},
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!interactive()) return;
					clearSelection();
				}
			});
		},
		positionerAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: positionerId(),
				style: floatingStyle({
					placement: currentPlacement,
					sameWidth: positioning().sameWidth,
					fitViewport: positioning().fitViewport,
					strategy: positioning().strategy
				})
			});
		},
		contentAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: contentId(),
				role: composite() ? 'listbox' : 'dialog',
				tabindex: -1,
				hidden: !isOpen(),
				'data-state': isOpen() ? 'open' : 'closed',
				'data-placement': currentPlacement,
				'data-side': currentPlacement?.split('-')[0],
				'aria-labelledby': labelId(),
				'aria-multiselectable': multiple() && composite() ? true : undefined,
				'aria-busy': composite() ? loading() || undefined : undefined,
				'data-empty': dataAttr(collection.size === 0),
				'data-loading': dataAttr(loading()),
				onpointerdown(event: PointerEvent) {
					if (event.button !== 0) return;
					modality = 'pointer';
					event.preventDefault();
				}
			});
		},
		listAttrs() {
			return dropUndefined({
				role: composite() ? undefined : 'listbox',
				'data-empty': dataAttr(collection.size === 0),
				'aria-labelledby': labelId(),
				'aria-multiselectable': multiple() && !composite() ? true : undefined,
				'aria-busy': !composite() ? loading() || undefined : undefined,
				'data-loading': dataAttr(loading())
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
				'data-highlighted': dataAttr(state.highlighted),
				'data-state': state.selected ? 'checked' : 'unchecked',
				'aria-selected': state.selected,
				'aria-disabled': state.disabled || undefined,
				'data-disabled': dataAttr(state.disabled),
				'data-value': state.value,
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
					modality = 'keyboard';
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
				'data-disabled': dataAttr(state.disabled),
				'data-highlighted': dataAttr(state.highlighted)
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
		registerRoot(node) {
			rootNode = node;
		},
		registerInput(node) {
			inputNode = node;
		},
		registerControl(node) {
			controlNode = node;
		},
		registerContent(node) {
			contentNode = node;
		},
		registerTrigger(node) {
			triggerNode = node;
		},
		setOpen(next, reason = 'script') {
			if (next) openWith(reason);
			else close(reason);
		},
		setValue(next) {
			commitValue(next);
			selectionInput(next);
		},
		setInputValue(next, reason = 'script') {
			applyInputValue(next, reason);
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
		clearValue(entry) {
			clearSelection(entry);
		},
		focus,
		setCurrentPlacement(placement) {
			currentPlacement = placement;
		}
	};
}
