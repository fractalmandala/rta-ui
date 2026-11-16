<script module lang="ts">
	import type { HTMLProps, PolymorphicProps } from '../../internal/types';

	export interface ListboxValueTextProps
		extends HTMLProps<'span'>,
			PolymorphicProps<'span'> {
		placeholder?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Listbox.module.css';
	import { useListboxContext } from './listbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		placeholder,
		...props
	}: ListboxValueTextProps = $props();

	const api = useListboxContext();
	const attrs = $derived(api.valueTextAttrs());
</script>

<Element
	as="span"
	{...props}
	{asChild}
	{...attrs}
	data-scope="listbox"
	data-part="value-text"
	data-slot="listbox-value-text"
	class={cn(styles.valueText, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.valueAsString || placeholder}
	{/if}
</Element>
