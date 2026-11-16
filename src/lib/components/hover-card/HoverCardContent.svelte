<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface HoverCardContentProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './HoverCard.module.css';
	import { useHoverCardContext } from './hover-card.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onpointerenter,
		onpointerleave,
		ref = $bindable(null),
		...props
	}: HoverCardContentProps = $props();

	const api = useHoverCardContext();

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
	hidden={api.hidden}
	data-scope="hover-card"
	data-part="content"
	data-state={api.dataState}
	data-placement={api.placement}
	data-side={api.side}
	data-slot="hover-card-content"
	onpointerenter={(event) => {
		onpointerenter?.(event);
		if (event.pointerType === 'touch') return;
		api.handleContentPointerEnter();
	}}
	onpointerleave={(event) => {
		onpointerleave?.(event);
		if (event.pointerType === 'touch') return;
		api.handleContentPointerLeave();
	}}
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
