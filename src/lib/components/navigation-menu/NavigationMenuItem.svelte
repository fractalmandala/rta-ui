<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NavigationMenuItemProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		value: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './NavigationMenu.module.css';
	import {
		setNavigationMenuItemPropsContext,
		useNavigationMenuContext
	} from './navigation-menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled,
		ref = $bindable(null),
		value,
		...props
	}: NavigationMenuItemProps = $props();

	const api = useNavigationMenuContext();
	const attrs = $derived(api.itemAttrs({ value, disabled }));
	setNavigationMenuItemPropsContext(() => ({ value, disabled }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="navigation-menu"
	data-part="item"
	data-slot="navigation-menu-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
