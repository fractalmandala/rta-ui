<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { DateInputApi } from './date-input.state.svelte';

	export interface DateInputRootProviderBaseProps
		extends Omit<HTMLProps<'div'>, 'id'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		value: DateInputApi;
	}

	export type DateInputRootProviderProps = DateInputRootProviderBaseProps;
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DateInput.module.css';
	import { setDateInputContext } from './date-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: DateInputRootProviderProps = $props();

	const api = untrack(() => value);
	setDateInputContext(api);
	const attrs = $derived(api.getRootProps());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-input"
	data-part="root"
	data-slot="date-input-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
