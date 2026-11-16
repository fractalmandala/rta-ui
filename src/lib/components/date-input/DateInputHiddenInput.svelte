<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DateInputHiddenInputBaseProps
		extends PolymorphicProps<'input'>,
			RefAttribute {
		index?: number;
		name?: string;
	}

	export interface DateInputHiddenInputProps
		extends DateInputHiddenInputBaseProps,
			Omit<HTMLProps<'input'>, 'value' | 'name'> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useDateInputContext, useDateInputGroupContext } from './date-input.state.svelte';

	let {
		asChild,
		index,
		name,
		ref = $bindable(null),
		style,
		...props
	}: DateInputHiddenInputProps = $props();

	const api = useDateInputContext();
	const group = useDateInputGroupContext();
	const attrs = $derived(api.getHiddenInputProps({ index: index ?? group(), name }));
</script>

<Element
	as="input"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	style={mergeStyleDeclarations(attrs.style as string | undefined, style)}
	data-scope="date-input"
	data-part="hidden-input"
	data-slot="date-input-hidden-input"
/>
