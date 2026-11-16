<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ImageCropperGridOptions } from './image-cropper.state.svelte';

	export interface ImageCropperGridBaseProps
		extends ImageCropperGridOptions,
			PolymorphicProps<'div'>,
			RefAttribute {}

	export interface ImageCropperGridProps
		extends HTMLProps<'div'>,
			ImageCropperGridBaseProps {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ImageCropper.module.css';
	import { useImageCropperContext } from './image-cropper.state.svelte';

	let {
		asChild,
		axis,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ImageCropperGridProps = $props();

	const api = useImageCropperContext();
	const attrs = $derived(api.gridAttrs({ axis }));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="image-cropper"
	data-part="grid"
	data-slot="image-cropper-grid"
	class={cn(styles.grid, className)}
>
	{@render children?.()}
</Element>
