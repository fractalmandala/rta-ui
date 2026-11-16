<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarNavigationBadgeProps
		extends HTMLProps<'span'>,
			PolymorphicProps<'span'>,
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
	}: SidebarNavigationBadgeProps = $props();
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="navigation-badge"
	data-slot="sidebar-navigation-badge"
	class={cn(styles.menuBadge, className)}
>
	{@render children?.()}
</Element>
