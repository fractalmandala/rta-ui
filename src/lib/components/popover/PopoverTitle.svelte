<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PopoverTitleProps
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
	}: PopoverTitleProps = $props();

	const api = usePopoverContext();

	$effect(() => {
		const element = ref as HTMLElement | null;
		if (!element) return;
		api.setTitleNode(element);
		return () => api.setTitleNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.titleId}
	dir={api.dir}
	data-scope="popover"
	data-part="title"
	data-slot="popover-title"
	class={cn(styles.title, className)}
>
	{@render children?.()}
</Element>
