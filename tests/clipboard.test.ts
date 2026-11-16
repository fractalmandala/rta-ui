import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import ClipboardBasic from './harness/ClipboardBasic.svelte';

const $ = <T extends Element = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;

describe('Clipboard', () => {
	test('renders the Ark contract', () => {
		render(ClipboardBasic, { props: { value: 'https://example.com' } });

		const root = $('[data-scope="clipboard"][data-part="root"]')!;
		expect(root.getAttribute('data-slot')).toBe('clipboard-root');
		expect(root.getAttribute('data-copied')).toBeNull();

		const label = $('[data-part="label"]') as HTMLLabelElement;
		const input = $('[data-part="input"]') as HTMLInputElement;
		expect(label.getAttribute('for')).toBe(input.id);
		expect(input.value).toBe('https://example.com');
		expect(input.readOnly).toBe(true);
		expect(input.getAttribute('data-readonly')).toBe('true');

		expect($('[data-part="trigger"]')!.getAttribute('aria-label')).toBe('Copy to clipboard');
		expect($('[data-part="trigger"]')!.getAttribute('type')).toBe('button');
		expect($('[data-part="value-text"]')!.textContent).toBe('https://example.com');
	});

	test('copy flips indicators and fires onCopy', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.assign(navigator, { clipboard: { writeText } });
		const onCopy = vi.fn();
		render(ClipboardBasic, { props: { onCopy, value: 'invite' } });

		await fireEvent.click($('[data-part="trigger"]')!);

		expect(writeText).toHaveBeenCalledWith('invite');
		expect(onCopy).toHaveBeenCalledWith({ value: 'invite' });
		expect($('[data-part="root"]')!.getAttribute('data-copied')).toBe('');
		expect($('[data-part="trigger"]')!.getAttribute('aria-label')).toBe('Copied to clipboard');
		expect($('[data-slot="clipboard-indicator"]')!.innerHTML).not.toContain('rect');
		expect($('[data-slot="clipboard-indicator"]')!.hasAttribute('hidden')).toBe(false);
	});

	test('indicator hides when the copied flag does not match', async () => {
		render(ClipboardBasic, { props: { value: 'x' } });
		expect($('[data-part="indicator"]')!.innerHTML).toContain('rect');
		expect($('[data-part="indicator"]')!.hasAttribute('hidden')).toBe(false);
	});
});
