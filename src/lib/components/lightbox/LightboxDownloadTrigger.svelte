<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface LightboxDownloadTriggerProps
		extends HTMLProps<'a'>,
			PolymorphicProps<'a'>,
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
		'aria-label': ariaLabel,
		...props
	}: LightboxDownloadTriggerProps = $props();

	const api = useLightboxContext();
	const attrs = $derived(api.downloadTriggerAttrs());
</script>

<Element
	as="a"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	aria-label={typeof ariaLabel === 'string' ? ariaLabel : api.downloadLabel}
	data-scope="lightbox"
	data-part="download-trigger"
	data-slot="lightbox-download-trigger"
	data-index={api.index}
	class={cn(className)}
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M12 3v12" />
			<path d="m7 10 5 5 5-5" />
			<path d="M5 21h14" />
		</svg>
	{/if}
</Element>
