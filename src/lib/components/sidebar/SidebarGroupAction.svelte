<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarGroupActionProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
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
		type = 'button',
		...props
	}: SidebarGroupActionProps = $props();
</script>

<Element
	as="button"
	{...props}
	{type}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="group-action"
	data-slot="sidebar-group-action"
	class={cn(styles.groupAction, className)}
>
	{@render children?.()}
</Element>
