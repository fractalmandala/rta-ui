<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FileUploadLabelBaseProps extends PolymorphicProps<'label'>, RefAttribute {}

	export interface FileUploadLabelProps extends HTMLProps<'label'>, FileUploadLabelBaseProps {}
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
		ref = $bindable(null),
		...props
	}: FileUploadLabelProps = $props();

	const api = useFileUploadContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="label"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="file-upload"
	data-part="label"
	data-slot="file-upload-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
