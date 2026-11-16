<script module lang="ts">
	import type { DialogTriggerProps } from '../dialog/DialogTrigger.svelte';

	export interface LightboxTriggerProps extends DialogTriggerProps {}
</script>

<script lang="ts">
	import DialogTrigger from '../dialog/DialogTrigger.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Lightbox.module.css';

	let { class: className, ref = $bindable(null), ...props }: LightboxTriggerProps = $props();
</script>

<DialogTrigger {...props} bind:ref class={cn(styles.trigger, className)} data-slot="lightbox-trigger" data-lightbox-slot="trigger" />
