<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { DatePickerView as DatePickerViewName } from './date-picker.state.svelte';

	export interface DatePickerViewProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		view?: DatePickerViewName;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DatePicker.module.css';
	import { setDatePickerViewContext, useDatePickerContext } from './date-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		view = 'day',
		...props
	}: DatePickerViewProps = $props();

	const api = useDatePickerContext();
	const attrs = $derived(api.getViewProps({ view }));

	setDatePickerViewContext(() => view);
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="view"
	data-slot="date-picker-view"
	class={cn(styles.view, className)}
>
	{@render children?.()}
</Element>
