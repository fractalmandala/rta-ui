<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { FileUploadApi } from './file-upload.state.svelte';

	export interface FileUploadRootProviderBaseProps
		extends PolymorphicProps<'div'>,
			RefAttribute {
		value: FileUploadApi;
	}

	export interface FileUploadRootProviderProps
		extends HTMLProps<'div'>,
			FileUploadRootProviderBaseProps {}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './FileUpload.module.css';
	import { setFileUploadContext } from './file-upload.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: FileUploadRootProviderProps = $props();

	const api = untrack(() => value);
	setFileUploadContext(api);

	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="file-upload"
	data-part="root"
	data-slot="file-upload-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
