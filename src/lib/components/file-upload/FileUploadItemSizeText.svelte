<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FileUploadItemSizeTextBaseProps
		extends PolymorphicProps<'div'>,
			RefAttribute {}

	export interface FileUploadItemSizeTextProps
		extends HTMLProps<'div'>,
			FileUploadItemSizeTextBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './FileUpload.module.css';
	import { useFileUploadContext, useFileUploadItemContext } from './file-upload.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: FileUploadItemSizeTextProps = $props();

	const api = useFileUploadContext();
	const options = useFileUploadItemContext();
	const attrs = $derived(api.itemSizeTextAttrs(options()));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="file-upload"
	data-part="item-size-text"
	data-slot="file-upload-item-size-text"
	class={cn(styles.itemSizeText, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.getFileSize(options().file)}
	{/if}
</Element>
