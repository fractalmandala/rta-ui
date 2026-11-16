<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface LightboxPrevTriggerProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		/** Keep the trigger enabled at the first image when the gallery loops. */
		forceMount?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { useLightboxContext } from './lightbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		forceMount = false,
		onclick,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		...props
	}: LightboxPrevTriggerProps = $props();

	const api = useLightboxContext();
	const attrs = $derived(api.prevTriggerAttrs());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	aria-label={typeof ariaLabel === 'string' ? ariaLabel : api.prevLabel}
	disabled={forceMount ? undefined : !api.hasPrev}
	data-scope="lightbox"
	data-part="prev-trigger"
	data-slot="lightbox-prev-trigger"
	data-index={api.index}
	class={cn(className)}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.prev();
	}}
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
			<path d="m15 18-6-6 6-6" />
		</svg>
	{/if}
</Element>
