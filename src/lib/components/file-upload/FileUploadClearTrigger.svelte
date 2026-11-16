<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FileUploadClearTriggerBaseProps
		extends PolymorphicProps<'button'>,
			RefAttribute {}

	export interface FileUploadClearTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			FileUploadClearTriggerBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useFileUploadContext } from './file-upload.state.svelte';

	let {
		asChild,
		children,
		ref = $bindable(null),
		...props
	}: FileUploadClearTriggerProps = $props();

	const api = useFileUploadContext();
	const attrs = $derived(api.clearTriggerAttrs());
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="file-upload"
	data-part="clear-trigger"
	data-slot="file-upload-clear-trigger"
>
	{@render children?.()}
</Element>
