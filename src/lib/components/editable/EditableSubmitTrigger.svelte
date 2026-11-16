<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface EditableSubmitTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>, PolymorphicProps<'button'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Editable.module.css';
	import { useEditableContext } from './editable.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: EditableSubmitTriggerProps = $props();

	const api = useEditableContext();
	const attrs = $derived(api.submitTriggerAttrs());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="editable"
	data-part="submit-trigger"
	data-slot="editable-submit-trigger"
	class={cn(asChild ? undefined : styles.trigger, className)}
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
		><path d="M20 6 9 17l-5-5" /></svg>
	{/if}
</Element>
