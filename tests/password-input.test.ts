import { cleanup, fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Phase3PasswordInput from './harness/Phase3PasswordInput.svelte';

afterEach(cleanup);

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;
const input = () => $('[data-scope="password-input"][data-part="input"]') as HTMLInputElement;
const trigger = () => $('[data-scope="password-input"][data-part="visibility-trigger"]') as HTMLButtonElement;
const indicator = () => $('[data-scope="password-input"][data-part="indicator"]')!;
const flush = async () => {
	await tick();
	await new Promise((resolve) => setTimeout(resolve, 0));
};

describe('PasswordInput', () => {
	test('renders the Ark contract', async () => {
		render(Phase3PasswordInput, { props: {} });
		await flush();

		const root = $('[data-scope="password-input"][data-part="root"]')!;
		expect(root.getAttribute('data-slot')).toBe('password-input-root');
		expect(root.hasAttribute('data-invalid')).toBe(false);

		const label = $('[data-part="label"]')!;
		expect(label.getAttribute('data-slot')).toBe('password-input-label');
		expect(label.getAttribute('for')).toBe(input().id);

		const field = $('[data-part="control"]')!;
		expect(field.getAttribute('data-slot')).toBe('password-input-control');

		const fieldInput = input();
		expect(fieldInput.getAttribute('data-slot')).toBe('password-input-input');
		expect(fieldInput.type).toBe('password');
		expect(fieldInput.name).toBe('password');
		expect(fieldInput.getAttribute('data-state')).toBe('hidden');
		expect(fieldInput.getAttribute('autocapitalize')).toBe('off');
		expect(fieldInput.getAttribute('spellcheck')).toBe('false');
		expect(fieldInput.getAttribute('aria-describedby')).toBe('field::password::helper-text');

		expect(trigger().getAttribute('type')).toBe('button');
		expect(trigger().getAttribute('aria-controls')).toBe(fieldInput.id);
		expect(trigger().getAttribute('aria-label')).toBe('Show password');
		expect(trigger().getAttribute('data-state')).toBe('hidden');

		expect(indicator().getAttribute('aria-hidden')).toBe('true');
		expect(indicator().getAttribute('data-state')).toBe('hidden');
		expect(indicator().querySelector('svg')).not.toBeNull();
	});

	test('clicking the trigger reveals the value and swaps the label', async () => {
		const onVisibilityChange = vi.fn();
		render(Phase3PasswordInput, { props: { onVisibilityChange } });
		await flush();

		await fireEvent.input(input(), { target: { value: 'hunter2' } });
		await fireEvent.click(trigger());
		await flush();

		expect(input().type).toBe('text');
		expect(input().value).toBe('hunter2');
		expect(input().getAttribute('data-state')).toBe('visible');
		expect(trigger().getAttribute('aria-label')).toBe('Hide password');
		expect(indicator().getAttribute('data-state')).toBe('visible');
		expect(onVisibilityChange).toHaveBeenCalledWith({ visible: true });

		await fireEvent.click(trigger());
		await flush();

		expect(input().type).toBe('password');
		expect(trigger().getAttribute('aria-label')).toBe('Show password');
		expect(onVisibilityChange).toHaveBeenCalledTimes(2);
	});

	test('pointer down toggles once and the trailing click does not double-toggle', async () => {
		render(Phase3PasswordInput, { props: {} });
		await flush();

		await fireEvent.pointerDown(trigger(), { button: 0, pointerType: 'mouse', isPrimary: true });
		await flush();
		expect(input().type).toBe('text');

		await fireEvent.click(trigger(), { detail: 1 });
		await flush();
		expect(input().type).toBe('text');
	});

	test('disabled and read-only parts block the visibility trigger', async () => {
		const { unmount } = render(Phase3PasswordInput, { props: { disabled: true } });
		await flush();

		expect(
			$('[data-scope="password-input"][data-part="root"]')!.hasAttribute('data-disabled')
		).toBe(true);
		expect(input().disabled).toBe(true);
		expect(trigger().disabled).toBe(true);
		expect(trigger().hasAttribute('data-disabled')).toBe(true);
		unmount();

		render(Phase3PasswordInput, { props: { invalid: true, required: true } });
		await flush();

		const root = $('[data-scope="password-input"][data-part="root"]')!;
		expect(root.hasAttribute('data-invalid')).toBe(true);
		expect(input().getAttribute('aria-invalid')).toBe('true');
		expect(input().required).toBe(true);
		expect($('[data-part="label"]')!.hasAttribute('data-required')).toBe(true);
	});

	test('stays inert while read-only', async () => {
		render(Phase3PasswordInput, { props: { readOnly: true } });
		await flush();

		expect($('[data-scope="password-input"][data-part="root"]')!.hasAttribute('data-readonly')).toBe(
			true
		);
		expect(input().readOnly).toBe(true);
		expect(input().hasAttribute('data-readonly')).toBe(true);

		await fireEvent.pointerDown(trigger(), { button: 0, pointerType: 'mouse', isPrimary: true });
		await flush();
		expect(input().type).toBe('password');
		expect(trigger().getAttribute('aria-label')).toBe('Show password');
	});
});
