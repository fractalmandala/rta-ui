<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PopoverAnchorProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { usePopoverContext } from './popover.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: PopoverAnchorProps = $props();

	const api = usePopoverContext();

	$effect(() => {
		const element = ref as HTMLElement | null;
		if (!element) return;
		api.setAnchorNode(element);
		return () => api.setAnchorNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.anchorId}
	dir={api.dir}
	data-scope="popover"
	data-part="anchor"
	data-slot="popover-anchor"
	class={className}
>
	{@render children?.()}
</Element>
