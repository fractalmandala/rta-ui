<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MenuIndicatorProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Menu.module.css';
	import { useMenuContext } from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: MenuIndicatorProps = $props();

	const api = useMenuContext();
	const attrs = $derived(api.indicatorAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-slot="menu-indicator"
	class={cn(styles.indicator, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			focusable="false"
		><path d="m6 9 6 6 6-6" /></svg>
	{/if}
</Element>
