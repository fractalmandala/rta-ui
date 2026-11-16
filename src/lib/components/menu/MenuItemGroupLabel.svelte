<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MenuItemGroupLabelProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		htmlFor: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Menu.module.css';
	import { useMenuContext, useMenuItemGroupContext } from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		htmlFor = '',
		ref = $bindable(null),
		...props
	}: MenuItemGroupLabelProps = $props();

	const api = useMenuContext();
	const group = useMenuItemGroupContext();
	const attrs = $derived(api.itemGroupLabelAttrs({ htmlFor: htmlFor || group?.id || '' }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-slot="menu-item-group-label"
	class={cn(styles.itemGroupLabel, className)}
>
	{@render children?.()}
</Element>
