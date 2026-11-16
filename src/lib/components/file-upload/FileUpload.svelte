<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseFileUploadProps } from './file-upload.state.svelte';

	export interface FileUploadRootBaseProps
		extends UseFileUploadProps,
			PolymorphicProps<'div'>,
			RefAttribute {}

	export interface FileUploadRootProps extends HTMLProps<'div'>, FileUploadRootBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './FileUpload.module.css';
	import { createFileUpload, setFileUploadContext } from './file-upload.state.svelte';

	let {
		accept,
		acceptedFiles = $bindable(),
		allowDrop,
		asChild,
		capture,
		children,
		class: className,
		defaultAcceptedFiles,
		dir,
		directory,
		disabled,
		id,
		ids,
		invalid,
		locale,
		maxFiles,
		maxFileSize,
		minFileSize,
		name,
		onFileAccept,
		onFileChange,
		onFileReject,
		preventDocumentDrop,
		readOnly,
		ref = $bindable(null),
		required,
		transformFiles,
		translations,
		validate,
		...props
	}: FileUploadRootProps = $props();

	const providedId = $props.id();

	const api = createFileUpload(
		() => ({
			accept,
			acceptedFiles,
			allowDrop,
			capture,
			defaultAcceptedFiles,
			dir,
			directory,
			disabled,
			id: id ?? providedId,
			ids,
			invalid,
			locale,
			maxFiles,
			maxFileSize,
			minFileSize,
			name,
			preventDocumentDrop,
			readOnly,
			required,
			transformFiles,
			translations,
			validate,
			onFileAccept,
			onFileReject,
			onFileChange(details) {
				onFileChange?.(details);
				if (acceptedFiles !== undefined) acceptedFiles = details.acceptedFiles;
			}
		}),
		providedId
	);

	setFileUploadContext(api);

	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.registerRoot(ref);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="file-upload"
	data-part="root"
	data-slot="file-upload-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
