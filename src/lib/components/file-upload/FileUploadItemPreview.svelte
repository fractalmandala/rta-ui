<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FileUploadItemPreviewBaseProps
		extends PolymorphicProps<'div'>,
			RefAttribute {
		/** Only render the preview for files whose MIME type matches this pattern. */
		type?: string;
	}

	export interface FileUploadItemPreviewProps
		extends HTMLProps<'div'>,
			FileUploadItemPreviewBaseProps {}
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
		type,
		...props
	}: FileUploadItemPreviewProps = $props();

	const api = useFileUploadContext();
	const options = useFileUploadItemContext();
	const attrs = $derived(api.itemPreviewAttrs(options()));
	const shouldRender = $derived(options().file.type.match(type ?? '.*') !== null);
</script>

{#if shouldRender}
	<Element
		as="div"
		{...props}
		bind:ref
		{asChild}
		{...attrs}
		data-scope="file-upload"
		data-part="item-preview"
		data-slot="file-upload-item-preview"
		class={cn(styles.itemPreview, className)}
	>
		{@render children?.()}
	</Element>
{/if}
