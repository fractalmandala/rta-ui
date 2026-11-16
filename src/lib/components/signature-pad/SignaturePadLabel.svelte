<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SignaturePadLabelProps
		extends HTMLProps<'label'>,
			PolymorphicProps<'label'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './SignaturePad.module.css';
	import { useSignaturePadContext } from './signature-pad.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: SignaturePadLabelProps = $props();

	const api = useSignaturePadContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="label"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="signature-pad"
	data-part="label"
	data-slot="signature-pad-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
