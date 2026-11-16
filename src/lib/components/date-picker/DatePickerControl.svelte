<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerControlProps
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
	}: DatePickerControlProps = $props();

	const api = useDatePickerContext();
	const attrs = $derived(api.getControlProps());

	$effect(() => {
		const element = ref as HTMLElement | null;
		api.setControlNode(element);
		return () => api.setControlNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="control"
	data-slot="date-picker-control"
	class={cn(styles.control, className)}
>
	{@render children?.()}
</Element>
