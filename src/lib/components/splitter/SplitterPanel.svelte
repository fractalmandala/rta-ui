<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SplitterPanelProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		id: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Splitter.module.css';
	import { useSplitterContext } from './splitter.state.svelte';

	let {
		asChild,
		children,
		class: className,
		id,
		ref = $bindable(null),
		...props
	}: SplitterPanelProps = $props();

	const api = useSplitterContext();
	const attrs = $derived(api.panelAttrs(id));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="splitter"
	data-part="panel"
	data-slot="splitter-panel"
	class={cn(styles.panel, className)}
>
	{@render children?.()}
</Element>
