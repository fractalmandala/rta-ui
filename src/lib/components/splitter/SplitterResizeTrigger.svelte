<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SplitterResizeTriggerProps
		extends Omit<HTMLProps<'div'>, 'id' | 'type'>,
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
	import SplitterResizeTriggerIndicator from './SplitterResizeTriggerIndicator.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled = false,
		id = '',
		ref = $bindable(null),
		...props
	}: SplitterResizeTriggerProps = $props();

	const api = useSplitterContext();
	const attrs = $derived(api.resizeTriggerAttrs(id, disabled));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="splitter"
	data-part="resize-trigger"
	data-slot="splitter-resize-trigger"
	class={cn(styles.resizeTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else if !asChild}
		<SplitterResizeTriggerIndicator id={id} {disabled} />
	{/if}
</Element>
