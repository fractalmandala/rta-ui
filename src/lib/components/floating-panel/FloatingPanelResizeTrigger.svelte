<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { FloatingPanelResizeTriggerAxis } from './floating-panel.state.svelte';

	export interface FloatingPanelResizeTriggerProps
		extends Omit<HTMLProps<'div'>, 'role'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		axis: FloatingPanelResizeTriggerAxis;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './FloatingPanel.module.css';
	import { useFloatingPanelContext } from './floating-panel.state.svelte';

	let {
		asChild,
		axis,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: FloatingPanelResizeTriggerProps = $props();

	const api = useFloatingPanelContext();
	const attrs = $derived(api.resizeTriggerAttrs({ axis }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, style)}
	bind:ref
	{asChild}
	data-scope="floating-panel"
	data-part="resize-trigger"
	data-slot="floating-panel-resize-trigger"
	class={cn(styles.resizeTrigger, className)}
>
	{@render children?.()}
</Element>
