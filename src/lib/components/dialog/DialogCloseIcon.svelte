<script module lang="ts">
	import type { DialogCloseTriggerProps } from './DialogCloseTrigger.svelte';

	export interface DialogCloseIconProps extends Omit<DialogCloseTriggerProps, 'asChild' | 'class'> {
		class?: string;
	}
</script>

<script lang="ts">
	import CloseButton from '../close-button/CloseButton.svelte';
	import { a11yLabels } from '../../internal/a11yLabels.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Dialog.module.css';
	import { useDialogContext } from './dialog.state.svelte';

	let {
		class: className,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		...props
	}: DialogCloseIconProps = $props();

	const api = useDialogContext();
	const attrs = $derived(api.closeTriggerAttrs());

	$effect(() => {
		api.registerCloseTrigger(ref);
		return () => api.registerCloseTrigger(null);
	});
</script>

<CloseButton
	{...props}
	{...attrs}
	bind:ref
	aria-label={ariaLabel ?? a11yLabels.closeDialog}
	data-scope="dialog"
	data-part="close-trigger"
	data-slot="dialog-close-icon"
	class={cn(styles.closeIcon, className)}
/>
