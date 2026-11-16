<script module lang="ts">
	import type { FloatingPanelCloseTriggerProps } from './FloatingPanelCloseTrigger.svelte';

	export interface FloatingPanelCloseIconProps
		extends Omit<FloatingPanelCloseTriggerProps, 'asChild'> {}
</script>

<script lang="ts">
	import { a11yLabels } from '../../internal/a11yLabels.js';
	import { cn } from '../../internal/cn.js';
	import CloseButton from '../close-button/CloseButton.svelte';
	import styles from './FloatingPanel.module.css';
	import { useFloatingPanelContext } from './floating-panel.state.svelte';

	let {
		children,
		class: className,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		...props
	}: FloatingPanelCloseIconProps = $props();

	const api = useFloatingPanelContext();
	const attrs = $derived(api.closeTriggerAttrs());
</script>

<CloseButton
	{...props}
	{...attrs}
	bind:ref
	aria-label={ariaLabel ?? a11yLabels.closePanel}
	data-scope="floating-panel"
	data-part="close-trigger"
	data-slot="floating-panel-close-icon"
	class={cn(styles.controlButton, className)}
>
	{@render children?.()}
</CloseButton>
