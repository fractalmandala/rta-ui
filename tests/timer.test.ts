import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import TimerBasic from './harness/TimerBasic.svelte';

const $ = <T extends Element = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;

describe('Timer', () => {
	test('renders the Ark contract', () => {
		render(TimerBasic, { props: { startMs: 3723000 } });

		const root = $('[data-scope="timer"][data-part="root"]')!;
		expect(root.getAttribute('data-slot')).toBe('timer-root');

		const area = $('[data-part="area"]')!;
		expect(area.getAttribute('role')).toBe('timer');
		expect(area.getAttribute('aria-atomic')).toBe('true');
		expect(area.getAttribute('aria-label')).toBe('0 days 01:02:03');

		const values = [...document.querySelectorAll('[data-part="item-value"]')].map(
			(node) => node.textContent
		);
		expect(values).toEqual(['01', '02', '03']);
		expect(document.querySelectorAll('[data-part="separator"]')).toHaveLength(2);
		expect($('[data-part="item"]')!.getAttribute('style')).toBe('--value: 1;');
	});

	test('action triggers toggle visibility by state', () => {
		render(TimerBasic, { props: {} });
		const view = (action: string) =>
			document.querySelector(`[data-part="action-trigger"][hidden]`)?.textContent ??
			document.querySelector(`[data-action="${action}"]`)?.textContent;

		const triggers = [...document.querySelectorAll('[data-part="action-trigger"]')];
		expect(triggers[0].hasAttribute('hidden')).toBe(false); // start
		expect(triggers[1].hasAttribute('hidden')).toBe(true); // pause
		expect(triggers[2].hasAttribute('hidden')).toBe(true); // resume
		expect(triggers[3].hasAttribute('hidden')).toBe(true); // reset is hidden while idle
		expect(view('start')).toBeDefined();
	});

	test('start ticks and pause stops', async () => {
		vi.useFakeTimers();
		const onTick = vi.fn();
		render(TimerBasic, { props: { startMs: 0 } });
		expect(onTick).not.toHaveBeenCalled();

		const triggers = [...document.querySelectorAll('[data-part="action-trigger"]')];
		await fireEvent.click(triggers[0]);
		expect(triggers[1].hasAttribute('hidden')).toBe(false);

		await vi.advanceTimersByTimeAsync(3000);
		expect(
			[...document.querySelectorAll('[data-part="item-value"]')].map((node) => node.textContent)
		).toEqual(['00', '00', '03']);

		await fireEvent.click(triggers[1]);
		expect($('[data-part="action-trigger"]:not([hidden])')).toBeTruthy();
		vi.useRealTimers();
	});
});
