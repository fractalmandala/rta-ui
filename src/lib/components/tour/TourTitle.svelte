<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TourTitleProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute<HTMLDivElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Tour.module.css';
	import { useTourContext } from './tour.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: TourTitleProps = $props();

	const api = useTourContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.titleId}
	data-scope="tour"
	data-part="title"
	data-placement={api.target ? api.placement : 'center'}
	data-side={api.target ? api.side : undefined}
	data-slot="tour-title"
	class={cn(styles.title, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.step?.title}
	{/if}
</Element>
