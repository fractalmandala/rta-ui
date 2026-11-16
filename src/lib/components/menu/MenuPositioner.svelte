<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MenuPositionerProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { floatingStyle, getPlacement } from '../../internal/positioning.svelte';
	import styles from './Menu.module.css';
	import { resolvePortalTarget, useMenuPortal } from './menu.portal.svelte';
	import { useMenuContext } from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: MenuPositionerProps = $props();

	const api = useMenuContext();
	const portal = useMenuPortal();
	const options = $derived(api.positioningOptions());
	const attrs = $derived(api.positionerAttrs());
	const portalTarget = $derived(portal.portalRef());

	const floating = $derived(
		floatingStyle({
			strategy: options.strategy,
			sameWidth: options.sameWidth,
			fitViewport: options.fitViewport,
			applyStyles: options.applyStyles,
			placement: options.placement ?? 'bottom-start'
		})
	);

	$effect(() => {
		api.registerPositioner(ref as HTMLElement | null);
		if (!ref || !api.open) return;
		const anchor = api.anchor();
		if (!anchor) return;
		return getPlacement(anchor, ref as HTMLElement, {
			...options,
			listeners: options.listeners ?? true,
			arrowElement: ref.querySelector('[data-part="arrow"]'),
			onComplete: (result) => {
				options.onComplete?.(result);
				api.setPlacement(result.placement);
			}
		});
	});
</script>

{#if api.present}
	<Portal to={resolvePortalTarget(portalTarget)} disabled={portal.portalled() === false}>
		<Element
			as="div"
			{...props}
			{...attrs}
			style={mergeStyleDeclarations(floating, style)}
			bind:ref
			{asChild}
			data-slot="menu-positioner"
			class={cn(styles.positioner, className)}
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
