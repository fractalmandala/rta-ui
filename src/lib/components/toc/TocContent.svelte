<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TocContentProps
		extends HTMLProps<'article'>, PolymorphicProps<'article'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Toc.module.css';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: TocContentProps = $props();
</script>

<Element
	as="article"
	{...props}
	bind:ref
	{asChild}
	data-slot="toc-content"
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
