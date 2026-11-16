<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PinInputInputProps
		extends Omit<HTMLProps<'input'>, 'value'>, PolymorphicProps<'input'>, RefAttribute {
		index: number;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './PinInput.module.css';
	import { usePinInputContext } from './pin-input.state.svelte';

	let {
		asChild,
		class: className,
		index,
		ref = $bindable(null),
		...props
	}: PinInputInputProps = $props();

	const api = usePinInputContext();
	const attrs = $derived(api.inputAttrs(index));

	$effect(() => {
		api.registerInput(index, ref as HTMLInputElement | null);
	});
</script>

<Element
	as="input"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="pin-input"
	data-part="input"
	data-slot="pin-input-input"
	class={cn(styles.input, className)}
/>
