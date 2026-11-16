<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TourControlProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute<HTMLDivElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Tour.module.css';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: TourControlProps = $props();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-scope="tour"
	data-part="control"
	data-slot="tour-control"
	class={cn(styles.control, className)}
>
	{@render children?.()}
</Element>
