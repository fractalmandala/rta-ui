<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CheckboxControlProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Checkbox.module.css';
	import CheckboxIndicator from './CheckboxIndicator.svelte';
	import { useCheckboxContext } from './checkbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CheckboxControlProps = $props();

	const api = useCheckboxContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	data-scope="checkbox"
	data-part="control"
	data-slot="checkbox-control"
	class={cn(styles.control, className)}
	{...api.controlProps()}
>
	{#if children}
		{@render children()}
	{:else}
		<CheckboxIndicator />
		<CheckboxIndicator indeterminate />
	{/if}
</Element>
