<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface RatingGroupItemIndicatorProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { StarIcon } from '../../internal/icons/index.js';
	import styles from './RatingGroup.module.css';
	import { useRatingGroupContext, useRatingGroupItemContext } from './rating-group.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }:
		RatingGroupItemIndicatorProps = $props();

	const api = useRatingGroupContext();
	const item = useRatingGroupItemContext();
	const attrs = $derived(
		api.itemIndicatorAttrs(item().index)
	);
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="rating-group"
	data-part="item-indicator"
	data-slot="rating-group-item-indicator"
	class={cn(styles.itemIndicator, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<StarIcon class={styles.iconBg} data-slot="rating-group-item-indicator-bg" />
		<StarIcon class={styles.iconFg} data-slot="rating-group-item-indicator-fg" />
	{/if}
</Element>
