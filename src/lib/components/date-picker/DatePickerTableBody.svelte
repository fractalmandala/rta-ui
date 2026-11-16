<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerTableBodyProps
		extends HTMLProps<'tbody'>,
			PolymorphicProps<'tbody'>,
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
	}: DatePickerTableBodyProps = $props();

	const api = useDatePickerContext();
	const view = useDatePickerViewContext();
	const attrs = $derived(api.getTableBodyProps({ view: view() }));
</script>

<Element
	as="tbody"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="table-body"
	data-slot="date-picker-table-body"
>
	{@render children?.()}
</Element>
