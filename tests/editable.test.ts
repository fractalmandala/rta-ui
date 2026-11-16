import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import Phase3Editable from './harness/Phase3Editable.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;

const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 30));

describe('Editable', () => {
	test('renders every part with moduix hooks and the Zag id set', () => {
		render(Phase3Editable, { props: {} });

		const root = $('[data-scope="editable"][data-part="root"]')!;
		expect(root.getAttribute('data-slot')).toBe('editable-root');
		expect(root.getAttribute('data-state')).toBe('preview');

		const label = $('[data-part="label"]')!;
		expect(label.getAttribute('data-slot')).toBe('editable-label');
		expect(label.textContent).toBe('Task');

		const area = $('[data-part="area"]')!;
		expect(area.getAttribute('data-slot')).toBe('editable-area');

		const preview = $('[data-part="preview"]')!;
		expect(preview.getAttribute('data-slot')).toBe('editable-preview');
		expect(preview.textContent).toBe('Draft copy');
		expect(preview.hidden).toBe(false);
		expect(preview.getAttribute('tabindex')).toBe('0');

		const input = $('[data-part="input"]') as HTMLInputElement;
		expect(input.getAttribute('data-slot')).toBe('editable-input');
		expect(input.hidden).toBe(true);
		expect(input.value).toBe('Draft copy');
		expect(input.getAttribute('aria-label')).toBe('editable input');
		expect(label.getAttribute('for')).toBe(input.id);
		expect(input.id).toBe(`${root.id}:input`);

		const control = $('[data-part="control"]')!;
		expect(control.getAttribute('data-slot')).toBe('editable-control');

		const trigger = $('[data-part="edit-trigger"]') as HTMLButtonElement;
		expect(trigger.getAttribute('data-slot')).toBe('editable-edit-trigger');
		expect(trigger.getAttribute('aria-label')).toBe('edit');
		expect(trigger.querySelector('svg')).not.toBeNull();
	});

	test('enters edit mode when the preview receives focus in focus mode', async () => {
		render(Phase3Editable, { props: { activationMode: 'focus' } });

		const preview = $('[data-part="preview"]')!;
		expect(preview.getAttribute('tabindex')).toBe('0');

		await fireEvent.focus(preview);
		await nextFrame();

		expect($('[data-part="root"]')!.getAttribute('data-state')).toBe('edit');
		expect(($('[data-part="input"]') as HTMLInputElement).hidden).toBe(false);
	});

	test('shows the preview placeholder when empty and keeps both placeholders apart', () => {
		render(Phase3Editable, {
			props: { value: '', placeholder: { preview: 'Nothing yet', edit: 'Type here' } }
		});

		const preview = $('[data-part="preview"]')!;
		expect(preview.textContent).toBe('Nothing yet');
		expect(preview.getAttribute('data-placeholder-shown')).toBe('');
		expect(preview.getAttribute('data-empty')).toBe('');

		const input = $('[data-part="input"]') as HTMLInputElement;
		expect(input.placeholder).toBe('Type here');
		expect(input.getAttribute('data-placeholder-shown')).toBe('');
	});

	test('enters edit mode on click when activationMode is click', async () => {
		const onEditChange = vi.fn();
		render(Phase3Editable, { props: { activationMode: 'click', onEditChange } });

		await fireEvent.click($('[data-part="preview"]')!);
		await nextFrame();

		const root = $('[data-part="root"]')!;
		expect(root.getAttribute('data-state')).toBe('edit');

		const input = $('[data-part="input"]') as HTMLInputElement;
		expect(input.hidden).toBe(false);
		expect(document.activeElement).toBe(input);
		expect(input.selectionEnd).toBe(input.value.length);
		expect($('[data-part="edit-trigger"]')).toBeNull();
		expect($('[data-part="submit-trigger"]')).not.toBeNull();
		expect($('[data-part="cancel-trigger"]')).not.toBeNull();
		expect(onEditChange).toHaveBeenCalledWith({ edit: true });
	});

	test('commits on enter and reports value change then commit', async () => {
		const onValueChange = vi.fn();
		const onValueCommit = vi.fn();
		render(Phase3Editable, { props: { activationMode: 'click', onValueChange, onValueCommit } });

		await fireEvent.click($('[data-part="preview"]')!);
		const input = $('[data-part="input"]') as HTMLInputElement;

		await fireEvent.change(input, { target: { value: 'Rewritten copy' } });
		await fireEvent.keyDown(input, { key: 'Enter' });

		expect(onValueChange).toHaveBeenLastCalledWith({ value: 'Rewritten copy' });
		expect(onValueCommit).toHaveBeenCalledWith({ value: 'Rewritten copy' });
		expect($('[data-part="root"]')!.getAttribute('data-state')).toBe('preview');
		expect($('[data-part="preview"]')!.textContent).toBe('Rewritten copy');
	});

	test('ignores enter when submitMode is none and keeps edit mode', async () => {
		const onValueCommit = vi.fn();
		render(Phase3Editable, {
			props: { activationMode: 'click', submitMode: 'none', onValueCommit }
		});

		await fireEvent.click($('[data-part="preview"]')!);
		const input = $('[data-part="input"]') as HTMLInputElement;
		await fireEvent.change(input, { target: { value: 'Still editing' } });
		await fireEvent.keyDown(input, { key: 'Enter' });

		expect(onValueCommit).not.toHaveBeenCalled();
		expect($('[data-part="root"]')!.getAttribute('data-state')).toBe('edit');
	});

	test('reverts the previous value on escape', async () => {
		const onValueRevert = vi.fn();
		render(Phase3Editable, { props: { activationMode: 'click', onValueRevert } });

		await fireEvent.click($('[data-part="preview"]')!);
		const input = $('[data-part="input"]') as HTMLInputElement;
		await fireEvent.change(input, { target: { value: 'Throwaway' } });
		await fireEvent.keyDown(input, { key: 'Escape' });

		expect(onValueRevert).toHaveBeenCalledWith({ value: 'Draft copy' });
		expect($('[data-part="root"]')!.getAttribute('data-state')).toBe('preview');
		expect($('[data-part="preview"]')!.textContent).toBe('Draft copy');
		expect(input.value).toBe('Draft copy');
	});

	test('disables the triggers and blocks activation when disabled or readOnly', async () => {
		const { unmount } = render(Phase3Editable, { props: { disabled: true } });

		let trigger = $('[data-part="edit-trigger"]') as HTMLButtonElement;
		expect(trigger.disabled).toBe(true);
		expect($('[data-part="root"]')!.getAttribute('data-disabled')).toBe('');

		await fireEvent.click($('[data-part="preview"]')!);
		expect($('[data-part="root"]')!.getAttribute('data-state')).toBe('preview');
		unmount();

		render(Phase3Editable, { props: { readOnly: true, activationMode: 'click' } });
		trigger = $('[data-part="edit-trigger"]') as HTMLButtonElement;
		expect(trigger.disabled).toBe(false);
		expect(trigger.getAttribute('data-readonly')).toBe('');
		expect($('[data-part="root"]')!.getAttribute('data-readonly')).toBe('');

		await fireEvent.click($('[data-part="preview"]')!);
		expect($('[data-part="root"]')!.getAttribute('data-state')).toBe('preview');
	});

	test('submits on outside focus when submitMode is blur, but not on enter', async () => {
		const onValueCommit = vi.fn();
		render(Phase3Editable, {
			props: { activationMode: 'click', submitMode: 'blur', onValueCommit }
		});

		await fireEvent.click($('[data-part="preview"]')!);
		const input = $('[data-part="input"]') as HTMLInputElement;
		await fireEvent.change(input, { target: { value: 'Blurred copy' } });
		await fireEvent.keyDown(input, { key: 'Enter' });

		expect(onValueCommit).not.toHaveBeenCalled();
		expect($('[data-part="root"]')!.getAttribute('data-state')).toBe('edit');

		await fireEvent.focusIn(document.body);

		expect(onValueCommit).toHaveBeenCalledWith({ value: 'Blurred copy' });
		expect($('[data-part="root"]')!.getAttribute('data-state')).toBe('preview');
	});

	test('autoResize stacks preview and input in one grid cell with Zag inline styles', () => {
		render(Phase3Editable, { props: { autoResize: true } });

		const area = $('[data-part="area"]')!;
		expect(area.getAttribute('data-autoresize')).toBeNull();
		expect(area.style.cssText).toContain('inline-grid');

		const preview = $('[data-part="preview"]')!;
		expect(preview.hidden).toBe(false);
		expect(preview.hasAttribute('data-autoresize')).toBe(true);
		expect(preview.style.cssText).toContain('grid-area: 1 / 1');
		expect(preview.style.cssText).toContain('text-overflow: ellipsis');

		const input = $('[data-part="input"]') as HTMLInputElement;
		expect(input.hidden).toBe(false);
		expect(input.hasAttribute('data-autoresize')).toBe(true);
		expect(input.style.cssText).toContain('grid-area: 1 / 1');
		expect(input.style.cssText).toContain('visibility: hidden');
		expect(input.getAttribute('size')).toBe('1');
	});

	test('asChild textarea requires the platform modifier to submit on enter', async () => {
		const onValueCommit = vi.fn();
		render(Phase3Editable, {
			props: { textarea: true, autoResize: true, activationMode: 'click', onValueCommit }
		});

		await fireEvent.click($('[data-part="preview"]')!);
		const textarea = $('[data-part="input"]') as HTMLTextAreaElement;
		expect(textarea.tagName).toBe('TEXTAREA');
		expect(textarea.hidden).toBe(false);

		await fireEvent.change(textarea, { target: { value: 'Multiline\ncopy' } });
		await fireEvent.keyDown(textarea, { key: 'Enter' });
		expect(onValueCommit).not.toHaveBeenCalled();

		await fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
		expect(onValueCommit).toHaveBeenCalledWith({ value: 'Multiline\ncopy' });
		expect($('[data-part="root"]')!.getAttribute('data-state')).toBe('preview');
	});

	test('clamps typed values to maxLength', async () => {
		const onValueChange = vi.fn();
		render(Phase3Editable, {
			props: { activationMode: 'click', maxLength: 4, onValueChange }
		});

		await fireEvent.click($('[data-part="preview"]')!);
		const input = $('[data-part="input"]') as HTMLInputElement;
		expect(input.getAttribute('maxlength')).toBe('4');

		await fireEvent.change(input, { target: { value: 'abcdefgh' } });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 'abcd' });
	});
});
