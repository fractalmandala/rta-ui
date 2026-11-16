<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseAccordionProps } from './accordion.state.svelte';

	export interface AccordionRootProps
		extends UseAccordionProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Accordion.module.css';
	import { createAccordion, setAccordionContext } from './accordion.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onValueChange,
		ref = $bindable(null),
		value = $bindable(),
		...props
	}: AccordionRootProps = $props();

	const uid = $props.id();
	const api = createAccordion(
		() => ({
			...props,
			value,
			onValueChange(details) {
				onValueChange?.(details);
				if (value !== undefined) value = details.value;
			}
		}),
		uid
	);
	setAccordionContext(api);

	let node = $state<globalThis.Element | null>(null);
	$effect(() => {
		api.registerRoot(node as HTMLElement | null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref={node}
	{asChild}
	id={api.rootId}
	dir={api.dir}
	data-scope="accordion"
	data-part="root"
	data-orientation={api.orientation}
	data-slot="accordion-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
