<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarGroupHeaderProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
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
	}: SidebarGroupHeaderProps = $props();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="group-header"
	data-slot="sidebar-group-header"
	class={cn(styles.groupHeader, className)}
>
	{@render children?.()}
</Element>
