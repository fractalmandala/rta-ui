<script lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Chart.module.css';

	type Props = HTMLProps<'p'> & PolymorphicProps<'p'> & RefAttribute;

	let { class: className, asChild, children, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
	as="p"
	{...props}
	bind:ref
	{asChild}
	class={cn(styles.description, className)}
	data-scope="chart"
	data-part="description"
	data-slot="chart-description"
>
	{@render children?.()}
</Element>
