<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UsePaginationProps } from './pagination.state.svelte';

	export interface PaginationRootProps
		extends UsePaginationProps, HTMLProps<'nav'>, PolymorphicProps<'nav'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Pagination.module.css';
	import { createPagination, setPaginationContext } from './pagination.state.svelte';

	let {
		asChild,
		boundaryCount,
		children,
		class: className,
		count,
		defaultPage,
		defaultPageSize,
		dir,
		getPageUrl,
		id,
		onPageChange,
		onPageSizeChange,
		page = $bindable(),
		pageSize = $bindable(),
		ref = $bindable(null),
		siblingCount,
		translations,
		type,
		...props
	}: PaginationRootProps = $props();

	const uid = $props.id();
	const api = createPagination(
		() => ({
			boundaryCount,
			count,
			defaultPage,
			defaultPageSize,
			dir,
			getPageUrl,
			id,
			onPageChange(details) {
				onPageChange?.(details);
				page = details.page;
			},
			onPageSizeChange(details) {
				onPageSizeChange?.(details);
				pageSize = details.pageSize;
			},
			page,
			pageSize,
			siblingCount,
			translations,
			type
		}),
		uid
	);
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
	data-slot="pagination-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
