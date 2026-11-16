<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarNavigationSubItemProps
		extends HTMLProps<'li'>,
			PolymorphicProps<'li'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Sidebar.module.css';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: SidebarNavigationSubItemProps = $props();
</script>

<Element
	as="li"
	{...props}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="navigation-sub-item"
	data-slot="sidebar-navigation-sub-item"
	class={cn(styles.menuSubItem, className)}
>
	{@render children?.()}
</Element>
