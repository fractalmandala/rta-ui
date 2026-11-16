<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ToastActionTriggerProps
		extends HTMLProps<'button'>,
			Omit<PolymorphicProps<'button'>, 'type'>,
			RefAttribute<HTMLButtonElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Toast.module.css';
	import { useToastContext } from './toast.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onclick,
		ref = $bindable(null),
		...props
	}: ToastActionTriggerProps = $props();

	const api = useToastContext();
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	type="button"
	data-scope="toast"
	data-part="action-trigger"
	data-type={api.type}
	data-slot="toast-action-trigger"
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.action?.onClick();
		api.dismiss('user');
	}}
	class={cn(!asChild && styles.actionTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.action?.label}
	{/if}
</Element>
