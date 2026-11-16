<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SelectHiddenSelectProps
		extends HTMLProps<'select'>,
			PolymorphicProps<'select'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useSelectContext } from './select.state.svelte';

	let { asChild, ref = $bindable(null), ...props }: SelectHiddenSelectProps = $props();

	const api = useSelectContext();
	const attrs = $derived(api.hiddenSelectAttrs());
	const value = $derived(api.value);

	$effect(() => {
		api.registerHiddenSelect(ref as HTMLSelectElement | null);
	});
</script>

<Element as="select" {...props} bind:ref {asChild} {...attrs} data-scope="select" data-part="hidden-select">
	{#if value.length === 0 && !api.multiple}
		<option value=""></option>
	{/if}
	{#each api.collection.items as item (api.collection.getItemValue(item))}
		<option
			value={api.collection.getItemValue(item)}
			disabled={api.collection.getItemDisabled(item)}
			selected={value.includes(api.collection.getItemValue(item))}
		>
			{api.collection.stringifyItem(item)}
		</option>
	{/each}
</Element>
