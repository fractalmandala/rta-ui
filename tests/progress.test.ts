import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import ProgressBasic from './harness/ProgressBasic.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement;

describe('Progress', () => {
	test('renders the ark contract', () => {
		render(ProgressBasic, { props: { value: 40 } });

		const root = $('[data-scope="progress"][data-part="root"]');
		expect(root.getAttribute('data-state')).toBe('loading');
		expect(root.getAttribute('data-value')).toBe('40');
		expect(root.getAttribute('data-max')).toBe('100');
		expect(root.getAttribute('data-orientation')).toBe('horizontal');
		expect(root.getAttribute('style')).toContain('--percent: 40');

		const track = $('[data-part="track"]');
		expect(track.getAttribute('role')).toBe('progressbar');
		expect(track.getAttribute('aria-valuemin')).toBe('0');
		expect(track.getAttribute('aria-valuemax')).toBe('100');
		expect(track.getAttribute('aria-valuenow')).toBe('40');
		expect(track.getAttribute('aria-label')).toBe('40%');
		expect(track.getAttribute('data-state')).toBe('loading');

		const range = $('[data-part="range"]');
		expect(range.getAttribute('style')).toContain('width: 40%');
		expect(range.getAttribute('data-state')).toBe('loading');

		expect($('[data-part="label"]').id).toBe(`${root.id}:label`);
		expect($('[data-part="value-text"]').getAttribute('aria-live')).toBe('polite');
		expect($('[data-part="value-text"]').textContent).toBe('40%');
	});

	test('indeterminate progress omits the numeric value', () => {
		render(ProgressBasic, { props: { value: null } });

		expect($('[data-part="root"]').getAttribute('data-state')).toBe('indeterminate');
		expect($('[data-part="root"]').hasAttribute('data-value')).toBe(false);
		expect($('[data-part="track"]').hasAttribute('aria-valuenow')).toBe(false);
		expect($('[data-part="track"]').getAttribute('aria-label')).toBe('loading...');
		expect($('[data-part="value-text"]').textContent).toContain('');
	});

	test('completing reports the complete state', () => {
		render(ProgressBasic, { props: { value: 100 } });

		expect($('[data-part="root"]').getAttribute('data-state')).toBe('complete');
		expect($('[data-part="range"]').getAttribute('style')).toContain('width: 100%');
	});

	test('vertical progress fills by height', () => {
		render(ProgressBasic, { props: { value: 25 } });

		expect($('[data-part="root"]').getAttribute('data-orientation')).toBe('horizontal');
	});

	test('circular progress renders the ring geometry', () => {
		render(ProgressBasic, { props: { value: 60 } });

		const circle = $('[data-part="circle"]');
		expect(circle.tagName.toLowerCase()).toBe('svg');
		expect(circle.getAttribute('role')).toBe('progressbar');
		expect(circle.getAttribute('aria-valuenow')).toBe('60');

		const track = $('[data-part="circle-track"]');
		expect(track.getAttribute('style')).toContain('fill: transparent');
		expect(track.getAttribute('style')).toContain('r: var(--radius)');
		expect(track.getAttribute('style')).toContain('stroke-width: var(--thickness)');

		const range = $('[data-part="circle-range"]');
		expect(range.getAttribute('style')).toContain('stroke-dasharray: var(--circumference)');
		expect(range.getAttribute('style')).toContain('--percent: 60');
		expect(range.getAttribute('data-state')).toBe('loading');
	});
});
