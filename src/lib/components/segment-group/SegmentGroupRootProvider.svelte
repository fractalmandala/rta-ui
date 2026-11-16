<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { SegmentGroupSize } from './SegmentGroup.svelte';
	import type { SegmentGroupApi } from './segment-group.state.svelte';

	export interface SegmentGroupRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: SegmentGroupApi;
		size?: SegmentGroupSize;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './SegmentGroup.module.css';
	import { setSegmentGroupContext } from './segment-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		size = 'md',
		value,
		...props
	}: SegmentGroupRootProviderProps = $props();

	const api = untrack(() => value);
	setSegmentGroupContext(api);
	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.registerRoot(ref);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="segment-group"
	data-part="root"
	data-size={size}
	data-slot="segment-group-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
