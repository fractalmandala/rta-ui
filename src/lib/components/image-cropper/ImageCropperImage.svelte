<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ImageCropperImageBaseProps extends PolymorphicProps<'img'>, RefAttribute {}

	export interface ImageCropperImageProps
		extends HTMLProps<'img'>,
			ImageCropperImageBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ImageCropper.module.css';
	import { useImageCropperContext } from './image-cropper.state.svelte';

	let { asChild, class: className, ref = $bindable(null), ...props }: ImageCropperImageProps =
		$props();

	const api = useImageCropperContext();
	const attrs = $derived(api.imageAttrs());

	$effect(() => {
		api.registerImage(ref as HTMLImageElement | null);
		return () => api.registerImage(null);
	});
</script>

<Element
	as="img"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="image-cropper"
	data-part="image"
	data-slot="image-cropper-image"
	class={cn(styles.image, className)}
/>
