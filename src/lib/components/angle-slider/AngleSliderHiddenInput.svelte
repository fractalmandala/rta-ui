<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AngleSliderHiddenInputProps
		extends HTMLProps<'input'>, PolymorphicProps<'input'>, RefAttribute {
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useAngleSliderContext } from './angle-slider.state.svelte';

	let { asChild, ref = $bindable(null), ...props }: AngleSliderHiddenInputProps = $props();

	const api = useAngleSliderContext();
	const attrs = $derived(api.hiddenInputAttrs());
</script>

<Element
	as="input"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="angle-slider"
	data-part="hidden-input"
	data-slot="angle-slider-hidden-input"
/>
