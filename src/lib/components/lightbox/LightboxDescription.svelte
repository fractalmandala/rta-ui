<script module lang="ts">
	import type { DialogDescriptionProps } from '../dialog/DialogDescription.svelte';

	export interface LightboxDescriptionProps extends DialogDescriptionProps {}
</script>

<script lang="ts">
	import DialogDescription from '../dialog/DialogDescription.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Lightbox.module.css';

	let { class: className, ref = $bindable(null), ...props }: LightboxDescriptionProps = $props();
</script>

<DialogDescription
	{...props}
	bind:ref
	class={cn(styles.description, className)}
	data-slot="lightbox-description"
	data-lightbox-slot="description"
/>
