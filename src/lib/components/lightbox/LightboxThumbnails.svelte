<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface LightboxThumbnailsProps
		extends HTMLProps<'ul'>,
			PolymorphicProps<'ul'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { useLightboxContext } from './lightbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: LightboxThumbnailsProps = $props();

	const api = useLightboxContext();
</script>

<Element
	as="ul"
	{...props}
	bind:ref
	{asChild}
	aria-label="Images"
	data-scope="lightbox"
	data-part="thumbnails"
	data-slot="lightbox-thumbnails"
	data-index={api.index}
	class={cn(className)}
>
	{#each api.sources as source, position (source.src + position)}
		<Element
			as="li"
			data-scope="lightbox"
			data-part="thumbnail-item"
			data-slot="lightbox-thumbnail-item"
			data-index={position}
		>
			<Element
				as="button"
				{...api.thumbnailAttrs(position)}
				data-scope="lightbox"
				data-part="thumbnail"
				data-slot="lightbox-thumbnail"
				onclick={() => api.setIndex(position)}
			>
				{#if children}
					{@render children()}
				{:else}
					<img src={source.src} alt="" />
				{/if}
			</Element>
		</Element>
	{/each}
</Element>
