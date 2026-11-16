<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { FileUploadItemGroupOptions } from './file-upload.state.svelte';

	export interface FileUploadItemGroupBaseProps
		extends FileUploadItemGroupOptions,
			PolymorphicProps<'ul'>,
			RefAttribute {}

	export interface FileUploadItemGroupProps
		extends HTMLProps<'ul'>,
			FileUploadItemGroupBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './FileUpload.module.css';
	import {
		setFileUploadItemGroupContext,
		useFileUploadContext
	} from './file-upload.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		type,
		...props
	}: FileUploadItemGroupProps = $props();

	const api = useFileUploadContext();
	const attrs = $derived(api.itemGroupAttrs({ type }));

	setFileUploadItemGroupContext(() => ({ type }));
</script>

<Element
	as="ul"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="file-upload"
	data-part="item-group"
	data-slot="file-upload-item-group"
	class={cn(styles.itemGroup, className)}
>
	{@render children?.()}
</Element>
