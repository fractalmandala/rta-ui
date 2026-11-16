<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseNavigationMenuProps } from './navigation-menu.state.svelte';

	export interface NavigationMenuRootProps
		extends UseNavigationMenuProps,
			HTMLProps<'nav'>,
			PolymorphicProps<'nav'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './NavigationMenu.module.css';
	import { createNavigationMenu, setNavigationMenuContext } from './navigation-menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onValueChange,
		ref = $bindable(null),
		style,
		value = $bindable(),
		...props
	}: NavigationMenuRootProps = $props();

	const uid = $props.id();
	const api = createNavigationMenu(
		() => ({
			...props,
			value,
			onValueChange(details) {
				onValueChange?.(details);
				if (value !== undefined) value = details.value;
			}
		}),
		uid
	);
	setNavigationMenuContext(api);

	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="nav"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, style)}
	bind:ref
	{asChild}
	data-scope="navigation-menu"
	data-part="root"
	data-slot="navigation-menu-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
