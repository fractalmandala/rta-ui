<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CollapsibleTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import styles from './Collapsible.module.css';
	import { useCollapsibleContext } from './collapsible.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onclick,
		ref = $bindable(null),
		...props
	}: CollapsibleTriggerProps = $props();

	const api = useCollapsibleContext();
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	id={api.triggerId}
	dir={api.dir}
	type="button"
	disabled={api.disabled}
	data-scope="collapsible"
	data-part="trigger"
	data-state={api.open ? 'open' : 'closed'}
	data-disabled={dataAttr(api.disabled)}
	data-slot="collapsible-trigger"
	aria-controls={api.contentId}
	aria-expanded={api.open}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented || api.disabled) return;
		api.toggle();
	}}
	class={cn(styles.trigger, className)}
>
	{@render children?.()}
</Element>
