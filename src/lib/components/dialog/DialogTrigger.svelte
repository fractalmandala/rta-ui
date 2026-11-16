<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DialogTriggerProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		/** Identifies this trigger when one dialog has several. */
		value?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useDialogContext } from './dialog.state.svelte';

	let {
		asChild,
		children,
		ref = $bindable(null),
		value,
		...props
	}: DialogTriggerProps = $props();

	const api = useDialogContext();
	const attrs = $derived(api.triggerAttrs({ value }));

	$effect(() => {
		api.registerTrigger(ref, value);
		return () => api.registerTrigger(null, value);
	});
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="dialog"
	data-part="trigger"
	data-slot="dialog-trigger"
>
	{@render children?.()}
</Element>
