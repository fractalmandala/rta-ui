<script lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Chart.module.css';

	type Props = HTMLProps<'h3'> & PolymorphicProps<'h3'> & RefAttribute;

	let { class: className, asChild, children, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
	as="h3"
	{...props}
	bind:ref
	{asChild}
	class={cn(styles.title, className)}
	data-scope="chart"
	data-part="title"
	data-slot="chart-title"
>
	{@render children?.()}
</Element>
