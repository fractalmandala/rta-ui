import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import RatingGroupBasic from './harness/RatingGroupBasic.svelte';

const $ = <T extends Element = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;

describe('RatingGroup', () => {
	test('renders the Ark contract', () => {
		render(RatingGroupBasic);

		expect($('[data-scope="rating-group"][data-part="root"]')!.getAttribute('data-size')).toBe(
			'md'
		);
		expect($('[data-part="root"]')!.getAttribute('data-slot')).toBe('rating-group-root');

		const control = $('[data-part="control"]')!;
		expect(control.getAttribute('role')).toBe('radiogroup');
		expect(control.getAttribute('aria-orientation')).toBe('horizontal');
		expect(control.getAttribute('aria-labelledby')).toBe($('[data-part="label"]')!.id);

		const items = document.querySelectorAll('[data-part="item"]');
		expect(items).toHaveLength(5);
		expect(items[0].getAttribute('role')).toBe('radio');
		expect(items[0].getAttribute('aria-posinset')).toBe('1');
		expect(items[4].getAttribute('aria-setsize')).toBe('5');
		expect(items[0].getAttribute('aria-label')).toBe('1 stars');
		expect(items[0].getAttribute('tabindex')).toBe('0');
		expect(items[1].getAttribute('tabindex')).toBe('-1');

		const input = $<HTMLInputElement>('[data-part="hidden-input"]')!;
		expect(input.type).toBe('text');
		expect(input.hidden).toBe(true);
		expect(input.name).toBe('rating');
	});

	test('clicking an item sets the value and highlights up to it', async () => {
		const onValueChange = vi.fn();
		render(RatingGroupBasic, { props: { onValueChange } });

		const items = document.querySelectorAll('[data-part="item"]');
		await fireEvent.click(items[2]);

		expect(onValueChange).toHaveBeenCalledWith({ value: 3 });
		expect($('[data-part="item"][data-checked=""]')!.getAttribute('aria-posinset')).toBe('3');
		expect(document.querySelectorAll('[data-part="item"][data-highlighted=""]')).toHaveLength(3);
	});

	test('half ratings round up for data-half markers', async () => {
		render(RatingGroupBasic, { props: { allowHalf: true, value: 2.5 } });

		const items = document.querySelectorAll('[data-part="item"]');
		expect(items[1].getAttribute('data-half')).toBeNull();
		expect(items[2].getAttribute('data-half')).toBe('');
		expect(items[2].getAttribute('data-checked')).toBe('');
		expect(document.querySelectorAll('[data-part="item"][data-highlighted=""]')).toHaveLength(3);
	});

	test('a read-only group blocks changes', async () => {
		const onValueChange = vi.fn();
		render(RatingGroupBasic, { props: { onValueChange, readOnly: true, value: 2 } });

		expect($('[data-part="control"]')!.getAttribute('aria-readonly')).toBe('true');
		expect($('[data-part="item"]')!.getAttribute('data-readonly')).toBe('');

		await fireEvent.click(document.querySelectorAll('[data-part="item"]')[4]);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	test('arrow keys step the value and Home/End jump', async () => {
		const onValueChange = vi.fn();
		render(RatingGroupBasic, { props: { onValueChange, value: 2 } });

		const items = document.querySelectorAll('[data-part="item"]');
		await fireEvent.keyDown(items[1], { key: 'ArrowRight' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 3 });

		await fireEvent.keyDown(items[1], { key: 'End' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 5 });

		await fireEvent.keyDown(items[1], { key: 'Home' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 1 });
	});
});
