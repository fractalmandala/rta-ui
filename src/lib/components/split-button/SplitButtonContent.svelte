<script module lang="ts">
	import type { MenuContentProps } from '../menu/MenuContent.svelte';

	export interface SplitButtonContentProps extends MenuContentProps {}
</script>

<script lang="ts">
	import MenuContent from '../menu/MenuContent.svelte';
	import MenuViewport from '../menu/MenuViewport.svelte';

	let { children, class: className, ref = $bindable(null), ...props }: SplitButtonContentProps =
		$props();
</script>

<MenuContent {...props} bind:ref class={className}>
	{#snippet asChild(merge)}
		{@const merged = (merge as unknown as (props: Record<string, unknown>) => Record<string, unknown>)({})}
		<div {...merged} data-slot="split-button-content">
			<MenuViewport>{@render children?.()}</MenuViewport>
		</div>
	{/snippet}
</MenuContent>
