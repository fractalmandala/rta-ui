<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TabsTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {
		value: string;
		disabled?: boolean;
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
		disabled,
		ref = $bindable(null),
		value,
		...props
	}: TabsTriggerProps = $props();

	const api = useTabsContext();
	const attrs = $derived(api.triggerAttrs(value, disabled));
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="tabs"
	data-part="trigger"
	data-slot="tabs-trigger"
	onfocus={() => api.setFocusedValue(value)}
	onblur={(event) => {
		if ((event.relatedTarget as globalThis.Element | null)?.getAttribute('role') === 'tab') return;
		api.blur();
	}}
	onclick={(event) => {
		if (event.defaultPrevented || disabled) return;
		api.setValue(value);
	}}
	class={cn(styles.trigger, className)}
>
	{@render children?.()}
</Element>
