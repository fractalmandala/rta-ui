<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { FileUploadItemOptions } from './file-upload.state.svelte';

	export interface FileUploadItemBaseProps
		extends Omit<FileUploadItemOptions, 'type'>,
			PolymorphicProps<'li'>,
			RefAttribute {}

	export interface FileUploadItemProps extends HTMLProps<'li'>, FileUploadItemBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './FileUpload.module.css';
	import {
		setFileUploadItemContext,
		useFileUploadContext,
		useFileUploadItemGroupContext
	} from './file-upload.state.svelte';

	let {
		asChild,
		children,
		class: className,
		file,
		ref = $bindable(null),
		...props
	}: FileUploadItemProps = $props();

	const api = useFileUploadContext();
	const group = useFileUploadItemGroupContext();

	const options = (): FileUploadItemOptions => ({ file, type: group().type });
	setFileUploadItemContext(options);

	const attrs = $derived(api.itemAttrs(options()));
</script>

<Element
	as="li"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="file-upload"
	data-part="item"
	data-slot="file-upload-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
