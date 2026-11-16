<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarInsetProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import splitterStyles from '../splitter/Splitter.module.css';
	import { useSplitterContext } from '../splitter/splitter.state.svelte';
	import styles from './Sidebar.module.css';
	import { useSidebarContext } from './sidebar.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: SidebarInsetProps = $props();

	const api = useSidebarContext();
	const splitter = useSplitterContext();
	const attrs = $derived(
		api.mobile
			? api.insetAttrs()
			: {
					...splitter.panelAttrs('content'),
					'data-side': api.side,
					'data-state': api.state
				}
	);
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="inset"
	data-slot="sidebar-inset"
	data-side={api.side}
	class={cn(!api.mobile && splitterStyles.panel, styles.inset, className)}
>
	{@render children?.()}
</Element>
