<script module lang="ts">
	import type { DialogCloseTriggerProps } from '../dialog/DialogCloseTrigger.svelte';

	export interface LightboxCloseTriggerProps extends DialogCloseTriggerProps {}
</script>

<script lang="ts">
	import DialogCloseTrigger from '../dialog/DialogCloseTrigger.svelte';

	let { class: className, ref = $bindable(null), ...props }: LightboxCloseTriggerProps = $props();
</script>

<DialogCloseTrigger {...props} bind:ref class={className} data-slot="lightbox-close-trigger" data-lightbox-slot="close-trigger" />
