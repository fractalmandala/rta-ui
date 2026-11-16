// Civil-date arithmetic and formatting for the date families. A Gregorian `CalendarDate` with the
// subset of the `@internationalized/date` surface Zag's date machines use (`.set`, `.add`,
// `.subtract`, `.compare`, `.toString`, `.toDate`), so the package stays dependency-free.
//
// Deviation: only the `gregory` calendar and the runtime local time zone are supported, because the
// families here are documented against those.

const pad = (value: number, length = 2) => String(value).padStart(length, '0');

export interface DateFields {
	year: number;
	month: number;
	day: number;
}

export interface DateDuration {
	years?: number;
	months?: number;
	days?: number;
}

const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const daysInMonthFor = (year: number, month: number): number => {
	const lengths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	return lengths[month - 1] ?? 31;
};

function balance(year: number, month: number, day: number): DateFields {
	let y = year;
	let m = month;
	while (m < 1) {
		m += 12;
		y -= 1;
	}
	while (m > 12) {
		m -= 12;
		y += 1;
	}
	const maxDay = daysInMonthFor(y, m);
	return { year: y, month: m, day: Math.min(Math.max(day, 1), maxDay) };
}

function toEpochDays({ year, month, day }: DateFields): number {
	// Days since 1970-01-01 in the proleptic Gregorian calendar, without touching Date's timezone.
	const y = month <= 2 ? year - 1 : year;
	const era = Math.floor(y / 400);
	const yoe = y - era * 400;
	const doy = Math.floor((153 * (month + (month > 2 ? -3 : 9)) + 2) / 5) + day - 1;
	const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
	return era * 146097 + doe - 719468;
}

function fromEpochDays(days: number): DateFields {
	const z = days + 719468;
	const era = Math.floor(z / 146097);
	const doe = z - era * 146097;
	const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
	const y = yoe + era * 400;
	const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
	const mp = Math.floor((5 * doy + 2) / 153);
	const day = doy - Math.floor((153 * mp + 2) / 5) + 1;
	const month = mp < 10 ? mp + 3 : mp - 9;
	return { year: month <= 2 ? y + 1 : y, month, day };
}

export class CalendarDate implements DateFields {
	readonly year: number;
	readonly month: number;
	readonly day: number;
	readonly calendar = 'gregory';

	constructor(year: number, month: number, day: number) {
		const balanced = balance(year, month, day);
		this.year = balanced.year;
		this.month = balanced.month;
		this.day = balanced.day;
	}

	get daysInMonth(): number {
		return daysInMonthFor(this.year, this.month);
	}

	/** 0 = Sunday, matching `Date#getDay`. */
	get dayOfWeek(): number {
		const days = toEpochDays(this);
		return (((days + 4) % 7) + 7) % 7;
	}

	set(fields: Partial<DateFields>): CalendarDate {
		return new CalendarDate(
			fields.year ?? this.year,
			fields.month ?? this.month,
			fields.day ?? this.day
		);
	}

	copy(): CalendarDate {
		return new CalendarDate(this.year, this.month, this.day);
	}

	add(duration: DateDuration | number): CalendarDate {
		const { years = 0, months = 0, days = 0 } =
			typeof duration === 'number' ? { days: duration } : duration;
		const base = new CalendarDate(this.year + years, this.month + months, this.day);
		if (!days) return base;
		const shifted = fromEpochDays(toEpochDays(base) + days);
		return new CalendarDate(shifted.year, shifted.month, shifted.day);
	}

	subtract(duration: DateDuration | number): CalendarDate {
		const { years = 0, months = 0, days = 0 } =
			typeof duration === 'number' ? { days: duration } : duration;
		return this.add({ years: -years, months: -months, days: -days });
	}

	compare(other: DateFields): number {
		return (
			this.year - other.year || this.month - other.month || this.day - other.day
		);
	}

	toString(): string {
		return `${pad(this.year, 4)}-${pad(this.month)}-${pad(this.day)}`;
	}

	toDate(_timeZone?: string): Date {
		return new Date(this.year, this.month - 1, this.day);
	}

	valueOf(): number {
		return toEpochDays(this);
	}

	equals(other: DateFields): boolean {
		return this.compare(other) === 0;
	}
}

export const today = (_timeZone?: string): CalendarDate => {
	const now = new Date();
	return new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
};

export const now = (timeZone?: string): CalendarDate => today(timeZone);

export const getLocalTimeZone = (): string =>
	Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';

export function parseDate(value: string): CalendarDate {
	const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
	if (!match) throw new Error(`Invalid ISO date string: ${value}`);
	return new CalendarDate(Number(match[1]), Number(match[2]), Number(match[3]));
}

export function tryParseDate(value: string): CalendarDate | null {
	try {
		return parseDate(value);
	} catch {
		return null;
	}
}

export function fromDate(date: Date): CalendarDate {
	return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export const toCalendar = (value: CalendarDate, _calendar?: string): CalendarDate => value;

export const startOfMonth = (value: CalendarDate): CalendarDate => value.set({ day: 1 });

export function startOfWeek(value: CalendarDate, firstDay = 0): CalendarDate {
	const offset = (value.dayOfWeek - firstDay + 7) % 7;
	return value.subtract({ days: offset });
}

export const endOfWeek = (value: CalendarDate, firstDay = 0): CalendarDate =>
	startOfWeek(value, firstDay).add({ days: 6 });

export const startOfYear = (value: CalendarDate): CalendarDate => value.set({ month: 1, day: 1 });

export const endOfYear = (value: CalendarDate): CalendarDate =>
	value.set({ month: 12, day: 31 });

export const endOfMonth = (value: CalendarDate): CalendarDate =>
	value.set({ day: daysInMonthFor(value.year, value.month) });

export const getDaysInMonth = (value: CalendarDate | DateFields): number =>
	daysInMonthFor(value.year, value.month);

export const isSameDay = (a: DateFields | null | undefined, b: DateFields | null | undefined): boolean =>
	Boolean(a && b && a.year === b.year && a.month === b.month && a.day === b.day);

export const isToday = (value: DateFields, timeZone?: string): boolean =>
	isSameDay(value, today(timeZone));

export const isWeekend = (value: CalendarDate, locale = 'en-US'): boolean => {
	const day = value.dayOfWeek;
	const firstDay = firstDayOfWeek(locale);
	// Saturday and Sunday are the weekend in every locale this library documents.
	void firstDay;
	return day === 0 || day === 6;
};

export const firstDayOfWeek = (locale = 'en-US'): number => {
	try {
		const localeInfo = new Intl.Locale(locale) as Intl.Locale & {
			weekInfo?: { firstDay: number };
			getWeekInfo?: () => { firstDay: number };
		};
		const weekInfo = localeInfo.getWeekInfo?.() ?? localeInfo.weekInfo;
		if (weekInfo) return weekInfo.firstDay % 7;
	} catch {
		// Fall through to the reference locale.
	}
	return 0;
};

export const getDayOfWeek = (value: CalendarDate, locale = 'en-US', _firstDay?: number): number => {
	const first = _firstDay ?? firstDayOfWeek(locale);
	return (value.dayOfWeek - first + 7) % 7;
};

export interface DateFormatterOptions extends Intl.DateTimeFormatOptions {
	locale?: string;
}

export class DateFormatter {
	private readonly formatter: Intl.DateTimeFormat;

	constructor(locale: string, options: Intl.DateTimeFormatOptions = {}) {
		this.formatter = new Intl.DateTimeFormat(locale, options);
	}

	format(value: CalendarDate): string {
		return this.formatter.format(value.toDate());
	}

	formatToParts(value: CalendarDate): Intl.DateTimeFormatPart[] {
		return this.formatter.formatToParts(value.toDate());
	}

	formatRange(start: CalendarDate, end: CalendarDate): string {
		return `${this.format(start)} – ${this.format(end)}`;
	}
}

export interface WeekDay {
	value: number;
	short: string;
	long: string;
	narrow: string;
}

export function getWeekDays(locale = 'en-US', firstDay = firstDayOfWeek(locale)): WeekDay[] {
	const short = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
	const long = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
	const narrow = new Intl.DateTimeFormat(locale, { weekday: 'narrow', timeZone: 'UTC' });
	// 2024-01-07 is a Sunday, so index 0 maps onto week day 0.
	const sunday = new Date(Date.UTC(2024, 0, 7));
	return Array.from({ length: 7 }, (_, index) => {
		const day = (firstDay + index) % 7;
		const date = new Date(sunday.getTime() + day * 86400000);
		return {
			value: day,
			short: short.format(date),
			long: long.format(date),
			narrow: narrow.format(date)
		};
	});
}

export function getMonthNames(locale = 'en-US'): { value: number; label: string }[] {
	const formatter = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' });
	return Array.from({ length: 12 }, (_, index) => ({
		value: index + 1,
		label: formatter.format(new Date(Date.UTC(2024, index, 1)))
	}));
}

export function getYearsRange(start: number, end: number): number[] {
	return Array.from({ length: Math.max(end - start + 1, 0) }, (_, index) => start + index);
}

/** The 6x7 grid of days a month view renders, including leading and trailing neighbours. */
export function getMonthGrid(
	value: CalendarDate,
	options: { locale?: string; firstDay?: number; fixedWeeks?: boolean } = {}
): CalendarDate[][] {
	const locale = options.locale ?? 'en-US';
	const firstDay = options.firstDay ?? firstDayOfWeek(locale);
	const firstOfMonth = startOfMonth(value);
	const offset = (firstOfMonth.dayOfWeek - firstDay + 7) % 7;
	const start = firstOfMonth.subtract({ days: offset });
	const weeks = options.fixedWeeks === false ? 5 : 6;

	const rows: CalendarDate[][] = [];
	for (let week = 0; week < weeks; week += 1) {
		const row: CalendarDate[] = [];
		for (let day = 0; day < 7; day += 1) {
			row.push(start.add({ days: week * 7 + day }));
		}
		rows.push(row);
	}
	return rows;
}

export const compareDates = (a: DateFields, b: DateFields): number =>
	a.year - b.year || a.month - b.month || a.day - b.day;

export const isDateInRange = (
	value: DateFields,
	start: DateFields | null | undefined,
	end: DateFields | null | undefined
): boolean => {
	if (start && compareDates(value, start) < 0) return false;
	if (end && compareDates(value, end) > 0) return false;
	return true;
};
