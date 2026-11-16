<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DrawerBodyProps
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
	}: DrawerBodyProps = $props();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-slot="drawer-body"
	class={cn(styles.body, className)}
>
	{@render children?.()}
</Element>
