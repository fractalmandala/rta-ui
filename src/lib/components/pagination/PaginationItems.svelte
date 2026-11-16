<script lang="ts">
	import PaginationEllipsis from './PaginationEllipsis.svelte';
	import PaginationItem from './PaginationItem.svelte';
	import { usePaginationContext } from './pagination.state.svelte';

	const api = usePaginationContext();
</script>

{#each api.pages as page, index (page.type === 'page' ? page.value : `ellipsis-${index}`)}
	{#if page.type === 'page'}
		<PaginationItem type={page.type} value={page.value}>{page.value}</PaginationItem>
	{:else}
		<PaginationEllipsis {index} />
	{/if}
{/each}
