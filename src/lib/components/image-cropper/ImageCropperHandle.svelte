<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ImageCropperHandleOptions } from './image-cropper.state.svelte';

	export interface ImageCropperHandleBaseProps
		extends ImageCropperHandleOptions,
			PolymorphicProps<'div'>,
			RefAttribute {}

	export interface ImageCropperHandleProps
		extends HTMLProps<'div'>,
			ImageCropperHandleBaseProps {}
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
		position,
		ref = $bindable(null),
		...props
	}: ImageCropperHandleProps = $props();

	const api = useImageCropperContext();
	const attrs = $derived(api.handleAttrs({ position }));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="image-cropper"
	data-part="handle"
	data-slot="image-cropper-handle"
	class={cn(styles.handle, className)}
>
	{@render children?.()}
</Element>
