<script module lang="ts">
	import type { TourCloseTriggerProps } from './TourCloseTrigger.svelte';

	export type TourCloseIconProps = Omit<TourCloseTriggerProps, 'asChild'>;
</script>

<script lang="ts">
	import { cn } from '../../internal/cn.js';
	import { CloseIcon } from '../../internal/icons/index.js';
	import styles from './Tour.module.css';
	import TourCloseTrigger from './TourCloseTrigger.svelte';

	let {
		children,
		class: className,
		'aria-label': ariaLabel = undefined,
		...props
	}: TourCloseIconProps = $props();
</script>

<TourCloseTrigger {...props} aria-label={ariaLabel} data-slot="tour-close-icon" class={cn(styles.closeIcon, className)}>
	{#if children}
		{@render children()}
	{:else}
		<CloseIcon width="16" height="16" />
	{/if}
</TourCloseTrigger>
