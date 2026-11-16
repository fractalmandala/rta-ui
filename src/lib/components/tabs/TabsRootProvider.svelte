<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { TabsSize, TabsVariant } from './Tabs.svelte';
	import type { TabsApi } from './tabs.state.svelte';

	export interface TabsRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: TabsApi;
		variant?: TabsVariant;
		size?: TabsSize;
		fitted?: boolean;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Tabs.module.css';
	import { setTabsContext } from './tabs.state.svelte';

	let {
		asChild,
		children,
		class: className,
		fitted,
		ref = $bindable(null),
		size = 'md',
		value,
		variant = 'default',
		...props
	}: TabsRootProviderProps = $props();

	const api = untrack(() => value);
	setTabsContext(api);
	const rootAttrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...rootAttrs}
	data-scope="tabs"
	data-part="root"
	data-variant={variant}
	data-size={size}
	data-fitted={fitted ? '' : undefined}
	data-slot="tabs-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
