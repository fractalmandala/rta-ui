<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { CollectionItem } from './select.state.svelte';
	import type { SelectItemProps } from './SelectItem.svelte';

	export interface SelectOptionProps<T extends CollectionItem = CollectionItem>
		extends Omit<SelectItemProps<T>, 'asChild'> {
		/** Replaces the default check indicator; `false` renders no indicator. */
		indicator?: Snippet | false;
	}
</script>

<script lang="ts" generics="T extends CollectionItem = CollectionItem">
	import SelectItem from './SelectItem.svelte';
	import SelectItemIndicator from './SelectItemIndicator.svelte';
	import SelectItemText from './SelectItemText.svelte';

	let { children, indicator, ref = $bindable(null), ...props }: SelectOptionProps<T> = $props();
</script>

<SelectItem {...props} bind:ref>
	<SelectItemText>{@render children?.()}</SelectItemText>
	{#if indicator !== false}
		<SelectItemIndicator children={indicator} />
	{/if}
</SelectItem>
