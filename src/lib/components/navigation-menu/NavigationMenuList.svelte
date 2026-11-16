<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NavigationMenuListProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './NavigationMenu.module.css';
	import { useNavigationMenuContext } from './navigation-menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: NavigationMenuListProps = $props();

	const api = useNavigationMenuContext();
	const attrs = $derived(api.listAttrs());

	$effect(() => {
		const element = ref as HTMLElement | null;
		api.registerList(element);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, style)}
	bind:ref
	{asChild}
	data-scope="navigation-menu"
	data-part="list"
	data-slot="navigation-menu-list"
	class={cn(styles.list, className)}
>
	{@render children?.()}
</Element>
