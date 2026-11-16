<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MenuArrowProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { arrowStyle } from '../../internal/positioning.svelte';
	import MenuArrowTip from './MenuArrowTip.svelte';
	import { useMenuContext } from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: MenuArrowProps = $props();

	const api = useMenuContext();
	const attrs = $derived({ ...api.arrowAttrs(), style: arrowStyle });
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, style)}
	bind:ref
	{asChild}
	data-slot="menu-arrow"
	class={className}
>
	{#if children}
		{@render children()}
	{:else}
		<MenuArrowTip />
	{/if}
</Element>
