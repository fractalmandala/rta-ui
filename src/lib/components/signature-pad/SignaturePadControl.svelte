<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SignaturePadControlProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useFieldContext } from '../field/field.state.svelte';
	import styles from './SignaturePad.module.css';
	import { useSignaturePadContext } from './signature-pad.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: SignaturePadControlProps = $props();

	const api = useSignaturePadContext();
	const field = useFieldContext();
	const attrs = $derived(api.controlAttrs());

	$effect(() => {
		api.registerControl(ref);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	aria-describedby={field?.ariaDescribedby}
	bind:ref
	{asChild}
	data-scope="signature-pad"
	data-part="control"
	data-slot="signature-pad-control"
	class={cn(styles.control, className)}
>
	{@render children?.()}
</Element>
