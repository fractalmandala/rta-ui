<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface QrCodeFrameProps
		extends HTMLProps<'svg'>, PolymorphicProps<'svg'>, RefAttribute {}
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
	}: QrCodeFrameProps = $props();

	const api = useQrCodeContext();
	const attrs = $derived(api.frameAttrs());

	$effect(() => {
		api.registerFrame(ref);
	});
</script>

<Element
	as="svg"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="qr-code"
	data-part="frame"
	data-slot="qr-code-frame"
	class={cn(styles.frame, className)}
>
	{@render children?.()}
</Element>
