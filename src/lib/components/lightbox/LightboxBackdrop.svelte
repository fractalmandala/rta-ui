<script module lang="ts">
	import type { DialogBackdropProps } from '../dialog/DialogBackdrop.svelte';

	export interface LightboxBackdropProps extends DialogBackdropProps {}
</script>

<script lang="ts">
	import DialogBackdrop from '../dialog/DialogBackdrop.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Lightbox.module.css';

	let { class: className, ref = $bindable(null), ...props }: LightboxBackdropProps = $props();
</script>

<DialogBackdrop {...props} bind:ref class={cn(styles.backdrop, className)} data-slot="lightbox-backdrop" data-lightbox-slot="backdrop" />
