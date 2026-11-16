<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerClearTriggerProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
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
	}: DatePickerClearTriggerProps = $props();

	const api = useDatePickerContext();
	const attrs = $derived(api.getClearTriggerProps());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="clear-trigger"
	data-slot="date-picker-clear-trigger"
	class={cn(styles.clearTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else if !asChild}
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<path d="M18 6 6 18M6 6l12 12" />
		</svg>
	{/if}
</Element>
