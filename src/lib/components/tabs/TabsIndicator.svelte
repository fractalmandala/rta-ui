<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TabsIndicatorProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Tabs.module.css';
	import { useTabsContext } from './tabs.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: TabsIndicatorProps = $props();

	const api = useTabsContext();

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
	hidden={api.indicatorRect == null}
	data-scope="tabs"
	data-part="indicator"
	data-orientation={api.orientation}
	data-slot="tabs-indicator"
	style={api.indicatorStyle()}
	class={cn(styles.indicator, className)}
>
	{@render children?.()}
</Element>
