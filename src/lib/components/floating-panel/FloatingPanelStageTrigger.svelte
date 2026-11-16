<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { FloatingPanelStage } from './floating-panel.state.svelte';

	export interface FloatingPanelStageTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		stage: FloatingPanelStage;
	}
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
		stage,
		...props
	}: FloatingPanelStageTriggerProps = $props();

	const api = useFloatingPanelContext();
	const attrs = $derived(api.stageTriggerAttrs({ stage }));
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="floating-panel"
	data-part="stage-trigger"
	data-slot="floating-panel-stage-trigger"
	class={cn(!asChild && styles.controlButton, className)}
>
	{#if children}
		{@render children()}
	{:else if !asChild}
		{#if stage === 'minimized'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				focusable="false"
			>
				<path d="M5 12h14" />
			</svg>
		{:else if stage === 'maximized'}
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
				<polyline points="15 3 21 3 21 9" />
				<polyline points="9 21 3 21 3 15" />
				<line x1="21" x2="14" y1="3" y2="10" />
				<line x1="3" x2="10" y1="21" y2="14" />
			</svg>
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
				<rect width="14" height="14" x="3" y="3" rx="2" />
				<path d="M7 21h10a2 2 0 0 0 2-2V9" />
			</svg>
		{/if}
	{/if}
</Element>
