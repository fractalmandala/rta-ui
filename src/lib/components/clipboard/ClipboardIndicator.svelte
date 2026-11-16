<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ClipboardIndicatorProps
		extends Omit<HTMLProps<'div'>, 'children'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		children?: Snippet;
		copied?: Snippet;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { CheckIcon, CopyIcon } from '../../internal/icons/index.js';
	import styles from './Clipboard.module.css';
	import { useClipboardContext } from './clipboard.state.svelte';

	let {
		asChild,
		children,
		class: className,
		copied,
		ref = $bindable(null),
		...props
	}: ClipboardIndicatorProps = $props();

	const api = useClipboardContext();
	const attrs = $derived(api.indicatorAttrs(api.copied));
</script>

{#snippet copiedIcon()}
	<CheckIcon />
{/snippet}

{#snippet copyIcon()}
	<CopyIcon />
{/snippet}

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="clipboard"
	data-part="indicator"
	data-slot="clipboard-indicator"
	class={cn(styles.indicator, className)}
>
	{#if api.copied && copied}
		{@render copied()}
	{:else if children}
		{@render children()}
	{:else if api.copied}
		{@render copiedIcon()}
	{:else}
		{@render copyIcon()}
	{/if}
</Element>
