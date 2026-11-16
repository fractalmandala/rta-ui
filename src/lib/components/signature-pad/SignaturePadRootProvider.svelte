<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { SignaturePadApi } from './signature-pad.state.svelte';

	export interface SignaturePadRootProviderProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		/** The signature pad returned by `createSignaturePad`, or a `bind:this` root that exposes one. */
		value: SignaturePadApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './SignaturePad.module.css';
	import { setSignaturePadContext, setSignaturePadReadOnly } from './signature-pad.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: SignaturePadRootProviderProps = $props();

	const api = untrack(() => value);
	setSignaturePadContext(api);
	setSignaturePadReadOnly(() => api.readOnly);

	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="signature-pad"
	data-part="root"
	data-slot="signature-pad-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
