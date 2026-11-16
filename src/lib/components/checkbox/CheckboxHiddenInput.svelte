<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CheckboxHiddenInputProps
		extends HTMLProps<'input'>, PolymorphicProps<'input'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useCheckboxContext } from './checkbox.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		...props
	}: CheckboxHiddenInputProps = $props();

	const api = useCheckboxContext();
</script>

<Element as="input" {...props} bind:ref {asChild} class={className} {...api.hiddenInputProps()} />
