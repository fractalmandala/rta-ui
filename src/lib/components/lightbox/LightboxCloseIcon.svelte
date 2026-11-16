<script module lang="ts">
	import type { DialogCloseIconProps } from '../dialog/DialogCloseIcon.svelte';

	export interface LightboxCloseIconProps extends DialogCloseIconProps {}
</script>

<script lang="ts">
	import DialogCloseIcon from '../dialog/DialogCloseIcon.svelte';
	import { a11yLabels } from '../../internal/a11yLabels.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Lightbox.module.css';

	let {
		class: className,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		...props
	}: LightboxCloseIconProps = $props();
</script>

<DialogCloseIcon
	{...props}
	bind:ref
	aria-label={typeof ariaLabel === 'string' ? ariaLabel : a11yLabels.closeImage}
	class={cn(styles.closeIcon, className)}
	data-slot="lightbox-close-icon"
	data-lightbox-slot="close-icon"
/>
