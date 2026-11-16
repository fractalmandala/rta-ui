<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PaginationLastTriggerProps
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
	}: PaginationLastTriggerProps = $props();

	const api = usePaginationContext();
	const attrs = $derived(api.lastTriggerAttrs());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="pagination"
	data-part="last-trigger"
	data-slot="pagination-last-trigger"
	class={cn(styles.trigger, !children && !asChild && styles.iconTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else if !asChild}
		<span class={styles.edgeIcon} aria-hidden="true">
			<ChevronRightIcon />
			<ChevronRightIcon />
		</span>
	{/if}
</Element>
