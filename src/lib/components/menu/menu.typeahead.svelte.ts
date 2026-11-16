// Local typeahead: `internal/collection.ts`'s `createTypeahead` calls `$state` from a plain `.ts`
// module, so it throws `rune_outside_svelte` at runtime. That shared module is off-limits, so this
// family carries Zag's `getByTypeahead`/`getByText` algorithm itself: the accumulated key string
// resets after 350ms, an all-repeated string collapses to its first character, and the search list
// rotates from the active item so repeating a character cycles through its matches.

export interface MenuTypeaheadItem {
	value: string;
	label: string;
}

export interface MenuTypeaheadOptions {
	getItems: () => MenuTypeaheadItem[];
	enabled?: () => boolean;
	timeout?: number;
}

const collator = new Intl.Collator(undefined, { usage: 'search', sensitivity: 'base' });

const normalize = (value: string) => value.normalize('NFC').trim();

function matches(label: string, query: string): boolean {
	const text = normalize(query);
	return collator.compare(normalize(label).slice(0, text.length), text) === 0;
}

export function createMenuTypeahead(options: MenuTypeaheadOptions) {
	let keysSoFar = $state('');
	let timer: ReturnType<typeof setTimeout> | undefined;

	function reset() {
		keysSoFar = '';
		if (timer !== undefined) clearTimeout(timer);
		timer = undefined;
	}

	function schedule() {
		if (timer !== undefined) clearTimeout(timer);
		timer = setTimeout(() => {
			keysSoFar = '';
			timer = undefined;
		}, options.timeout ?? 350);
	}

	return {
		get search() {
			return keysSoFar;
		},
		clear: reset,
		onKey(key: string, current?: string): string | undefined {
			if (options.enabled?.() === false) return undefined;
			if (key.length !== 1) return undefined;
			const search = keysSoFar + key;
			const repeated = search.length > 1 && [...search].every((char) => char === search[0]);
			const query = repeated ? search[0] : search;
			keysSoFar = search;
			schedule();

			const items = options.getItems();
			const index = current ? items.findIndex((item) => item.value === current) : -1;
			let candidates = index === -1 ? items : [...items.slice(index), ...items.slice(0, index)];
			if (query.length === 1) candidates = candidates.filter((item) => item.value !== current);
			return candidates.find((item) => matches(item.label, query))?.value;
		}
	};
}
