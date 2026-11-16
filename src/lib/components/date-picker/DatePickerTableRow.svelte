<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerTableRowProps
		extends HTMLProps<'tr'>,
			PolymorphicProps<'tr'>,
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
	}: DatePickerTableRowProps = $props();

	const api = useDatePickerContext();
	const view = useDatePickerViewContext();
	const attrs = $derived(api.getTableRowProps({ view: view() }));
</script>

<Element
	as="tr"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="table-row"
	data-slot="date-picker-table-row"
>
	{@render children?.()}
</Element>
