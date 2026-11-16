<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarTriggerProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Sidebar.module.css';
	import { useSidebarContext } from './sidebar.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onclick,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		...props
	}: SidebarTriggerProps = $props();

	const api = useSidebarContext();
	const attrs = $derived(api.triggerAttrs());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	aria-label={typeof ariaLabel === 'string' ? ariaLabel : api.toggleLabel}
	data-side={api.side}
	data-state={api.state}
	data-scope="sidebar"
	data-part="trigger"
	data-slot="sidebar-trigger"
	class={cn(styles.trigger, className)}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.toggle();
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
