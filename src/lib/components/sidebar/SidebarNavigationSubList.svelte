<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarNavigationSubListProps
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
	}: SidebarNavigationSubListProps = $props();
</script>

<Element
	as="ul"
	{...props}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="navigation-sub-list"
	data-slot="sidebar-navigation-sub-list"
	class={cn(styles.menuSub, className)}
>
	{@render children?.()}
</Element>
