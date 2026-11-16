<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { MenuValueChangeDetails } from './menu.state.svelte';

	export interface MenuRadioItemGroupProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		id?: string;
		value?: string | null;
		defaultValue?: string | null;
		onValueChange?: (details: MenuValueChangeDetails) => void;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Menu.module.css';
	import {
		setMenuItemGroupContext,
		useMenuContext,
		type MenuItemGroupApi
	} from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		defaultValue = null,
		id = undefined,
		onValueChange = undefined,
		ref = $bindable(null),
		value = $bindable(undefined),
		...props
	}: MenuRadioItemGroupProps = $props();

	const api = useMenuContext();
	const generatedId = $props.id();
	const groupId = () => id ?? generatedId;

	let internalValue = $state<string | null>(null);
	const currentValue = () => value ?? internalValue ?? defaultValue;

	const group: MenuItemGroupApi = {
		get id() {
			return groupId();
		},
		get value() {
			return currentValue();
		},
		onValueChange(details) {
			const next = details.value ?? null;
			internalValue = next;
			if (value !== undefined) value = next;
			onValueChange?.(details);
		}
	};
	setMenuItemGroupContext(group);

	const attrs = $derived(api.itemGroupAttrs({ id: groupId() }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-slot="menu-radio-item-group"
	class={cn(styles.radioItemGroup, className)}
>
	{@render children?.()}
</Element>
