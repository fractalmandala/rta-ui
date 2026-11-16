<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DrawerGrabberProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Drawer.module.css';
	import { useDrawerContext } from './drawer.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: DrawerGrabberProps =
		$props();

	const api = useDrawerContext();
	const attrs = $derived(api.grabberAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="drawer"
	data-part="grabber"
	data-slot="drawer-grabber"
	class={cn(styles.grabber, className)}
>
	{@render children?.()}
</Element>
