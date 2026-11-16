<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PopoverContentProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
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
		ref = $bindable(null),
		...props
	}: PopoverContentProps = $props();

	const api = usePopoverContext();

	$effect(() => {
		const element = ref as HTMLElement | null;
		if (!element) return;
		api.setContentNode(element);
		return () => api.setContentNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.contentId}
	dir={api.dir}
	tabindex={-1}
	role="dialog"
	aria-modal={api.modal ? true : undefined}
	hidden={api.hidden}
	data-scope="popover"
	data-part="content"
	data-state={api.dataState}
	data-expanded={dataAttr(api.open)}
	aria-labelledby={api.hasTitle ? api.titleId : undefined}
	aria-describedby={api.hasDescription ? api.descriptionId : undefined}
	data-placement={api.placement}
	data-side={api.side}
	data-slot="popover-content"
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
