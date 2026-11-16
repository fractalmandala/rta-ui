<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ImageCropperSelectionBaseProps
		extends PolymorphicProps<'div'>,
			RefAttribute {}

	export interface ImageCropperSelectionProps
		extends HTMLProps<'div'>,
			ImageCropperSelectionBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ImageCropper.module.css';
	import { useImageCropperContext } from './image-cropper.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ImageCropperSelectionProps = $props();

	const api = useImageCropperContext();
	const attrs = $derived(api.selectionAttrs());

	$effect(() => {
		api.registerSelection(ref);
		return () => api.registerSelection(null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="image-cropper"
	data-part="selection"
	data-slot="image-cropper-selection"
	class={cn(styles.selection, className)}
>
	{@render children?.()}
</Element>
