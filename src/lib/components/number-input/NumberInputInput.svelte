<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NumberInputInputProps
		extends Omit<HTMLProps<'input'>, 'value' | 'defaultValue'>,
			PolymorphicProps<'input'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './NumberInput.module.css';
	import { useNumberInputContext } from './number-input.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		...props
	}: NumberInputInputProps = $props();

	const api = useNumberInputContext();
	const attrs = $derived(api.inputAttrs());
</script>

<Element
	as="input"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="number-input"
	data-part="input"
	data-slot="number-input-input"
	class={cn(styles.input, className)}
/>
