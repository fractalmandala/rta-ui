<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface QrCodePatternProps
		extends HTMLProps<'path'>, PolymorphicProps<'path'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useQrCodeContext } from './qr-code.state.svelte';

	let {
		asChild,
		ref = $bindable(null),
		...props
	}: QrCodePatternProps = $props();

	const api = useQrCodeContext();
	const attrs = $derived(api.patternAttrs());
</script>

<Element
	as="path"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="qr-code"
	data-part="pattern"
	data-slot="qr-code-pattern"
/>
