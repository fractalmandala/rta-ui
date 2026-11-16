<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseComboboxProps } from './combobox.state.svelte';

	export interface ComboboxRootProps
		extends UseComboboxProps,
			// `placeholder` is a combobox prop (a string), so the DOM attribute of the same name is
			// dropped rather than intersected.
			Omit<HTMLProps<'div'>, 'id' | 'onSelect' | 'placeholder'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Combobox.module.css';
	import { createCombobox, setComboboxContext } from './combobox.state.svelte';

	let {
		allowCustomValue,
		alwaysSubmitOnEnter,
		asChild,
		autoFocus,
		children,
		class: className,
		closeOnEscape,
		closeOnInteractOutside,
		closeOnSelect,
		composite,
		defaultHighlightedValue,
		defaultInputValue,
		defaultOpen,
		defaultValue,
		dir,
		disableLayer,
		disabled,
		form,
		highlightedValue = $bindable(),
		id,
		ids,
		inputBehavior,
		inputValue = $bindable(),
		invalid,
		isItemDisabled,
		itemToString,
		itemToValue,
		items,
		lazyMount,
		loading,
		loopFocus,
		multiple,
		name,
		onFocusOutside,
		onHighlightChange,
		onInputValueChange,
		onInteractOutside,
		onOpenChange,
		onPointerDownOutside,
		onSelect,
		onValueChange,
		open = $bindable(),
		openOnChange,
		openOnClick,
		openOnFocus,
		openOnKeyPress,
		placeholder,
		portalled,
		positioning,
		readOnly,
		ref = $bindable(null),
		required,
		selectionBehavior,
		translations,
		unmountOnExit,
		value = $bindable(),
		...props
	}: ComboboxRootProps = $props();

	const uid = $props.id();

	const api = createCombobox(
		() => ({
			allowCustomValue,
			alwaysSubmitOnEnter,
			autoFocus,
			closeOnEscape,
			closeOnInteractOutside,
			closeOnSelect,
			composite,
			defaultHighlightedValue,
			defaultInputValue,
			defaultOpen,
			defaultValue,
			dir,
			disableLayer,
			disabled,
			form,
			highlightedValue,
			id,
			ids,
			inputBehavior,
			inputValue,
			invalid,
			isItemDisabled,
			itemToString,
			itemToValue,
			items,
			lazyMount,
			loading,
			loopFocus,
			multiple,
			name,
			onFocusOutside,
			onInteractOutside,
			onPointerDownOutside,
			open,
			openOnChange,
			openOnClick,
			openOnFocus,
			openOnKeyPress,
			placeholder,
			portalled,
			positioning,
			readOnly,
			required,
			selectionBehavior,
			translations,
			unmountOnExit,
			value,
			onOpenChange(details) {
				onOpenChange?.(details);
				open = details.open;
			},
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
			},
			onSelect
		}),
		uid
	);

	setComboboxContext(api);

	const attrs = $derived(api.rootAttrs());
	const hidden = $derived(api.hiddenInputs());

	$effect(() => {
		api.registerRoot(ref);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="combobox"
	data-part="root"
	data-slot="combobox-root"
	class={cn(styles.root, className)}
>
	{#each hidden as input (input.id)}
		<input
			type="hidden"
			id={input.id}
			name={input.name}
			form={input.form}
			value={input.value}
			data-scope="combobox"
			data-part="hidden-input"
		/>
	{/each}
	{@render children?.()}
</Element>
