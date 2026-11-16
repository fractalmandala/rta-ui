<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerContentProps
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
	}: DatePickerContentProps = $props();

	const api = useDatePickerContext();
	const attrs = $derived(api.getContentProps());

	$effect(() => {
		const element = ref as HTMLElement | null;
		api.setContentNode(element);
		return () => api.setContentNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="content"
	data-slot="date-picker-content"
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
