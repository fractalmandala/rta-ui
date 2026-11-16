<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ProgressCircularCircleRangeProps
		extends HTMLProps<'circle'>, PolymorphicProps<'circle'>, RefAttribute {
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ProgressCircular.module.css';
	import { useProgressContext } from '../progress/progress.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ProgressCircularCircleRangeProps = $props();

	const api = useProgressContext();
	const attrs = $derived(api.circleRangeAttrs());
</script>

<Element
	as="circle"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="progress"
	data-part="circle-range"
	data-slot="progress-circular-circle-range"
	class={cn(styles.circleRange, className)}
>
	{@render children?.()}
</Element>
