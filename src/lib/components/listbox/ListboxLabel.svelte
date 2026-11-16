<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ListboxLabelProps
		extends HTMLProps<'span'>,
			PolymorphicProps<'span'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Listbox.module.css';
	import { useListboxContext } from './listbox.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: ListboxLabelProps =
		$props();

	const api = useListboxContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="listbox"
	data-part="label"
	data-slot="listbox-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
