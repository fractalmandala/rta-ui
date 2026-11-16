<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CheckboxIndicatorProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		indeterminate?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { CheckIcon, IndeterminateIcon } from '../../internal/icons/index.js';
	import styles from './Checkbox.module.css';
	import { useCheckboxContext } from './checkbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		indeterminate,
		ref = $bindable(null),
		...props
	}: CheckboxIndicatorProps = $props();

	const api = useCheckboxContext();
	const visible = $derived(api.indicatorVisible(indeterminate));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	hidden={!visible}
	data-scope="checkbox"
	data-part="indicator"
	data-slot="checkbox-indicator"
	class={cn(styles.indicator, className)}
	{...api.dataAttrs()}
>
	{#if children}
		{@render children()}
	{:else if indeterminate}
		<IndeterminateIcon />
	{:else}
		<CheckIcon />
	{/if}
</Element>
