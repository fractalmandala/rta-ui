<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CalendarDate } from '../../internal/date';
	import type { DateRangePreset } from './date-picker.state.svelte';

	export interface DatePickerPresetTriggerProps
		extends Omit<HTMLProps<'button'>, 'type' | 'value'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		value: DateRangePreset | CalendarDate[];
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
		value,
		...props
	}: DatePickerPresetTriggerProps = $props();

	const api = useDatePickerContext();
	const attrs = $derived(api.getPresetTriggerProps({ value }));
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="preset-trigger"
	data-slot="date-picker-preset-trigger"
	class={cn(styles.presetTrigger, className)}
>
	{@render children?.()}
</Element>
