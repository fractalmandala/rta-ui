<script module lang="ts">
	import type { HTMLProps, PolymorphicProps } from '../../internal/types';

	export interface SliderHiddenInputProps
		extends HTMLProps<'input'>, PolymorphicProps<'input'> {
		/** Index of the thumb whose value this input carries. */
		index?: number;
		/** Overrides the input name derived from the root `name` prop. */
		name?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useSliderContext, useSliderThumbContext } from './slider.state.svelte';

	let { asChild, index, name, ...props }: SliderHiddenInputProps = $props();

	const api = useSliderContext();
	const thumb = useSliderThumbContext();
	const thumbIndex = $derived(index ?? thumb?.index ?? 0);
	const attrs = $derived(api.hiddenInputAttrs(thumbIndex, { name }));
</script>

<Element
	as="input"
	{...props}
	{...attrs}
	{asChild}
	data-scope="slider"
	data-part="hidden-input"
	data-slot="slider-hidden-input"
/>
