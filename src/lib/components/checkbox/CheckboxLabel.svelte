<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CheckboxLabelProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Checkbox.module.css';
	import { useCheckboxContext } from './checkbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CheckboxLabelProps = $props();

	const api = useCheckboxContext();
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	data-scope="checkbox"
	data-part="label"
	data-slot="checkbox-label"
	class={cn(styles.label, className)}
	{...api.labelProps()}
>
	{@render children?.()}
</Element>
