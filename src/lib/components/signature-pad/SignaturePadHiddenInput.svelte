<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SignaturePadHiddenInputProps
		extends HTMLProps<'input'>,
			PolymorphicProps<'input'>,
			RefAttribute {
		/** The submitted signature: the drawn paths joined with a space. */
		value: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useSignaturePadContext } from './signature-pad.state.svelte';

	let { asChild, class: className, ref = $bindable(null), value, ...props }: SignaturePadHiddenInputProps = $props();

	const api = useSignaturePadContext();
	const attrs = $derived(api.hiddenInputAttrs({ value }));
</script>

<Element
	as="input"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="signature-pad"
	data-part="hidden-input"
	data-slot="signature-pad-hidden-input"
	class={className}
/>
