<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TabsContentProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: string;
	}
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
		value,
		...props
	}: TabsContentProps = $props();

	const api = useTabsContext();
	const attrs = $derived(api.contentAttrs(value));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="tabs"
	data-part="content"
	data-slot="tabs-content"
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
