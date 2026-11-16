<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerYearSelectProps
		extends Omit<HTMLProps<'select'>, 'value'>,
			PolymorphicProps<'select'>,
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
	}: DatePickerYearSelectProps = $props();

	const api = useDatePickerContext();
	const attrs = $derived(api.getYearSelectProps());
	const years = $derived(api.getYears());
</script>

<span class={styles.selectControl} data-slot="date-picker-year-select-control">
	<Element
		as="select"
		{...props}
		{...attrs}
		bind:ref
		{asChild}
		data-scope="date-picker"
		data-part="year-select"
		data-slot="date-picker-year-select"
		class={cn(styles.select, className)}
	>
		{#if children}
			{@render children()}
		{:else}
			{#each years as year (year.value)}
				<option value={year.value} disabled={year.disabled}>{year.label}</option>
			{/each}
		{/if}
	</Element>
	<span aria-hidden="true" class={styles.selectIndicator} data-slot="date-picker-year-select-indicator">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
			<path d="m6 9 6 6 6-6" />
		</svg>
	</span>
</span>
