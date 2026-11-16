<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { FileUploadDropzoneOptions } from './file-upload.state.svelte';

	export interface FileUploadDropzoneBaseProps
		extends FileUploadDropzoneOptions,
			PolymorphicProps<'div'>,
			RefAttribute {}

	export interface FileUploadDropzoneProps extends HTMLProps<'div'>, FileUploadDropzoneBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './FileUpload.module.css';
	import { useFileUploadContext } from './file-upload.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disableClick,
		ref = $bindable(null),
		...props
	}: FileUploadDropzoneProps = $props();

	const api = useFileUploadContext();
	const attrs = $derived(api.dropzoneAttrs({ disableClick }));

	$effect(() => {
		api.registerDropzone(ref);
		return () => api.registerDropzone(null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="file-upload"
	data-part="dropzone"
	data-slot="file-upload-dropzone"
	class={cn(styles.dropzone, className)}
>
	{@render children?.()}
</Element>
