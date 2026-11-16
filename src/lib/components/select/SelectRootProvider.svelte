<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CollectionItem, SelectApi } from './select.state.svelte';

	export interface SelectRootProviderProps<T extends CollectionItem = CollectionItem>
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		value: SelectApi<T>;
	}
</script>

<script lang="ts" generics="T extends CollectionItem = CollectionItem">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { setSelectContext, type SelectApi as SelectApiType } from './select.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: SelectRootProviderProps<T> = $props();

	setSelectContext(untrack(() => value) as unknown as SelectApiType);

	const attrs = $derived(value.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="select"
	data-part="root"
	data-slot="select-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
