<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export type SidebarNavigationButtonSize = 'sm' | 'md' | 'lg';

	export interface SidebarNavigationButtonProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		active?: boolean;
		size?: SidebarNavigationButtonSize;
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
		size = 'md',
		type = 'button',
		'aria-current': ariaCurrent,
		...props
	}: SidebarNavigationButtonProps = $props();

	const resolvedCurrent = $derived(ariaCurrent ?? (active ? 'page' : undefined));
</script>

<Element
	as="button"
	{...props}
	{type}
	bind:ref
	{asChild}
	aria-current={resolvedCurrent}
	data-active={active ? '' : undefined}
	data-size={size}
	data-scope="sidebar"
	data-part="navigation-button"
	data-slot="sidebar-navigation-button"
	class={cn(styles.menuButton, className)}
>
	{@render children?.()}
</Element>
