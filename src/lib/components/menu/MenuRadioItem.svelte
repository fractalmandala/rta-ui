<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { MenuIndicatorPosition } from './MenuCheckboxItem.svelte';

	export interface MenuRadioItemProps
		extends Omit<HTMLProps<'div'>, 'value'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		value: string;
		valueText?: string;
		disabled?: boolean;
		closeOnSelect?: boolean;
		/** Where the radio indicator sits relative to the label. */
		indicator?: MenuIndicatorPosition;
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
		useMenuItemGroupContext,
		type MenuItemState,
		type MenuOptionItemData
	} from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		closeOnSelect = undefined,
		disabled = false,
		indicator = 'start',
		ref = $bindable(null),
		value,
		valueText = undefined,
		...props
	}: MenuRadioItemProps = $props();

	const api = useMenuContext();
	const group = useMenuItemGroupContext();
	const isChecked = () => group?.value === value;

	const option = $derived<MenuOptionItemData>({
		value,
		valueText,
		disabled,
		closeOnSelect,
		type: 'radio',
		checked: isChecked(),
		onCheckedChange() {
			group?.onValueChange?.({ value });
		}
	});
	const attrs = $derived(api.optionItemAttrs(option));
	const state = $derived(api.optionItemState(option));

	const itemProps = {
		// Getters, so a changed `value` or `disabled` prop is picked up instead of the mount value.
		get value() {
			return value;
		},
		type: 'radio' as const,
		get disabled() {
			return disabled;
		},
		get checked() {
			return isChecked();
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
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-indicator-position={indicator}
	data-slot="menu-radio-item"
	class={cn(styles.radioItem, className)}
>
	{@render children?.()}
</Element>
