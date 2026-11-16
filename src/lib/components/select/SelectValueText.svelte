<script module lang="ts">
	import type { HTMLProps, PolymorphicProps } from '../../internal/types';

	export interface SelectValueTextProps
		extends HTMLProps<'span'>,
			PolymorphicProps<'span'> {
		placeholder?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { useSelectContext } from './select.state.svelte';

	let {
		asChild,
		children,
		class: className,
		placeholder,
		...props
	}: SelectValueTextProps = $props();

	const api = useSelectContext();
	const attrs = $derived(api.valueTextAttrs());
</script>

<Element
	as="span"
	{...props}
	{asChild}
	{...attrs}
	data-scope="select"
	data-part="value-text"
	data-slot="select-value-text"
	class={cn(styles.valueText, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.valueAsString || placeholder}
	{/if}
</Element>
