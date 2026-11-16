<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { DialogRootProps } from '../dialog/Dialog.svelte';
	import type {
		LightboxElementIds,
		LightboxIndexChangeDetails,
		LightboxSource,
		LightboxTranslations,
		LightboxZoomChangeDetails
	} from './lightbox.state.svelte';

	export interface LightboxRootProps extends Omit<DialogRootProps, 'children' | 'ids'> {
		/** Images the gallery navigates through. */
		sources?: LightboxSource[];
		index?: number;
		defaultIndex?: number;
		onIndexChange?: (details: LightboxIndexChangeDetails) => void;
		loop?: boolean;
		zoom?: number;
		defaultZoom?: number;
		minZoom?: number;
		maxZoom?: number;
		zoomStep?: number;
		onZoomChange?: (details: LightboxZoomChangeDetails) => void;
		dir?: 'ltr' | 'rtl' | 'auto' | null;
		id?: string | null;
		ids?: LightboxElementIds;
		translations?: LightboxTranslations;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import Dialog from '../dialog/Dialog.svelte';
	import { createLightbox, setLightboxContext } from './lightbox.state.svelte';

	let {
		children,
		defaultIndex,
		defaultZoom,
		dir,
		id,
		ids,
		index = $bindable(),
		loop = false,
		maxZoom,
		minZoom,
		onIndexChange,
		onZoomChange,
		sources,
		translations,
		zoom = $bindable(),
		zoomStep,
		...props
	}: LightboxRootProps = $props();

	const uid = $props.id();
	const api = createLightbox(
		() => ({
			sources,
			index,
			defaultIndex,
			loop,
			zoom,
			defaultZoom,
			minZoom,
			maxZoom,
			zoomStep,
			dir,
			id,
			ids,
			translations,
			onIndexChange(details) {
				if (index !== undefined) index = details.index;
				onIndexChange?.(details);
			},
			onZoomChange(details) {
				if (zoom !== undefined) zoom = details.zoom;
				onZoomChange?.(details);
			}
		}),
		uid
	);
	setLightboxContext(api);
</script>

<Dialog {...props} {dir} {id}>
	{@render children?.()}
</Dialog>
