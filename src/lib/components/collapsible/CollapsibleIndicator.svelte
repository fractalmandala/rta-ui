<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CollapsibleIndicatorProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { ChevronDownIcon } from '../../internal/icons/index.js';
	import styles from './Collapsible.module.css';
	import { useCollapsibleContext } from './collapsible.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: CollapsibleIndicatorProps =
		$props();

	const api = useCollapsibleContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	data-scope="collapsible"
	data-part="indicator"
	data-state={api.open ? 'open' : 'closed'}
	data-disabled={dataAttr(api.disabled)}
	data-slot="collapsible-indicator"
	class={cn(styles.indicator, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<ChevronDownIcon />
	{/if}
</Element>
