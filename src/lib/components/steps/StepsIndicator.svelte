<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface StepsIndicatorProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Steps.module.css';
	import { useStepsContext, useStepsItemIndexContext } from './steps.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: StepsIndicatorProps = $props();

	const api = useStepsContext();
	const index = useStepsItemIndexContext();
	const attrs = $derived(api.indicatorAttrs(index()));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="steps"
	data-part="indicator"
	data-slot="steps-indicator"
	class={cn(styles.indicator, className)}
>
	{@render children?.()}
</Element>
