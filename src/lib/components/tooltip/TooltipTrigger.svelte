<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TooltipTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {
		value?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import styles from './Tooltip.module.css';
	import { useTooltipContext } from './tooltip.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onblur,
		onclick,
		onfocus,
		onpointerdown,
		onpointerenter,
		onpointerleave,
		onpointermove,
		ref = $bindable(null),
		value,
		...props
	}: TooltipTriggerProps = $props();

	const api = useTooltipContext();
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
	type={asChild ? undefined : 'button'}
	id={api.triggerId(value)}
	dir={api.dir}
	data-scope="tooltip"
	data-part="trigger"
	data-ownedby={api.id}
	data-value={value}
	data-current={dataAttr(current)}
	data-expanded={dataAttr(api.open)}
	data-state={api.open ? 'open' : 'closed'}
	aria-describedby={api.open ? api.contentId : undefined}
	data-slot="tooltip-trigger"
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.handleTriggerClick(value);
	}}
	onfocus={(event) => {
		onfocus?.(event);
		if (event.defaultPrevented) return;
		api.handleTriggerFocus(value);
	}}
	onblur={(event) => {
		onblur?.(event);
		if (event.defaultPrevented) return;
		api.handleTriggerBlur(event.relatedTarget);
	}}
	onpointerdown={(event) => {
		onpointerdown?.(event);
		if (event.defaultPrevented) return;
		if (event.button !== 0) return;
		api.handleTriggerPointerDown(value);
	}}
	onpointermove={(event) => {
		onpointermove?.(event);
		if (event.defaultPrevented) return;
		if (event.pointerType === 'touch') return;
		api.handleTriggerPointerMove(value);
	}}
	onpointerenter={(event) => {
		onpointerenter?.(event);
		if (event.defaultPrevented) return;
		if (event.pointerType === 'touch') return;
		api.handleTriggerPointerMove(value);
	}}
	onpointerleave={() => {
		api.handleTriggerPointerLeave();
	}}
	onpointercancel={() => {
		api.handleTriggerPointerLeave();
	}}
	class={cn(!asChild && styles.trigger, className)}
>
	{@render children?.()}
</Element>
