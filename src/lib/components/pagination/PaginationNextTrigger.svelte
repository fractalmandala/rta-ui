<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PaginationNextTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { ChevronRightIcon } from '../../internal/icons/index.js';
	import styles from './Pagination.module.css';
	import { usePaginationContext } from './pagination.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: PaginationNextTriggerProps = $props();

	const api = usePaginationContext();
	const attrs = $derived(api.nextTriggerAttrs());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="pagination"
	data-part="next-trigger"
	data-slot="pagination-next-trigger"
	class={cn(styles.trigger, !children && !asChild && styles.iconTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else if !asChild}
		<ChevronRightIcon />
	{/if}
</Element>
