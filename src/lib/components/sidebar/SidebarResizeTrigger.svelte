<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarResizeTriggerProps
		extends Omit<HTMLProps<'div'>, 'id'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		id?: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import splitterStyles from '../splitter/Splitter.module.css';
	import { useSplitterContext } from '../splitter/splitter.state.svelte';
	import SplitterResizeTriggerIndicator from '../splitter/SplitterResizeTriggerIndicator.svelte';
	import styles from './Sidebar.module.css';
	import { useSidebarContext } from './sidebar.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled = false,
		id,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		...props
	}: SidebarResizeTriggerProps = $props();

	const api = useSidebarContext();
	const splitter = useSplitterContext();
	const resizeTriggerId = $derived(
		id ?? (api.side === 'left' ? `${api.panelId}:content` : `content:${api.panelId}`)
	);
	const attrs = $derived(splitter.resizeTriggerAttrs(resizeTriggerId, disabled));
</script>

{#if !api.mobile}
	<Element
		as="div"
		{...props}
		{...attrs}
		style={mergeStyleDeclarations(attrs.style, props.style)}
		bind:ref
		{asChild}
		id={resizeTriggerId}
		aria-label={typeof ariaLabel === 'string' ? ariaLabel : api.resizeLabel}
		data-side={api.side}
		data-scope="sidebar"
		data-part="resize-trigger"
		data-slot="sidebar-resize-trigger"
		class={cn(splitterStyles.resizeTrigger, styles.resizeTrigger, className)}
	>
		{#if children}
			{@render children()}
		{:else if !asChild}
			<SplitterResizeTriggerIndicator id={resizeTriggerId} {disabled} />
		{/if}
	</Element>
{/if}
