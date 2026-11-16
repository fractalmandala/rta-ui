<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SignaturePadGuideProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './SignaturePad.module.css';
	import { useSignaturePadContext } from './signature-pad.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: SignaturePadGuideProps = $props();

	const api = useSignaturePadContext();
	const attrs = $derived(api.guideAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="signature-pad"
	data-part="guide"
	data-slot="signature-pad-guide"
	class={cn(styles.guide, className)}
>
	{@render children?.()}
</Element>
