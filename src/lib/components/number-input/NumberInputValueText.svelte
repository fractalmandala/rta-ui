<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NumberInputValueTextProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
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
	}: NumberInputValueTextProps = $props();

	const api = useNumberInputContext();
	const attrs = $derived(api.valueTextAttrs());
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="number-input"
	data-part="value-text"
	data-slot="number-input-value-text"
	class={cn(styles.valueText, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.value}
	{/if}
</Element>
