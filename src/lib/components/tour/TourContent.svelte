<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TourContentProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute<HTMLDivElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Tour.module.css';
	import { useTourContext } from './tour.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onkeydown,
		ref = $bindable(null),
		style,
		...props
	}: TourContentProps = $props();

	const api = useTourContext();

	$effect(() => {
		api.setContentNode(ref as HTMLElement | null);
		return () => api.setContentNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.contentId}
	dir={api.dir}
	role="dialog"
	aria-modal="true"
	aria-live="polite"
	aria-atomic="true"
	hidden={!api.open}
	data-scope="tour"
	data-part="content"
	data-state={api.dataState}
	data-type={api.step?.type}
	data-placement={api.placement}
	data-side={api.side}
	data-step={api.step?.id}
	data-slot="tour-content"
	aria-labelledby={api.titleId}
	aria-describedby={api.descriptionId}
	tabindex={-1}
	{style}
	onkeydown={(event) => {
		onkeydown?.(event);
		api.handleContentKeydown(event);
	}}
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
