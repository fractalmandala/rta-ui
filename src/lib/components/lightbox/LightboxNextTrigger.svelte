<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface LightboxNextTriggerProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		/** Keep the trigger enabled at the last image when the gallery loops. */
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
	}: LightboxNextTriggerProps = $props();

	const api = useLightboxContext();
	const attrs = $derived(api.nextTriggerAttrs());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	aria-label={typeof ariaLabel === 'string' ? ariaLabel : api.nextLabel}
	disabled={forceMount ? undefined : !api.hasNext}
	data-scope="lightbox"
	data-part="next-trigger"
	data-slot="lightbox-next-trigger"
	data-index={api.index}
	class={cn(className)}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.next();
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
			<path d="m9 18 6-6-6-6" />
		</svg>
	{/if}
</Element>
