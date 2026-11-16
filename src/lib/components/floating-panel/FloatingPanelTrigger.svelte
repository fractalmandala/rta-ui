<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FloatingPanelTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useFloatingPanelContext } from './floating-panel.state.svelte';

	let {
		asChild,
		children,
		ref = $bindable(null),
		...props
	}: FloatingPanelTriggerProps = $props();

	const api = useFloatingPanelContext();
	const attrs = $derived(api.triggerAttrs());

	$effect(() => {
		const element = ref as HTMLElement | null;
		if (!element) return;
		api.setTriggerNode(element);
		return () => api.setTriggerNode(null);
	});
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="floating-panel"
	data-part="trigger"
	data-slot="floating-panel-trigger"
>
	{@render children?.()}
</Element>
