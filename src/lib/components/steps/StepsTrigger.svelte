<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface StepsTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {}
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
	}: StepsTriggerProps = $props();

	const api = useStepsContext();
	const index = useStepsItemIndexContext();
	const attrs = $derived(api.triggerAttrs(index()));
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="steps"
	data-part="trigger"
	data-slot="steps-trigger"
	class={cn(styles.trigger, className)}
>
	{@render children?.()}
</Element>
