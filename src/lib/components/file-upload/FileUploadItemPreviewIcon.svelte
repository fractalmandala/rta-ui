<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FileUploadItemPreviewIconBaseProps
		extends PolymorphicProps<'svg'>,
			RefAttribute {}

	export interface FileUploadItemPreviewIconProps
		extends HTMLProps<'svg'>,
			FileUploadItemPreviewIconBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './FileUpload.module.css';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: FileUploadItemPreviewIconProps = $props();
</script>

<Element
	as="svg"
	{...props}
	bind:ref
	{asChild}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	data-scope="file-upload"
	data-part="item-preview-icon"
	data-slot="file-upload-item-preview-icon"
	class={cn(styles.itemPreviewIcon, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
		<path d="M14 2v4a2 2 0 0 0 2 2h4" />
	{/if}
</Element>
