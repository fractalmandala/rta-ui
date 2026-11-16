<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SelectListProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { useSelectContext } from './select.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: SelectListProps =
		$props();

	const api = useSelectContext();
	const attrs = $derived(api.listAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="select"
	data-part="list"
	data-slot="select-list"
	class={cn(styles.list, className)}
>
	{@render children?.()}
</Element>
