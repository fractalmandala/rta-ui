<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export type DrawerVariant = 'island';
	export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl';

	export interface DrawerContentProps
		extends Omit<HTMLProps<'div'>, 'draggable'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		/** Width preset for `start` and `end` drawers: 18rem, 22rem, 28rem, or 36rem. */
		size?: DrawerSize;
		/** `island` insets the surface from the viewport edges and rounds every corner. */
		variant?: DrawerVariant;
		/** Whether the content itself starts a swipe. `false` leaves dragging to `DrawerGrabber`. */
		draggable?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Drawer.module.css';
	import { useDrawerContext } from './drawer.state.svelte';

	let {
		asChild,
		children,
		class: className,
		draggable = true,
		ref = $bindable(null),
		size = 'md',
		variant,
		...props
	}: DrawerContentProps = $props();

	const api = useDrawerContext();
	const attrs = $derived(api.contentAttrs({ draggable }));

	$effect(() => {
		api.registerContent(ref);
		return () => api.registerContent(null);
	});
</script>

{#if !api.unmounted}
	<Element
		as="div"
		{...props}
		{...attrs}
		style={mergeStyleDeclarations(attrs.style, props.style)}
		bind:ref
		{asChild}
		data-scope="drawer"
		data-part="content"
		data-slot="drawer-content"
		data-size={size}
		data-variant={variant}
		class={cn(styles.content, className)}
	>
		{@render children?.()}
	</Element>
{/if}
