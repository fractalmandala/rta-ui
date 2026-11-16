import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, test } from 'vitest';
import Phase3Fieldset from './harness/Phase3Fieldset.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;

describe('Fieldset', () => {
	test('renders the Ark contract', () => {
		render(Phase3Fieldset, { props: {} });

		const root = $('[data-scope="fieldset"][data-part="root"]')!;
		expect(root.tagName).toBe('FIELDSET');
		expect(root.getAttribute('data-slot')).toBe('fieldset-root');
		expect(root.getAttribute('aria-labelledby')).toBe('fieldset::set::legend');

		const legend = $('[data-part="legend"]')!;
		expect(legend.id).toBe('fieldset::set::legend');
		expect(legend.getAttribute('data-slot')).toBe('fieldset-legend');
	});

	test('disables the native fieldset and cascades to a nested field', () => {
		render(Phase3Fieldset, { props: { disabled: true } });

		const root = $('[data-part="root"]') as HTMLFieldSetElement;
		expect(root.disabled).toBe(true);
		expect(root.getAttribute('data-disabled')).toBe('');

		const field = $('[data-scope="field"][data-part="root"]')!;
		expect(field.getAttribute('data-disabled')).toBe('');
	});

	test('renders error text with aria-live only when invalid', () => {
		const { unmount } = render(Phase3Fieldset, { props: { invalid: false } });
		expect($('[data-part="error-text"]')).toBeNull();
		unmount();

		render(Phase3Fieldset, { props: { invalid: true } });
		const error = $('[data-part="error-text"]')!;
		expect(error.getAttribute('data-slot')).toBe('fieldset-error-text');
		expect(error.getAttribute('aria-live')).toBe('polite');
		expect(error.id).toBe('fieldset::set::error-text');
	});

	test('wires aria-describedby to helper and error text after mount', async () => {
		render(Phase3Fieldset, { props: { invalid: true } });
		await tick();

		const root = $('[data-part="root"]')!;
		const describedBy = root.getAttribute('aria-describedby') ?? '';
		expect(describedBy).toContain('fieldset::set::error-text');
		expect(describedBy).toContain('fieldset::set::helper-text');
	});
});
