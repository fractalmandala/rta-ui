<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { TocItemData } from './toc.state.svelte';

	export interface TocItemProps
		extends HTMLProps<'li'>, PolymorphicProps<'li'>, RefAttribute {
		item: TocItemData;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Toc.module.css';
	import { setTocItemPropsContext, useTocContext } from './toc.state.svelte';

	let {
		asChild,
		children,
		class: className,
		item,
		ref = $bindable(null),
		...props
	}: TocItemProps = $props();

	const api = useTocContext();
	setTocItemPropsContext(() => item);
	const attrs = $derived(api.itemAttrs(item));
</script>

<Element
	as="li"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="toc"
	data-part="item"
	data-slot="toc-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
