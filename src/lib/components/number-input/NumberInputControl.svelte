<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NumberInputControlProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './NumberInput.module.css';
	import { useNumberInputContext } from './number-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: NumberInputControlProps = $props();

	const api = useNumberInputContext();
	const attrs = $derived(api.controlAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="number-input"
	data-part="control"
	data-slot="number-input-control"
	class={cn(styles.control, className)}
>
	{@render children?.()}
</Element>
