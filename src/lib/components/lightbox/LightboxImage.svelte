<script module lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	export interface LightboxImageProps extends HTMLImgAttributes {
		/** Close the lightbox when the image is clicked. */
		closeOnClick?: boolean;
		/** The rendered <img> element. */
		ref?: HTMLImageElement | null;
	}
</script>

<script lang="ts">
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Lightbox.module.css';
	import { useDialogContext } from '../dialog/dialog.state.svelte';
	import { useLightboxContext } from './lightbox.state.svelte';

	let {
		alt,
		class: className,
		closeOnClick = false,
		onclick,
		ref = $bindable(null),
		src,
		style,
		...props
	}: LightboxImageProps = $props();

	const api = useLightboxContext();
	const dialog = useDialogContext();
	const resolvedSrc = $derived(src ?? api.current?.src);
	const resolvedAlt = $derived(alt ?? api.current?.alt ?? '');
</script>

<img
	{...props}
	bind:this={ref}
	src={resolvedSrc}
	alt={resolvedAlt}
	style={mergeStyleDeclarations(style, api.imageStyle())}
	class={cn(styles.image, className)}
	data-scope="lightbox"
	data-part="image"
	data-slot="lightbox-image"
	data-index={api.index}
	data-zoom={api.zoom}
	data-close-on-click={closeOnClick ? '' : undefined}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		if (closeOnClick) dialog.setOpen(false);
	}}
/>
