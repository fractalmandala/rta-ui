<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface LightboxCaptionProps
		extends HTMLProps<'span'>,
			PolymorphicProps<'span'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { useLightboxContext } from './lightbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: LightboxCaptionProps = $props();

	const api = useLightboxContext();
	const attrs = $derived(api.captionAttrs());
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="lightbox"
	data-part="caption"
	data-slot="lightbox-caption"
	data-index={api.index}
	class={cn(className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.current?.caption}
	{/if}
</Element>
