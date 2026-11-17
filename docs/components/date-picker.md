---
title: DatePicker
component: date-picker
description: Pick a date, range, or several dates from a calendar.
---

# DatePicker

Pick a date, range, or several dates from a calendar.

Port of `moduix/packages/svelte/src/components/date-picker` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Parts

| export | file |
| --- | --- |
| `DatePicker` | `DatePicker.svelte` |
| `DatePickerClearTrigger` | `DatePickerClearTrigger.svelte` |
| `DatePickerContent` | `DatePickerContent.svelte` |
| `DatePickerControl` | `DatePickerControl.svelte` |
| `DatePickerDayTable` | `DatePickerDayTable.svelte` |
| `DatePickerField` | `DatePickerField.svelte` |
| `DatePickerInput` | `DatePickerInput.svelte` |
| `DatePickerLabel` | `DatePickerLabel.svelte` |
| `DatePickerMonthSelect` | `DatePickerMonthSelect.svelte` |
| `DatePickerMonthTable` | `DatePickerMonthTable.svelte` |
| `DatePickerNextTrigger` | `DatePickerNextTrigger.svelte` |
| `DatePickerPositioner` | `DatePickerPositioner.svelte` |
| `DatePickerPresetTrigger` | `DatePickerPresetTrigger.svelte` |
| `DatePickerPrevTrigger` | `DatePickerPrevTrigger.svelte` |
| `DatePickerRangeField` | `DatePickerRangeField.svelte` |
| `DatePickerRangeText` | `DatePickerRangeText.svelte` |
| `DatePickerRootProvider` | `DatePickerRootProvider.svelte` |
| `DatePickerTable` | `DatePickerTable.svelte` |
| `DatePickerTableBody` | `DatePickerTableBody.svelte` |
| `DatePickerTableCell` | `DatePickerTableCell.svelte` |
| `DatePickerTableCellTrigger` | `DatePickerTableCellTrigger.svelte` |
| `DatePickerTableHead` | `DatePickerTableHead.svelte` |
| `DatePickerTableHeader` | `DatePickerTableHeader.svelte` |
| `DatePickerTableRow` | `DatePickerTableRow.svelte` |
| `DatePickerTrigger` | `DatePickerTrigger.svelte` |
| `DatePickerValueText` | `DatePickerValueText.svelte` |
| `DatePickerView` | `DatePickerView.svelte` |
| `DatePickerViewControl` | `DatePickerViewControl.svelte` |
| `DatePickerViewTrigger` | `DatePickerViewTrigger.svelte` |
| `DatePickerWeekNumberCell` | `DatePickerWeekNumberCell.svelte` |
| `DatePickerWeekNumberHeaderCell` | `DatePickerWeekNumberHeaderCell.svelte` |
| `DatePickerYearSelect` | `DatePickerYearSelect.svelte` |
| `DatePickerYearTable` | `DatePickerYearTable.svelte` |

## Props

### `DatePicker` — `DatePickerRootProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'placeholder'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseDatePickerProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UseDatePickerProps` |
| `ids` | `DatePickerElementIds` | — | from `UseDatePickerProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseDatePickerProps` |
| `locale` | `string` | — | from `UseDatePickerProps` |
| `timeZone` | `string` | — | from `UseDatePickerProps` |
| `disabled` | `boolean` | — | from `UseDatePickerProps` |
| `readOnly` | `boolean` | — | from `UseDatePickerProps` |
| `invalid` | `boolean` | — | from `UseDatePickerProps` |
| `required` | `boolean` | — | from `UseDatePickerProps` |
| `name` | `string` | — | from `UseDatePickerProps` |
| `inline` | `boolean` | — | from `UseDatePickerProps` |
| `closeOnSelect` | `boolean` | — | from `UseDatePickerProps` |
| `fixedWeeks` | `boolean` | — | from `UseDatePickerProps` |
| `outsideDaySelectable` | `boolean` | — | from `UseDatePickerProps` |
| `openOnClick` | `boolean` | — | from `UseDatePickerProps` |
| `showWeekNumbers` | `boolean` | — | from `UseDatePickerProps` |
| `numOfMonths` | `number` | — | from `UseDatePickerProps` |
| `selectionMode` | `DatePickerSelectionMode` | — | from `UseDatePickerProps` |
| `maxSelectedDates` | `number` | — | from `UseDatePickerProps` |
| `minView` | `DatePickerView` | — | from `UseDatePickerProps` |
| `maxView` | `DatePickerView` | — | from `UseDatePickerProps` |
| `startOfWeek` | `number \| null` | — | from `UseDatePickerProps` |
| `value` | `CalendarDate[] \| undefined` | — | bindable from `UseDatePickerProps` |
| `defaultValue` | `CalendarDate[]` | — | from `UseDatePickerProps` |
| `focusedValue` | `CalendarDate \| undefined` | — | bindable from `UseDatePickerProps` |
| `defaultFocusedValue` | `CalendarDate` | — | from `UseDatePickerProps` |
| `open` | `boolean` | — | bindable from `UseDatePickerProps` |
| `defaultOpen` | `boolean` | — | from `UseDatePickerProps` |
| `view` | `DatePickerView` | — | bindable from `UseDatePickerProps` |
| `defaultView` | `DatePickerView` | — | from `UseDatePickerProps` |
| `min` | `CalendarDate` | — | from `UseDatePickerProps` |
| `max` | `CalendarDate` | — | from `UseDatePickerProps` |
| `placeholder` | `string` | — | from `UseDatePickerProps` |
| `format` | `DatePickerFormatFn` | — | from `UseDatePickerProps` |
| `parse` | `DatePickerParseFn` | — | from `UseDatePickerProps` |
| `isDateUnavailable` | `(date: CalendarDate, locale?: string) => boolean` | — | from `UseDatePickerProps` |
| `positioning` | `PositionOptions` | — | from `UseDatePickerProps` |
| `translations` | `Partial<DatePickerTranslations>` | — | from `UseDatePickerProps` |
| `portalled` | `boolean` | — | from `UseDatePickerProps` |
| `portalRef` | `HTMLElement \| (() => HTMLElement \| null \| undefined)` | — | from `UseDatePickerProps` |
| `lazyMount` | `boolean` | — | from `UseDatePickerProps` |
| `unmountOnExit` | `boolean` | — | from `UseDatePickerProps` |
| `closeOnInteractOutside` | `boolean` | — | from `UseDatePickerProps` |
| `closeOnEscape` | `boolean` | — | from `UseDatePickerProps` |
| `onValueChange` | `(details: DatePickerValueChangeDetails) => void` | — | from `UseDatePickerProps` |
| `onFocusChange` | `(details: DatePickerFocusChangeDetails) => void` | — | from `UseDatePickerProps` |
| `onViewChange` | `(details: DatePickerViewChangeDetails) => void` | — | from `UseDatePickerProps` |
| `onOpenChange` | `(details: DatePickerOpenChangeDetails) => void` | — | from `UseDatePickerProps` |
| `onVisibleRangeChange` | `(details: DatePickerVisibleRangeChangeDetails) => void` | — | from `UseDatePickerProps` |
| `onExitComplete` | `() => void` | — | from `UseDatePickerProps` |

### `DatePickerDayTable` — `DatePickerDayTableProps`
adds to `Omit<DatePickerTableProps, 'asChild' | 'children' | 'columns'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `columns` | `number` | — | from `DatePickerTableProps` |
| `id` | `string` | — | from `DatePickerTableProps` |
| `view` | `DatePickerViewName` | — | from `DatePickerTableProps` |
| `offset` | `number` | — |  |
| `showHeader` | `boolean` | `true` |  |

### `DatePickerField` — `DatePickerFieldProps`
adds to `Omit<DatePickerControlProps, 'asChild' | 'children'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `clearLabel` | `string` | — |  |
| `clearTriggerProps` | `DatePickerClearTriggerProps` | — |  |
| `inputProps` | `DatePickerInputProps` | — |  |
| `placeholder` | `DatePickerInputProps['placeholder']` | — |  |
| `triggerLabel` | `string` | — |  |
| `triggerProps` | `DatePickerTriggerProps` | — |  |

### `DatePickerInput` — `DatePickerInputProps`
accepts the native props of `Omit<HTMLProps<'input'>, 'value'>`, `PolymorphicProps<'input'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | `0` |  |
| `fixOnBlur` | `boolean` | `true` |  |

### `DatePickerLabel` — `DatePickerLabelProps`
accepts the native props of `HTMLProps<'label'>`, `PolymorphicProps<'label'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | `0` |  |

### `DatePickerMonthTable` — `DatePickerMonthTableProps`
adds to `Omit<DatePickerTableProps, 'asChild' | 'children'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `columns` | `number` | `4` | from `DatePickerTableProps` |
| `id` | `string` | — | from `DatePickerTableProps` |
| `view` | `DatePickerViewName` | — | from `DatePickerTableProps` |
| `format` | `'short' \| 'long'` | `'short'` |  |
| `showHeader` | `boolean` | `true` |  |

### `DatePickerPresetTrigger` — `DatePickerPresetTriggerProps`
accepts the native props of `Omit<HTMLProps<'button'>, 'type' | 'value'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `DateRangePreset \| CalendarDate[]` | — |  |

### `DatePickerRangeField` — `DatePickerRangeFieldProps`
adds to `Omit<DatePickerControlProps, 'asChild' | 'children'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `clearLabel` | `string` | — |  |
| `clearTriggerProps` | `DatePickerClearTriggerProps` | — |  |
| `endInputProps` | `DatePickerInputProps` | — |  |
| `endPlaceholder` | `DatePickerInputProps['placeholder']` | — |  |
| `startInputProps` | `DatePickerInputProps` | — |  |
| `startPlaceholder` | `DatePickerInputProps['placeholder']` | — |  |
| `triggerLabel` | `string` | — |  |
| `triggerProps` | `DatePickerTriggerProps` | — |  |

### `DatePickerRootProvider` — `DatePickerRootProviderProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `DatePickerApi` | — |  |

### `DatePickerTable` — `DatePickerTableProps`
accepts the native props of `HTMLProps<'table'>`, `PolymorphicProps<'table'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `columns` | `number` | — |  |
| `id` | `string` | — |  |
| `view` | `DatePickerViewName` | — |  |

### `DatePickerTableCell` — `DatePickerTableCellProps`
accepts the native props of `HTMLProps<'td'>`, `PolymorphicProps<'td'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `CalendarDate \| number` | — |  |
| `disabled` | `boolean` | — |  |
| `columns` | `number` | — |  |
| `visibleRange` | `{ start: CalendarDate; end: CalendarDate }` | — |  |

### `DatePickerValueText` — `DatePickerValueTextProps`
accepts the native props of `Omit<HTMLProps<'span'>, 'children'>`, `Omit<PolymorphicProps<'span'>, 'children'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `placeholder` | `string` | — |  |
| `separator` | `string` | `'` |  |
| `children` | `Snippet<[DatePickerValueTextRenderProps]>` | — |  |

### `DatePickerView` — `DatePickerViewProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `view` | `DatePickerViewName` | `'day'` |  |

### `DatePickerWeekNumberCell` — `DatePickerWeekNumberCellProps`
accepts the native props of `HTMLProps<'td'>`, `PolymorphicProps<'td'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `week` | `CalendarDate[]` | — |  |
| `weekIndex` | `number` | — |  |

### `DatePickerYearTable` — `DatePickerYearTableProps`
adds to `Omit<DatePickerTableProps, 'asChild' | 'children'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `columns` | `number` | `4` | from `DatePickerTableProps` |
| `id` | `string` | — | from `DatePickerTableProps` |
| `view` | `DatePickerViewName` | — | from `DatePickerTableProps` |
| `showHeader` | `boolean` | `true` |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `DatePicker` | `date-picker` | `root` | `date-picker-root` |
| `DatePickerClearTrigger` | `date-picker` | `clear-trigger` | `date-picker-clear-trigger` |
| `DatePickerContent` | `date-picker` | `content` | `date-picker-content` |
| `DatePickerControl` | `date-picker` | `control` | `date-picker-control` |
| `DatePickerInput` | `date-picker` | `input` | `date-picker-input` |
| `DatePickerLabel` | `date-picker` | `label` | `date-picker-label` |
| `DatePickerMonthSelect` | `date-picker` | `month-select` | `date-picker-month-select-control` |
| `DatePickerNextTrigger` | `date-picker` | `next-trigger` | `date-picker-next-trigger` |
| `DatePickerPositioner` | `date-picker` | `positioner` | `date-picker-positioner` |
| `DatePickerPresetTrigger` | `date-picker` | `preset-trigger` | `date-picker-preset-trigger` |
| `DatePickerPrevTrigger` | `date-picker` | `prev-trigger` | `date-picker-prev-trigger` |
| `DatePickerRangeText` | `date-picker` | `range-text` | `date-picker-range-text` |
| `DatePickerRootProvider` | `date-picker` | `root` | `date-picker-root-provider` |
| `DatePickerTable` | `date-picker` | `table` | `date-picker-table` |
| `DatePickerTableBody` | `date-picker` | `table-body` | `date-picker-table-body` |
| `DatePickerTableCell` | `date-picker` | `table-cell` | `date-picker-table-cell` |
| `DatePickerTableCellTrigger` | `date-picker` | `table-cell-trigger` | `date-picker-table-cell-trigger` |
| `DatePickerTableHead` | `date-picker` | `table-head` | `date-picker-table-head` |
| `DatePickerTableHeader` | `date-picker` | `table-header` | `date-picker-table-header` |
| `DatePickerTableRow` | `date-picker` | `table-row` | `date-picker-table-row` |
| `DatePickerTrigger` | `date-picker` | `trigger` | `date-picker-trigger` |
| `DatePickerValueText` | `date-picker` | `value-text` | `date-picker-value-text` |
| `DatePickerView` | `date-picker` | `view` | `date-picker-view` |
| `DatePickerViewControl` | `date-picker` | `view-control` | `date-picker-view-control` |
| `DatePickerViewTrigger` | `date-picker` | `view-trigger` | `date-picker-view-trigger` |
| `DatePickerWeekNumberCell` | `date-picker` | `table-cell` | `date-picker-week-number-cell` |
| `DatePickerWeekNumberHeaderCell` | `date-picker` | `table-cell` | `date-picker-week-number-header-cell` |
| `DatePickerYearSelect` | `date-picker` | `year-select` | `date-picker-year-select-control` |

Custom properties read by this family’s CSS Module:

- `--moduix-date-picker-content-width`
- `--moduix-date-picker-control-height`
- `--moduix-date-picker-radius`
- `--moduix-date-picker-table-cell-size`
- `--moduix-date-picker-width`

## Generated ids

- `datepicker:${id}`
- `datepicker:${id}:cell-trigger:${id}`
- `datepicker:${id}:clear`
- `datepicker:${id}:content`
- `datepicker:${id}:control`
- `datepicker:${id}:input:${id}`
- `datepicker:${id}:label:${id}`
- `datepicker:${id}:month-select`
- `datepicker:${id}:next:${id}`
- `datepicker:${id}:positioner`
- `datepicker:${id}:prev:${id}`
- `datepicker:${id}:table:${id}`

Every id is overridable through the `ids` prop.

## Usage

The gallery demo, verbatim:

```svelte
<script lang="ts">
	import {
		DatePicker,
		DatePickerClearTrigger,
		DatePickerContent,
		DatePickerControl,
		DatePickerDayTable,
		DatePickerInput,
		DatePickerLabel,
		DatePickerMonthTable,
		DatePickerPositioner,
		DatePickerPresetTrigger,
		DatePickerRangeText,
		DatePickerTrigger,
		DatePickerValueText,
		DatePickerView,
		DatePickerYearTable
	} from 'rta-ui';
	import type { CalendarDate } from '../../lib/internal/date';

	let date = $state<CalendarDate[] | undefined>(undefined);
	let range = $state<CalendarDate[] | undefined>(undefined);
</script>

<DatePicker bind:value={date}>
	<DatePickerLabel>Departure</DatePickerLabel>
	<DatePickerControl>
		<DatePickerInput placeholder="mm/dd/yyyy" />
		<DatePickerClearTrigger />
		<DatePickerTrigger />
	</DatePickerControl>
	<DatePickerValueText placeholder="No date chosen" />
	<DatePickerPositioner>
		<DatePickerContent>
			<DatePickerView view="day">
				<DatePickerRangeText />
				<DatePickerDayTable />
			</DatePickerView>
			<DatePickerView view="month">
				<DatePickerMonthTable />
			</DatePickerView>
			<DatePickerView view="year">
				<DatePickerYearTable />
			</DatePickerView>
		</DatePickerContent>
	</DatePickerPositioner>
</DatePicker>

<p>Departure: {date?.[0]?.toString() ?? 'none'}</p>

<DatePicker bind:value={range} selectionMode="range">
	<DatePickerLabel>Trip</DatePickerLabel>
	<DatePickerControl>
		<DatePickerInput index={0} placeholder="mm/dd/yyyy" />
		<DatePickerInput index={1} placeholder="mm/dd/yyyy" />
		<DatePickerClearTrigger />
		<DatePickerTrigger />
	</DatePickerControl>
	<DatePickerPositioner>
		<DatePickerContent>
			<DatePickerView view="day">
				<DatePickerRangeText />
				<DatePickerDayTable />
			</DatePickerView>
			<DatePickerPresetTrigger value="last7Days">Last 7 days</DatePickerPresetTrigger>
			<DatePickerPresetTrigger value="thisMonth">This month</DatePickerPresetTrigger>
		</DatePickerContent>
	</DatePickerPositioner>
</DatePicker>

<p>Trip: {range?.map((item) => item.toString()).join(' to ') ?? 'none'}</p>
```

## Behaviour covered by tests

- renders the ark contract for root, label, control and input
- opens into a portalled day grid with the zag cell hooks
- selects a day, closes, and writes the input and hidden form value
- range mode marks start, end and in-range cells and closes after the second pick
- keyboard paging and view switching drive the calendar
- honours min, max and isDateUnavailable
- fixed weeks, week numbers and startOfWeek shape the day grid
- renders value text and clears on the clear trigger, Escape and month select

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
