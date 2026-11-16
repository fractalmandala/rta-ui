<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface HoverCardTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {
		value?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import styles from './HoverCard.module.css';
	import { useHoverCardContext } from './hover-card.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onblur,
		onfocus,
		onpointerenter,
		onpointerleave,
		ref = $bindable(null),
		value,
		...props
	}: HoverCardTriggerProps = $props();

	const api = useHoverCardContext();
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
	data-scope="hover-card"
	data-part="trigger"
	data-placement={api.placement}
	data-side={api.side}
	data-ownedby={api.id}
	data-value={value}
	data-current={dataAttr(current)}
	data-state={api.open ? 'open' : 'closed'}
	data-slot="hover-card-trigger"
	onpointerenter={(event) => {
		onpointerenter?.(event);
		if (event.defaultPrevented) return;
		if (event.pointerType === 'touch') return;
		api.handleTriggerPointerEnter(value);
	}}
	onpointerleave={(event) => {
		onpointerleave?.(event);
		if (event.defaultPrevented) return;
		if (event.pointerType === 'touch') return;
		api.handleTriggerPointerLeave();
	}}
	onfocus={(event) => {
		onfocus?.(event);
		if (event.defaultPrevented) return;
		api.handleTriggerFocus(value);
	}}
	onblur={(event) => {
		onblur?.(event);
		if (event.defaultPrevented) return;
		api.handleTriggerBlur();
	}}
	class={cn(!asChild && styles.trigger, className)}
>
	{@render children?.()}
</Element>
