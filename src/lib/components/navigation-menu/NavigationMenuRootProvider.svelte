<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { NavigationMenuApi } from './navigation-menu.state.svelte';

	export interface NavigationMenuRootProviderProps
		extends HTMLProps<'nav'>,
			PolymorphicProps<'nav'>,
			RefAttribute {
		value: NavigationMenuApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './NavigationMenu.module.css';
	import { setNavigationMenuContext } from './navigation-menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		value,
		...props
	}: NavigationMenuRootProviderProps = $props();

	const api = untrack(() => value);
	setNavigationMenuContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="nav"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, style)}
	bind:ref
	{asChild}
	data-scope="navigation-menu"
	data-part="root"
	data-slot="navigation-menu-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
