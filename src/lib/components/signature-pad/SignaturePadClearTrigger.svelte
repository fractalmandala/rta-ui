<script module lang="ts">
	import type { CloseButtonProps } from '../close-button/CloseButton.svelte';

	export interface SignaturePadClearTriggerProps extends CloseButtonProps {}
</script>

<script lang="ts">
	import { cn } from '../../internal/cn.js';
	import CloseButton from '../close-button/CloseButton.svelte';
	import styles from './SignaturePad.module.css';
	import { useSignaturePadContext } from './signature-pad.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: SignaturePadClearTriggerProps = $props();

	const api = useSignaturePadContext();
	const attrs = $derived(api.clearTriggerAttrs());
</script>

<!-- Zag merges its label, anatomy and state props onto the clear trigger; the label travels in
     `attrs` so the shared CloseButton keeps its own default guard and icon. -->
<CloseButton
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	class={cn(styles.clearTrigger, className)}
	data-scope="signature-pad"
	data-part="clear-trigger"
	data-slot="signature-pad-clear-trigger"
>
	{@render children?.()}
</CloseButton>
