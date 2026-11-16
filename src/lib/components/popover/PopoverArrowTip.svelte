<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PopoverArrowTipProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Popover.module.css';
	import { usePopoverContext } from './popover.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: PopoverArrowTipProps = $props();

	const api = usePopoverContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	data-scope="popover"
	data-part="arrow-tip"
	data-slot="popover-arrow-tip"
	style={mergeStyleDeclarations(api.arrowTipStyle, style)}
	class={cn(styles.arrowTip, className)}
>
	{@render children?.()}
</Element>
