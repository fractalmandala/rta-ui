<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FileUploadItemNameBaseProps extends PolymorphicProps<'div'>, RefAttribute {}

	export interface FileUploadItemNameProps
		extends HTMLProps<'div'>,
			FileUploadItemNameBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './FileUpload.module.css';
	import { useFileUploadContext, useFileUploadItemContext } from './file-upload.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: FileUploadItemNameProps =
		$props();

	const api = useFileUploadContext();
	const options = useFileUploadItemContext();
	const attrs = $derived(api.itemNameAttrs(options()));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="file-upload"
	data-part="item-name"
	data-slot="file-upload-item-name"
	class={cn(styles.itemName, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{options().file.name}
	{/if}
</Element>
