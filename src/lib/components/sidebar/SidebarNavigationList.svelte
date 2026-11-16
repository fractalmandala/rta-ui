<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarNavigationListProps
		extends HTMLProps<'ul'>,
			PolymorphicProps<'ul'>,
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
	}: SidebarNavigationListProps = $props();
</script>

<Element
	as="ul"
	{...props}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="navigation-list"
	data-slot="sidebar-navigation-list"
	class={cn(styles.menu, className)}
>
	{@render children?.()}
</Element>
