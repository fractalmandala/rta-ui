<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface RatingGroupLabelProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './RatingGroup.module.css';
	import { useRatingGroupContext } from './rating-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: RatingGroupLabelProps = $props();

	const api = useRatingGroupContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="label"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="rating-group"
	data-part="label"
	data-slot="rating-group-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
