<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerTableHeadProps
		extends HTMLProps<'thead'>,
			PolymorphicProps<'thead'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useDatePickerContext, useDatePickerViewContext } from './date-picker.state.svelte';

	let {
		asChild,
		children,
		ref = $bindable(null),
		...props
	}: DatePickerTableHeadProps = $props();

	const api = useDatePickerContext();
	const view = useDatePickerViewContext();
	const attrs = $derived(api.getTableHeadProps({ view: view() }));
</script>

<Element
	as="thead"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="table-head"
	data-slot="date-picker-table-head"
>
	{@render children?.()}
</Element>
