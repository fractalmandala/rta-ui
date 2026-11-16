<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerRangeTextProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
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
		...props
	}: DatePickerRangeTextProps = $props();

	const api = useDatePickerContext();
	const attrs = $derived(api.getRangeTextProps());
	const text = $derived.by(() => {
		const { start, end } = api.visibleRangeText;
		return start === end ? start : `${start} - ${end}`;
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="range-text"
	data-slot="date-picker-range-text"
	class={cn(styles.rangeText, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{text}
	{/if}
</Element>
