<script module lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import type { ImageCropperSelectionProps } from './ImageCropperSelection.svelte';

	export interface ImageCropperCropAreaProps extends ImageCropperSelectionProps {
		gridClassName?: ClassValue;
		handleClassName?: ClassValue;
	}
</script>

<script lang="ts">
	import ImageCropperGrid from './ImageCropperGrid.svelte';
	import ImageCropperHandle from './ImageCropperHandle.svelte';
	import ImageCropperSelection from './ImageCropperSelection.svelte';
	import { handles } from './crop';

	let {
		gridClassName,
		handleClassName,
		ref = $bindable(null),
		...props
	}: ImageCropperCropAreaProps = $props();
</script>

<ImageCropperSelection {...props} bind:ref>
	<ImageCropperGrid axis="horizontal" class={gridClassName} />
	<ImageCropperGrid axis="vertical" class={gridClassName} />
	{#each handles as position (position)}
		<ImageCropperHandle {position} class={handleClassName} />
	{/each}
</ImageCropperSelection>
