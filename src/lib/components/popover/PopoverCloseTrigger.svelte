<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PopoverCloseTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Popover.module.css';
	import { usePopoverContext } from './popover.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onclick,
		ref = $bindable(null),
		...props
	}: PopoverCloseTriggerProps = $props();

	const api = usePopoverContext();
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	id={api.closeTriggerId}
	dir={api.dir}
	type="button"
	aria-label={api.closeTriggerLabel}
	data-scope="popover"
	data-part="close-trigger"
	data-slot="popover-close-trigger"
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		event.stopPropagation();
		api.setOpen(false);
	}}
	class={cn(!asChild && styles.closeTrigger, className)}
>
	{@render children?.()}
</Element>
