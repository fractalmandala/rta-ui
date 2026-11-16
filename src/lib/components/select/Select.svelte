<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CollectionItem, SelectApi, UseSelectProps } from './select.state.svelte';

	export interface SelectRootProps<T extends CollectionItem = CollectionItem>
		extends UseSelectProps<T>,
			HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts" generics="T extends CollectionItem = CollectionItem">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { createSelect, setSelectContext, type SelectApi as SelectApiType } from './select.state.svelte';

	let {
		asChild,
		autoComplete,
		children,
		class: className,
		closeOnEscape = true,
		closeOnInteractOutside = true,
		closeOnSelect,
		collection,
		composite,
		defaultHighlightedValue,
		defaultOpen,
		defaultValue,
		deselectable,
		dir,
		disabled,
		form,
		highlightedValue = $bindable(),
		id,
		ids,
		invalid,
		isItemDisabled,
		itemToString,
		itemToValue,
		items,
		lazyMount = true,
		loopFocus,
		multiple,
		name,
		onFocusOutside,
		onHighlightChange,
		onInteractOutside,
		onOpenChange,
		onPointerDownOutside,
		onSelect,
		onValueChange,
		open = $bindable(),
		portalRef,
		portalled = true,
		positioning,
		readOnly,
		ref = $bindable(null),
		required,
		scrollToIndexFn,
		translations,
		unmountOnExit = true,
		value = $bindable(),
		...props
	}: SelectRootProps<T> = $props();

	const uid = $props.id();

	const api = createSelect<T>(
		() => ({
			autoComplete,
			closeOnEscape,
			closeOnInteractOutside,
			closeOnSelect,
			collection,
			composite,
			defaultHighlightedValue,
			defaultOpen,
			defaultValue,
			deselectable,
			dir,
			disabled,
			form,
			highlightedValue,
			id,
			ids,
			invalid,
			isItemDisabled,
			itemToString,
			itemToValue,
			items,
			lazyMount,
			loopFocus,
			multiple,
			name,
			onFocusOutside,
			onHighlightChange,
			onInteractOutside,
			onOpenChange(details) {
				onOpenChange?.(details);
				open = details.open;
			},
			onPointerDownOutside,
			onSelect,
			onValueChange(details) {
				onValueChange?.(details);
				value = typeof value === 'string' ? (details.value[0] ?? '') : details.value;
			},
			open,
			portalRef,
			portalled,
			positioning,
			readOnly,
			required,
			scrollToIndexFn,
			translations,
			unmountOnExit,
			value
		}),
		uid
	);

	setSelectContext(api as unknown as SelectApiType);

	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="select"
	data-part="root"
	data-slot="select-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
