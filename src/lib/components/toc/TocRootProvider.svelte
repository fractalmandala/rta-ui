<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { TocApi } from './toc.state.svelte';

	export interface TocRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: TocApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Toc.module.css';
	import { setTocContext } from './toc.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: TocRootProviderProps = $props();

	const api = untrack(() => value);
	setTocContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="toc"
	data-part="root"
	data-slot="toc-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
