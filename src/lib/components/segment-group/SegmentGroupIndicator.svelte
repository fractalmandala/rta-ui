<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SegmentGroupIndicatorProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import styles from './SegmentGroup.module.css';
	import { useSegmentGroupContext } from './segment-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: SegmentGroupIndicatorProps = $props();

	const api = useSegmentGroupContext();

	$effect(() => {
		api.value;
		api.measure();
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.indicatorId}
	dir={api.dir}
	hidden={api.value == null || api.indicatorRect == null}
	data-scope="segment-group"
	data-part="indicator"
	data-disabled={dataAttr(api.disabled)}
	data-orientation={api.orientation}
	data-slot="segment-group-indicator"
	style={api.indicatorStyle()}
	class={cn(styles.indicator, className)}
>
	{@render children?.()}
</Element>
