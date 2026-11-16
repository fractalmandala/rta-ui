<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CalendarDate } from '../../internal/date';

	export interface DatePickerValueTextRenderProps {
		value: CalendarDate;
		index: number;
		valueAsString: string;
		remove: () => void;
	}

	export interface DatePickerValueTextProps
		extends Omit<HTMLProps<'span'>, 'children'>,
			Omit<PolymorphicProps<'span'>, 'children'>,
			RefAttribute {
		placeholder?: string;
		separator?: string;
		children?: Snippet<[DatePickerValueTextRenderProps]>;
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
		placeholder,
		ref = $bindable(null),
		separator = ', ',
		...props
	}: DatePickerValueTextProps = $props();

	const api = useDatePickerContext();
	const display = $derived(
		api.value.length > 0 ? api.valueAsString.join(separator) : (placeholder ?? '')
	);
</script>

{#if children}
	{#each api.value as item, index (index)}
		{@render children({
			value: item,
			index,
			valueAsString: api.valueAsString[index],
			remove: () => api.setValue(api.value.filter((_, position) => position !== index))
		})}
	{/each}
	{#if api.value.length === 0}
		{placeholder}
	{/if}
{:else}
	<Element
		as="span"
		{...props}
		bind:ref
		{asChild}
		data-scope="date-picker"
		data-part="value-text"
		data-slot="date-picker-value-text"
		class={cn(styles.valueText, className)}
	>
		{display}
	</Element>
{/if}
