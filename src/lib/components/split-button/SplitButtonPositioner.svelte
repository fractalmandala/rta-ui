<script module lang="ts">
	import type { MenuPositionerProps } from '../menu/MenuPositioner.svelte';

	export interface SplitButtonPositionerProps extends MenuPositionerProps {}
</script>

<script lang="ts">
	import MenuPositioner from '../menu/MenuPositioner.svelte';

	let { children, class: className, ref = $bindable(null), ...props }: SplitButtonPositionerProps =
		$props();
</script>

<!-- The menu positioner wraps whatever it renders, so the split-button slot is always supplied
     rather than swapped with the consumer's `asChild`. -->
<MenuPositioner {...props} bind:ref class={className}>
	{#snippet asChild(merge)}
		{@const merged = (merge as unknown as (props: Record<string, unknown>) => Record<string, unknown>)({})}
		<div {...merged} data-slot="split-button-positioner">
			{@render children?.()}
		</div>
	{/snippet}
</MenuPositioner>
