<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ProgressLinearLabelProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ProgressLinear.module.css';
	import { useProgressContext } from '../progress/progress.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ProgressLinearLabelProps = $props();

	const api = useProgressContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="progress"
	data-part="label"
	data-slot="progress-linear-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
