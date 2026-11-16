<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
	export type DialogPlacement = 'center' | 'top' | 'bottom';
	export type DialogScrollBehavior = 'outside' | 'inside';

	export interface DialogContentProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		/** Width preset. `full` covers the viewport. */
		size?: DialogSize;
		/** Vertical position inside the positioner. */
		placement?: DialogPlacement;
		/** `outside` scrolls the positioner; `inside` caps the content and scrolls `DialogBody`. */
		scrollBehavior?: DialogScrollBehavior;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Dialog.module.css';
	import { useDialogContext } from './dialog.state.svelte';

	let {
		asChild,
		children,
		class: className,
		placement = 'center',
		ref = $bindable(null),
		scrollBehavior = 'outside',
		size = 'md',
		...props
	}: DialogContentProps = $props();

	const api = useDialogContext();
	const attrs = $derived(api.contentAttrs());

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
		data-scope="dialog"
		data-part="content"
		data-slot="dialog-content"
		data-size={size}
		data-placement={placement}
		data-scroll-behavior={scrollBehavior}
		class={cn(styles.content, className)}
	>
		{@render children?.()}
	</Element>
{/if}
