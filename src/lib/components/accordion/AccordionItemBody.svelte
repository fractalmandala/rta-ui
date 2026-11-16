<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AccordionItemBodyProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Accordion.module.css';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: AccordionItemBodyProps =
		$props();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-scope="accordion"
	data-part="item-body"
	data-slot="accordion-item-body"
	class={cn(styles.itemBody, className)}
>
	{@render children?.()}
</Element>
