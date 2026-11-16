<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NavigationMenuIndicatorProps
		extends Omit<HTMLProps<'div'>, 'aria-hidden'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './NavigationMenu.module.css';
	import { useNavigationMenuContext } from './navigation-menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: NavigationMenuIndicatorProps = $props();

	const api = useNavigationMenuContext();
	const attrs = $derived(api.indicatorAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, style)}
	bind:ref
	{asChild}
	data-scope="navigation-menu"
	data-part="indicator"
	data-slot="navigation-menu-indicator"
	class={cn(styles.indicator, className)}
>
	{@render children?.()}
</Element>
