<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ToastCloseTriggerProps
		extends HTMLProps<'button'>,
			Omit<PolymorphicProps<'button'>, 'type'>,
			RefAttribute<HTMLButtonElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { a11yLabels } from '../../internal/a11yLabels.js';
	import { cn } from '../../internal/cn.js';
	import { CloseIcon } from '../../internal/icons/index.js';
	import styles from './Toast.module.css';
	import { useToastContext } from './toast.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onclick,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		...props
	}: ToastCloseTriggerProps = $props();

	const api = useToastContext();

	const resolvedAriaLabel = $derived(
		ariaLabel === undefined && ariaLabelledby == null ? a11yLabels.closeToast : ariaLabel
	);
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	type="button"
	id={api.closeTriggerId}
	aria-label={resolvedAriaLabel}
	aria-labelledby={ariaLabelledby}
	data-scope="toast"
	data-part="close-trigger"
	data-type={api.type}
	data-slot="toast-close-trigger"
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.dismiss('user');
	}}
	class={cn(!asChild && styles.closeTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<CloseIcon width="16" height="16" />
	{/if}
</Element>
