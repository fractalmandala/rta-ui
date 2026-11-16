<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ComboboxInputProps
		extends Omit<HTMLProps<'input'>, 'value'>,
			PolymorphicProps<'input'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Combobox.module.css';
	import { useComboboxContext } from './combobox.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		...props
	}: ComboboxInputProps = $props();

	const api = useComboboxContext();
	const attrs = $derived(api.inputAttrs());

	$effect(() => {
		api.registerInput(ref as HTMLInputElement | null);
	});
</script>

<Element
	as="input"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="combobox"
	data-part="input"
	data-slot="combobox-input"
	class={cn(!asChild && styles.input, className)}
/>
