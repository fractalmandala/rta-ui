<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FileUploadTriggerBaseProps extends PolymorphicProps<'button'>, RefAttribute {}

	export interface FileUploadTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			FileUploadTriggerBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useFileUploadContext } from './file-upload.state.svelte';

	let { asChild, children, ref = $bindable(null), ...props }: FileUploadTriggerProps = $props();

	const api = useFileUploadContext();
	const attrs = $derived(api.triggerAttrs());
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="file-upload"
	data-part="trigger"
	data-slot="file-upload-trigger"
>
	{@render children?.()}
</Element>
