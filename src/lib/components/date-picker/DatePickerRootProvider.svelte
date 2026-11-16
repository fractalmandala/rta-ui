<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { DatePickerApi } from './date-picker.state.svelte';

	export interface DatePickerRootProviderProps
		extends Omit<HTMLProps<'div'>, 'id'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		value: DatePickerApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DatePicker.module.css';
	import { setDatePickerContext } from './date-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: DatePickerRootProviderProps = $props();

	const api = untrack(() => value);
	setDatePickerContext(api);
	const attrs = $derived(api.getRootProps());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="root"
	data-slot="date-picker-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
