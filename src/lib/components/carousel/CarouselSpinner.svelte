<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CarouselSpinnerProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import { useCarouselContext } from './carousel.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CarouselSpinnerProps = $props();

	const api = useCarouselContext();
	const attrs = $derived(api.spinnerAttrs());
	const spinnerStyle = $derived(
		`${attrs.style ?? ''}; display: inline-flex; align-items: center; justify-content: center`
	);
	const svgStyle = 'width: 1em; height: 1em; display: block; overflow: visible';
	const ringStyle =
		'stroke-dashoffset: var(--carousel-spinner-offset, 56.55); transition: stroke-dashoffset 50ms linear';
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(spinnerStyle, props.style)}
	data-scope="carousel"
	data-part="spinner"
	data-slot="carousel-spinner"
	class={className}
	aria-hidden="true"
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			focusable="false"
			style={svgStyle}
		>
			<circle
				cx="12"
				cy="12"
				r="9"
				fill="none"
				stroke="currentColor"
				stroke-opacity="0.2"
				stroke-width="2"
			/>
			<circle
				cx="12"
				cy="12"
				r="9"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-dasharray="56.55"
				transform="rotate(-90 12 12)"
				style={ringStyle}
			/>
		</svg>
	{/if}
</Element>
