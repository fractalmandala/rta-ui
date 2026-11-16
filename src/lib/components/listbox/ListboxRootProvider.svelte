<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CollectionItem, ListboxApi } from './listbox.state.svelte';

	export interface ListboxRootProviderProps<T extends CollectionItem = CollectionItem>
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		value: ListboxApi<T>;
	}
</script>

<script lang="ts" generics="T extends CollectionItem = CollectionItem">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Listbox.module.css';
	import {
		setListboxContext,
		type ListboxApi as ListboxApiType
	} from './listbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: ListboxRootProviderProps<T> = $props();

	setListboxContext(untrack(() => value) as unknown as ListboxApiType);

	const attrs = $derived(value.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="listbox"
	data-part="root"
	data-slot="listbox-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
