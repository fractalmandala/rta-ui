<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SegmentGroupLabelProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './SegmentGroup.module.css';
	import { useSegmentGroupContext } from './segment-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: SegmentGroupLabelProps = $props();

	const api = useSegmentGroupContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="segment-group"
	data-part="label"
	data-slot="segment-group-label"
	onclick={() => api.focus()}
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
