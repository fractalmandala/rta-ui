<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AccordionItemContentProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { createPanelMotion } from '../../internal/panel-motion.svelte.js';
	import styles from './Accordion.module.css';
	import { useAccordionContext, useAccordionItemContext } from './accordion.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: AccordionItemContentProps =
		$props();

	const accordion = useAccordionContext();
	const item = useAccordionItemContext();
	let node = $state<globalThis.Element | null>(null);

	const motion = createPanelMotion({
		getOpen: () => item.expanded,
		getNode: () => node as HTMLElement | null
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref={node}
	{asChild}
	role="region"
	id={accordion.itemContentId(item.value)}
	dir={accordion.dir}
	aria-labelledby={accordion.itemTriggerId(item.value)}
	hidden={motion.hidden}
	inert={motion.inert ? true : undefined}
	data-scope="accordion"
	data-part="item-content"
	data-state={item.expanded ? 'open' : 'closed'}
	data-focus={dataAttr(item.focused)}
	data-disabled={dataAttr(item.disabled)}
	data-orientation={item.orientation}
	data-slot="accordion-item-content"
	class={cn(styles.itemContent, className)}
>
	{@render children?.()}
</Element>
