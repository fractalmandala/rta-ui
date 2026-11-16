<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CollapsibleApi } from './collapsible.state.svelte';

	export interface CollapsibleRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: CollapsibleApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Collapsible.module.css';
	import { setCollapsibleContext } from './collapsible.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: CollapsibleRootProviderProps = $props();

	const api = untrack(() => value);
	setCollapsibleContext(api);
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.rootId}
	dir={api.dir}
	data-scope="collapsible"
	data-part="root"
	data-state={api.open ? 'open' : 'closed'}
	data-slot="collapsible-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
