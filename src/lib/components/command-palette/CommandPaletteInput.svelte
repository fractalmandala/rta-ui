<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteInputProps
		extends Omit<HTMLProps<'input'>, 'value'>,
			PolymorphicProps<'input'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './CommandPalette.module.css';
	import {
		useCommandPaletteComboboxContext,
		useCommandPaletteContext
	} from './command-palette.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		...props
	}: CommandPaletteInputProps = $props();

	const api = useCommandPaletteComboboxContext();
	const root = useCommandPaletteContext();
	const attrs = $derived(api.inputAttrs());

	$effect(() => {
		api.registerInput(ref);
		root.registerFocusTarget(ref);
		return () => {
			api.registerInput(null);
			root.registerFocusTarget(null);
		};
	});
</script>

<Element
	as="input"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="input"
	data-slot="command-palette-input"
	class={cn(styles.input, className)}
/>
