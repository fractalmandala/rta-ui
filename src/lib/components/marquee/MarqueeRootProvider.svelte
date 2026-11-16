<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { MarqueeApi } from './marquee.state.svelte';

	export interface MarqueeRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: MarqueeApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Marquee.module.css';
	import { setMarqueeContext } from './marquee.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: MarqueeRootProviderProps = $props();

	const api = untrack(() => value);
	setMarqueeContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="marquee"
	data-part="root"
	data-slot="marquee-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
