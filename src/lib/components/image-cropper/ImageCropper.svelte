<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseImageCropperProps } from './image-cropper.state.svelte';

	export interface ImageCropperRootProps
		extends UseImageCropperProps,
			HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ImageCropper.module.css';
	import { createImageCropper, setImageCropperContext } from './image-cropper.state.svelte';

	let {
		aspectRatio,
		asChild,
		children,
		class: className,
		cropShape,
		defaultFlip,
		defaultRotation,
		defaultZoom,
		dir,
		fixedCropArea,
		flip = $bindable(),
		id,
		ids,
		initialCrop,
		maxHeight,
		maxWidth,
		minHeight,
		minWidth,
		minZoom,
		maxZoom,
		zoomStep,
		nudgeStep,
		nudgeStepCtrl,
		nudgeStepShift,
		onCropChange,
		onFlipChange,
		onRotationChange,
		onZoomChange,
		ref = $bindable(null),
		rotation = $bindable(),
		translations,
		zoom = $bindable(),
		...props
	}: ImageCropperRootProps = $props();

	const providedId = $props.id();

	const api = createImageCropper(
		() => ({
			aspectRatio,
			cropShape,
			defaultFlip,
			defaultRotation,
			defaultZoom,
			dir,
			fixedCropArea,
			flip,
			id: id ?? providedId,
			ids,
			initialCrop,
			maxHeight,
			maxWidth,
			minHeight,
			minWidth,
			minZoom,
			maxZoom,
			zoomStep,
			nudgeStep,
			nudgeStepCtrl,
			nudgeStepShift,
			rotation,
			translations,
			zoom,
			onCropChange,
			onRotationChange(details) {
				onRotationChange?.(details);
				if (rotation !== undefined) rotation = details.rotation;
			},
			onFlipChange(details) {
				onFlipChange?.(details);
				if (flip !== undefined) flip = details.flip;
			},
			onZoomChange(details) {
				onZoomChange?.(details);
				if (zoom !== undefined) zoom = details.zoom;
			}
		}),
		providedId
	);

	setImageCropperContext(api);

	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.registerRoot(ref);
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
	data-part="root"
	data-slot="image-cropper-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
