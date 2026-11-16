<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PopoverIndicatorProps
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
	}: PopoverIndicatorProps = $props();

	const api = usePopoverContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	data-scope="popover"
	data-part="indicator"
	data-state={api.open ? 'open' : 'closed'}
	data-slot="popover-indicator"
	class={className}
>
	{@render children?.()}
</Element>
