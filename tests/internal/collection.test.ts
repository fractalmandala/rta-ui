import { describe, expect, test, vi } from 'vitest';
import { createCollection, createTypeahead } from '../../src/lib/internal/collection';

const items = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'apricot', label: 'Apricot' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'cherry', label: 'Cherry', disabled: true },
	{ value: 'date', label: 'Date' }
];

describe('collection', () => {
	test('resolves values, labels and disabled items', () => {
		const collection = createCollection({ items: () => items });
		expect(collection.size).toBe(5);
		expect(collection.valueOf(1)).toBe('apricot');
		expect(collection.nodeOf('cherry')?.disabled).toBe(true);
		expect(collection.indexOf('date')).toBe(4);
		expect(collection.has('kiwi')).toBe(false);
	});

	test('next and last skip disabled items', () => {
		const collection = createCollection({ items: () => items });
		expect(collection.next('banana')).toBe('date');
		expect(collection.next('date')).toBe('apple');
		expect(collection.next('banana', -1)).toBe('apricot');
		expect(collection.first()).toBe('apple');
		expect(collection.last()).toBe('date');
	});

	test('a custom value accessor is respected', () => {
		const collection = createCollection({
			items: () => [{ value: 'x', label: 'Ex' }],
			itemToValue: (item) => item.label!.toLowerCase()
		});
		expect(collection.values).toEqual(['ex']);
	});
});

describe('typeahead', () => {
	test('a single character jumps to the first match', () => {
		vi.useFakeTimers();
		const typeahead = createTypeahead({ getItems: () => items });
		expect(typeahead.onKey('b')).toBe('banana');
		vi.useRealTimers();
	});

	test('keys accumulate into a prefix that can advance past the current item', () => {
		vi.useFakeTimers();
		const typeahead = createTypeahead({ getItems: () => items });
		expect(typeahead.onKey('a')).toBe('apple');
		// Zag scans from the item after the current one, so "ap" reaches apricot rather than apple.
		expect(typeahead.onKey('p', 'apple')).toBe('apricot');
		expect(typeahead.onKey('r', 'apricot')).toBe('apricot');
		vi.useRealTimers();
	});

	test('repeating one character cycles through its matches', () => {
		vi.useFakeTimers();
		const typeahead = createTypeahead({ getItems: () => items });
		expect(typeahead.onKey('a')).toBe('apple');
		expect(typeahead.onKey('a', 'apple')).toBe('apricot');
		expect(typeahead.onKey('a', 'apricot')).toBe('apple');
		vi.useRealTimers();
	});

	test('the search resets after the timeout', () => {
		vi.useFakeTimers();
		const typeahead = createTypeahead({ getItems: () => items, timeout: 100 });
		typeahead.onKey('b');
		vi.advanceTimersByTime(150);
		expect(typeahead.search).toBe('');
		vi.useRealTimers();
	});

	test('disabled items are never matched', () => {
		vi.useFakeTimers();
		const typeahead = createTypeahead({ getItems: () => items });
		expect(typeahead.onKey('c')).toBeUndefined();
		vi.useRealTimers();
	});
});
