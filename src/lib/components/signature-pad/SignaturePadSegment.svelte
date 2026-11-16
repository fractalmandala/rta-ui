<svelte:options namespace="svg" />

<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SignaturePadSegmentProps
		extends HTMLProps<'svg'>,
			PolymorphicProps<'svg'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './SignaturePad.module.css';
	import { useSignaturePadContext } from './signature-pad.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: SignaturePadSegmentProps = $props();

	const api = useSignaturePadContext();
	const attrs = $derived(api.segmentAttrs());

	$effect(() => {
		api.registerSegment(ref);
	});
</script>

<Element
	as="svg"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="signature-pad"
	data-part="segment"
	data-slot="signature-pad-segment"
	class={cn(styles.segment, className)}
>
	<title>Signature</title>
	{#each api.paths as path, index (index)}
		<path {...api.segmentPathAttrs(path)} data-scope="signature-pad" data-part="segment-path" />
	{/each}
	{#if api.currentPath}
		<path {...api.segmentPathAttrs(api.currentPath)} data-scope="signature-pad" data-part="segment-path" />
	{/if}
	{@render children?.()}
</Element>
