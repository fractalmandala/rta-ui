<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DateInputSegmentGroupBaseProps
		extends PolymorphicProps<'div'>,
			RefAttribute {
		index?: number;
	}

	export interface DateInputSegmentGroupProps
		extends DateInputSegmentGroupBaseProps,
			HTMLProps<'div'> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DateInput.module.css';
	import {
		setDateInputGroupContext,
		useDateInputContext
	} from './date-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		index = 0,
		ref = $bindable(null),
		...props
	}: DateInputSegmentGroupProps = $props();

	const api = useDateInputContext();
	const attrs = $derived(api.getSegmentGroupProps({ index }));

	setDateInputGroupContext(() => index);
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-input"
	data-part="segment-group"
	data-slot="date-input-segment-group"
	class={cn(styles.segmentGroup, className)}
>
	{@render children?.()}
</Element>
