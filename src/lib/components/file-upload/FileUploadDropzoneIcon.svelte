<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FileUploadDropzoneIconBaseProps
		extends PolymorphicProps<'span'>,
			RefAttribute {}

	export interface FileUploadDropzoneIconProps
		extends HTMLProps<'span'>,
			FileUploadDropzoneIconBaseProps {}
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
	}: FileUploadDropzoneIconProps = $props();
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	aria-hidden="true"
	data-scope="file-upload"
	data-part="dropzone-icon"
	data-slot="file-upload-dropzone-icon"
	class={cn(styles.dropzoneIcon, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M12 13v8" />
			<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
			<path d="m8 17 4-4 4 4" />
		</svg>
	{/if}
</Element>
