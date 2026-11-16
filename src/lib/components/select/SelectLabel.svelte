<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SelectLabelProps
		extends HTMLProps<'label'>,
			PolymorphicProps<'label'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { useSelectContext } from './select.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: SelectLabelProps =
		$props();

	const api = useSelectContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="label"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="select"
	data-part="label"
	data-slot="select-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
