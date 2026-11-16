<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TocLinkProps
		extends HTMLProps<'a'>, PolymorphicProps<'a'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Toc.module.css';
	import { useTocContext, useTocItemPropsContext } from './toc.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onclick,
		ref = $bindable(null),
		...props
	}: TocLinkProps = $props();

	const api = useTocContext();
	const item = useTocItemPropsContext();
	const attrs = $derived(api.linkAttrs(item()));
</script>

<Element
	as="a"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="toc"
	data-part="link"
	data-slot="toc-link"
	onclick={(event) => {
		api.handleLinkClick(event);
		onclick?.(event);
	}}
	class={cn(styles.link, className)}
>
	{@render children?.()}
</Element>
