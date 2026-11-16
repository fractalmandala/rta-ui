<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { PaginationApi } from './pagination.state.svelte';

	export interface PaginationRootProviderProps
		extends HTMLProps<'nav'>, PolymorphicProps<'nav'>, RefAttribute {
		value: PaginationApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Pagination.module.css';
	import { setPaginationContext } from './pagination.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: PaginationRootProviderProps = $props();

	const api = untrack(() => value);
	setPaginationContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="nav"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="pagination"
	data-part="root"
	data-slot="pagination-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
