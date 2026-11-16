// Family-local port of the subset of `@zag-js/date-utils` the date picker machine depends on.
// `src/lib/internal/date.ts` owns civil-date arithmetic; everything here is calendar layout and
// range math built on top of it, so the family stays dependency-free.
import {
	CalendarDate,
	compareDates,
	endOfMonth,
	firstDayOfWeek,
	isSameDay,
	startOfMonth,
	today,
	type DateDuration
} from '../../internal/date';

export interface DateValueFields {
	year: number;
	month: number;
	day: number;
}

export const addDays = (date: CalendarDate, value: number) => date.add({ days: value });
export const addMonths = (date: CalendarDate, value: number) => date.add({ months: value });
export const addYears = (date: CalendarDate, value: number) => date.add({ years: value });

export const startOfYear = (date: CalendarDate) => date.set({ month: 1, day: 1 });
export const endOfYear = (date: CalendarDate) => date.set({ month: 12, day: 31 });

export const startOfWeekDate = (date: CalendarDate, firstDay: number) => {
	const diff = (date.dayOfWeek - firstDay + 7) % 7;
	return date.subtract({ days: diff });
};

export const endOfWeekDate = (date: CalendarDate, firstDay: number) => {
	const start = startOfWeekDate(date, firstDay);
	return start.add({ days: 6 });
};

export const resolveFirstDay = (startOfWeek?: number | null, locale = 'en-US') =>
	startOfWeek ?? firstDayOfWeek(locale);

export const getWeeksInMonth = (date: CalendarDate, locale = 'en-US', firstDay?: number | null) => {
	const first = resolveFirstDay(firstDay, locale);
	const start = startOfWeekDate(startOfMonth(date), first);
	const end = endOfWeekDate(endOfMonth(date), first);
	return Math.round((end.valueOf() - start.valueOf()) / 7) + 1;
};

export function getDaysInWeek(
	weekIndex: number,
	from: CalendarDate,
	locale = 'en-US',
	firstDay?: number | null
): CalendarDate[] {
	const weekDate = from.add({ days: weekIndex * 7 });
	const first = resolveFirstDay(firstDay, locale);
	const start = startOfWeekDate(weekDate, first);
	return Array.from({ length: 7 }, (_, index) => start.add({ days: index }));
}

export function getMonthDays(
	from: CalendarDate,
	locale = 'en-US',
	numOfWeeks?: number,
	firstDay?: number | null
): CalendarDate[][] {
	const weeks = numOfWeeks ?? getWeeksInMonth(from, locale, firstDay);
	return Array.from({ length: weeks }, (_, index) => getDaysInWeek(index, from, locale, firstDay));
}

export interface WeekDayValue {
	value: CalendarDate;
	short: string;
	long: string;
	narrow: string;
}

export function getWeekDayValues(
	date: CalendarDate,
	startOfWeek?: number | null,
	locale = 'en-US'
): WeekDayValue[] {
	const first = resolveFirstDay(startOfWeek, locale);
	const start = startOfWeekDate(date, first);
	const short = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
	const long = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
	const narrow = new Intl.DateTimeFormat(locale, { weekday: 'narrow', timeZone: 'UTC' });
	return Array.from({ length: 7 }, (_, index) => {
		const value = start.add({ days: index });
		const jsDate = new Date(Date.UTC(value.year, value.month - 1, value.day));
		return {
			value,
			short: short.format(jsDate),
			long: long.format(jsDate),
			narrow: narrow.format(jsDate)
		};
	});
}

export function getMonthNameList(locale = 'en-US', format: 'short' | 'long' = 'long'): string[] {
	const formatter = new Intl.DateTimeFormat(locale, { month: format, timeZone: 'UTC' });
	return Array.from({ length: 12 }, (_, index) => formatter.format(new Date(Date.UTC(2021, index, 1))));
}

export function getWeekOfYear(date: CalendarDate, locale = 'en-US'): number {
	const monday = startOfWeekDate(date, 1);
	const year = monday.year;
	const jan4 = monday.set({ month: 1, day: 4 });
	const week1Monday = startOfWeekDate(jan4, 1);
	if (monday.valueOf() >= week1Monday.valueOf()) {
		return 1 + Math.floor((monday.valueOf() - week1Monday.valueOf()) / 7);
	}
	const previousJan4 = monday.set({ year: year - 1, month: 1, day: 4 });
	const previousWeek1Monday = startOfWeekDate(previousJan4, 1);
	return 1 + Math.floor((monday.valueOf() - previousWeek1Monday.valueOf()) / 7);
}

export const getDecadeRange = (year: number): number[] => {
	const start = year - (year % 10);
	return Array.from({ length: 10 }, (_, index) => start + index);
};

export interface YearRange {
	from: number;
	to: number;
}

const DEFAULT_MIN_YEAR = 1900;
const DEFAULT_MAX_YEAR = 2099;

export const getDefaultYearRange = (
	min?: DateValueFields | null,
	max?: DateValueFields | null
): YearRange => ({
	from: min?.year ?? DEFAULT_MIN_YEAR,
	to: max?.year ?? DEFAULT_MAX_YEAR
});

export const getYearsRangeList = (range: YearRange): number[] => {
	const years: number[] = [];
	for (let year = range.from; year <= range.to; year += 1) years.push(year);
	return years;
};

export const maxOf = (a: CalendarDate, b: CalendarDate) => (compareDates(a, b) >= 0 ? a : b);
export const minOf = (a: CalendarDate, b: CalendarDate) => (compareDates(a, b) <= 0 ? a : b);

export interface VisibleDuration {
	years?: number;
	months?: number;
	weeks?: number;
	days?: number;
}

export const getUnitDuration = (duration: VisibleDuration): VisibleDuration => {
	const clone: VisibleDuration = {};
	for (const key of Object.keys(duration) as (keyof VisibleDuration)[]) clone[key] = 1;
	return clone;
};

export const addDuration = (date: CalendarDate, duration: VisibleDuration): CalendarDate => {
	let result = date;
	if (duration.years) result = addYears(result, duration.years);
	if (duration.months) result = addMonths(result, duration.months);
	if (duration.weeks) result = addDays(result, duration.weeks * 7);
	if (duration.days) result = addDays(result, duration.days);
	return result;
};

export const subtractDuration = (date: CalendarDate, duration: VisibleDuration): CalendarDate =>
	addDuration(date, {
		years: -(duration.years ?? 0) || undefined,
		months: -(duration.months ?? 0) || undefined,
		weeks: -(duration.weeks ?? 0) || undefined,
		days: -(duration.days ?? 0) || undefined
	});

export const getEndDate = (startDate: CalendarDate, duration: VisibleDuration): CalendarDate => {
	const clone: VisibleDuration = { ...duration };
	if (clone.days) clone.days -= 1;
	else clone.days = -1;
	return addDuration(startDate, clone);
};

export const isDateOutsideRange = (
	date: DateValueFields,
	start?: DateValueFields | null,
	end?: DateValueFields | null
) =>
	(start != null && compareDates(date, start) < 0) || (end != null && compareDates(date, end) > 0);

export const isDateEqual = (a?: DateValueFields | null, b?: DateValueFields | null) => {
	if (a == null || b == null) return a === b;
	return isSameDay(a, b);
};

export const isDateUnavailable = (
	date: CalendarDate | null | undefined,
	isUnavailable: ((date: CalendarDate, locale?: string) => boolean) | undefined,
	locale: string,
	min?: DateValueFields | null,
	max?: DateValueFields | null
) => {
	if (!date) return false;
	if (isUnavailable?.(date, locale)) return true;
	return isDateOutsideRange(date, min, max);
};

export const isPreviousRangeInvalid = (
	startDate: CalendarDate,
	min?: DateValueFields | null,
	max?: DateValueFields | null
) => isDateOutsideRange(addDays(startDate, -1), min, max);

export const isNextRangeInvalid = (
	endDate: CalendarDate,
	min?: DateValueFields | null,
	max?: DateValueFields | null
) => isDateOutsideRange(addDays(endDate, 1), min, max);

export const getTodayDate = (timeZone?: string) => today(timeZone);

export const constrainValue = (
	date: CalendarDate,
	min?: DateValueFields | null,
	max?: DateValueFields | null
): CalendarDate => {
	let result = date;
	if (min) result = maxOf(result, new CalendarDate(min.year, min.month, min.day));
	if (max) result = minOf(result, new CalendarDate(max.year, max.month, max.day));
	return result;
};

const alignStartBase = (date: CalendarDate, duration: VisibleDuration, locale: string): CalendarDate => {
	if (duration.years) return startOfYear(date);
	if (duration.months) return startOfMonth(date);
	if (duration.weeks) return startOfWeekDate(date, resolveFirstDay(undefined, locale));
	return date;
};

const constrainStart = (
	date: CalendarDate,
	aligned: CalendarDate,
	duration: VisibleDuration,
	locale: string,
	min?: DateValueFields | null,
	max?: DateValueFields | null
) => {
	let result = aligned;
	if (min && compareDates(date, min) >= 0) {
		result = maxOf(result, alignStartBase(new CalendarDate(min.year, min.month, min.day), duration, locale));
	}
	if (max && compareDates(date, max) <= 0) {
		result = minOf(result, alignEndBase(new CalendarDate(max.year, max.month, max.day), duration, locale));
	}
	return result;
};

export const alignStart = (
	date: CalendarDate,
	duration: VisibleDuration,
	locale: string,
	min?: DateValueFields | null,
	max?: DateValueFields | null
) => constrainStart(date, alignStartBase(date, duration, locale), duration, locale, min, max);

const alignEndBase = (
	date: CalendarDate,
	duration: VisibleDuration,
	locale: string
): CalendarDate => {
	const trimmed: VisibleDuration = { ...duration };
	if (trimmed.days) trimmed.days -= 1;
	else if (trimmed.weeks) trimmed.weeks -= 1;
	else if (trimmed.months) trimmed.months -= 1;
	else if (trimmed.years) trimmed.years -= 1;
	const aligned = alignStartBase(date, duration, locale);
	return subtractDuration(aligned, trimmed);
};

export const alignEnd = (
	date: CalendarDate,
	duration: VisibleDuration,
	locale: string,
	min?: DateValueFields | null,
	max?: DateValueFields | null
) => {
	const trimmed: VisibleDuration = { ...duration };
	if (trimmed.days) trimmed.days -= 1;
	else if (trimmed.weeks) trimmed.weeks -= 1;
	else if (trimmed.months) trimmed.months -= 1;
	else if (trimmed.years) trimmed.years -= 1;
	const aligned = subtractDuration(alignStartBase(date, duration, locale), trimmed);
	return constrainStart(date, aligned, duration, locale, min, max);
};

export const alignCenter = (
	date: CalendarDate,
	duration: VisibleDuration,
	locale: string,
	min?: DateValueFields | null,
	max?: DateValueFields | null
) => {
	const half: VisibleDuration = {};
	for (const key of Object.keys(duration) as (keyof VisibleDuration)[]) {
		const value = duration[key];
		if (value == null) continue;
		half[key] = Math.floor(value / 2);
		if (half[key]! > 0 && value % 2 === 0) half[key] = half[key]! - 1;
	}
	return constrainStart(
		date,
		subtractDuration(alignStartBase(date, duration, locale), half),
		duration,
		locale,
		min,
		max
	);
};

export const alignDate = (
	date: CalendarDate,
	alignment: 'start' | 'end' | 'center',
	duration: VisibleDuration,
	locale: string,
	min?: DateValueFields | null,
	max?: DateValueFields | null
) => {
	if (alignment === 'start') return alignStart(date, duration, locale, min, max);
	if (alignment === 'end') return alignEnd(date, duration, locale, min, max);
	return alignCenter(date, duration, locale, min, max);
};

export interface AdjustedDate {
	startDate: CalendarDate;
	focusedDate: CalendarDate;
	endDate: CalendarDate;
}

const adjustDate = (
	visibleDuration: VisibleDuration,
	locale: string,
	min?: DateValueFields | null,
	max?: DateValueFields | null
) => {
	const getDate = (options: { startDate: CalendarDate; focusedDate: CalendarDate }): AdjustedDate => {
		const { startDate, focusedDate } = options;
		const endDate = getEndDate(startDate, visibleDuration);
		if (isDateOutsideRange(focusedDate, min, max)) {
			return { startDate, endDate, focusedDate: constrainValue(focusedDate, min, max) };
		}
		if (compareDates(focusedDate, startDate) < 0) {
			return {
				startDate: alignEnd(focusedDate, visibleDuration, locale, min, max),
				endDate,
				focusedDate: constrainValue(focusedDate, min, max)
			};
		}
		if (compareDates(focusedDate, endDate) > 0) {
			return {
				startDate: alignStart(focusedDate, visibleDuration, locale, min, max),
				endDate,
				focusedDate: constrainValue(focusedDate, min, max)
			};
		}
		return { startDate, endDate, focusedDate: constrainValue(focusedDate, min, max) };
	};
	return getDate;
};

export function getNextPage(
	focusedDate: CalendarDate,
	startDate: CalendarDate,
	visibleDuration: VisibleDuration,
	locale: string,
	min?: DateValueFields | null,
	max?: DateValueFields | null
): AdjustedDate {
	const adjust = adjustDate(visibleDuration, locale, min, max);
	const start = addDuration(startDate, visibleDuration);
	return adjust({
		focusedDate: addDuration(focusedDate, visibleDuration),
		startDate: alignStart(constrainStart(focusedDate, start, visibleDuration, locale, min, max), visibleDuration, locale)
	});
}

export function getPreviousPage(
	focusedDate: CalendarDate,
	startDate: CalendarDate,
	visibleDuration: VisibleDuration,
	locale: string,
	min?: DateValueFields | null,
	max?: DateValueFields | null
): AdjustedDate {
	const adjust = adjustDate(visibleDuration, locale, min, max);
	const start = subtractDuration(startDate, visibleDuration);
	return adjust({
		focusedDate: subtractDuration(focusedDate, visibleDuration),
		startDate: alignStart(constrainStart(focusedDate, start, visibleDuration, locale, min, max), visibleDuration, locale)
	});
}

export function getNextSection(
	focusedDate: CalendarDate,
	startDate: CalendarDate,
	larger: boolean,
	visibleDuration: VisibleDuration,
	locale: string,
	min?: DateValueFields | null,
	max?: DateValueFields | null
): AdjustedDate {
	const adjust = adjustDate(visibleDuration, locale, min, max);
	if (!larger && !visibleDuration.days) {
		return adjust({ focusedDate: addDuration(focusedDate, getUnitDuration(visibleDuration)), startDate });
	}
	if (visibleDuration.weeks) return adjust({ focusedDate: addMonths(focusedDate, 1), startDate });
	return adjust({ focusedDate: addYears(focusedDate, 1), startDate });
}

export function getPreviousSection(
	focusedDate: CalendarDate,
	startDate: CalendarDate,
	larger: boolean,
	visibleDuration: VisibleDuration,
	locale: string,
	min?: DateValueFields | null,
	max?: DateValueFields | null
): AdjustedDate {
	const adjust = adjustDate(visibleDuration, locale, min, max);
	if (!larger && !visibleDuration.days) {
		return adjust({ focusedDate: subtractDuration(focusedDate, getUnitDuration(visibleDuration)), startDate });
	}
	if (visibleDuration.weeks) return adjust({ focusedDate: subtractDuration(focusedDate, { months: 1 }), startDate });
	return adjust({ focusedDate: subtractDuration(focusedDate, { years: 1 }), startDate });
}

export const toUtcDate = (value: CalendarDate) =>
	new Date(Date.UTC(value.year, value.month - 1, value.day));

export class CalFormatter {
	private readonly formatter: Intl.DateTimeFormat;

	constructor(locale: string, options: Intl.DateTimeFormatOptions = {}) {
		this.formatter = new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options });
	}

	format(value: CalendarDate): string {
		return this.formatter.format(toUtcDate(value));
	}

	formatToParts(value: CalendarDate): Intl.DateTimeFormatPart[] {
		return this.formatter.formatToParts(toUtcDate(value));
	}
}

export const formatCalDate = (
	locale: string,
	options: Intl.DateTimeFormatOptions,
	value: CalendarDate
) => new CalFormatter(locale, options).format(value);

export const getDayFormatter = (locale: string) =>
	new CalFormatter(locale, {
		weekday: 'long',
		month: 'long',
		year: 'numeric',
		day: 'numeric'
	});

export const getMonthFormatter = (locale: string) =>
	new CalFormatter(locale, { month: 'long', year: 'numeric' });

export const formatSelectedDate = (
	startDate: CalendarDate | null | undefined,
	endDate: CalendarDate | null | undefined,
	locale = 'en-US'
) => {
	if (!startDate) return '';
	const end = endDate ?? startDate;
	const formatter = getDayFormatter(locale);
	if (isSameDay(startDate, end)) return formatter.format(startDate);
	return `${formatter.format(startDate)} \u2013 ${formatter.format(end)}`;
};

export const getVisibleRangeText = (options: {
	view: 'day' | 'month' | 'year';
	startValue: CalendarDate;
	endValue: CalendarDate;
	locale: string;
	selectionMode: 'single' | 'multiple' | 'range';
}) => {
	const { view, startValue, endValue, locale, selectionMode } = options;
	if (view === 'year') {
		const years = getDecadeRange(startValue.year);
		const start = String(years[0]);
		const end = String(years[years.length - 1]);
		return { start, end, formatted: `${start} - ${end}` };
	}
	const formatter =
		view === 'month'
			? new CalFormatter(locale, { year: 'numeric' })
			: new CalFormatter(locale, { month: 'long', year: 'numeric' });
	const start = formatter.format(startValue);
	const end = formatter.format(endValue);
	return {
		start,
		end,
		formatted: selectionMode === 'range' ? `${start} - ${end}` : start
	};
};

export type DateRangePreset =
	| 'thisWeek'
	| 'thisMonth'
	| 'thisQuarter'
	| 'thisYear'
	| 'last3Days'
	| 'last7Days'
	| 'last14Days'
	| 'last30Days'
	| 'last90Days'
	| 'lastMonth'
	| 'lastQuarter'
	| 'lastWeek'
	| 'lastYear';

export const getDateRangePreset = (
	preset: DateRangePreset,
	locale = 'en-US'
): [CalendarDate, CalendarDate] => {
	const current = today();
	const first = resolveFirstDay(undefined, locale);
	switch (preset) {
		case 'thisWeek':
			return [startOfWeekDate(current, first), endOfWeekDate(current, first)];
		case 'thisMonth':
			return [startOfMonth(current), current];
		case 'thisQuarter':
			return [addMonths(startOfMonth(current), -((current.month - 1) % 3)), current];
		case 'thisYear':
			return [startOfYear(current), current];
		case 'last3Days':
			return [addDays(current, -2), current];
		case 'last7Days':
			return [addDays(current, -6), current];
		case 'last14Days':
			return [addDays(current, -13), current];
		case 'last30Days':
			return [addDays(current, -29), current];
		case 'last90Days':
			return [addDays(current, -89), current];
		case 'lastMonth':
			return [startOfMonth(addMonths(current, -1)), endOfMonth(addMonths(current, -1))];
		case 'lastQuarter': {
			const offset = (current.month - 1) % 3;
			return [startOfMonth(addMonths(current, -offset - 3)), endOfMonth(addMonths(current, -offset - 1))];
		}
		case 'lastWeek':
			return [
				addDays(startOfWeekDate(current, first), -7),
				addDays(endOfWeekDate(current, first), -7)
			];
		case 'lastYear':
			return [startOfYear(addYears(current, -1)), endOfYear(addYears(current, -1))];
		default:
			throw new Error(`Invalid date range preset: ${preset}`);
	}
};

const FUTURE_YEAR_COERCION = 10;

export const normalizeYear = (year: string | null | undefined): string | undefined => {
	if (!year) return undefined;
	if (year.length === 3) return year.padEnd(4, '0');
	if (year.length === 2) {
		const currentYear = new Date().getFullYear();
		const currentCentury = Math.floor(currentYear / 100) * 100;
		const twoDigitYear = Number.parseInt(year.slice(-2), 10);
		const fullYear = currentCentury + twoDigitYear;
		return (fullYear > currentYear + FUTURE_YEAR_COERCION ? fullYear - 100 : fullYear).toString();
	}
	return year;
};

const isValidYear = (year?: string | null) => year != null && year.length === 4;
const isValidMonth = (month?: string | null) => month != null && Number.parseFloat(month) <= 12;
const isValidDay = (day?: string | null) => day != null && Number.parseFloat(day) <= 31;

/** Parses the free-text input value using the locale's numeric date order. */
export function parseDateString(value: string, locale = 'en-US'): CalendarDate | undefined {
	const formatter = new Intl.DateTimeFormat(locale, {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
		timeZone: 'UTC'
	});
	const parts = formatter.formatToParts(new Date(Date.UTC(2000, 11, 25)));
	const order = parts.filter((part) => part.type !== 'literal').map((part) => part.type);
	const separator = parts.find((part) => part.type === 'literal')?.value ?? '/';
	const chunks = value.split(separator).map((chunk) => chunk.trim());
	const fields: Record<string, string | undefined> = {};
	order.forEach((type, index) => {
		fields[type] = chunks[index];
	});
	let { year, month, day } = fields;
	if (year != null || month != null || day != null) {
		const now = new Date();
		year ||= now.getFullYear().toString();
		month ||= (now.getMonth() + 1).toString();
		day ||= now.getDate().toString();
	}
	if (!isValidYear(year)) year = normalizeYear(year);
	if (isValidYear(year) && isValidMonth(month) && isValidDay(day)) {
		return new CalendarDate(Number(year), Number(month), Number(day));
	}
	const time = Date.parse(value);
	if (!Number.isNaN(time)) {
		const parsed = new Date(time);
		return new CalendarDate(parsed.getFullYear(), parsed.getMonth() + 1, parsed.getDate());
	}
	return undefined;
}

const separatorCache = new Map<string, string>();

export function getLocaleSeparator(locale: string): string {
	const cached = separatorCache.get(locale);
	if (cached != null) return cached;
	const parts = new Intl.DateTimeFormat(locale).formatToParts(new Date());
	const separator = parts.find((part) => part.type === 'literal')?.value ?? '/';
	separatorCache.set(locale, separator);
	return separator;
}

const digitCache = new Map<string, string>();

const getLocaleDigits = (locale: string) => {
	const cached = digitCache.get(locale);
	if (cached != null) return cached;
	const digits = `0123456789${new Intl.NumberFormat(locale, { useGrouping: false }).format(1234567890)}`;
	digitCache.set(locale, digits);
	return digits;
};

export const isDigit = (char: string, locale?: string) =>
	locale ? getLocaleDigits(locale).includes(char) : /\d/.test(char);

export const isValidCharacter = (char: string | null | undefined, separator: string, locale?: string) => {
	if (!char) return true;
	if (char.length !== 1) return true;
	return isDigit(char, locale) || separator.includes(char);
};

export const ensureValidCharacters = (value: string, separator: string, locale?: string) =>
	value
		.split('')
		.filter((char) => isValidCharacter(char, separator, locale))
		.join('');

export const getInputPlaceholder = (locale: string, placeholder: Record<string, string>) => {
	const parts = new Intl.DateTimeFormat(locale).formatToParts(new Date());
	return parts.map((part) => placeholder[part.type] ?? part.value).join('');
};

export const sortDates = (values: (CalendarDate | null | undefined)[]): CalendarDate[] =>
	values
		.slice()
		.filter((date): date is CalendarDate => date != null)
		.sort((a, b) => compareDates(a, b));

export const adjustStartAndEndDate = (
	value: (CalendarDate | undefined)[]
): CalendarDate[] => {
	const [startDate, endDate] = value;
	if (!startDate || !endDate) return value.filter((date): date is CalendarDate => date != null);
	return compareDates(startDate, endDate) <= 0 ? [startDate, endDate] : [endDate, startDate];
};

export const isDateWithinRange = (
	date: DateValueFields,
	value: (DateValueFields | undefined)[]
): boolean => {
	const [startDate, endDate] = value;
	if (!startDate || !endDate) return false;
	return compareDates(startDate, date) <= 0 && compareDates(endDate, date) >= 0;
};

export const defaultTranslations = {
	dayCell(state: {
		unavailable: boolean;
		firstInRange: boolean;
		lastInRange: boolean;
		inRange: boolean;
		selected: boolean;
		valueText: string;
	}) {
		if (state.unavailable) return `Not available. ${state.valueText}`;
		if (state.firstInRange) return `Starting range from ${state.valueText}`;
		if (state.lastInRange) return `Range ending at ${state.valueText}`;
		if (state.inRange) return `In range. ${state.valueText}`;
		if (state.selected) return `Selected date. ${state.valueText}`;
		return `Choose ${state.valueText}`;
	},
	trigger(open: boolean) {
		return open ? 'Close calendar' : 'Open calendar';
	},
	viewTrigger(view: string, nextView?: string) {
		if (!nextView) return `${view} view`;
		return `Switch to ${nextView} view`;
	},
	presetTrigger(value: string[]) {
		const [start = '', end = ''] = value;
		return `select ${start} to ${end}`;
	},
	prevTrigger(view: string) {
		if (view === 'year') return 'Switch to previous decade';
		if (view === 'month') return 'Switch to previous year';
		return 'Switch to previous month';
	},
	nextTrigger(view: string) {
		if (view === 'year') return 'Switch to next decade';
		if (view === 'month') return 'Switch to next year';
		return 'Switch to next month';
	},
	placeholder() {
		return { day: 'dd', month: 'mm', year: 'yyyy' };
	},
	content: 'calendar',
	monthSelect: 'Select month',
	yearSelect: 'Select year',
	clearTrigger: 'Clear selected dates',
	weekColumnHeader: 'Wk',
	weekNumberCell(weekNumber: number) {
		return `Week ${weekNumber}`;
	}
};

export type DatePickerTranslations = typeof defaultTranslations;

export const viewToNumber = (view?: DatePickerView | null, fallback = 0) => {
	if (!view) return fallback;
	return view === 'day' ? 0 : view === 'month' ? 1 : 2;
};

export const viewNumberToView = (value: number): DatePickerView =>
	value === 0 ? 'day' : value === 1 ? 'month' : 'year';

export const clampView = (
	view: DatePickerView | null | undefined,
	minView?: DatePickerView | null,
	maxView?: DatePickerView | null
): DatePickerView => {
	const min = viewToNumber(minView, 0);
	const max = viewToNumber(maxView, 2);
	return viewNumberToView(Math.min(Math.max(viewToNumber(view, 0), min), max));
};

export const isAboveMinView = (view: DatePickerView, minView?: DatePickerView | null) =>
	viewToNumber(view, 0) > viewToNumber(minView, 0);

export const isBelowMinView = (view: DatePickerView, minView?: DatePickerView | null) =>
	viewToNumber(view, 0) < viewToNumber(minView, 0);

export const getNextView = (
	view: DatePickerView,
	minView?: DatePickerView | null,
	maxView?: DatePickerView | null
) => clampView(viewNumberToView(viewToNumber(view, 0) + 1), minView, maxView);

export const getPreviousView = (
	view: DatePickerView,
	minView?: DatePickerView | null,
	maxView?: DatePickerView | null
) => clampView(viewNumberToView(viewToNumber(view, 0) - 1), minView, maxView);

export type DatePickerView = 'day' | 'month' | 'year';

export type { DateDuration, DateValueFields as DateFields };
