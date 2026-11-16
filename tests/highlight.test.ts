import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { Highlight } from '../src/lib/components/highlight/index.js';
import { highlightWord } from '../src/lib/components/highlight/highlight.js';

describe('Highlight', () => {
	test('splits text into matched and unmatched chunks', () => {
		expect(highlightWord({ text: 'hello world', query: 'world' })).toEqual([
			{ text: 'hello ', match: false },
			{ text: 'world', match: true }
		]);
	});

	test('respects ignoreCase and exactMatch', () => {
		expect(highlightWord({ text: 'Hello World', query: 'hello', ignoreCase: true })[0].match).toBe(
			true
		);
		expect(highlightWord({ exactMatch: true, text: 'shelloworld', query: 'hello' })).toEqual([
			{ text: 'shelloworld', match: false }
		]);
	});

	test('highlights every query', () => {
		const chunks = highlightWord({ matchAll: true, query: ['a', 'c'], text: 'abcabc' });
		expect(chunks.filter((chunk) => chunk.match).map((chunk) => chunk.text)).toEqual([
			'a',
			'c',
			'a',
			'c'
		]);
	});

	test('requires matchAll for array queries', () => {
		expect(() => highlightWord({ matchAll: false, query: ['a'], text: 'abc' })).toThrow(
			'matchAll must be true when using multiple queries'
		);
	});

	test('renders marks for matches only', () => {
		render(Highlight, { props: { query: 'ell', text: 'hello world' } });

		const marks = Array.from(document.querySelectorAll('mark'));
		expect(marks).toHaveLength(1);
		expect(marks[0].textContent).toBe('ell');
		expect(marks[0].getAttribute('data-scope')).toBe('highlight');
		expect(marks[0].getAttribute('data-part')).toBe('root');
	});
});
