import {
	createCollection,
	isPrintableKey,
	type CollectionItem,
	type CollectionNode
} from '../../internal/collection';
import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';

export type { CollectionItem };

export type ListboxSelectionMode = 'single' | 'multiple' | 'extended';

export interface ListboxElementIds {
	root?: string;
	content?: string;
	label?: string;
	item?: (id: string | number) => string;
	itemGroup?: (id: string | number) => string;
	itemGroupLabel?: (id: string | number) => string;
}

export interface ListboxValueChangeDetails<T extends CollectionItem = CollectionItem> {
	value: string[];
	items: T[];
}

export interface ListboxHighlightChangeDetails<T extends CollectionItem = CollectionItem> {
	highlightedValue: string | null;
	highlightedItem: T | null;
	highlightedIndex: number;
}

export interface ListboxSelectionDetails {
	value: string;
}

export interface ListboxScrollToIndexDetails {
	index: number;
	immediate?: boolean;
	getElement: () => HTMLElement | null;
}

export interface ListboxCollection<T extends CollectionItem = CollectionItem> {
	readonly items: T[];
	readonly size: number;
	readonly firstValue: string | undefined;
	readonly lastValue: string | undefined;
	find(value: string | null | undefined): T | undefined;
	findMany(values: string[]): T[];
	has(value: string | null | undefined): boolean;
	indexOf(value: string | null | undefined): number;
	getItemValue(item: T): string;
	getItemLabel(item: T): string;
	getItemDisabled(item: T): boolean;
	getNextValue(value: string, step?: number, loop?: boolean): string | undefined;
	getPreviousValue(value: string, step?: number, loop?: boolean): string | undefined;
	search(key: string, currentValue?: string | null): string | undefined;
	stringifyItem(item: T | null | undefined): string | undefined;
	stringifyItems(items: T[]): string;
}

export interface ListboxCollectionOptions<T extends CollectionItem = CollectionItem> {
	items: () => T[];
	itemToValue?: (item: T) => string;
	itemToString?: (item: T) => string;
	isItemDisabled?: (item: T) => boolean;
}

export type ListboxValue = string | string[];

export interface UseListboxProps<T extends CollectionItem = CollectionItem> {
	/** Item model, the substitute for Ark's `collection`. Ignored when `collection` is given. */
	items?: T[];
	collection?: ListboxCollection<T>;
	itemToValue?: (item: T) => string;
	itemToString?: (item: T) => string;
	isItemDisabled?: (item: T) => boolean;
	value?: ListboxValue;
	defaultValue?: ListboxValue;
	onValueChange?: (details: ListboxValueChangeDetails<T>) => void;
	highlightedValue?: string | null;
	defaultHighlightedValue?: string | null;
	onHighlightChange?: (details: ListboxHighlightChangeDetails<T>) => void;
	onSelect?: (details: ListboxSelectionDetails) => void;
	selectionMode?: ListboxSelectionMode;
	selectOnHighlight?: boolean;
	deselectable?: boolean;
	disallowSelectAll?: boolean;
	loopFocus?: boolean;
	typeahead?: boolean;
	disabled?: boolean;
	orientation?: 'horizontal' | 'vertical';
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: ListboxElementIds;
	scrollToIndexFn?: (details: ListboxScrollToIndexDetails) => void;
}

export interface ListboxItemState {
	value: string;
	label: string;
	disabled: boolean;
	selected: boolean;
	highlighted: boolean;
	focused: boolean;
	focusVisible: boolean;
}

export interface ListboxItemProps<T extends CollectionItem = CollectionItem> {
	item: T;
	highlightOnHover?: boolean;
}

export interface ListboxInputProps {
	autoHighlight?: boolean;
	keyboardPriority?: 'caret' | 'navigate';
}

export interface ListboxApi<T extends CollectionItem = CollectionItem> {
	readonly empty: boolean;
	readonly isEmpty: boolean;
	readonly value: string[];
	readonly valueAsString: string;
	readonly hasSelectedItems: boolean;
	readonly multiple: boolean;
	readonly disabled: boolean;
	readonly highlightedValue: string | null;
	readonly highlightedItem: T | null;
	readonly selectedItems: T[];
	readonly collection: ListboxCollection<T>;
	readonly contentId: string;
	selectValue(value: string): void;
	setValue(value: ListboxValue): void;
	selectAll(): void;
	clearValue(value?: string): void;
	highlightValue(value: string): void;
	highlightFirst(): void;
	highlightLast(): void;
	highlightNext(): void;
	highlightPrevious(): void;
	clearHighlightedValue(): void;
	getItemState(props: ListboxItemProps<T>): ListboxItemState;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	valueTextAttrs(): Record<string, unknown>;
	contentAttrs(): Record<string, unknown>;
	itemAttrs(props: ListboxItemProps<T>): Record<string, unknown>;
	itemTextAttrs(props: ListboxItemProps<T>): Record<string, unknown>;
	itemIndicatorAttrs(props: ListboxItemProps<T>): Record<string, unknown>;
	itemGroupAttrs(props: { id: string }): Record<string, unknown>;
	itemGroupLabelAttrs(props: { htmlFor: string }): Record<string, unknown>;
	inputAttrs(props?: ListboxInputProps): Record<string, unknown>;
	registerContent(node: HTMLElement | null): void;
	registerInput(node: HTMLElement | null): void;
	focusContent(): void;
	clearInput(): void;
}

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

function normalizeValue(value: ListboxValue | undefined): string[] {
	if (value === undefined) return [];
	if (Array.isArray(value)) return value;
	return value === '' ? [] : [value];
}

const TYPEAHEAD_TIMEOUT = 350;

// Zag accumulates typed keys in `keysSoFar` and collapses a repeated single character, so that
// "aa" cycles through the items starting with "a" instead of narrowing to a miss.
function createSearch<T extends CollectionItem>(getNodes: () => CollectionNode<T>[]) {
	let keysSoFar = $state('');
	let timer: ReturnType<typeof setTimeout> | undefined;

	function reset() {
		if (timer !== undefined) clearTimeout(timer);
		timer = undefined;
		keysSoFar = '';
	}

	function update(next: string) {
		if (timer !== undefined) clearTimeout(timer);
		keysSoFar = next;
		timer = setTimeout(() => reset(), TYPEAHEAD_TIMEOUT);
	}

	function match(text: string, currentValue: string | null | undefined): string | undefined {
		const nodes = getNodes();
		if (!nodes.length) return undefined;
		const currentIndex =
			currentValue != null ? nodes.findIndex((node) => node.value === currentValue) : -1;
		const singleKey = text.length === 1;
		const query = text.toLowerCase();
		for (let index = 0; index < nodes.length; index++) {
			const node = nodes[(currentIndex + index + 1) % nodes.length];
			if (!node) continue;
			if (singleKey && node.value === currentValue) continue;
			if (node.disabled) continue;
			if (node.label.toLowerCase().startsWith(query)) return node.value;
		}
		return undefined;
	}

	return {
		get keysSoFar() {
			return keysSoFar;
		},
		search(key: string, currentValue?: string | null): string | undefined {
			const combined = keysSoFar + key;
			const repeated =
				combined.length > 1 && Array.from(combined).every((char) => char === combined[0]);
			const value = match(repeated ? (combined[0] as string) : combined, currentValue);
			update(combined);
			return value;
		},
		clear: reset
	};
}

/** Builds the collection Ark expects from a plain item array. */
export function createListboxCollection<T extends CollectionItem = CollectionItem>(
	options: ListboxCollectionOptions<T>
): ListboxCollection<T> {
	const collection = createCollection(options);
	const toValue = options.itemToValue ?? ((item: T) => item.value);
	const toString = options.itemToString ?? ((item: T) => item.label ?? item.value);
	const toDisabled = options.isItemDisabled ?? ((item: T) => Boolean(item.disabled));
	const search = createSearch<T>(() => collection.items);

	const nodes = (): CollectionNode<T>[] => collection.items;

	function find(value: string | null | undefined): T | undefined {
		if (value == null) return undefined;
		return nodes().find((node) => node.value === value)?.item;
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
			return value == null ? false : nodes().some((node) => node.value === value);
		},
		indexOf(value) {
			return value == null ? -1 : nodes().findIndex((node) => node.value === value);
		},
		getItemValue: toValue,
		getItemLabel: toString,
		getItemDisabled: toDisabled,
		getNextValue: (value, amount = 1, loop = false) => step(value, Math.abs(amount), loop),
		getPreviousValue: (value, amount = 1, loop = false) => step(value, -Math.abs(amount), loop),
		search: (key, currentValue) => search.search(key, currentValue),
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

export type ListboxContextValue = ListboxApi;
export type ListboxItemContextValue = ListboxItemProps;
export type ListboxItemGroupContextValue = { id: string };

const listboxContext = createContext<ListboxContextValue>('Listbox', 'Listbox.Root');
const listboxItemContext = createContext<ListboxItemContextValue>('ListboxItem', 'Listbox.Item');
const listboxItemGroupContext = createContext<ListboxItemGroupContextValue>(
	'ListboxItemGroup',
	'Listbox.ItemGroup'
);

export const useListboxContext = () => listboxContext.get();
export const setListboxContext = (api: ListboxContextValue) => listboxContext.set(api);
export const useListboxItemContext = () => listboxItemContext.get();
export const setListboxItemContext = (value: ListboxItemContextValue) =>
	listboxItemContext.set(value);
export const useListboxItemGroupContext = () => listboxItemGroupContext.get();
export const setListboxItemGroupContext = (value: ListboxItemGroupContextValue) =>
	listboxItemGroupContext.set(value);

export function createListbox<T extends CollectionItem = CollectionItem>(
	getProps: () => UseListboxProps<T>,
	uid: string
): ListboxApi<T> {
	const fallback = createListboxCollection<T>({
		items: () => getProps().items ?? [],
		itemToValue: (item) => getProps().itemToValue?.(item) ?? item.value,
		itemToString: (item) => getProps().itemToString?.(item) ?? item.label ?? item.value,
		isItemDisabled: (item) => getProps().isItemDisabled?.(item) ?? Boolean(item.disabled)
	});

	const rootId = () => getProps().ids?.root ?? getProps().id ?? `listbox:${uid}`;
	const contentId = () => getProps().ids?.content ?? `listbox:${uid}:content`;
	const labelId = () => getProps().ids?.label ?? `listbox:${uid}:label`;
	const itemId = (value: string) =>
		getProps().ids?.item?.(value) ?? `listbox:${uid}:item:${value}`;
	const itemGroupId = (id: string) =>
		getProps().ids?.itemGroup?.(id) ?? `listbox:${uid}:item-group:${id}`;
	const itemGroupLabelId = (id: string) =>
		getProps().ids?.itemGroupLabel?.(id) ?? `listbox:${uid}:item-group-label:${id}`;

	const collection = (): ListboxCollection<T> => getProps().collection ?? fallback;
	const typeahead = createSearch<T>(() =>
		collection().items.map((item, index) => ({
			item,
			value: collection().getItemValue(item),
			label: collection().getItemLabel(item),
			disabled: collection().getItemDisabled(item),
			index
		}))
	);

	const dir = () => getProps().dir ?? undefined;
	const orientation = () => getProps().orientation ?? 'vertical';
	const selectionMode = () => getProps().selectionMode ?? 'single';
	const multiple = () => selectionMode() === 'multiple' || selectionMode() === 'extended';
	const deselectable = () => getProps().deselectable ?? false;
	const disabled = () => Boolean(getProps().disabled);
	const interactive = () => !disabled();
	const typeaheadEnabled = () => getProps().typeahead ?? true;
	const loopFocus = () => Boolean(getProps().loopFocus);

	let internalValue = $state<string[]>(normalizeValue(getProps().defaultValue));
	let internalHighlighted = $state<string | null>(getProps().defaultHighlightedValue ?? null);
	let contentFocused = $state(false);
	let contentNode: HTMLElement | null = null;
	let inputNode: HTMLInputElement | null = null;
	let anchorValue: string | null = null;
	let currentValue: string | null = null;

	const isValueControlled = () => getProps().value !== undefined;
	const values = () => (isValueControlled() ? normalizeValue(getProps().value) : internalValue);
	const isHighlightControlled = () => getProps().highlightedValue !== undefined;
	const highlightedValue = () =>
		isHighlightControlled() ? (getProps().highlightedValue ?? null) : internalHighlighted;

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
		getProps().scrollToIndexFn?.({
			index: target.indexOf(next),
			immediate: false,
			getElement: () => itemElement(next)
		});
	}

	function focusContent() {
		contentNode?.focus({ preventScroll: true });
	}

	function itemElement(value: string | null): HTMLElement | null {
		if (value == null) return null;
		const doc =
			contentNode?.ownerDocument ?? (typeof document === 'undefined' ? undefined : document);
		return (doc?.getElementById(itemId(value)) as HTMLElement | null) ?? null;
	}

	function invokeOnSelect(current: string[], next: string[]) {
		for (const value of next) {
			if (!current.includes(value)) getProps().onSelect?.({ value });
		}
	}

	function toggleSelection(value: string): string[] {
		const current = values();
		if (current.includes(value)) return current.filter((entry) => entry !== value);
		if (!collection().has(value)) return current;
		return selectionMode() === 'single' ? [value] : [...current, value];
	}

	function replaceSelection(value: string): string[] {
		if (!collection().has(value)) return values();
		return [value];
	}

	function selectFrom(current: string[], value: string, forceToggle = false): string[] {
		if (selectionMode() === 'single') {
			if (current.includes(value) && deselectable()) return toggleSelection(value);
			return replaceSelection(value);
		}
		if (selectionMode() === 'multiple' || forceToggle) return toggleSelection(value);
		return replaceSelection(value);
	}

	function rangeValues(from: string, to: string): string[] {
		const target = collection();
		const start = target.indexOf(from);
		const end = target.indexOf(to);
		if (start === -1 || end === -1) return [];
		const [low, high] = start <= end ? [start, end] : [end, start];
		const result: string[] = [];
		for (let index = low; index <= high; index++) {
			const item = target.items[index];
			if (item) result.push(target.getItemValue(item));
		}
		return result;
	}

	function extendSelection(anchor: string, target: string, rangeEnd: string | null): string[] {
		if (selectionMode() === 'single') return replaceSelection(target);
		const parent = collection();
		const next = new Set(values());
		const end = rangeEnd ?? Array.from(next).pop() ?? target;
		for (const value of rangeValues(anchor, end)) next.delete(value);
		for (const value of rangeValues(target, anchor)) {
			const item = parent.find(value);
			if (item && !parent.getItemDisabled(item)) next.add(value);
		}
		return Array.from(next);
	}

	function selectItem(value: string) {
		if (!collection().has(value)) return;
		const current = values();
		const next = selectFrom(current, value);
		invokeOnSelect(current, next);
		commit(next);
	}

	function selectHighlighted(
		value: string | null,
		options: { shiftKey?: boolean; metaKey?: boolean } = {}
	) {
		if (value == null || !collection().has(value)) return;
		const current = values();
		let next: string[];
		if (options.shiftKey && multiple() && anchorValue != null) {
			next = extendSelection(anchorValue, value, currentValue);
			currentValue = value;
		} else {
			next = selectFrom(current, value, options.metaKey);
			anchorValue = value;
			currentValue = value;
		}
		invokeOnSelect(current, next);
		commit(next);
	}

	function selectWithKeyboard(value: string, shiftKey: boolean) {
		if (shiftKey && multiple() && anchorValue != null) {
			const current = values();
			const next = extendSelection(anchorValue, value, currentValue);
			invokeOnSelect(current, next);
			commit(next);
			currentValue = value;
			return;
		}
		anchorValue = value;
		currentValue = value;
		if (getProps().selectOnHighlight) {
			const current = values();
			const next = replaceSelection(value);
			invokeOnSelect(current, next);
			commit(next);
		}
	}

	function onContentKeydown(event: KeyboardEvent) {
		if (!interactive()) return;
		const current = event.currentTarget as HTMLElement | null;
		const target = event.target as Node | null;
		if (current && target && !current.contains(target)) return;

		const parent = collection();
		const highlighted = highlightedValue();

		const navigate = (value: string | undefined, shiftKey = event.shiftKey) => {
			if (value == null) return;
			event.preventDefault();
			contentFocused = true;
			setHighlighted(value);
			selectWithKeyboard(value, shiftKey);
		};

		switch (event.key) {
			case 'ArrowUp': {
				const next = highlighted ? parent.getPreviousValue(highlighted) : undefined;
				navigate(next ?? (loopFocus() || !highlighted ? parent.lastValue : undefined));
				return;
			}
			case 'ArrowDown': {
				const next = highlighted ? parent.getNextValue(highlighted) : undefined;
				navigate(next ?? (loopFocus() || !highlighted ? parent.firstValue : undefined));
				return;
			}
			case 'ArrowLeft':
			case 'ArrowRight': {
				if (orientation() === 'vertical') return;
				const forward = event.key === 'ArrowRight';
				const next = highlighted
					? forward
						? parent.getNextValue(highlighted)
						: parent.getPreviousValue(highlighted)
					: undefined;
				navigate(
					next ?? (loopFocus() ? (forward ? parent.firstValue : parent.lastValue) : undefined)
				);
				return;
			}
			case 'Home':
				event.preventDefault();
				navigate(parent.firstValue);
				return;
			case 'End':
				event.preventDefault();
				navigate(parent.lastValue);
				return;
			case 'Enter':
				selectHighlighted(highlighted);
				return;
			case ' ':
				if (typeahead.keysSoFar !== '' && typeaheadEnabled()) {
					event.preventDefault();
					contentFocused = true;
					const next = typeahead.search(event.key, highlighted);
					if (next != null) setHighlighted(next);
					return;
				}
				selectHighlighted(highlighted);
				return;
			case 'Escape':
				if (deselectable() && values().length) {
					event.preventDefault();
					event.stopPropagation();
					commit([]);
				}
				return;
			case 'a':
				if (event.metaKey || event.ctrlKey) {
					if (multiple() && !getProps().disallowSelectAll) {
						event.preventDefault();
						commit(parent.items.map((item) => parent.getItemValue(item)));
					}
					return;
				}
				break;
			default:
				break;
		}

		if (target && target instanceof Element && isEditable(target)) return;
		if (typeaheadEnabled() && isPrintableKey(event)) {
			event.preventDefault();
			contentFocused = true;
			const next = typeahead.search(event.key, highlighted);
			if (next != null) setHighlighted(next);
		}
	}

	function getItemState(props: ListboxItemProps<T>): ListboxItemState {
		const parent = collection();
		const value = parent.getItemValue(props.item);
		const itemDisabled = Boolean(disabled() || parent.getItemDisabled(props.item));
		const highlighted = highlightedValue() === value;
		return {
			value,
			label: parent.getItemLabel(props.item),
			disabled: itemDisabled,
			selected: values().includes(value),
			highlighted,
			focused: highlighted && contentFocused,
			focusVisible: highlighted && contentFocused
		};
	}

	function inputAttrs(props: ListboxInputProps = {}) {
		const keyboardPriority = props.keyboardPriority ?? 'caret';
		return dropUndefined({
			dir: dir(),
			disabled: disabled() ? true : undefined,
			'data-disabled': dataAttr(disabled()),
			autocomplete: 'off',
			autocorrect: 'off',
			'aria-haspopup': 'listbox',
			'aria-controls': contentId(),
			'aria-autocomplete': 'list',
			'aria-activedescendant':
				highlightedValue() == null ? undefined : itemId(highlightedValue() as string),
			spellcheck: false,
			enterkeyhint: 'go',
			onfocus: () => {
				queueMicrotask(() => {
					contentFocused = true;
					if (props.autoHighlight) setHighlighted(collection().firstValue ?? null);
				});
			},
			onblur: () => {
				contentFocused = false;
			},
			oninput: (event: Event) => {
				if (!props.autoHighlight) return;
				const field = event.currentTarget as HTMLInputElement | null;
				if (!field || field.value.trim()) return;
				queueMicrotask(() => setHighlighted(null));
			},
			onkeydown: (event: KeyboardEvent) => {
				if (event.defaultPrevented) return;
				const forward = () => {
					event.preventDefault();
					contentNode?.dispatchEvent(new KeyboardEvent(event.type, event));
				};
				switch (event.key) {
					case 'ArrowLeft':
					case 'ArrowRight':
						if (orientation() === 'vertical') return;
						if (event.ctrlKey) return;
						if (keyboardPriority !== 'navigate') return;
						forward();
						return;
					case 'Home':
					case 'End':
						if (keyboardPriority !== 'navigate') return;
						if (highlightedValue() == null && event.shiftKey) return;
						forward();
						return;
					case 'ArrowDown':
					case 'ArrowUp':
						forward();
						return;
					case 'Enter':
						if (highlightedValue() != null) {
							event.preventDefault();
							selectHighlighted(highlightedValue());
						}
						return;
					default:
						return;
				}
			}
		});
	}

	return {
		get empty() {
			return values().length === 0;
		},
		get isEmpty() {
			return collection().size === 0;
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
		get contentId() {
			return contentId();
		},
		selectValue: selectItem,
		setValue(value) {
			commit(normalizeValue(value));
		},
		selectAll() {
			if (!multiple()) {
				throw new Error('[rta-ui] Cannot select all items in a single-select listbox');
			}
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
		highlightValue(value) {
			setHighlighted(value);
		},
		highlightFirst() {
			const first = collection().firstValue;
			if (first != null) setHighlighted(first);
		},
		highlightLast() {
			const last = collection().lastValue;
			if (last != null) setHighlighted(last);
		},
		highlightNext() {
			const current = highlightedValue();
			const next = current
				? collection().getNextValue(current)
				: loopFocus()
					? collection().firstValue
					: undefined;
			if (next != null) setHighlighted(next);
		},
		highlightPrevious() {
			const current = highlightedValue();
			const next = current
				? collection().getPreviousValue(current)
				: loopFocus()
					? collection().lastValue
					: undefined;
			if (next != null) setHighlighted(next);
		},
		clearHighlightedValue() {
			setHighlighted(null);
		},
		getItemState,
		rootAttrs: () =>
			dropUndefined({
				dir: dir(),
				id: rootId(),
				'data-orientation': orientation(),
				'data-disabled': dataAttr(disabled())
			}),
		labelAttrs: () =>
			dropUndefined({
				dir: dir(),
				id: labelId(),
				'data-disabled': dataAttr(disabled())
			}),
		valueTextAttrs: () =>
			dropUndefined({
				dir: dir(),
				'data-disabled': dataAttr(disabled())
			}),
		contentAttrs: () =>
			dropUndefined({
				dir: dir(),
				id: contentId(),
				role: 'listbox',
				'data-activedescendant':
					highlightedValue() == null ? undefined : itemId(highlightedValue() as string),
				'aria-activedescendant':
					highlightedValue() == null ? undefined : itemId(highlightedValue() as string),
				'data-orientation': orientation(),
				'aria-multiselectable': multiple() ? true : undefined,
				'aria-labelledby': labelId(),
				tabindex: 0,
				'data-layout': 'list',
				'data-empty': dataAttr(collection().size === 0),
				style: '--column-count: 1;',
				onfocus: () => {
					contentFocused = true;
					if (!values().length && highlightedValue() == null) {
						const first = collection().firstValue;
						if (first != null) setHighlighted(first);
					}
				},
				onblur: () => {
					contentFocused = false;
				},
				onkeydown: onContentKeydown
			}),
		itemAttrs: (props) => {
			const state = getItemState(props);
			return dropUndefined({
				id: itemId(state.value),
				role: 'option',
				dir: dir(),
				'data-value': state.value,
				'aria-selected': state.selected,
				'data-selected': dataAttr(state.selected),
				'data-layout': 'list',
				'data-state': state.selected ? 'checked' : 'unchecked',
				'data-orientation': orientation(),
				'data-highlighted': dataAttr(state.highlighted),
				'data-disabled': dataAttr(state.disabled),
				'aria-disabled': state.disabled ? true : undefined,
				onpointermove: (event: PointerEvent) => {
					if (!props.highlightOnHover) return;
					if (state.disabled || event.pointerType !== 'mouse') return;
					if (state.highlighted) return;
					setHighlighted(state.value);
				},
				onmousedown: (event: MouseEvent) => {
					event.preventDefault();
					focusContent();
				},
				onclick: (event: MouseEvent) => {
					if (event.defaultPrevented) return;
					if (state.disabled) return;
					setHighlighted(state.value);
					selectHighlighted(state.value, {
						shiftKey: event.shiftKey,
						metaKey: event.metaKey || event.ctrlKey
					});
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
				'data-orientation': orientation(),
				'data-empty': dataAttr(collection().size === 0),
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
		inputAttrs,
		registerContent(node) {
			contentNode = node;
		},
		registerInput(node) {
			inputNode = node as HTMLInputElement | null;
		},
		focusContent,
		clearInput() {
			if (!inputNode) return;
			inputNode.value = '';
			inputNode.dispatchEvent(new Event('input', { bubbles: true }));
			inputNode.focus({ preventScroll: true });
		}
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
