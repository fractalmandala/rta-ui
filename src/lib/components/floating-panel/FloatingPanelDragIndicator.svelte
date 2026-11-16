<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FloatingPanelDragIndicatorProps
		extends Omit<HTMLProps<'span'>, 'aria-hidden'>,
			PolymorphicProps<'span'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './FloatingPanel.module.css';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: FloatingPanelDragIndicatorProps = $props();
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	aria-hidden="true"
	data-scope="floating-panel"
	data-part="drag-indicator"
	data-slot="floating-panel-drag-indicator"
	class={cn(styles.dragIndicator, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			focusable="false"
		>
			<circle cx="12" cy="5" r="1" />
			<circle cx="19" cy="5" r="1" />
			<circle cx="5" cy="5" r="1" />
			<circle cx="12" cy="12" r="1" />
			<circle cx="19" cy="12" r="1" />
			<circle cx="5" cy="12" r="1" />
			<circle cx="12" cy="19" r="1" />
			<circle cx="19" cy="19" r="1" />
			<circle cx="5" cy="19" r="1" />
		</svg>
	{/if}
</Element>
