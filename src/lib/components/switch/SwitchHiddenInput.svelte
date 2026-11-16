<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SwitchHiddenInputProps
		extends HTMLProps<'input'>, PolymorphicProps<'input'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useSwitchContext } from './switch.state.svelte';

	let { asChild, class: className, ref = $bindable(null), ...props }: SwitchHiddenInputProps = $props();

	const api = useSwitchContext();
</script>

<Element as="input" {...props} bind:ref {asChild} class={className} {...api.hiddenInputProps()} />
