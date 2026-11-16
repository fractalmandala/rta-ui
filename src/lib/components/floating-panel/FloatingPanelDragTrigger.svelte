<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FloatingPanelDragTriggerProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useFloatingPanelContext } from './floating-panel.state.svelte';

	let {
		asChild,
		children,
		ref = $bindable(null),
		style,
		...props
	}: FloatingPanelDragTriggerProps = $props();

	const api = useFloatingPanelContext();
	const attrs = $derived(api.dragTriggerAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, style)}
	bind:ref
	{asChild}
	data-scope="floating-panel"
	data-part="drag-trigger"
	data-slot="floating-panel-drag-trigger"
>
	{@render children?.()}
</Element>
