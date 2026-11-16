<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarNavigationSubButtonProps
		extends HTMLProps<'a'>,
			PolymorphicProps<'a'>,
			RefAttribute {
		active?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Sidebar.module.css';

	let {
		active = false,
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		'aria-current': ariaCurrent,
		...props
	}: SidebarNavigationSubButtonProps = $props();

	const resolvedCurrent = $derived(ariaCurrent ?? (active ? 'page' : undefined));
</script>

<Element
	as="a"
	{...props}
	bind:ref
	{asChild}
	aria-current={resolvedCurrent}
	data-active={active ? '' : undefined}
	data-scope="sidebar"
	data-part="navigation-sub-button"
	data-slot="sidebar-navigation-sub-button"
	class={cn(styles.menuSubButton, className)}
>
	{@render children?.()}
</Element>
