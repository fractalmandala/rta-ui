<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FloatingPanelTitleProps
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
	}: FloatingPanelTitleProps = $props();

	const api = useFloatingPanelContext();
	const attrs = $derived(api.titleAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="floating-panel"
	data-part="title"
	data-slot="floating-panel-title"
	class={cn(styles.title, className)}
>
	{@render children?.()}
</Element>
