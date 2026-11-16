<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FileUploadHiddenInputBaseProps
		extends PolymorphicProps<'input'>,
			RefAttribute {}

	export interface FileUploadHiddenInputProps
		extends Omit<HTMLProps<'input'>, 'type'>,
			FileUploadHiddenInputBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useFileUploadContext } from './file-upload.state.svelte';

	let { asChild, ref = $bindable(null), ...props }: FileUploadHiddenInputProps = $props();

	const api = useFileUploadContext();
	const attrs = $derived(api.hiddenInputAttrs());

	$effect(() => {
		api.registerHiddenInput(ref as HTMLInputElement | null);
		return () => api.registerHiddenInput(null);
	});
</script>

<Element
	as="input"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
/>
