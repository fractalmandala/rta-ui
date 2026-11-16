<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DialogDescriptionProps
		extends HTMLProps<'p'>,
			PolymorphicProps<'p'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Dialog.module.css';
	import { useDialogContext } from './dialog.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: DialogDescriptionProps = $props();

	const api = useDialogContext();
	const attrs = $derived(api.descriptionAttrs());

	$effect(() => {
		api.markRendered('description', true);
		return () => api.markRendered('description', false);
	});
</script>

<Element
	as="p"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="dialog"
	data-part="description"
	data-slot="dialog-description"
	class={cn(styles.description, className)}
>
	{@render children?.()}
</Element>
