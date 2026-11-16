// Family-local segment model for the date input. `src/lib/internal/date.ts` owns civil-date
// arithmetic; this module derives the locale segment order and the per-segment ranges, mirroring
// Zag's `date-input/utils` with the time-of-day segments left out (the family is date-only).
import { CalendarDate, compareDates, getDaysInMonth, tryParseDate, type DateFields } from '../../internal/date';

export type DateInputSegmentType = 'day' | 'month' | 'year' | 'literal';

export interface DateInputSegmentTemplatePart {
	type: DateInputSegmentType;
	text: string;
}

export interface DateInputDisplayValue {
	year: number | null;
	month: number | null;
	day: number | null;
}

export interface DateInputSegment {
	type: DateInputSegmentType;
	text: string;
	value?: number;
	minValue?: number;
	maxValue?: number;
	isPlaceholder: boolean;
	placeholder: string;
	isEditable: boolean;
}

const PLACEHOLDERS: Record<string, [string, string, string]> = {
	en: ['yyyy', 'mm', 'dd'],
	de: ['jjjj', 'mm', 'tt'],
	fr: ['aaaa', 'mm', 'jj'],
	es: ['aaaa', 'mm', 'dd'],
	it: ['aaaa', 'mm', 'gg'],
	pt: ['aaaa', 'mm', 'dd'],
	nl: ['jjjj', 'mm', 'dd'],
	ja: ['年', '月', '日'],
	ru: ['гггг', 'мм', 'дд'],
	ko: ['연도', '월', '일'],
	pl: ['rrrr', 'mm', 'dd'],
	tr: ['yyyy', 'aa', 'gg'],
	sv: ['åååå', 'mm', 'dd'],
	da: ['åååå', 'mm', 'dd'],
	fi: ['vvvv', 'kk', 'pp'],
	cs: ['rrrr', 'mm', 'dd'],
	hu: ['éééé', 'hh', 'nn'],
	ro: ['aaaa', 'll', 'zz'],
	uk: ['рррр', 'мм', 'дд']
};

const languageOf = (locale: string) => {
	try {
		return new Intl.Locale(locale).language;
	} catch {
		return locale.split('-')[0];
	}
};

/** Placeholders are the multi-character cells a locale shows for an empty segment. */
export function getSegmentPlaceholders(locale = 'en-US'): Record<'day' | 'month' | 'year', string> {
	const entries = PLACEHOLDERS[languageOf(locale)] ?? PLACEHOLDERS.en;
	return { year: entries[0], month: entries[1], day: entries[2] };
}

export const SEGMENT_LABELS: Record<DateInputSegmentType, string> = {
	day: 'Day',
	month: 'Month',
	year: 'Year',
	literal: 'Literal'
};

export const PAGE_STEP: Record<DateInputSegmentType, number | undefined> = {
	year: 5,
	month: 2,
	day: 7,
	literal: undefined
};

const SEGMENT_ORDER: DateInputSegmentType[] = ['year', 'month', 'day', 'literal'];

/** Segment order and literals for the locale, taken from the numeric date pattern. */
export function getSegmentTemplate(locale = 'en-US'): DateInputSegmentTemplatePart[] {
	const formatter = new Intl.DateTimeFormat(locale, {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		timeZone: 'UTC'
	});
	const parts = formatter.formatToParts(new Date(Date.UTC(2000, 11, 25)));
	const template: DateInputSegmentTemplatePart[] = [];
	for (const part of parts) {
		const type = part.type === 'literal' ? 'literal' : (part.type as DateInputSegmentType);
		if (!SEGMENT_ORDER.includes(type)) continue;
		template.push({ type, text: part.value });
	}
	if (template.length === 0) {
		template.push({ type: 'month', text: '' }, { type: 'literal', text: '/' }, { type: 'day', text: '' });
		template.push({ type: 'literal', text: '/' }, { type: 'year', text: '' });
	}
	return template;
}

export const emptyDisplayValue = (): DateInputDisplayValue => ({ year: null, month: null, day: null });

export const displayValueOf = (date: CalendarDate | null | undefined): DateInputDisplayValue =>
	date ? { year: date.year, month: date.month, day: date.day } : emptyDisplayValue();

export const isDisplayValueComplete = (value: DateInputDisplayValue) =>
	value.year != null && value.month != null && value.day != null;

export const displayValueToDate = (value: DateInputDisplayValue): CalendarDate | undefined => {
	if (value.year == null || value.month == null || value.day == null) return undefined;
	return new CalendarDate(value.year, value.month, value.day);
};

export const segmentMaxDigits = (type: DateInputSegmentType) =>
	type === 'year' ? 4 : type === 'literal' ? 0 : 2;

export function segmentLimits(
	type: DateInputSegmentType,
	value: DateInputDisplayValue
): { minValue: number; maxValue: number } {
	if (type === 'year') return { minValue: 1, maxValue: 9999 };
	if (type === 'month') return { minValue: 1, maxValue: 12 };
	const days = getDaysInMonth({
		year: value.year ?? 2000,
		month: value.month ?? 1,
		day: 1
	});
	return { minValue: 1, maxValue: days };
}

export function buildSegments(
	template: DateInputSegmentTemplatePart[],
	value: DateInputDisplayValue,
	placeholders: Record<'day' | 'month' | 'year', string>
): DateInputSegment[] {
	return template.map((part) => {
		if (part.type === 'literal') {
			return {
				type: 'literal',
				text: part.text,
				isPlaceholder: false,
				placeholder: '',
				isEditable: false
			};
		}
		const raw = value[part.type];
		const isPlaceholder = raw == null;
		const limits = segmentLimits(part.type, value);
		return {
			type: part.type,
			text: isPlaceholder ? placeholders[part.type] : String(raw),
			value: raw ?? undefined,
			minValue: limits.minValue,
			maxValue: limits.maxValue,
			isPlaceholder,
			placeholder: placeholders[part.type],
			isEditable: true
		};
	});
}

/** Segment-wise min/max clamp that keeps the entered digits rather than snapping to a bound. */
export const constrainSegments = (
	date: CalendarDate,
	min?: DateFields | null,
	max?: DateFields | null
): CalendarDate => {
	let result = date;
	if (min && compareDates(result, min) < 0) {
		if (result.year < min.year) result = result.set({ year: min.year });
		if (compareDates(result, min) < 0 && result.month < min.month) result = result.set({ month: min.month });
		if (compareDates(result, min) < 0 && result.day < min.day) result = result.set({ day: min.day });
	}
	if (max && compareDates(result, max) > 0) {
		if (result.year > max.year) result = result.set({ year: max.year });
		if (compareDates(result, max) > 0 && result.month > max.month) result = result.set({ month: max.month });
		if (compareDates(result, max) > 0 && result.day > max.day) result = result.set({ day: max.day });
	}
	return result;
};

export const parseIsoDate = (value: string | null | undefined): CalendarDate | undefined => {
	if (!value) return undefined;
	const parsed = tryParseDate(value.trim());
	return parsed ?? undefined;
};

export const formatIsoDate = (date: CalendarDate | undefined) => (date ? date.toString() : '');

export const getMonthNameList = (locale = 'en-US'): string[] => {
	const formatter = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' });
	return Array.from({ length: 12 }, (_, index) => formatter.format(new Date(Date.UTC(2021, index, 1))));
};

export const monthFromName = (input: string, locale = 'en-US'): number | undefined => {
	const lower = input.toLowerCase();
	const names = getMonthNameList(locale);
	for (let index = 0; index < names.length; index += 1) {
		if (names[index].toLowerCase().startsWith(lower)) return index + 1;
	}
	return undefined;
};

export const isDigit = (char: string) => /\d/.test(char);

export const getGroupCount = (selectionMode?: 'single' | 'range') =>
	selectionMode === 'range' ? 2 : 1;
