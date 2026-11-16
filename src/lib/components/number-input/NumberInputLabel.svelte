<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NumberInputLabelProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './NumberInput.module.css';
	import { useNumberInputContext } from './number-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: NumberInputLabelProps = $props();

	const api = useNumberInputContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="label"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="number-input"
	data-part="label"
	data-slot="number-input-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
