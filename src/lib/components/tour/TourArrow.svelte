<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TourArrowProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute<HTMLDivElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Tour.module.css';
	import TourArrowTip from './TourArrowTip.svelte';
	import { useTourContext } from './tour.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), style, ...props }: TourArrowProps =
		$props();

	const api = useTourContext();
</script>

{#if api.arrow}
	<Element
		as="div"
		{...props}
		bind:ref
		{asChild}
		id={api.arrowId}
		dir={api.dir}
		data-scope="tour"
		data-part="arrow"
		data-slot="tour-arrow"
		style={mergeStyleDeclarations(api.arrowStyle, style)}
		class={cn(styles.arrow, className)}
	>
		{#if children}
			{@render children()}
		{:else}
			<TourArrowTip />
		{/if}
	</Element>
{/if}
