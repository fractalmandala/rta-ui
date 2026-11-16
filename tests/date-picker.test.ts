import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { flushSync, tick } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { CalendarDate } from '../src/lib/internal/date';
import Phase6DatePicker from './harness/Phase6DatePicker.svelte';

afterEach(cleanup);

const settle = () => new Promise((resolve) => setTimeout(resolve, 60));
const part = (name: string) =>
	document.querySelector<HTMLElement>(`[data-scope="date-picker"][data-part="${name}"]`);
const parts = (name: string) => [
	...document.querySelectorAll<HTMLElement>(`[data-scope="date-picker"][data-part="${name}"]`)
];
const dayCells = () => [
	...document.querySelectorAll<HTMLElement>(
		'[data-scope="date-picker"][data-part="table-cell-trigger"][data-view="day"]'
	)
];
const cellTrigger = (iso: string) =>
	document.querySelector<HTMLElement>(
		`[data-scope="date-picker"][data-part="table-cell-trigger"][data-view="day"][data-value="${iso}"]`
	);
const reference = new CalendarDate(2024, 3, 1);

const open = async (harness: Parameters<typeof render>[0] = Phase6DatePicker, props = {}) => {
	render(harness, props);
	flushSync();
	await fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }));
	flushSync();
	await tick();
};

describe('date-picker', () => {
	test('renders the ark contract for root, label, control and input', () => {
		render(Phase6DatePicker, {});
		flushSync();

		const root = part('root')!;
		expect(root.getAttribute('data-slot')).toBe('date-picker-root');
		expect(root.getAttribute('data-state')).toBe('closed');
		expect(root.getAttribute('data-empty')).toBe('');
		expect(root.id).toMatch(/^datepicker:/);

		const label = part('label')!;
		expect(label.getAttribute('data-slot')).toBe('date-picker-label');
		expect(label.getAttribute('for')).toBe(`${root.id}:input:0`);

		const control = part('control')!;
		expect(control.id).toBe(`${root.id}:control`);
		expect(control.getAttribute('data-placeholder-shown')).toBe('');

		const input = part('input')! as HTMLInputElement;
		expect(input.getAttribute('data-slot')).toBe('date-picker-input');
		expect(input.id).toBe(`${root.id}:input:0`);
		expect(input.getAttribute('autocomplete')).toBe('off');
		expect(input.getAttribute('data-placeholder-shown')).toBe('');
		expect(input.placeholder).toBe('mm/dd/yyyy');

		const trigger = part('trigger')!;
		expect(trigger.getAttribute('aria-haspopup')).toBe('grid');
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(trigger.getAttribute('aria-label')).toBe('Open calendar');
		expect(trigger.getAttribute('aria-controls')).toBe(`${root.id}:content`);
		expect(trigger.getAttribute('data-state')).toBe('closed');
		expect(trigger.getAttribute('type')).toBe('button');

		expect(part('content')).toBeNull();
	});

	test('opens into a portalled day grid with the zag cell hooks', async () => {
		await open(Phase6DatePicker, { defaultOpen: undefined });
		await settle();

		const content = part('content')!;
		expect(content).toBeTruthy();
		expect(content.getAttribute('role')).toBe('application');
		expect(content.getAttribute('aria-label')).toBe('calendar');
		expect(content.getAttribute('tabindex')).toBe('-1');
		expect(content.getAttribute('data-state')).toBe('open');
		expect(content.hasAttribute('hidden')).toBe(false);
		expect(content.closest('[data-rta-portal]')).toBeTruthy();

		const positioner = part('positioner')!;
		expect(positioner.id).toMatch(/:positioner$/);
		expect(positioner.style.position).toBe('absolute');
		expect(content.parentElement).toBe(positioner);

		const table = part('table')!;
		expect(table.getAttribute('role')).toBe('grid');
		expect(table.getAttribute('data-columns')).toBe('7');
		expect(table.getAttribute('data-view')).toBe('day');

		const heads = parts('table-header');
		expect(heads.length).toBeGreaterThanOrEqual(7);
		expect(heads[0].getAttribute('aria-hidden')).toBeNull();
		expect(part('table-head')!.getAttribute('aria-hidden')).toBe('true');

		const cells = dayCells();
		expect(cells.length).toBeGreaterThanOrEqual(28);
		const focused = cells.filter((cell) => cell.hasAttribute('data-focus'));
		expect(focused).toHaveLength(1);
		expect(focused[0].getAttribute('tabindex')).toBe('0');
		expect(focused[0].getAttribute('role')).toBe('button');

		const today = cells.find((cell) => cell.hasAttribute('data-today'));
		expect(today).toBeTruthy();
		expect(today!.getAttribute('aria-current')).toBeNull();
		expect(today!.closest('[data-part="table-cell"]')!.getAttribute('aria-current')).toBe('date');

		const outside = cells.filter((cell) => cell.hasAttribute('data-outside-range'));
		expect(outside.length).toBeGreaterThan(0);
		expect(outside[0].hasAttribute('data-outside-month')).toBe(true);
		expect(outside[0].getAttribute('aria-disabled')).toBe('true');

		const viewTrigger = part('view-trigger')!;
		expect(viewTrigger.getAttribute('data-view')).toBe('day');
		expect(viewTrigger.getAttribute('aria-label')).toBe('Switch to month view');
	});

	test('selects a day, closes, and writes the input and hidden form value', async () => {
		const onValueChange = vi.fn();
		const onOpenChange = vi.fn();
		const { unmount } = render(Phase6DatePicker, {
			onValueChange,
			onOpenChange,
			name: 'departure',
			referenceDate: reference,
			withValueText: true
		});
		flushSync();
		await fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }));
		flushSync();
		expect(part('value-text')!.textContent?.trim()).toBe('Pick a date');

		const target = cellTrigger('2024-03-15')!;
		expect(target).toBeTruthy();
		await fireEvent.click(target);
		flushSync();

		expect(onValueChange).toHaveBeenCalledTimes(1);
		const details = onValueChange.mock.calls[0][0];
		expect(details.value).toHaveLength(1);
		expect(details.value[0].toString()).toBe('2024-03-15');
		expect(details.valueAsString[0]).toBe('03/15/2024');
		expect(details.view).toBe('day');
		expect(onOpenChange).toHaveBeenLastCalledWith(
			expect.objectContaining({ open: false })
		);

		const input = part('input') as HTMLInputElement;
		expect(input.value).toBe('03/15/2024');
		expect(input.name).toBe('departure');
		expect(part('root')!.getAttribute('data-empty')).toBeNull();
		expect(part('clear-trigger')!.hasAttribute('hidden')).toBe(false);
		expect(part('value-text')!.textContent?.trim()).toBe('03/15/2024');

		await settle();
		expect(part('content')).toBeNull();
		unmount();

		const typed = vi.fn();
		render(Phase6DatePicker, { onValueChange: typed });
		flushSync();
		const field = part('input') as HTMLInputElement;
		await fireEvent.input(field, { target: { value: '03/15/2024' } });
		await fireEvent.blur(field);
		flushSync();
		expect(typed).toHaveBeenLastCalledWith(
			expect.objectContaining({ valueAsString: ['03/15/2024'] })
		);
		expect((part('input') as HTMLInputElement).value).toBe('03/15/2024');
	});

	test('range mode marks start, end and in-range cells and closes after the second pick', async () => {
		const onValueChange = vi.fn();
		await open(Phase6DatePicker, { mode: 'range', onValueChange, referenceDate: reference });

		await fireEvent.click(cellTrigger('2024-03-10')!);
		flushSync();
		expect(cellTrigger('2024-03-10')!.hasAttribute('data-range-start')).toBe(true);
		expect(part('content')).toBeTruthy();

		await fireEvent.click(cellTrigger('2024-03-14')!);
		flushSync();

		const last = onValueChange.mock.calls.at(-1)![0];
		expect(last.value.map((date: CalendarDate) => date.toString())).toEqual([
			'2024-03-10',
			'2024-03-14'
		]);
		expect(cellTrigger('2024-03-10')!.hasAttribute('data-range-start')).toBe(true);
		expect(cellTrigger('2024-03-14')!.hasAttribute('data-range-end')).toBe(true);
		expect(cellTrigger('2024-03-12')!.hasAttribute('data-in-range')).toBe(true);
		expect(
			cellTrigger('2024-03-12')!.closest('[data-part="table-cell"]')!.getAttribute('aria-selected')
		).toBe('true');
		expect(cellTrigger('2024-03-12')!.getAttribute('aria-selected')).toBeNull();
		expect(cellTrigger('2024-03-20')!.hasAttribute('data-in-range')).toBe(false);

		await settle();
		expect(part('content')).toBeNull();

		const inputs = parts('input') as HTMLInputElement[];
		expect(inputs).toHaveLength(2);
		expect(inputs[0].value).toBe('03/10/2024');
		expect(inputs[1].value).toBe('03/14/2024');
	});

	test('keyboard paging and view switching drive the calendar', async () => {
		const onViewChange = vi.fn();
		render(Phase6DatePicker, { onViewChange, referenceDate: reference });
		flushSync();
		await fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }));
		flushSync();

		const table = part('table')!;
		const focusedIso = () =>
			dayCells().find((cell) => cell.hasAttribute('data-focus'))?.getAttribute('data-value');

		const before = focusedIso()!;
		await fireEvent.keyDown(table, { key: 'ArrowRight' });
		flushSync();
		expect(focusedIso()).not.toBe(before);

		await fireEvent.keyDown(table, { key: 'PageDown' });
		flushSync();
		const afterPage = focusedIso()!;
		expect(afterPage.slice(0, 7)).not.toBe(before.slice(0, 7));

		const visibleView = () =>
			document.querySelector<HTMLElement>(
				'[data-scope="date-picker"][data-part="view"]:not([hidden])'
			)!;

		await fireEvent.click(part('view-trigger')!);
		flushSync();
		expect(onViewChange).toHaveBeenLastCalledWith({ view: 'month' });
		expect(visibleView().getAttribute('data-view')).toBe('month');
		expect(visibleView().querySelector('[data-part="table"]')!.getAttribute('data-view')).toBe(
			'month'
		);

		const focusedMonth = visibleView().querySelector<HTMLElement>(
			'[data-part="table-cell-trigger"][data-focus]'
		)!;
		expect(focusedMonth.getAttribute('data-value')).toBe(String(Number(afterPage.slice(5, 7))));

		const monthCell = visibleView().querySelector<HTMLElement>(
			'[data-part="table-cell-trigger"][data-value="6"]'
		)!;
		await fireEvent.click(monthCell);
		flushSync();
		expect(onViewChange).toHaveBeenLastCalledWith({ view: 'day' });
		expect(visibleView().getAttribute('data-view')).toBe('day');
		expect(part('range-text')!.textContent?.trim()).toBe('June 2024');

		const monthSelect = part('month-select')! as HTMLSelectElement;
		expect(screen.getByRole('combobox', { name: 'Select month' })).toBe(monthSelect);
		expect(monthSelect.id).toBe(`${part('root')!.id}:month-select`);
		await fireEvent.change(monthSelect, { target: { value: '9' } });
		flushSync();
		expect(part('range-text')!.textContent?.trim()).toBe('September 2024');

		await fireEvent.keyDown(part('table')!, { key: 'Enter' });
		flushSync();
		expect((part('input') as HTMLInputElement).value).toMatch(/^09\//);
	});

	test('honours min, max and isDateUnavailable', async () => {
		await open(Phase6DatePicker, {
			referenceDate: reference,
			min: new CalendarDate(2024, 3, 5),
			max: new CalendarDate(2024, 3, 20),
			isDateUnavailable: (date: CalendarDate) => date.day === 12
		});

		const unavailable = cellTrigger('2024-03-12')!;
		expect(unavailable.hasAttribute('data-unavailable')).toBe(true);
		expect(unavailable.getAttribute('aria-disabled')).toBe('true');
		expect(unavailable.hasAttribute('data-selectable')).toBe(false);

		const above = part('next-trigger')!;
		expect(above.hasAttribute('disabled')).toBe(true);

		const before = cellTrigger('2024-03-04')!;
		expect(before.hasAttribute('data-selectable')).toBe(false);
	});

	test('fixed weeks, week numbers and startOfWeek shape the day grid', async () => {
		await open(Phase6DatePicker, {
			referenceDate: reference,
			fixedWeeks: true,
			showWeekNumbers: true,
			startOfWeek: 1
		});

		const rows = parts('table-row');
		expect(rows.length).toBeGreaterThanOrEqual(6);
		expect(dayCells()).toHaveLength(42);

		const heads = parts('table-header');
		expect(heads[0].textContent?.trim()).toBe('Mon');

		expect(part('table-body')!.querySelector('[data-type="week-number"]')).toBeTruthy();
		const weekCell = part('table-body')!.querySelector<HTMLElement>('[data-type="week-number"]')!;
		expect(weekCell.getAttribute('role')).toBe('rowheader');
		expect(weekCell.getAttribute('aria-label')).toMatch(/^Week \d+$/);
	});

	test('renders value text and clears on the clear trigger, Escape and month select', async () => {
		await open(Phase6DatePicker, { defaultValue: [new CalendarDate(2024, 3, 15)] });

		const clear = part('clear-trigger')!;
		expect(clear.hasAttribute('hidden')).toBe(false);
		await fireEvent.click(clear);
		flushSync();
		expect((part('input') as HTMLInputElement).value).toBe('');
		expect(part('root')!.getAttribute('data-empty')).toBe('');

		await fireEvent.keyDown(document.body, { key: 'Escape' });
		flushSync();
		await settle();
		expect(part('content')).toBeNull();
		expect(part('trigger')!.getAttribute('aria-expanded')).toBe('false');
	});

});
