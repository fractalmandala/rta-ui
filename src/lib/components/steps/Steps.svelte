<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseStepsProps } from './steps.state.svelte';

	export interface StepsRootProps
		extends UseStepsProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Steps.module.css';
	import { createSteps, setStepsContext } from './steps.state.svelte';

	let {
		asChild,
		children,
		class: className,
		count,
		defaultStep,
		dir,
		id,
		isStepSkippable,
		isStepValid,
		linear,
		onStepChange,
		onStepComplete,
		onStepInvalid,
		orientation,
		ref = $bindable(null),
		step = $bindable(),
		...props
	}: StepsRootProps = $props();

	const uid = $props.id();
	const api = createSteps(
		() => ({
			count,
			defaultStep,
			dir,
			id,
			isStepSkippable,
			isStepValid,
			linear,
			onStepChange(details) {
				onStepChange?.(details);
				step = details.step;
			},
			onStepComplete,
			onStepInvalid,
			orientation,
			step
		}),
		uid
	);
	setStepsContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="steps"
	data-part="root"
	data-slot="steps-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
