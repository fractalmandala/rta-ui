<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarCollapsedContentProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { useSidebarContext } from './sidebar.state.svelte';

	let {
		asChild,
		children,
		ref = $bindable(null),
		...props
	}: SidebarCollapsedContentProps = $props();

	const api = useSidebarContext();
	const attrs = $derived(api.collapsedContentAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="collapsed-content"
	data-slot="sidebar-collapsed-content"
>
	{@render children?.()}
</Element>
