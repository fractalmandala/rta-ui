<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarPanelProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		/** Heading of the mobile sheet, which has no other label. */
		mobileTitle?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import Dialog from '../dialog/Dialog.svelte';
	import DialogBackdrop from '../dialog/DialogBackdrop.svelte';
	import DialogContent from '../dialog/DialogContent.svelte';
	import DialogPositioner from '../dialog/DialogPositioner.svelte';
	import DialogTitle from '../dialog/DialogTitle.svelte';
	import splitterStyles from '../splitter/Splitter.module.css';
	import { useSplitterContext } from '../splitter/splitter.state.svelte';
	import styles from './Sidebar.module.css';
	import { useSidebarContext } from './sidebar.state.svelte';

	let {
		asChild,
		children,
		class: className,
		mobileTitle,
		ref = $bindable(null),
		...props
	}: SidebarPanelProps = $props();

	const api = useSidebarContext();
	const splitter = useSplitterContext();
	const attrs = $derived(api.mobile ? api.panelAttrs() : splitter.panelAttrs(api.panelId));
</script>

{#if api.mobile}
	<Dialog
		open={api.open}
		aria-label={mobileTitle}
		modal
		onOpenChange={(details) => api.setOpen(details.open)}
	>
		<DialogBackdrop />
		<DialogPositioner>
			<DialogContent class={cn(styles.panel, className)}>
				{#if mobileTitle}
					<DialogTitle>{mobileTitle}</DialogTitle>
				{/if}
				<div
					{...attrs}
					data-scope="sidebar"
					data-part="panel"
					data-slot="sidebar-panel"
					class={styles.panel}
				>
					{@render children?.()}
				</div>
			</DialogContent>
		</DialogPositioner>
	</Dialog>
{:else}
	<Element
		as="div"
		{...props}
		{...attrs}
		style={mergeStyleDeclarations(attrs.style, props.style)}
		bind:ref
		{asChild}
		data-scope="sidebar"
		data-part="panel"
		data-slot="sidebar-panel"
		data-side={api.side}
		data-state={api.state}
		data-collapsible={api.collapsible}
		class={cn(splitterStyles.panel, styles.panel, className)}
	>
		{@render children?.()}
	</Element>
{/if}
