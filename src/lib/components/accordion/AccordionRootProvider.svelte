<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { AccordionApi } from './accordion.state.svelte';

	export interface AccordionRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: AccordionApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Accordion.module.css';
	import { setAccordionContext } from './accordion.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: AccordionRootProviderProps = $props();

	const api = untrack(() => value);
	setAccordionContext(api);
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.rootId}
	dir={api.dir}
	data-scope="accordion"
	data-part="root"
	data-orientation={api.orientation}
	data-slot="accordion-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
