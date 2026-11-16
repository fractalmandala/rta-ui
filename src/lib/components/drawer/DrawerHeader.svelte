<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DrawerHeaderProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Drawer.module.css';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: DrawerHeaderProps = $props();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-slot="drawer-header"
	class={cn(styles.header, className)}
>
	{@render children?.()}
</Element>
