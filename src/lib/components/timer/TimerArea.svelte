<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TimerAreaProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
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
		...props
	}: TimerAreaProps = $props();

	const api = useTimerContext();
	const attrs = $derived(api.areaAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="timer"
	data-part="area"
	data-slot="timer-area"
	class={cn(styles.area, className)}
>
	{@render children?.()}
</Element>
