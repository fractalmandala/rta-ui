import {
	createCollection,
	createTypeahead,
	isPrintableKey,
	type CollectionItem,
	type CollectionNode
} from '../../internal/collection';
import { a11yLabels } from '../../internal/a11yLabels';
import { createContext } from '../../internal/context';
import { dataAttr, visuallyHiddenStyle } from '../../internal/dom';
import {
	useDismissableLayer,
	useEscapeLayer,
	type InteractOutsideEvent
} from '../../internal/layers.svelte';
import { createPresence, type PresenceApi } from '../../internal/presence.svelte';
import {
	floatingStyle,
	getPlacement,
	getSide,
	type Placement,
	type PositionOptions
} from '../../internal/positioning.svelte';

export type { CollectionItem };

export interface SelectElementIds {
	root?: string;
	content?: string;
	control?: string;
	trigger?: string;
	clearTrigger?: string;
	label?: string;
	hiddenSelect?: string;
	positioner?: string;
	item?: (id: string | number) => string;
	itemGroup?: (id: string | number) => string;
	itemGroupLabel?: (id: string | number) => string;
}

export interface SelectValueChangeDetails<T extends CollectionItem = CollectionItem> {
	value: string[];
	items: T[];
}

export interface SelectHighlightChangeDetails<T extends CollectionItem = CollectionItem> {
	highlightedValue: string | null;
	highlightedItem: T | null;
	highlightedIndex: number;
}

export interface SelectOpenChangeDetails {
	open: boolean;
	value: string[];
}

export interface SelectSelectionDetails {
	value: string;
}

export interface SelectScrollToIndexDetails {
	index: number;
	immediate?: boolean;
	getElement: () => HTMLElement | null;
}

export interface SelectTranslations {
	clearTriggerLabel?: string;
}

export type SelectPositioningOptions = PositionOptions;

export interface SelectCollection<T extends CollectionItem = CollectionItem> {
	readonly items: T[];
	readonly size: number;
	readonly firstValue: string | undefined;
	readonly lastValue: string | undefined;
	find(value: string | null | undefined): T | undefined;
	findMany(values: string[]): T[];
	has(value: string | null | undefined): boolean;
	indexOf(value: string | null | undefined): number;
	sort(values: string[]): string[];
	getItemValue(item: T): string;
	getItemLabel(item: T): string;
	getItemDisabled(item: T): boolean;
	getNextValue(value: string, step?: number, loop?: boolean): string | undefined;
	getPreviousValue(value: string, step?: number, loop?: boolean): string | undefined;
	search(key: string, currentValue?: string | null): string | undefined;
	stringifyItem(item: T | null | undefined): string | undefined;
	stringifyItems(items: T[]): string;
}

export interface SelectCollectionOptions<T extends CollectionItem = CollectionItem> {
	items: () => T[];
	itemToValue?: (item: T) => string;
	itemToString?: (item: T) => string;
	isItemDisabled?: (item: T) => boolean;
}

export type SelectValue = string | string[];

export interface UseSelectProps<T extends CollectionItem = CollectionItem> {
	/** Item model, the substitute for Ark's `collection`. Ignored when `collection` is given. */
	items?: T[];
	collection?: SelectCollection<T>;
	itemToValue?: (item: T) => string;
	itemToString?: (item: T) => string;
	isItemDisabled?: (item: T) => boolean;
	value?: SelectValue;
	defaultValue?: SelectValue;
	onValueChange?: (details: SelectValueChangeDetails<T>) => void;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (details: SelectOpenChangeDetails) => void;
	highlightedValue?: string | null;
	defaultHighlightedValue?: string | null;
	onHighlightChange?: (details: SelectHighlightChangeDetails<T>) => void;
	onSelect?: (details: SelectSelectionDetails) => void;
	multiple?: boolean;
	closeOnSelect?: boolean;
	deselectable?: boolean;
	loopFocus?: boolean;
	composite?: boolean;
	disabled?: boolean;
	invalid?: boolean;
	readOnly?: boolean;
	required?: boolean;
	name?: string;
	form?: string;
	autoComplete?: string;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: SelectElementIds;
	positioning?: SelectPositioningOptions;
	translations?: SelectTranslations;
	closeOnEscape?: boolean;
	closeOnInteractOutside?: boolean;
	onFocusOutside?: (event: InteractOutsideEvent) => void;
	onPointerDownOutside?: (event: InteractOutsideEvent) => void;
	onInteractOutside?: (event: InteractOutsideEvent) => void;
	scrollToIndexFn?: (details: SelectScrollToIndexDetails) => void;
	portalled?: boolean;
	portalRef?: Element | string | null;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
}

export interface SelectItemState {
	value: string;
	label: string;
	disabled: boolean;
	selected: boolean;
	highlighted: boolean;
}

export interface SelectItemProps<T extends CollectionItem = CollectionItem> {
	item: T;
	persistFocus?: boolean;
}

export interface SelectApi<T extends CollectionItem = CollectionItem> {
	readonly open: boolean;
	readonly focused: boolean;
	readonly empty: boolean;
	readonly value: string[];
	readonly valueAsString: string;
	readonly hasSelectedItems: boolean;
	readonly multiple: boolean;
	readonly disabled: boolean;
	readonly highlightedValue: string | null;
	readonly highlightedItem: T | null;
	readonly selectedItems: T[];
	readonly collection: SelectCollection<T>;
	readonly currentPlacement: Placement | undefined;
	readonly currentSide: string | undefined;
	readonly presence: PresenceApi;
	readonly portalled: boolean;
	readonly portalTarget: Element | string | null;
	readonly clearTriggerLabel: string;
	readonly rootId: string;
	readonly contentId: string;
	readonly controlId: string;
	readonly triggerId: string;
	readonly clearTriggerId: string;
	readonly labelId: string;
	readonly hiddenSelectId: string;
	readonly positionerId: string;
	itemId(value: string): string;
	setOpen(open: boolean): void;
	selectValue(value: string): void;
	setValue(value: SelectValue): void;
	selectAll(): void;
	clearValue(value?: string): void;
	setHighlightValue(value: string): void;
	clearHighlightValue(): void;
	getItemState(props: SelectItemProps<T>): SelectItemState;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	triggerAttrs(): Record<string, unknown>;
	valueTextAttrs(): Record<string, unknown>;
	indicatorAttrs(): Record<string, unknown>;
	positionerAttrs(): Record<string, unknown>;
	contentAttrs(): Record<string, unknown>;
	listAttrs(): Record<string, unknown>;
	itemAttrs(props: SelectItemProps<T>): Record<string, unknown>;
	itemTextAttrs(props: SelectItemProps<T>): Record<string, unknown>;
	itemIndicatorAttrs(props: SelectItemProps<T>): Record<string, unknown>;
	itemGroupAttrs(props: { id: string }): Record<string, unknown>;
	itemGroupLabelAttrs(props: { htmlFor: string }): Record<string, unknown>;
	clearTriggerAttrs(): Record<string, unknown>;
	hiddenSelectAttrs(): Record<string, unknown>;
	registerTrigger(node: HTMLElement | null): void;
	registerContent(node: HTMLElement | null): void;
	registerPositioner(node: HTMLElement | null): void;
	registerClearTrigger(node: HTMLElement | null): void;
	registerHiddenSelect(node: HTMLSelectElement | null): void;
	focusTrigger(): void;
}

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

function normalizeValue(value: SelectValue | undefined): string[] {
	if (value === undefined) return [];
	if (Array.isArray(value)) return value;
	return value === '' ? [] : [value];
}

/** Builds the collection Ark expects from a plain item array. */
export function createSelectCollection<T extends CollectionItem = CollectionItem>(
	options: SelectCollectionOptions<T>
): SelectCollection<T> {
	const collection = createCollection(options);
	const toValue = options.itemToValue ?? ((item: T) => item.value);
	const toString = options.itemToString ?? ((item: T) => item.label ?? item.value);
	const toDisabled = options.isItemDisabled ?? ((item: T) => Boolean(item.disabled));
	const search = createTypeahead({
		getItems: () =>
			collection.items.map((node) => ({ value: node.value, label: node.label, disabled: node.disabled }))
	});

	const nodes = (): CollectionNode<T>[] => collection.items;

	function find(value: string | null | undefined): T | undefined {
		if (value == null) return undefined;
		return nodes().find((node) => node.value === value)?.item;
	}

	function indexOf(value: string | null | undefined): number {
		return value == null ? -1 : nodes().findIndex((node) => node.value === value);
	}

	function step(value: string, delta: number, loop = false): string | undefined {
		const list = nodes();
		let index = list.findIndex((node) => node.value === value);
		if (index === -1) return undefined;
		index = loop ? Math.min(Math.max(index + delta, 0), list.length - 1) : index + delta;
		while (index >= 0 && index < list.length && list[index]?.disabled) index += delta > 0 ? 1 : -1;
		return list[index]?.value;
	}

	return {
		get items() {
			return options.items();
		},
		get size() {
			return collection.size;
		},
		get firstValue() {
			return collection.first();
		},
		get lastValue() {
			return collection.last();
		},
		find,
		findMany(values) {
			return values.map(find).filter((item): item is T => item !== undefined);
		},
		has(value) {
			return indexOf(value) !== -1;
		},
		indexOf,
		sort(values) {
			return [...values].sort((a, b) => indexOf(a) - indexOf(b));
		},
		getItemValue: toValue,
		getItemLabel: toString,
		getItemDisabled: toDisabled,
		getNextValue: (value, amount = 1, loop = false) => step(value, Math.abs(amount), loop),
		getPreviousValue: (value, amount = 1, loop = false) => step(value, -Math.abs(amount), loop),
		search: (key: string, currentValue?: string | null) => search.onKey(key, currentValue),
		stringifyItem(item) {
			return item == null ? undefined : toString(item);
		},
		stringifyItems(items) {
			return items
				.map((item) => toString(item))
				.filter((label) => label != null)
				.join(', ');
		}
	};
}

export type SelectContextValue = SelectApi;
export type SelectItemContextValue = SelectItemProps;
export type SelectItemGroupContextValue = { id: string };

const selectContext = createContext<SelectContextValue>('Select', 'Select.Root');
const selectItemContext = createContext<SelectItemContextValue>('SelectItem', 'Select.Item');
const selectItemGroupContext = createContext<SelectItemGroupContextValue>(
	'SelectItemGroup',
	'Select.ItemGroup'
);

export const useSelectContext = () => selectContext.get();
export const setSelectContext = (api: SelectContextValue) => selectContext.set(api);
export const useSelectItemContext = () => selectItemContext.get();
export const setSelectItemContext = (value: SelectItemContextValue) => selectItemContext.set(value);
export const useSelectItemGroupContext = () => selectItemGroupContext.get();
export const setSelectItemGroupContext = (value: SelectItemGroupContextValue) =>
	selectItemGroupContext.set(value);

export function createSelect<T extends CollectionItem = CollectionItem>(
	getProps: () => UseSelectProps<T>,
	uid: string
): SelectApi<T> {
	const fallback = createSelectCollection<T>({
		items: () => getProps().items ?? [],
		itemToValue: (item) => getProps().itemToValue?.(item) ?? item.value,
		itemToString: (item) => getProps().itemToString?.(item) ?? item.label ?? item.value,
		isItemDisabled: (item) => getProps().isItemDisabled?.(item) ?? Boolean(item.disabled)
	});

	const rootId = () => getProps().ids?.root ?? getProps().id ?? `select:${uid}`;
	const contentId = () => getProps().ids?.content ?? `select:${uid}:content`;
	const controlId = () => getProps().ids?.control ?? `select:${uid}:control`;
	const triggerId = () => getProps().ids?.trigger ?? `select:${uid}:trigger`;
	const clearTriggerId = () => getProps().ids?.clearTrigger ?? `select:${uid}:clear-trigger`;
	const labelId = () => getProps().ids?.label ?? `select:${uid}:label`;
	const hiddenSelectId = () => getProps().ids?.hiddenSelect ?? `select:${uid}:select`;
	const positionerId = () => getProps().ids?.positioner ?? `select:${uid}:positioner`;
	const itemId = (value: string) =>
		getProps().ids?.item?.(value) ?? `select:${uid}:option:${value}`;
	const itemGroupId = (id: string) =>
		getProps().ids?.itemGroup?.(id) ?? `select:${uid}:optgroup:${id}`;
	const itemGroupLabelId = (id: string) =>
		getProps().ids?.itemGroupLabel?.(id) ?? `select:${uid}:optgroup-label:${id}`;

	const collection = (): SelectCollection<T> => getProps().collection ?? fallback;
	const typeahead = createTypeahead({
		getItems: () =>
			collection().items.map((item) => ({
				value: collection().getItemValue(item),
				label: collection().getItemLabel(item),
				disabled: collection().getItemDisabled(item)
			}))
	});

	const dir = () => getProps().dir ?? undefined;
	const disabled = () => Boolean(getProps().disabled);
	const readOnly = () => Boolean(getProps().readOnly);
	const invalid = () => Boolean(getProps().invalid);
	const required = () => Boolean(getProps().required);
	const multiple = () => Boolean(getProps().multiple);
	const composite = () => getProps().composite ?? true;
	const deselectable = () => Boolean(getProps().deselectable);
	const loopFocus = () => Boolean(getProps().loopFocus);
	const closeOnSelect = () => getProps().closeOnSelect ?? !multiple();
	const interactive = () => !disabled() && !readOnly();
	const positioning = (): SelectPositioningOptions => ({
		placement: 'bottom-start',
		gutter: 8,
		...getProps().positioning
	});

	let internalValue = $state<string[]>(normalizeValue(getProps().defaultValue));
	let internalOpen = $state<boolean>(
		getProps().open ?? getProps().defaultOpen ?? false
	);
	let internalHighlighted = $state<string | null>(getProps().defaultHighlightedValue ?? null);
	let placement = $state<Placement>(positioning().placement ?? 'bottom-start');
	let triggerFocused = $state(false);
	let triggerNode = $state<HTMLElement | null>(null);
	let contentNode = $state<HTMLElement | null>(null);
	let positionerNode = $state<HTMLElement | null>(null);
	let clearTriggerNode = $state<HTMLElement | null>(null);
	let hiddenSelectNode = $state<HTMLSelectElement | null>(null);

	const isValueControlled = () => getProps().value !== undefined;
	const values = () => (isValueControlled() ? normalizeValue(getProps().value) : internalValue);
	const isOpenControlled = () => getProps().open !== undefined;
	const open = () => (isOpenControlled() ? Boolean(getProps().open) : internalOpen);
	const isHighlightControlled = () => getProps().highlightedValue !== undefined;
	const highlightedValue = () =>
		isHighlightControlled() ? (getProps().highlightedValue ?? null) : internalHighlighted;

	const clearTriggerLabel = () =>
		getProps().translations?.clearTriggerLabel ?? a11yLabels.clearSelection;

	const presence = createPresence({
		present: () => open(),
		getNode: () => contentNode,
		lazyMount: () => getProps().lazyMount ?? true,
		unmountOnExit: () => getProps().unmountOnExit ?? true,
		skip: () => false
	});

	function commit(next: string[]) {
		const current = values();
		if (current.length === next.length && current.every((value, index) => value === next[index])) {
			return;
		}
		if (!isValueControlled()) internalValue = next;
		getProps().onValueChange?.({ value: next, items: collection().findMany(next) });
	}

	function setHighlighted(next: string | null) {
		if (highlightedValue() === next) return;
		if (!isHighlightControlled()) internalHighlighted = next;
		const target = collection();
		getProps().onHighlightChange?.({
			highlightedValue: next,
			highlightedItem: target.find(next) ?? null,
			highlightedIndex: target.indexOf(next)
		});
	}

	function invokeOpenChange(next: boolean) {
		getProps().onOpenChange?.({ open: next, value: values() });
	}

	function setOpenValue(next: boolean) {
		if (open() === next) return;
		if (!isOpenControlled()) internalOpen = next;
		invokeOpenChange(next);
	}

	function focusTrigger() {
		triggerNode?.focus({ preventScroll: true });
	}

	function focusContent() {
		const node = contentNode;
		if (!node) {
			requestAnimationFrame(() => contentNode?.focus({ preventScroll: true }));
			return;
		}
		node.focus({ preventScroll: true });
	}

	function highlightComputedFirst() {
		const target = collection();
		const current = values();
		const next = current.length ? target.sort(current)[0] : target.firstValue;
		setHighlighted(next ?? null);
	}

	// Zag's `highlightComputedLastItem` also reads the first of the sorted selection.
	function highlightComputedLast() {
		const target = collection();
		const current = values();
		const next = current.length ? target.sort(current)[0] : target.lastValue;
		setHighlighted(next ?? null);
	}

	function highlightFirstSelected() {
		const current = values();
		if (!current.length) return;
		const next = collection().sort(current)[0];
		if (next != null) setHighlighted(next);
	}

	function openWith(highlight: 'none' | 'first' | 'last' | 'selection') {
		if (!interactive()) return;
		setOpenValue(true);
		if (!open()) return;
		focusContent();
		if (highlight === 'first') highlightComputedFirst();
		else if (highlight === 'last') highlightComputedLast();
		else if (highlight === 'selection') highlightFirstSelected();
	}

	function closeWithFocus() {
		if (!open()) return;
		setOpenValue(false);
		if (open()) return;
		setHighlighted(null);
		focusTrigger();
	}

	function selectValue(value: string) {
		if (!collection().has(value)) return;
		getProps().onSelect?.({ value });
		const current = values();
		let next: string[];
		if (deselectable() && !multiple() && current.includes(value)) next = [];
		else if (multiple()) {
			next = current.includes(value)
				? current.filter((entry) => entry !== value)
				: [...current, value];
		} else next = [value];
		commit(next);
	}

	function selectHighlightedItem(value?: string | null) {
		const target = value ?? highlightedValue();
		if (target == null || !collection().has(target)) return;
		selectValue(target);
	}

	function onItemClick(value: string) {
		selectHighlightedItem(value);
		if (closeOnSelect()) closeWithFocus();
	}

	function onContentKeydown(event: KeyboardEvent) {
		if (!interactive()) return;
		const current = event.currentTarget as HTMLElement | null;
		const target = event.target as Node | null;
		if (current && target && !current.contains(target)) return;
		if (!open()) return;

		if (event.key === 'Tab' && (event.ctrlKey || event.metaKey || event.altKey)) {
			event.preventDefault();
			return;
		}

		const parent = collection();
		const highlighted = highlightedValue();

		switch (event.key) {
			case 'ArrowDown': {
				event.preventDefault();
				if (highlighted == null) {
					setHighlighted(parent.firstValue ?? null);
					return;
				}
				if (loopFocus() && highlighted === parent.lastValue) {
					setHighlighted(parent.firstValue ?? null);
					return;
				}
				const next = parent.getNextValue(highlighted);
				if (next != null) setHighlighted(next);
				return;
			}
			case 'ArrowUp': {
				event.preventDefault();
				if (highlighted == null) {
					setHighlighted(parent.lastValue ?? null);
					return;
				}
				if (loopFocus() && highlighted === parent.firstValue) {
					setHighlighted(parent.lastValue ?? null);
					return;
				}
				const next = parent.getPreviousValue(highlighted);
				if (next != null) setHighlighted(next);
				return;
			}
			case 'Home':
				event.preventDefault();
				setHighlighted(parent.firstValue ?? null);
				return;
			case 'End':
				event.preventDefault();
				setHighlighted(parent.lastValue ?? null);
				return;
			case 'Enter':
				event.preventDefault();
				onItemClick(highlighted as string);
				return;
			case ' ':
				event.preventDefault();
				if (typeahead.typing) {
					const next = typeahead.onKey(event.key, highlighted);
					if (next != null) setHighlighted(next);
					return;
				}
				onItemClick(highlighted as string);
				return;
			default:
				break;
		}

		if (target && target instanceof Element && isEditable(target)) return;
		if (isPrintableKey(event)) {
			event.preventDefault();
			const next = typeahead.onKey(event.key, highlighted);
			if (next != null) setHighlighted(next);
		}
	}

	function onTriggerKeydown(event: KeyboardEvent) {
		if (event.defaultPrevented) return;
		if (!interactive()) return;

		const parent = collection();
		const selectPreviousItem = () => {
			const [first] = values();
			const next = first ? parent.getPreviousValue(first) : undefined;
			if (next) commit([next]);
		};
		const selectNextItem = () => {
			const [first] = values();
			const next = first ? parent.getNextValue(first) : undefined;
			if (next) commit([next]);
		};
		const selectFirstItem = () => {
			if (parent.firstValue) commit([parent.firstValue]);
		};
		const selectLastItem = () => {
			if (parent.lastValue) commit([parent.lastValue]);
		};

		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				if (!open()) openWith('last');
				return;
			case 'ArrowDown':
				event.preventDefault();
				if (!open()) openWith(event.altKey ? 'none' : 'first');
				return;
			case 'ArrowLeft':
				event.preventDefault();
				if (multiple()) return;
				if (values().length) selectPreviousItem();
				else selectLastItem();
				return;
			case 'ArrowRight':
				event.preventDefault();
				if (multiple()) return;
				if (values().length) selectNextItem();
				else selectFirstItem();
				return;
			case 'Home':
				event.preventDefault();
				if (multiple()) return;
				selectFirstItem();
				return;
			case 'End':
				event.preventDefault();
				if (multiple()) return;
				selectLastItem();
				return;
			case 'Enter':
				event.preventDefault();
				if (!open()) openWith('first');
				return;
			case ' ':
				event.preventDefault();
				if (open()) return;
				if (typeahead.typing) {
					const next = typeahead.onKey(event.key, values()[0]);
					if (next != null) commit([next]);
					return;
				}
				openWith('first');
				return;
			default:
				break;
		}

		if (event.key === 'Escape') return;
		if (isPrintableKey(event)) {
			event.preventDefault();
			const multipleSelection = multiple();
			const next = typeahead.onKey(event.key, multipleSelection ? null : values()[0]);
			if (next != null && !multipleSelection) commit([next]);
		}
	}

	function getItemState(props: SelectItemProps<T>): SelectItemState {
		const parent = collection();
		const value = parent.getItemValue(props.item);
		return {
			value,
			label: parent.getItemLabel(props.item),
			disabled: Boolean(disabled() || parent.getItemDisabled(props.item)),
			selected: values().includes(value),
			highlighted: highlightedValue() === value
		};
	}

	function itemElement(value: string | null): HTMLElement | null {
		if (value == null) return null;
		const doc =
			contentNode?.ownerDocument ?? (typeof document === 'undefined' ? undefined : document);
		return (doc?.getElementById(itemId(value)) as HTMLElement | null) ?? null;
	}

	$effect(() => {
		if (!open()) return;
		const trigger = triggerNode;
		const floating = positionerNode;
		if (!trigger || !floating) return;
		const options = positioning();
		return getPlacement(trigger, floating, {
			...options,
			onComplete(result) {
				placement = result.placement;
				options.onComplete?.(result);
			}
		});
	});

	$effect(() => {
		const node = hiddenSelectNode;
		const current = values();
		if (!node) return;
		if (current.length === 0 && !multiple()) {
			node.selectedIndex = -1;
			return;
		}
		for (const option of Array.from(node.options)) {
			option.selected = current.includes(option.value);
		}
	});

	$effect(() => {
		if (!open()) return;
		const highlighted = highlightedValue();
		if (highlighted == null) return;
		getProps().scrollToIndexFn?.({
			index: collection().indexOf(highlighted),
			immediate: false,
			getElement: () => itemElement(highlighted)
		});
	});

	useEscapeLayer({
		enabled: () => open() && (getProps().closeOnEscape ?? true),
		onEscape: () => closeWithFocus()
	});

	useDismissableLayer({
		enabled: () => open() && (getProps().closeOnInteractOutside ?? true),
		getNode: () => contentNode,
		getExclude: () => [triggerNode, clearTriggerNode],
		onFocusOutside: (event) => getProps().onFocusOutside?.(event),
		onPointerDownOutside: (event) => getProps().onPointerDownOutside?.(event),
		onInteractOutside: (event) => {
			getProps().onInteractOutside?.(event);
			dismissOutside(event);
		}
	});

	function dismissOutside(event: InteractOutsideEvent) {
		if (event.defaultPrevented) return;
		if (!open()) return;
		setOpenValue(false);
		setHighlighted(null);
		if (isOutsideFocusable(event)) return;
		focusTrigger();
	}

	// Zag keeps focus where the user put it when the dismissing target can hold focus itself.
	function isOutsideFocusable(event: InteractOutsideEvent): boolean {
		const target = event.detail?.originalEvent?.target;
		if (!(target instanceof HTMLElement)) return false;
		if (target.isContentEditable) return true;
		if (['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return true;
		return target.tabIndex >= 0;
	}

	return {
		get open() {
			return open();
		},
		get focused() {
			return triggerFocused && !open();
		},
		get empty() {
			return values().length === 0;
		},
		get value() {
			return values();
		},
		get valueAsString() {
			return collection().stringifyItems(collection().findMany(values()));
		},
		get hasSelectedItems() {
			return values().length > 0;
		},
		get multiple() {
			return multiple();
		},
		get disabled() {
			return disabled();
		},
		get highlightedValue() {
			return highlightedValue();
		},
		get highlightedItem() {
			return collection().find(highlightedValue()) ?? null;
		},
		get selectedItems() {
			return collection().findMany(values());
		},
		get collection() {
			return collection();
		},
		get currentPlacement() {
			return placement;
		},
		get currentSide() {
			return placement ? getSide(placement) : undefined;
		},
		get presence() {
			return presence;
		},
		get portalled() {
			return getProps().portalled ?? true;
		},
		get portalTarget() {
			return getProps().portalRef ?? null;
		},
		get clearTriggerLabel() {
			return clearTriggerLabel();
		},
		get rootId() {
			return rootId();
		},
		get contentId() {
			return contentId();
		},
		get controlId() {
			return controlId();
		},
		get triggerId() {
			return triggerId();
		},
		get clearTriggerId() {
			return clearTriggerId();
		},
		get labelId() {
			return labelId();
		},
		get hiddenSelectId() {
			return hiddenSelectId();
		},
		get positionerId() {
			return positionerId();
		},
		itemId,
		setOpen(next) {
			if (next) openWith('none');
			else closeWithFocus();
		},
		selectValue,
		setValue(value) {
			commit(normalizeValue(value));
		},
		selectAll() {
			const parent = collection();
			commit(parent.items.map((item) => parent.getItemValue(item)));
		},
		clearValue(value) {
			if (value == null) {
				commit([]);
				return;
			}
			commit(values().filter((entry) => entry !== value));
		},
		setHighlightValue(value) {
			setHighlighted(value);
		},
		clearHighlightValue() {
			setHighlighted(null);
		},
		getItemState,
		rootAttrs: () =>
			dropUndefined({
				dir: dir(),
				id: rootId(),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly())
			}),
		labelAttrs: () =>
			dropUndefined({
				dir: dir(),
				id: labelId(),
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly()),
				'data-required': dataAttr(required()),
				for: hiddenSelectId(),
				onclick: (event: MouseEvent) => {
					if (event.defaultPrevented) return;
					if (disabled()) return;
					focusTrigger();
				}
			}),
		controlAttrs: () =>
			dropUndefined({
				dir: dir(),
				id: controlId(),
				'data-state': open() ? 'open' : 'closed',
				'data-focus': dataAttr(triggerFocused && !open()),
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid())
			}),
		triggerAttrs: () =>
			dropUndefined({
				id: triggerId(),
				disabled: disabled() ? true : undefined,
				dir: dir(),
				type: 'button',
				role: 'combobox',
				'aria-controls': contentId(),
				'aria-expanded': open() ? 'true' : 'false',
				'aria-haspopup': 'listbox',
				'data-state': open() ? 'open' : 'closed',
				'aria-invalid': invalid() ? true : undefined,
				'aria-required': required() ? true : undefined,
				'aria-labelledby': labelId(),
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly()),
				'data-placement': placement,
				'data-side': placement ? getSide(placement) : undefined,
				'data-placeholder-shown': dataAttr(!values().length),
				onclick: (event: MouseEvent) => {
					if (!interactive()) return;
					if (event.defaultPrevented) return;
					if (open()) closeWithFocus();
					else openWith('selection');
				},
				onfocus: () => {
					triggerFocused = true;
				},
				onblur: () => {
					triggerFocused = false;
				},
				onkeydown: (event: KeyboardEvent) => {
					onTriggerKeydown(event);
				}
			}),
		valueTextAttrs: () =>
			dropUndefined({
				dir: dir(),
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-focus': dataAttr(triggerFocused && !open())
			}),
		indicatorAttrs: () =>
			dropUndefined({
				dir: dir(),
				'aria-hidden': true,
				'data-state': open() ? 'open' : 'closed',
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly())
			}),
		positionerAttrs: () =>
			dropUndefined({
				dir: dir(),
				id: positionerId(),
				style: floatingStyle({
					placement: placement,
					sameWidth: positioning().sameWidth,
					fitViewport: positioning().fitViewport,
					strategy: positioning().strategy,
					applyStyles: positioning().applyStyles
				})
			}),
		contentAttrs: () =>
			dropUndefined({
				hidden: !open(),
				dir: dir(),
				id: contentId(),
				role: composite() ? 'listbox' : 'dialog',
				'data-state': presence.dataState,
				'data-placement': placement,
				'data-side': placement ? getSide(placement) : undefined,
				'data-activedescendant':
					highlightedValue() == null ? undefined : itemId(highlightedValue() as string),
				'aria-activedescendant':
					composite() && highlightedValue() != null
						? itemId(highlightedValue() as string)
						: undefined,
				'aria-multiselectable': multiple() && composite() ? true : undefined,
				'aria-labelledby': labelId(),
				tabindex: 0,
				onkeydown: onContentKeydown
			}),
		listAttrs: () =>
			dropUndefined({
				tabindex: 0,
				role: composite() ? undefined : 'listbox',
				'aria-labelledby': triggerId(),
				'aria-activedescendant':
					!composite() && highlightedValue() != null
						? itemId(highlightedValue() as string)
						: undefined,
				'aria-multiselectable': !composite() && multiple() ? true : undefined
			}),
		itemAttrs: (props) => {
			const state = getItemState(props);
			return dropUndefined({
				id: itemId(state.value),
				role: 'option',
				dir: dir(),
				'data-value': state.value,
				'aria-selected': state.selected,
				'data-state': state.selected ? 'checked' : 'unchecked',
				'data-highlighted': dataAttr(state.highlighted),
				'data-disabled': dataAttr(state.disabled),
				'aria-disabled': state.disabled ? true : undefined,
				onpointermove: (event: PointerEvent) => {
					if (state.disabled || event.pointerType !== 'mouse') return;
					if (state.highlighted) return;
					setHighlighted(state.value);
				},
				onpointerleave: (event: PointerEvent) => {
					if (state.disabled) return;
					if (props.persistFocus) return;
					if (event.pointerType !== 'mouse') return;
					setHighlighted(null);
				},
				onclick: (event: MouseEvent) => {
					if (event.defaultPrevented) return;
					if (state.disabled) return;
					onItemClick(state.value);
				}
			});
		},
		itemTextAttrs: (props) => {
			const state = getItemState(props);
			return dropUndefined({
				'data-state': state.selected ? 'checked' : 'unchecked',
				'data-disabled': dataAttr(state.disabled),
				'data-highlighted': dataAttr(state.highlighted)
			});
		},
		itemIndicatorAttrs: (props) => {
			const state = getItemState(props);
			return dropUndefined({
				'aria-hidden': true,
				'data-state': state.selected ? 'checked' : 'unchecked',
				hidden: !state.selected
			});
		},
		itemGroupAttrs: ({ id }) =>
			dropUndefined({
				'data-disabled': dataAttr(disabled()),
				id: itemGroupId(id),
				'aria-labelledby': itemGroupLabelId(id),
				role: 'group',
				dir: dir()
			}),
		itemGroupLabelAttrs: ({ htmlFor }) =>
			dropUndefined({
				id: itemGroupLabelId(htmlFor),
				dir: dir(),
				role: 'presentation'
			}),
		clearTriggerAttrs: () =>
			dropUndefined({
				id: clearTriggerId(),
				type: 'button',
				'aria-label': clearTriggerLabel(),
				'data-invalid': dataAttr(invalid()),
				disabled: disabled() ? true : undefined,
				hidden: !values().length,
				dir: dir(),
				onclick: (event: MouseEvent) => {
					if (event.defaultPrevented) return;
					commit([]);
					focusTrigger();
				}
			}),
		hiddenSelectAttrs: () =>
			dropUndefined({
				name: getProps().name,
				form: getProps().form,
				disabled: disabled() ? true : undefined,
				multiple: multiple() ? true : undefined,
				required: required() ? true : undefined,
				'aria-hidden': true,
				id: hiddenSelectId(),
				style: visuallyHiddenStyle,
				tabindex: -1,
				autocomplete: getProps().autoComplete,
				'aria-labelledby': labelId(),
				onfocus: () => {
					focusTrigger();
				}
			}),
		registerTrigger(node) {
			triggerNode = node;
		},
		registerContent(node) {
			contentNode = node;
		},
		registerPositioner(node) {
			positionerNode = node;
		},
		registerClearTrigger(node) {
			clearTriggerNode = node;
		},
		registerHiddenSelect(node) {
			hiddenSelectNode = node;
		},
		focusTrigger
	};
}

function isEditable(element: Element): boolean {
	const tag = element.tagName.toLowerCase();
	if (element.getAttribute('contenteditable') === 'true') return true;
	if (tag === 'input') {
		const type = (element as HTMLInputElement).type;
		return !['button', 'checkbox', 'radio', 'submit', 'reset', 'file', 'image'].includes(type);
	}
	return tag === 'textarea' || tag === 'select';
}
