<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SelectControlProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { useSelectContext } from './select.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: SelectControlProps =
		$props();

	const api = useSelectContext();
	const attrs = $derived(api.controlAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="select"
	data-part="control"
	data-slot="select-control"
	class={cn(styles.control, className)}
>
	{@render children?.()}
</Element>
