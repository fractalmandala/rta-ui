<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ClipboardApi } from './clipboard.state.svelte';

	export interface ClipboardRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: ClipboardApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Clipboard.module.css';
	import { setClipboardContext } from './clipboard.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: ClipboardRootProviderProps = $props();

	const api = untrack(() => value);
	setClipboardContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="clipboard"
	data-part="root"
	data-slot="clipboard-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
