<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PopoverTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {
		value?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import styles from './Popover.module.css';
	import { usePopoverContext } from './popover.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onclick,
		ref = $bindable(null),
		value,
		...props
	}: PopoverTriggerProps = $props();

	const api = usePopoverContext();
	const current = $derived(value == null ? false : api.triggerValue === value);

	$effect(() => {
		const element = ref as HTMLElement | null;
		if (!element) return;
		return api.registerTrigger(value ?? null, element);
	});
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	type="button"
	id={api.triggerId(value)}
	dir={api.dir}
	data-scope="popover"
	data-part="trigger"
	data-placement={api.placement}
	data-side={api.side}
	data-ownedby={api.id}
	data-value={value}
	data-current={dataAttr(current)}
	aria-haspopup="dialog"
	aria-expanded={value == null ? api.open : api.open && current}
	data-state={api.open ? 'open' : 'closed'}
	aria-controls={api.contentId}
	data-slot="popover-trigger"
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.toggleTrigger(value);
	}}
	class={cn(styles.trigger, className)}
>
	{@render children?.()}
</Element>
