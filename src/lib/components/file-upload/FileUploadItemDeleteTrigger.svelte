<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FileUploadItemDeleteTriggerBaseProps
		extends PolymorphicProps<'button'>,
			RefAttribute {}

	export interface FileUploadItemDeleteTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			FileUploadItemDeleteTriggerBaseProps {}
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
		...props
	}: FileUploadItemDeleteTriggerProps = $props();

	const api = useFileUploadContext();
	const options = useFileUploadItemContext();
	const attrs = $derived(api.itemDeleteTriggerAttrs(options()));
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="file-upload"
	data-part="item-delete-trigger"
	data-slot="file-upload-item-delete-trigger"
	class={cn(styles.itemDeleteTrigger, className)}
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
			<path d="M3 6h18" />
			<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
			<path d="M10 11v6" />
			<path d="M14 11v6" />
			<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
		</svg>
	{/if}
</Element>
