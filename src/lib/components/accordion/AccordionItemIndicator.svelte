<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AccordionItemIndicatorProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { ChevronDownIcon } from '../../internal/icons/index.js';
	import styles from './Accordion.module.css';
	import { useAccordionContext, useAccordionItemContext } from './accordion.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: AccordionItemIndicatorProps =
		$props();

	const accordion = useAccordionContext();
	const item = useAccordionItemContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	dir={accordion.dir}
	aria-hidden="true"
	data-scope="accordion"
	data-part="item-indicator"
	data-state={item.expanded ? 'open' : 'closed'}
	data-focus={dataAttr(item.focused)}
	data-disabled={dataAttr(item.disabled)}
	data-orientation={item.orientation}
	data-slot="accordion-item-indicator"
	class={cn(styles.itemIndicator, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<ChevronDownIcon />
	{/if}
</Element>
