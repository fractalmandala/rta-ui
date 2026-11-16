<script module lang="ts">
	import type { DialogPositionerProps } from '../dialog/DialogPositioner.svelte';

	export interface LightboxPositionerProps extends DialogPositionerProps {}
</script>

<script lang="ts">
	import DialogPositioner from '../dialog/DialogPositioner.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Lightbox.module.css';

	let { class: className, ref = $bindable(null), ...props }: LightboxPositionerProps = $props();
</script>

<DialogPositioner {...props} bind:ref class={cn(styles.positioner, className)} data-slot="lightbox-positioner" data-lightbox-slot="positioner" />
