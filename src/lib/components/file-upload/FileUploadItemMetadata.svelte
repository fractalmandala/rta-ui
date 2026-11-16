<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FileUploadItemMetadataProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		file: File;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './FileUpload.module.css';
	import FileUploadItemSizeText from './FileUploadItemSizeText.svelte';

	let {
		asChild,
		children,
		class: className,
		file,
		ref = $bindable(null),
		...props
	}: FileUploadItemMetadataProps = $props();

	const getFileTypeLabel = (file: File) => {
		const extension = file.name.includes('.') ? file.name.split('.').pop() : undefined;
		return extension ? extension.toUpperCase() : file.type || 'FILE';
	};
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-scope="file-upload"
	data-part="item-metadata"
	data-slot="file-upload-item-metadata"
	class={cn(styles.itemMetadata, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<span>{getFileTypeLabel(file)}</span>
		<FileUploadItemSizeText />
	{/if}
</Element>
