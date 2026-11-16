<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FloatingPanelHeaderProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './FloatingPanel.module.css';
	import { useFloatingPanelContext } from './floating-panel.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: FloatingPanelHeaderProps = $props();

	const api = useFloatingPanelContext();
	const attrs = $derived(api.headerAttrs());

	$effect(() => {
		const element = ref as HTMLElement | null;
		if (!element) return;
		api.setHeaderNode(element);
		return () => api.setHeaderNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="floating-panel"
	data-part="header"
	data-slot="floating-panel-header"
	class={cn(styles.header, className)}
>
	{@render children?.()}
</Element>
