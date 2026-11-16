<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DialogBackdropProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Dialog.module.css';
	import { useDialogContext } from './dialog.state.svelte';
	import { useDialogOverlayContext } from './dialog.overlay.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: DialogBackdropProps = $props();

	const api = useDialogContext();
	const overlay = useDialogOverlayContext();
	const attrs = $derived(api.backdropAttrs());
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
			data-scope="dialog"
			data-part="backdrop"
			data-slot="dialog-backdrop"
			class={cn(styles.backdrop, className)}
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
