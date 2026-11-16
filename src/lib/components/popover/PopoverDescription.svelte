<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PopoverDescriptionProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Popover.module.css';
	import { usePopoverContext } from './popover.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: PopoverDescriptionProps = $props();

	const api = usePopoverContext();

	$effect(() => {
		const element = ref as HTMLElement | null;
		if (!element) return;
		api.setDescriptionNode(element);
		return () => api.setDescriptionNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.descriptionId}
	dir={api.dir}
	data-scope="popover"
	data-part="description"
	data-slot="popover-description"
	class={cn(styles.description, className)}
>
	{@render children?.()}
</Element>
