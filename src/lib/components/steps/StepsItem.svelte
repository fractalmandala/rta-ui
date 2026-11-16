<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface StepsItemProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		index: number;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Steps.module.css';
	import {
		setStepsItemContext,
		setStepsItemIndexContext,
		useStepsContext
	} from './steps.state.svelte';

	let {
		asChild,
		children,
		class: className,
		index,
		ref = $bindable(null),
		...props
	}: StepsItemProps = $props();

	const api = useStepsContext();
	const attrs = $derived(api.itemAttrs(index));
	setStepsItemContext(() => api.itemState(index));
	setStepsItemIndexContext(() => index);
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="steps"
	data-part="item"
	data-slot="steps-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
