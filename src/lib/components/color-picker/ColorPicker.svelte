<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseColorPickerProps } from './color-picker.state.svelte';

	export interface ColorPickerRootProps
		extends Omit<HTMLProps<'div'>, 'id'>,
			PolymorphicProps<'div'>,
			RefAttribute,
			UseColorPickerProps {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './ColorPicker.module.css';
	import { createColorPicker, setColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		closeOnSelect,
		defaultFormat,
		defaultOpen,
		defaultValue,
		dir,
		disabled,
		format = $bindable(),
		id,
		ids,
		initialFocusEl,
		inline,
		invalid,
		lazyMount,
		name,
		onFocusOutside,
		onFormatChange,
		onInteractOutside,
		onOpenChange,
		onPointerDownOutside,
		onValueChange,
		onValueChangeEnd,
		open = $bindable(),
		openAutoFocus,
		portalled,
		portalRef,
		positioning,
		readOnly,
		required,
		ref = $bindable(null),
		unmountOnExit,
		value = $bindable(),
		...props
	}: ColorPickerRootProps = $props();

	const uid = $props.id();
	const api = createColorPicker(
		() => ({
			...props,
			closeOnSelect,
			defaultFormat,
			defaultOpen,
			defaultValue,
			dir,
			disabled,
			id,
			ids,
			initialFocusEl,
			inline,
			invalid,
			lazyMount,
			name,
			onFocusOutside,
			onInteractOutside,
			onPointerDownOutside,
			openAutoFocus,
			portalled,
			portalRef,
			positioning,
			readOnly,
			required,
			unmountOnExit,
			open,
			value,
			format,
			onOpenChange(details) {
				onOpenChange?.(details);
				if (open !== undefined) open = details.open;
			},
			onValueChange(details) {
				onValueChange?.(details);
				if (value !== undefined) value = details.value;
			},
			onValueChangeEnd,
			onFormatChange(details) {
				onFormatChange?.(details);
				if (format !== undefined) format = details.format;
			}
		}),
		uid
	);
	setColorPickerContext(api);
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.rootId}
	dir={api.dir}
	data-scope="color-picker"
	data-part="root"
	data-disabled={dataAttr(api.disabled)}
	data-readonly={dataAttr(api.readOnly)}
	data-invalid={dataAttr(api.invalid)}
	style={mergeStyleDeclarations(api.rootStyle, props.style)}
	data-slot="color-picker-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
