<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarRailProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { useSidebarContext } from './sidebar.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onclick,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		...props
	}: SidebarRailProps = $props();

	const api = useSidebarContext();
	const attrs = $derived(api.railAttrs());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	aria-label={typeof ariaLabel === 'string' ? ariaLabel : api.railLabel}
	data-scope="sidebar"
	data-part="rail"
	data-slot="sidebar-rail"
	class={cn(className)}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.toggle();
	}}
>
	{@render children?.()}
</Element>
