import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import { tick } from 'svelte';
import Phase4CommandPalette from './harness/Phase4CommandPalette.svelte';
import Phase4CommandPaletteProvider from './harness/Phase4CommandPaletteProvider.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;
const $$ = (selector: string) => [...document.querySelectorAll(selector)] as HTMLElement[];

const part = (name: string) => `[data-scope="command-palette"][data-part="${name}"]`;

async function openPalette(props: Record<string, unknown> = {}) {
	const result = render(Phase4CommandPalette, { props });
	await fireEvent.click($(part('trigger'))!);
	await tick();
	return result;
}

const input = () => $(part('input')) as HTMLInputElement;
const items = () => $$(part('item'));

describe('CommandPalette', () => {
	test('opens as a dialog and wires ids, slots and aria from the Zag contract', async () => {
		render(Phase4CommandPalette, { props: {} });

		const trigger = $(part('trigger'))!;
		expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(trigger.getAttribute('data-state')).toBe('closed');
		expect(trigger.getAttribute('data-slot')).toBe('command-palette-trigger');
		// Lazy mount keeps the palette out of the DOM, so aria-controls is skipped.
		expect(trigger.hasAttribute('aria-controls')).toBe(false);
		expect($(part('content'))).toBeNull();

		await fireEvent.click(trigger);
		await tick();

		const content = $(part('content'))!;
		const title = $(part('title'))!;
		expect(trigger.getAttribute('aria-expanded')).toBe('true');
		expect(trigger.getAttribute('data-state')).toBe('open');
		expect(trigger.getAttribute('aria-controls')).toBe(content.id);
		expect(content.tagName).toBe('DIV');
		// The overlay is portalled out of the container.
		expect(document.body.contains(content)).toBe(true);
		expect(content.getAttribute('role')).toBe('dialog');
		expect(content.getAttribute('aria-modal')).toBe('true');
		expect(content.getAttribute('aria-label')).toBe('Command palette');
		// An explicit aria-label wins over the rendered title, as Zag wires it.
		expect(content.hasAttribute('aria-labelledby')).toBe(false);
		expect(title.id).toBe(content.id.replace(':content', ':title'));
		expect(content.getAttribute('tabindex')).toBe('-1');
		expect(content.getAttribute('data-slot')).toBe('command-palette-content');
		expect(content.id).toBe(trigger.id.replace(':trigger', ':content'));

		expect($(part('positioner'))!.id).toBe(content.id.replace(':content', ':positioner'));
		expect($(part('backdrop'))!.id).toBe(content.id.replace(':content', ':backdrop'));
		expect($(part('backdrop'))!.getAttribute('data-state')).toBe('open');
		expect($(part('combobox'))!.getAttribute('data-slot')).toBe('command-palette-combobox');
		expect($(part('list'))!.getAttribute('data-slot')).toBe('command-palette-list');
		expect($(part('footer'))!.getAttribute('data-slot')).toBe('command-palette-footer');
		expect($('[data-slot="command-palette-kbd"]')).not.toBeNull();
		expect($('[data-slot="command-palette-search-icon"]')).not.toBeNull();
	});

	test('moves focus to the search input on open and restores it on close', async () => {
		render(Phase4CommandPalette, { props: {} });
		const trigger = $(part('trigger'))!;
		trigger.focus();
		await fireEvent.click(trigger);
		await tick();

		const field = input();
		await waitFor(() => expect(document.activeElement).toBe(field));
		expect(field.getAttribute('role')).toBe('combobox');
		expect(field.getAttribute('aria-expanded')).toBe('true');
		expect(field.getAttribute('aria-controls')).toBe($(part('list'))!.id);
		expect(field.getAttribute('aria-label')).toBe('Search commands');
		expect(field.getAttribute('data-slot')).toBe('command-palette-input');
		expect(field.getAttribute('aria-activedescendant')).toBe(items()[0].id);

		await fireEvent.keyDown(document.body, { key: 'Escape' });
		await tick();

		await waitFor(() => expect($(part('content'))).toBeNull());
		await waitFor(() => expect(document.activeElement).toBe(trigger));
	});

	test('filters live as the user types and shows the empty state when nothing matches', async () => {
		await openPalette();

		expect(items()).toHaveLength(4);
		expect($$(`${part('item-group-label')}`).map((node) => node.textContent)).toEqual([
			'Create',
			'Navigate',
			'System'
		]);

		await fireEvent.input(input(), { target: { value: 'recent' } });
		await tick();

		expect(items()).toHaveLength(1);
		expect(items()[0].getAttribute('data-value')).toBe('recent');
		expect(items()[0].getAttribute('data-highlighted')).toBe('');
		expect(input().getAttribute('aria-activedescendant')).toBe(items()[0].id);
		expect($(part('empty'))).toBeNull();

		await fireEvent.input(input(), { target: { value: 'nothing-here' } });
		await tick();

		expect(items()).toHaveLength(0);
		expect($(part('list'))!.getAttribute('data-empty')).toBe('');
		const empty = $(part('empty'))!;
		expect(empty.textContent).toBe('No commands found.');
		expect(empty.getAttribute('data-slot')).toBe('command-palette-empty');
		expect(empty.getAttribute('role')).toBe('presentation');
	});

	test('walks the list with arrows, home and end, then runs the active command on enter', async () => {
		const onSelect = vi.fn();
		const onValueChange = vi.fn();
		await openPalette({ onSelect, onValueChange });

		const field = input();
		expect(items()[0].getAttribute('data-highlighted')).toBe('');

		await fireEvent.keyDown(field, { key: 'ArrowDown' });
		await tick();
		expect(items()[1].getAttribute('data-highlighted')).toBe('');

		await fireEvent.keyDown(field, { key: 'End' });
		await tick();
		expect(items()[items().length - 1].getAttribute('data-highlighted')).toBe('');

		await fireEvent.keyDown(field, { key: 'Home' });
		await tick();
		expect(items()[0].getAttribute('data-highlighted')).toBe('');
		expect(field.getAttribute('aria-activedescendant')).toBe(items()[0].id);

		await fireEvent.keyDown(field, { key: 'ArrowUp' });
		await tick();
		expect(items()[items().length - 1].getAttribute('data-highlighted')).toBe('');

		await fireEvent.keyDown(field, { key: 'ArrowDown' });
		await tick();
		await fireEvent.keyDown(field, { key: 'Enter' });
		await tick();

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect.mock.calls[0][0].itemValue).toBe('new-project');
		expect(onValueChange.mock.calls[0][0].value).toEqual(['new-project']);
		expect(document.querySelector('[data-testid="executed"]')!.textContent).toBe('new-project');
		// Selecting runs the command and closes the palette.
		await waitFor(() => expect($(part('content'))).toBeNull());
	});

	test('toggles from the global shortcut and closes on an outside pointer', async () => {
		render(Phase4CommandPalette, { props: { shortcut: 'mod+k' } });

		await fireEvent.keyDown(document.body, { key: 'k', metaKey: true });
		await tick();
		expect($(part('content'))).not.toBeNull();

		await fireEvent.keyDown(document.body, { key: 'k', metaKey: true });
		await tick();
		await waitFor(() => expect($(part('content'))).toBeNull());

		await fireEvent.click($(part('trigger'))!);
		await tick();
		expect($(part('content'))).not.toBeNull();

		await fireEvent.pointerDown(document.body);
		await tick();
		await waitFor(() => expect($(part('content'))).toBeNull());
	});

	test('selects an item on click, keeps the query when preserve is set and marks the value', async () => {
		const onSelect = vi.fn();
		await openPalette({ onSelect, closeOnSelect: false });

		const field = input();
		await fireEvent.input(field, { target: { value: 'notes' } });
		await tick();
		expect(field.value).toBe('notes');

		await fireEvent.click(items()[0]);
		await tick();

		expect(onSelect.mock.calls[0][0].itemValue).toBe('notes');
		// `selectionBehavior="preserve"` leaves the query alone.
		expect(input().value).toBe('notes');
		expect(items()[0].getAttribute('data-selected')).toBe('');
		expect(items()[0].getAttribute('aria-selected')).toBe('true');
		expect(items()[0].getAttribute('data-state')).toBe('checked');

		// The clear trigger resets the query only, not the selected value.
		const clear = $(part('clear-trigger')) as HTMLButtonElement;
		expect(clear.hidden).toBe(false);
		await fireEvent.click(clear);
		await tick();

		expect(input().value).toBe('');
		expect(clear.hidden).toBe(true);
		expect(items()).toHaveLength(4);
		// Clearing the query keeps the selected command.
		expect(
			items()
				.find((node) => node.getAttribute('data-value') === 'notes')!
				.getAttribute('data-selected')
		).toBe('');
	});

	test('groups results and labels them through the group contract', async () => {
		await openPalette();

		const group = $$(part('item-group'))[0];
		const label = $$(part('item-group-label'))[0];
		expect(group.getAttribute('role')).toBe('group');
		expect(group.getAttribute('aria-labelledby')).toBe(label.id);
		expect(label.id).toContain(':optgroup-label:');
		expect(group.id).toContain(':optgroup:');
		expect(label.getAttribute('role')).toBe('presentation');
		expect($(part('item-text'))!.getAttribute('data-state')).toBe('unchecked');
		expect($(part('item-indicator'))!.hasAttribute('hidden')).toBe(true);
	});

	test('drives the same surface from a hoisted api through the root provider', async () => {
		const { getByTestId } = render(Phase4CommandPaletteProvider, { props: {} });

		expect(getByTestId('api-open').textContent).toBe('false');
		expect($(part('content'))).toBeNull();

		await fireEvent.click(getByTestId('api-open-button'));
		await tick();

		expect(getByTestId('api-open').textContent).toBe('true');
		expect(getByTestId('api-state').textContent).toBe('open');
		const content = $(part('content'))!;
		expect(content.getAttribute('role')).toBe('dialog');
		expect(content.getAttribute('aria-label')).toBe('Commands');

		await fireEvent.input(input(), { target: { value: 'ren' } });
		await tick();
		expect(items()).toHaveLength(1);

		await fireEvent.keyDown(input(), { key: 'Enter' });
		await tick();

		expect(getByTestId('executed').textContent).toBe('rename');
		await waitFor(() => expect($(part('content'))).toBeNull());
	});
});
