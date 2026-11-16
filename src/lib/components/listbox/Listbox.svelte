<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CollectionItem, ListboxApi, UseListboxProps } from './listbox.state.svelte';

	export interface ListboxRootProps<T extends CollectionItem = CollectionItem>
		extends UseListboxProps<T>,
			HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts" generics="T extends CollectionItem = CollectionItem">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Listbox.module.css';
	import {
		createListbox,
		setListboxContext,
		type ListboxApi as ListboxApiType
	} from './listbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		collection,
		defaultHighlightedValue,
		defaultValue,
		deselectable,
		dir,
		disabled,
		disallowSelectAll,
		highlightedValue = $bindable(),
		id,
		ids,
		isItemDisabled,
		itemToString,
		itemToValue,
		items,
		loopFocus,
		onHighlightChange,
		onSelect,
		onValueChange,
		orientation,
		ref = $bindable(null),
		scrollToIndexFn,
		selectOnHighlight,
		selectionMode,
		typeahead,
		value = $bindable(),
		...props
	}: ListboxRootProps<T> = $props();

	const uid = $props.id();

	const api = createListbox<T>(
		() => ({
			collection,
			defaultHighlightedValue,
			defaultValue,
			deselectable,
			dir,
			disabled,
			disallowSelectAll,
			highlightedValue,
			id,
			ids,
			isItemDisabled,
			itemToString,
			itemToValue,
			items,
			loopFocus,
			onHighlightChange,
			onSelect,
			onValueChange(details) {
				onValueChange?.(details);
				value = typeof value === 'string' ? (details.value[0] ?? '') : details.value;
			},
			orientation,
			scrollToIndexFn,
			selectOnHighlight,
			selectionMode,
			typeahead,
			value
		}),
		uid
	);

	setListboxContext(api as unknown as ListboxApiType);

	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="listbox"
	data-part="root"
	data-slot="listbox-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
