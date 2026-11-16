// Collections and typeahead: the shared substrate for listbox, select, combobox, menu,
// navigation-menu, tree-view and command-palette. Mirrors @zag-js/collection's item model
// (`value`, `label`, `disabled`, `group`) and its typeahead search.

export interface CollectionItem {
	value: string;
	label?: string;
	disabled?: boolean;
	group?: string;
}

export interface CollectionOptions<T extends CollectionItem> {
	items: () => T[];
	itemToValue?: (item: T) => string;
	itemToString?: (item: T) => string;
	isItemDisabled?: (item: T) => boolean;
}

export interface CollectionNode<T> {
	item: T;
	value: string;
	label: string;
	disabled: boolean;
	index: number;
}

export function createCollection<T extends CollectionItem>(options: CollectionOptions<T>) {
	const toValue = options.itemToValue ?? ((item: T) => item.value);
	const toString = options.itemToString ?? ((item: T) => item.label ?? item.value);
	const toDisabled = options.isItemDisabled ?? ((item: T) => Boolean(item.disabled));

	const nodes = (): CollectionNode<T>[] =>
		options.items().map((item, index) => ({
			item,
			value: toValue(item),
			label: toString(item),
			disabled: toDisabled(item),
			index
		}));

	const enabled = () => nodes().filter((node) => !node.disabled);

	function valueOf(index: number): string | undefined {
		return nodes()[index]?.value;
	}

	function nodeOf(value: string): CollectionNode<T> | undefined {
		return nodes().find((node) => node.value === value);
	}

	function indexOf(value: string): number {
		return nodes().findIndex((node) => node.value === value);
	}

	function next(value: string, step = 1): string | undefined {
		const list = enabled();
		if (!list.length) return undefined;
		const current = list.findIndex((node) => node.value === value);
		const start = current === -1 ? (step > 0 ? -1 : 0) : current;
		return list[(start + step + list.length * 2) % list.length]?.value;
	}

	function first(): string | undefined {
		return enabled()[0]?.value;
	}

	function last(): string | undefined {
		const list = enabled();
		return list[list.length - 1]?.value;
	}

	return {
		get items() {
			return nodes();
		},
		get values() {
			return nodes().map((node) => node.value);
		},
		get size() {
			return nodes().length;
		},
		valueOf,
		nodeOf,
		indexOf,
		next,
		first,
		last,
		has(value: string) {
			return indexOf(value) !== -1;
		}
	};
}

export type CollectionApi<T extends CollectionItem> = ReturnType<typeof createCollection<T>>;

export interface TypeaheadOptions<T extends CollectionItem> {
	getItems: () => { value: string; label: string; disabled?: boolean }[];
	enabled?: () => boolean;
	timeout?: number;
}

// Zag's typeahead: printable characters build a search string that resets after `timeout`. A
// repeated single character cycles through the items that start with it.
export function createTypeahead<T extends { value: string; label: string; disabled?: boolean }>(
	options: TypeaheadOptions<T>
) {
	// Plain variable, not `$state`: this module is a `.ts`, and callers hold the highlighted value in
	// their own reactive state. `search` is exposed for tests and debugging only.
	let search = '';
	let timer: ReturnType<typeof setTimeout> | undefined;

	function clear() {
		search = '';
		if (timer !== undefined) clearTimeout(timer);
		timer = undefined;
	}

	function schedule() {
		if (timer !== undefined) clearTimeout(timer);
		timer = setTimeout(() => {
			search = '';
			timer = undefined;
		}, options.timeout ?? 350);
	}

	function match(query: string, current?: string): string | undefined {
		const items = options.getItems().filter((item) => !item.disabled);
		if (!items.length) return undefined;
		const lower = query.toLowerCase();
		const repeated = query.length > 1 && new Set(lower).size === 1;

		if (repeated) {
			const prefix = lower[0];
			const candidates = items.filter((item) => item.label.toLowerCase().startsWith(prefix));
			if (!candidates.length) return undefined;
			const index = candidates.findIndex((item) => item.value === current);
			return candidates[(index + 1) % candidates.length]?.value;
		}

		const found = items.find((item) => item.label.toLowerCase().startsWith(lower));
		return found?.value;
	}

	return {
		get search() {
			return search;
		},
		/** Feed a key press; returns the value to highlight, if any. */
		onKey(key: string, current?: string): string | undefined {
			if (options.enabled?.() === false) return undefined;
			if (key.length !== 1 || key === ' ') return undefined;
			// A repeated character keeps its own search string so `match` cycles through its matches.
			search += key;
			schedule();
			const result = match(search, current);
			if (result === undefined) {
				search = key;
				return match(key, current);
			}
			return result;
		},
		clear
	};
}

export const isPrintableKey = (event: KeyboardEvent): boolean =>
	event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey;
