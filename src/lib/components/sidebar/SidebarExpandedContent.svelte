<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SidebarExpandedContentProps
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
	}: SidebarExpandedContentProps = $props();

	const api = useSidebarContext();
	const attrs = $derived(api.expandedContentAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="expanded-content"
	data-slot="sidebar-expanded-content"
>
	{@render children?.()}
</Element>
