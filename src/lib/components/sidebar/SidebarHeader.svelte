<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarHeaderProps
		extends HTMLProps<'header'>,
			PolymorphicProps<'header'>,
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
	}: SidebarHeaderProps = $props();
</script>

<Element
	as="header"
	{...props}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="header"
	data-slot="sidebar-header"
	class={cn(styles.header, className)}
>
	{@render children?.()}
</Element>
