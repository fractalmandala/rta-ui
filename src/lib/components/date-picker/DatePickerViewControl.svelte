<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerViewControlProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DatePicker.module.css';
	import { useDatePickerContext, useDatePickerViewContext } from './date-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: DatePickerViewControlProps = $props();

	const api = useDatePickerContext();
	const view = useDatePickerViewContext();
	const attrs = $derived(api.getViewControlProps({ view: view() }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="view-control"
	data-slot="date-picker-view-control"
	class={cn(styles.viewControl, className)}
>
	{@render children?.()}
</Element>
