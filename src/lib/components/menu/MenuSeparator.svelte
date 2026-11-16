<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MenuSeparatorProps
		extends HTMLProps<'hr'>, PolymorphicProps<'hr'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Menu.module.css';
	import { useMenuContext } from './menu.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		...props
	}: MenuSeparatorProps = $props();

	const api = useMenuContext();
	const attrs = $derived(api.separatorAttrs());
</script>

<Element
	as="hr"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-slot="menu-separator"
	class={cn(styles.separator, className)}
/>
