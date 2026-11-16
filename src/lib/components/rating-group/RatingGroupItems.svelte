<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface RatingGroupItemsProps {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import RatingGroupItem from './RatingGroupItem.svelte';
	import RatingGroupItemIndicator from './RatingGroupItemIndicator.svelte';
	import { useRatingGroupContext } from './rating-group.state.svelte';

	let { children }: RatingGroupItemsProps = $props();
	const api = useRatingGroupContext();
</script>

{#each api.items as item (item)}
	<RatingGroupItem index={item}>
		{#if children}
			{@render children()}
		{:else}
			<RatingGroupItemIndicator />
		{/if}
	</RatingGroupItem>
{/each}
