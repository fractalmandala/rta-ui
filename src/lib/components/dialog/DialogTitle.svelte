<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DialogTitleProps
		extends HTMLProps<'h2'>,
			PolymorphicProps<'h2'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Dialog.module.css';
	import { useDialogContext } from './dialog.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: DialogTitleProps =
		$props();

	const api = useDialogContext();
	const attrs = $derived(api.titleAttrs());

	$effect(() => {
		api.markRendered('title', true);
		return () => api.markRendered('title', false);
	});
</script>

<Element
	as="h2"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="dialog"
	data-part="title"
	data-slot="dialog-title"
	class={cn(styles.title, className)}
>
	{@render children?.()}
</Element>
