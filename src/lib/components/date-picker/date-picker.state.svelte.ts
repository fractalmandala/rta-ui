import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import { useDismissableLayer, useEscapeLayer } from '../../internal/layers.svelte.js';
import {
	floatingStyle,
	getPlacement,
	getSide,
	type Placement,
	type PositionOptions,
	type Side
} from '../../internal/positioning.svelte.js';
import { createPresence } from '../../internal/presence.svelte.js';
import { compareDates, type CalendarDate, type DateDuration } from '../../internal/date';
import {
	addDays,
	addDuration,
	addMonths,
	addYears,
	adjustStartAndEndDate,
	alignDate,
	clampView,
	constrainValue,
	defaultTranslations,
	ensureValidCharacters,
	formatCalDate,
	formatSelectedDate,
	toUtcDate,
	getDateRangePreset,
	getDayFormatter,
	getDaysInWeek,
	getDecadeRange,
	getDefaultYearRange,
	getEndDate,
	getInputPlaceholder,
	getLocaleSeparator,
	getMonthDays,
	getMonthFormatter,
	getMonthNameList,
	getNextPage,
	getNextSection,
	getNextView,
	getPreviousPage,
	getPreviousSection,
	getPreviousView,
	getTodayDate,
	getUnitDuration,
	getVisibleRangeText,
	getWeekDayValues,
	getWeekOfYear,
	getYearsRangeList,
	isAboveMinView,
	isBelowMinView,
	isDateOutsideRange,
	isDateUnavailable,
	isDateWithinRange,
	isNextRangeInvalid,
	isPreviousRangeInvalid,
	isValidCharacter,
	parseDateString,
	sortDates,
	type DatePickerTranslations,
	type DatePickerView,
	type DateRangePreset
} from './date-picker.utils';

export type { DatePickerView, DateRangePreset };
export type DatePickerDateValue = CalendarDate;
export type DateValue = CalendarDate;
export type DatePickerSelectionMode = 'single' | 'multiple' | 'range';

export interface DatePickerFocusChangeDetails {
	value: CalendarDate[];
	valueAsString: string[];
	focusedValue: CalendarDate;
	view: DatePickerView;
}

export interface DatePickerValueChangeDetails {
	value: CalendarDate[];
	valueAsString: string[];
	view: DatePickerView;
}

export interface DatePickerViewChangeDetails {
	view: DatePickerView;
}

export interface DatePickerOpenChangeDetails {
	open: boolean;
	value: CalendarDate[];
}

export interface DatePickerVisibleRangeChangeDetails {
	view: DatePickerView;
	visibleRange: { start: CalendarDate; end: CalendarDate };
}

export type DatePickerFormatFn = (
	date: CalendarDate,
	options: { locale: string; timeZone?: string }
) => string;

export type DatePickerParseFn = (
	value: string,
	options: { locale: string; timeZone?: string }
) => CalendarDate | undefined;

export interface DatePickerElementIds {
	root?: string;
	label?: (index?: number) => string;
	control?: string;
	input?: (index: number) => string;
	trigger?: string;
	clearTrigger?: string;
	content?: string;
	positioner?: string;
	monthSelect?: string;
	yearSelect?: string;
	table?: (id: string) => string;
	tableHead?: (id: string) => string;
	tableBody?: (id: string) => string;
	tableRow?: (id: string) => string;
	cellTrigger?: (id: string) => string;
	viewTrigger?: (view: DatePickerView) => string;
	prevTrigger?: (view: DatePickerView) => string;
	nextTrigger?: (view: DatePickerView) => string;
}

export interface UseDatePickerProps {
	id?: string | null;
	ids?: DatePickerElementIds;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	locale?: string;
	timeZone?: string;
	disabled?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	required?: boolean;
	name?: string;
	inline?: boolean;
	closeOnSelect?: boolean;
	fixedWeeks?: boolean;
	outsideDaySelectable?: boolean;
	openOnClick?: boolean;
	showWeekNumbers?: boolean;
	numOfMonths?: number;
	selectionMode?: DatePickerSelectionMode;
	maxSelectedDates?: number;
	minView?: DatePickerView;
	maxView?: DatePickerView;
	startOfWeek?: number | null;
	value?: CalendarDate[] | undefined;
	defaultValue?: CalendarDate[];
	focusedValue?: CalendarDate | undefined;
	defaultFocusedValue?: CalendarDate;
	open?: boolean;
	defaultOpen?: boolean;
	view?: DatePickerView;
	defaultView?: DatePickerView;
	min?: CalendarDate;
	max?: CalendarDate;
	placeholder?: string;
	format?: DatePickerFormatFn;
	parse?: DatePickerParseFn;
	isDateUnavailable?: (date: CalendarDate, locale?: string) => boolean;
	positioning?: PositionOptions;
	translations?: Partial<DatePickerTranslations>;
	portalled?: boolean;
	portalRef?: HTMLElement | (() => HTMLElement | null | undefined);
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	closeOnInteractOutside?: boolean;
	closeOnEscape?: boolean;
	onValueChange?: (details: DatePickerValueChangeDetails) => void;
	onFocusChange?: (details: DatePickerFocusChangeDetails) => void;
	onViewChange?: (details: DatePickerViewChangeDetails) => void;
	onOpenChange?: (details: DatePickerOpenChangeDetails) => void;
	onVisibleRangeChange?: (details: DatePickerVisibleRangeChangeDetails) => void;
	onExitComplete?: () => void;
}

export interface DatePickerDayCellOptions {
	value: CalendarDate;
	disabled?: boolean;
	columns?: number;
	visibleRange?: { start: CalendarDate; end: CalendarDate };
}

export interface DatePickerGridCellOptions {
	value: number;
	disabled?: boolean;
	columns?: number;
}

export interface DatePickerViewOptions {
	view?: DatePickerView;
}

export interface DatePickerCellState {
	focused: boolean;
	selectable: boolean;
	selected: boolean;
	inRange: boolean;
	firstInRange: boolean;
	lastInRange: boolean;
	unavailable: boolean;
	outsideRange: boolean;
	today: boolean;
	weekend: boolean;
	disabled: boolean;
	invalid: boolean;
	value: CalendarDate;
	valueText: string;
	inHoveredRange: boolean;
	firstInHoveredRange: boolean;
	lastInHoveredRange: boolean;
}

type Attrs = Record<string, unknown>;

export interface DatePickerApi {
	readonly id: string;
	readonly open: boolean;
	readonly present: boolean;
	readonly hidden: boolean;
	readonly dataState: 'open' | 'closed';
	readonly inline: boolean;
	readonly focused: boolean;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly invalid: boolean;
	readonly required: boolean;
	readonly empty: boolean;
	readonly interactive: boolean;
	readonly selectionMode: DatePickerSelectionMode;
	readonly maxSelectedDates: number | undefined;
	readonly isMaxSelected: boolean;
	readonly numOfMonths: number;
	readonly showWeekNumbers: boolean;
	readonly fixedWeeks: boolean;
	readonly startOfWeek: number | undefined;
	readonly locale: string;
	readonly min: CalendarDate | undefined;
	readonly max: CalendarDate | undefined;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly view: DatePickerView;
	readonly placement: Placement;
	readonly side: Side;
	readonly value: CalendarDate[];
	readonly valueAsDate: Date[];
	readonly valueAsString: string[];
	readonly focusedValue: CalendarDate;
	readonly focusedValueAsDate: Date;
	readonly focusedValueAsString: string;
	readonly startValue: CalendarDate;
	readonly endValue: CalendarDate;
	readonly visibleRange: { start: CalendarDate; end: CalendarDate };
	readonly visibleRangeText: { start: string; end: string; formatted: string };
	readonly weeks: CalendarDate[][];
	readonly weekDays: { value: CalendarDate; short: string; long: string; narrow: string }[];
	readonly portalled: boolean;
	readonly portalTarget: Element | null | undefined;
	readonly positionerStyle: string;
	readonly minView: DatePickerView;
	readonly maxView: DatePickerView;
	readonly translations: DatePickerTranslations;
	readonly isNextVisibleRangeValid: boolean;
	readonly isPrevVisibleRangeValid: boolean;
	getRangePresetValue(preset: DateRangePreset): CalendarDate[];
	getWeekNumber(week: CalendarDate[]): number;
	getDaysInWeek(week: number, from?: CalendarDate): CalendarDate[];
	getOffset(duration: DateDuration): {
		visibleRange: { start: CalendarDate; end: CalendarDate };
		weeks: CalendarDate[][];
		visibleRangeText: { start: string; end: string };
	};
	getMonthWeeks(from?: CalendarDate): CalendarDate[][];
	isUnavailable(date: CalendarDate): boolean;
	getMonths(options?: { format?: 'short' | 'long' }): {
		label: string;
		value: number;
		disabled: boolean;
	}[];
	getYears(): { label: string; value: number; disabled: boolean }[];
	getYearsGrid(options?: { columns?: number }): { label: string; value: number; disabled: boolean }[][];
	getMonthsGrid(options?: { columns?: number; format?: 'short' | 'long' }): {
		label: string;
		value: number;
		disabled: boolean;
	}[][];
	getDecade(): { start: number | undefined; end: number | undefined };
	getDayCellState(options: DatePickerDayCellOptions): DatePickerCellState;
	getMonthCellState(options: DatePickerGridCellOptions): DatePickerCellState;
	getYearCellState(options: DatePickerGridCellOptions): DatePickerCellState;
	format(value: CalendarDate, options?: Intl.DateTimeFormatOptions): string;
	setValue(values: CalendarDate[]): void;
	selectToday(): void;
	clearValue(options?: { focus?: boolean }): void;
	setFocusedValue(value: CalendarDate): void;
	focusMonth(month: number): void;
	focusYear(year: number): void;
	setView(view: DatePickerView): void;
	goToNext(): void;
	goToPrev(): void;
	setOpen(open: boolean): void;
	setContentNode(node: HTMLElement | null): void;
	setPositionerNode(node: HTMLElement | null): void;
	setControlNode(node: HTMLElement | null): void;
	getRootProps(): Attrs;
	getLabelProps(options?: { index?: number }): Attrs;
	getControlProps(): Attrs;
	getInputProps(options?: { index?: number; fixOnBlur?: boolean }): Attrs;
	getTriggerProps(): Attrs;
	getClearTriggerProps(): Attrs;
	getContentProps(): Attrs;
	getPositionerProps(): Attrs;
	getRangeTextProps(): Attrs;
	getPrevTriggerProps(options?: DatePickerViewOptions): Attrs;
	getNextTriggerProps(options?: DatePickerViewOptions): Attrs;
	getViewProps(options?: DatePickerViewOptions): Attrs;
	getViewControlProps(options?: DatePickerViewOptions): Attrs;
	getViewTriggerProps(options?: DatePickerViewOptions): Attrs;
	getTableProps(options?: DatePickerViewOptions & { columns?: number; id?: string }): Attrs;
	getTableHeadProps(options?: DatePickerViewOptions): Attrs;
	getTableHeaderProps(options?: DatePickerViewOptions): Attrs;
	getTableBodyProps(options?: DatePickerViewOptions): Attrs;
	getTableRowProps(options?: DatePickerViewOptions): Attrs;
	getWeekNumberHeaderCellProps(options?: DatePickerViewOptions): Attrs;
	getWeekNumberCellProps(options: { weekIndex: number; week: CalendarDate[] }): Attrs;
	getDayTableCellProps(options: DatePickerDayCellOptions): Attrs;
	getDayTableCellTriggerProps(options: DatePickerDayCellOptions): Attrs;
	getMonthTableCellProps(options: DatePickerGridCellOptions): Attrs;
	getMonthTableCellTriggerProps(options: DatePickerGridCellOptions): Attrs;
	getYearTableCellProps(options: DatePickerGridCellOptions): Attrs;
	getYearTableCellTriggerProps(options: DatePickerGridCellOptions): Attrs;
	getMonthSelectProps(): Attrs;
	getYearSelectProps(): Attrs;
	getPresetTriggerProps(options: { value: DateRangePreset | CalendarDate[] }): Attrs;
}

const datePickerContext = createContext<DatePickerApi>('DatePicker', 'DatePicker.Root');

export const useDatePickerContext = () => datePickerContext.get();
export const setDatePickerContext = (api: DatePickerApi) => datePickerContext.set(api);

const ariaAttr = (value: unknown) => (value ? true : undefined);

const isDateArrayEqual = (a: CalendarDate[] = [], b: CalendarDate[] = []) => {
	if (a.length !== b.length) return false;
	return a.every((date, index) => compareDates(date, b[index]) === 0);
};

export function createDatePicker(getProps: () => UseDatePickerProps, uid: string): DatePickerApi {
	const props = getProps;
	const id = props().id ?? uid;
	const ids = props().ids ?? {};

	const locale = () => props().locale ?? 'en-US';
	const timeZone = () => props().timeZone ?? 'UTC';
	const selectionMode = (): DatePickerSelectionMode => props().selectionMode ?? 'single';
	const numOfMonths = () => props().numOfMonths ?? 1;
	const minView = () => props().minView ?? 'day';
	const maxView = () => props().maxView ?? 'year';
	const startOfWeekValue = () => props().startOfWeek ?? undefined;
	const translations = (): DatePickerTranslations => ({
		...defaultTranslations,
		...props().translations
	});

	const rootId = ids.root ?? `datepicker:${id}`;
	const labelId = (index = 0) => ids.label?.(index) ?? `datepicker:${id}:label:${index}`;
	const controlId = ids.control ?? `datepicker:${id}:control`;
	const inputId = (index: number) => ids.input?.(index) ?? `datepicker:${id}:input:${index}`;
	const triggerId = ids.trigger ?? `datepicker:${id}:trigger`;
	const clearTriggerId = ids.clearTrigger ?? `datepicker:${id}:clear`;
	const contentId = ids.content ?? `datepicker:${id}:content`;
	const positionerId = ids.positioner ?? `datepicker:${id}:positioner`;
	const monthSelectId = ids.monthSelect ?? `datepicker:${id}:month-select`;
	const yearSelectId = ids.yearSelect ?? `datepicker:${id}:year-select`;
	const tableId = (suffix: string) => ids.table?.(suffix) ?? `datepicker:${id}:table:${suffix}`;
	const tableHeadId = () => ids.tableHead?.('thead') ?? `datepicker:${id}:thead`;
	const tableBodyId = () => ids.tableBody?.('tbody') ?? `datepicker:${id}:tbody`;
	const tableRowId = (suffix: string) => ids.tableRow?.(suffix) ?? `datepicker:${id}:tr:${suffix}`;
	const cellTriggerId = (suffix: string) =>
		ids.cellTrigger?.(suffix) ?? `datepicker:${id}:cell-trigger:${suffix}`;
	const viewTriggerId = (view: DatePickerView) =>
		ids.viewTrigger?.(view) ?? `datepicker:${id}:view:${view}`;
	const prevTriggerId = (view: DatePickerView) => ids.prevTrigger?.(view) ?? `datepicker:${id}:prev:${view}`;
	const nextTriggerId = (view: DatePickerView) => ids.nextTrigger?.(view) ?? `datepicker:${id}:next:${view}`;

	const constrain = (date: CalendarDate) => constrainValue(date, props().min, props().max);

	const initialValue = () => {
		const source = props().value ?? props().defaultValue;
		return source ? sortDates(source).map(constrain) : [];
	};
	const initialFocusedValue = () => {
		const source =
			props().focusedValue ??
			props().defaultFocusedValue ??
			initialValue()[0] ??
			getTodayDate(timeZone());
		return constrain(source);
	};
	const initialView = () => clampView(props().defaultView ?? props().view ?? minView(), minView(), maxView());

	const startingFocusedValue = initialFocusedValue();

	let internalValue = $state<CalendarDate[]>(initialValue());
	let internalFocusedValue = $state<CalendarDate>(startingFocusedValue);
	let internalOpen = $state(Boolean(props().open ?? props().defaultOpen));
	let internalView = $state<DatePickerView>(initialView());
	let startValue = $state<CalendarDate>(
		alignDate(startingFocusedValue, 'start', { months: numOfMonths() }, locale())
	);
	let currentPlacement = $state<Placement>(props().positioning?.placement ?? 'bottom');
	let hoveredValue = $state<CalendarDate | null>(null);
	let activeIndex = $state(0);
	let inputValue = $state<{ index: number; value: string }>({ index: 0, value: '' });
	let contentNode = $state<HTMLElement | null>(null);
	let positionerNode = $state<HTMLElement | null>(null);
	let controlNode = $state<HTMLElement | null>(null);

	const isInline = () => Boolean(props().inline);
	const isControlledOpen = () => props().open !== undefined;
	const isOpen = () => isInline() || (isControlledOpen() ? Boolean(props().open) : internalOpen);
	const valueList = () => (props().value !== undefined ? props().value ?? [] : internalValue);
	const isControlledValue = () => props().value !== undefined;
	const isControlledFocused = () => props().focusedValue !== undefined;
	const focusedValue = () =>
		isControlledFocused() ? (props().focusedValue as CalendarDate) : internalFocusedValue;
	const view = (): DatePickerView => {
		const configured = props().view;
		return configured !== undefined ? configured : internalView;
	};
	const isRangePicker = () => selectionMode() === 'range';
	const isMultiPicker = () => selectionMode() === 'multiple';
	const disabled = () => Boolean(props().disabled);
	const readOnly = () => Boolean(props().readOnly);
	const invalid = () => Boolean(props().invalid);
	const interactive = () => !disabled() && !readOnly();
	const endValue = () => getEndDate(startValue, { months: numOfMonths() });
	const visibleRange = () => ({ start: startValue, end: endValue() });
	const empty = () => valueList().length === 0;
	const isMaxSelected = () =>
		isMultiPicker() &&
		props().maxSelectedDates != null &&
		valueList().length >= (props().maxSelectedDates as number);

	const formatDate = (date: CalendarDate): string => {
		const custom = props().format;
		if (custom) return custom(date, { locale: locale(), timeZone: timeZone() });
		return formatCalDate(locale(), { day: '2-digit', month: '2-digit', year: 'numeric' }, date);
	};

	const valueAsString = () => valueList().map(formatDate);

	const visibleRangeText = () =>
		getVisibleRangeText({
			view: view(),
			startValue,
			endValue: endValue(),
			locale: locale(),
			selectionMode: selectionMode()
		});

	const weekDays = () => getWeekDayValues(startValue, startOfWeekValue(), locale());

	const getMonthWeeks = (from: CalendarDate = startValue) =>
		getMonthDays(from, locale(), props().fixedWeeks ? 6 : undefined, startOfWeekValue());

	const isNextRangeAllowed = () => !isNextRangeInvalid(endValue(), props().min, props().max);
	const isPreviousRangeAllowed = () => !isPreviousRangeInvalid(startValue, props().min, props().max);

	const isUnavailable = (date: CalendarDate) =>
		isDateUnavailable(date, props().isDateUnavailable, locale(), props().min, props().max);

	const parsed = (value: string) => {
		const custom = props().parse;
		if (custom) return custom(value, { locale: locale(), timeZone: timeZone() });
		return parseDateString(value, locale());
	};

	function setOpen(open: boolean) {
		if (isInline()) return;
		if (open === isOpen()) return;
		if (!isControlledOpen()) internalOpen = open;
		props().onOpenChange?.({ open, value: valueList() });
	}

	function setValue(values: CalendarDate[]) {
		const constrained = values.map(constrain);
		if (!isControlledValue()) internalValue = constrained;
		props().onValueChange?.({
			value: constrained,
			valueAsString: constrained.map(formatDate),
			view: view()
		});
	}

	function withField(date: CalendarDate, field: DatePickerView, value: number): CalendarDate {
		if (field === 'year') return date.set({ year: value });
		if (field === 'month') return date.set({ month: value });
		return date.set({ day: value });
	}

	function normalizeValue(value: CalendarDate | number): CalendarDate {
		let dateValue = typeof value === 'number' ? withField(focusedValue(), view(), value) : value;
		for (const candidate of ['day', 'month', 'year'] as DatePickerView[]) {
			if (isBelowMinView(candidate, minView())) {
				dateValue = withField(dateValue, candidate, candidate === 'day' ? 1 : 0);
			}
		}
		return dateValue;
	}

	function setFocusedValueRaw(value: CalendarDate) {
		const next = normalizeValue(value);
		const constrained = constrain(next);
		if (compareDates(focusedValue(), constrained) === 0) return;
		if (!isControlledFocused()) internalFocusedValue = constrained;
		props().onFocusChange?.({
			value: valueList(),
			valueAsString: valueAsString(),
			view: view(),
			focusedValue: constrained
		});
	}

	function setFocusedDate(value: CalendarDate | number) {
		setFocusedValueRaw(normalizeValue(value));
	}

	function preserveTime(_existing: CalendarDate | undefined, next: CalendarDate) {
		return next;
	}

	function setSelectedDate(value?: CalendarDate | number) {
		const values = [...valueList()];
		const index = activeIndex;
		const existing = values[index];
		const next = normalizeValue(value ?? focusedValue());
		values[index] = preserveTime(existing, next);
		setValue(adjustStartAndEndDate(values));
	}

	function resetSelection(value?: CalendarDate | number) {
		const existing = valueList()[0];
		const next = normalizeValue(value ?? focusedValue());
		setValue([preserveTime(existing, next)]);
	}

	function toggleSelectedDate(value?: CalendarDate | number) {
		const next = normalizeValue(value ?? focusedValue());
		const existing = valueList();
		const index = existing.findIndex((date) => compareDates(date, next) === 0);
		if (index === -1) setValue(sortDates([...existing, next]));
		else {
			const values = [...existing];
			values.splice(index, 1);
			setValue(sortDates(values));
		}
	}

	function canSelectDate(value?: CalendarDate | number) {
		const maxSelected = props().maxSelectedDates;
		if (maxSelected == null) return true;
		const existing = valueList();
		const next = normalizeValue(value ?? focusedValue());
		if (existing.some((date) => compareDates(date, next) === 0)) return true;
		return existing.length < maxSelected;
	}

	function clearValue(options: { focus?: boolean } = {}) {
		setValue([]);
		if (!isControlledFocused()) internalFocusedValue = constrain(getTodayDate(timeZone()));
		activeIndex = 0;
		hoveredValue = null;
		if (options.focus !== false) focusFirstInput();
	}

	function setView(next: DatePickerView) {
		if (props().view === undefined) internalView = next;
		props().onViewChange?.({ view: next });
	}

	function setNextView() {
		setView(getNextView(view(), minView(), maxView()));
	}

	function setPreviousView() {
		setView(getPreviousView(view(), minView(), maxView()));
	}

	function focusMonth(month: number) {
		const date = startValue ?? getTodayDate(timeZone());
		setFocusedValueRaw(date.set({ month }));
	}

	function focusYear(year: number) {
		const date = startValue ?? getTodayDate(timeZone());
		setFocusedValueRaw(date.set({ year }));
	}

	function focusNextMonth() {
		setFocusedValueRaw(addMonths(focusedValue(), 1));
	}
	function focusPreviousMonth() {
		setFocusedValueRaw(addMonths(focusedValue(), -1));
	}
	function focusNextYear() {
		setFocusedValueRaw(addYears(focusedValue(), 1));
	}
	function focusPreviousYear() {
		setFocusedValueRaw(addYears(focusedValue(), -1));
	}
	function focusNextDay() {
		setFocusedValueRaw(addDays(focusedValue(), 1));
	}
	function focusPreviousDay() {
		setFocusedValueRaw(addDays(focusedValue(), -1));
	}
	function focusNextWeek() {
		setFocusedValueRaw(addDays(focusedValue(), 7));
	}
	function focusPreviousWeek() {
		setFocusedValueRaw(addDays(focusedValue(), -7));
	}
	function focusNextDecade() {
		setFocusedValueRaw(addYears(focusedValue(), 10));
	}
	function focusPreviousDecade() {
		setFocusedValueRaw(addYears(focusedValue(), -10));
	}

	function setAdjustedValue(adjusted: { startDate: CalendarDate; focusedDate: CalendarDate }) {
		startValue = adjusted.startDate;
		if (compareDates(focusedValue(), adjusted.focusedDate) === 0) return;
		setFocusedValueRaw(adjusted.focusedDate);
	}

	function focusNextPage() {
		setAdjustedValue(
			getNextPage(focusedValue(), startValue, { months: numOfMonths() }, locale(), props().min, props().max)
		);
	}

	function focusPreviousPage() {
		setAdjustedValue(
			getPreviousPage(focusedValue(), startValue, { months: numOfMonths() }, locale(), props().min, props().max)
		);
	}

	function focusNextSection(larger: boolean) {
		setAdjustedValue(
			getNextSection(
				focusedValue(),
				startValue,
				larger,
				{ months: numOfMonths() },
				locale(),
				props().min,
				props().max
			)
		);
	}

	function focusPreviousSection(larger: boolean) {
		setAdjustedValue(
			getPreviousSection(
				focusedValue(),
				startValue,
				larger,
				{ months: numOfMonths() },
				locale(),
				props().min,
				props().max
			)
		);
	}

	function focusSectionStart() {
		setFocusedValueRaw(startValue.copy());
	}

	function focusSectionEnd() {
		setFocusedValueRaw(endValue().copy());
	}

	function focusFirstMonth() {
		setFocusedValueRaw(focusedValue().set({ month: 1 }));
	}

	function focusLastMonth() {
		setFocusedValueRaw(focusedValue().set({ month: 12 }));
	}

	function focusFirstYear() {
		const range = getDecadeRange(focusedValue().year);
		setFocusedValueRaw(focusedValue().set({ year: range[0] }));
	}

	function focusLastYear() {
		const range = getDecadeRange(focusedValue().year);
		setFocusedValueRaw(focusedValue().set({ year: range[range.length - 1] }));
	}

	function setHoveredValue(value: CalendarDate | null) {
		hoveredValue = value;
	}

	function selectFocusedDate() {
		const values = [...valueList()];
		const index = activeIndex;
		values[index] = preserveTime(values[index], focusedValue().copy());
		setValue(adjustStartAndEndDate(values));
		inputValue = { index, value: valueAsString()[index] ?? '' };
	}

	function focusParsedDate(value: string, index: number | undefined) {
		if (index == null) return;
		const date = parsed(value);
		if (!date) return;
		setFocusedValueRaw(date);
	}

	function selectParsedDate(value: string, index: number | undefined) {
		if (index == null) return;
		let date = parsed(value);
		if (!date) {
			if (!value) return;
			date = focusedValue().copy();
		}
		const constrained = constrain(date);
		const values = [...valueList()];
		values[index] = preserveTime(values[index], constrained);
		const adjusted = adjustStartAndEndDate(values);
		setValue(adjusted);
		inputValue = { index, value: constrainingValue(adjusted, index) };
	}

	function constrainingValue(values: CalendarDate[], index: number) {
		const date = values[index];
		return date ? formatDate(date) : '';
	}

	function inputChanged(value: string, index: number) {
		if (value.trim() === '') {
			setValue([]);
			if (!isControlledFocused()) internalFocusedValue = constrain(getTodayDate(timeZone()));
			return;
		}
		if (activeIndex !== index) return;
		inputValue = { index, value };
		focusParsedDate(value, index);
	}

	function goToNext() {
		if (view() === 'year') {
			focusNextDecade();
			return;
		}
		if (view() === 'month') {
			focusNextYear();
			return;
		}
		focusNextPage();
	}

	function goToPrev() {
		if (view() === 'year') {
			focusPreviousDecade();
			return;
		}
		if (view() === 'month') {
			focusPreviousYear();
			return;
		}
		focusPreviousPage();
	}

	function focusActiveCell(viewName: DatePickerView) {
		if (typeof requestAnimationFrame !== 'function') return;
		requestAnimationFrame(() => {
			const content = contentNode;
			if (!content) return;
			const cells = content.querySelectorAll<HTMLElement>(
				`[data-part="table-cell-trigger"][data-view="${viewName}"][data-focus]:not([data-outside-range])`
			);
			const target = cells[0];
			if (target?.isConnected) target.focus({ preventScroll: true });
		});
	}

	function focusFirstInput() {
		if (typeof requestAnimationFrame !== 'function') return;
		requestAnimationFrame(() => {
			const inputs = controlNode?.querySelectorAll<HTMLInputElement>('[data-part="input"]');
			if (inputs?.length) {
				const found = inputs[0];
				found.focus({ preventScroll: true });
				return;
			}
			if (typeof document !== 'undefined') {
				document.getElementById(triggerId)?.focus({ preventScroll: true });
			}
		});
	}

	function focusTrigger() {
		if (typeof document === 'undefined') return;
		document.getElementById(triggerId)?.focus({ preventScroll: true });
	}

	function onCellClick(cell: DatePickerView, value: CalendarDate | number) {
		if (!interactive()) return;
		if (isAboveMinView(view(), minView())) {
			setFocusedValueRaw(withField(focusedValue(), view(), Number(value)));
			setPreviousView();
			return;
		}
		if (isRangePicker() && valueList().length === 2) {
			activeIndex = 0;
			resetSelection(value);
			activeIndex = 1;
			return;
		}
		if (isRangePicker() && activeIndex === 1) {
			setFocusedDate(value);
			setSelectedDate(value);
			activeIndex = 0;
			hoveredValue = null;
			if (props().closeOnSelect !== false) {
				setOpen(false);
				focusFirstInput();
			}
			return;
		}
		if (isRangePicker()) {
			setFocusedDate(value);
			setSelectedDate(value);
			activeIndex = 1;
			return;
		}
		if (isMultiPicker() && canSelectDate(value)) {
			setFocusedDate(value);
			toggleSelectedDate(value);
			return;
		}
		if (isMultiPicker()) {
			setFocusedDate(value);
			return;
		}
		setFocusedDate(value);
		setSelectedDate(value);
		if (props().closeOnSelect !== false) {
			setOpen(false);
			focusFirstInput();
		}
	}

	function onCellPointerMove(cell: DatePickerView, value: CalendarDate, outsideRange: boolean) {
		if (!isRangePicker() || !isOpen() || activeIndex !== 1) return;
		if (outsideRange && cell === 'day') {
			hoveredValue = value;
			return;
		}
		hoveredValue = value;
		setFocusedValueRaw(value);
	}

	function onTableEnter(cell: DatePickerView) {
		if (!interactive()) return;
		if (isAboveMinView(view(), minView())) {
			setPreviousView();
			return;
		}
		if (isRangePicker() && valueList().length === 2) {
			activeIndex = 0;
			resetSelection();
			activeIndex = 1;
			focusNextDay();
			return;
		}
		if (isRangePicker() && activeIndex === 1) {
			setSelectedDate();
			activeIndex = 0;
			hoveredValue = null;
			if (props().closeOnSelect !== false) {
				setOpen(false);
				focusFirstInput();
			}
			return;
		}
		if (isRangePicker()) {
			setSelectedDate();
			activeIndex = 1;
			focusNextDay();
			return;
		}
		if (isMultiPicker()) {
			if (canSelectDate()) toggleSelectedDate();
			return;
		}
		selectFocusedDate();
		if (props().closeOnSelect !== false) {
			setOpen(false);
			focusFirstInput();
		}
		void cell;
	}

	function onTableKeyDown(event: KeyboardEvent) {
		if (!interactive() || event.defaultPrevented) return;
		const viewName = view();
		const columns = viewName === 'day' ? 7 : 4;
		const key = event.key;
		const actions: Record<string, () => void> = {
			Enter: () => onTableEnter(viewName),
			' ': () => onTableEnter(viewName),
			ArrowLeft: () => {
				if (viewName === 'month') focusPreviousMonth();
				else if (viewName === 'year') focusPreviousYear();
				else focusPreviousDay();
			},
			ArrowRight: () => {
				if (viewName === 'month') focusNextMonth();
				else if (viewName === 'year') focusNextYear();
				else {
					focusNextDay();
					setHoveredValue(focusedValue().copy());
				}
			},
			ArrowUp: () => {
				if (viewName === 'month') setFocusedValueRaw(addMonths(focusedValue(), -columns));
				else if (viewName === 'year') setFocusedValueRaw(addYears(focusedValue(), -columns));
				else focusPreviousWeek();
			},
			ArrowDown: () => {
				if (viewName === 'month') setFocusedValueRaw(addMonths(focusedValue(), columns));
				else if (viewName === 'year') setFocusedValueRaw(addYears(focusedValue(), columns));
				else focusNextWeek();
			},
			PageUp: () => focusPreviousSection(event.shiftKey),
			PageDown: () => focusNextSection(event.shiftKey),
			Home: () => {
				if (viewName === 'month') focusFirstMonth();
				else if (viewName === 'year') focusFirstYear();
				else focusSectionStart();
			},
			End: () => {
				if (viewName === 'month') focusLastMonth();
				else if (viewName === 'year') focusLastYear();
				else focusSectionEnd();
			}
		};
		const action = actions[key];
		if (!action) return;
		action();
		event.preventDefault();
		event.stopPropagation();
	}

	function onEscapeFromContent() {
		focusFirstInput();
		setOpen(false);
		focusTrigger();
	}

	const presence = createPresence({
		present: () => isOpen(),
		getNode: () => contentNode,
		lazyMount: () => props().lazyMount ?? true,
		unmountOnExit: () => props().unmountOnExit ?? true,
		onExitComplete: () => props().onExitComplete?.()
	});

	$effect(() => {
		const focused = focusedValue();
		const currentStart = startValue;
		const currentEnd = getEndDate(currentStart, { months: numOfMonths() });
		if (!isDateOutsideRange(focused, currentStart, currentEnd)) return;
		startValue = alignDate(focused, 'start', { months: numOfMonths() }, locale());
	});

	$effect(() => {
		if (!isOpen()) return;
		activeIndex = isRangePicker() && valueList().length === 1 ? 1 : 0;
		if (props().view === undefined) internalView = initialView();
		if (valueList().length) setFocusedValueRaw(constrain(valueList()[0]));
	});

	$effect(() => {
		void focusedValue();
		if (!isOpen()) return;
		focusActiveCell(view());
	});

	$effect(() => {
		void view();
		if (!isOpen()) return;
		focusActiveCell(view());
	});

	$effect(() => {
		const positioner = positionerNode;
		if (!isOpen() || !positioner) return;
		const anchor = controlNode;
		if (!anchor) return;
		currentPlacement = props().positioning?.placement ?? 'bottom';
		return getPlacement(anchor, positioner, {
			...props().positioning,
			listeners: true,
			onComplete(result) {
				currentPlacement = result.placement;
			}
		});
	});

	useEscapeLayer({
		enabled: () => isOpen(),
		onEscape(event) {
			if (props().closeOnEscape === false) return;
			if (props().inline) return;
			event.preventDefault();
			onEscapeFromContent();
		}
	});

	useDismissableLayer({
		enabled: () => isOpen() && !isInline(),
		getNode: () => contentNode,
		getExclude: () => {
			const nodes: (HTMLElement | null)[] = [controlNode];
			if (typeof document !== 'undefined') {
				nodes.push(document.getElementById(triggerId), document.getElementById(clearTriggerId));
			}
			return nodes;
		},
		onInteractOutside(event) {
			if (props().closeOnInteractOutside === false) return;
			event.preventDefault();
			activeIndex = 0;
			setOpen(false);
		}
	});

	function getDayCellState(options: DatePickerDayCellOptions): DatePickerCellState {
		const value = options.value;
		const visible = options.visibleRange ?? visibleRange();
		const formatter = getDayFormatter(locale());
		const unit = getUnitDuration({ months: numOfMonths() });
		const end = addDuration(visible.start, unit).subtract({ days: 1 });
		const outsideDaySelectable = Boolean(props().outsideDaySelectable);
		const outsideRange = isDateOutsideRange(value, visible.start, end);
		const hoveredRange = hoveredValue ? adjustStartAndEndDate([valueList()[0], hoveredValue]) : [];
		const isInSelectedRange = isRangePicker() && isDateWithinRange(value, valueList());
		const isFirstInSelectedRange =
			isRangePicker() && Boolean(valueList()[0]) && compareDates(value, valueList()[0]) === 0;
		const isLastInSelectedRange =
			isRangePicker() && Boolean(valueList()[1]) && compareDates(value, valueList()[1]) === 0;
		const hasHoveredRange = isRangePicker() && hoveredRange.length > 0;
		const isInHoveredRange = hasHoveredRange && isDateWithinRange(value, hoveredRange);
		const isFirstInHoveredRange =
			hasHoveredRange && Boolean(hoveredRange[0]) && compareDates(value, hoveredRange[0]) === 0;
		const isLastInHoveredRange =
			hasHoveredRange && Boolean(hoveredRange[1]) && compareDates(value, hoveredRange[1]) === 0;
		const isSelected = valueList().some((date) => compareDates(value, date) === 0);
		const invalidCell = isDateOutsideRange(value, props().min, props().max);
		const cellDisabled =
			Boolean(options.disabled) ||
			(!outsideDaySelectable && outsideRange) ||
			invalidCell ||
			(isMaxSelected() && !isSelected);
		const unavailable = isUnavailable(value) && !options.disabled;
		const focusedCell =
			compareDates(value, focusedValue()) === 0 && (!outsideRange || outsideDaySelectable);
		return {
			invalid: invalidCell,
			disabled: cellDisabled,
			selectable: !cellDisabled && !unavailable,
			selected: isSelected,
			unavailable,
			outsideRange,
			today: compareDates(value, getTodayDate(timeZone())) === 0,
			weekend: value.dayOfWeek === 0 || value.dayOfWeek === 6,
			value,
			valueText: formatter.format(value),
			focused: focusedCell,
			inRange: isInSelectedRange || isInHoveredRange,
			firstInRange: isFirstInSelectedRange,
			lastInRange: isLastInSelectedRange,
			inHoveredRange: isInHoveredRange,
			firstInHoveredRange: isFirstInHoveredRange,
			lastInHoveredRange: isLastInHoveredRange
		};
	}

	function getMonthCellState(options: DatePickerGridCellOptions): DatePickerCellState {
		const value = options.value;
		const dateValue = focusedValue().set({ month: value });
		const hoveredRange = hoveredValue ? adjustStartAndEndDate([valueList()[0], hoveredValue]) : [];
		const isInSelectedRange = isRangePicker() && isDateWithinRange(dateValue, valueList());
		const isFirstInSelectedRange =
			isRangePicker() && Boolean(valueList()[0]) && valueList()[0].month === value;
		const isLastInSelectedRange =
			isRangePicker() && Boolean(valueList()[1]) && valueList()[1].month === value;
		const hasHoveredRange = isRangePicker() && hoveredRange.length > 0;
		const isInHoveredRange = hasHoveredRange && isDateWithinRange(dateValue, hoveredRange);
		const selectable = !isDateOutsideRange(dateValue, props().min, props().max);
		return {
			focused: focusedValue().month === value,
			selectable,
			selected: valueList().some(
				(date) => date.month === value && date.year === focusedValue().year
			),
			valueText: getMonthFormatter(locale()).format(dateValue),
			inRange: isInSelectedRange || isInHoveredRange,
			firstInRange: isFirstInSelectedRange,
			lastInRange: isLastInSelectedRange,
			inHoveredRange: isInHoveredRange,
			firstInHoveredRange: false,
			lastInHoveredRange: false,
			outsideRange: false,
			today: false,
			weekend: false,
			disabled: Boolean(options.disabled) || !selectable,
			invalid: !selectable,
			unavailable: false,
			value: dateValue
		};
	}

	function getYearCellState(options: DatePickerGridCellOptions): DatePickerCellState {
		const year = options.value;
		const dateValue = focusedValue().set({ year });
		const decade = getDecadeRange(startValue.year);
		const outsideRange = !decade.includes(year);
		const withinMinMax =
			(props().min?.year == null || year >= (props().min as CalendarDate).year) &&
			(props().max?.year == null || year <= (props().max as CalendarDate).year);
		const hoveredRange = hoveredValue ? adjustStartAndEndDate([valueList()[0], hoveredValue]) : [];
		const isInSelectedRange = isRangePicker() && isDateWithinRange(dateValue, valueList());
		const hasHoveredRange = isRangePicker() && hoveredRange.length > 0;
		const isInHoveredRange = hasHoveredRange && isDateWithinRange(dateValue, hoveredRange);
		const selectable = withinMinMax;
		return {
			focused: focusedValue().year === year,
			selectable,
			outsideRange,
			selected: valueList().some((date) => date.year === year),
			valueText: String(year),
			inRange: isInSelectedRange || isInHoveredRange,
			firstInRange: isRangePicker() && Boolean(valueList()[0]) && valueList()[0].year === year,
			lastInRange: isRangePicker() && Boolean(valueList()[1]) && valueList()[1].year === year,
			inHoveredRange: isInHoveredRange,
			firstInHoveredRange: false,
			lastInHoveredRange: false,
			today: false,
			weekend: false,
			disabled: Boolean(options.disabled) || !selectable,
			invalid: !selectable,
			unavailable: false,
			value: dateValue
		};
	}

	function positionerStyle() {
		const positioning = props().positioning;
		return floatingStyle({
			placement: currentPlacement,
			strategy: positioning?.strategy,
			sameWidth: positioning?.sameWidth,
			fitViewport: positioning?.fitViewport,
			applyStyles: positioning?.applyStyles
		});
	}

	function getMonths(options: { format?: 'short' | 'long' } = {}) {
		const format = options.format ?? 'long';
		return getMonthNameList(locale(), format).map((label, index) => {
			const value = index + 1;
			const dateValue = focusedValue().set({ month: value });
			return {
				label,
				value,
				disabled: isDateOutsideRange(dateValue, props().min, props().max)
			};
		});
	}

	const cellTriggerBase = (
		cell: DatePickerView,
		state: DatePickerCellState,
		rawValue: CalendarDate | number | string,
		idSuffix: string
	): Attrs => ({
		id: cellTriggerId(idSuffix),
		role: 'button',
		dir: props().dir,
		tabindex: disabled() ? -1 : state.focused ? 0 : -1,
		'aria-label': state.valueText,
		'aria-disabled': ariaAttr(!state.selectable),
		'data-disabled': dataAttr(!state.selectable),
		'data-selectable': dataAttr(state.selectable),
		'data-selected': dataAttr(state.selected),
		'data-value': rawValue,
		'data-view': cell,
		'data-today': dataAttr(state.today),
		'data-focus': dataAttr(state.focused),
		'data-unavailable': dataAttr(state.unavailable),
		'data-range-start': dataAttr(state.firstInRange),
		'data-range-end': dataAttr(state.lastInRange),
		'data-in-range': dataAttr(state.inRange),
		'data-outside-range': dataAttr(state.outsideRange),
		'data-outside-month': dataAttr(state.outsideRange),
		'data-weekend': dataAttr(state.weekend),
		'data-in-hover-range': dataAttr(state.inHoveredRange),
		'data-hover-range-start': dataAttr(state.firstInHoveredRange),
		'data-hover-range-end': dataAttr(state.lastInHoveredRange)
	});

	const tableCellBase = (state: DatePickerCellState, rawValue: CalendarDate | number | string): Attrs => ({
		role: 'gridcell',
		'aria-selected': ariaAttr(state.selected || state.inRange),
		'aria-disabled': ariaAttr(!state.selectable),
		'data-selected': dataAttr(state.selected),
		'data-value': rawValue
	});

	const pointerMove = (cell: DatePickerView, state: DatePickerCellState) => {
		if (!isRangePicker()) return undefined;
		return (event: PointerEvent) => {
			if (event.pointerType === 'touch') return;
			if (!state.selectable) return;
			onCellPointerMove(cell, state.value, state.outsideRange);
		};
	};

	return {
		id,
		get open() {
			return isOpen();
		},
		get present() {
			return presence.present;
		},
		get hidden() {
			return !presence.present || (!isOpen() && !presence.unmountOnExit);
		},
		get dataState() {
			return presence.dataState;
		},
		get inline() {
			return isInline();
		},
		get focused() {
			return isOpen();
		},
		get disabled() {
			return disabled();
		},
		get readOnly() {
			return readOnly();
		},
		get invalid() {
			return invalid();
		},
		get required() {
			return Boolean(props().required);
		},
		get empty() {
			return empty();
		},
		get interactive() {
			return interactive();
		},
		get selectionMode() {
			return selectionMode();
		},
		get maxSelectedDates() {
			return props().maxSelectedDates;
		},
		get isMaxSelected() {
			return isMaxSelected();
		},
		get numOfMonths() {
			return numOfMonths();
		},
		get showWeekNumbers() {
			return Boolean(props().showWeekNumbers);
		},
		get fixedWeeks() {
			return Boolean(props().fixedWeeks);
		},
		get startOfWeek() {
			return startOfWeekValue();
		},
		get locale() {
			return locale();
		},
		get min() {
			return props().min;
		},
		get max() {
			return props().max;
		},
		get dir() {
			return props().dir;
		},
		get view() {
			return view();
		},
		get minView() {
			return minView();
		},
		get maxView() {
			return maxView();
		},
		get translations() {
			return translations();
		},
		get placement() {
			return currentPlacement;
		},
		get side() {
			return getSide(currentPlacement);
		},
		get value() {
			return valueList();
		},
		get valueAsDate() {
			return valueList().map((date) => date.toDate());
		},
		get valueAsString() {
			return valueAsString();
		},
		get focusedValue() {
			return focusedValue();
		},
		get focusedValueAsDate() {
			return focusedValue().toDate();
		},
		get focusedValueAsString() {
			return formatDate(focusedValue());
		},
		get startValue() {
			return startValue;
		},
		get endValue() {
			return endValue();
		},
		get visibleRange() {
			return visibleRange();
		},
		get visibleRangeText() {
			return visibleRangeText();
		},
		get weeks() {
			return getMonthWeeks();
		},
		get weekDays() {
			return weekDays();
		},
		get portalled() {
			return props().portalled !== false;
		},
		get portalTarget() {
			const ref = props().portalRef;
			return (typeof ref === 'function' ? ref() : ref) ?? undefined;
		},
		get positionerStyle() {
			return positionerStyle();
		},
		get isNextVisibleRangeValid() {
			return isNextRangeAllowed();
		},
		get isPrevVisibleRangeValid() {
			return isPreviousRangeAllowed();
		},
		getRangePresetValue(preset) {
			return getDateRangePreset(preset, locale());
		},
		getWeekNumber(week) {
			const first = week[0];
			return first ? getWeekOfYear(first, locale()) : 0;
		},
		getDaysInWeek(week, from = startValue) {
			return getDaysInWeek(week, from, locale(), startOfWeekValue());
		},
		getOffset(duration) {
			const from = addDuration(startValue, duration);
			const to = addDuration(endValue(), duration);
			const formatter = getMonthFormatter(locale());
			return {
				visibleRange: { start: from, end: to },
				weeks: getMonthWeeks(from),
				visibleRangeText: { start: formatter.format(from), end: formatter.format(to) }
			};
		},
		getMonthWeeks,
		isUnavailable,
		getMonths(options = {}) {
			return getMonths(options);
		},
		getYears() {
			const range = getDefaultYearRange(props().min, props().max);
			return getYearsRangeList(range).map((year) => ({
				label: String(year),
				value: year,
				disabled:
					(props().min?.year != null && year < (props().min as CalendarDate).year) ||
					(props().max?.year != null && year > (props().max as CalendarDate).year)
			}));
		},
		getYearsGrid(options = {}) {
			const columns = options.columns ?? 1;
			const years = getDecadeRange(startValue.year).map((year) => ({
				label: String(year),
				value: year,
				disabled:
					(props().min?.year != null && year < (props().min as CalendarDate).year) ||
					(props().max?.year != null && year > (props().max as CalendarDate).year)
			}));
			const rows: { label: string; value: number; disabled: boolean }[][] = [];
			for (let index = 0; index < years.length; index += columns) {
				rows.push(years.slice(index, index + columns));
			}
			return rows;
		},
		getMonthsGrid(options = {}) {
			const columns = options.columns ?? 1;
			const months = getMonths({ format: options.format ?? 'long' });
			const rows: { label: string; value: number; disabled: boolean }[][] = [];
			for (let index = 0; index < months.length; index += columns) {
				rows.push(months.slice(index, index + columns));
			}
			return rows;
		},
		getDecade() {
			const years = getDecadeRange(startValue.year);
			return { start: years[0], end: years[years.length - 1] };
		},
		getDayCellState,
		getMonthCellState,
		getYearCellState,
		format(value, options = { month: 'long', year: 'numeric' }) {
			return formatCalDate(locale(), options, value);
		},
		setValue,
		selectToday() {
			setValue([constrain(getTodayDate(timeZone()))]);
		},
		clearValue,
		setFocusedValue: setFocusedValueRaw,
		focusMonth,
		focusYear,
		setView,
		goToNext,
		goToPrev,
		setOpen,
		setContentNode(node) {
			contentNode = node;
		},
		setPositionerNode(node) {
			positionerNode = node;
		},
		setControlNode(node) {
			controlNode = node;
		},
		getRootProps() {
			return {
				dir: props().dir,
				id: rootId,
				'data-state': isOpen() ? 'open' : 'closed',
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(invalid()),
				'data-empty': dataAttr(empty())
			};
		},
		getLabelProps(options = {}) {
			const index = options.index ?? 0;
			return {
				id: labelId(index),
				dir: props().dir,
				for: inputId(index),
				'data-state': isOpen() ? 'open' : 'closed',
				'data-index': index,
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(invalid())
			};
		},
		getControlProps() {
			return {
				dir: props().dir,
				id: controlId,
				'data-disabled': dataAttr(disabled()),
				'data-placeholder-shown': dataAttr(empty()),
				'data-invalid': dataAttr(invalid())
			};
		},
		getInputProps(options = {}) {
			const index = options.index ?? 0;
			const fixOnBlur = options.fixOnBlur ?? true;
			const separator = getLocaleSeparator(locale());
			const placeholder =
				props().placeholder ?? getInputPlaceholder(locale(), translations().placeholder());
			return {
				id: inputId(index),
				autocomplete: 'off',
				autocorrect: 'off',
				spellcheck: 'false',
				dir: props().dir,
				name: props().name,
				'data-index': index,
				'data-state': isOpen() ? 'open' : 'closed',
				'data-placeholder-shown': dataAttr(empty()),
				readonly: readOnly() ? true : undefined,
				disabled: disabled() ? true : undefined,
				required: props().required ? true : undefined,
				'aria-invalid': ariaAttr(invalid()),
				'data-invalid': dataAttr(invalid()),
				placeholder,
				value: valueAsString()[index] ?? '',
				onbeforeinput(event: InputEvent) {
					if (!isValidCharacter(event.data, separator, locale())) event.preventDefault();
				},
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!props().openOnClick) return;
					if (!interactive()) return;
					setOpen(true);
				},
				onfocus() {
					activeIndex = index;
				},
				onblur(event: FocusEvent) {
					const target = event.currentTarget as HTMLInputElement;
					const text = target.value.trim();
					activeIndex = 0;
					if (fixOnBlur) selectParsedDate(text, index);
				},
				onkeydown(event: KeyboardEvent) {
					if (event.defaultPrevented) return;
					if (!interactive()) return;
					if (event.key !== 'Enter') return;
					const target = event.currentTarget as HTMLInputElement;
					if (target.value.trim() === '') return;
					if (isUnavailable(focusedValue())) return;
					focusParsedDate(target.value, index);
					selectFocusedDate();
					event.preventDefault();
				},
				oninput(event: Event) {
					const target = event.currentTarget as HTMLInputElement;
					target.value = ensureValidCharacters(target.value, separator, locale());
					inputChanged(target.value, index);
				}
			};
		},
		getTriggerProps() {
			return {
				id: triggerId,
				dir: props().dir,
				type: 'button',
				'data-placement': currentPlacement,
				'data-side': getSide(currentPlacement),
				'aria-label': translations().trigger(isOpen()),
				'aria-controls': contentId,
				'aria-expanded': isOpen(),
				'data-state': isOpen() ? 'open' : 'closed',
				'data-placeholder-shown': dataAttr(empty()),
				'aria-haspopup': 'grid',
				disabled: disabled() ? true : undefined,
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!interactive()) return;
					setOpen(!isOpen());
				}
			};
		},
		getClearTriggerProps() {
			return {
				id: clearTriggerId,
				dir: props().dir,
				type: 'button',
				'aria-label': translations().clearTrigger,
				hidden: valueList().length === 0,
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!interactive()) return;
					clearValue({ focus: false });
				}
			};
		},
		getContentProps() {
			return {
				hidden: !isOpen(),
				dir: props().dir,
				'data-state': isOpen() ? 'open' : 'closed',
				'data-placement': currentPlacement,
				'data-side': getSide(currentPlacement),
				'data-inline': dataAttr(isInline()),
				id: contentId,
				tabindex: -1,
				role: 'application',
				'aria-label': translations().content
			};
		},
		getPositionerProps() {
			return { id: positionerId, dir: props().dir, style: positionerStyle() };
		},
		getPrevTriggerProps(options: DatePickerViewOptions = {}) {
			const viewName = options.view ?? 'day';
			const viewLabels: Record<DatePickerView, string> = {
				day: 'month',
				month: 'year',
				year: 'decade'
			};
			const isDisabled = disabled() || !isPreviousRangeAllowed();
			return {
				dir: props().dir,
				id: prevTriggerId(viewName),
				type: 'button',
				'aria-label': translations().prevTrigger(viewLabels[viewName]),
				disabled: isDisabled ? true : undefined,
				'data-disabled': dataAttr(isDisabled),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (viewName === 'year') focusPreviousDecade();
					else if (viewName === 'month') focusPreviousYear();
					else focusPreviousPage();
				}
			};
		},
		getNextTriggerProps(options: DatePickerViewOptions = {}) {
			const viewName = options.view ?? 'day';
			const viewLabels: Record<DatePickerView, string> = {
				day: 'month',
				month: 'year',
				year: 'decade'
			};
			const isDisabled = disabled() || !isNextRangeAllowed();
			return {
				dir: props().dir,
				id: nextTriggerId(viewName),
				type: 'button',
				'aria-label': translations().nextTrigger(viewLabels[viewName]),
				disabled: isDisabled ? true : undefined,
				'data-disabled': dataAttr(isDisabled),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (viewName === 'year') focusNextDecade();
					else if (viewName === 'month') focusNextYear();
					else focusNextPage();
				}
			};
		},
		getRangeTextProps() {
			return { dir: props().dir };
		},
		getViewProps(options = {}) {
			const viewName = options.view ?? 'day';
			return { 'data-view': viewName, hidden: view() !== viewName };
		},
		getViewControlProps(options = {}) {
			return { 'data-view': options.view ?? 'day', dir: props().dir };
		},
		getViewTriggerProps(options = {}) {
			const viewName = options.view ?? 'day';
			const next = getNextView(viewName, minView(), maxView());
			const hasNextView = next !== viewName;
			const isDisabled = disabled() || !hasNextView;
			return {
				'data-view': viewName,
				dir: props().dir,
				id: viewTriggerId(viewName),
				type: 'button',
				disabled: isDisabled ? true : undefined,
				'data-disabled': dataAttr(isDisabled),
				'aria-label': translations().viewTrigger(viewName, hasNextView ? next : undefined),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!interactive()) return;
					setNextView();
				}
			};
		},
		getTableProps(options = {}) {
			const viewName = options.view ?? 'day';
			const columns = options.columns ?? (viewName === 'day' ? 7 : 4);
			const suffix = [viewName, options.id].filter(Boolean).join(' ');
			return {
				role: 'grid',
				'data-columns': columns,
				'aria-label': visibleRangeText().formatted,
				id: tableId(suffix),
				'aria-readonly': ariaAttr(readOnly()),
				'aria-disabled': ariaAttr(disabled()),
				'aria-multiselectable': ariaAttr(selectionMode() !== 'single'),
				'data-view': viewName,
				dir: props().dir,
				tabindex: -1,
				onkeydown: (event: KeyboardEvent) => onTableKeyDown(event),
				onpointerleave: () => {
					if (isRangePicker()) hoveredValue = null;
				},
				onpointerdown: () => {},
				onpointerup: () => {}
			};
		},
		getTableHeadProps(options = {}) {
			return {
				'aria-hidden': true,
				dir: props().dir,
				'data-view': options.view ?? 'day',
				'data-disabled': dataAttr(disabled())
			};
		},
		getTableHeaderProps(options = {}) {
			return {
				dir: props().dir,
				'data-view': options.view ?? 'day',
				'data-disabled': dataAttr(disabled())
			};
		},
		getTableBodyProps(options = {}) {
			return { 'data-view': options.view ?? 'day', 'data-disabled': dataAttr(disabled()) };
		},
		getTableRowProps(options = {}) {
			return {
				'aria-disabled': ariaAttr(disabled()),
				'data-disabled': dataAttr(disabled()),
				'data-view': options.view ?? 'day'
			};
		},
		getWeekNumberHeaderCellProps(options = {}) {
			return {
				scope: 'col',
				'aria-label': translations().weekColumnHeader,
				'data-view': options.view ?? 'day',
				'data-type': 'week-number',
				'data-disabled': dataAttr(disabled())
			};
		},
		getWeekNumberCellProps(options) {
			const first = options.week[0];
			const weekNumber = first ? getWeekOfYear(first, locale()) : 0;
			return {
				role: 'rowheader',
				'aria-label': translations().weekNumberCell(weekNumber),
				'data-view': 'day',
				'data-week-index': options.weekIndex,
				'data-type': 'week-number',
				'data-disabled': dataAttr(disabled())
			};
		},
		getDayTableCellProps(options) {
			const state = getDayCellState(options);
			return {
				'aria-disabled': ariaAttr(!state.selectable),
				'aria-selected': state.selected || state.inRange,
				'aria-invalid': ariaAttr(state.invalid),
				'aria-current': state.today ? 'date' : undefined,
				'data-value': options.value.toString()
			};
		},
		getDayTableCellTriggerProps(options) {
			const state = getDayCellState(options);
			const suffix = options.value.toString();
			return {
				...cellTriggerBase('day', state, options.value.toString(), suffix),
				'aria-label': translations().dayCell(state),
				'aria-invalid': ariaAttr(state.invalid),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!interactive()) return;
					if (!state.selectable) return;
					onCellClick('day', options.value);
				},
				onpointermove: pointerMove('day', state)
			};
		},
		getMonthTableCellProps(options) {
			const state = getMonthCellState(options);
			return {
				dir: props().dir,
				colspan: options.columns,
				...tableCellBase(state, options.value)
			};
		},
		getMonthTableCellTriggerProps(options) {
			const state = getMonthCellState(options);
			return {
				...cellTriggerBase('month', state, options.value, String(options.value)),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!interactive()) return;
					if (!state.selectable) return;
					onCellClick('month', options.value);
				},
				onpointermove: pointerMove('month', state)
			};
		},
		getYearTableCellProps(options) {
			const state = getYearCellState(options);
			return {
				dir: props().dir,
				colspan: options.columns,
				...tableCellBase(state, options.value)
			};
		},
		getYearTableCellTriggerProps(options) {
			const state = getYearCellState(options);
			return {
				...cellTriggerBase('year', state, options.value, String(options.value)),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!interactive()) return;
					if (!state.selectable) return;
					onCellClick('year', options.value);
				},
				onpointermove: pointerMove('year', state)
			};
		},
		getMonthSelectProps() {
			return {
				id: monthSelectId,
				'aria-label': translations().monthSelect,
				disabled: disabled() ? true : undefined,
				dir: props().dir,
				value: startValue.month,
				onchange(event: Event) {
					focusMonth(Number((event.currentTarget as HTMLSelectElement).value));
				}
			};
		},
		getYearSelectProps() {
			return {
				id: yearSelectId,
				disabled: disabled() ? true : undefined,
				'aria-label': translations().yearSelect,
				dir: props().dir,
				value: startValue.year,
				onchange(event: Event) {
					focusYear(Number((event.currentTarget as HTMLSelectElement).value));
				}
			};
		},
		getPresetTriggerProps(options) {
			const preset = Array.isArray(options.value)
				? options.value
				: getDateRangePreset(options.value as DateRangePreset, locale());
			const valueAsString = preset
				.filter((item): item is CalendarDate => item != null)
				.map((item) => toUtcDate(item).toDateString());
			return {
				'aria-label': translations().presetTrigger(valueAsString),
				type: 'button',
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!interactive()) return;
					setValue(preset);
					setFocusedValueRaw(preset[0]);
					if (props().open !== undefined || isInline()) {
						props().onOpenChange?.({ open: false, value: preset });
						return;
					}
					internalOpen = false;
					focusFirstInput();
				}
			};
		}
	};
}

const viewContext = createContext<() => DatePickerView>('DatePickerView', 'DatePicker.View');
const cellContext = createContext<() => DatePickerGridCellContext>(
	'DatePickerTableCell',
	'DatePicker.TableCell'
);

export interface DatePickerGridCellContext {
	value: CalendarDate | number;
	disabled?: boolean;
	columns?: number;
	visibleRange?: { start: CalendarDate; end: CalendarDate };
}

export const setDatePickerViewContext = (view: () => DatePickerView) => viewContext.set(view);
export const useDatePickerViewContext = (): (() => DatePickerView) => viewContext.use() ?? (() => 'day');
export const setDatePickerCellContext = (value: () => DatePickerGridCellContext) => cellContext.set(value);
export const useDatePickerCellContext = (): (() => DatePickerGridCellContext) => cellContext.get();

export { formatSelectedDate };
export type { CalendarDate };
