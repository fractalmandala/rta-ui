<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PaginationEllipsisProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		index: number;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { EllipsisIcon } from '../../internal/icons/index.js';
	import styles from './Pagination.module.css';
	import { usePaginationContext } from './pagination.state.svelte';

	let {
		asChild,
		children,
		class: className,
		index,
		ref = $bindable(null),
		...props
	}: PaginationEllipsisProps = $props();

	const api = usePaginationContext();
	const attrs = $derived(api.ellipsisAttrs(index));
</script>

<Element
	as="span"
	aria-hidden="true"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="pagination"
	data-part="ellipsis"
	data-slot="pagination-ellipsis"
	class={cn(styles.ellipsis, className)}
>
	{#if children}
		{@render children()}
	{:else if !asChild}
		<EllipsisIcon />
	{/if}
</Element>
