<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { QrCodeApi } from './qr-code.state.svelte';

	export interface QrCodeRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: QrCodeApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './QrCode.module.css';
	import { setQrCodeContext } from './qr-code.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: QrCodeRootProviderProps = $props();

	const api = untrack(() => value);
	setQrCodeContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="qr-code"
	data-part="root"
	data-slot="qr-code-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
