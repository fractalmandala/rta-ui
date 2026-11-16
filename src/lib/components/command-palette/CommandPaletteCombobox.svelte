<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseCommandPaletteComboboxProps } from './command-palette.state.svelte';

	export interface CommandPaletteComboboxProps
		extends Omit<HTMLProps<'div'>, 'id' | 'dir' | 'onSelect' | 'placeholder' | 'children'>,
			UseCommandPaletteComboboxProps,
			PolymorphicProps<'div'>,
			RefAttribute<HTMLDivElement> {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './CommandPalette.module.css';
	import {
		createCommandPaletteCombobox,
		setCommandPaletteComboboxContext,
		useCommandPaletteContext
	} from './command-palette.state.svelte';

	let {
		asChild,
		children,
		class: className,
		closeOnSelect = true,
		defaultHighlightedValue,
		defaultInputValue,
		defaultValue,
		dir,
		disabled,
		highlightedValue = $bindable(),
		id,
		ids,
		inputBehavior = 'autohighlight',
		inputValue = $bindable(),
		isItemDisabled,
		itemToString,
		itemToValue,
		items = [],
		loopFocus,
		onHighlightChange,
		onInputValueChange,
		onSelect,
		onValueChange,
		placeholder,
		readOnly,
		ref = $bindable(null),
		selectionBehavior = 'preserve',
		translations,
		value = $bindable(),
		...props
	}: CommandPaletteComboboxProps = $props();

	const root = useCommandPaletteContext();
	const uid = $props.id();

	const api = createCommandPaletteCombobox(
		root,
		() => ({
			items,
			itemToValue,
			itemToString,
			isItemDisabled,
			value,
			defaultValue,
			inputValue,
			defaultInputValue,
			highlightedValue,
			defaultHighlightedValue,
			onSelect,
			placeholder,
			disabled,
			readOnly,
			loopFocus,
			closeOnSelect,
			inputBehavior,
			selectionBehavior,
			dir,
			id,
			ids,
			translations,
			onValueChange(details) {
				onValueChange?.(details);
				value = details.value;
			},
			onInputValueChange(details) {
				onInputValueChange?.(details);
				inputValue = details.inputValue;
			},
			onHighlightChange(details) {
				onHighlightChange?.(details);
				highlightedValue = details.highlightedValue;
			}
		}),
		uid
	);

	setCommandPaletteComboboxContext(api);

	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="combobox"
	data-slot="command-palette-combobox"
	class={cn(styles.combobox, className)}
>
	{@render children?.()}
</Element>
