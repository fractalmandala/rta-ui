---
title: DateInput
component: date-input
description: Type a date into locale-aware day, month, and year segments.
---

# DateInput

Type a date into locale-aware day, month, and year segments.

Port of `moduix/packages/svelte/src/components/date-input` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { DateInput } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `DateInput` | `DateInput.svelte` | `—` |
| `DateInputControl` | `DateInputControl.svelte` | `—` |
| `DateInputHiddenInput` | `DateInputHiddenInput.svelte` | `—` |
| `DateInputLabel` | `DateInputLabel.svelte` | `—` |
| `DateInputRootProvider` | `DateInputRootProvider.svelte` | `—` |
| `DateInputSegment` | `DateInputSegment.svelte` | `—` |
| `DateInputSegmentGroup` | `DateInputSegmentGroup.svelte` | `—` |
| `DateInputSegments` | `DateInputSegments.svelte` | `—` |
| `DateInputSeparator` | `DateInputSeparator.svelte` | `none (aria-hidden)` |

ARIA roles rendered by this family: `group`, `spinbutton`.

## Props

### `DateInput` — `DateInputRootProps`
accepts the native props of `HTMLProps<'div'>`, and adds to `DateInputRootBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UseDateInputProps` |
| `ids` | `DateInputElementIds` | — | from `UseDateInputProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseDateInputProps` |
| `locale` | `string` | — | from `UseDateInputProps` |
| `timeZone` | `string` | — | from `UseDateInputProps` |
| `disabled` | `boolean` | — | from `UseDateInputProps` |
| `readOnly` | `boolean` | — | from `UseDateInputProps` |
| `invalid` | `boolean` | — | from `UseDateInputProps` |
| `required` | `boolean` | — | from `UseDateInputProps` |
| `name` | `string` | — | from `UseDateInputProps` |
| `form` | `string` | — | from `UseDateInputProps` |
| `selectionMode` | `DateInputSelectionMode` | — | from `UseDateInputProps` |
| `min` | `CalendarDate \| string \| null` | — | from `UseDateInputProps` |
| `max` | `CalendarDate \| string \| null` | — | from `UseDateInputProps` |
| `value` | `DateInputValue` | — | bindable from `UseDateInputProps` |
| `defaultValue` | `DateInputValue` | — | from `UseDateInputProps` |
| `placeholderValue` | `CalendarDate \| string \| null` | — | bindable from `UseDateInputProps` |
| `isDateUnavailable` | `(date: CalendarDate, locale?: string) => boolean` | — | from `UseDateInputProps` |
| `translations` | `DateInputTranslations` | — | from `UseDateInputProps` |
| `onValueChange` | `(details: DateInputValueChangeDetails) => void` | — | from `UseDateInputProps` |
| `onFocusChange` | `(details: DateInputFocusChangeDetails) => void` | — | from `UseDateInputProps` |
| `onPlaceholderChange` | `(details: DateInputPlaceholderChangeDetails) => void` | — | from `UseDateInputProps` |

### `DateInputHiddenInput` — `DateInputHiddenInputProps`
accepts the native props of `Omit<HTMLProps<'input'>, 'value' | 'name'>`, and adds to `DateInputHiddenInputBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | — | from `DateInputHiddenInputBaseProps` |
| `name` | `string` | — | from `DateInputHiddenInputBaseProps` |

### `DateInputLabel` — `DateInputLabelProps`
accepts the native props of `HTMLProps<'label'>`, and adds to `DateInputLabelBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | — | from `DateInputLabelBaseProps` |

### `DateInputRootProvider` — `DateInputRootProviderBaseProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `DateInputApi` | — |  |

### `DateInputSegment` — `DateInputSegmentProps`
accepts the native props of `HTMLProps<'span'>`, and adds to `DateInputSegmentBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `segment` | `DateInputSegmentValue` | — | from `DateInputSegmentBaseProps` |
| `position` | `number` | — | from `DateInputSegmentBaseProps` |

### `DateInputSegmentGroup` — `DateInputSegmentGroupProps`
accepts the native props of `HTMLProps<'div'>`, and adds to `DateInputSegmentGroupBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | `0` | from `DateInputSegmentGroupBaseProps` |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `DateInput` | `date-input` | `root` | `date-input-root` |
| `DateInputControl` | `date-input` | `control` | `date-input-control` |
| `DateInputHiddenInput` | `date-input` | `hidden-input` | `date-input-hidden-input` |
| `DateInputLabel` | `date-input` | `label` | `date-input-label` |
| `DateInputRootProvider` | `date-input` | `root` | `date-input-root-provider` |
| `DateInputSegment` | `date-input` | `segment` | `date-input-segment` |
| `DateInputSegmentGroup` | `date-input` | `segment-group` | `date-input-segment-group` |
| `DateInputSeparator` | `—` | `—` | `date-input-separator` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-date-input-control-height` | `var(--moduix-size-md)` |
| `--moduix-date-input-radius` | `var(--moduix-radius-md)` |
| `--moduix-date-input-width` | `auto` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `date-input:${id}`
- `date-input:${id}:control`
- `date-input:${id}:hidden-input:${id}`
- `date-input:${id}:label:${id}`
- `date-input:${id}:segment-group:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		DateInput,
		DateInputControl,
		DateInputHiddenInput,
		DateInputLabel,
		DateInputSegments
	} from 'rta-ui';
	import { CalendarDate } from '../../lib/internal/date';

	let appointment = $state('2024-03-15');
</script>

<DateInput
	bind:value={appointment}
	name="appointment"
	min={new CalendarDate(2024, 1, 1)}
	max={new CalendarDate(2024, 12, 31)}
>
	<DateInputLabel>Appointment</DateInputLabel>
	<DateInputControl>
		<DateInputSegments />
		<DateInputHiddenInput />
	</DateInputControl>
</DateInput>

<p>Appointment: {appointment}</p>

<DateInput name="deadline" defaultValue="2024-06-30">
	<DateInputLabel>Deadline</DateInputLabel>
	<DateInputControl>
		<DateInputSegments />
		<DateInputHiddenInput />
	</DateInputControl>
</DateInput>
```

## Behaviour covered by tests

- renders the segmented field contract
- types digits into each segment and commits the ISO form value
- binds value and defaultValue as ISO strings
- arrow keys move between segments and adjust values
- backspace clears a filled segment and steps back from a placeholder
- month segment accepts a typeahead month name
- clamps committed values to min and max
- honours disabled and readOnly without trapping the segment contract

## Notes

- **Parity:** accepted deviation — The hidden input is an Ark internal upstream; here it is a public part so form submission stays reachable.
  Extra slots: `date-input-hidden-input`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
