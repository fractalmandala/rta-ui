<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface LightboxCounterProps
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
	}: LightboxCounterProps = $props();

	const api = useLightboxContext();
	const attrs = $derived(api.counterAttrs());
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="lightbox"
	data-part="counter"
	data-slot="lightbox-counter"
	data-index={api.index}
	data-count={api.count}
	class={cn(className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.index + 1} / {api.count}
	{/if}
</Element>
