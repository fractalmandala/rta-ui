<script lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Chart.module.css';

	type Props = HTMLProps<'figure'> & PolymorphicProps<'figure'> & RefAttribute;

	let { class: className, asChild, children, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
	as="figure"
	{...props}
	bind:ref
	{asChild}
	class={cn(styles.root, className)}
	data-scope="chart"
	data-part="root"
	data-slot="chart-root"
>
	{@render children?.()}
</Element>
