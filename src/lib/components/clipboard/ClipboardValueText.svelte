<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ClipboardValueTextProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Clipboard.module.css';
	import { useClipboardContext } from './clipboard.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ClipboardValueTextProps = $props();

	const api = useClipboardContext();
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	data-scope="clipboard"
	data-part="value-text"
	data-slot="clipboard-value-text"
	class={cn(styles.valueText, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.value}
	{/if}
</Element>
