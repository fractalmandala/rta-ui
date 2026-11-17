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

export interface TypeaheadItem {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface TypeaheadOptions {
	getItems: () => TypeaheadItem[];
	/** Defaults to enabled; families pass their `typeahead` prop here. */
	enabled?: () => boolean;
	/** How long the accumulated keys stay meaningful, in milliseconds. */
	timeout?: number;
}

export interface TypeaheadApi {
	/** The keys typed inside the current window, exposed for tests and debugging. */
	readonly search: string;
	/** Whether a search string is currently buffered. */
	readonly typing: boolean;
	/** Feed one printable key; returns the value to highlight, if any. */
	onKey(key: string, current?: string | null): string | undefined;
	clear(): void;
}

// Zag's `match`: a plain case-insensitive prefix test, deliberately not collation-aware.
const matches = (label: string, query: string) => label.toLowerCase().startsWith(query.toLowerCase());

/**
 * Zag's typeahead, shared by every collection family. Printable keys accumulate into a search string
 * that resets after `timeout`; the scan starts just past the current item and wraps, so a repeated
 * character cycles through its matches instead of sticking; disabled items are skipped.
 */
export function createTypeahead(options: TypeaheadOptions): TypeaheadApi {
	// A plain variable, not `$state`: this is a `.ts` module, and callers keep the highlighted value
	// in their own reactive state.
	let search = '';
	let timer: ReturnType<typeof setTimeout> | undefined;

	const clear = () => {
		search = '';
		if (timer !== undefined) clearTimeout(timer);
		timer = undefined;
	};

	const schedule = () => {
		if (timer !== undefined) clearTimeout(timer);
		timer = setTimeout(clear, options.timeout ?? 350);
	};

	function match(query: string, current?: string | null): string | undefined {
		const items = options.getItems();
		if (!items.length) return undefined;

		const currentIndex = current == null ? -1 : items.findIndex((item) => item.value === current);
		const singleKey = query.length === 1;

		for (let offset = 0; offset < items.length; offset += 1) {
			const item = items[(currentIndex + offset + 1) % items.length];
			if (!item) continue;
			if (singleKey && item.value === current) continue;
			if (item.disabled) continue;
			if (matches(item.label, query)) return item.value;
		}
		return undefined;
	}

	return {
		get search() {
			return search;
		},
		get typing() {
			return search.length > 0;
		},
		onKey(key, current) {
			if (options.enabled?.() === false) return undefined;
			if (key.length !== 1 || key === ' ') return undefined;

			search += key;
			schedule();

			// One character repeated collapses to that character, which is what makes "aa" cycle.
			const repeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
			const query = repeated ? (search[0] as string) : search;
			const result = match(query, current);
			if (result !== undefined) return result;

			search = key;
			return match(key, current);
		},
		clear
	};
}

export const isPrintableKey = (event: KeyboardEvent): boolean =>
	event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey;
