<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerTriggerProps
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
	}: DatePickerTriggerProps = $props();

	const api = useDatePickerContext();
	const attrs = $derived(api.getTriggerProps());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="trigger"
	data-slot="date-picker-trigger"
	class={cn(styles.trigger, className)}
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
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<rect x="3" y="4" width="18" height="18" rx="2" />
			<path d="M16 2v4M8 2v4M3 10h18" />
		</svg>
	{/if}
</Element>
