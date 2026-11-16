import { cleanup, fireEvent, render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { CalendarDate } from '../src/lib/internal/date';
import Phase6DateInput from './harness/Phase6DateInput.svelte';

afterEach(cleanup);

const part = (name: string) =>
	document.querySelector<HTMLElement>(`[data-scope="date-input"][data-part="${name}"]`);
const segments = () => [
	...document.querySelectorAll<HTMLElement>('[data-scope="date-input"][data-part="segment"]')
];
const editable = () => segments().filter((segment) => segment.getAttribute('role') === 'spinbutton');
const segmentOf = (type: string) =>
	document.querySelector<HTMLElement>(
		`[data-scope="date-input"][data-part="segment"][data-segment="${type}"]`
	)!;

describe('date-input', () => {
	test('renders the segmented field contract', () => {
		render(Phase6DateInput, {});
		flushSync();

		const root = part('root')!;
		expect(root.getAttribute('data-slot')).toBe('date-input-root');
		expect(root.id).toMatch(/^date-input:/);

		const label = part('label')!;
		expect(label.getAttribute('data-slot')).toBe('date-input-label');
		expect(label.getAttribute('for')).toBe(`${root.id}:hidden-input:0`);

		const control = part('control')!;
		expect(control.id).toBe(`${root.id}:control`);

		const group = part('segment-group')!;
		expect(group.getAttribute('role')).toBe('group');
		expect(group.getAttribute('aria-labelledby')).toBe(label.id);
		expect(group.getAttribute('style')).toContain('unicode-bidi');

		const rendered = segments();
		expect(rendered).toHaveLength(5);
		expect(rendered.map((segment) => segment.getAttribute('data-segment'))).toEqual([
			'month',
			'literal',
			'day',
			'literal',
			'year'
		]);
		expect(rendered[1].textContent?.trim()).toBe('/');

		const [month, day, year] = editable();
		expect(month.getAttribute('role')).toBe('spinbutton');
		expect(month.getAttribute('aria-label')).toBe('Month');
		expect(month.getAttribute('aria-valuemin')).toBe('1');
		expect(month.getAttribute('aria-valuemax')).toBe('12');
		expect(month.getAttribute('aria-valuetext')).toBe('mm');
		expect(month.getAttribute('contenteditable')).toBe('true');
		expect(month.getAttribute('tabindex')).toBe('0');
		expect(month.hasAttribute('data-placeholder')).toBe(true);
		expect(month.hasAttribute('data-filled')).toBe(false);
		expect(day.getAttribute('aria-label')).toBe('Day');
		expect(year.getAttribute('aria-valuemax')).toBe('9999');
		expect(year.textContent?.trim()).toBe('yyyy');

		const hidden = part('hidden-input') as HTMLInputElement;
		expect(hidden.getAttribute('type')).toBe('hidden');
		expect(hidden.name).toBe('appointment');
		expect(hidden.value).toBe('');
		expect(hidden.getAttribute('data-slot')).toBe('date-input-hidden-input');
	});

	test('types digits into each segment and commits the ISO form value', async () => {
		const onValueChange = vi.fn();
		render(Phase6DateInput, { onValueChange });
		flushSync();

		const [month, day, year] = editable();
		await fireEvent.focus(month);
		flushSync();
		expect(part('control')!.hasAttribute('data-focus')).toBe(true);

		await fireEvent.keyDown(month, { key: '3' });
		flushSync();
		await fireEvent.keyDown(day, { key: '1' });
		await fireEvent.keyDown(day, { key: '5' });
		flushSync();

		expect(segmentOf('month').textContent?.trim()).toBe('3');
		expect(segmentOf('month').hasAttribute('data-filled')).toBe(true);

		await fireEvent.keyDown(year, { key: '2' });
		await fireEvent.keyDown(year, { key: '0' });
		await fireEvent.keyDown(year, { key: '2' });
		await fireEvent.keyDown(year, { key: '4' });
		flushSync();

		expect(segmentOf('year').textContent?.trim()).toBe('2024');
		const last = onValueChange.mock.calls.at(-1)![0];
		expect(last.value).toHaveLength(1);
		expect(last.value[0].toString()).toBe('2024-03-15');
		expect(last.valueAsString[0]).toBe('2024-03-15');

		const hidden = part('hidden-input') as HTMLInputElement;
		expect(hidden.value).toBe('2024-03-15');
	});

	test('binds value and defaultValue as ISO strings', async () => {
		render(Phase6DateInput, { value: '2024-07-04' });
		flushSync();

		expect(segmentOf('month').textContent?.trim()).toBe('7');
		expect(segmentOf('day').textContent?.trim()).toBe('4');
		expect(segmentOf('year').textContent?.trim()).toBe('2024');
		expect((part('hidden-input') as HTMLInputElement).value).toBe('2024-07-04');

		cleanup();
		render(Phase6DateInput, { defaultValue: new CalendarDate(2023, 12, 31) });
		flushSync();
		expect((part('hidden-input') as HTMLInputElement).value).toBe('2023-12-31');
		expect(segmentOf('month').textContent?.trim()).toBe('12');
	});

	test('arrow keys move between segments and adjust values', async () => {
		render(Phase6DateInput, { defaultValue: new CalendarDate(2024, 3, 15) });
		flushSync();

		const [month, day, year] = editable();
		await fireEvent.focus(month);
		flushSync();
		expect(month.hasAttribute('data-focus')).toBe(true);

		await fireEvent.keyDown(month, { key: 'ArrowRight' });
		flushSync();
		expect(segmentOf('day').hasAttribute('data-focus')).toBe(true);
		expect(segmentOf('month').hasAttribute('data-focus')).toBe(false);

		await fireEvent.keyDown(segmentOf('day'), { key: 'ArrowRight' });
		flushSync();
		expect(segmentOf('year').hasAttribute('data-focus')).toBe(true);

		await fireEvent.keyDown(segmentOf('year'), { key: 'ArrowLeft' });
		flushSync();
		expect(segmentOf('day').hasAttribute('data-focus')).toBe(true);

		await fireEvent.keyDown(segmentOf('day'), { key: 'ArrowUp' });
		flushSync();
		expect((part('hidden-input') as HTMLInputElement).value).toBe('2024-03-16');

		await fireEvent.keyDown(segmentOf('day'), { key: 'ArrowDown' });
		flushSync();
		expect((part('hidden-input') as HTMLInputElement).value).toBe('2024-03-15');

		await fireEvent.keyDown(year, { key: 'PageUp' });
		flushSync();
		expect((part('hidden-input') as HTMLInputElement).value).toBe('2029-03-15');
	});

	test('backspace clears a filled segment and steps back from a placeholder', async () => {
		render(Phase6DateInput, { defaultValue: new CalendarDate(2024, 3, 15) });
		flushSync();

		await fireEvent.focus(segmentOf('day'));
		flushSync();
		await fireEvent.keyDown(segmentOf('day'), { key: 'Backspace' });
		flushSync();
		expect(segmentOf('day').hasAttribute('data-placeholder')).toBe(true);
		expect(segmentOf('day').textContent?.trim()).toBe('dd');
		expect((part('hidden-input') as HTMLInputElement).value).toBe('2024-03-15');

		await fireEvent.keyDown(segmentOf('day'), { key: 'Backspace' });
		flushSync();
		expect(segmentOf('month').hasAttribute('data-focus')).toBe(true);

		await fireEvent.keyDown(segmentOf('month'), { key: 'Backspace' });
		flushSync();
		expect(segmentOf('month').hasAttribute('data-placeholder')).toBe(true);
		expect(segmentOf('month').textContent?.trim()).toBe('mm');
		expect((part('hidden-input') as HTMLInputElement).value).toBe('2024-03-15');
	});

	test('month segment accepts a typeahead month name', async () => {
		render(Phase6DateInput, { defaultValue: new CalendarDate(2024, 3, 15) });
		flushSync();

		await fireEvent.focus(segmentOf('month'));
		flushSync();
		await fireEvent.keyDown(segmentOf('month'), { key: 'o' });
		flushSync();
		expect(segmentOf('month').textContent?.trim()).toBe('10');
		expect((part('hidden-input') as HTMLInputElement).value).toBe('2024-10-15');
	});

	test('clamps committed values to min and max', async () => {
		const onValueChange = vi.fn();
		render(Phase6DateInput, {
			onValueChange,
			min: new CalendarDate(2024, 5, 10),
			max: new CalendarDate(2024, 5, 20)
		});
		flushSync();

		await fireEvent.focus(segmentOf('month'));
		flushSync();
		await fireEvent.keyDown(segmentOf('month'), { key: '3' });
		await fireEvent.keyDown(segmentOf('day'), { key: '1' });
		await fireEvent.keyDown(segmentOf('year'), { key: '2' });
		await fireEvent.keyDown(segmentOf('year'), { key: '0' });
		await fireEvent.keyDown(segmentOf('year'), { key: '2' });
		await fireEvent.keyDown(segmentOf('year'), { key: '4' });
		flushSync();

		const last = onValueChange.mock.calls.at(-1)![0];
		expect(last.value[0].toString()).toBe('2024-05-10');
		expect((part('hidden-input') as HTMLInputElement).value).toBe('2024-05-10');
	});

	test('honours disabled and readOnly without trapping the segment contract', async () => {
		render(Phase6DateInput, { disabled: true, defaultValue: '2024-03-15' });
		flushSync();

		const root = part('root')!;
		expect(root.hasAttribute('data-disabled')).toBe(true);
		expect((part('hidden-input') as HTMLInputElement).disabled).toBe(true);
		const month = segmentOf('month');
		expect(month.getAttribute('aria-disabled')).toBe('true');
		expect(month.hasAttribute('data-editable')).toBe(false);
		expect(month.hasAttribute('contenteditable')).toBe(false);

		cleanup();
		render(Phase6DateInput, { readOnly: true, defaultValue: '2024-03-15' });
		flushSync();
		expect(part('control')!.hasAttribute('data-readonly')).toBe(true);
		expect(segmentOf('day').getAttribute('aria-readonly')).toBe('true');
	});
});
