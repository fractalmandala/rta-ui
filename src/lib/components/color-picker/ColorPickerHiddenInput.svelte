<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerHiddenInputProps
		extends Omit<HTMLProps<'input'>, 'type' | 'value' | 'tabindex'>,
			PolymorphicProps<'input'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { visuallyHiddenStyle } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useColorPickerContext } from './color-picker.state.svelte';

	let { asChild, ref = $bindable(null), ...props }: ColorPickerHiddenInputProps = $props();

	const api = useColorPickerContext();

	$effect(() => {
		api.setHiddenInputNode(ref as HTMLInputElement | null);
		return () => api.setHiddenInputNode(null);
	});
</script>

<Element
	as="input"
	{...props}
	bind:ref
	{asChild}
	type="text"
	id={api.hiddenInputId}
	name={props.name ?? api.name}
	tabindex={-1}
	disabled={api.disabled}
	readonly={api.readOnly}
	required={api.required}
	value={api.valueAsString}
	style={mergeStyleDeclarations(visuallyHiddenStyle, props.style)}
	data-scope="color-picker"
	data-part="hidden-input"
	data-slot="color-picker-hidden-input"
/>
