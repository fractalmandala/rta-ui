<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FileUploadItemPreviewImageBaseProps
		extends PolymorphicProps<'img'>,
			RefAttribute {}

	export interface FileUploadItemPreviewImageProps
		extends HTMLProps<'img'>,
			FileUploadItemPreviewImageBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './FileUpload.module.css';
	import { useFileUploadContext, useFileUploadItemContext } from './file-upload.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		...props
	}: FileUploadItemPreviewImageProps = $props();

	const api = useFileUploadContext();
	const options = useFileUploadItemContext();

	let url = $state('');

	$effect(() => {
		const file = options().file;
		url = '';
		return api.createFileUrl(file, (next) => {
			url = next;
		});
	});

	const attrs = $derived(api.itemPreviewImageAttrs({ ...options(), url }));
</script>

{#if url}
	<Element
		as="img"
		{...props}
		bind:ref
		{asChild}
		{...attrs}
		data-scope="file-upload"
		data-part="item-preview-image"
		data-slot="file-upload-item-preview-image"
		class={cn(styles.itemPreviewImage, className)}
	/>
{/if}
