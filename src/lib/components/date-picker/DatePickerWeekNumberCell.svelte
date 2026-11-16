<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CalendarDate } from '../../internal/date';

	export interface DatePickerWeekNumberCellProps
		extends HTMLProps<'td'>,
			PolymorphicProps<'td'>,
			RefAttribute {
		week: CalendarDate[];
		weekIndex: number;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DatePicker.module.css';
	import { useDatePickerContext } from './date-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		week,
		weekIndex,
		...props
	}: DatePickerWeekNumberCellProps = $props();

	const api = useDatePickerContext();
	const attrs = $derived(api.getWeekNumberCellProps({ week, weekIndex }));
</script>

<Element
	as="td"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="table-cell"
	data-slot="date-picker-week-number-cell"
	class={cn(styles.weekNumberCell, className)}
>
	{@render children?.()}
</Element>
