<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PopoverArrowProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { arrowStyle } from '../../internal/positioning.svelte.js';
	import styles from './Popover.module.css';
	import { usePopoverContext } from './popover.state.svelte';
	import PopoverArrowTip from './PopoverArrowTip.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: PopoverArrowProps = $props();

	const api = usePopoverContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.arrowId}
	dir={api.dir}
	data-scope="popover"
	data-part="arrow"
	data-slot="popover-arrow"
	style={mergeStyleDeclarations(arrowStyle, style)}
	class={cn(styles.arrow, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<PopoverArrowTip />
	{/if}
</Element>
