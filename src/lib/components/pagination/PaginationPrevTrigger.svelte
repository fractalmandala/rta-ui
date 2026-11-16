<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PaginationPrevTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { ChevronLeftIcon } from '../../internal/icons/index.js';
	import styles from './Pagination.module.css';
	import { usePaginationContext } from './pagination.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: PaginationPrevTriggerProps = $props();

	const api = usePaginationContext();
	const attrs = $derived(api.prevTriggerAttrs());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="pagination"
	data-part="prev-trigger"
	data-slot="pagination-prev-trigger"
	class={cn(styles.trigger, !children && !asChild && styles.iconTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else if !asChild}
		<ChevronLeftIcon />
	{/if}
</Element>
