import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import PaginationBasic from './harness/PaginationBasic.svelte';

const $ = <T extends Element = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;

describe('Pagination', () => {
	test('renders the Ark contract', () => {
		render(PaginationBasic, { props: { count: 100, page: 5, pageSize: 10 } });

		const root = $('[data-scope="pagination"][data-part="root"]')!;
		expect(root.tagName.toLowerCase()).toBe('nav');
		expect(root.getAttribute('aria-label')).toBe('pagination');
		expect(root.getAttribute('data-slot')).toBe('pagination-root');

		expect(document.querySelectorAll('[data-part="item"]')).toHaveLength(5);
		expect($('[data-part="item"][data-selected=""]')!.getAttribute('data-index')).toBe('5');
		expect($('[data-part="item"][data-selected=""]')!.getAttribute('aria-current')).toBe('page');
		expect($('[data-part="item"][data-selected=""]')!.getAttribute('aria-label')).toBe('page 5');

		const prev = $('[data-part="prev-trigger"]')!;
		expect(prev.getAttribute('type')).toBe('button');
		expect(prev.getAttribute('aria-label')).toBe('previous page');
		expect(prev.hasAttribute('disabled')).toBe(false);
		expect($('[data-part="first-trigger"]')!.getAttribute('aria-label')).toBe('first page');
		expect($('[data-part="next-trigger"]')!.getAttribute('aria-label')).toBe('next page');
		expect($('[data-part="last-trigger"]')!.getAttribute('aria-label')).toBe('last page');

		expect(document.querySelectorAll('[data-part="ellipsis"]')).toHaveLength(2);
		expect($('[data-part="ellipsis"]')!.getAttribute('aria-hidden')).toBe('true');
	});

	test('clicking a page reports the change and moves the selection', async () => {
		const onPageChange = vi.fn();
		render(PaginationBasic, { props: { count: 100, onPageChange, pageSize: 10 } });

		const items = document.querySelectorAll('[data-part="item"]');
		expect(items).toHaveLength(6);
		await fireEvent.click(items[1]);

		expect(onPageChange).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
		expect($('[data-part="item"][data-selected=""]')!.getAttribute('data-index')).toBe('2');
	});

	test('triggers respect the first and last page bounds', async () => {
		const onPageChange = vi.fn();
		render(PaginationBasic, { props: { count: 30, onPageChange, page: 1, pageSize: 10 } });

		expect($('[data-part="prev-trigger"]')!.hasAttribute('disabled')).toBe(true);
		expect($('[data-part="next-trigger"]')!.hasAttribute('disabled')).toBe(false);

		await fireEvent.click($('[data-part="next-trigger"]')!);
		expect(onPageChange).toHaveBeenLastCalledWith({ page: 2, pageSize: 10 });

		await fireEvent.click($('[data-part="last-trigger"]')!);
		expect(onPageChange).toHaveBeenLastCalledWith({ page: 3, pageSize: 10 });
		expect($('[data-part="next-trigger"]')!.hasAttribute('disabled')).toBe(true);

		await fireEvent.click($('[data-part="first-trigger"]')!);
		expect(onPageChange).toHaveBeenLastCalledWith({ page: 1, pageSize: 10 });
	});

	test('collapses a single skipped page into its number', () => {
		render(PaginationBasic, { props: { count: 60, page: 1, pageSize: 10 } });

		expect(document.querySelectorAll('[data-part="item"]')).toHaveLength(6);
		expect(document.querySelectorAll('[data-part="ellipsis"]')).toHaveLength(0);
	});
});
