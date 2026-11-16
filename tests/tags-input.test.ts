import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import Phase3TagsInput from './harness/Phase3TagsInput.svelte';
import Phase3TagsInputField from './harness/Phase3TagsInputField.svelte';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;
const $$ = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));

const root = () => $('[data-scope="tags-input"][data-part="root"]')!;
const input = () => $<HTMLInputElement>('[data-part="input"]')!;
const hidden = () => $<HTMLInputElement>('input[hidden]:not([data-part])')!;
const tagTexts = () => $$('[data-part="item-text"]').map((node) => node.textContent);
const highlighted = () => $$('[data-part="item-preview"][data-highlighted]');
const highlightedValues = () => highlighted().map((node) => node.getAttribute('data-value'));

/** Zag starts in `idle`; keys only act from the focused input state. */
const focusInput = async (node: HTMLInputElement = input()) => {
	node.focus();
	await fireEvent.focus(node);
};

const type = async (text: string, node: HTMLInputElement = input()) => {
	await focusInput(node);
	await fireEvent.input(node, { target: { value: text } });
};

const press = async (key: string) => fireEvent.keyDown(input(), { key });

describe('TagsInput', () => {
	test('renders every anatomy part with scope, part and slot hooks', () => {
		render(Phase3TagsInput, { props: {} });

		expect(root().getAttribute('data-slot')).toBe('tags-input-root');
		expect($('[data-part="label"]')!.getAttribute('data-slot')).toBe('tags-input-label');
		expect($('[data-part="control"]')!.getAttribute('data-slot')).toBe('tags-input-control');
		expect(input().getAttribute('data-slot')).toBe('tags-input-input');
		expect($('[data-part="clear-trigger"]')!.getAttribute('data-slot')).toBe(
			'tags-input-clear-trigger'
		);

		const items = $$('[data-part="item"]');
		expect(items).toHaveLength(3);
		expect(items[0].getAttribute('data-slot')).toBe('tags-input-item');
		expect(items[0].getAttribute('data-value')).toBe('a');
		expect($('[data-part="item-preview"]')!.getAttribute('data-slot')).toBe(
			'tags-input-item-preview'
		);
		expect($('[data-part="item-text"]')!.getAttribute('data-slot')).toBe(
			'tags-input-item-text'
		);
		expect($('[data-part="item-delete-trigger"]')!.getAttribute('data-slot')).toBe(
			'tags-input-item-delete-trigger'
		);
		expect($('[data-part="clear-trigger"]')!.getAttribute('aria-label')).toBe('Clear all tags');
		expect($('[data-part="item-delete-trigger"]')!.getAttribute('aria-label')).toBe(
			'Delete tag a'
		);
	});

	test('commits a tag on Enter or the delimiter and trims through sanitizeValue', async () => {
		const onValueChange = vi.fn();
		render(Phase3TagsInput, { props: { value: [], onValueChange } });

		await type('design');
		await press('Enter');
		expect(tagTexts()).toEqual(['design']);
		expect(onValueChange).toHaveBeenCalledWith(['design']);
		expect(input().value).toBe('');

		await type('  spaced  ');
		await press('Enter');
		expect(tagTexts()).toEqual(['design', 'spaced']);

		await type('typed,');
		expect(tagTexts()).toEqual(['design', 'spaced', 'typed']);
		expect(input().value).toBe('');
	});

	test('commits or clears the draft on blur through blurBehavior', async () => {
		render(Phase3TagsInput, { props: { value: [], blurBehavior: 'add' } });
		await type('design');
		await fireEvent.blur(input());
		expect(tagTexts()).toEqual(['design']);

		render(Phase3TagsInput, { props: { value: [], blurBehavior: 'clear' } });
		const second = $$('[data-part="input"]')[1] as HTMLInputElement;
		await type('draft', second);
		await fireEvent.blur(second);
		expect(second.value).toBe('');
		expect($$('[data-part="item-text"]')).toHaveLength(1);
	});

	test('walks tags with the arrow keys, deletes the highlighted one and escapes to the input', async () => {
		render(Phase3TagsInput, { props: { value: ['a', 'b', 'c'] } });

		await focusInput();
		await press('ArrowLeft');
		expect(highlightedValues()).toEqual(['c']);

		await press('ArrowLeft');
		expect(highlightedValues()).toEqual(['b']);

		await press('ArrowRight');
		expect(highlightedValues()).toEqual(['c']);

		await press('ArrowRight');
		await press('ArrowDown');
		expect(highlighted()).toHaveLength(0);

		await press('ArrowLeft');
		await press('Escape');
		expect(highlighted()).toHaveLength(0);

		await press('Delete');
		expect(tagTexts()).toEqual(['a', 'b', 'c']);

		await press('ArrowLeft');
		await press('Delete');
		expect(tagTexts()).toEqual(['a', 'b']);
		await waitFor(() => expect(hidden().value).toBe('a, b'));
	});

	test('removes the previous tag on the second Backspace and keeps the next one highlighted', async () => {
		render(Phase3TagsInput, { props: { value: ['a', 'b', 'c'] } });

		await focusInput();
		await press('Backspace');
		expect(highlightedValues()).toEqual(['c']);
		expect(tagTexts()).toEqual(['a', 'b', 'c']);

		await press('Backspace');
		expect(tagTexts()).toEqual(['a', 'b']);
		expect(highlightedValues()).toEqual(['b']);
	});

	test('removes a tag with its trigger and all of them with the clear trigger', async () => {
		render(Phase3TagsInput, { props: { value: ['a', 'b'] } });

		await fireEvent.click($$('[data-part="item-delete-trigger"]')[0]);
		expect(tagTexts()).toEqual(['b']);

		await fireEvent.click($('[data-part="clear-trigger"]')!);
		expect(tagTexts()).toEqual([]);
		expect(root().hasAttribute('data-empty')).toBe(true);
		expect(input().hasAttribute('data-empty')).toBe(true);
	});

	test('edits a tag inline, saving with Enter, cancelling with Escape and dropping an empty value', async () => {
		const { container } = render(Phase3TagsInput, { props: { value: ['a', 'b'] } });
		const texts = () =>
			Array.from(container.querySelectorAll('[data-part="item-text"]')).map((n) => n.textContent);
		const itemInput = (index: number) =>
			container.querySelectorAll('[data-part="item-input"]')[index] as HTMLInputElement;

		const startEdit = async () => {
			await focusInput(container.querySelector('[data-part="input"]') as HTMLInputElement);
			await fireEvent.keyDown(container.querySelector('[data-part="input"]')!, { key: 'ArrowLeft' });
			await fireEvent.keyDown(container.querySelector('[data-part="input"]')!, { key: 'Enter' });
		};

		await startEdit();
		expect(itemInput(1).hidden).toBe(false);
		expect((container.querySelectorAll('[data-part="item-preview"]')[1] as HTMLElement).hidden).toBe(true);

		await fireEvent.input(itemInput(1), { target: { value: 'renamed' } });
		await fireEvent.keyDown(itemInput(1), { key: 'Enter' });
		expect(texts()).toEqual(['a', 'renamed']);

		await startEdit();
		await fireEvent.input(itemInput(1), { target: { value: 'discarded' } });
		await fireEvent.keyDown(itemInput(1), { key: 'Escape' });
		expect(texts()).toEqual(['a', 'renamed']);

		const fresh = render(Phase3TagsInput, { props: { value: ['a', 'b'] } });
		const freshInput = () => fresh.container.querySelector('[data-part="input"]') as HTMLInputElement;
		await focusInput(freshInput());
		await fireEvent.keyDown(freshInput(), { key: 'ArrowLeft' });
		await fireEvent.keyDown(freshInput(), { key: 'Enter' });
		const emptied = fresh.container.querySelectorAll('[data-part="item-input"]')[1] as HTMLInputElement;
		expect(emptied.hidden).toBe(false);
		await fireEvent.input(emptied, { target: { value: '  ' } });
		await fireEvent.keyDown(emptied, { key: 'Enter' });
		expect(
			Array.from(fresh.container.querySelectorAll('[data-part="item-text"]')).map((n) => n.textContent)
		).toEqual(['a']);
	});

	test('rejects duplicates, invalid and overflowing tags unless the props allow them', async () => {
		const onValueInvalid = vi.fn();
		render(Phase3TagsInput, { props: { value: ['a'], onValueInvalid } });

		await type('a');
		await press('Enter');
		expect(tagTexts()).toEqual(['a']);

		const { container } = render(Phase3TagsInput, {
			props: { value: [], allowDuplicates: true, max: 2, onValueInvalid }
		});
		const second = container.querySelector('[data-part="input"]') as HTMLInputElement;
		await type('a', second);
		await fireEvent.keyDown(second, { key: 'Enter' });
		await type('a', second);
		await fireEvent.keyDown(second, { key: 'Enter' });
		expect(
			Array.from(container.querySelectorAll('[data-part="item-text"]')).map((node) => node.textContent)
		).toEqual(['a', 'a']);

		const invalid = render(Phase3TagsInput, {
			props: {
				value: [],
				validate: ({ inputValue }: { inputValue: string }) => inputValue.length > 2,
				onValueInvalid
			}
		});
		const third = invalid.container.querySelector('[data-part="input"]') as HTMLInputElement;
		await type('ab', third);
		await fireEvent.keyDown(third, { key: 'Enter' });
		expect(invalid.container.querySelectorAll('[data-part="item-text"]')).toHaveLength(0);
		expect(onValueInvalid).toHaveBeenCalledWith({ reason: 'invalidTag' });
	});

	test('marks the root invalid when the value overflows max', async () => {
		const onValueInvalid = vi.fn();
		render(Phase3TagsInput, { props: { value: ['a', 'b'], max: 1, onValueInvalid } });

		await waitFor(() => expect(root().hasAttribute('data-invalid')).toBe(true));
		expect(input().hasAttribute('data-invalid')).toBe(true);
		expect(input().getAttribute('aria-invalid')).toBe('true');
		expect(onValueInvalid).toHaveBeenCalledWith({ reason: 'rangeOverflow' });
	});

	test('splits pasted values when addOnPaste is set', async () => {
		render(Phase3TagsInput, { props: { value: [], addOnPaste: true } });

		await focusInput();
		await fireEvent.input(input(), {
			target: { value: 'x, y, z' },
			inputType: 'insertFromPaste'
		} as unknown as Record<string, unknown>);

		await waitFor(() => expect(tagTexts()).toEqual(['x', 'y', 'z']));
	});

	test('mirrors the joined value into the hidden input and fires an input event', async () => {
		render(Phase3TagsInput, { props: { value: ['a', 'b'] } });

		expect(hidden().name).toBe('tags');
		await waitFor(() => expect(hidden().value).toBe('a, b'));

		const onInput = vi.fn();
		hidden().addEventListener('input', onInput);

		await type('c');
		await press('Enter');

		await waitFor(() => expect(hidden().value).toBe('a, b, c'));
		expect(onInput).toHaveBeenCalled();
	});

	test('reflects disabled and readonly on the input, control and hidden input', () => {
		render(Phase3TagsInput, { props: { disabled: true } });
		expect(root().hasAttribute('data-disabled')).toBe(true);
		expect(input().disabled).toBe(true);
		expect(hidden().disabled).toBe(true);

		render(Phase3TagsInput, { props: { readOnly: true } });
		expect($$('[data-part="input"]')[1].hasAttribute('data-readonly')).toBe(true);
		expect($$('[data-part="control"]')[1].hasAttribute('data-readonly')).toBe(true);
		expect(($$('[data-part="input"]')[1] as HTMLInputElement).disabled).toBe(true);
	});

	test('folds the field context into required, invalid and described-by props', () => {
		render(Phase3TagsInputField, { props: { required: true, invalid: true } });

		// Ark maps the field label and control id onto the hidden input, not the visible one.
		const label = $<HTMLLabelElement>('label')!;
		expect(label.htmlFor).toBe(hidden().id);
		expect(hidden().required).toBe(true);
		expect(input().getAttribute('aria-invalid')).toBe('true');
		expect(input().getAttribute('aria-describedby')).toContain('helper-text');
		expect(root().hasAttribute('data-invalid')).toBe(true);
	});
});
