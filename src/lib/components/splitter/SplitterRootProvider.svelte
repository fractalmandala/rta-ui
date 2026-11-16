<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { SplitterApi } from './splitter.state.svelte';

	export interface SplitterRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: SplitterApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Splitter.module.css';
	import { setSplitterContext } from './splitter.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		value,
		...props
	}: SplitterRootProviderProps = $props();

	const api = untrack(() => value);
	setSplitterContext(api);
	const rootStyle = $derived(['width:', 'height:', style].filter(Boolean).join(';'));
	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.registerRoot(ref);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={rootStyle}
	bind:ref
	{asChild}
	data-scope="splitter"
	data-part="root"
	data-slot="splitter-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
