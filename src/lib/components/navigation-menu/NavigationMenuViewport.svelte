<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NavigationMenuViewportProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './NavigationMenu.module.css';
	import {
		useNavigationMenuContext,
		useNavigationMenuViewportPropsContext
	} from './navigation-menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: NavigationMenuViewportProps = $props();

	const api = useNavigationMenuContext();
	const viewportProps = useNavigationMenuViewportPropsContext();
	const attrs = $derived(api.viewportAttrs(viewportProps?.() ?? {}));

	$effect(() => {
		api.registerViewport(ref as HTMLElement | null);
		return () => api.registerViewport(null);
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
	data-part="viewport"
	data-slot="navigation-menu-viewport"
	class={cn(styles.viewport, className)}
>
	{@render children?.()}
</Element>
