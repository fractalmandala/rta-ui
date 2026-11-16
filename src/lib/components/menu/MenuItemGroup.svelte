<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MenuItemGroupProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		id?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Menu.module.css';
	import { setMenuItemGroupContext, useMenuContext, type MenuItemGroupApi } from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		id = undefined,
		ref = $bindable(null),
		...props
	}: MenuItemGroupProps = $props();

	const api = useMenuContext();
	const groupId = $props.id();
	const group: MenuItemGroupApi = {
		get id() {
			return id ?? groupId;
		}
	};
	setMenuItemGroupContext(group);

	const attrs = $derived(api.itemGroupAttrs({ id: id ?? groupId }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-slot="menu-item-group"
	class={cn(styles.itemGroup, className)}
>
	{@render children?.()}
</Element>
