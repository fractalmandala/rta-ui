<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ProgressCircularCircleProps
		extends HTMLProps<'svg'>, PolymorphicProps<'svg'>, RefAttribute {
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
	}: ProgressCircularCircleProps = $props();

	const api = useProgressContext();
	const attrs = $derived(api.circleAttrs());
</script>

<Element
	as="svg"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="progress"
	data-part="circle"
	data-slot="progress-circular-circle"
	class={cn(styles.circle, className)}
>
	{@render children?.()}
</Element>
