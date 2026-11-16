<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseDatePickerProps } from './date-picker.state.svelte';

	export interface DatePickerRootProps
		extends UseDatePickerProps,
			Omit<HTMLProps<'div'>, 'placeholder'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { useFieldContext } from '../field/field.state.svelte';
	import { useFieldsetContext } from '../fieldset/fieldset.state.svelte';
	import styles from './DatePicker.module.css';
	import { createDatePicker, setDatePickerContext } from './date-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		closeOnEscape,
		closeOnInteractOutside,
		closeOnSelect,
		defaultFocusedValue,
		defaultOpen,
		defaultValue,
		defaultView,
		dir,
		disabled,
		fixedWeeks,
		focusedValue = $bindable(),
		format,
		id,
		ids,
		inline,
		invalid,
		lazyMount,
		locale,
		max,
		maxSelectedDates,
		maxView,
		min,
		minView,
		numOfMonths,
		onExitComplete,
		onFocusChange,
		onOpenChange,
		onValueChange,
		onViewChange,
		onVisibleRangeChange,
		open = $bindable(),
		openOnClick,
		outsideDaySelectable,
		parse,
		placeholder,
		portalled,
		portalRef,
		positioning,
		readOnly,
		ref = $bindable(null),
		required,
		selectionMode,
		showWeekNumbers,
		startOfWeek,
		timeZone,
		translations,
		unmountOnExit,
		value = $bindable(),
		view = $bindable(),
		...props
	}: DatePickerRootProps = $props();

	const field = useFieldContext();
	const fieldset = useFieldsetContext();
	const uid = $props.id();

	const api = createDatePicker(
		() => ({
			...props,
			closeOnEscape,
			closeOnInteractOutside,
			closeOnSelect,
			defaultFocusedValue,
			defaultOpen,
			defaultValue,
			defaultView,
			dir,
			disabled: disabled ?? field?.disabled ?? fieldset?.disabled,
			fixedWeeks,
			format,
			id,
			ids,
			inline,
			invalid: invalid ?? field?.invalid ?? fieldset?.invalid,
			lazyMount,
			locale,
			max,
			maxSelectedDates,
			maxView,
			min,
			minView,
			numOfMonths,
			onExitComplete,
			onVisibleRangeChange,
			openOnClick,
			outsideDaySelectable,
			parse,
			placeholder,
			portalled,
			portalRef,
			positioning,
			readOnly: readOnly ?? field?.readOnly,
			required: required ?? field?.required,
			selectionMode,
			showWeekNumbers,
			startOfWeek,
			timeZone,
			translations,
			unmountOnExit,
			focusedValue,
			open,
			value,
			view,
			onFocusChange(details) {
				onFocusChange?.(details);
				if (focusedValue !== undefined) focusedValue = details.focusedValue;
			},
			onOpenChange(details) {
				onOpenChange?.(details);
				if (open !== undefined) open = details.open;
			},
			onValueChange(details) {
				onValueChange?.(details);
				if (value !== undefined) value = details.value;
			},
			onViewChange(details) {
				onViewChange?.(details);
				if (view !== undefined) view = details.view;
			}
		}),
		uid
	);
	setDatePickerContext(api);
</script>

<Element
	as="div"
	{...props}
	{...api.getRootProps()}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="root"
	data-slot="date-picker-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
