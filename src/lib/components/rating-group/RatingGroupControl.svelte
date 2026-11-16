<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface RatingGroupControlProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './RatingGroup.module.css';
	import { useRatingGroupContext } from './rating-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: RatingGroupControlProps = $props();

	const api = useRatingGroupContext();
	const attrs = $derived(api.controlAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="rating-group"
	data-part="control"
	data-slot="rating-group-control"
	class={cn(styles.control, className)}
	onpointermove={(event) => {
		if (event.pointerType === 'touch') return;
		api.setHovered(api.value > 0 ? api.value : 1);
	}}
	onpointerleave={(event) => {
		if (event.pointerType === 'touch') return;
		api.setHovered(-1);
	}}
>
	{@render children?.()}
</Element>
