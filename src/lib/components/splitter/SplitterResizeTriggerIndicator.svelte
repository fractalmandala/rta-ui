<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SplitterResizeTriggerIndicatorProps
		extends Omit<HTMLProps<'div'>, 'id'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		id?: string;
		disabled?: boolean;
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
		disabled = false,
		id = '',
		ref = $bindable(null),
		...props
	}: SplitterResizeTriggerIndicatorProps = $props();

	const api = useSplitterContext();
	const attrs = $derived(api.resizeTriggerIndicatorAttrs(id, disabled));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="splitter"
	data-part="resize-trigger-indicator"
	data-slot="splitter-resize-trigger-indicator"
	class={cn(styles.resizeTriggerIndicator, className)}
>
	{@render children?.()}
</Element>
