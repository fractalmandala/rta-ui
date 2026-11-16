<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PinInputLabelProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './PinInput.module.css';
	import { usePinInputContext } from './pin-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: PinInputLabelProps = $props();

	const api = usePinInputContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="label"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="pin-input"
	data-part="label"
	data-slot="pin-input-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
