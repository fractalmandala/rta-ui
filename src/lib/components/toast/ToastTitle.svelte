<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ToastTitleProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute<HTMLDivElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Toast.module.css';
	import ToastValue from './ToastValue.svelte';
	import { useToastContext } from './toast.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ToastTitleProps = $props();

	const api = useToastContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.titleId}
	data-scope="toast"
	data-part="title"
	data-slot="toast-title"
	class={cn(styles.title, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<ToastValue value={api.title} />
	{/if}
</Element>
