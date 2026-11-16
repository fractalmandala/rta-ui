<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DrawerIndentProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Drawer.module.css';
	import { useDrawerStackContext } from './drawer.stack.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: DrawerIndentProps =
		$props();

	const stack = useDrawerStackContext();
	const attrs = $derived(stack.getIndentProps());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-slot="drawer-indent"
	class={cn(styles.indent, className)}
>
	{@render children?.()}
</Element>
