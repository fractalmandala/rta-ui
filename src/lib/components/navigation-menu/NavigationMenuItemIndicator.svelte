<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NavigationMenuItemIndicatorProps
		extends Omit<HTMLProps<'div'>, 'aria-hidden'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './NavigationMenu.module.css';
	import {
		useNavigationMenuContext,
		useNavigationMenuItemPropsContext
	} from './navigation-menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: NavigationMenuItemIndicatorProps = $props();

	const api = useNavigationMenuContext();
	const item = useNavigationMenuItemPropsContext();
	const attrs = $derived(api.itemIndicatorAttrs({ value: item?.().value ?? '' }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="navigation-menu"
	data-part="item-indicator"
	data-slot="navigation-menu-item-indicator"
	class={cn(styles.itemIndicator, className)}
>
	{@render children?.()}
</Element>
