<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TagsInputHiddenInputProps
		extends Omit<HTMLProps<'input'>, 'value'>, PolymorphicProps<'input'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useTagsInputContext } from './tags-input.state.svelte';

	let {
		asChild,
		ref = $bindable(null),
		...props
	}: TagsInputHiddenInputProps = $props();

	const api = useTagsInputContext();
	const attrs = $derived(api.hiddenInputAttrs());

	$effect(() => {
		api.registerHiddenInput(ref as HTMLInputElement | null);
	});
</script>

<Element as="input" {...props} bind:ref {asChild} {...attrs} />
