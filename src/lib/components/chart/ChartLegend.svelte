<script lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Chart.module.css';

	type Props = HTMLProps<'ul'> & PolymorphicProps<'ul'> & RefAttribute;

	let { class: className, asChild, children, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
	as="ul"
	{...props}
	bind:ref
	{asChild}
	class={cn(styles.legend, className)}
	data-scope="chart"
	data-part="legend"
	data-slot="chart-legend"
>
	{@render children?.()}
</Element>
