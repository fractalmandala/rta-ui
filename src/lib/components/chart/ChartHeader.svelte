<script lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Chart.module.css';

	type Props = HTMLProps<'figcaption'> & PolymorphicProps<'figcaption'> & RefAttribute;

	let { class: className, asChild, children, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
	as="figcaption"
	{...props}
	bind:ref
	{asChild}
	class={cn(styles.header, className)}
	data-scope="chart"
	data-part="header"
	data-slot="chart-header"
>
	{@render children?.()}
</Element>
