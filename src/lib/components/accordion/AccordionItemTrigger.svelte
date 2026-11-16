<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AccordionItemTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import styles from './Accordion.module.css';
	import { useAccordionContext, useAccordionItemContext } from './accordion.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onblur,
		onclick,
		onfocus,
		onkeydown,
		ref = $bindable(null),
		...props
	}: AccordionItemTriggerProps = $props();

	const accordion = useAccordionContext();
	const item = useAccordionItemContext();
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	type="button"
	id={accordion.itemTriggerId(item.value)}
	dir={accordion.dir}
	disabled={item.disabled}
	aria-controls={accordion.itemContentId(item.value)}
	aria-expanded={item.expanded}
	data-controls={accordion.itemContentId(item.value)}
	data-ownedby={accordion.rootId}
	data-scope="accordion"
	data-part="item-trigger"
	data-state={item.expanded ? 'open' : 'closed'}
	data-focus={dataAttr(item.focused)}
	data-disabled={dataAttr(item.disabled)}
	data-orientation={item.orientation}
	data-slot="accordion-item-trigger"
	onfocus={(event) => {
		onfocus?.(event);
		accordion.focusItem(item.value, item.disabled);
	}}
	onblur={(event) => {
		onblur?.(event);
		accordion.blurItem();
	}}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		accordion.toggleItem(item.value, item.disabled);
	}}
	onkeydown={(event) => {
		onkeydown?.(event);
		if (event.defaultPrevented) return;
		const horizontal = accordion.orientation === 'horizontal';
		const moves = {
			ArrowDown: horizontal ? undefined : 'next',
			ArrowUp: horizontal ? undefined : 'prev',
			ArrowRight: horizontal ? 'next' : undefined,
			ArrowLeft: horizontal ? 'prev' : undefined,
			Home: 'first',
			End: 'last'
		} as const;
		const move = moves[event.key as keyof typeof moves];
		if (!move) return;
		event.preventDefault();
		accordion.moveFocus(item.value, move, item.disabled);
	}}
	class={cn(styles.itemTrigger, className)}
>
	{@render children?.()}
</Element>
