<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TocTitleProps
		extends HTMLProps<'h2'>, PolymorphicProps<'h2'>, RefAttribute {}
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
	}: TocTitleProps = $props();

	const api = useTocContext();
	const attrs = $derived(api.titleAttrs());
</script>

<Element
	as="h2"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="toc"
	data-part="title"
	data-slot="toc-title"
	class={cn(styles.title, className)}
>
	{@render children?.()}
</Element>
