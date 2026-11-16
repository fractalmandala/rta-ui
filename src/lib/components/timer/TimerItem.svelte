<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { TimerTimePart } from './timer.state.svelte';

	export interface TimerItemProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		type: TimerTimePart;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Timer.module.css';
	import { useTimerContext } from './timer.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		type,
		...props
	}: TimerItemProps = $props();

	const api = useTimerContext();
	const attrs = $derived(api.itemAttrs(type));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="timer"
	data-part="item"
	data-slot="timer-item"
	class={cn(styles.item, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<div {...api.itemLabelAttrs(type)} data-scope="timer" data-part="item-label" data-slot="timer-item-label" class={styles.itemLabel}>{type}</div>
		<div {...api.itemValueAttrs(type)} data-scope="timer" data-part="item-value" data-slot="timer-item-value" class={styles.itemValue}>{api.formattedTime[type]}</div>
	{/if}
</Element>
