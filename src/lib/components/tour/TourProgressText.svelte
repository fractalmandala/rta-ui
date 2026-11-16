<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TourProgressTextProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute<HTMLDivElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Tour.module.css';
	import { useTourContext } from './tour.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: TourProgressTextProps =
		$props();

	const api = useTourContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-scope="tour"
	data-part="progress-text"
	data-slot="tour-progress-text"
	class={cn(styles.progressText, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.progressText}
	{/if}
</Element>
