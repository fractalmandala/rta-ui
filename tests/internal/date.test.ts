import { describe, expect, test } from 'vitest';
import {
	CalendarDate,
	DateFormatter,
	endOfWeek,
	endOfYear,
	getMonthGrid,
	getWeekDays,
	isWeekend,
	parseDate,
	startOfWeek,
	startOfYear,
	today
} from '../../src/lib/internal/date';

describe('calendar date', () => {
	test('civil arithmetic clamps to month lengths and carries years', () => {
		expect(new CalendarDate(2024, 3, 15).add({ days: 20 }).toString()).toBe('2024-04-04');
		expect(new CalendarDate(2024, 1, 31).add({ months: 1 }).toString()).toBe('2024-02-29');
		expect(new CalendarDate(2023, 12, 31).add({ days: 1 }).toString()).toBe('2024-01-01');
		expect(new CalendarDate(2024, 3, 1).subtract({ days: 1 }).toString()).toBe('2024-02-29');
		expect(new CalendarDate(2024, 13, 1).toString()).toBe('2025-01-01');
		expect(parseDate('2024-02-29').daysInMonth).toBe(29);
	});

	test('week days and weekend detection', () => {
		expect(new CalendarDate(2024, 1, 7).dayOfWeek).toBe(0);
		expect(new CalendarDate(2024, 3, 15).dayOfWeek).toBe(5);
		expect(isWeekend(new CalendarDate(2024, 3, 16))).toBe(true);
		expect(isWeekend(new CalendarDate(2024, 3, 15))).toBe(false);
	});

	test('week and year boundaries', () => {
		const value = new CalendarDate(2024, 3, 15);
		expect(startOfWeek(value, 0).toString()).toBe('2024-03-10');
		expect(endOfWeek(value, 0).toString()).toBe('2024-03-16');
		expect(startOfWeek(value, 1).toString()).toBe('2024-03-11');
		expect(startOfYear(value).toString()).toBe('2024-01-01');
		expect(endOfYear(value).toString()).toBe('2024-12-31');
	});

	test('month grid covers the whole month with neighbours', () => {
		const grid = getMonthGrid(new CalendarDate(2024, 3, 15), { firstDay: 0 });
		expect(grid).toHaveLength(6);
		expect(grid[0][0].toString()).toBe('2024-02-25');
		expect(grid[5][6].toString()).toBe('2024-04-06');
	});

	test('week days follow the locale first day', () => {
		expect(getWeekDays('en-US').map((day) => day.value)).toEqual([0, 1, 2, 3, 4, 5, 6]);
		expect(getWeekDays('en-US')[0].long).toBe('Sunday');
	});

	test('the formatter prints the calendar day it was given', () => {
		const formatter = new DateFormatter('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
		// Regression: formatting `toDate()` in UTC shifted the printed day outside UTC.
		expect(formatter.format(new CalendarDate(2024, 3, 15))).toBe('03/15/2024');
		expect(formatter.format(today())).toBeTruthy();
	});
});
