<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { NavigationMenuAlign } from './navigation-menu.state.svelte';

	export interface NavigationMenuViewportPositionerProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		align?: NavigationMenuAlign;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './NavigationMenu.module.css';
	import {
		setNavigationMenuViewportPropsContext,
		useNavigationMenuContext
	} from './navigation-menu.state.svelte';

	let {
		align = undefined,
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: NavigationMenuViewportPositionerProps = $props();

	const api = useNavigationMenuContext();
	const attrs = $derived(api.viewportPositionerAttrs({ align }));
	setNavigationMenuViewportPropsContext(() => ({ align }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="navigation-menu"
	data-part="viewport-positioner"
	data-slot="navigation-menu-viewport-positioner"
	class={cn(styles.viewportPositioner, className)}
>
	{@render children?.()}
</Element>
