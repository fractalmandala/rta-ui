<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarGroupLabelProps
		extends HTMLProps<'h3'>,
			PolymorphicProps<'h3'>,
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
	}: SidebarGroupLabelProps = $props();
</script>

<Element
	as="h3"
	{...props}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="group-label"
	data-slot="sidebar-group-label"
	class={cn(styles.groupLabel, className)}
>
	{@render children?.()}
</Element>
