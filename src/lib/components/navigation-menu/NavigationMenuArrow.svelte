<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NavigationMenuArrowProps
		extends Omit<HTMLProps<'div'>, 'aria-hidden'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './NavigationMenu.module.css';
	import { useNavigationMenuContext } from './navigation-menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: NavigationMenuArrowProps = $props();

	const api = useNavigationMenuContext();
	const attrs = $derived(api.arrowAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="navigation-menu"
	data-part="arrow"
	data-slot="navigation-menu-arrow"
	class={cn(styles.arrow, className)}
>
	{@render children?.()}
</Element>
