<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NavigationMenuLinkProps
		extends HTMLProps<'a'>,
			PolymorphicProps<'a'>,
			RefAttribute {
		value?: string;
		current?: boolean;
		closeOnClick?: boolean;
		onSelect?: (event: CustomEvent) => void;
	}
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
		closeOnClick = undefined,
		current = undefined,
		onSelect = undefined,
		ref = $bindable(null),
		value = undefined,
		...props
	}: NavigationMenuLinkProps = $props();

	const api = useNavigationMenuContext();
	const item = useNavigationMenuItemPropsContext();
	const attrs = $derived(
		api.linkAttrs({
			value: value ?? item?.().value ?? '',
			current,
			closeOnClick,
			onSelect
		})
	);
</script>

<Element
	as="a"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="navigation-menu"
	data-part="link"
	data-slot="navigation-menu-link"
	class={cn(styles.link, className)}
>
	{@render children?.()}
</Element>
