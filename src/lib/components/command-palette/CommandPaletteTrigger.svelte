<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteTriggerProps
		extends HTMLProps<'button'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useCommandPaletteContext } from './command-palette.state.svelte';

	let { asChild, children, ref = $bindable(null), ...props }: CommandPaletteTriggerProps = $props();

	const api = useCommandPaletteContext();
	const attrs = $derived(api.triggerAttrs());

	$effect(() => {
		api.registerTrigger(ref);
		return () => api.registerTrigger(null);
	});
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="trigger"
	data-slot="command-palette-trigger"
>
	{@render children?.()}
</Element>
