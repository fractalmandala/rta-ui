<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ToggleSize, ToggleVariant } from '../toggle/toggle.state.svelte';

	export interface ToggleGroupItemProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {
		value: string;
		disabled?: boolean;
		size?: ToggleSize;
		variant?: ToggleVariant;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import toggleStyles from '../toggle/Toggle.module.css';
	import styles from './ToggleGroup.module.css';
	import { useToggleGroupContext, useToggleGroupStyleContext } from './toggle-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled,
		ref = $bindable(null),
		size,
		value,
		variant,
		...props
	}: ToggleGroupItemProps = $props();

	const api = useToggleGroupContext();
	const inherited = useToggleGroupStyleContext();
	const resolvedSize = $derived(size ?? inherited.size);
	const resolvedVariant = $derived(variant ?? inherited.variant);
	const state = $derived(api.itemState(value, disabled));
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	id={state.id}
	type="button"
	data-ownedby={api.rootId}
	role={api.multiple ? undefined : 'radio'}
	aria-checked={api.multiple ? undefined : state.pressed}
	aria-pressed={api.multiple ? state.pressed : undefined}
	tabindex={api.rovingFocus ? (state.focused ? 0 : -1) : undefined}
	disabled={state.disabled}
	dir={api.dir}
	data-scope="toggle-group"
	data-part="item"
	data-state={state.pressed ? 'on' : 'off'}
	data-pressed={dataAttr(state.pressed)}
	data-focus={dataAttr(state.focused)}
	data-disabled={dataAttr(state.disabled)}
	data-orientation={api.orientation}
	data-size={resolvedSize}
	data-variant={resolvedVariant}
	data-slot="toggle-group-item"
	onfocus={() => {
		if (state.disabled) return;
		api.setFocused(value);
	}}
	onclick={() => {
		if (state.disabled) return;
		api.toggleValue(value);
	}}
	onkeydown={(event) => {
		if (event.defaultPrevented || state.disabled) return;
		const horizontal = api.orientation === 'horizontal';
		const rtl = api.dir === 'rtl';
		const forward = () => api.moveFocus(1);
		const backward = () => api.moveFocus(-1);
		const keys: Record<string, () => void> = {
			ArrowLeft: () => (horizontal ? (rtl ? forward() : backward()) : undefined),
			ArrowRight: () => (horizontal ? (rtl ? backward() : forward()) : undefined),
			ArrowUp: () => (horizontal ? undefined : backward()),
			ArrowDown: () => (horizontal ? undefined : forward()),
			Home: () => api.focusFirst(),
			End: () => api.focusLast()
		};
		const exec = keys[event.key];
		if (!exec) return;
		if (event.key.startsWith('Arrow') && !api.rovingFocus) return;
		event.preventDefault();
		exec();
	}}
	class={cn(toggleStyles.root, styles.item, className)}
>
	{@render children?.()}
</Element>
