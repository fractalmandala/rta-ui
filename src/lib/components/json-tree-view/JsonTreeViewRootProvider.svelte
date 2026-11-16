<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { JsonTreeViewApi } from './json-tree-view.state.svelte';

	export interface JsonTreeViewRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: JsonTreeViewApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { setTreeViewContext, type TreeViewContextApi } from '../tree-view/tree-view.state.svelte';
	import styles from './JsonTreeView.module.css';
	import { setJsonTreeViewPropsContext } from './json-tree-view.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: JsonTreeViewRootProviderProps = $props();

	const api = untrack(() => value);
	setTreeViewContext(api as unknown as TreeViewContextApi);
	setJsonTreeViewPropsContext(() => api.options);

	const attrs = $derived(api.getRootProps());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="json-tree-view"
	data-part="root"
	data-slot="json-tree-view-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
