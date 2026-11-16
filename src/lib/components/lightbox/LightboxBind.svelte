<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { LightboxBindProps } from './lightbox';

	type Props = LightboxBindProps & { children?: Snippet };
</script>

<script lang="ts">
	import { useDialogContext } from '../dialog/dialog.state.svelte';
	import { resolveImage, resolveRootNode } from './lightbox';
	import { useLightboxContext } from './lightbox.state.svelte';

	let { children, onImageSelect, rootRef, rootSelector, selector }: Props = $props();

	const dialog = useDialogContext();
	const api = useLightboxContext();

	$effect(() => {
		const rootNode = resolveRootNode(rootRef, rootSelector);
		if (!rootNode) return;

		const handleClick = (event: MouseEvent) => {
			const image = event.defaultPrevented ? null : resolveImage(event.target, selector, rootNode);
			if (!image) return;
			onImageSelect(image);
			const matched = api.sources.findIndex((source) => source.src === image.src);
			if (matched !== -1) api.setIndex(matched);
			dialog.setOpen(true);
		};

		// Warm the cache with the full-size source on hover or keyboard focus.
		const handlePreload = (event: Event) => {
			const image = resolveImage(event.target, selector, rootNode);
			if (!image) return;
			const preloaded = new Image();
			preloaded.src = image.src;
		};

		rootNode.addEventListener('click', handleClick);
		// pointerenter does not bubble; the capture phase sees it for every descendant.
		rootNode.addEventListener('pointerenter', handlePreload, true);
		rootNode.addEventListener('focusin', handlePreload);

		return () => {
			rootNode.removeEventListener('click', handleClick);
			rootNode.removeEventListener('pointerenter', handlePreload, true);
			rootNode.removeEventListener('focusin', handlePreload);
		};
	});
</script>

{@render children?.()}
