<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ImageCropperViewportBaseProps
		extends PolymorphicProps<'div'>,
			RefAttribute {}

	export interface ImageCropperViewportProps
		extends HTMLProps<'div'>,
			ImageCropperViewportBaseProps {}
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
	}: ImageCropperViewportProps = $props();

	const api = useImageCropperContext();
	const attrs = $derived(api.viewportAttrs());

	$effect(() => {
		api.registerViewport(ref as HTMLElement | null);
		return () => api.registerViewport(null);
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
	data-part="viewport"
	data-slot="image-cropper-viewport"
	class={cn(styles.viewport, className)}
>
	{@render children?.()}
</Element>
