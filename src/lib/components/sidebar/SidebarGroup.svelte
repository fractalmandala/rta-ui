<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarGroupProps
		extends HTMLProps<'section'>,
			PolymorphicProps<'section'>,
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
	}: SidebarGroupProps = $props();
</script>

<Element
	as="section"
	{...props}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="group"
	data-slot="sidebar-group"
	class={cn(styles.group, className)}
>
	{@render children?.()}
</Element>
