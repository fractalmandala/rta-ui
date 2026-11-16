<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DialogCloseTriggerProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useDialogContext } from './dialog.state.svelte';

	let {
		asChild,
		children,
		ref = $bindable(null),
		...props
	}: DialogCloseTriggerProps = $props();

	const api = useDialogContext();
	const attrs = $derived(api.closeTriggerAttrs());

	$effect(() => {
		api.registerCloseTrigger(ref);
		return () => api.registerCloseTrigger(null);
	});
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="dialog"
	data-part="close-trigger"
	data-slot="dialog-close-trigger"
>
	{@render children?.()}
</Element>
