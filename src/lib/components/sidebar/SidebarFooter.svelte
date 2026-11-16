<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarFooterProps
		extends HTMLProps<'footer'>,
			PolymorphicProps<'footer'>,
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
	}: SidebarFooterProps = $props();
</script>

<Element
	as="footer"
	{...props}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="footer"
	data-slot="sidebar-footer"
	class={cn(styles.footer, className)}
>
	{@render children?.()}
</Element>
