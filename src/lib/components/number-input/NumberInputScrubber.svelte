<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NumberInputScrubberProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './NumberInput.module.css';
	import { useNumberInputContext } from './number-input.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: NumberInputScrubberProps = $props();

	const api = useNumberInputContext();
	const attrs = $derived(api.scrubberAttrs());
	const scrubberStyle = $derived(mergeStyleDeclarations(attrs.style, style));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={scrubberStyle}
	bind:ref
	{asChild}
	data-scope="number-input"
	data-part="scrubber"
	data-slot="number-input-scrubber"
	class={cn(styles.scrubber, className)}
/>
