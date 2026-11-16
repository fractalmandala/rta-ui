<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DrawerPositionerProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Drawer.module.css';
	import { useDrawerContext } from './drawer.state.svelte';
	import { useDrawerOverlayContext } from './drawer.overlay.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: DrawerPositionerProps = $props();

	const api = useDrawerContext();
	const overlay = useDrawerOverlayContext();
	const attrs = $derived(api.positionerAttrs());
	const portalled = $derived(overlay.portalled());
	const target = $derived.by(() => {
		const ref = overlay.portalRef();
		return (typeof ref === 'function' ? ref() : ref) ?? null;
	});
</script>

{#if !api.unmounted}
	<Portal to={target} disabled={!portalled}>
		<Element
			as="div"
			{...props}
			{...attrs}
			style={mergeStyleDeclarations(attrs.style, props.style)}
			bind:ref
			{asChild}
			data-scope="drawer"
			data-part="positioner"
			data-slot="drawer-positioner"
			class={cn(styles.positioner, className)}
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
