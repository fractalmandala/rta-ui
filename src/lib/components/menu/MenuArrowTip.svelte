<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MenuArrowTipProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { arrowTipStyle } from '../../internal/positioning.svelte';
	import styles from './Menu.module.css';
	import { useMenuContext } from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: MenuArrowTipProps = $props();

	const api = useMenuContext();
	const attrs = $derived({ ...api.arrowTipAttrs(), style: arrowTipStyle(api.placement) });
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, style)}
	bind:ref
	{asChild}
	data-slot="menu-arrow-tip"
	class={cn(styles.arrowTip, className)}
/>
