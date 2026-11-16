<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ComboboxItemGroupProps
		extends Omit<HTMLProps<'div'>, 'id'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		id?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Combobox.module.css';
	import { setComboboxItemGroupContext, useComboboxContext } from './combobox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		id,
		ref = $bindable(null),
		...props
	}: ComboboxItemGroupProps = $props();

	const api = useComboboxContext();
	const uid = $props.id();
	const groupId = $derived(id ?? uid);

	setComboboxItemGroupContext({ get id() { return groupId; } });

	const attrs = $derived(api.itemGroupAttrs({ id: groupId }));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="combobox"
	data-part="item-group"
	data-slot="combobox-item-group"
	class={cn(styles.itemGroup, className)}
>
	{@render children?.()}
</Element>
