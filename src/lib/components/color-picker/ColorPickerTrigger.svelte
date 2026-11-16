<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './ColorPicker.module.css';
	import ColorPickerValueSwatch from './ColorPickerValueSwatch.svelte';
	import { useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onclick,
		ref = $bindable(null),
		...props
	}: ColorPickerTriggerProps = $props();

	const api = useColorPickerContext();

	const triggerStyle = 'position: relative;';

	$effect(() => {
		api.setTriggerNode(ref as HTMLElement | null);
		return () => api.setTriggerNode(null);
	});
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	id={api.triggerId}
	dir={api.dir}
	type="button"
	disabled={api.disabled}
	aria-label="select color. current color is {api.valueAsString}"
	aria-controls={api.contentId}
	aria-labelledby={api.labelId}
	aria-haspopup={api.inline ? undefined : 'dialog'}
	aria-expanded={api.open}
	data-scope="color-picker"
	data-part="trigger"
	data-disabled={dataAttr(api.disabled)}
	data-readonly={dataAttr(api.readOnly)}
	data-invalid={dataAttr(api.invalid)}
	data-placement={api.placement}
	data-side={api.side}
	data-state={api.open ? 'open' : 'closed'}
	data-focus={dataAttr(api.focused)}
	style={mergeStyleDeclarations(triggerStyle, props.style)}
	data-slot="color-picker-trigger"
	class={cn(styles.trigger, className)}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.onTriggerClick();
	}}
>
	{#if children}
		{@render children()}
	{:else}
		<ColorPickerValueSwatch />
	{/if}
</Element>
