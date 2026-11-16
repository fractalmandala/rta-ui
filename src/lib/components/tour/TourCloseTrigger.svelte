<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TourCloseTriggerProps
		extends HTMLProps<'button'>,
			Omit<PolymorphicProps<'button'>, 'type'>,
			RefAttribute<HTMLButtonElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { useTourContext } from './tour.state.svelte';

	let {
		asChild,
		children,
		class: className,
		'data-slot': dataSlot = 'tour-close-trigger',
		onclick,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		...props
	}: TourCloseTriggerProps = $props();

	const api = useTourContext();
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	type="button"
	data-scope="tour"
	data-part="close-trigger"
	data-type={api.step?.type}
	data-slot={dataSlot}
	aria-label={ariaLabel ?? api.closeLabel}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.dismiss();
	}}
	class={cn(className)}
>
	{@render children?.()}
</Element>
