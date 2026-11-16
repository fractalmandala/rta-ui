<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TooltipContentProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Tooltip.module.css';
	import { useTooltipContext } from './tooltip.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		onpointerenter,
		onpointerleave,
		...props
	}: TooltipContentProps = $props();

	const api = useTooltipContext();

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
	role="tooltip"
	aria-label={api.ariaLabel}
	hidden={api.hidden}
	data-scope="tooltip"
	data-part="content"
	data-state={api.dataState}
	data-instant={dataAttr(api.instant)}
	data-placement={api.placement}
	data-side={api.side}
	data-slot="tooltip-content"
	style={mergeStyleDeclarations(
		`pointer-events: ${api.interactive ? 'auto' : 'none'};`,
		style
	)}
	onpointerenter={(event) => {
		onpointerenter?.(event);
		api.handleContentPointerEnter();
	}}
	onpointerleave={(event) => {
		onpointerleave?.(event);
		api.handleContentPointerLeave();
	}}
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
