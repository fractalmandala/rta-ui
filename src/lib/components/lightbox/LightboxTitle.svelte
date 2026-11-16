<script module lang="ts">
	import type { DialogTitleProps } from '../dialog/DialogTitle.svelte';

	export interface LightboxTitleProps extends DialogTitleProps {}
</script>

<script lang="ts">
	import DialogTitle from '../dialog/DialogTitle.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Lightbox.module.css';

	let { class: className, ref = $bindable(null), ...props }: LightboxTitleProps = $props();
</script>

<DialogTitle {...props} bind:ref class={cn(styles.title, className)} data-slot="lightbox-title" data-lightbox-slot="title" />
