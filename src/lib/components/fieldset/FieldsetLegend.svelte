<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FieldsetLegendProps
		extends HTMLProps<'legend'>, PolymorphicProps<'legend'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Fieldset.module.css';
	import { useFieldsetContext } from './fieldset.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: FieldsetLegendProps =
		$props();

	const api = useFieldsetContext();
	const attrs = $derived(api?.legendAttrs() ?? {});
</script>

<Element
	as="legend"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="fieldset"
	data-part="legend"
	data-slot="fieldset-legend"
	class={cn(styles.legend, className)}
>
	{@render children?.()}
</Element>
