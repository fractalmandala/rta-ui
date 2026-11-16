<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PinInputControlProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { useFieldContext } from '../field/field.state.svelte';
	import styles from './PinInput.module.css';
	import { usePinInputContext } from './pin-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: PinInputControlProps = $props();

	const api = usePinInputContext();
	const field = useFieldContext();
	const attrs = $derived({
		...api.controlAttrs(),
		'aria-describedby': field?.ariaDescribedby
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="pin-input"
	data-part="control"
	data-slot="pin-input-control"
	class={cn(styles.control, className)}
>
	{@render children?.()}
</Element>
