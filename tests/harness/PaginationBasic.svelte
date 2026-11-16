<script lang="ts">
	import {
		Pagination,
		PaginationFirstTrigger,
		PaginationItems,
		PaginationLastTrigger,
		PaginationNextTrigger,
		PaginationPrevTrigger
	} from '../../src/lib/index';

	let {
		count = undefined,
		onPageChange = undefined,
		page = $bindable(undefined),
		pageSize = undefined
	}: {
		count?: number;
		onPageChange?: (details: { page: number; pageSize: number }) => void;
		page?: number;
		pageSize?: number;
	} = $props();
</script>

<Pagination {count} {onPageChange} {pageSize} bind:page>
	<PaginationFirstTrigger />
	<PaginationPrevTrigger />
	<PaginationItems />
	<PaginationNextTrigger />
	<PaginationLastTrigger />
</Pagination>
