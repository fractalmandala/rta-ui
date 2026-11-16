<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface QrCodeOverlayProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './QrCode.module.css';
	import { useQrCodeContext } from './qr-code.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: QrCodeOverlayProps = $props();

	const api = useQrCodeContext();
	const attrs = $derived(api.overlayAttrs());

	$effect(() => {
		api.registerOverlay(ref);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="qr-code"
	data-part="overlay"
	data-slot="qr-code-overlay"
	class={cn(styles.overlay, className)}
>
	{@render children?.()}
</Element>
