<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerInputProps
		extends Omit<HTMLProps<'input'>, 'value'>,
			PolymorphicProps<'input'>,
			RefAttribute {
		index?: number;
		fixOnBlur?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DatePicker.module.css';
	import { useDatePickerContext } from './date-picker.state.svelte';

	let {
		asChild,
		class: className,
		fixOnBlur = true,
		index = 0,
		ref = $bindable(null),
		...props
	}: DatePickerInputProps = $props();

	const api = useDatePickerContext();
	const attrs = $derived(api.getInputProps({ index, fixOnBlur }));
</script>

<Element
	as="input"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="input"
	data-slot="date-picker-input"
	class={cn(styles.input, className)}
/>
