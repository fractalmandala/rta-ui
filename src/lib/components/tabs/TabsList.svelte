<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TabsListProps
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
	}: TabsListProps = $props();

	const api = useTabsContext();
	const attrs = $derived(api.listAttrs());

	$effect(() => {
		api.registerList(ref);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="tabs"
	data-part="list"
	data-slot="tabs-list"
	onkeydown={(event) => {
		if (event.defaultPrevented) return;
		if (!event.currentTarget.contains(event.target as Node)) return;
		const vertical = api.orientation === 'vertical';
		const keys: Record<string, () => void> = {
			ArrowRight: () => (vertical ? undefined : api.moveFocus(1)),
			ArrowLeft: () => (vertical ? undefined : api.moveFocus(-1)),
			ArrowDown: () => (vertical ? api.moveFocus(1) : undefined),
			ArrowUp: () => (vertical ? api.moveFocus(-1) : undefined),
			Home: () => api.focusFirst(),
			End: () => api.focusLast()
		};
		const exec = keys[event.key];
		if (!exec) return;
		event.preventDefault();
		exec();
	}}
	class={cn(styles.list, className)}
>
	{@render children?.()}
</Element>
