<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export type LightboxZoomMode = 'toggle' | 'in' | 'out' | 'reset';

	export interface LightboxZoomTriggerProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		mode?: LightboxZoomMode;
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
		mode = 'toggle',
		onclick,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		...props
	}: LightboxZoomTriggerProps = $props();

	const api = useLightboxContext();
	const attrs = $derived(api.zoomTriggerAttrs());

	function zoom() {
		if (mode === 'in') api.zoomIn();
		else if (mode === 'out') api.zoomOut();
		else if (mode === 'reset') api.resetZoom();
		else api.toggleZoom();
	}
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	aria-label={typeof ariaLabel === 'string' ? ariaLabel : api.zoomLabel}
	data-scope="lightbox"
	data-part="zoom-trigger"
	data-slot="lightbox-zoom-trigger"
	data-mode={mode}
	data-zoom={api.zoom}
	class={cn(className)}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		zoom();
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
			<circle cx="11" cy="11" r="7" />
			<path d="m20 20-3.5-3.5" />
			{#if api.zoomed}
				<path d="M8 11h6" />
			{:else}
				<path d="M11 8v6M8 11h6" />
			{/if}
		</svg>
	{/if}
</Element>
