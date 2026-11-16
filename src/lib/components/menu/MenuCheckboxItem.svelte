<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export type MenuIndicatorPosition = 'start' | 'end' | 'none';

	export interface MenuCheckboxItemProps
		extends Omit<HTMLProps<'div'>, 'value'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		value: string;
		valueText?: string;
		disabled?: boolean;
		closeOnSelect?: boolean;
		checked?: boolean;
		onCheckedChange?: (checked: boolean) => void;
		/** Where the check indicator sits relative to the label. */
		indicator?: MenuIndicatorPosition;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Menu.module.css';
	import { createInternalChecked } from './menu-checked.svelte';
	import {
		setMenuItemContext,
		setMenuItemPropsContext,
		useMenuContext,
		type MenuItemState,
		type MenuOptionItemData
	} from './menu.state.svelte';

	let {
		asChild,
		checked = $bindable(undefined),
		children,
		class: className,
		closeOnSelect = undefined,
		disabled = false,
		indicator = 'start',
		onCheckedChange = undefined,
		ref = $bindable(null),
		value,
		valueText = undefined,
		...props
	}: MenuCheckboxItemProps = $props();

	const api = useMenuContext();
	const checkedState = createInternalChecked({
		getControlled: () => checked,
		onChange: (next) => {
			if (checked !== undefined) checked = next;
			onCheckedChange?.(next);
		}
	});
	const isChecked = (): boolean => checkedState.checked;

	const option = $derived.by<MenuOptionItemData>(() => ({
		value,
		valueText,
		disabled,
		closeOnSelect,
		type: 'checkbox',
		checked: isChecked(),
		onCheckedChange(next: boolean) {
			checkedState.set(next);
		}
	}));
	const attrs: Record<string, unknown> = $derived(api.optionItemAttrs(option));
	const state = $derived(api.optionItemState(option)) as MenuItemState;

	const itemProps = {
		// Getters, so a changed `value` or `disabled` prop is picked up instead of the mount value.
		get value() {
			return value;
		},
		type: 'checkbox' as const,
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
	data-slot="menu-checkbox-item"
	class={cn(styles.checkboxItem, className)}
>
	{@render children?.()}
</Element>
