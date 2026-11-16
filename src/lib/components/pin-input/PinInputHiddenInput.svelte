<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PinInputHiddenInputProps
		extends HTMLProps<'input'>, PolymorphicProps<'input'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useFieldContext } from '../field/field.state.svelte';
	import { usePinInputContext } from './pin-input.state.svelte';

	let {
		asChild,
		'aria-describedby': ariaDescribedby,
		ref = $bindable(null),
		style,
		...props
	}: PinInputHiddenInputProps = $props();

	const api = usePinInputContext();
	const field = useFieldContext();
	const attrs = $derived(api.hiddenInputAttrs());

	$effect(() => {
		api.registerHiddenInput(ref as HTMLInputElement | null);
	});
</script>

<Element
	as="input"
	{...props}
	{...attrs}
	aria-describedby={field?.ariaDescribedby ?? ariaDescribedby}
	style={mergeStyleDeclarations(attrs.style, style)}
	bind:ref
	{asChild}
	data-scope="pin-input"
	data-part="hidden-input"
	data-slot="pin-input-hidden-input"
/>
