<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { TimerApi } from './timer.state.svelte';

	export interface TimerRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: TimerApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Timer.module.css';
	import { setTimerContext } from './timer.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: TimerRootProviderProps = $props();

	const api = untrack(() => value);
	setTimerContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="timer"
	data-part="root"
	data-slot="timer-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
