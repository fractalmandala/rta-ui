<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ScrollAreaApi } from './scroll-area.state.svelte';

	export interface ScrollAreaRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: ScrollAreaApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ScrollArea.module.css';
	import { setScrollAreaContext } from './scroll-area.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: ScrollAreaRootProviderProps = $props();

	const api = untrack(() => value);
	setScrollAreaContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="scroll-area"
	data-part="root"
	data-slot="scroll-area-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
