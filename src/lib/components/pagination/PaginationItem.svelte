<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PaginationItemProps
		extends Omit<HTMLProps<'button'>, 'type'>, PolymorphicProps<'button'>, RefAttribute {
		value: number;
		type?: 'page';
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Pagination.module.css';
	import { usePaginationContext } from './pagination.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		type: _type,
		value,
		...props
	}: PaginationItemProps = $props();

	const api = usePaginationContext();
	const attrs = $derived(api.itemAttrs(value));
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="pagination"
	data-part="item"
	data-slot="pagination-item"
	class={cn(styles.item, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{value}
	{/if}
</Element>
