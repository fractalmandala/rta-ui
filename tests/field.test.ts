import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, test } from 'vitest';
import Phase3Field from './harness/Phase3Field.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;

describe('Field', () => {
	test('renders the Ark contract', () => {
		render(Phase3Field, { props: {} });

		const root = $('[data-scope="field"][data-part="root"]')!;
		expect(root.getAttribute('data-slot')).toBe('field-root');
		expect(root.getAttribute('role')).toBe('group');
		expect(root.id).toBe('field::demo');

		const label = $('[data-part="label"]')!;
		expect(label.getAttribute('data-slot')).toBe('field-label');
		expect(label.getAttribute('for')).toBe('field::demo::control');
		expect(label.id).toBe('field::demo::label');
	});

	test('propagates invalid state to a nested select and renders error text', () => {
		render(Phase3Field, { props: { invalid: true } });

		const select = $('[data-scope="field"][data-part="select"]')!;
		expect(select.getAttribute('data-invalid')).toBe('');
		expect(select.getAttribute('aria-invalid')).toBe('true');

		const error = $('[data-part="error-text"]')!;
		expect(error).not.toBeNull();
		expect(error.getAttribute('data-slot')).toBe('field-error-text');
		expect(error.getAttribute('aria-live')).toBe('polite');
		expect(error.id).toBe('field::demo::error-text');
	});

	test('hides error text when valid', () => {
		render(Phase3Field, { props: { invalid: false } });
		expect($('[data-part="error-text"]')).toBeNull();
	});

	test('shows the required indicator only when required', () => {
		const { unmount } = render(Phase3Field, { props: { required: true } });
		const indicator = $('[data-part="required-indicator"]')!;
		expect(indicator).not.toBeNull();
		expect(indicator.getAttribute('aria-hidden')).toBe('true');
		expect(indicator.textContent?.trim()).toBe('*');
		unmount();

		render(Phase3Field, { props: { required: false } });
		expect($('[data-part="required-indicator"]')).toBeNull();
	});

	test('wires aria-describedby to helper and error text after mount', async () => {
		render(Phase3Field, { props: { invalid: true } });
		await tick();

		const select = $('[data-scope="field"][data-part="select"]')!;
		const describedBy = select.getAttribute('aria-describedby') ?? '';
		expect(describedBy).toContain('field::demo::error-text');
		expect(describedBy).toContain('field::demo::helper-text');
	});

	test('inherits disabled from the control', () => {
		render(Phase3Field, { props: { disabled: true } });
		const root = $('[data-part="root"]')!;
		expect(root.getAttribute('data-disabled')).toBe('');
		const select = $('[data-scope="field"][data-part="select"]') as HTMLSelectElement;
		expect(select.disabled).toBe(true);
	});
});
