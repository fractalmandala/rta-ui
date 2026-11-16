<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ImageCropperApi } from './image-cropper.state.svelte';

	export interface ImageCropperRootProviderBaseProps
		extends PolymorphicProps<'div'>,
			RefAttribute {
		value: ImageCropperApi;
	}

	export interface ImageCropperRootProviderProps
		extends HTMLProps<'div'>,
			ImageCropperRootProviderBaseProps {}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ImageCropper.module.css';
	import { setImageCropperContext } from './image-cropper.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: ImageCropperRootProviderProps = $props();

	const api = untrack(() => value);
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
	data-slot="image-cropper-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
