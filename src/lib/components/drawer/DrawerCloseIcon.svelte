<script module lang="ts">
	import type { DrawerCloseTriggerProps } from './DrawerCloseTrigger.svelte';

	export interface DrawerCloseIconProps extends Omit<DrawerCloseTriggerProps, 'asChild' | 'class'> {
		class?: string;
	}
</script>

<script lang="ts">
	import CloseButton from '../close-button/CloseButton.svelte';
	import { a11yLabels } from '../../internal/a11yLabels.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Drawer.module.css';
	import { useDrawerContext } from './drawer.state.svelte';

	let {
		class: className,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		...props
	}: DrawerCloseIconProps = $props();

	const api = useDrawerContext();
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
	aria-label={ariaLabel ?? a11yLabels.closeDrawer}
	data-scope="drawer"
	data-part="close-trigger"
	data-slot="drawer-close-icon"
	class={cn(styles.closeIcon, className)}
/>
