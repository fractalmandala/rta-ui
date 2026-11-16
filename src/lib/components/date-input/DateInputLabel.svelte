<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DateInputLabelBaseProps
		extends PolymorphicProps<'label'>,
			RefAttribute {
		index?: number;
	}

	export interface DateInputLabelProps extends DateInputLabelBaseProps, HTMLProps<'label'> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DateInput.module.css';
	import { useDateInputContext, useDateInputGroupContext } from './date-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		index,
		ref = $bindable(null),
		...props
	}: DateInputLabelProps = $props();

	const api = useDateInputContext();
	const group = useDateInputGroupContext();
	const attrs = $derived(api.getLabelProps({ index: index ?? group() }));
</script>

<Element
	as="label"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-input"
	data-part="label"
	data-slot="date-input-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
