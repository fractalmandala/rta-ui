<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TourProgressBarProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute<HTMLDivElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useTourContext } from './tour.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), style, ...props }: TourProgressBarProps =
		$props();

	const api = useTourContext();
	const trackStyle =
		'position: relative; overflow: hidden; height: var(--tour-progress-height, 3px); border-radius: var(--tour-progress-radius, 9999px); background-color: var(--tour-progress-track, color-mix(in oklab, currentColor 18%, transparent));';
	const fillStyle =
		'height: 100%; background-color: var(--tour-progress-color, currentColor); transition: width var(--tour-progress-duration, 200ms) ease;';
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	role="progressbar"
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={api.progressPercent}
	data-scope="tour"
	data-part="progress-bar"
	data-step={api.step?.id}
	data-slot="tour-progress-bar"
	style={mergeStyleDeclarations(trackStyle, style)}
	class={cn(className)}
>
	{#if children}
		{@render children()}
	{:else}
		<div data-slot="tour-progress-bar-fill" style={`${fillStyle} ${api.progressBarStyle}`}></div>
	{/if}
</Element>
