<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FloatingPanelContentProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './FloatingPanel.module.css';
	import { useFloatingPanelContext } from './floating-panel.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: FloatingPanelContentProps = $props();

	const api = useFloatingPanelContext();
	const attrs = $derived(api.contentAttrs());

	$effect(() => {
		const element = ref as HTMLElement | null;
		if (!element) return;
		api.setContentNode(element);
		return () => api.setContentNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, style)}
	bind:ref
	{asChild}
	data-scope="floating-panel"
	data-part="content"
	data-slot="floating-panel-content"
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
