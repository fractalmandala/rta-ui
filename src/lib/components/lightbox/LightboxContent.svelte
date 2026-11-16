<script module lang="ts">
	import type { DialogContentProps } from '../dialog/DialogContent.svelte';

	export interface LightboxContentProps extends DialogContentProps {}
</script>

<script lang="ts">
	import DialogContent from '../dialog/DialogContent.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Lightbox.module.css';

	let { class: className, ref = $bindable(null), ...props }: LightboxContentProps = $props();
</script>

<DialogContent {...props} bind:ref class={cn(styles.content, className)} data-slot="lightbox-content" data-lightbox-slot="content" />
