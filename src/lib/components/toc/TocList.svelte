<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TocListProps
		extends HTMLProps<'ul'>, PolymorphicProps<'ul'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Toc.module.css';
	import { useTocContext } from './toc.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: TocListProps = $props();

	const api = useTocContext();
	const attrs = $derived(api.listAttrs());
</script>

<Element
	as="ul"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="toc"
	data-part="list"
	data-slot="toc-list"
	class={cn(styles.list, className)}
>
	{@render children?.()}
</Element>
