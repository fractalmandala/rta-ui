<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteBackdropProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './CommandPalette.module.css';
	import { useCommandPaletteContext } from './command-palette.state.svelte';
	import { useCommandPaletteOverlayContext } from './command-palette.overlay.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CommandPaletteBackdropProps = $props();

	const api = useCommandPaletteContext();
	const overlay = useCommandPaletteOverlayContext();
	const attrs = $derived(api.backdropAttrs());
	const portalled = $derived(overlay.portalled());
	const target = $derived.by(() => {
		const value = overlay.portalRef();
		return (typeof value === 'function' ? value() : value) ?? null;
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
			data-scope="command-palette"
			data-part="backdrop"
			data-slot="command-palette-backdrop"
			class={cn(styles.backdrop, className)}
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
