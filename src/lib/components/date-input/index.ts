export { default as DateInput } from './DateInput.svelte';
export { default as DateInputControl } from './DateInputControl.svelte';
export { default as DateInputHiddenInput } from './DateInputHiddenInput.svelte';
export { default as DateInputLabel } from './DateInputLabel.svelte';
export { default as DateInputRootProvider } from './DateInputRootProvider.svelte';
export { default as DateInputSegment } from './DateInputSegment.svelte';
export { default as DateInputSegmentGroup } from './DateInputSegmentGroup.svelte';
export { default as DateInputSegments } from './DateInputSegments.svelte';
export { default as DateInputSeparator } from './DateInputSeparator.svelte';

export { createDateInput, setDateInputContext, useDateInputContext } from './date-input.state.svelte';

export type {
	DateInputApi,
	DateInputDateValue,
	DateInputElementIds,
	DateInputFocusChangeDetails,
	DateInputPlaceholderChangeDetails,
	DateInputSelectionMode,
	DateInputSegmentState,
	DateInputTranslations,
	DateInputValue,
	DateInputValueChangeDetails,
	UseDateInputProps
} from './date-input.state.svelte';
export type {
	DateInputDisplayValue,
	DateInputSegmentTemplatePart,
	DateInputSegmentType,
	DateInputSegment as DateInputSegmentValue
} from './date-input.utils';

export type { CalendarDate } from '../../internal/date';
export type { DateInputRootBaseProps, DateInputRootProps } from './DateInput.svelte';
export type {
	DateInputRootProviderBaseProps,
	DateInputRootProviderProps
} from './DateInputRootProvider.svelte';
export type { DateInputControlBaseProps, DateInputControlProps } from './DateInputControl.svelte';
export type { DateInputLabelBaseProps, DateInputLabelProps } from './DateInputLabel.svelte';
export type {
	DateInputSegmentBaseProps,
	DateInputSegmentProps
} from './DateInputSegment.svelte';
export type {
	DateInputSegmentGroupBaseProps,
	DateInputSegmentGroupProps
} from './DateInputSegmentGroup.svelte';
export type { DateInputSegmentsProps } from './DateInputSegments.svelte';
export type { DateInputSeparatorProps } from './DateInputSeparator.svelte';
export type {
	DateInputHiddenInputBaseProps,
	DateInputHiddenInputProps
} from './DateInputHiddenInput.svelte';

import type { Snippet } from 'svelte';
import type { DateInputApi } from './date-input.state.svelte';
import type { DateInputSegment } from './date-input.utils';

export type UseDateInputReturn = DateInputApi;
export type UseDateInputContext = DateInputApi;
export type DateInputContextProps = { children?: Snippet<[DateInputApi]> };
export type DateInputSegmentContextProps = { children?: Snippet<[DateInputSegment]> };
