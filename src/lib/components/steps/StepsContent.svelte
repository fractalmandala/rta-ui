<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface StepsContentProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		index: number;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Steps.module.css';
	import { useStepsContext } from './steps.state.svelte';

	let {
		asChild,
		children,
		class: className,
		index,
		ref = $bindable(null),
		...props
	}: StepsContentProps = $props();

	const api = useStepsContext();
	const attrs = $derived(api.contentAttrs(index));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="steps"
	data-part="content"
	data-slot="steps-content"
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
