import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import SwapBasic from './harness/SwapBasic.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement;

describe('Swap', () => {
	test('renders the ark contract with the off indicator visible', () => {
		render(SwapBasic);

		const root = $('[data-scope="swap"][data-part="root"]');
		expect(root.tagName).toBe('SPAN');
		expect(root.getAttribute('data-swap')).toBe('off');
		expect(root.getAttribute('data-animation')).toBe('scale');
		expect(root.getAttribute('style')).toContain('display: inline-grid');

		const on = $('[data-part="indicator"][data-type="on"]');
		const off = $('[data-part="indicator"][data-type="off"]');
		expect(on.getAttribute('data-state')).toBe('closed');
		expect(on.hasAttribute('hidden')).toBe(true);
		expect(off.getAttribute('data-state')).toBe('open');
		expect(off.hasAttribute('hidden')).toBe(false);
	});

	test('swapping flips the indicators', () => {
		render(SwapBasic, { props: { swap: true } });

		expect($('[data-part="root"]').getAttribute('data-swap')).toBe('on');
		const on = $('[data-part="indicator"][data-type="on"]');
		const off = $('[data-part="indicator"][data-type="off"]');
		expect(on.getAttribute('data-state')).toBe('open');
		expect(on.hasAttribute('hidden')).toBe(false);
		expect(off.getAttribute('data-state')).toBe('closed');
		expect(off.hasAttribute('hidden')).toBe(true);
	});
});
