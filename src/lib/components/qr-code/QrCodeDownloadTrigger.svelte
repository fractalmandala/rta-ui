<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { QrCodeDownloadTriggerOptions } from './qr-code.state.svelte';

	export interface QrCodeDownloadTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			QrCodeDownloadTriggerOptions,
			PolymorphicProps<'button'>,
			RefAttribute {}
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
		fileName,
		mimeType,
		quality,
		ref = $bindable(null),
		...props
	}: QrCodeDownloadTriggerProps = $props();

	const api = useQrCodeContext();
	const attrs = $derived(api.downloadTriggerAttrs({ fileName, mimeType, quality }));
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="qr-code"
	data-part="download-trigger"
	data-slot="qr-code-download-trigger"
	class={cn(styles.downloadTrigger, className)}
>
	{@render children?.()}
</Element>
