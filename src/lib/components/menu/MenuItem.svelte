<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export type MenuItemTone = 'default' | 'destructive';

	export interface MenuItemProps
		extends Omit<HTMLProps<'div'>, 'value'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		value: string;
		valueText?: string;
		disabled?: boolean;
		closeOnSelect?: boolean;
		onSelect?: () => void;
		/** Visual intent of the item. */
		tone?: MenuItemTone;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Menu.module.css';
	import {
		setMenuItemContext,
		setMenuItemPropsContext,
		useMenuContext,
		type MenuItemPropsApi,
		type MenuItemState
	} from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		closeOnSelect = undefined,
		disabled = false,
		onSelect = undefined,
		ref = $bindable(null),
		tone = 'default',
		value,
		valueText = undefined,
		...props
	}: MenuItemProps = $props();

	const api = useMenuContext();
	const item = $derived({ value, valueText, disabled, closeOnSelect });
	const attrs = $derived(api.itemAttrs(item));
	const state = $derived(api.itemState(item));

	const itemProps: MenuItemPropsApi = {
		get value() {
			return value;
		},
		get disabled() {
			return disabled;
		}
	};
	const itemState: MenuItemState = {
		get id() {
			return state.id;
		},
		get disabled() {
			return state.disabled;
		},
		get highlighted() {
			return state.highlighted;
		}
	};
	setMenuItemPropsContext(itemProps);
	setMenuItemContext(itemState);

	$effect(() => api.addItemListener({ id: state.id, node: ref as HTMLElement | null, onSelect }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-tone={tone}
	data-slot="menu-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
