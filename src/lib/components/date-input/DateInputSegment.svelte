<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { DateInputSegment as DateInputSegmentValue } from './date-input.utils';

	export interface DateInputSegmentBaseProps
		extends PolymorphicProps<'span'>,
			RefAttribute {
		segment: DateInputSegmentValue;
		position?: number;
	}

	export interface DateInputSegmentProps extends DateInputSegmentBaseProps, HTMLProps<'span'> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './DateInput.module.css';
	import { useDateInputContext, useDateInputGroupContext } from './date-input.state.svelte';

	let {
		asChild,
		class: className,
		position,
		ref = $bindable(null),
		segment,
		style,
		...props
	}: DateInputSegmentProps = $props();

	const api = useDateInputContext();
	const group = useDateInputGroupContext();
	const attrs = $derived(api.getSegmentProps({ segment, index: group(), position }));
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	style={mergeStyleDeclarations(attrs.style as string | undefined, style)}
	data-scope="date-input"
	data-part="segment"
	data-slot="date-input-segment"
	class={cn(styles.segment, className)}
>
	{segment.text}
</Element>
