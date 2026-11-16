<script module lang="ts">
	import type { PopoverCloseTriggerProps } from './PopoverCloseTrigger.svelte';

	export interface PopoverCloseIconProps extends Omit<PopoverCloseTriggerProps, 'asChild'> {}
</script>

<script lang="ts">
	import { a11yLabels } from '../../internal/a11yLabels.js';
	import { cn } from '../../internal/cn.js';
	import CloseButton from '../close-button/CloseButton.svelte';
	import styles from './Popover.module.css';
	import { usePopoverContext } from './popover.state.svelte';

	let {
		children,
		class: className,
		onclick,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		...props
	}: PopoverCloseIconProps = $props();

	const api = usePopoverContext();
</script>

<CloseButton
	{...props}
	bind:ref
	id={api.closeTriggerId}
	aria-label={ariaLabel ?? a11yLabels.closePopover}
	data-scope="popover"
	data-part="close-trigger"
	data-slot="popover-close-icon"
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		event.stopPropagation();
		api.setOpen(false);
	}}
	class={cn(styles.closeIcon, className)}
>
	{@render children?.()}
</CloseButton>
