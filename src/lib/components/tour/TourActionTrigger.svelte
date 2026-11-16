<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { TourStepAction } from './tour.state.svelte';

	export interface TourActionTriggerProps
		extends HTMLProps<'button'>,
			Omit<PolymorphicProps<'button'>, 'type' | 'disabled'>,
			RefAttribute<HTMLButtonElement> {
		action: TourStepAction;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Tour.module.css';
	import { useTourContext } from './tour.state.svelte';

	let { action, asChild, children, class: className, onclick, ref = $bindable(null), ...props }: TourActionTriggerProps =
		$props();

	const api = useTourContext();
	const attrs = $derived(api.actionTriggerAttrs(action));
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	type="button"
	data-scope="tour"
	data-part="action-trigger"
	data-slot="tour-action-trigger"
	{...attrs}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		attrs.onclick(event);
	}}
	class={cn(!asChild && styles.actionTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{action.label}
	{/if}
</Element>
