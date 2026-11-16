<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AccordionItemProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import styles from './Accordion.module.css';
	import type { AccordionItemApi } from './accordion.state.svelte';
	import { setAccordionItemContext, useAccordionContext } from './accordion.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled,
		ref = $bindable(null),
		value,
		...props
	}: AccordionItemProps = $props();

	const accordion = useAccordionContext();

	const item: AccordionItemApi = {
		get value() {
			return value;
		},
		get disabled() {
			return accordion.isItemDisabled(value, disabled);
		},
		get expanded() {
			return accordion.isExpanded(value);
		},
		get focused() {
			return accordion.isFocused(value);
		},
		get orientation() {
			return accordion.orientation;
		}
	};
	setAccordionItemContext(item);
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={accordion.itemId(value)}
	dir={accordion.dir}
	data-scope="accordion"
	data-part="item"
	data-state={item.expanded ? 'open' : 'closed'}
	data-focus={dataAttr(item.focused)}
	data-disabled={dataAttr(item.disabled)}
	data-orientation={item.orientation}
	data-slot="accordion-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
