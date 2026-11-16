<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface HoverCardArrowTipProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './HoverCard.module.css';
	import { useHoverCardContext } from './hover-card.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: HoverCardArrowTipProps = $props();

	const api = useHoverCardContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	data-scope="hover-card"
	data-part="arrow-tip"
	data-slot="hover-card-arrow-tip"
	style={mergeStyleDeclarations(api.arrowTipStyle, style)}
	class={cn(styles.arrowTip, className)}
>
	{@render children?.()}
</Element>
