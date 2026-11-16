<script module lang="ts">
	import type { HTMLProps, PolymorphicProps } from '../../internal/types';

	export interface RatingGroupHiddenInputProps
		extends HTMLProps<'input'>, PolymorphicProps<'input'> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useRatingGroupContext } from './rating-group.state.svelte';

	let { asChild, ...props }: RatingGroupHiddenInputProps = $props();

	const api = useRatingGroupContext();
	const attrs = $derived(api.hiddenInputAttrs());
</script>

<Element
	as="input"
	{...props}
	{...attrs}
	{asChild}
	data-scope="rating-group"
	data-part="hidden-input"
	data-slot="rating-group-hidden-input"
/>
