<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NumberInputDecrementTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>, PolymorphicProps<'button'>, RefAttribute {}
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
	}: NumberInputDecrementTriggerProps = $props();

	const api = useNumberInputContext();
	const attrs = $derived(api.decrementTriggerAttrs());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="number-input"
	data-part="decrement-trigger"
	data-slot="number-input-decrement-trigger"
	class={cn(styles.decrementTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			focusable="false"
		><path d="M5 12h14" /></svg>
	{/if}
</Element>
